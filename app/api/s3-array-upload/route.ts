
// import { createPresignedPost } from '@aws-sdk/s3-presigned-post'; 
import { NextResponse } from "next/server";

import { currentUser } from '@/lib/auth';
import { Readable } from "stream";
import { Upload } from '@aws-sdk/lib-storage'
import { S3Client } from "@aws-sdk/client-s3";

interface File {
    buffer: Buffer;
    name: string;
}
function bufferToStream(buffer:Buffer) {
    let stream = new Readable();
    stream.push(buffer);
    stream.push(null); // No more data to write
    return stream;
}
const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_S3_REGION as string,
    credentials:{
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY as string,
    }
});


async function uploadFileToS3(file:File):Promise<string> {
    const { buffer, name } = file;
    const fileName = `uploads/${Date.now()}_${name}`;
    const contentType = name.endsWith('.svg') ? "image/svg+xml" : (name.endsWith('.png') ? "image/png" : "image/jpeg");

    const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Key: fileName,
        Body: bufferToStream(buffer),
        ContentType: contentType
    };

    try {
        const uploader = new Upload({
            client: s3Client,
            params: params
        });

        // uploader.on('httpUploadProgress', (progress) => {
        //     console.log(`Upload progress: ${progress.loaded} of ${progress.total} bytes`);
        // });

        const result = await uploader.done();
        console.log("Upload complete:", result);
        return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.log("Error uploading to S3:", error.stack);
        throw new Error("Failed to upload file to S3.");
    }
};

const uploadFilesToS3 = async (files:File[]):Promise<string[]> => {
    const uploadPromises = files.map(file=>uploadFileToS3(file));
    return Promise.all(uploadPromises);

///TODO: Try with Promise.allSettled
    //1: Logging inputs and outputs 
    //2: Make a new array of value with status 
    //2: Get index of rejected values
    //3: Make a new array with status rejected reason and index
    //4: Retry rejected arrays one more time 
    //5: If rejected arrays returns array with fulfilled status,then replace by index
    //6: If inside rejected arrays still be any values , then cash result and return rejected 
    //7: After manualy retry it may get result from cash and retry rejected values 
    //8: If it still be have rejected then return resolved but without rejected values 
};

export async function POST(request: Request): Promise<Response> {
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: "You need to be authorized for this action" });
    }

    try {
        const formData = await request.formData();
        const files = [];

        const entries = Array.from(formData.entries());
        for (const [key, value] of entries) {
            if (value instanceof File) {
                files.push({
                    buffer: Buffer.from(await value.arrayBuffer()),
                    name: value.name
                });
            }
        }

        if (files.length === 0) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        const imageUrls = await uploadFilesToS3(files);
        console.log("S3_error",imageUrls)
        

        return NextResponse.json({ success: true, imageUrls });
    } catch (error) {
        console.log("S3_error",error)
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}





