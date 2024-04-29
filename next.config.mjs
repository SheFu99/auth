/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:['buffer.com','lh3.googleusercontent.com','new-demo-buckets.s3.eu-north-1.amazonaws.com',"avatars.githubusercontent.com",`${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com`,'next-auth-bucket.s3.eu-central-1.amazonaws.com']
    },
};

export default nextConfig;
