import { Node, JsxSelfClosingElement, JsxElement, ObjectLiteralExpression } from 'ts-morph';

export default (node: Node) => {
	let style = {};
	if (node instanceof JsxSelfClosingElement) {
		const attr = node.getAttribute('style');
		let initializer = attr?.getInitializer();
		if (!!initializer) {
			let expresion = initializer?.getExpression();
			style = parseStyle(expresion);
		}
	} else if (node instanceof JsxElement) {
		const openEl = node.getOpeningElement();
		const attr = openEl.getAttribute('style');
		let initializer = attr?.getInitializer();
		if (!!initializer) {
			let expresion = initializer?.getExpression();
			style = parseStyle(expresion);
		}
	}
	return style;
};

const parseStyle = (expresion: ObjectLiteralExpression) => {
	let style = {};
	if (expresion instanceof ObjectLiteralExpression) {
		let properties = expresion?.getProperties();
		for (const property of properties) {
			style[property?.getName()] = property.getInitializer().compilerNode.text;
		}
	}
	return style;
};
