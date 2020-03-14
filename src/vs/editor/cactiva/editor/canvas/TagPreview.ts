import { observer } from 'mobx-react-lite';
import { Node } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';
import { getImportClause } from 'vs/editor/cactiva/libs/morph/getNodeImport';
import getStyle from 'vs/editor/cactiva/libs/morph/getStyle';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import * as Tags from 'vs/editor/cactiva/libs/TagsPreview/index';

interface ITagPreview {
	children?: any;
	node: Node;
	nodePath: string;
	style?: any;
	onClick?: (node: Node, nodePath: string) => void;
}

export const TagPreview: React.FunctionComponent<ITagPreview> = observer((props: ITagPreview) => {
	const { node } = props;
	if (!node || (node && node.wasForgotten())) return null;
	let tagName = getTagName(node);
	let style = getStyle(node);
	let importClause = '';
	switch (getImportClause(node)) {
		case 'react-native':
			importClause = 'ReactNative';
			break;
	}
	let Component = (Tags as any)[importClause];
	if (!Component) return false;
	else if (!Component[tagName]) return false;
	return html`
		<${Component[tagName]} style=${style}>
			Tes
		<//>
	`;
});
