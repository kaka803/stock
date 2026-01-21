
import { Check } from "lucide-react";
import Link from "next/link";

export default function AuthSidebar() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[440px] bg-black text-white dark:bg-white dark:text-black p-12 fixed top-4 left-4 bottom-4 z-50 pointer-events-none transition-colors duration-300" 
         style={{ clipPath: "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)" }}> 
         {/* 
           Updated Polygon for Top-Right and Bottom-Left chamfers:
           1. 0 0 (Top Left)
           2. 85% 0 (Top Edge, near Right) -> Start of TR Cut
           3. 100% 15% (Right Edge, near Top) -> End of TR Cut
           4. 100% 100% (Bottom Right) -> No Cut
           5. 15% 100% (Bottom Edge, near Left) -> Start of BL Cut
           6. 0 85% (Left Edge, near Bottom) -> End of BL Cut
         */}
      
     <div className="absolute inset-0 bg-black -z-10 dark:bg-white transition-colors duration-300" style={{ clipPath: "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)" }}></div>
     
     <div className="flex flex-col h-full justify-between pointer-events-auto">
      <div>
        <Link href="/" className="inline-block mb-5">
            <span className="text-3xl font-bold anta-regular tracking-wide">Logo</span>
        </Link>
        
        <h1 className="text-2xl font-medium leading-[1.15] mb-5 anta-regular">
          A platform for investors who take their investing seriously.
        </h1>

        <ul className="space-y-4 mb-5">
            {[
                "Multi-asset investing", 
                "AI-powered analysis", 
                "Trusted by millions"
            ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-md text-gray-300 dark:text-gray-700">
                    <div className="flex items-center justify-center w-5 h-5">
                       {/* Arrow icon */}
                       <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-45">
                            <path d="M2 10L10 2M10 2H4M10 2V8" className="stroke-white dark:stroke-black transition-colors duration-300" strokeWidth="1.5"/>
                        </svg>
                    </div>
                    {item}
                </li>
            ))}
        </ul>

        <div className="flex flex-wrap gap-2">
            {[
                "Stocks", "Options Trading", "Treasuries", "Bonds",
                "High-Yield Cash Account", "ETFs", "Crypto", "Bond Account"
            ].map((tag, i) => (
                <span key={i} className="bg-zinc-900 border border-zinc-800 text-gray-300 dark:bg-gray-100 dark:border-gray-200 dark:text-gray-800 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors duration-300">
                    {tag === "High-Yield Cash Account" ? (
                        <>
                         {tag} <span className="bg-zinc-700 text-[9px] px-1 rounded ml-1 text-white dark:bg-zinc-300 dark:text-black">NEW</span>
                        </>
                    ) : tag === "Bond Account" ? (
                         <>
                         {tag} <span className="bg-zinc-700 text-[9px] px-1 rounded ml-1 text-white dark:bg-zinc-300 dark:text-black">SOON</span>
                        </>
                    ) : (
                        <>
                         <Check size={10} className="text-gray-500 dark:text-gray-400" /> {tag}
                        </>
                    )}
                </span>
            ))}
        </div>
      </div>

      <div className="mt-4 text-[10px] text-zinc-600 dark:text-zinc-500 leading-relaxed">
        <p className="font-bold mb-1">Disclosures</p>
        <p>
          All investing involves risk, including loss of principal. See public.com/disclosures-main for more information. APY is variable and subject to change. See full disclosures at public.com/hys. This yield is the current average annualized yield to worst (YTW) across all ten bonds in the Bond Account, before fees. See full disclosure at public.com/bond-account.
        </p>
      </div>
     </div>
    </div>
  );
}
