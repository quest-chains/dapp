/* eslint-disable import/no-unresolved */
import 'focus-visible/dist/focus-visible';
import '@/assets/bg.scss';
import '@/fonts/styles.css';
import 'react-markdown-editor-lite/lib/index.css';
import '@/assets/custom-markdown-editor.scss';

import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { Toaster } from 'react-hot-toast';

import { AppLayout } from '@/components/AppLayout';
import { GRAPH_URL } from '@/utils/constants';
import { globalStyles, theme } from '@/utils/theme';
import { WalletProvider } from '@/web3';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter();

  return (
    <ChakraProvider resetCSS theme={theme}>
      <div
        className={router.pathname === '/' ? 'background-root' : 'background'}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Global styles={globalStyles} />
      <WalletProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </WalletProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: '1rem',
            maxWidth: '40rem',
            marginBottom: '2rem',
          },
        }}
      />
    </ChakraProvider>
  );
};

export default withUrqlClient(() => ({ url: GRAPH_URL }), {
  ssr: true,
  staleWhileRevalidate: true,
})(App);
