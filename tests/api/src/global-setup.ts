import { API_URL } from "./helpers.js";

// Fail once, with a clear message, instead of every test timing out.
export default async function checkApiIsUp() {
  try {
    await fetch(`${API_URL}/tickets`);
  } catch {
    throw new Error(
      `The API is not reachable at ${API_URL}. Start the stack first: docker compose up -d`,
    );
  }
}
