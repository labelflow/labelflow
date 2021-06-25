const bundlewatchConfig = {
  files: [{
    path: './.next/static/**/*.js',
    maxSize: '10240kb',
  }],
  "ci": {
    "trackBranches": ["main"]
  }
}

module.exports = bundlewatchConfig