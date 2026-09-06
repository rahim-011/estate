import LoadingSpinner from "@/components/LoadingSpinner";
import UserContactInfos from "@/components/UserContactInfos";
import UserProfile from "@/components/UserProfile";
import UserProperties from "@/components/UserProperties";
import UserTours from "@/components/UserTours";
import { getUserTours } from "@/lib/services/tour.service";
import { getCachedContactInfos, getCachedUser, getUserProperties} from "@/lib/services/user.service";
import { Suspense } from "react";



export default async function Profile(){
    const [userContactInfos,user,userPropertiesRes,userToursRes] = await Promise.all([
        getCachedContactInfos(),
        getCachedUser(),
        getUserProperties(),
        getUserTours(),
    ])
    const {userProperties} = userPropertiesRes;
    const {userTours} = userToursRes;
    if (!user || !userContactInfos){
        return null
    }
    return(
        <main className="min-h-screen  flex flex-col gap-10">
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 h-20"></div>
            <div className="p-4 md:p-6 lg:p-10 flex flex-col gap-4">
                <h1 className="text-3xl text-black font-semibold">Profile Settings</h1>
                <div className="flex flex-col gap-5">
                    <UserProfile user={user}/>
                    <UserContactInfos userContactInfos={userContactInfos}/>
                    <Suspense fallback={<LoadingSpinner/>}>
                        <UserProperties userProperties={userProperties }/>
                        <UserTours userTours={userTours ?? []}/>
                    </Suspense> 
                </div>
            </div>
        </main>
    )
}