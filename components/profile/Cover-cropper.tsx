"use clinet"
import React, { useRef, useState, ChangeEvent, ImgHTMLAttributes } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css"; // Don't forget to import the CSS
import setCanvasPreview from "../setCanvasPreview";
import { useCurrentUser } from "@/hooks/use-current-user";
import Image from "next/image";

type ImageCropperProps = {
  closeCoverModal: () => void;
  updateCover: (dataUrl: Blob) => void;
};

const ASPECT_RATIO = 42/9;
const MIN_WIDTH = 700;
const MIN_HEIGHT = 200

const CoverCropper: React.FC<ImageCropperProps> = ({ closeCoverModal, updateCover }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  // Crop type might be undefined initially, thus the state type is `Crop | undefined`
  const [crop, setCrop] = useState<Crop>();
  const [error, setError] = useState<string>("");

  function dataURLtoBlob(dataurl:any) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    const blob = new Blob([u8arr], {type: mime});
    const mimeToExtension : any = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'application/pdf': 'pdf',
        // Add more mappings as needed
      };

      const extension = mimeToExtension[mime] || '';

      return { blob, extension };
  }
const user = useCurrentUser()
const filename = (user?.name ?? '').replace(/\s+/g, '_');
// Get current date and time
const now = new Date();

// Format date and time: You can adjust the format as needed
const dateTimeFormat = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;

// Append date and time to filename



  function dataURLtoFile(dataurl: string): File {
    const {blob, extension} = dataURLtoBlob(dataurl);
    const filenameWithDateTime = `${filename}_${dateTimeFormat}.${extension}`;
    return new File([blob], filenameWithDateTime, { type: blob.type });
}
  
  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new window.Image();

      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");

        const { naturalWidth, naturalHeight } = e.currentTarget as HTMLImageElement;

        if (naturalWidth < MIN_WIDTH || naturalHeight < MIN_HEIGHT) {
          setError("Image must be at least 400 x 200 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_HEIGHT / width) * 500;

    const newCrop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(newCrop, width, height);
    setCrop(centeredCrop);
  };
  return (
    <>
      <label className="block mb-3 w-fit">
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
        />
      </label>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {imgSrc && (
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_WIDTH}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}

            />

          </ReactCrop>
          <button
            className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
            onClick={() => {
              if (imgRef.current && previewCanvasRef.current && crop) {
                setCanvasPreview(
                  imgRef.current,
                  previewCanvasRef.current,
                  convertToPixelCrop(
                    crop,
                    imgRef.current.width,
                    imgRef.current.height
                  ) as PixelCrop
                );
                const dataUrl = previewCanvasRef.current.toDataURL();
                const croppedImageBlob = dataURLtoFile(dataUrl);
                updateCover(croppedImageBlob);
                closeCoverModal();
              }
            }}
          >
            Crop Image
          </button>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};
export default CoverCropper;