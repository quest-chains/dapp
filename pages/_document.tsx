import { ColorModeScript } from '@chakra-ui/react';
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

import { theme } from '../utils/theme';
class TSDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): JSX.Element {
    return (
      <Html
        data-color-mode="dark"
        style={{
          height: '100%',
        }}
      >
        <Head>
          <link
            rel="shortcut icon"
            sizes="any"
            type="image/svg"
            href="/logo.svg"
          />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body
          style={{
            height: '100%',
          }}
        >
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default TSDocument;
