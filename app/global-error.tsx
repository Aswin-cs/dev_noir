"use client";

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex min-h-screen flex-col items-center justify-center p-4 font-mono">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold uppercase">Application Error</h2>
          <p className="text-xs text-zinc-400">
            An unexpected error occurred in the root runtime environment.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-white text-black font-semibold rounded-full text-xs hover:bg-zinc-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
