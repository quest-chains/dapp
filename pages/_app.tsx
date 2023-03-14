// Do NOT change order of CSS files
import '@/assets/styles/bg.scss';
import '@/assets/styles/fonts.css';
import 'react-markdown-editor-lite/lib/index.css';
import '@/assets/styles/custom-markdown-editor.scss';
import '@/assets/styles/react-medium-image-zoom.css';

import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { AppProps } from 'next/app';
import Script from 'next/script';
import React, { PropsWithChildren, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { hotjar } from 'react-hotjar';

import { AppLayout } from '@/components/Layout/AppLayout';
import { globalStyles, theme } from '@/utils/theme';
import { WalletProvider } from '@/web3';

const ForceDarkMode: React.FC<PropsWithChildren> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    hotjar.initialize(3277457, 6);
  }, []);

  useEffect(() => {
    if (colorMode === 'dark') return;
    toggleColorMode();
  }, [colorMode, toggleColorMode]);

  return <>{children}</>;
};

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <div className="background">
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
      <ChakraProvider resetCSS theme={theme}>
        <ForceDarkMode>
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
        </ForceDarkMode>
      </ChakraProvider>
    </>
  );
};

export default App;
