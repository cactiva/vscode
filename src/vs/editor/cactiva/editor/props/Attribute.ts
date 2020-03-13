import { JsxAttribute, JsxExpression } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';
import { selectSourceFromNode } from 'vs/editor/cactiva/libs/morph/selectSourceFromNode';

export default ({ item }: { item: JsxAttribute }) => {
	if (!item || (item && item.wasForgotten())) return null;
	const kindName = getKindName(item);
	return html`
		<div
			className="prop row pointer highlight"
			onClick=${() => {
				selectSourceFromNode(item);
			}}
		>
			<div className="title">
				${item.getName()}
			</div>
			<div className="field row space-between">
				<div className="input">
					${kindName}
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
	if (izer) {
		if (izer instanceof JsxExpression) {
			const exp = izer.getExpression();
			if (exp) {
				result = exp.getKindName();
			}
		} else {
			result = izer.getKindName();
		}
	}

	const niceName = {
		ObjectLiteralExpression: '{ object }',
		StringLiteral: '...string...'
	} as any;

	return niceName[result] || result;
}
