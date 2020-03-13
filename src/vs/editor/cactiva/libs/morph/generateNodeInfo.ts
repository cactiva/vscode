import { IEditorNodeInfo } from 'vs/editor/cactiva/models/cactiva';
import { Node, JsxElement } from 'ts-morph';
import { getLeadingChar } from 'vs/editor/cactiva/libs/morph/getLeadingChar';
import { observable } from 'mobx';

export function generateNodeInfo(node: Node, nodePath: string): IEditorNodeInfo {
	const src = node.getSourceFile().getFullText();

	let startPos = node.getPos();
	if (node instanceof JsxElement) {
		startPos = node.getOpeningElement().getPos();
	}

	return {
		node: observable.box(node),
		nodePath,
		start: {
			line: node.getStartLineNumber(),
			column: getLeadingChar(src, startPos, true)
		},
		end: {
			line: node.getEndLineNumber(),
			column: getLeadingChar(src, node.getEnd())
		}
	};
}
