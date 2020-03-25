import { observer } from 'mobx-react-lite';
import { useDrop } from 'react-dnd';
import html from 'vs/editor/cactiva/libs/html';
import EditorNode from 'vs/editor/cactiva/models/EditorNode';

export default observer(
	(props: {
		bubbleHover: boolean;
		position: 'before' | 'after' | 'first-children' | 'last-children';
		node?: EditorNode;
		hovered?: boolean;
		index: number;
		onDrop: (from: EditorNode, to: EditorNode, pos: string) => void;
	}) => {
		const [drop, dropRef] = useDrop({
			accept: 'cactiva-tag',
			collect: monitor => ({
				hover: !!monitor.isOver({ shallow: true })
			}),
			drop: (item: any, monitor) => {
				if (monitor.isOver({ shallow: true })) {
					if (props.node) {
						props.onDrop(item.node, props.node, props.position);
					}
				}
			}
		});
		const hovered = drop.hover || props.hovered ? 'hover' : '';
		return html`
			<div
				ref=${dropRef}
				className=${`divider ${hovered}`}
				onMouseOver=${(e: any) => {
					if (!props.bubbleHover) {
						e.stopPropagation();
					}
				}}
			></div>
		`;
	}
);
