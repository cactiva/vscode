import {
	Expression,
	JsxAttribute,
	JsxElement,
	JsxExpression,
	JsxSelfClosingElement,
	Node,
	ObjectLiteralExpression,
	PropertyAssignment
} from 'ts-morph';

export default (node: Node) => {
	let style = {};
	if (node instanceof JsxSelfClosingElement) {
		const attr = node.getAttribute('style');
		if (attr instanceof JsxAttribute) {
			let initializer = attr?.getInitializer();
			if (!!initializer && initializer instanceof JsxExpression) {
				let expression = initializer?.getExpression();
				if (expression) style = parseStyle(expression);
			}
		}
	} else if (node instanceof JsxElement) {
		const openEl = node.getOpeningElement();
		const attr = openEl.getAttribute('style');

		if (attr instanceof JsxAttribute) {
			let initializer = attr?.getInitializer();
			if (!!initializer && initializer instanceof JsxExpression) {
				let expression = initializer?.getExpression();
				if (expression) style = parseStyle(expression);
			}
		}
	}
	return style;
};

const parseStyle = (expression: Expression) => {
	let style: any = {};
	if (expression instanceof ObjectLiteralExpression) {
		let properties = expression?.getProperties();
		for (const property of properties) {
			if (!!property && property instanceof PropertyAssignment) {
				const initializer = property.getInitializer();
				if (initializer) {
					style[property?.getName()] = initializer.compilerNode.getText();
				}
			}
		}
	}
	return style;
};
