import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import 'vs/css!./Tag';
import { TagChild } from 'vs/editor/cactiva/editor/canvas/tag/TagChild';
import { TagPreview } from 'vs/editor/cactiva/editor/canvas/tag/TagPreview';
import html from 'vs/editor/cactiva/libs/html';
import { useCallbackRef } from 'vs/editor/cactiva/libs/useCallbackRef';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';
import EditorNode from 'vs/editor/cactiva/models/EditorNode';
import { cactiva } from 'vs/editor/cactiva/models/store';
import Divider from './tag/Divider';
import { debounce } from 'lodash';

interface ISingleTag {
	canvas: EditorCanvas;
	node: EditorNode;
	style?: any;
	isLast?: boolean;
	onClick?: (node: EditorNode) => void;
}

export const Tag: React.FunctionComponent<ISingleTag> = observer(({ canvas, node, style, onClick }: ISingleTag) => {
	const [, dragRef, preview] = useDrag({
		item: { type: 'cactiva-tag', node, dropEffect: 'none' },
		canDrag: monitor => {
			return true;
		}
	});
	const onDrop = debounce(async (from: EditorNode, to: EditorNode, pos: string) => {
		const editor = node.source.canvas.editor;
		if (editor) {
			await to.prependChild(from);
			await node.source.canvas.selectNode(to.path + '.0', 'canvas');
		}
	});
	const [drop, dropRef] = useDrop({
		accept: 'cactiva-tag',
		collect: monitor => ({
			hover: !!monitor.isOver({ shallow: true })
		}),
		drop: (item: any, monitor) => {
			if (monitor.isOver({ shallow: true })) {
				onDrop(item.node, node, 'children');
			}
		}
	});

	const mode = cactiva.mode;
	const tagName = node.text;
	const childrenNode = node.children;
	const hovered = canvas.hoveredNode === node ? 'hover' : '';
	const selected = canvas.selectedNode === node ? 'selected' : '';
	const hasChildren = childrenNode.length > 0;
	const domRef = useCallbackRef(null as HTMLElement | null, val => {
		node.domRef = val;
	});

	useEffect(() => {
		node.domRef = domRef.current;
	}, [node]);

	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
	}, []);

	dragRef(domRef);
	dropRef(domRef);

	return html`
		<div
			onClick=${(e: any) => {
				if (onClick) {
					onClick(node);
					if (node === canvas.selectedNode) {
						if (cactiva.propsEditor.mode === 'popup') {
							cactiva.propsEditor.hidden = false;
						}
					}
					e.stopPropagation();
				}
			}}
			ref=${domRef}
			onContextMenu=${(e: any) => {
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
				${mode !== 'preview' &&
					html`
						<${Divider} onDrop=${onDrop} position="children" hovered=${drop.hover} node=${node} index=${0} />
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
