import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { customTheme } from '@/utils/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional, for debugging

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={customTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} /> {/* Optional Devtools */}
    </QueryClientProvider>
  );
}

export default MyApp;
