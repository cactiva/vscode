import { observer } from 'mobx-react-lite';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Breadcrumb from 'vs/editor/cactiva/editor/canvas/Breadcrumb';
import SingleTag from 'vs/editor/cactiva/editor/canvas/SingleTag';
import html from 'vs/editor/cactiva/libs/html';
import { cactiva, IEditorNodeInfo } from 'vs/editor/cactiva/models/cactiva';
import { Node } from 'ts-morph';
import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';

export const generateNodeInfo = (node: Node, nodePath: string): IEditorNodeInfo => {
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
};

export default observer(() => {
	return html`
		<${DndProvider} backend=${HTML5Backend}>
			<div className="cactiva-canvas">
				<div className="cactiva-canvas-content">
					${cactiva.breadcrumbs.length > 0
						? html`
								<${SingleTag}
									nodePath=${cactiva.breadcrumbs[0].nodePath}
									node=${cactiva.breadcrumbs[0].node}
									onClick=${(node: Node, nodePath: string) => {
										console.log(nodePath);
										cactiva.breadcrumbs = [];
										getNodeFromPath(cactiva.source, nodePath, (n, path) => {
											cactiva.breadcrumbs.push(generateNodeInfo(n, path));
										});
										cactiva.selectedNode = cactiva.breadcrumbs[cactiva.breadcrumbs.length - 1];
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
