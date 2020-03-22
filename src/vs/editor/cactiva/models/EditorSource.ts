import { observable } from 'mobx';
import EditorBase from 'vs/editor/cactiva/models/EditorBase';
import EditorNode from 'vs/editor/cactiva/models/EditorNode';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';

export default class EditorSource extends EditorBase {
	@observable fileName: string;
	@observable content: string;
	@observable rootNodes: EditorNode[] = [];
	@observable canvas: EditorCanvas;
	@observable isReady: boolean = false;

	constructor(fileName: string, content: string, canvas: EditorCanvas) {
		super();

		this.fileName = fileName;
		this.content = content;
		this.canvas = canvas;
		if (fileName && content) {
			this.executeInWorker('source:load', {
				fileName,
				content
			}).then(data => {
				this.rootNodes = data.map((e: any) => {
					return new EditorNode({ ...e, source: this });
				});
				this.isReady = true;
			});
		}
	}

	continueWhenReady(): Promise<boolean> {
		return new Promise(resolve => {
			let i = 0;
			setInterval(() => {
				if (this.isReady) {
					resolve(true);
				}
				i++;

				if (i > 100) {
					resolve(false);
				}
			}, 50);
		});
	}

	async getNodeFromPath(
		nodePath: string,
		whenEachFound?: (node: EditorNode, path: string) => void
	): Promise<EditorNode | null> {
		if (!nodePath) null;

		if (!(await this.continueWhenReady())) return null;

		const pathArray = nodePath.split('.');
		const lastPath: string[] = [];

		let lastNode = { children: this.rootNodes };
		let continueLoop = true;
		pathArray.forEach((e, idx: number) => {
			if (!continueLoop) return;
			lastPath.push(e);
			const num = parseInt(e);
			const path = lastPath.join('.');
			const children = lastNode.children;
			const child = children[num];

			if (child) {
				if (whenEachFound) {
					whenEachFound(child, path);
				}
				lastNode = child;
			} else {
				continueLoop = false;
			}
		});

		if (lastNode instanceof EditorNode) return lastNode;
		return null;
	}
}
