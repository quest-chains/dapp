import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

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
        style={{
          height: '100%',
        }}
      >
        <Head>
          <link
            rel="shortcut icon"
            sizes="any"
            type="image/png"
            href="/logo.png"
          />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body
          style={{
            height: '100%',
          }}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default TSDocument;
