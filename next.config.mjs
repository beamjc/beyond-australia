/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slnjysygoukqhlvjafwd.supabase.co',
      },
    ],
  },
}

export default nextConfig
