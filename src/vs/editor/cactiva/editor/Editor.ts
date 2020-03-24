import { observer, useObservable } from 'mobx-react-lite';
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
import { useEffect } from 'react';

export default observer(({ canvas }: { canvas: EditorCanvas }) => {
	const meta = useObservable({
		root: undefined as EditorNode | undefined
	});

	useEffect(() => {
		let rootItem: EditorNode | undefined = undefined;
		if (canvas.breadcrumbs.length > 0) {
			rootItem = canvas.breadcrumbs[0];
		}
		meta.root = rootItem;
	}, [canvas.breadcrumbs, canvas.breadcrumbs.length]);

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

	if (!meta.root) {
		return null;
	}

	if (!canvas) {
		return html`
			<div>Canvas can't be loaded</div>
		`;
	}

	return html`
		<${DndProvider} backend=${HTML5Backend}>
			${propsEditorEl &&
				html`
					<${PropsEditor} domNode=${propsEditorEl} />
				`}
			<div className="cactiva-canvas">
				<div className=${`cactiva-canvas-content ${mode}`}>
					${!meta.root
						? !canvas.isReady
							? null
							: html`
									<div>No Component to Render</div>
							  `
						: html`
								<${Tag} canvas=${canvas} isLast=${true} node=${meta.root} onClick=${tagClicked} />
						  `}
				</div>
				<${Breadcrumb} canvas=${canvas} onClick=${breadcrumbClicked} />
			</div>
		<//>
	`;
});
