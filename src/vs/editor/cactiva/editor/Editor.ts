import { observer } from 'mobx-react-lite';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Node } from 'ts-morph';
import Breadcrumb from 'vs/editor/cactiva/editor/canvas/Breadcrumb';
import { Tag } from 'vs/editor/cactiva/editor/canvas/Tag';
import html from 'vs/editor/cactiva/libs/html';
import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { cactiva, IEditorNodeInfo } from 'vs/editor/cactiva/models/cactiva';
import { Range } from 'vs/editor/common/core/range';

export function generateNodeInfo(node: Node, nodePath: string): IEditorNodeInfo {
	return {
		node,
		nodePath,
		start: {
			line: node.getStartLineNumber(),
			column: node.getPos()
		},
		end: {
			line: node.getEndLineNumber(),
			column: node.getEnd()
		}
	};
}

export default observer(() => {
	let rootItem: any = null;
	if (cactiva.breadcrumbs.length > 0) {
		rootItem = cactiva.breadcrumbs[0];
	}

	return html`
		<${DndProvider} backend=${HTML5Backend}>
			<div className="cactiva-canvas">
				<div className="cactiva-canvas-content">
					${rootItem && !rootItem.node.wasForgotten()
						? html`
								<${Tag}
									nodePath=${rootItem.nodePath}
									node=${rootItem.node}
									onClick=${(_: Node, nodePath: string) => {
										if (cactiva.source) {
											cactiva.breadcrumbs = [];
											getNodeFromPath(cactiva.source, nodePath, (n, path) => {
												cactiva.breadcrumbs.push(generateNodeInfo(n, path));
											});
											cactiva.selectedNode = cactiva.breadcrumbs[cactiva.breadcrumbs.length - 1];
											const s = cactiva.selectedNode.start;
											const e = cactiva.selectedNode.end;
											cactiva.editor?.setSelection(new Range(s.line, s.column, e.line, e.column));
										}
									}}
								/>
						  `
						: html`
								<div>No Component to Render</div>
						  `}
				</div>
				<${Breadcrumb} />
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
