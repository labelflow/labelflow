const bundlewatchConfig = {
  files: [
    // These file patterns are based on what is seen to be actually loaded on client side in dev tools on the deployed app
    // Next JS client files
    {
      path: "./.next/static/chunks/**/*-*.js",
      maxSize: "400kb",
    },
    {
      path: "./.next/static/chunks/**/*.*.js",
      maxSize: "400kb",
    },
    {
      path: "./.next/static/*/_buildManifest.js",
      maxSize: "4kb",
    },
    {
      path: "./.next/static/*/_ssgManifest.js",
      maxSize: "4kb",
    },
  ],
  ci: {
    trackBranches: ["refs/heads/main"],
  },
};

module.exports = bundlewatchConfig;
