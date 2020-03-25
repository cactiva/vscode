import { Node, Project, JsxElement, JsxFragment } from 'ts-morph';
import { createSourceFile } from 'vs/editor/cactiva/models/worker/morph/createSourceFile';
import { generateChildNodes } from 'vs/editor/cactiva/models/worker/morph/generateChildNodes';
import { generateNodes } from 'vs/editor/cactiva/models/worker/morph/generateNodes';
import { getNodeAttributes } from 'vs/editor/cactiva/models/worker/morph/getNodeAttributes';
import { getNodeFromPath } from 'vs/editor/cactiva/models/worker/morph/getNodeFromPath';

const project = new Project();
const post = postMessage as any;

const reply = (id: number, type: string, message: any) => {
	post({
		id,
		type,
		message
	});
};

const actions: any = {
	'source:load': async (data: { fileName: string; content: string }) => {
		const sourceFile = createSourceFile(project, data.fileName, data.content);
		return generateNodes(sourceFile);
	},
	'node:getAttributes': async (data: { fileName: string; path: string }) => {
		const source = project.getSourceFile(data.fileName);
		if (!source) return [];

		const node = getNodeFromPath(source, data.path);
		if (node) return getNodeAttributes(node);
		return [];
	},
	'node:move': async (data: {
		fileName: string;
		from: string;
		to: string;
		position: 'children' | 'before' | 'after';
	}) => {
		const source = project.getSourceFile(data.fileName);
		if (!source) return '';

		const from = getNodeFromPath(source, data.from);
		const to = getNodeFromPath(source, data.to);

		if (from && to && !from.wasForgotten() && !to.wasForgotten()) {
			if (data.position === 'children') {
				const code = from.getText();
				from.replaceWithText('');

				if (to instanceof JsxElement || to instanceof JsxFragment) {
					const children = to.getChildren().map(e => e.getText());
					children.splice(1, 0, code);
					to.replaceWithText(children.join('\n'));
				}
			}
		}
		source.formatText();
		return source.getText();
	},
	'node:getCode': async (data: { fileName: string; path: string }) => {
		const source = project.getSourceFile(data.fileName);
		if (!source) return '';

		const node = getNodeFromPath(source, data.path);
		return node?.getChildren().map(e => {
			return { kind: e.getKindName(), text: e.getText() };
		});
	},
	'node:setCode': async (data: { fileName: string; path: string; code: string }) => {
		const source = project.getSourceFile(data.fileName);
		if (!source) return '';

		const node = getNodeFromPath(source, data.path);
		if (node) {
			source.replaceText([node.getStart(), node.getEnd()], data.code);
		}
		return source.getText();
	},
	'node:getNodePathAtPos': async (data: { fileName: string; pos: number }) => {
		const source = project.getSourceFile(data.fileName);
		if (!source) return '';

		const rawNode = source.getDescendantAtPos(data.pos);
		if (rawNode) {
			let cursor: any = rawNode;
			let rootIndex = -1;
			const rootNodes = generateChildNodes(source);
			while (cursor && !(cursor as any).cactivaPath) {
				rootIndex = rootNodes.indexOf(cursor as any);
				if (rootIndex >= 0) {
					break;
				}
				const parent: Node<any> = cursor.getParent();
				cursor = parent;
			}
			if (cursor) return cursor.cactivaPath;
		}
		return '';
	}
};

self.addEventListener('message', async function(event) {
	const data = event.data;
	const type = data.type;
	const id = data.id;
	if (type && id) {
		const action = actions[type];
		if (typeof action === 'function') {
			const result = await action(data.message);
			reply(id, type, result);
		} else {
			reply(id, type, `Action ${type}: NOT FOUND`);
		}
	}
});
