import { observer } from 'mobx-react-lite';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { JsxElement, Node } from 'ts-morph';
import Breadcrumb from 'vs/editor/cactiva/editor/canvas/Breadcrumb';
import { Tag } from 'vs/editor/cactiva/editor/canvas/Tag';
import PropsEditor from 'vs/editor/cactiva/editor/props/PropsEditor';
import html from 'vs/editor/cactiva/libs/html';
import { getLeadingChar } from 'vs/editor/cactiva/libs/morph/getLeadingChar';
import { selectNode } from 'vs/editor/cactiva/libs/morph/selectNode';
import { cactiva, IEditorCanvas, IEditorNodeInfo } from 'vs/editor/cactiva/models/cactiva';
import { Range } from 'vs/editor/common/core/range';

export function generateNodeInfo(node: Node, nodePath: string): IEditorNodeInfo {
	const src = node.getSourceFile().getFullText();

	let startPos = node.getPos();
	if (node instanceof JsxElement) {
		startPos = node.getOpeningElement().getPos();
	}

	return {
		node,
		nodePath,
		start: {
			line: node.getStartLineNumber(),
			column: getLeadingChar(src, startPos, true)
		},
		end: {
			line: node.getEndLineNumber(),
			column: getLeadingChar(src, node.getEnd())
		}
	};
}

export default observer(({ canvas }: { canvas: IEditorCanvas }) => {
	if (!canvas)
		return html`
			<div>Canvas can't be loaded</div>
		`;

	let rootItem: any = null;
	if (canvas.breadcrumbs.length > 0) {
		rootItem = canvas.breadcrumbs[0];
	}

	const sidebarEl = cactiva.propsEditor.el;
	const tagClicked = (_: Node, nodePath: string) => {
		if (canvas.source) {
			selectNode(canvas, nodePath, true);
		}
	};
	const breadcrumbClicked = (node: IEditorNodeInfo) => {
		canvas.selectedNode = node;
		cactiva.propsEditor.nodeInfo = canvas.selectedNode;

		const s = canvas.selectedNode.start;
		const e = canvas.selectedNode.end;
		canvas.editor?.setSelection(new Range(s.line, s.column, e.line, e.column));
		canvas.editor?.revealLineNearTop(s.line);
	};
	return html`
		<${DndProvider} backend=${HTML5Backend}>
			${sidebarEl &&
				html`
					<${PropsEditor} domNode=${sidebarEl} />
				`}
			<div className="cactiva-canvas">
				<div className="cactiva-canvas-content">
					${rootItem && !rootItem.node.wasForgotten()
						? html`
								<${Tag}
									canvas=${canvas}
									isLast=${true}
									nodePath=${rootItem.nodePath}
									node=${rootItem.node}
									onClick=${tagClicked}
								/>
						  `
						: html`
								<div>No Component to Render</div>
						  `}
				</div>
				<${Breadcrumb} canvas=${canvas} onClick=${breadcrumbClicked} />
			</div>
			<style>
				.cactiva-canvas {
					display: flex;
					flex-direction: column;
					width: 100%;
					height: 100%;
				}

				.cactiva-canvas-content {
					display: flex;
					flex-direction: column;
					flex: 1;
					background: white;
					margin: 5px;
					margin-bottom: 2px;
					border-radius: 5px;
					padding: 10px;
					overflow-y: auto;
				}
			</style>
		<//>
	`;
});
