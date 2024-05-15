import { microserviceEndpoint } from '@/lib/utils';
import { useState } from 'react';

export interface UploadImagesProps{
    images:File[];
    userId:string;
    type:string;
}

const useUploadImages = () => {
    const [isUploading, setIsUploading] = useState(false);

    const uploadImages = async ({images,userId, type}:UploadImagesProps ) => {
        setIsUploading(true);
        let localImageUrls = [];
        try {
            const imageUrls = await Promise.all(images.map(async (file, index) => {
                const now = new Date();
                const dateTime = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

                const formData = new FormData();
                const filename = `${type}_${userId}_${dateTime}_${index}.png`; // Unique filename for each image
                const headers = new Headers();

                headers.append("Content-Type", "multipart/form-data");
                formData.append("cover", file, filename);

                const uploadResponse = await fetch(`${microserviceEndpoint}/api/s3-array-upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await uploadResponse.json();

                if (data?.error) {
                    throw new Error('Upload to S3 failed');
                }

                localImageUrls.push(data.imageUrls); // Collect URLs in a local array
            }));

            return { success: true, imageUrls: localImageUrls.flat() };

        } catch (error) {
            return { error: "Something went wrong! No imageURL from server" };
        } finally {
            setIsUploading(false);
        }
    };

    return { isUploading,setIsUploading, uploadImages };
};

export default useUploadImages;
