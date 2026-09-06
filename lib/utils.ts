'use client'

import { PropertieStatuses } from "@/store/userStore"
import { clsx, type ClassValue } from "clsx"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { UserProperty } from "./services/user.service"
import { WilayaKey } from "./constants"
import { WILAYA_COORDS } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function BlockScroll(state: boolean){
  useEffect(()=>{
    if (state){
      document.body.style.overflow = 'hidden'
    }
    return () =>{
      document.body.style.overflow = ''
    }
  },[state])
}


export function scrollToTop(link:string){
  const pathname = usePathname();
  if (pathname === link){
     window.scrollTo(0,0);
  }
  return
}


export const fileToBase64 = (file:File): Promise<string> =>{
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  })
}


export function filterPropertiesByStatus (
    status:PropertieStatuses,userProperties:UserProperty[]
  ):UserProperty[]{
  return userProperties.filter((item) => item.status === status);
}

export function getWilayaCoords(wilayaName?: string): [number, number] {
  const defaultCenter: [number, number] = [36.7538, 3.0588]; 
  
  if (!wilayaName) return defaultCenter;

  const key = wilayaName
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_") as WilayaKey;

  return WILAYA_COORDS[key] || defaultCenter;
}