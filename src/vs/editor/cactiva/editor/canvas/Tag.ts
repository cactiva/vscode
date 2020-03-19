import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Node } from 'ts-morph';
import 'vs/css!./Tag';
import { TagChild } from 'vs/editor/cactiva/editor/canvas/tag/TagChild';
import { TagPreview } from 'vs/editor/cactiva/editor/canvas/tag/TagPreview';
import html from 'vs/editor/cactiva/libs/html';
import { getChildrenFromNode } from 'vs/editor/cactiva/libs/morph/getChildrenFromNode';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import { cactiva, IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';
import Divider from './tag/Divider';

interface ISingleTag {
	canvas: IEditorCanvas;
	node: Node;
	nodePath: string;
	style?: any;
	onClick?: (node: Node, nodePath: string) => void;
}

export const Tag: React.FunctionComponent<ISingleTag> = observer(
	({ canvas, node, style, onClick, nodePath }: ISingleTag) => {
		const [, dragRef] = useDrag({
			item: { type: 'cactiva-tag', node, dropEffect: 'none' },
			canDrag: monitor => {
				return true;
			},
			collect: monitor => ({
				opacity: monitor.isDragging() ? 0.5 : 1
			})
		});
		if (!node || (node && node.wasForgotten())) return null;

		let mode = cactiva.mode;
		let tagName = getTagName(node);
		const childrenNode = getChildrenFromNode(node);
		const hovered = canvas.hoveredNode === node ? 'hover' : '';
		const selected = canvas.selectedNode?.node.get() === node ? 'selected' : '';

		(node.compilerNode as any).cactivaPath = nodePath;
		(node.compilerNode as any).domRef = useRef(undefined as HTMLElement | undefined);

		dragRef((node.compilerNode as any).domRef);
		const hasChildren = childrenNode.length > 0;
		return html`
			<div
				ref=${(node.compilerNode as any).domRef}
				onClick=${(e: any) => {
					if (onClick) {
						onClick(node, nodePath);
						e.stopPropagation();
					}
				}}
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
							${childrenNode.map((e, idx) => {
								return html`
									<${TagChild}
										canvas=${canvas}
										Tag=${Tag}
										isLast=${idx === childrenNode.length - 1}
										key=${idx}
										e=${e}
										idx=${idx}
										onClick=${onClick}
										nodePath=${nodePath}
									/>
								`;
							})}
						`}
				<//>
			</div>
		`;
	}
);
