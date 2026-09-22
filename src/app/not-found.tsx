import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <p className="text-[11px] font-bold tracking-[0.3em] text-[#9a7420]">JAI JINENDRA COLLECTION</p>
      <h1 className="font-display font-black text-5xl mt-3">404</h1>
      <p className="text-neutral-500 mt-3">That page walked out of the store. The style you want is probably still on the rack.</p>
      <div className="flex flex-wrap gap-2 justify-center mt-7">
        <Link href="/" className="px-6 py-3 rounded-xl bg-black text-[#e8c877] text-[12px] font-extrabold tracking-wider">HOME</Link>
        <Link href="/shop" className="px-6 py-3 rounded-xl brand-bg text-black text-[12px] font-extrabold tracking-wider">SHOP COLLECTION</Link>
        <Link href="/search" className="px-6 py-3 rounded-xl border-2 border-black text-[12px] font-extrabold tracking-wider">SEARCH</Link>
      </div>
    </div>
  );
}
