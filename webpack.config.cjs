const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  devServer: {
    static: './dist',
    port: 8080,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public/_redirects", to: "" }]
    })
  ],
  module: {
    rules: [
      {
        test: /.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /.(mp3|wav)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/sounds/[name][ext]',
        },
      },
      {
        test: /.svg$/,
        type: 'asset/resource',
      },
    ],
  },
};
