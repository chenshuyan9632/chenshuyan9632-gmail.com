const HtmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const config = require('./public/config')[isDev ? 'dev' : 'build']
const path = require('path');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: 'bundle.[hash:6].js',
    publicPath: '/' //通常是CDN地址
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(le|c)ss$/,
        use: ['style-loader', 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [require('autoprefixer')({
                "overrideBrowserslist": [">0.25%", "not dead"]
              })]
            }
          }
        }, 'less-loader'],
        exclude: /node_modules/
      },
      {
        test: /.html$/,
        use: 'html-withimg-loader'
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240, //10K
            esModule: false,
            name: '[name]_[hash:6].[ext]',
            outputPath: 'assets'
          }
        }],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
      },
      config: config.template
    })
  ],
  devServer: {
    port: '3000',
    quiet: false,
    inline: true,
    stats: 'errors-only',
    overlay: false,
    clientLogLevel: 'silent',
    compress: true
  },
  devtool: 'cheap-module-eval-source-map'
}