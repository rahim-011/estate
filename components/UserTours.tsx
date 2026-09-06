'use client'

import { UserTourItem } from "@/lib/services/tour.service";
import ToursStatusSwitches from "./ToursStatusSwitches";
import ShowProfileTours from "./ShowProfileTours";
import EmptyProfileTours from "./EmptyProfileTours";
import { useUserStore } from "@/store/userStore";
import { CalendarCheck2, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function UserTours({ userTours }: { userTours: UserTourItem[] }) {
    const { currentTourStatus } = useUserStore();
    const filteredTours = (userTours ?? []).filter(
        (tour) => tour.status === currentTourStatus
    );
    const title =
        currentTourStatus === "confirmed"
            ? "No Confirmed Tours"
            : currentTourStatus === "pending"
            ? "No Pending Requests"
            : currentTourStatus === "completed"
            ? "No Completed Tours"
            : currentTourStatus === "cancelled"
            ? "No Cancelled Tours"
            : "No Tours Found";

    const description =
        currentTourStatus === "confirmed"
            ? "You don't have any confirmed property tours scheduled at the moment."
            : currentTourStatus === "pending"
            ? "There are no tour requests waiting for host approval."
            : currentTourStatus === "completed"
            ? "You haven't completed any property tours yet."
            : currentTourStatus === "cancelled"
            ? "None of your property tours have been cancelled or declined."
            : "There are no tour records available in this section.";

    const icon =
        currentTourStatus === "confirmed"
            ? CalendarCheck2
            : currentTourStatus === "pending"
            ? Clock
            : currentTourStatus === "completed"
            ? CheckCircle2
            : XCircle;

    const actionLabel = currentTourStatus === "confirmed" ? "Browse Properties" : undefined;
    const actionHref = currentTourStatus === "confirmed" ? "/buy" : undefined;

    return (
        <div className="flex flex-col gap-4 w-full mt-3">
            <h3 className="text-black font-semibold text-[1.2rem]">My Tours</h3>
            
            <div className="flex flex-col gap-4 w-full">
                <ToursStatusSwitches />
                {filteredTours.length > 0 ? (
                    <ShowProfileTours userTours={filteredTours ?? []} />
                ) : (
                    <EmptyProfileTours
                        title={title}
                        description={description}
                        icon={icon}
                        actionLabel={actionLabel}
                        actionHref={actionHref}
                    />
                )}       
            </div>
        </div>
    );
}