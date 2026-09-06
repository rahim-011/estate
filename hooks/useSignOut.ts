import { authClient } from "@/lib/auth-client";
import { cleanUserCache } from "@/lib/services/user.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";




export function useSignOut(){
    const router = useRouter();
    const handleSignOut = async (userId:string) => {
        const toastId = toast.loading('Signing out...');
        try{
            if (userId){
                const result = await cleanUserCache(userId,'/');
                if (!result.success){
                    toast.error('SignOut failed');
                    return;
                }
            }
            const {error} = await authClient.signOut();
            if (error){
                toast.error(error?.message,{id:toastId});
                return;
            }
            toast.success('Sign-Out successfully',{id:toastId});
            router.push('/sign-in');
            router.refresh();
        }
        catch(error){
            toast.error('An unexpected error occured',{id:toastId});
        }
        
    }
    return {handleSignOut}
}