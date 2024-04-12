"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import EditProfile from "./EditProfile";

const UploadForm = () => {
  const [file, setFile] = useState<File|null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e:ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
        setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.status);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  }

  return (
    <>
      <h1>Upload Files to S3 Bucket</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <EditProfile></EditProfile>
    </>
  );
};

export default UploadForm;