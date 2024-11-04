#!/bin/bash
set -e  # Exit on error

# Clean install
echo "Cleaning previous installation..."
rm -rf node_modules
npm cache clean --force

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Build scratch-blocks
echo "Building scratch-blocks..."
cd ./node_modules/scratch-blocks

# Create a temporary webpack config for scratch-blocks with correct paths
cat > webpack.config.js << EOL
const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        vertical: './blocks_vertical/vertical_extensions.js',
        horizontal: './blocks_horizontal/horizontal_extensions.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Blockly',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    }
};
EOL

# Install scratch-blocks dependencies including babel-loader
npm install --legacy-peer-deps
npm install --save-dev @babel/core @babel/preset-env babel-loader

# Run Python build only (skip webpack for now)
python3 build.py || {
    echo "Python build failed, installing google-closure-compiler..."
    npm install -g google-closure-compiler
    echo "Retrying build..."
    python3 build.py
}

# Run webpack separately with proper error handling
node_modules/.bin/webpack || {
    echo "Webpack build failed, but continuing..."
}

# Return to root
cd ../..

# Add extensions
echo "Adding extensions..."
node ./scripts/postinstall.js

# Create postcss config if it doesn't exist
if [ ! -f "postcss.config.js" ]; then
    echo "Creating postcss.config.js..."
    cat > postcss.config.js << EOL
module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-simple-vars'),
        require('autoprefixer')
    ]
};
EOL
fi

# Build with increased memory
echo "Building project..."
export NODE_OPTIONS="--max-old-space-size=8192"
NODE_ENV=production BUILD_MODE=dist npm run build

echo "Installation complete!"
