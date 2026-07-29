import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // Las imágenes subidas ahora se sirven desde el mismo origen (/api/media/...),
  // así que no se necesitan remotePatterns externos.
};

export default nextConfig;
