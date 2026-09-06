import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";




export default function HomeOptions(){
    const exploringItems = [
        {title:'Buy a Home',sub:'Browse thousands of homes for sale',linkSub:'Explore to Buy',src:'/buy'},
        {title:'Sell a Home',sub:'List your property and reach potential buyers',linkSub:'List Your Home',src:'/sell'},
        {title:'Rent a Home',sub:'Find apartments and homes for rent',linkSub:'Explore Rentals',src:'/rent'},
    ]
    return(
        <div className="flex flex-col p-3 md:p-5 lg:p-10 w-full">
            <h2 className="text-black font-semibold text-[1.4rem]">Explore Your Options</h2>
            <p className="text-black/50 mb-5">Start your property journey here.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {exploringItems.map((item,index)=>(
                    <div className="flex flex-col gap-4 border border-black/10 rounded-lg  p-4" key={index}>
                        <div className="text-primary"><Home size={24}/></div>
                        <div className="flex flex-col">
                            <span className="text-black font-semibold text-[1.3rem]">{item.title}</span>
                            <p className="text-black/50 text-[0.8rem]">{item.sub}</p>
                        </div>
                        <Link href={item.src} className="text-[0.9rem] text-blue-500 hover:cursor-pointer hover:brightness-80 transition-colors ease-in flex items-center gap-2">{item.linkSub}<ArrowRight size={18}/></Link>
                    </div>
                ))}
            </div>
        </div>
    )
}