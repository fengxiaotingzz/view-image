import { WebviewPanel, Uri, extensions } from "vscode";
import {diffImage} from './utils'

function getWebviewContent(files: string[], dir: string | undefined, panel: WebviewPanel, _extensionUri: Uri){
    let str = '';
    if (dir){
        diffImage(files)
        files.forEach(val => {
            const url = panel.webview.asWebviewUri(Uri.file(val))

            str += `<div class='img-wrap'>
                <img src="${url}" class='img'/>
                <div></div>
                <div>路径：${val}</div>
            </div>`;
        });
    }

    const styleResetUri = panel.webview.asWebviewUri(
        Uri.joinPath(_extensionUri, "src/panelContent.css")
      );

    return `
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <link href="${styleResetUri}" rel="stylesheet">
            </head>
            <body>
                <div class='img-list'>
                ${str}
                </div>
            </body>
        </html>
    `;
}

export default getWebviewContent;