import { describe, it, expect } from "vitest";
import routes from "./routes";

describe("route config", () => {
  it("registers /status", () => {
    expect(routes).toContainEqual(
      expect.objectContaining({ path: "status", file: "routes/status.tsx" }),
    );
  });
});
