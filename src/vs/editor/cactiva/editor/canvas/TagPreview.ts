import { observer } from 'mobx-react-lite';
import { Node } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';
import { getImportClause } from 'vs/editor/cactiva/libs/morph/getNodeImport';
import getStyle from 'vs/editor/cactiva/libs/morph/getStyle';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import * as Tags from 'vs/editor/cactiva/libs/TagsPreview/index';
import { IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';
import { getChildrenFromNode } from 'vs/editor/cactiva/libs/morph/getChildrenFromNode';
import { TagChildPreview } from 'vs/editor/cactiva/editor/canvas/TagChildPreview';
import 'vs/css!./TagPreview';

interface ITagPreview {
	canvas: IEditorCanvas;
	node: Node;
	nodePath: string;
	style?: any;
	isLast?: boolean;
	onClick?: (node: Node, nodePath: string) => void;
}

export const TagPreview: React.FunctionComponent<ITagPreview> = observer(
	({ canvas, node, style, nodePath, isLast }: ITagPreview) => {
		if (!node || (node && node.wasForgotten())) return null;
		const childrenNode = getChildrenFromNode(node);
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
				<${Component[tagName]} className="tag-preview" style=${styleProp}>
					${childrenNode.length > 0 &&
						html`
							${childrenNode.map((e, idx) => {
								return html`
									<${TagChildPreview}
										canvas=${canvas}
										Tag=${TagPreview}
										isLast=${idx === childrenNode.length - 1}
										key=${idx}
										e=${e}
										idx=${idx}
										nodePath=${nodePath}
									/>
								`;
							})}
						`}
				<//>
			`;
		}

		return html`
			<div className="tag-preview" style=${styleProp}>
				${childrenNode.length > 0 &&
					html`
						${childrenNode.map((e, idx) => {
							return html`
								<${TagChildPreview}
									canvas=${canvas}
									Tag=${TagPreview}
									isLast=${idx === childrenNode.length - 1}
									key=${idx}
									e=${e}
									idx=${idx}
									nodePath=${nodePath}
								/>
							`;
						})}
					`}
			</div>
		`;
	}
);
