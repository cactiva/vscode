import { observer } from 'mobx-react-lite';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Node } from 'ts-morph';
import 'vs/css!./Editor';
import Breadcrumb from 'vs/editor/cactiva/editor/canvas/Breadcrumb';
import { Tag } from 'vs/editor/cactiva/editor/canvas/Tag';
import PropsEditor from 'vs/editor/cactiva/editor/props/PropsEditor';
import html from 'vs/editor/cactiva/libs/html';
import { selectNode } from 'vs/editor/cactiva/libs/morph/selectNode';
import { cactiva, IEditorCanvas, IEditorNodeInfo } from 'vs/editor/cactiva/models/cactiva';

export default observer(({ canvas }: { canvas: IEditorCanvas }) => {
	if (!canvas)
		return html`
			<div>Canvas can't be loaded</div>
		`;

	let rootItem: IEditorNodeInfo | null = null;
	if (canvas.breadcrumbs.length > 0) {
		rootItem = canvas.breadcrumbs[0];
	}

	const propsEditor = cactiva.propsEditor.el;
	const tagClicked = (_: Node, nodePath: string) => {
		if (canvas.source) {
			selectNode(canvas, nodePath, 'canvas');
		}
	};
	const breadcrumbClicked = (node: IEditorNodeInfo) => {
		selectNode(canvas, node.nodePath, 'breadcrumb');
	};
	const mode = cactiva.mode;

	return html`
		<${DndProvider} backend=${HTML5Backend}>
			${propsEditor &&
				html`
					<${PropsEditor} domNode=${propsEditor} />
				`}
			<div className="cactiva-canvas">
				<div className=${`cactiva-canvas-content ${mode}`}>
					${rootItem && !rootItem.node.get().wasForgotten()
						? html`
								<${Tag}
									canvas=${canvas}
									isLast=${true}
									nodePath=${rootItem.nodePath}
									node=${rootItem.node.get()}
									onClick=${tagClicked}
								/>
						  `
						: html`
								<div>No Component to Render</div>
						  `}
				</div>
				<${Breadcrumb} canvas=${canvas} onClick=${breadcrumbClicked} />
			</div>
		<//>
	`;
});
