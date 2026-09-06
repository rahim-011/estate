import Link from "next/link";
import { rockSalt } from "@/lib/fonts";
import ProfileIcon from "./ProfileIcon";
import MobileMenu from "./MobileMenu";
import { getCachedUser } from "@/lib/services/user.service";

export default async function NavBar() {
    const user = await getCachedUser() as {id:string,image:string,role:'admin' | 'user'} | undefined;

    const navLinks = [
        { title: 'Buy', src: '/buy' },
        { title: 'Rent', src: '/rent' },
        { title: 'Contact Us', src: '/contact' },
        { title: 'About Us', src: '/about' }
    ];

    return (
        <header className="flex items-center justify-between px-6 py-4 fixed top-0 left-0 z-40 w-full scroll-nav">
            <Link href="/" className={`text-white ${rockSalt.className} antialiased`}>
                ESTATEA
            </Link>

            <nav className="hidden md:block">
                <ul className="flex items-center gap-6">
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            <Link 
                                href={link.src} 
                                className="text-white/90 hover:text-white transition-colors text-sm font-medium"
                            >
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
                <Link
                    href="/sell"
                    className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-white/15 border border-white/30 rounded-full hover:bg-white/25 transition-all shadow-sm backdrop-blur-sm"
                >
                    List Property
                </Link>

                {user?.id ? (
                    <ProfileIcon userId={user?.id} avatar={user.image} userRole={user.role}/>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link 
                            href='/sign-in' 
                            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-white !text-primary hover:bg-gray-100 transition-all "
                        >
                            Login
                        </Link>
                        <Link 
                            href='/sign-up' 
                            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-primary text-white hover:brightness-110 transition-all shadow-md"
                        >
                            Sign up
                        </Link>
                    </div>
                )}

                <MobileMenu userId={user?.id} userRole={user?.role}/>
            </div>
        </header>
    );
}