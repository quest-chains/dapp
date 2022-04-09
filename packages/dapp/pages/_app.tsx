/* eslint-disable import/no-unresolved */
import 'focus-visible/dist/focus-visible';
import '@/assets/bg.scss';

import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { AppProps } from 'next/app';

import { AppLayout } from '@/components/AppLayout';
import { globalStyles, theme } from '@/utils/theme';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {/* <div className="background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div> */}
      <Global styles={globalStyles} />
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </ChakraProvider>
  );
};

export default App;
