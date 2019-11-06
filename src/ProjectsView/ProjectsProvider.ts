import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import http from "../lib/Request";
import { ProjectApi } from '../api/ProjectApi';

export class ProjectsProvider implements vscode.TreeDataProvider<Project> {

	refresh(): void {
	}

	getTreeItem(element: Project): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Project): Thenable<Project[]> {
		return new Promise(async (resolve, reject) => {
			if (!element) {
				const projects = await ProjectApi.loadMyProjects();
				resolve(projects.map((p: any) => {
					return new Project(p.id + "", p.name, "", 'project', vscode.TreeItemCollapsibleState.Collapsed);
				}));
			} else {
				const projects = await ProjectApi.loadProjectComponents(element.id);
				resolve(projects.map((p: any) => {
					return new Project('comp_' + p.id, p.componentName, p.version, 'component', vscode.TreeItemCollapsibleState.None, {
						command: 'extension.quick.openComponent',
						title: '',
						arguments: [p.id]
					});
				}));
			}
		});
	}
}

export class Project extends vscode.TreeItem {

	constructor(
		public readonly id: string,
		public readonly label: string,
		private version: string,
		private readonly type: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get description() {
		return `${this.version}`;
	}

	iconPath = this.type === 'project' ? {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'folder.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'folder.svg')
	} : {
			light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'vue.svg'),
			dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'vue.svg')
		};

	contextValue = 'dependency';

}