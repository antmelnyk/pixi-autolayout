var path = require("path");

module.exports = {
  entry: "./src/PIXILayout.ts",

  output: {
    path: path.resolve(__dirname, "lib"),
    publicPath: "/",
    filename: "index.js"
  },

  resolve: {
    extensions: [".ts", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
};
