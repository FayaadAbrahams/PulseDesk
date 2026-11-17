-- PulseDesk demo data for local Docker. Runs once, after init.sql, on an empty data volume.
-- Reset with: docker compose down -v && docker compose up -d
--
-- Demo logins (local development only). Every account uses the password: PulseDesk-demo-1
--   Admin     naledi@pulsedesk.test
--   Agent     ryan@pulsedesk.test
--   Agent     aisha@pulsedesk.test
--   Customer  sipho@example.test
--   Customer  megan@example.test
--   Customer  tariq@example.test
--
-- Dates are relative to the first start (UTC), so the data always looks recent.
-- Audit values use the same format as TicketsController.LogChange.

SET @now = UTC_TIMESTAMP(6);
SET @pw = '$2a$11$JmeEZ/Pattd0g1JaqimpAe8NCWqf6L.xrLBQj4OBvs3z8dEX0.kyC';

INSERT INTO `Users` (`Id`, `FullName`, `Email`, `PasswordHash`, `Role`, `CreatedAt`, `IsActive`) VALUES
    (1, 'Naledi Mokoena', 'naledi@pulsedesk.test', @pw, 'Admin',    @now - INTERVAL 30 DAY, TRUE),
    (2, 'Ryan Jacobs',    'ryan@pulsedesk.test',   @pw, 'Agent',    @now - INTERVAL 30 DAY, TRUE),
    (3, 'Aisha Patel',    'aisha@pulsedesk.test',  @pw, 'Agent',    @now - INTERVAL 28 DAY, TRUE),
    (4, 'Sipho Ndlovu',   'sipho@example.test',    @pw, 'Customer', @now - INTERVAL 20 DAY, TRUE),
    (5, 'Megan van Wyk',  'megan@example.test',    @pw, 'Customer', @now - INTERVAL 15 DAY, TRUE),
    (6, 'Tariq Davids',   'tariq@example.test',    @pw, 'Customer', @now - INTERVAL 12 DAY, TRUE);

INSERT INTO `Tickets` (`Id`, `Title`, `Description`, `Status`, `Priority`, `CustomerId`, `AgentId`, `CreatedAt`, `UpdatedAt`) VALUES
    (1, 'Can''t log in after resetting my password',
        'I reset my password this morning and the new one is rejected. The reset email said it worked.',
        'InProgress', 'High', 4, 2, @now - INTERVAL 3 DAY, @now - INTERVAL 2 DAY),
    (2, 'Invoice shows the wrong VAT amount',
        'My October invoice charges VAT at 14%. It should be 15%.',
        'Resolved', 'Medium', 5, 3, @now - INTERVAL 6 DAY, @now - INTERVAL 4 DAY),
    (3, 'Export to CSV button does nothing',
        'On the reports page the Export button does nothing in Chrome or Edge.',
        'Open', 'Low', 6, NULL, @now - INTERVAL 1 DAY, @now - INTERVAL 1 DAY),
    (4, 'Email notifications arrive hours late',
        'Ticket update emails reach me 3 to 4 hours after the change.',
        'InProgress', 'Medium', 4, 3, @now - INTERVAL 2 DAY, @now - INTERVAL 1 DAY),
    (5, 'Please add a dark mode',
        'I work late and the white screens are hard on the eyes.',
        'Open', 'Low', 5, NULL, @now - INTERVAL 5 HOUR, @now - INTERVAL 5 HOUR),
    (6, 'Account locked after three failed attempts',
        'I mistyped my password three times and now the account is locked.',
        'Closed', 'High', 6, 2, @now - INTERVAL 9 DAY, @now - INTERVAL 8 DAY),
    (7, 'Dashboard is slow on mobile data',
        'The dashboard takes about 20 seconds to load on my phone when I am not on Wi-Fi.',
        'Open', 'Medium', 4, NULL, @now - INTERVAL 2 HOUR, @now - INTERVAL 2 HOUR),
    (8, 'Charged twice for one payment',
        'My card was debited twice for the same invoice on the 3rd.',
        'Resolved', 'High', 5, 2, @now - INTERVAL 4 DAY, @now - INTERVAL 3 DAY);

INSERT INTO `Comments` (`TicketId`, `UserId`, `Body`, `CreatedAt`) VALUES
    (1, 2, 'Thanks Sipho. I can see the reset went through. Can you try again in a private browser window?', @now - INTERVAL 2 DAY - INTERVAL 3 HOUR),
    (1, 4, 'Same result in a private window.', @now - INTERVAL 2 DAY - INTERVAL 1 HOUR),
    (1, 2, 'Found it: an old session is overriding the new password. Fix is being tested.', @now - INTERVAL 2 DAY),
    (2, 3, 'You''re right, the October run used the old rate. A corrected invoice is on its way.', @now - INTERVAL 5 DAY),
    (2, 5, 'Got it, thank you.', @now - INTERVAL 4 DAY),
    (4, 3, 'We''ve traced the delay to the email queue and are looking at it now.', @now - INTERVAL 1 DAY),
    (6, 2, 'Unlocked. You can log in again.', @now - INTERVAL 8 DAY - INTERVAL 6 HOUR),
    (8, 2, 'The second debit has been refunded. It will show in 3 to 5 working days.', @now - INTERVAL 3 DAY);

INSERT INTO `AuditLogs` (`FieldName`, `TicketId`, `ChangedByUserId`, `OldValue`, `NewValue`, `ChangedAt`) VALUES
    -- 1: assigned, started, priority raised
    ('AgentId',  1, 1, 'Unassigned', '2',          @now - INTERVAL 3 DAY + INTERVAL 1 HOUR),
    ('Status',   1, 2, 'Open',       'InProgress', @now - INTERVAL 2 DAY - INTERVAL 4 HOUR),
    ('Priority', 1, 2, 'Medium',     'High',       @now - INTERVAL 2 DAY - INTERVAL 4 HOUR),
    -- 2: assigned, started, resolved
    ('AgentId',  2, 1, 'Unassigned', '3',          @now - INTERVAL 6 DAY + INTERVAL 2 HOUR),
    ('Status',   2, 3, 'Open',       'InProgress', @now - INTERVAL 5 DAY - INTERVAL 1 HOUR),
    ('Status',   2, 3, 'InProgress', 'Resolved',   @now - INTERVAL 4 DAY),
    -- 4: assigned, started
    ('AgentId',  4, 1, 'Unassigned', '3',          @now - INTERVAL 2 DAY + INTERVAL 1 HOUR),
    ('Status',   4, 3, 'Open',       'InProgress', @now - INTERVAL 1 DAY),
    -- 6: assigned, resolved, closed
    ('AgentId',  6, 1, 'Unassigned', '2',          @now - INTERVAL 9 DAY + INTERVAL 1 HOUR),
    ('Status',   6, 2, 'Open',       'Resolved',   @now - INTERVAL 8 DAY - INTERVAL 6 HOUR),
    ('Status',   6, 1, 'Resolved',   'Closed',     @now - INTERVAL 8 DAY),
    -- 8: assigned, started, resolved
    ('AgentId',  8, 1, 'Unassigned', '2',          @now - INTERVAL 4 DAY + INTERVAL 1 HOUR),
    ('Status',   8, 2, 'Open',       'InProgress', @now - INTERVAL 4 DAY + INTERVAL 2 HOUR),
    ('Status',   8, 2, 'InProgress', 'Resolved',   @now - INTERVAL 3 DAY);
