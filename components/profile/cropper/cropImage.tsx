export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;

        // Ensure the image is loaded before proceeding
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const maxSize = Math.max(image.width, image.height);
            canvas.width = maxSize;
            canvas.height = maxSize;

            // Applying rotation if necessary
            ctx.save();
            ctx.translate(maxSize / 2, maxSize / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-maxSize / 2, -maxSize / 2);

            ctx.drawImage(image, 0, 0);
            ctx.restore();

            // Verify that the cropping dimensions are valid
            if (pixelCrop.width <= 0 || pixelCrop.height <= 0) {
                reject('Invalid cropping dimensions');
                return;
            }

            const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
            if (!data) {
                reject('Failed to get image data');
                return;
            }

            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            ctx.putImageData(data, 0, 0);

            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                } else {
                    resolve(URL.createObjectURL(blob));
                }
            }, 'image/jpeg');
        };

        image.onerror = () => {
            reject(new Error("Image failed to load"));
        };
    });
}
