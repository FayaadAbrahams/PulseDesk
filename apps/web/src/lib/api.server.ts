const DEFAULT_API_URL = "http://localhost:5286";

// Read per request (not at module load) so the URL can differ per environment.
export function apiUrl(path: string): string {
  const baseUrl = process.env.API_URL ?? DEFAULT_API_URL;
  return `${baseUrl}/api${path}`;
}
