import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import http from "../lib/Request";

export class ProjectsProvider implements vscode.TreeDataProvider<Project> {

	private _onDidChangeTreeData: vscode.EventEmitter<Project | undefined> = new vscode.EventEmitter<Project | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Project | undefined> = this._onDidChangeTreeData.event;

	private increaseNum = 2;

	constructor(private workspaceRoot: string) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Project): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Project): Thenable<Project[]> {
		
		return new Promise(async (resolve)=>{
			this.increaseNum ++;
			console.log("getchildren:", element);
			const rs = await http.get("https://hemi.lianhaikeji.com/front/api/get_merchant_config/fe34dad8a03b4ffe82ac34b80b2229e8");
			console.log(rs);
			const defaultProject = new Project("默认项目"+this.increaseNum, "1.01", vscode.TreeItemCollapsibleState.Collapsed, {
				command: 'extension.openPackageOnNpm',
				title: '',
				arguments: ["moduleName"]
			});
			resolve([defaultProject]);
		});
	}
}

export class Project extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}-${this.version}`;
	}

	get description(): string {
		return this.version;
	}

	iconPath = {
		light: path.join(__filename, '..','..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..','..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';

}