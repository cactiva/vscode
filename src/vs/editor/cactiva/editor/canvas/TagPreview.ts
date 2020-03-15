import { observer } from 'mobx-react-lite';
import { Node } from 'ts-morph';
import 'vs/css!./TagPreview';
import html from 'vs/editor/cactiva/libs/html';
import { getImportClause } from 'vs/editor/cactiva/libs/morph/getNodeImport';
import { getStyle } from 'vs/editor/cactiva/libs/morph/getStyle';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import * as Tags from 'vs/editor/cactiva/libs/TagsPreview/index';
import { IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';

interface ITagPreview {
	canvas: IEditorCanvas;
	node: Node;
	nodePath: string;
	style?: any;
	isLast?: boolean;
	children?: any;
	onClick?: (node: Node, nodePath: string) => void;
}

export const TagPreview: React.FunctionComponent<ITagPreview> = observer(({ node, children }: ITagPreview) => {
	if (!node || (node && node.wasForgotten())) return null;
	let tagName = getTagName(node);
	let styleProp = getStyle(node);

	let importClause = '';
	switch (getImportClause(node)) {
		case 'react-native':
			importClause = 'ReactNative';
			break;
	}
	let Component = (Tags as any)[importClause];
	if (!!Component && !!Component[tagName]) {
		return html`
			<div className="tag-preview">
				<${Component[tagName]} style=${styleProp}>
					${children}
				<//>
			</div>
		`;
	}

	return html`
		<div className="tag-preview" style=${styleProp}>
			${children}
		</div>
	`;
});
