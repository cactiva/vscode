import {
	Node,
	JsxAttribute,
	JsxExpression,
	JsxAttributeLike,
	JsxSelfClosingElement,
	JsxElement,
	ObjectLiteralExpression,
	PropertyAssignment,
	StringLiteral
} from 'ts-morph';
import { generateNodeInfo } from 'vs/editor/cactiva/models/worker/morph/generateNodeInfo';

export function getNodeAttributes(node: Node) {
	let attr: JsxAttributeLike[] | null = null;
	if (node instanceof JsxSelfClosingElement) {
		attr = node.getAttributes();
	} else if (node instanceof JsxElement) {
		attr = node.getOpeningElement().getAttributes();
	}

	if (attr) {
		return (attr as any).map((e: JsxAttribute) => {
			return {
				...generateNodeInfo(e, false),
				name: e.getName(),
				value: getValue(e),
				valueLabel: getValueLabel(e)
			};
		});
	}
}

export function getValue(item: JsxAttribute): any {
	const izer = item.getInitializer();
	if (izer instanceof JsxExpression) {
		const exp = izer.getExpression();
		if (exp instanceof ObjectLiteralExpression) {
			let obj: any = {};
			for (let prty of exp.getProperties()) {
				if (prty instanceof PropertyAssignment) {
					let key: string = prty.getName();
					obj[key] = parseValue(prty);
				}
			}
			return obj;
		}
	}
}

export function parseValue(item: PropertyAssignment) {
	let izer = item.getInitializer();
	if (izer instanceof StringLiteral) {
		let v = izer.getText();
		return v.slice(1, v.length - 1);
	}
	return izer?.getText();
}

export function getValueLabel(item: JsxAttribute) {
	const izer = item.getInitializer();
	let result = '';
	let text = '';
	if (izer) {
		if (izer instanceof JsxExpression) {
			const exp = izer.getExpression();
			if (exp) {
				result = exp.getKindName();
				text = exp.getText();
			}
		} else {
			result = izer.getKindName();
			text = izer.getText();
		}
	}

	const niceName = {
		ObjectLiteralExpression: '{ object }',
		StringLiteral: text.substr(1, text.length - 2)
	} as any;

	return niceName[result] || text;
}
