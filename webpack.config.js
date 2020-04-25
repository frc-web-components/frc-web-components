const path = require('path');

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: './index.js',
  output: {
    filename: "frc-web-components.js",
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader'
        }]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
      },
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'build/'),
    stats: 'errors-only',
    open: true,
    port: 12000,
  },
}