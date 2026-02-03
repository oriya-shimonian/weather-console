// export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
//   const res = await fetch(input, {
//     ...init,
//     headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
//   });

//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
//   }

//   return res.json() as Promise<T>;
// }

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
      // not json
    }

    const message = payload?.error?.message ?? `Request failed (${res.status})`;
    const code = payload?.error?.code ?? "HTTP_ERROR";
    throw new ApiError(message, res.status, code);
  }

  return (await res.json()) as T;
}
