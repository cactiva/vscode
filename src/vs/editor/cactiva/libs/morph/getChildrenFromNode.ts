import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';
import { JsxSelfClosingElement, JsxExpression, JsxElement, JsxFragment, JsxText, Node } from 'ts-morph';

export const getChildrenFromNode = (node: Node): Node[] => {
	const list = [] as Node[];
	walkNode(node, (node: Node) => {
		if (
			node instanceof JsxSelfClosingElement ||
			node instanceof JsxExpression ||
			node instanceof JsxElement ||
			node instanceof JsxFragment ||
			node instanceof JsxText
		) {
			list.push(node);
			return false;
		}
		return true;
	});
	return list;
};
