"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center font-mono">
      <h2 className="text-xl font-bold uppercase mb-2 text-white">Something went wrong</h2>
      <p className="text-xs text-zinc-400 mb-4 max-w-sm">
        An unhandled exception occurred in the component hierarchy.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-white text-black font-semibold rounded-full text-xs hover:bg-zinc-200 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
