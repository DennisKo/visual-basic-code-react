import * as vscode from "vscode";
import * as path from "path";

export default class HTMLProvider {
  private _changedLinks = new Map<string, string>();
  rawHtml: string;
  webview: vscode.Webview;
  workingDir: string;

  constructor(rawHtml: string, webview: vscode.Webview, workingDir: string) {
    this.rawHtml = rawHtml;
    this.webview = webview;
    this.workingDir = workingDir;
  }

  generateHTML(): string {
    const fixedLinksHtml = this.fixLinks();
    const replacedUrlsHtml = this.replaceUrlToVscodeResource(fixedLinksHtml);
    return replacedUrlsHtml;
  }

  private replaceUrlToVscodeResource = (htmlContent: string): string => {
    return htmlContent.replace(/url\((.*)\)/gim, (subString, p1) => {
      return this.replaceUrlHandler(subString, p1);
    });
  };

  private replaceUrlHandler = (subString: string, p1: string): string => {
    if (
      (p1.startsWith(`'`) && p1.endsWith(`'`)) ||
      (p1.startsWith(`"`) && p1.endsWith(`"`))
    ) {
      p1 = p1.substring(1, p1.length - 1);
    }
    if (p1.startsWith("http")) {
      return subString;
    }
    const vscodePath = this.getVscodeResourcePath(p1);
    return subString.replace(p1, vscodePath);
  };

  private getVscodeResourcePath = (relativePath: string): string => {
    const filePath = vscode.Uri.file(
      path.join(path.dirname(this.workingDir), relativePath)
    );
    const webViewResFile = this.webview.asWebviewUri(filePath);
    return path.normalize(webViewResFile.path);
  };

  private fixLinks = (): string => {
    // return html;
    return this.rawHtml.replace(
      new RegExp(
        `((?:${["src", "href"].join("|")})=[\'\"])((?!http|\\/).*?)([\'\"])`,
        "gmi"
      ),
      (
        subString: string,
        prefix: string,
        resFilePath: string,
        postFix: string
      ): string => {
        let fsPath = vscode.Uri.file(
          path.join(path.dirname(this.workingDir), resFilePath)
        ).fsPath;

        let changedLinkPath = this._changedLinks.get(fsPath);
        if (changedLinkPath) {
          return [`react-${prefix}`, fsPath, postFix].join("");
        } else {
          return [
            prefix,
            this.getVscodeResourcePath(resFilePath),
            postFix
          ].join("");
        }
      }
    );
  };
}
