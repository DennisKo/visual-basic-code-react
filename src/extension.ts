import * as vscode from "vscode";
import HTMLProvider from "./HTMLProvider";
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

      const html = createVSCodeRessource(context, "assets", "index.html");
      const htmlContent = getFileContent(html);
      panel.webview.html = new HTMLProvider(
        htmlContent,
        panel.webview,
        html.path
      ).generateHTML();
    }
  );
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
