import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content="Labelflow" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Labelflow" />
          <meta
            name="description"
            content="The open source image labelling and dataset cleaning platform."
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/static/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#03C3BF" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#03C3BF" />
          {/* <link
            rel="apple-touch-icon"
            href="/static/icons/touch-icon-iphone.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/static/icons/touch-icon-ipad.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/icons/touch-icon-iphone-retina.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/static/icons/touch-icon-ipad-retina.png"
          /> */}
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/manifest.json" />
          {/* <link
            rel="mask-icon"
            href="/static/icons/safari-pinned-tab.svg"
            color="#03C3BF"
          /> */}
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
