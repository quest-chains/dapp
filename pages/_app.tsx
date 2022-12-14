import '@/assets/styles/bg.scss';
import '@/assets/styles/fonts.css';
import 'react-markdown-editor-lite/lib/index.css';
import '@/assets/styles/custom-markdown-editor.scss';

// Do NOT change order of CSS files
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { AppLayout } from '@/components/Layout/AppLayout';
import { globalStyles, theme } from '@/utils/theme';
import { WalletProvider } from '@/web3';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter();

  function ForceDarkMode(props: { children: JSX.Element }) {
    const { colorMode, toggleColorMode } = useColorMode();

    useEffect(() => {
      if (colorMode === 'dark') return;
      toggleColorMode();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colorMode]);

    return props.children;
  }

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ForceDarkMode>
        <React.Fragment>
          <div
            className={
              router.pathname === '/' ? 'background-root' : 'background'
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <Script
            type="text/javascript"
            defer
            data-domain="questchains.xyz"
            data-api="/jjmahtdkrp/api/event"
            src="/jjmahtdkrp/js/script.js"
          />
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
        </React.Fragment>
      </ForceDarkMode>
    </ChakraProvider>
  );
};

export default App;
