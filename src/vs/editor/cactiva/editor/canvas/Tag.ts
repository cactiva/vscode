import { observer } from 'mobx-react-lite';
import 'vs/css!./Tag';
import { TagChild } from 'vs/editor/cactiva/editor/canvas/tag/TagChild';
import { TagPreview } from 'vs/editor/cactiva/editor/canvas/tag/TagPreview';
import html from 'vs/editor/cactiva/libs/html';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';
import EditorNode from 'vs/editor/cactiva/models/EditorNode';
import { cactiva } from 'vs/editor/cactiva/models/store';
import Divider from './tag/Divider';
import { useRef } from 'react';

interface ISingleTag {
	canvas: EditorCanvas;
	node: EditorNode;
	style?: any;
	onClick?: (node: EditorNode) => void;
}

export const Tag: React.FunctionComponent<ISingleTag> = observer(({ canvas, node, style, onClick }: ISingleTag) => {
	// const [, dragRef] = useDrag({
	// 	item: { type: 'cactiva-tag', node, dropEffect: 'none' },
	// 	canDrag: monitor => {
	// 		return true;
	// 	},
	// 	collect: monitor => ({
	// 		opacity: monitor.isDragging() ? 0.5 : 1
	// 	})
	// });
	let mode = cactiva.mode;
	let tagName = node.text;
	const childrenNode = node.children;
	const hovered = canvas.hoveredNode === node ? 'hover' : '';
	const selected = canvas.selectedNode === node ? 'selected' : '';

	const hasChildren = childrenNode.length > 0;
	const domRef = useRef(null as HTMLElement | null);
	node.domRef = domRef;
	return html`
		<div
			onClick=${(e: any) => {
				if (onClick) {
					onClick(node);
					e.stopPropagation();
				}
			}}
			ref=${domRef}
			onContextMenu=${(e: any) => {
				console.log(e);
				e.stopPropagation();
			}}
			onMouseOut=${() => {
				canvas.hoveredNode = undefined;
			}}
			onMouseOver=${(e: any) => {
				canvas.hoveredNode = node;
				e.stopPropagation();
			}}
			className=${`singletag vertical ${selected} ${hovered} ${mode}`}
			style=${style}
		>
			${mode !== 'preview' &&
				html`
					<div className="headertag">
						<span className="tagname"> ${tagName} </span>
					</div>
				`}
			<${TagPreview} className="children" node=${node} tagName=${tagName}>
				${hasChildren &&
					mode !== 'preview' &&
					html`
						<${Divider} position="before" node=${childrenNode[0]} index=${0} />
					`}
				${hasChildren &&
					html`
						${childrenNode.map((e: EditorNode, idx) => {
							return html`
								<${TagChild}
									canvas=${canvas}
									Tag=${Tag}
									isLast=${idx === childrenNode.length - 1}
									key=${idx}
									node=${e}
									idx=${idx}
									onClick=${onClick}
									nodePath=${node.path}
								/>
							`;
						})}
					`}
			<//>
		</div>
	`;
});
