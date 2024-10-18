/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['primereact'],
  images: {
    domains: ['localhost'],
  }
}
export default nextConfig;