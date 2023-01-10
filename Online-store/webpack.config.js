const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');
const { NetlifyPlugin } = require('netlify-webpack-plugin');

const baseConfig = {
  entry: path.resolve(__dirname, './src/index'),
  mode: 'development',
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.ts$/i,
        use: ['ts-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    hashFunction: 'sha256',
    filename: 'index.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    assetModuleFilename: 'assets/images/[name][ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new EslingPlugin({ extensions: 'ts' }),
    new CleanWebpackPlugin(),
    new NetlifyPlugin({
      redirects: [
        {
          from: '/*',
          to: '/index.html',
          status: 200,
        },
      ],
    }),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
