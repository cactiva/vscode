import { observer } from 'mobx-react-lite';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import 'vs/css!./Editor';
import PropsEditor from 'vs/editor/cactiva/editor/props/PropsEditor';
import html from 'vs/editor/cactiva/libs/html';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';
import { cactiva } from 'vs/editor/cactiva/models/store';
import { Tag } from 'vs/editor/cactiva/editor/canvas/Tag';
import EditorNode from 'vs/editor/cactiva/models/EditorNode';
import Breadcrumb from 'vs/editor/cactiva/editor/canvas/Breadcrumb';

export default observer(({ canvas }: { canvas: EditorCanvas }) => {
	if (!canvas)
		return html`
			<div>Canvas can't be loaded</div>
		`;

	let rootItem: EditorNode | undefined = undefined;
	if (canvas.breadcrumbs.length > 0) {
		rootItem = canvas.breadcrumbs[0];
	}

	const propsEditorEl = cactiva.propsEditor.el;
	const mode = cactiva.mode;

	const tagClicked = (node: EditorNode) => {
		if (canvas.source) {
			canvas.selectNode(node.path, 'canvas');
		}
	};
	const breadcrumbClicked = (node: EditorNode) => {
		canvas.selectNode(node.path, 'canvas');
	};

	return html`
		<${DndProvider} backend=${HTML5Backend}>
			${propsEditorEl &&
				html`
					<${PropsEditor} domNode=${propsEditorEl} />
				`}
			<div className="cactiva-canvas">
				<div className=${`cactiva-canvas-content ${mode}`}>
					${!rootItem
						? !canvas.isReady
							? null
							: html`
									<div>No Component to Render</div>
							  `
						: html`
								<${Tag} canvas=${canvas} isLast=${true} node=${rootItem} onClick=${tagClicked} />
						  `}
				</div>
				<${Breadcrumb} canvas=${canvas} onClick=${breadcrumbClicked} />
			</div>
		<//>
	`;
});
