import { observer } from 'mobx-react-lite';
import { useDragLayer, XYCoord } from 'react-dnd';
import html from 'vs/editor/cactiva/libs/html';

const layerStyles: React.CSSProperties = {
	position: 'fixed',
	pointerEvents: 'none',
	zIndex: 100,
	left: 0,
	top: 0,
	width: '100%',
	height: '100%'
};

export default observer(() => {
	const { isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
		item: monitor.getItem(),
		initialOffset: monitor.getInitialSourceClientOffset(),
		currentOffset: monitor.getSourceClientOffset(),
		isDragging: monitor.isDragging()
	}));

	if (!isDragging) {
		return null;
	}
	return html`
		<div style=${layerStyles}>
			<div style=${getItemStyles(initialOffset, currentOffset)}>
				<div
					className="singletag hover dragging"
					style=${!!item.size && {
						width: item.size.w,
						height: item.size.h
					}}
				>
					${item.text}
				</div>
			</div>
		</div>
	`;
});

function getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null) {
	if (!initialOffset || !currentOffset) {
		return {
			display: 'none'
		};
	}

	let { x, y } = currentOffset;
	const transform = `translate(${x}px, ${y}px)`;
	return {
		transform,
		WebkitTransform: transform
	};
}
