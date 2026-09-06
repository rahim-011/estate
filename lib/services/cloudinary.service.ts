'use server'

import { v2 as cloudinary } from "cloudinary";


export const deleteImagesFromCloudinary = async (urls: string[]) => {
  try{
    const publicIds= urls.map(url =>{
      const parts = url.split('/');
      const fileName = parts.pop() || '';
      return fileName.split('.')[0]
    })
    await cloudinary.api.delete_resources(publicIds);
  }
  catch(error){
    console.error("ACTUAL CLOUDINARY ERROR:", error);
    throw new Error('Faild to clean cloudinary!')
  }
};