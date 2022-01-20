const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production', // LE INDICO EL MODO EXPLICITAMENTE
  entry: './src/index.js', // El punto de entrada de mi aplicación
  // OUTPUT: Esta es la salida de mi bundle
  output: {
    // resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo
    // para no tener conflictos entre Linux, Windows, etc
    path: path.resolve(__dirname, 'dist'),
    // EL NOMBRE DEL ARCHIVO FINAL,
    filename: 'js/[name].[contenthash].js',
    clean: true,
  },
  resolve: {
    extensions: ['js'], // LOS ARCHIVOS QUE WEBPACK VA A LEER
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@templates': path.resolve(__dirname, 'src/templates/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
    },
  },
  module: {
    // REGLAS PARA TRABAJAR CON WEBPACK
    rules: [
      {
        test: /\.m?js$/, // LEE LOS ARCHIVOS CON EXTENSION .JS,
        use: { loader: 'babel-loader' },
        exclude: /node_modules/, // IGNORA LOS MODULOS DE LA CARPETA
      },
      {
        test: /\.css|.styl$/i, // LEE LOS ARCHIVOS CON EXTENSION .JS,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.png/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[contenthash].png',
        },
      },
      {
        test: /\.(woff|woff2)$/i, // Tipos de fuentes a incluir
        type: 'asset/resource', // Tipo de módulo a usar (este mismo puede ser usado para archivos de imágenes)
        generator: {
          filename: 'assets/fonts/[name].[contenthash].[ext][query]', // Directorio de salida
        },
        // use: {
        //   name: '[name].[contenthash].[ext]',
        //   outputPath: './assets/fonts/',
        //   publicPath: '../assets/fonts/',
        // },
      },
    ],
  },
  // SECCIÓN DE PLUGINS
  plugins: [
    new HtmlWebpackPlugin({
      // CONFIGURACIÓN DEL PLUGIN
      inject: true, // INYECTA EL BUNDLE AL TEMPLATE HTML
      template: './public/index.html', // LA RUTA AL TEMPLATE HTML
      filename: './index.html', // NOMBRE FINAL DEL ARCHIVO
    }),
    new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src', 'assets/images'),
    //       to: 'assets/images',
    //     },
    //   ],
    // }),
    new Dotenv(),
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
};
