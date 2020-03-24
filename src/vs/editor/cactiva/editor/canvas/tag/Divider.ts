import { observer } from 'mobx-react-lite';
import { Node } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';
import { useDrop } from 'react-dnd';

export default observer(
	(props: {
		bubbleHover: boolean;
		position: 'before' | 'after' | 'first-children' | 'last-children';
		node?: Node;
		hovered?: boolean;
		index: number;
		onDrop: (item: any) => void;
	}) => {
		const [drop, dropRef] = useDrop({
			accept: 'cactiva-tag',
			collect: monitor => ({
				hover: !!monitor.isOver({ shallow: true })
			}),
			drop: (item, monitor) => {
				if (monitor.isOver({ shallow: true })) {
					props.onDrop(item);
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
