import { ToursStatuses } from '@prisma/client'
import {create} from 'zustand'


export enum PropertieStatuses {
    active = 'active',
    pending = 'pending',
    expired = 'expired'
}


type UserStore = {
    switchPropertieStatus: (status:PropertieStatuses) => void,
    currentPropertieStatus: PropertieStatuses,
    switchTourStatus: (status:ToursStatuses) => void,
    currentTourStatus: ToursStatuses
}

export const useUserStore = create<UserStore>((set,get)=>({
    currentPropertieStatus: PropertieStatuses.active,
    currentTourStatus: ToursStatuses.pending,
    switchPropertieStatus: (status:PropertieStatuses) =>{
        set({currentPropertieStatus:status})
    },
    switchTourStatus: (status:ToursStatuses) =>{
        set({currentTourStatus:status})
    }
}))