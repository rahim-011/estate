'use server'

import { contactSchema } from "@/schemas/contactSchema";
import { prisma } from "../prisma";
import type { ContactFormValues } from "@/components/ContactForm";




export async function handleContactForm(data:ContactFormValues){
    const validation = contactSchema.safeParse(data);
    if (!validation.success){
        return {
            success:false,
            error: 'Invalid contact data'
        }
    }
    const {name,email,phoneNumber,message} = data;
    try{
        await prisma.contacts.create({
            data:{
                name: name,
                email: email,
                message: message,
                phone: phoneNumber
            }
        })

        return {
            success:true,
            message: 'Contact infos has been saved successfully'
        }
    }   
    catch(error){
        console.log(error);
        return{
            error:'Internal server error',
            success:false
        }
    }
}