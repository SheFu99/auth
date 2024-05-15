import { useState } from 'react';

const useBlobImage = () => {
    const [images, setImageFiles] = useState<File[]>([]);
    const [imagesBlobUrl, setImagesBlobUrl] = useState<string[]>([]);

    const AddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files); // Convert FileList to Array
        const imageBlobUrls: string[] = [];

        if (files.length >= imagesBlobUrl.length) {
            setImageFiles(files);
        } else {
            setImageFiles((prevFiles) => [...prevFiles, ...files]);
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                const blobUrl = e.target?.result as string;
                imageBlobUrls.push(blobUrl);
            };

            const imgURL = URL.createObjectURL(file);
            imageBlobUrls.push(imgURL); // Push the created Blob URL
            setImagesBlobUrl((prevImagesUrl) => [...prevImagesUrl, imgURL]);

            reader.readAsDataURL(file);
        }
    };

    const deleteImage = (image: any, index: number) => {
        setImagesBlobUrl((prevImagesUrl) => prevImagesUrl.filter((img) => img !== image));
        const newImageState = images.filter((file, id) => id !== index);
        setImageFiles(newImageState);
    };

    return {
        images,
        imagesBlobUrl,
        AddImage,
        deleteImage,
        setImageFiles,
        setImagesBlobUrl,
    };
};

export default useBlobImage;
