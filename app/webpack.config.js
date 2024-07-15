const path = require('path');

module.exports = {
  entry: './app/**/*', // Adjust the entry point to your main file
  target: 'node', // Specify target as node
  output: {
    filename: 'bundle.js', // Adjust the output file as needed
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      'os': false // No need to provide a fallback for built-in modules
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};

