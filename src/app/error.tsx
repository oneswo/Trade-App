"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Root Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-[#111111] mb-3">
          Something went wrong
        </h2>
        <p className="text-sm text-[#111111]/50 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => unstable_retry()}
          className="rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/80 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
