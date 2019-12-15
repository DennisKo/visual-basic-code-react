import * as path from "path";

export const getWebpackConfig = (extensionPath: string, workspace) => ({
  context: extensionPath,
  entry: path.join(path.resolve(workspace.rootPath), "src", "app.js"),
  output: {
    path: path.join(extensionPath, "public"),
    filename: "[name].[contenthash].js"
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"].map(
              require.resolve
            )
          }
        }
      }
    ]
  },
  resolve: {
    modules: [path.join(extensionPath, "node_modules"), "node_modules"],
    extensions: ["*", ".js", ".jsx"]
  }
});
