// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// function getFileContent(fileUri: vscode.Uri): any {
//   if (fs.existsSync(fileUri.fsPath)) {
//     let content = fs.readFileSync(fileUri.fsPath, "utf8");
//     let config: any = JSON.parse(content);

//     return config;
//   }
//   return undefined;
// }

const getLocalhost = async () => {
  const fullWebServerUri = await vscode.env.asExternalUri(
    vscode.Uri.parse(`http://localhost:3000`)
  );
  return fullWebServerUri;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.helloWorld",
    async () => {
      const panel = vscode.window.createWebviewPanel(
        "asExternalUriWebview",
        "asExternalUri Example",
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );
      const url = await getLocalhost();
      const cspSource = panel.webview.cspSource;
      console.log(url);
      panel.webview.html = `<!DOCTYPE html>
	  <head>
		  <meta
			  http-equiv="Content-Security-Policy"
			  content="default-src 'none'; frame-src ${url} ${cspSource} https:; img-src ${cspSource} https:; script-src ${cspSource}; style-src ${cspSource};"
		  />
	  </head>
	  <body>
	  <!-- All content from the web server must be in an iframe -->
	  <iframe src="${url}">
  </body>
  </html>`;
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
