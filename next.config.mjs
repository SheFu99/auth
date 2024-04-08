/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:['buffer.com','lh3.googleusercontent.com','new-demo-buckets.s3.eu-north-1.amazonaws.com',]
    },
    webpack: (config, { isServer }) => {
        // Custom webpack configs
        return config;
      },
};

export default nextConfig;
