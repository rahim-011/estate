
import { getCachedUser } from "@/lib/services/user.service";
import AccountSettingsForm from "@/components/AccountSettingsForm";


export default async function Settings() {
    const user = await getCachedUser();
    if (!user){
        return null
    }
    return (
        <AccountSettingsForm user={user}/>
    );
}