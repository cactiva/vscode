import { JsxAttribute, JsxExpression, StringLiteral } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';
import { selectSourceFromNode } from 'vs/editor/cactiva/libs/morph/selectSourceFromNode';

export default ({ item }: { item: JsxAttribute }) => {
	if (!item || (item && item.wasForgotten())) return null;
	const kindName = getKindName(item);
	return html`
		<div
			className="prop row pointer highlight"
			onClick=${() => {
				const izer = item.getInitializer();
				if (izer) {
					if (izer instanceof JsxExpression) {
						const exp = izer.getExpression();
						if (exp) {
							if (exp instanceof StringLiteral) {
								selectSourceFromNode(exp, true, 1);
							} else {
								selectSourceFromNode(exp, true);
							}
						}
					} else if (izer instanceof StringLiteral) {
						selectSourceFromNode(izer, true, 1);
					}
				}
			}}
		>
			<div className="title">
				${item.getName()}
			</div>
			<div className="field row space-between">
				<div className="input">
					<div className="overflow">
						${kindName}
					</div>
				</div>
				<div className="goto-source row center ">
					▸
				</div>
			</div>
		</div>
	`;
};

function getKindName(item: JsxAttribute) {
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
