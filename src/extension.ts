// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ProjectsProvider, Project } from './ProjectsView/ProjectsProvider';
import * as fs from 'fs';
import * as path from "path";
import { ComponentApi } from './api/ComponentApi';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsc-quick" is now active!');

	const projectsProvider = new ProjectsProvider();
	// vscode.window.registerTreeDataProvider('projectsView', projectsProvider);
	let projectView = vscode.window.createTreeView("projectsView", {
		canSelectMany: false,
		showCollapseAll: false,
		treeDataProvider: projectsProvider
	});
	context.subscriptions.push(projectView);

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	statusBarItem.text = "发布项目";
	statusBarItem.command = "extension.quick.publishProject";
	statusBarItem.show();

	context.subscriptions.push(vscode.commands.registerCommand('extension.quick.publishProject', async () => {
		vscode.window.showInformationMessage("发布项目");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.quick.refreshProjects', async () => {
		projectView.dispose();
		projectView = vscode.window.createTreeView("projectsView", {
			treeDataProvider: projectsProvider
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.quick.addComponent', async (item) => {
		if (item.type === 'project') {
			const inputBox = vscode.window.createInputBox();
			inputBox.placeholder = "请输入组件名称";
			inputBox.onDidAccept((e) => {
				if (inputBox.value) {
					// 添加项目
					const success = ComponentApi.addComponent({ projectId: item.id, componentName: inputBox.value, version: "0.0.1" });
					if (success) {
						vscode.window.showInformationMessage('添加成功');
						vscode.commands.executeCommand("extension.quick.refreshProjects");
					} else {
						vscode.window.showInformationMessage('添加失败');
					}
				}
				inputBox.dispose();
			});
			inputBox.show();
		}
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.quick.addProject', async () => {
		vscode.window.showInformationMessage('暂不支持自行添加项目');
	}));

	// 订阅事件
	context.subscriptions.push(vscode.commands.registerCommand('extension.quick.openComponent', async (item) => {
		if (item.type === 'component') {
			// 工作目录
			const workspace = vscode.workspace.getConfiguration('quick').get('workspace') + "";
			if (!workspace) {
				vscode.window.showInformationMessage('请先配置工作目录');
				return;
			}
			if (!fs.existsSync(workspace)) {
				vscode.window.showInformationMessage('工作目录不存在:' + workspace);
				return;
			}
			const projectName = "project_component_" + item.id;
			const projectPath = path.resolve(workspace, projectName);
			if (!fs.existsSync(projectPath)) {
				fs.mkdirSync(projectPath);
			}
			fs.writeFileSync(path.resolve(projectPath, "index.js"),
				`import {func} from "./func";
console.log("hello world");
func();
`);
			fs.writeFileSync(path.resolve(projectPath, "func.js"), `export default function(){
	console.log("hehe")
}`);

			let uri = vscode.Uri.file(projectPath);
			let success = await vscode.commands.executeCommand('vscode.openFolder', uri);
			console.log("打开文件夹:", success);
			vscode.commands.executeCommand("vscode.open", vscode.Uri.file(path.resolve(projectPath, "index.js")));
		}
	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }
