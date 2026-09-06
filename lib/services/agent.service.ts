'use server'

import { verifyUserSession } from "./user.service"




export const getAgents = async () =>{
    try{
        const session = await verifyUserSession();
        const agents = await prisma?.agent.findMany({
            select:{
                id:true,
                name:true,
                image:true,
                email:true
            }
        })
        if (!agents){
            return{
                success:false,
                error:'Failed to get the agents!'
            }
        }
        return{
            success:true,
            agents
        }
    }   
    catch(error){
        return {
            success:false,
            error:'Internal server error'
        }
    }
}
export type AgentsList = Awaited<
    ReturnType<typeof getAgents>
>['agents']