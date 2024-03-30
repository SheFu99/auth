import { NextResponse } from "next/server";
import { PutObjectAclCommand, PutObjectCommand, PutObjectCommandInput, S3Client} from "@aws-sdk/client-s3";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserInfoSchema } from "@/schemas";
import * as z from 'zod'

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_S3_REGION as string,
    credentials:{
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY as string,
    }
});


 const uploadFileToS3 = async (file:Buffer,fileName:string)=>{
    const fileBuffer = file;
    console.log(fileName)

    const params: PutObjectCommandInput = {
        Bucket:process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Key: `${fileName}`,
        Body:fileBuffer,
        ContentType:fileName.endsWith('.svg') ? "image/svg+xml" : "image/jpg"
    }
    const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}


 const updateImage = async (image:z.infer<typeof UserInfoSchema>)=>{
    
   const user= await currentUser()
   console.log('USER:',user)
   
   const existedUser = await db.user.findFirst({
    where:{
        id:user?.id
    }

    
   })
   console.log("existing user",existedUser )
    if(user || existedUser){

        const selectedUser = await db.user.update({
            where:{ 
                email: user.email
            },
            data:{
                image:image
            },
        })
        return {success:"Image has changed!"}
        }
return {error:"User dosent exists"}
}

export async function POST(request: Request): Promise<Response> {
    try {
      const formData = await request.formData();
      const file = formData.get("file");
        console.log(file,formData)
      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "File is required." }, { status: 400 });
      }
  
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await uploadFileToS3(buffer, file.name);
      const imageUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fileName}`;
      
     try{
        console.log("updateImageURL",imageUrl)
        await updateImage(imageUrl)
     }catch(error){
        return NextResponse.json({ error: error})
     }
     
      return NextResponse.json({ success: true, imageUrl });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) });
    }
  }