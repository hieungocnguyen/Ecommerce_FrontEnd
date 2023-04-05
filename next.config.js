/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
   reactStrictMode: true,
   swcMinify: true,
};

module.exports = {
   nextConfig,
   images: {
      domains: [
         "images.unsplash.com",
         "res.cloudinary.com",
         "t4.ftcdn.net",
         "lh3.googleusercontent.com",
         "img.freepik.com",
      ],
   },
};
