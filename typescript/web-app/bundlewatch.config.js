const bundlewatchConfig = {
  files: [{
    path: './.next/static/**/*.js',
    maxSize: '10000kb',
  }],
  "ci": {
    "trackBranches": ["main"]
  }
}

module.exports = bundlewatchConfig