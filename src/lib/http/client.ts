export class HttpError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}

type FetchJsonOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  signal?: AbortSignal;
  cache?: RequestCache;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

export function isAbortLikeError(error: unknown) {
  return isAbortError(error);
}

function mergeSignals(signal?: AbortSignal, timeoutMs = 8000) {
  const controller = new AbortController();
  const timers: Array<ReturnType<typeof setTimeout>> = [];

  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else {
      const onAbort = () => controller.abort(signal.reason);
      signal.addEventListener("abort", onAbort, { once: true });
    }
  }

  const timer = setTimeout(() => controller.abort(new Error("Request timeout")), timeoutMs);
  timers.push(timer);

  return {
    signal: controller.signal,
    dispose: () => timers.forEach((item) => clearTimeout(item)),
  };
}

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const {
    method = "GET",
    headers,
    body,
    signal,
    cache = "no-store",
    timeoutMs = 8000,
    retries = 0,
    retryDelayMs = 300,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const { signal: mergedSignal, dispose } = mergeSignals(signal, timeoutMs);
    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: mergedSignal,
        cache,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new HttpError(`HTTP ${response.status}`, response.status, payload);
      }
      return payload as T;
    } catch (error) {
      lastError = error;
      if (isAbortError(error)) throw error;
      if (attempt >= retries) break;
      await sleep(retryDelayMs * Math.pow(2, attempt));
    } finally {
      dispose();
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}
