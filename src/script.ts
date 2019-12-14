// (function() {
//   const vscode = acquireVsCodeApi();
//   const iframe = document.getElementById("vsbasic-react");
//   const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
//   const heading = document.getElementById("test");
//   iframe.addEventListener("load", evt => {
//     console.log(evt.target === iframe);
//     console.log(evt.target);
//   });
//   // Alert the extension when our cat introduces a bug
//   vscode.postMessage({
//     command: "alert",
//     text: innerDoc
//   });
// })();
