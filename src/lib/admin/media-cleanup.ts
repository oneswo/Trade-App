"use client";

function normalizeTrackedUrls(urls: Iterable<string>) {
  return [...new Set(
    Array.from(urls).filter((url) => typeof url === "string" && url.startsWith("http"))
  )];
}

export async function cleanupTrackedMediaUrls(
  trackedUrls: Iterable<string>,
  retainedUrls: Iterable<string>,
  options?: { keepalive?: boolean }
) {
  const tracked = normalizeTrackedUrls(trackedUrls);
  if (tracked.length === 0) return;

  const retained = new Set(normalizeTrackedUrls(retainedUrls));
  const staleUrls = tracked.filter((url) => !retained.has(url));
  if (staleUrls.length === 0) return;

  try {
    const response = await fetch("/api/admin/media/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: staleUrls }),
      keepalive: options?.keepalive,
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      console.error("[media-cleanup] Failed to delete tracked media:", staleUrls, result);
    }
  } catch (error) {
    console.error("[media-cleanup] Failed to delete tracked media:", staleUrls, error);
  }
}
