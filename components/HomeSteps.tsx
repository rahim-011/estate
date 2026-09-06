


export default function HomeSteps(){
    const steps = [
        {title:'Search Homes',sub:'Find listings by location, price, and proprety type'},
        {title:'Schedule Tours',sub:'Book in-person or virtual proprety visits.'},
        {title:'Make Your Move',sub:'Apply or connect with agents to make your move.'},
    ]
    return(
        <div className="p-3 md:p-5 lg:p-10 flex flex-col gap-4">
            <div className="flex flex-col">
                <h3 className="text-black text-[1.3rem] font-semibold">How It Works</h3>
                <p className="text-[0.8rem] text-black/50">Easy steps to find, visit, and buy or rent your dream home.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4  self-center w-full p-3">
                {steps.map((step,index)=>(
                    <div className="flex flex-col items-center gap-3 border border-black/15 rounded-lg p-4 " key={index}>
                        <div className="rounded-full px-5 py-3 text-primary border border-2 flex items-center justify-center ">{index + 1}</div>
                        <h4 className="text-black font-semibold text-[1rem]">{step.title}</h4>
                        <p className="text-black/50 text-[0.8rem]">{step.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}