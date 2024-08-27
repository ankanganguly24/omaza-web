import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  // other Next.js configurations
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  ...nextConfig,
});
