module.exports = {
  entry: `${__dirname}/app/app.js`,
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/public`
  },
  module: {
      loaders: [
          { test: /\.css$/, loader: "style!css" }
      ]
  }
}
