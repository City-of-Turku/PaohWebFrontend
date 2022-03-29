// webpack.base.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: path.join(__dirname, './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: 'paoh-link.js',
    library: 'PaohLink',
    libraryTarget: 'umd',
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname, './lib'),
    },
    client: {
      logging: 'log',
    },
    host: 'localhost', // Defaults to `localhost`
    port: process.env.PORT || 8080, // Defaults to 8080
    open: true, // Open the page in browser
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.txt'],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        include: [path.resolve('src')],
        loader: 'ts-loader',
        options: {
          transpileOnly: false,
          compilerOptions: {
            module: 'es2015',
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Palveluohjain Link Test',
      filename: 'index.html',
      inject: false,
      template: 'dev/index.html',
      showErrors: true,
    }),
  ],
};

module.exports = config;
