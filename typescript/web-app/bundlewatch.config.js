const bundlewatchConfig = {
  files: [{
    path: './.next/static/**/*.js',
    maxSize: '100kb',
  }],
  "ci": {
    "trackBranches": ["main"]
  }
}

module.exports = bundlewatchConfig