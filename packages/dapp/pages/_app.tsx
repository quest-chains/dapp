import 'focus-visible/dist/focus-visible';

import { ChakraProvider } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import type { AppProps } from 'next/app';

import { AppLayout } from '@/components/AppLayout';
import { globalStyles, theme } from '@/utils/theme';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Global styles={globalStyles} />
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </ChakraProvider>
  );
};

export default App;
