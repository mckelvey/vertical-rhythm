const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ResourceHintsWebpackPlugin = require('resource-hints-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const mode = process.env.MODE || 'production';
const destination = path.resolve(__dirname, 'dist');

const plugins = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: [
      path.resolve(destination, '{scripts,styles}/**/*'),
    ],
  }),
  new CopyWebpackPlugin([
    {
      from: 'static/**/*',
      to: destination,
      transformPath(targetPath) {
        return targetPath.replace('static/', '');
      },
    },
  ]),
  new HtmlWebpackPlugin({
    filename: path.resolve(destination, 'index.html'),
    template: 'templates/index.html',
  }),
  new ResourceHintsWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: 'styles/bundle.[contenthash].css',
  }),
  new StyleLintPlugin({
    context: 'src',
    files: '**/*.scss',
    syntax: 'scss',
  }),
];

if (mode !== 'production') {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  mode,
  entry: [path.resolve(__dirname, 'src', 'index.js')],
  output: {
    path: destination,
    filename: 'scripts/bundle.[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.scss$/,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      js: path.resolve(__dirname, 'src/js'),
      scss: path.resolve(__dirname, 'src/scss'),
    },
    extensions: ['.js', '.json', '.jsx', '.scss'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ecma: 6,
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  performance: {
    hints: false,
  },
  plugins,
  devtool: mode === 'production' ? false : 'inline-source-map',
};
