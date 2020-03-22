import { JsxElement, Node, JsxSelfClosingElement, JsxFragment } from 'ts-morph';
import { getLeadingChar } from 'vs/editor/cactiva/models/worker/morph/getLeadingChar';

export function generateNodeInfo(node: Node) {
	const src = node.getSourceFile().getFullText();

	let tagName: any = '';
	let startPos = node.getPos();
	if (node instanceof JsxElement) {
		startPos = node.getOpeningElement().getPos();
		tagName = (node.getOpeningElement().getTagNameNode() as any).compilerNode.getText();
	} else if (node instanceof JsxSelfClosingElement) {
		tagName = (node.getTagNameNode() as any).compilerNode.getText();
	} else if (node instanceof JsxFragment) {
		tagName = '</>';
	} else {
		tagName = node.getText();
	}

	return {
		text: tagName,
		kind: node.getKindName(),
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
