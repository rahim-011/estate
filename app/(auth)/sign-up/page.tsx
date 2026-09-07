import { rockSalt } from "@/lib/fonts";
import SignUpForm from "@/components/SignUpForm";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <Image
                src="/image/authIMG.jpg"
                alt="Background"
                fill
                priority
                className="object-cover -z-10"
            />
            <div className="absolute inset-0 bg-black/15 -z-10" />

            <Link 
                href='/' className={`${rockSalt.className} absolute top-6 left-6 sm:top-8 sm:left-8 text-2xl sm:text-3xl font-bold text-white tracking-wide select-none z-10 cursor-pointer`}
                
            >
                ESTATEA
            </Link>

            <div className="z-10 w-full flex justify-center mt-12 sm:mt-0">
                <SignUpForm/>
            </div>
        </main>
    );
}