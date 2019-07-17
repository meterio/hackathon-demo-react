// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.bytecode$/i,
        use: 'raw-loader',
      },
    ],
  },
};
