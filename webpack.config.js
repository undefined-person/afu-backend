import * as path from 'path'
import webpackNodeExternals from 'webpack-node-externals'

export default {
  mode: 'development',
  target: 'node',
  entry: './index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  externals: [webpackNodeExternals()],
}
