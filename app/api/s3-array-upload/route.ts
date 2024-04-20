import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from "next/server";
import { s3Client } from "../s3-upload/route";
import { currentUser } from '@/lib/auth';

interface FileUpload {
    buffer: Buffer;
    name: string;
}

const uploadFilesToS3 = async (files: FileUpload[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
        const fileBuffer = file.buffer;
        const fileName = file.name;
        const contentType = fileName.endsWith('.svg') ? "image/svg+xml" : "image/jpeg"; // Corrected "image/jpg" to "image/jpeg"

        const params: PutObjectCommandInput = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
            Key: fileName,
            Body: fileBuffer,
            ContentType: contentType,
        };

        const command = new PutObjectCommand(params);

        try {
            await s3Client.send(command);
            return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${fileName}`;
        } catch (error) {
            console.error("Error uploading to S3:", error);
            throw new Error("Failed to upload file to S3.");
        }
    });

    return Promise.all(uploadPromises);
};


export async function POST(request: Request): Promise<Response> {
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: "You need to be authorized for this action" });
    }

    try {
        const formData = await request.formData();
        const files: FileUpload[] = [];

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

        const imageUrls = await uploadFilesToS3(files)
       
        

        // Update avatar or cover images based on the form data keys
        // await Promise.all(
        //     imageUrls.map((url, index) => {
        //         if (formData.get("avatar")) {
        //             return updateAvatar(url);
        //         } else if (formData.get("cover")) {
        //             return updateCover(url);
        //         }
        //     })
        // );
        console.log(imageUrls);
        return NextResponse.json({ success: true, imageUrls });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) });
    }
}


