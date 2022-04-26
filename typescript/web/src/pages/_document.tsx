import { ColorModeScript } from "@chakra-ui/react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { theme } from "../theme";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content="LabelFlow" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="LabelFlow" />
          <meta
            name="description"
            content="The open platform for image labeling."
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
          {/* Google analytics, See https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/ */}
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          {/* Microsoft Clarity, See https://docs.microsoft.com/en-us/clarity/clarity-setup */}
          <script
            type="text/javascript"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY}");
          `,
            }}
          />
          <style>
            {/* https://github.com/vercel/next.js/issues/4834 */}
            {`
            #__next { flex-grow: 1; display: flex; flex-direction: column; min-height: 0; }
          `}
          </style>
        </Head>
        <body
          style={{
            position: "unset",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            maxHeight: "100vh",
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

export default MyDocument;
