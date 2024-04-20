import { NextResponse } from "next/server";
import { PutObjectAclCommand, PutObjectCommand, PutObjectCommandInput, S3Client} from "@aws-sdk/client-s3";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export interface S3Response {
  imageUrl?:String;
  error?:String;
  success?:boolean;
}


export const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_S3_REGION as string,
    credentials:{
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY as string,
    }
});
 const uploadFileToS3 = async (file:Buffer,fileName:string)=>{
    const fileBuffer = file;
    console.log(file)

    const params: PutObjectCommandInput = {
        Bucket:process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Key: `${fileName}`,
        Body:fileBuffer,
        ContentType:fileName.endsWith('.svg') ? "image/svg+xml" : "image/jpg"
    }
    const command = new PutObjectCommand(params);
    try {
      await s3Client.send(command);
      return fileName;
  } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload file to S3.");
  }
}
 const updateAvatar = async (image:string)=>{
    
   const user= await currentUser()
   console.log('USER:',user)
   if(!user){
    return {error: "You need to be authorize for this action"}
   }

    const existedUser = await db.user.findFirst({
        where:{
            id:user?.id
        }
     })
     console.log("existing user",existedUser )
    
   
   
   if(user || existedUser){
        const selectedUser = await db.user.update({
            where:{ 
                id: user?.id
            },
            data:{
                image: image
            },
        })
        return {success:"Image has changed!"}
        }
return {error:"User dosent exists"}
}


const updateCover = async (image:string)=>{
  const user= await currentUser()
  console.log('USER:',user)
 
   const existedUser = await db.profile.findFirst({
       where:{
           userId:user?.id
       }
    })
    console.log("existing user",existedUser )
   
  
  
  if(user || existedUser){
       const selectedUser = await db.profile.update({
           where:{ 
               userId: user?.id
           },
           data:{
               coverImage: image
           },
       })
       return {success:"Image has changed!"}
       }
return {error:"User dosent exists"}
}

export async function POST(request: Request): Promise<Response> {
    const user = await currentUser()
    if(!user){
      return NextResponse.json({ error: "You need to be authorize for this action"})
    }
    try {
      let imageUrl
      const formData = await request.formData();
      const avatar = formData.get("file");
      const coverImage = formData.get("cover")
        // console.log(avatar,formData)

      if (!avatar || typeof avatar === "string") {
        

        if(!coverImage || typeof coverImage ==="string"){
          return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        const buffer = Buffer.from(await coverImage?.arrayBuffer());
        const imageName = await uploadFileToS3(buffer, coverImage.name);
         imageUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${imageName}`;
       
        
      }else{
        const buffer = Buffer.from(await avatar?.arrayBuffer());
        const imageName = await uploadFileToS3(buffer, avatar.name);
         imageUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${imageName}`;
       
      }
  
    
     try{
        console.log("updateImageURL",imageUrl)
        if(avatar){
          await updateAvatar(imageUrl)
        }
        if(coverImage){
          await updateCover(imageUrl)
        }
     }catch(error){
        return NextResponse.json<S3Response>({ error: error})
     }
     
      return NextResponse.json<S3Response>({ success: true, imageUrl });
    } catch (error) {
      return NextResponse.json<S3Response>({ error: error instanceof Error ? error.message : String(error) });
    }
  }