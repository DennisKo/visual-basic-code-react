import * as vscode from "vscode";
import * as path from "path";
import HTMLProvider from "./HTMLProvider";
const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

import { createVSCodeRessource, getFileContent } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.visualBasicCodeReact",
    async () => {
      const panel = vscode.window.createWebviewPanel(
        "visualBasicCodeReactWebView",
        "Visual Basic Code React",
        vscode.ViewColumn.Two,
        {
          enableScripts: true
        }
      );
      const exampleAppPath = path.join(context.extensionPath, "example");
      const entryFilePath = path.join(exampleAppPath, "app.js");

      const compiler = Webpack({
        entry: entryFilePath,
        mode: "development",
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"]
                }
              }
            }
          ]
        },
        resolve: {
          modules: [
            path.join(context.extensionPath, "node_modules"),
            "node_modules"
          ],
          extensions: ["*", ".js", ".jsx"]
        },
        output: {
          path: path.join(context.extensionPath, ".visual-react"),
          filename: "bundle.js"
        }
      });
      const server = new WebpackDevServer(compiler, {
        contentBase: __dirname + "/.visual-react",
        port: 3001,
        stats: {
          colors: true
        },
        host: `localhost`
      });
      server.listen(3001, "localhost", () => {
        console.log("Starting server on http://localhost:3001");
      });

      // const html = createVSCodeRessource(context, "assets", "index.html");
      // const htmlContent = getFileContent(html);
      // panel.webview.html = new HTMLProvider(
      //   htmlContent,
      //   panel.webview,
      //   html.path
      // ).generateHTML();
    }
  );
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
