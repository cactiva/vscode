import { Project } from 'ts-morph';
import { createSourceFile } from 'vs/editor/cactiva/models/worker/morph/createSourceFile';
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
	'node:get-attributes': async (data: { fileName: string; path: string }) => {
		const source = project.getSourceFile(data.fileName);
		if (!source) return [];

		const node = getNodeFromPath(source, data.path);
		if (node) return getNodeAttributes(node);
		return [];
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
