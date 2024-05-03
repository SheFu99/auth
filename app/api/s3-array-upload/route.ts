
// import { createPresignedPost } from '@aws-sdk/s3-presigned-post'; 
import { NextResponse } from "next/server";
import { s3Client } from "../s3-upload/route";
import { currentUser } from '@/lib/auth';
import { Readable } from "stream";
import { Upload } from '@aws-sdk/lib-storage'

interface FileUpload {
    buffer: Buffer;
    name: string;
}
function bufferToStream(buffer) {
    let stream = new Readable();
    stream.push(buffer);
    stream.push(null); // No more data to write
    return stream;
}



async function uploadFileToS3(file) {
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

const uploadFilesToS3 = async (files) => {
    const uploadPromises = files.map(uploadFileToS3);
    return Promise.all(uploadPromises);
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

        return NextResponse.json({ success: true, imageUrls });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}





