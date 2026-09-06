import Image from "next/image";
import {Medal, ThumbsUpIcon, Users} from 'lucide-react'



export default function AboutUs(){
    const ourFeatures = [
        {title:'Committed Team',icon:<Users size={18}/>,sub:"Dedicated professionals guiding you seamlessly through every step of your property journey."},
        {title:'Industry Experts',icon:<Medal size={18}/>,sub:"Deep market knowledge ensuring informed decisions and maximum value for your investment."},
        {title:'Our Advantages',icon:<ThumbsUpIcon size={18}/>,sub:"Transparent service, personalized strategies, and access to top-tier property listings."},
        {title:'Experienced Agents',icon:<Users size={18}/>,sub:"Seasoned specialists driven by a proven track record of successful transactions."},
    ]
    const ourAgents = [
        {work: 'Residential Specialist', fullName: 'Leasie Willions', sub: 'Specializing in modern residential properties, Leasie brings over a decade of local market expertise to help you find your ideal home.', imageSrc: '/image/agent4.jpg'},
        {work: 'Homebuyer Specialist', fullName: 'Johnson Watson', sub: 'Passionate about seamless property transactions, Johnson focuses on guiding first-time buyers through a stress-free journey.', imageSrc: '/image/agent2.jpg'},
        {work: 'Luxury Real Estate Specialist', fullName: 'Mark Allen', sub: 'Expert in high-end real estate and strategic negotiation, Mark is dedicated to maximizing value for every client.', imageSrc: '/image/agent3.jpg'}
    ];
    return(
        <main className="min-h-screen flex flex-col gap-4 ">
            <div className="relative h-[500px] w-full overflow-hidden">
                <Image
                    alt="hero image"
                    src="/image/about.jpg"
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="flex flex-col gap-1 p-3 md:p-6 lg:p-10 items-center text-center">
                <h2 className="text-3xl text-black font-semibold">We are on a mission to change the view of real estate field</h2>
                <p className="text-black/50 text-[0.8rem]">We are redefining the property market through transparency, modern innovation, and a client-first approach.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 md:p-6 lg:p-10">
                {ourFeatures.map((feature,index)=>(
                    <div className="flex flex-col gap-3 rounded-lg border border-black/15 p-3" key={index}>
                        <div className="rounded-lg p-3 bg-primary/20 self-start text-primary">{feature.icon}</div>
                        <h3 className="text-black font-semibold text-[1rem]">{feature.title}</h3>
                        <p className="text-black/50 text-[0.8rem]">{feature.sub}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-4 p-3 md:p-6 lg:p-10">
                <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-semibold text-black">Our Agents</h3>
                    <p className="text-black/50 text-[0.8rem]">Meet our team of trusted experts ready to guide you through every step of your real estate journey.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ourAgents.map((agent,index)=>(
                        <div className={`flex flex-col gap-4 p-3 border border-black/15 rounded-lg shadow ${index == 1 ? 'flex-col-reverse' : ''}`} key={index}>
                            <div className="relative w-full h-65">
                                <Image
                                    src={agent.imageSrc}
                                    alt="agent image"
                                    fill
                                    loading="eager"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="text-black font-semibold text-[1rem]">{agent.fullName}</h4>
                                <span className="text-[0.8rem] text-black/50">{agent.work}</span>
                                <p className="text-[0.8rem] text-black/85">{agent.sub}</p>
                            </div>
                        </div>
                    ))} 
                </div>
            </div>
        </main>
    )
}