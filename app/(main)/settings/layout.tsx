import SettingsNavSide from "@/components/SettingsNavSide";
import SettingsNavMobile from "@/components/MobileSettingsNavSide";

export default function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="relative min-h-screen flex flex-col lg:flex-row items-start gap-6 lg:gap-12 mt-20 p-4 md:p-6 lg:p-10">
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 h-18 fixed top-0 left-0 w-screen -z-10"></div>
            
            <SettingsNavMobile />
            <SettingsNavSide />

            <div className="flex-1 w-full">
                {children}
            </div>
        </main>
    );
}