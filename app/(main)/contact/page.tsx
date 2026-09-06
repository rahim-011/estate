import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";




export default function contactUs(){
    const contactMethods = [
        {icon:<MapPin size={18} className="text-primary"/>,title:'Location',sub:'4140 Parker Rd. Allentown, New Mexico 31134'},
        {icon:<Phone size={18} className="text-primary"/>,title:'Phone Number',sub:'(214) 550533532'},
        {icon:<Share2 size={18} className="text-primary"/>,title:'Follow Us',sub:[
            {socialIcon:'/image/fb.png',socialLink:'#'},
            {socialIcon:'/image/instagram.png',socialLink:'#'},
            {socialIcon:'/image/x.png',socialLink:'#'},
            {socialIcon:'/image/linkedin.png',socialLink:'#'}
        ]}
    ]
    return(
        <main className="min-h-screen flex flex-col gap-10">
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 h-20"></div>
            <div className="p-3 md:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="flex flex-col gap-5 p-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-black text-2xl md:text-3xl font-semibold">Get in Touch</h2>
                        <p className="text-black/50 text-[0.8rem] md:text-[0.9rem]">At ESTATEA, we help you buy, sell,rent, and invest in properties with confidence and local expertise.</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {contactMethods.map((method,index)=>(
                            <div key={index} className="flex items-center gap-3 rounded-lg border border-black/15 shadow p-3">
                                <div className="p-3 rounded-lg bg-blue-200/40">
                                    {method.icon}
                                </div>
                                <div className="flex flex-col gap-2 p-3">
                                    <span className="text-black/50 text-[0.8rem]">{method.title}</span>
                                    {typeof method.sub == 'string' ? 
                                        (<span className="text-black text-[0.9rem]">
                                            {method.sub}
                                        </span>)
                                        :(
                                            <span className="flex items-center gap-4">
                                                {method.sub.map((p,index)=>(
                                                    <Link href={p.socialLink} className="h-auto w-auto hover:scale-105 transition-all" key={index}>
                                                        <Image
                                                            src={p.socialIcon}
                                                            alt={p.socialIcon.split('/')[2].split('.')[1]}
                                                            height={20}
                                                            width={20}
                                                            />
                                                    </Link>
                                                ))}
                                            </span>
                                        )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <ContactForm/>
            </div>
        </main>
    )
}