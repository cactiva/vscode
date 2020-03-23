import { Node } from 'ts-morph';
import { generateChildNodes } from 'vs/editor/cactiva/models/worker/morph/generateChildNodes';
import { generateNodeInfo } from 'vs/editor/cactiva/models/worker/morph/generateNodeInfo';

interface IEditorNodeIPC {
	start: any;
	end: any;
	path: string;
	text: string;
	children: IEditorNodeIPC[];
}

export function generateNodes(source: Node, path?: string): IEditorNodeIPC[] {
	const rootNodes = generateChildNodes(source);
	const pathArray = path?.split('.') || [];

	return rootNodes.map((e, idx) => {
		const nodeInfo = generateNodeInfo(e);
		const nodePath = [...pathArray, idx].join('.');
		if (e) {
			(e as any).cactivaPath = nodePath;
		}
		return {
			...nodeInfo,
			path: nodePath,
			children: generateNodes(e, nodePath)
		};
	});
}
