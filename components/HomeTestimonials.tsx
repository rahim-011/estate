import { Star, Quote } from "lucide-react"
import Image from "next/image"

export default function HomeTestimonials() {
    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Homebuyer",
            location: "Batna, 05",
            imageSrc: "/image/user.png",
            rate: 5,
            review: "I found my dream home in just a week. The search filters were incredibly precise and the agent communication was seamless throughout."
        },
        {
            name: "Marcus Vance",
            role: "Property Investor",
            location: "Algiers, 16",
            imageSrc: "/image/user.png",
            rate: 5,
            review: "Managing my tour requests and saving properties was effortless. This platform simplified what usually takes months into days."
        },
        {
            name: "Elena Rostova",
            role: "First-time Buyer",
            location: "Oran, 31",
            imageSrc: "/image/user.png",
            rate: 5,
            review: "The direct scheduling feature for property tours saved me so much time. Highly recommend to anyone looking for a stress-free experience."
        }
    ]

    return (
        <div className="flex flex-col gap-4 p-3 md:p-5 lg:p-10 w-full">
            <div className="flex flex-col gap-1">
                <h3 className="text-black font-semibold text-xl md:text-2xl">What Our Clients Say</h3>
                <p className="text-xs sm:text-sm text-black/60">Real stories from people who found their perfect place with us.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-stretch">
                {testimonials.map((testimonial, index) => (
                    <div 
                        key={index} 
                        className="relative bg-white rounded-2xl border border-black/10 p-5 sm:p-6 flex flex-col justify-between gap-4 hover:border-black/20 hover:shadow-xs transition-all duration-200"
                    >
                        <Quote className="absolute top-4 right-4 text-teal-700/10 w-8 h-8 pointer-events-none" />
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: testimonial.rate }).map((_, starIndex) => (
                                    <Star key={starIndex} className="fill-amber-400 text-amber-400" size={16} />
                                ))}
                            </div>
                            <p className="text-black/80 text-xs sm:text-sm leading-relaxed">
                                "{testimonial.review}"
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-black/5">
                            <div className="relative rounded-full h-10 w-10 overflow-hidden shrink-0 bg-gray-100">
                                <Image
                                    src={testimonial.imageSrc}
                                    alt={`${testimonial.name} profile photo`}
                                    fill
                                    sizes="40px"
                                    loading="eager"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-sm text-black font-semibold leading-tight">{testimonial.name}</h4>
                                <span className="text-[0.75rem] text-black/50">{testimonial.role} • {testimonial.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}