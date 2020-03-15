import { observer } from 'mobx-react-lite';
import { Node } from 'ts-morph';
import 'vs/css!./TagPreview';
import html from 'vs/editor/cactiva/libs/html';
import { getImportClause } from 'vs/editor/cactiva/libs/morph/getNodeImport';
import { getStyle } from 'vs/editor/cactiva/libs/morph/getStyle';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import * as Tags from 'vs/editor/cactiva/libs/TagsPreview/index';
import { IEditorCanvas, cactiva } from 'vs/editor/cactiva/models/cactiva';

interface ITagPreview {
	canvas: IEditorCanvas;
	node: Node;
	nodePath: string;
	style?: any;
	isLast?: boolean;
	children?: any;
	onClick?: (node: Node, nodePath: string) => void;
	className?: string;
}

export const TagPreview: React.FunctionComponent<ITagPreview> = observer(
	({ node, children, className }: ITagPreview) => {
		if (!node || (node && node.wasForgotten())) return null;
		let tagName = getTagName(node);
		let styleProp = cactiva.mode !== 'layout' ? getStyle(node) : {};

		let importClause = '';
		switch (getImportClause(node)) {
			case 'react-native':
				importClause = 'ReactNative';
				break;
		}
		let Component = (Tags as any)[importClause];
		if (!!Component && !!Component[tagName]) {
			return html`
				<${Component[tagName]} className=${`tag-preview ${className}`} style=${styleProp}>
					${children}
				<//>
			`;
		}

		return html`
			<div className=${`tag-preview ${className}`} style=${styleProp}>
				${children}
			</div>
		`;
	}
);
