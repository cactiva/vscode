import { Node, Project, JsxElement, JsxFragment, JsxSelfClosingElement, SyntaxList } from 'ts-morph';
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
		let count = 0;
		const moveNode = (): any => {
			const source = project.getSourceFile(data.fileName);
			if (!source) return '';
			if (count === 1) return source.getText();

			const from = getNodeFromPath(source, data.from);
			let to = getNodeFromPath(source, data.to);
			const isMovingToSelf = data.to.indexOf(data.from) === 0;

			if (!isMovingToSelf && from && to && !from.wasForgotten() && !to.wasForgotten()) {
				const code = from.getText().trim();
				from.replaceWithText('');

				if (data.position === 'children') {
					if (to instanceof JsxElement || to instanceof JsxFragment) {
						const children = to.getChildren().map(e => e.getText());
						children.splice(1, 0, code);
						to.replaceWithText(children.join('\n'));
					} else if (to instanceof JsxSelfClosingElement) {
						const toCode = to.getText();
						const toTagUnclosed = toCode.substr(0, toCode.length - 2);
						to.replaceWithText(`${toTagUnclosed}>${code}</${to.getTagNameNode().getText()}>`);
					}
				} else if (data.position === 'after') {
					const parent = to.getParent();
					if (parent) {
						let toIndex = -1;
						let children: any = null;
						let syntaxList = null;
						if (parent instanceof JsxElement || parent instanceof JsxFragment) {
							syntaxList = to.getParentSyntaxList();
							if (!syntaxList) {
								syntaxList = parent.getChildSyntaxList();
							}
							if (syntaxList) {
								children = syntaxList.getChildren();
							}
						} else {
							children = parent.getChildren();
						}

						if (children) {
							children.forEach((e: any, index: number) => {
								if (e === to) {
									toIndex = index;
								}
							});
							if (toIndex >= 0) {
								const childrenText = children.map((e: any) => e.getText().trim());
								childrenText.splice(toIndex + (data.position === 'after' ? 1 : 0), 0, code).filter((e: any) => !!e);
								if (syntaxList) {
									syntaxList.replaceWithText(childrenText);
								} else {
									parent.replaceWithText(childrenText);
								}
							}
						}
					}

					// prevent hollowing whitespace from dragged parent node;
					const fromParentPath = data.from.split('.');
					fromParentPath.pop();
					const fromParent = getNodeFromPath(source, fromParentPath.join('.'));
					if (fromParent instanceof JsxElement || fromParent instanceof JsxFragment) {
						const children = fromParent
							.getChildren()
							.map(e => {
								if (e instanceof SyntaxList) {
									const c = e.getChildren();
									if (c) {
										return c
											.map(e => {
												return e.getText().trim();
											})
											.filter(e => !!e)
											.join('').trim();
									}
								}
								return e.getText().trim();
							})
							.filter(e => !!e);
						fromParent.replaceWithText(children.join(''));
					}
				}

				try {
					source.formatText();
				} catch (e) {
					console.log(source.getText());
				}
				return source.getText();
			} else {
				source.refreshFromFileSystem();
				count++;
				return moveNode();
			}
		};
		return moveNode();
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
