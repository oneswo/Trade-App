"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 400, padding: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#111" }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
              {error.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => unstable_retry()}
              style={{
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "#111",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
