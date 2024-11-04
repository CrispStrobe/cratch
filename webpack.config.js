const path = require('path');
const webpack = require('webpack');

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// PostCss
const autoprefixer = require('autoprefixer');
const postcssVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');

const ScratchWebpackConfigBuilder = require('scratch-webpack-configuration');

const baseConfig = new ScratchWebpackConfigBuilder(
    {
        rootPath: path.resolve(__dirname),
        enableReact: true
    })
    .setTarget('web')
    .merge({
        output: {
            assetModuleFilename: 'static/assets/[name].[hash][ext][query]',
            library: 'GUI'  // Simplified library configuration
        },
        resolve: {
            alias: {  // Using alias instead of fallback
                buffer: require.resolve('buffer/'),
                stream: require.resolve('stream-browserify')
            }
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[name]_[local]_[hash:base64:5]',
                                    auto: true
                                },
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        postcssImport,
                                        postcssVars,
                                        autoprefixer
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(svg|png|wav|mp3|gif|jpg)$/,
                    type: 'asset/resource'  // Changed from just 'asset'
                },
                {
                    test: /\.hex$/,
                    type: 'asset/resource'
                }
            ]
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                minSize: 20000,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            },
            mergeDuplicateChunks: true,
            runtimeChunk: 'single'
        }
    });

if (!process.env.CI) {
    baseConfig.addPlugin(new webpack.ProgressPlugin());
}

baseConfig.addPlugin(new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer']
}));

baseConfig.addPlugin(new webpack.DefinePlugin({
    'process.env.DEBUG': Boolean(process.env.DEBUG),
    'process.env.GA_ID': `"${process.env.GA_ID || 'UA-000000-01'}"`,
    'process.env.GTM_ENV_AUTH': `"${process.env.GTM_ENV_AUTH || ''}"`,
    'process.env.GTM_ID': process.env.GTM_ID ? `"${process.env.GTM_ID}"` : null
}));

baseConfig.addPlugin(new CopyWebpackPlugin({
    patterns: [
        {
            from: 'node_modules/scratch-blocks/media',
            to: 'static/blocks-media/default'
        },
        {
            from: 'node_modules/scratch-blocks/media',
            to: 'static/blocks-media/high-contrast'
        },
        {
            from: 'src/lib/themes/high-contrast/blocks-media',
            to: 'static/blocks-media/high-contrast',
            force: true
        },
        {
            context: 'node_modules/scratch-vm/dist/web',
            from: 'extension-worker.{js,js.map}',
            noErrorOnMissing: true
        }
    ]
}));

// build the shipping library in `dist/`
const distConfig = baseConfig.clone()
    .merge({
        entry: {
            'scratch-gui': path.join(__dirname, 'src/index.js')
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        }
    });

// build the examples and debugging tools in `build/`
const buildConfig = baseConfig.clone()
    .merge({
        entry: {
            gui: './src/playground/index.jsx',
            blocksonly: './src/playground/blocks-only.jsx',
            compatibilitytesting: './src/playground/compatibility-testing.jsx',
            player: './src/playground/player.jsx'
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js'
        },
        devServer: {
            port: process.env.PORT || 8602,
            static: {
                directory: path.join(__dirname, 'build')
            },
            hot: true
        }
    });

buildConfig
    .addPlugin(new HtmlWebpackPlugin({
        chunks: ['gui'],
        template: 'src/playground/index.ejs',
        title: 'CodePM'
    }))
    .addPlugin(new HtmlWebpackPlugin({
        chunks: ['blocksonly'],
        filename: 'blocks-only.html',
        template: 'src/playground/index.ejs',
        title: 'Scratch 3.0 GUI: Blocks Only Example'
    }))
    .addPlugin(new HtmlWebpackPlugin({
        chunks: ['compatibilitytesting'],
        filename: 'compatibility-testing.html',
        template: 'src/playground/index.ejs',
        title: 'Scratch 3.0 GUI: Compatibility Testing'
    }))
    .addPlugin(new HtmlWebpackPlugin({
        chunks: ['player'],
        filename: 'player.html',
        template: 'src/playground/index.ejs',
        title: 'Scratch 3.0 GUI: Player Example'
    }))
    .addPlugin(new CopyWebpackPlugin({
        patterns: [
            {
                from: 'static',
                to: 'static'
            },
            {
                from: 'extensions/**',
                to: 'static',
                context: 'src/examples'
            }
        ]
    }));

const buildDist = process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist';

module.exports = buildDist ?
    [buildConfig.get(), distConfig.get()] :
    buildConfig.get();
