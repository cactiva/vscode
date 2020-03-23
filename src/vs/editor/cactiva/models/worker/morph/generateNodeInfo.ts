import { JsxElement, Node, JsxSelfClosingElement, JsxFragment, JsxText } from 'ts-morph';
import { getLeadingChar } from 'vs/editor/cactiva/models/worker/morph/getLeadingChar';

export function generateNodeInfo(node: Node) {
	const src = node.getSourceFile().getFullText();

	let text: any = '';
	let expression: any = '';
	let startPos = node.getPos();
	if (node instanceof JsxElement) {
		startPos = node.getOpeningElement().getPos();
		text = (node.getOpeningElement().getTagNameNode() as any).compilerNode.getText();
	} else if (node instanceof JsxSelfClosingElement) {
		text = (node.getTagNameNode() as any).compilerNode.getText();
	} else if (node instanceof JsxFragment) {
		text = '</>';
	} else if (node instanceof JsxText) {
		text = node.getText();
	} else {
		expression = node.getText();
		text = '{⋯}';
	}

	return {
		text,
		expression,
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
