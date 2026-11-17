import {randomUUID} from "node:crypto";
import {beforeAll, describe, expect, it} from "vitest";
import {api, createTicket, createUser, Priority, Status, type TestUser} from "./helpers.js";

interface TicketResponse {
    id: number;
    status: number;
    priority: number;
}

interface CommentResponse {
    id: number;
    body: string;
    authorName: string;
}

interface RecentActivityResponse {
    recentActivity: {
        title: string;
        fieldName: string;
        oldValue: string;
        newValue: string;
        changedAt: string;
    }[];
}

// The API returns UTC dates without a trailing "Z" (EF reads MySQL datetimes as
// DateTimeKind.Unspecified). Without the Z, JavaScript would parse them as local time.
function parseUtc(date: string): Date {
    return new Date(date.endsWith("Z") ? date : `${date}Z`);
}

describe("Tickets API (KAN-76 regressions)", () => {
    let customer: TestUser;
    let agent: TestUser;

    beforeAll(async () => {
        customer = await createUser("Customer");
        agent = await createUser("Agent");
    });

    it("saves a status change made by an agent", async () => {
        // Bug: the Update action logged the status change but never assigned it.
        const ticketId = await createTicket(customer);

        const update = await api("PUT", `/tickets/${ticketId}`, {
            token: agent.token,
            body: {status: Status.InProgress},
        });
        expect(update.status).toBe(200);

        const {body: ticket} = await api<TicketResponse>("GET", `/tickets/${ticketId}`, {
            token: agent.token,
        });
        expect(ticket.status).toBe(Status.InProgress);
    });

    it("saves a comment", async () => {
        // Bug: Comment had a copied ChangedBy relationship whose required foreign key
        // was never set, so MySQL rejected every insert and the API returned 500.
        const ticketId = await createTicket(customer);

        const created = await api<CommentResponse>("POST", `/tickets/${ticketId}/comments`, {
            token: customer.token,
            body: {body: "Regression test comment"},
        });
        expect(created.status).toBe(201);
        expect(created.body).toMatchObject({
            body: "Regression test comment",
            authorName: "Test Customer",
        });

        const {body: comments} = await api<CommentResponse[]>("GET", `/tickets/${ticketId}/comments`, {
            token: customer.token,
        });
        expect(comments.map((c) => c.id)).toContain(created.body.id);
    });

    it.each(Object.entries(Priority))("keeps priority %s (%i) as created", async (_name, priority) => {
        // Bug: HasDefaultValue(Medium) made EF treat Low (0, the C# default) as "not set",
        // so it left the column out of the INSERT and MySQL filled in 'Medium'.
        const ticketId = await createTicket(customer, {priority});

        const {body: ticket} = await api<TicketResponse>("GET", `/tickets/${ticketId}`, {
            token: customer.token,
        });
        expect(ticket.priority).toBe(priority);
    });

    it("dates audit log entries with the time of the change", async () => {
        // Bug: LogChange never set ChangedAt, so every entry was dated 0001-01-01.
        // A unique title lets us find this test's entry in the shared activity feed.
        const title = `Audit date test ${randomUUID()}`;
        const ticketId = await createTicket(customer, {title});

        const before = Date.now();
        await api("PUT", `/tickets/${ticketId}`, {
            token: agent.token,
            body: {status: Status.Resolved},
        });
        const after = Date.now();

        const {body} = await api<RecentActivityResponse>("GET", "/dashboard/recent-activity", {
            token: agent.token,
        });
        // The feed is the latest 10 entries by date, so with the bug back
        // (dated year 1) this entry would drop out of it and the find fails.
        const entry = body.recentActivity.find((a) => a.title === title && a.fieldName === "Status");
        expect(entry, "status change should be in the recent activity feed").toBeDefined();
        expect(entry).toMatchObject({oldValue: "Open", newValue: "Resolved"});

        // A few seconds either side allows for clock drift between Docker and the host.
        const changedAt = parseUtc(entry!.changedAt).getTime();
        expect(changedAt).toBeGreaterThanOrEqual(before - 5_000);
        expect(changedAt).toBeLessThanOrEqual(after + 5_000);
    });
});
