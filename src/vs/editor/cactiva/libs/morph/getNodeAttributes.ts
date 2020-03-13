import { Node, JsxSelfClosingElement, JsxElement, JsxAttributeLike } from 'ts-morph';

export function getNodeAttributes(node: Node): JsxAttributeLike[] {
	if (node instanceof JsxSelfClosingElement) {
		return node.getAttributes();
	} else if (node instanceof JsxElement) {
		return node.getOpeningElement().getAttributes();
	}
	return [];
}
