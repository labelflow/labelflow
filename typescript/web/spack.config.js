const { config } = require("@swc/core/spack");
module.exports = config({
  entry: {
    sw: __dirname + "/src/worker/index.ts",
  },
  output: {
    path: __dirname + "/public",
  },
  target: "browser",
  alias: {
    browser: {
      _stream_duplex: 'browser-builtins/builtin/_stream_duplex.js',
      _stream_passthrough: 'browser-builtins/builtin/_stream_passthrough.js',
      _stream_readable: 'browser-builtins/builtin/_stream_readable.js',
      _stream_transform: 'browser-builtins/builtin/_stream_transform.js',
      _stream_writable: 'browser-builtins/builtin/_stream_writable.js',
      assert: 'browser-builtins/node_modules/assert/assert.js',
      buffer: 'browser-builtins/node_modules/buffer/index.js',
      child_process: 'browser-builtins/builtin/child_process.js',
      cluster: 'browser-builtins/builtin/cluster.js',
      console: 'browser-builtins/node_modules/console-browserify/index.js',
      constants: 'browser-builtins/node_modules/constants-browserify/constants.json',
      crypto: 'browser-builtins/node_modules/crypto-browserify/index.js',
      dgram: 'browser-builtins/builtin/dgram.js',
      dns: 'browser-builtins/builtin/dns.js',
      domain: 'browser-builtins/builtin/domain.js',
      events: 'browser-builtins/node_modules/events/events.js',
      fs: 'browser-builtins/builtin/fs.js',
      // http: 'browser-builtins/node_modules/http-browserify/index.js',
      http: 'http-browserify/index.js',
      https: 'browser-builtins/node_modules/https-browserify/index.js',
      net: 'browser-builtins/builtin/net.js',
      os: 'browser-builtins/node_modules/os-browserify/browser.js',
      path: 'path-browserify/index.js',
      process: 'browser-builtins/builtin/process.js',
      punycode: 'browser-builtins/node_modules/punycode/punycode.js',
      querystring: 'browser-builtins/builtin/querystring.js',
      readline: 'browser-builtins/builtin/readline.js',
      repl: 'browser-builtins/builtin/repl.js',
      stream: 'browser-builtins/builtin/stream.js',
      string_decoder: 'browser-builtins/builtin/string_decoder.js',
      string_decoder: 'browser-builtins/node_modules/string_decoder/index.js',
      sys: 'browser-builtins/builtin/sys.js',
      timers: 'browser-builtins/builtin/timers.js',
      tls: 'browser-builtins/builtin/tls.js',
      tty: 'browser-builtins/builtin/tty.js',
      url: 'browser-builtins/builtin/url.js',
      util: 'browser-builtins/builtin/util.js',
      vm: 'browser-builtins/node_modules/vm-browserify/index.js',
      zlib: 'zlib-browserify/index.js',
    }
  },
  options: {
    // "env": {
    //   "coreJs": 3
    // },
    "minify": false,
    // // "exclude": ["stream", "jszip"],
    "module": {
      // You can specify "commonjs", "es6", "amd", "umd"
      "type": "es6",
      "strict": true,
      "strictMode": true,
      "lazy": false,
      "noInterop": false,
      // ignoreDynamic: true
    },
    jsc: {
      //  es3 / es5 / es2015 / es2016
      "target": "es2016",
      "loose": false,
      "externalHelpers": true,
      "keepClassNames": true,
      "parser": {
        "syntax": "typescript",
        "tsx": true,
        "decorators": false,
        "dynamicImport": true
      },
      "transform": {
        "optimizer": {
          "globals": {
            "vars": {
              "process.env.NODE_ENV": "production",
              "process.env.SENTRY_DSN": process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
              "process.env.NEXT_PUBLIC_SENTRY_DSN": process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
            }
          }
        }
      }
    },
    //   "transform": null,
    // "target": "es2016",
    //   "loose": false,
    //   "externalHelpers": false,
    //   "keepClassNames": false,
    //   "transform": {
    //     "constModules": {

    //       "globals": {
    //         "stream": {
    //           "DEBUG": "true"
    //         },
    //       }
    //     }
    //   }
    // }
  }
});