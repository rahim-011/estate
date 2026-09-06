


import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { features } from "process";



export default function Sell(){
    const sellingSteps = [
        {title:'Step 1',sub:'Create Your Account'},
        {title:'Step 2',sub:'Add Property Details'},
        {title:'Step 3',sub:'Upload Photos & Pricing'},
        {title:'Step 4',sub:'Publish & Manage Offers'}
    ]

    const ourFeatures = [
        {title:'Wide Reach',sub:'Listed across top platforms and seen by qualified buyers.'},
        {title:'Fast Listing',sub:'Create a listing in minutes'},
        {title:'Expert Support',sub:'Work with licensed agents or list independently'},
        {title:'Real-Time Analytics',sub:'Track views, intrest, and offers.'}
    ]
    return(
        <main className="flex flex-col gap-4">
            <div className="relative top-0 left-0 w-full h-70">
                <Image
                alt="home image"
                src='/image/sellHouse2.jpg'
                loading="eager"
                fill
                className="object-cover"
                />
            </div>
            <div className="flex flex-col gap-5 p-3 md:p-6 lg:p-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl text-black font-semibold">Sell Your Home with Confidence</h1>
                    <p className="text-[0.8rem] text-black/90">Reach thousands of serious buyers and close faster</p>
                    <Link href='/sell/sell-details' className="bg-primary px-4 py-2 rounded-lg text-white font-semibold self-start my-6 hover:brightness-110 transition-all">Get Started</Link>
                </div>
                <div className="flex flex-col gap-3">
                    <h2 className="text-black font-semibold text-[1rem]">How It Works</h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                        <div className="relative h-90 w-full rounded-lg">
                            <Image
                                src='/image/sellHouse.jpg'
                                alt="home image"
                                loading="eager"
                                fill
                                sizes="100vw"
                                className="object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-3 p-3">
                            {sellingSteps.map((step,index)=>(
                                <div className="flex flex-col gap-1  border-l-2 border-l-primary p-3 shadow h-full" key={index}>
                                    <span className="text-[0.7rem] font-semibold text-primary">{step.title}</span>
                                    <span className="text-black text-[0.8rem]">{step.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 mt-3">
                    <h3 className="text-black font-semibold text-[1.2rem]">Why Sell With Us</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ourFeatures.map((feature,index)=>(
                            <div className="flex items-center gap-4 border border-black/15 rounded-lg p-3" key={index}>
                                <div className="text-primary self-center"><Home size={24}/></div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="">{feature.title}</h4>
                                    <p className="text-black/50 text-[0.8rem]">{feature.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}