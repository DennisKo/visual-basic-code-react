import * as path from "path";
import * as vscode from "vscode";
import * as fs from "fs";
import HTMLProvider from "./HTMLProvider";
const Webpack = require("webpack");
import { getWebpackConfig } from "./configs";
import { genNonce } from "./utils";

let compiler;
let watcher;

export function activate(context: vscode.ExtensionContext) {
  let disposableProjectCreator = vscode.commands.registerCommand(
    "extension.visualBasicCodeReactCreateProject",
    async () => {
      const workspace = vscode.workspace;
      const templateSrcFolder = vscode.Uri.file(
        path.join(path.resolve(context.extensionPath), "template")
      );
      const targetUri = vscode.Uri.file(path.resolve(workspace.rootPath));

      // console.log(appFile);

      workspace.fs.copy(templateSrcFolder, targetUri, { overwrite: true });
      // fs.writeFileSync(
      //   path.join(contentBase, "playground.html"),
      //   createContentEntry()
      // );
      // fs.writeFileSync(
      //   path.join(contentBase, "index.js"),
      //   createEntry(filePath)
      // );
      // fs.writeFileSync(path.join(contentBase, "index.html"), createEntryHtml());
    }
  );
  let disposableWebView = vscode.commands.registerCommand(
    "extension.visualBasicCodeReact",
    async () => {
      const webpackConfig = getWebpackConfig(
        path.resolve(context.extensionPath),
        vscode.workspace
      );

      compiler = Webpack(webpackConfig);
      watcher = compiler.watch(
        {
          aggregateTimeout: 300,
          poll: undefined
        },
        (err, stats) => {
          const bundleName = stats.toJson({
            assets: true
          }).assetsByChunkName.main;

          HTMLGenerator.init(context, bundleName);
        }
      );
    }
  );
  context.subscriptions.push(disposableWebView);
  context.subscriptions.push(disposableProjectCreator);
}

class HTMLGenerator {
  private static context: vscode.ExtensionContext;
  private static panel: vscode.WebviewPanel;
  private static nonce: string;
  private static bundleName: string;

  static init(context: vscode.ExtensionContext, bundleName: string) {
    HTMLGenerator.context = context;
    HTMLGenerator.bundleName = bundleName;
    if (!HTMLGenerator.panel) {
      HTMLGenerator.panel = vscode.window.createWebviewPanel(
        "visualBasicCodeReactWebView",
        "Visual Basic Code React",
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "public"))
          ]
        }
      );
      HTMLGenerator.panel.onDidDispose(() => {
        HTMLGenerator.panel = null;
      });
    }
    HTMLGenerator.nonce = genNonce();
    HTMLGenerator.bundleUri();
    HTMLGenerator.refresh();
  }

  static refresh() {
    HTMLGenerator.panel.webview.html = HTMLGenerator.generateHTML();
  }

  private static bundleUri = () => {
    const diskPath = vscode.Uri.file(
      path.join(
        HTMLGenerator.context.extensionPath,
        "public",
        HTMLGenerator.bundleName
      )
    );
    return HTMLGenerator.panel.webview.asWebviewUri(diskPath);
  };

  static generateHTML = () => {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${
          HTMLGenerator.panel.webview.cspSource
        } https:; script-src 'nonce-${
      HTMLGenerator.nonce
    }' 'unsafe-eval'; style-src 'unsafe-inline'; />
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        *,
*::before,
*::after {
  box-sizing: border-box;
}
body,html {
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
body,
h1,
h2,
h3,
h4,
p,
ul[class],
ol[class],
li,
figure,
figcaption,
blockquote,
dl,
dd {
  margin: 0;
}
body {
  min-height: 100vh;
  scroll-behavior: smooth;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}
        </style>
        <title>React App</title>
      </head>
      <body>
        <div id="app"></div>
        <script nonce="${
          HTMLGenerator.nonce
        }" src="${HTMLGenerator.bundleUri()}"></script>
      </body>
    </html>`;
  };
}

// this method is called when your extension is deactivated
export function deactivate() {
  watcher.close();
  compiler.close();
  compiler = null;
}
