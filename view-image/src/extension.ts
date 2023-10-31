import * as vscode from 'vscode';
import getWebviewContent from './panelContent';
import {searchFile} from './utils'

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "view-image" is now active!');
	// const workspacePath = vscode.workspace.workspaceFolders;
	// console.log(222, workspacePath)

	let disposable = vscode.commands.registerCommand('view-image', async () => {
		let panel = vscode.window.createWebviewPanel('view-image', 'view-image', vscode.ViewColumn.One);
		const dir = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		const files = await searchFile(dir);
		panel.webview.html = getWebviewContent(files, dir, panel, context.extensionUri);

		// let options = {
		// 	canSelectFiles: false,
		// 	canSelectFolders: true,
		// 	canSelectMany: false,
		// 	defaultUri: vscode.Uri.file("D:/VScode"),
		// 	openLabel: '选择文件夹'
		// }

		// vscode.window.showOpenDialog(options).then(res => {
		// 	if (res === undefined) {
		// 		vscode.window.showInformationMessage("can't open dir.")
		// 	} else {
		// 		vscode.window.showInformationMessage("open dir: " + res.toString())

		// 		const loadUri = res[0].path;
		// 		TreeViewProvider.initTreeViewItem(loadUri)
		// 	}
		// })
		// vscode.window.showInformationMessage('Hello World from view-image!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
