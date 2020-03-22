import { Node, JsxAttribute, JsxExpression, JsxAttributeLike, JsxSelfClosingElement, JsxElement } from 'ts-morph';
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
				...generateNodeInfo(e),
				name: e.getName(),
				valueLabel: getValueLabel(e)
			};
		});
	}
}

function getValueLabel(item: JsxAttribute) {
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
		ObjectLiteralExpression: '{ object }'
	} as any;

	return niceName[result] || text;
}
