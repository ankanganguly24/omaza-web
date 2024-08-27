import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  // other Next.js configurations go here
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // other PWA-specific configurations go here
})(nextConfig);
