import { JsxElement, JsxFragment, JsxSelfClosingElement, Node, JsxExpression, JsxText } from 'ts-morph';

export function getTagName(node: Node): string {
	let n: any;
	let tagName = '';
	switch (true) {
		case node instanceof JsxText:
			n = node as JsxText;
			tagName = 'Text';
			break;
		case node instanceof JsxExpression:
			n = node as JsxFragment;
			tagName = '{…}';
			break;
		case node instanceof JsxFragment:
			n = node as JsxFragment;
			tagName = '</>';
			break;
		case node instanceof JsxSelfClosingElement:
			n = node as JsxSelfClosingElement;
			tagName = n.getTagNameNode().getText();
			break;
		case node instanceof JsxElement:
			n = node as JsxElement;
			tagName = n
				.getOpeningElement()
				.getTagNameNode()
				.getText();
			break;
	}

	if (tagName === '') {
		console.log(node);
	}
	return tagName;
}
