import { NextResponse } from "next/server";
import { s3Client } from "../s3-upload/route";
import {  DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";



export async function DELETE(req: NextApiRequest, res: NextApiResponse){
// if(req.headers['isAuth']!=='true'){
//     return NextResponse.json({error:"You need to be authorize"})
// }

const request = req.body.getReader()
const { done, value } = await request.read();
console.log(value)
let chunks = '';
      while (true) {
        const { done, value } = await request.read();
        if (done) {
          break;
        }
        chunks += new TextDecoder().decode(value);
      }
         // Parse the accumulated data as JSON
         const data = JSON.parse(chunks);
         console.log(data); // Log the data to see what's received
   
console.log(request)
    const {keys} = req.body;
      console.log(keys)
    if(!keys||keys.length ===0){
        return NextResponse.json({error:'keys i require'},{status:400})
    };

   const deleteParams = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Delete: {
      Objects: keys.map((key: string) => ({ Key: key })),
      Quiet: false
    },
  };


    try {
        // Create and send the delete command
        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        const deleteResult = await s3Client.send(deleteCommand);
       return NextResponse.json({success:true,details:deleteResult})
      } catch (error) {
        console.error('S3 delete error:', error);
        return NextResponse.json({err:'something was wrong '})
      }
}