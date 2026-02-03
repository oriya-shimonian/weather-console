/**
 * A typed error thrown by the API layer.
 * - `status`: HTTP status code (0 for network / fetch failures)
 * - `code`: optional app-level error code (if provided by the backend)
 */

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Minimal JSON HTTP helper.
 *
 * Behavior:
 * - Always sends `Content-Type: application/json` (can be overridden via `init.headers`)
 * - Throws `ApiError` on network errors (`status = 0`, `code = "NETWORK"`)
 * - On non-2xx responses, attempts to parse `{ error: { message, code } }` (best-effort)
 * - On success, parses and returns JSON as `T`
 */

export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(input, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
  } catch {
    throw new ApiError("Network error. Please check your connection.", 0, "NETWORK");
  }

  if (!res.ok) {
    let payload: any = null;
    try {
      payload = await res.json();
    } catch {
      // intentionally ignored- not json
    }

    const message = payload?.error?.message ?? `Request failed (${res.status})`;
    const code = payload?.error?.code ?? "HTTP_ERROR";
    throw new ApiError(message, res.status, code);
  }

  return (await res.json()) as T;
}
