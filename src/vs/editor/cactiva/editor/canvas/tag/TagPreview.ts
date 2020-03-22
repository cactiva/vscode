import { observer } from 'mobx-react-lite';
import { Node } from 'ts-morph';
import 'vs/css!./TagPreview';
import html from 'vs/editor/cactiva/libs/html';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';

interface ITagPreview {
	canvas: EditorCanvas;
	node: Node;
	nodePath: string;
	style?: any;
	isLast?: boolean;
	children?: any;
	onClick?: (node: Node, nodePath: string) => void;
	className?: string;
	tagName: string;
}

export const TagPreview: React.FunctionComponent<ITagPreview> = observer(
	({ node, children, className, tagName }: ITagPreview) => {
		return html`
			<div className=${`tag-preview ${className}`}>
				${children}
			</div>
		`;
	}
);
