import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export const createVSCodeRessource = (
  context: vscode.ExtensionContext,
  ...paths: string[]
): vscode.Uri => {
  const res = vscode.Uri.file(path.join(context.extensionPath, ...paths));
  return res;
};

export const getFileContent = (fileUri: vscode.Uri): string => {
  if (fs.existsSync(fileUri.fsPath)) {
    const content = fs.readFileSync(fileUri.fsPath, "utf8");
    return content;
  }
  return "";
};

export const getLocalhost = async () => {
  const fullWebServerUri = await vscode.env.asExternalUri(
    vscode.Uri.parse(`http://localhost:3000`)
  );
  return fullWebServerUri;
};
