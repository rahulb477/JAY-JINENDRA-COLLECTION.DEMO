"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <p className="text-[11px] font-bold tracking-[0.3em] text-[#9a7420]">JAI JINENDRA COLLECTION</p>
      <h1 className="font-display font-extrabold text-3xl mt-3">Something went wrong</h1>
      <p className="text-sm text-neutral-500 mt-2">Your bag and wishlist are still saved on this device. Please try again.</p>
      <button onClick={reset} className="mt-6 px-8 py-3.5 rounded-xl bg-black text-[#e8c877] font-extrabold text-[13px] tracking-wider">
        TRY AGAIN
      </button>
    </div>
  );
}
