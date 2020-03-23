import { JsxSelfClosingElement, JsxExpression, JsxElement, JsxFragment, JsxText, Node, JsxAttribute } from 'ts-morph';
import { walkNode } from 'vs/editor/cactiva/models/worker/morph/walkNode';

export function generateChildNodes(node: Node): Node[] {
	const list = [] as Node[];
	walkNode(node, (node: Node, meta: any) => {
		if (
			node instanceof JsxSelfClosingElement ||
			node instanceof JsxExpression ||
			node instanceof JsxElement ||
			node instanceof JsxFragment ||
			node instanceof JsxText
		) {
			if (node instanceof JsxExpression) {
				if (meta && meta.isAttribute) {
					return false;
				}
			}
			list.push(node);
			return false;
		}
		if (node instanceof JsxAttribute) {
			return { isAttribute: true };
		}
		return {};
	});
	return list.filter(e => {
		return !!e && !e.wasForgotten() && !!e.getText && !!e.getText().trim();
	});
}
