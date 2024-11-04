const path = require('path');
const webpack = require('webpack');

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// PostCSS Plugins
const autoprefixer = require('autoprefixer');
const postcssVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');

// Determine if we're building for production or development
const isProduction = process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist';

module.exports = {
  mode: isProduction ? 'production' : 'development',

  entry: isProduction
    ? {
        'scratch-gui': path.join(__dirname, 'src/index.js'),
      }
    : {
        gui: './src/playground/index.jsx',
        blocksonly: './src/playground/blocks-only.jsx',
        compatibilitytesting: './src/playground/compatibility-testing.jsx',
        player: './src/playground/player.jsx',
      },

  output: {
    path: isProduction
      ? path.resolve(__dirname, 'dist')
      : path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    library: {
      name: 'GUI',
      type: 'umd',
    },
    assetModuleFilename: 'static/assets/[name].[hash][ext][query]',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    },
    alias: {
      '@images': path.resolve(__dirname, 'src/images'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },

  module: {
    rules: [
      // JavaScript and JSX files
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/scratch-paint'),
          path.resolve(__dirname, 'node_modules/scratch-render'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true, // Webpack 5's built-in caching
          },
        },
      },
      // CSS Modules
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postcssImport, postcssVars, autoprefixer],
              },
            },
          },
        ],
      },
      // Global CSS
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [postcssImport, postcssVars, autoprefixer],
              },
            },
          },
        ],
      },
      // Asset handling for images and audio
      {
        test: /\.(png|jpg|jpeg|gif|mp3|wav)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/assets/[name].[hash][ext][query]',
        },
      },
      // Handle .hex files
      {
        test: /\.hex$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/hex/[name].[hash][ext][query]',
        },
      },
      // SVGs intended to be React components (named with `.component.svg`)
      {
        test: /\.component\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: true, // Enable SVGO optimization
              svgoConfig: {
                plugins: [
                  {
                    name: 'removeViewBox',
                    active: false, // Keep viewBox
                  },
                ],
              },
              titleProp: true,
            },
          },
        ],
      },
      // SVGs imported as assets (named with `.asset.svg`)
      {
        test: /\.asset\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/assets/[name].[hash][ext][query]',
        },
      },
      // SVGs imported in CSS or other files
      {
        test: /\.svg$/,
        issuer: /\.(css)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/assets/[name].[hash][ext][query]',
        },
      },
      // Fallback for any other SVG imports
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/assets/[name].[hash][ext][query]',
        },
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),

    new webpack.DefinePlugin({
      'process.env.DEBUG': JSON.stringify(Boolean(process.env.DEBUG)),
      'process.env.GA_ID': JSON.stringify(process.env.GA_ID || 'UA-000000-01'),
      'process.env.GTM_ENV_AUTH': JSON.stringify(process.env.GTM_ENV_AUTH || ''),
      'process.env.GTM_ID': process.env.GTM_ID
        ? JSON.stringify(process.env.GTM_ID)
        : 'null',
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static',
          to: 'static',
        },
        {
          from: 'extensions/**',
          to: 'static',
          context: 'src/examples',
        },
        {
          from: 'node_modules/scratch-blocks/media',
          to: 'static/blocks-media/default',
        },
        {
          from: 'node_modules/scratch-blocks/media',
          to: 'static/blocks-media/high-contrast',
        },
        {
          from: 'src/lib/themes/high-contrast/blocks-media',
          to: 'static/blocks-media/high-contrast',
          force: true,
        },
        {
          context: 'node_modules/scratch-vm/dist/web',
          from: 'extension-worker.{js,js.map}',
          noErrorOnMissing: true,
        },
        {
          from: 'src/images',
          to: 'static/images',
          noErrorOnMissing: true,
        },
      ],
    }),
  ].concat(
    isProduction
      ? []
      : [
          new HtmlWebpackPlugin({
            chunks: ['gui'],
            template: 'src/playground/index.ejs',
            title: 'CodePM',
          }),
          new HtmlWebpackPlugin({
            chunks: ['blocksonly'],
            filename: 'blocks-only.html',
            template: 'src/playground/index.ejs',
            title: 'Scratch 3.0 GUI: Blocks Only Example',
          }),
          new HtmlWebpackPlugin({
            chunks: ['compatibilitytesting'],
            filename: 'compatibility-testing.html',
            template: 'src/playground/index.ejs',
            title: 'Scratch 3.0 GUI: Compatibility Testing',
          }),
          new HtmlWebpackPlugin({
            chunks: ['player'],
            filename: 'player.html',
            template: 'src/playground/index.ejs',
            title: 'Scratch 3.0 GUI: Player Example',
          }),
        ]
  ),

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    mergeDuplicateChunks: true,
    runtimeChunk: 'single',
  },

  devServer: isProduction
    ? undefined
    : {
        static: {
          directory: path.join(__dirname, 'build'),
        },
        compress: true,
        port: process.env.PORT || 8602,
        historyApiFallback: true,
        hot: true,
      },

  devtool: isProduction ? 'source-map' : 'eval-source-map',

  cache: {
    type: 'filesystem', // Enables persistent caching
    buildDependencies: {
      config: [__filename], // Invalidate cache when config changes
    },
  },

  stats: {
    errorDetails: true, // Enable detailed error messages
  },

  performance: {
    hints: false,
  },
};
