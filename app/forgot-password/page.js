
import Link from "next/link";
import AuthSidebar from "@/components/AuthSidebar";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black relative transition-colors duration-300"> 
      {/* 
         To truly mimic the 'modal' over the login page as per the image (Image 2),
         the background should ideally resemble the Login page visually but dimmed.
         Since this is a separate route, I can't easily show the actual Login component behind it without duplication.
         However, setting a dark background or a blurred image background helps.
         Let's use a dark background to make the white card pop, consistent with the image.
      */}
      <AuthSidebar />
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:ml-[440px] bg-white/50 dark:bg-black/50 backdrop-blur-sm">
         {/* Use a dark overlay over the 'content' area to simulate the modal focus */}
        
        <div className="max-w-[500px] w-full bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-2xl relative transition-colors duration-300">
             {/* Note: The image shows a specific shape for the modal too? No, usually just rounded. */}
             
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Forgot your password?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Enter the email associated with your account. We'll send you a link to reset your password.
            </p>

            <form className="space-y-6">
                <div>
                     <label htmlFor="email" className="sr-only">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="Email Address" 
                        className="w-full bg-gray-100 dark:bg-zinc-800 border-none rounded-lg px-4 py-4 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <button type="submit" className="w-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-black dark:text-white font-semibold py-3 px-4 rounded-full text-base transition-colors">
                        Send
                    </button>
                    <Link href="/login" className="w-full block text-center bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-black dark:text-white font-semibold py-3 px-4 rounded-full text-base transition-colors">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
