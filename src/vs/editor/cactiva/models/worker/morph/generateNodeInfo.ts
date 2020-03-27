import { JsxElement, Node, JsxSelfClosingElement, JsxFragment, JsxText, JsxAttribute } from 'ts-morph';
import { getLeadingChar } from 'vs/editor/cactiva/models/worker/morph/getLeadingChar';
import { getValue, getValueLabel } from 'vs/editor/cactiva/models/worker/morph/getNodeAttributes';

export function generateNodeInfo(node: Node, withAttribute: boolean = true) {
	const src = node.getSourceFile().getFullText();

	let text: any = '';
	let expression: any = '';
	let startPos = node.getPos();
	const tagInfo = {
		attributes: {} as any
	};
	if (node instanceof JsxElement) {
		startPos = node.getOpeningElement().getPos();
		text = (node.getOpeningElement().getTagNameNode() as any).compilerNode.getText();

		const attr = node.getOpeningElement().getAttributes();
		(attr as any).map((e: JsxAttribute) => {
			tagInfo.attributes[e.getName()] = getValueLabel(e);
		});
	} else if (node instanceof JsxSelfClosingElement) {
		text = (node.getTagNameNode() as any).compilerNode.getText();

		const attr = node.getAttributes();
		(attr as any).map((e: JsxAttribute) => {
			tagInfo.attributes[e.getName()] = getValueLabel(e);
		});
	} else if (node instanceof JsxFragment) {
		text = '</>';
	} else if (node instanceof JsxText) {
		text = node.getText();
	} else {
		expression = node.getText().substr(0, 200);
		text = '{⋯}';
	}

	return {
		text,
		expression,
		kind: node.getKindName(),
		tag: tagInfo,
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
