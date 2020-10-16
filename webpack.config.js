const path = require('path');
const { GenerateSW } = require('workbox-webpack-plugin');

const isDevServer = process.env.WEBPACK_DEV_SERVER;

const plugins = isDevServer
  ? []
  : [
    new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 20000000
    })
  ];



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
  plugins,
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'build/'),
    stats: 'errors-only',
    open: true,
    port: 12000,
  },
}