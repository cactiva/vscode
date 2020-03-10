import { observer } from 'mobx-react-lite';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Breadcrumb from 'vs/editor/cactiva/editor/canvas/Breadcrumb';
import SingleTag from 'vs/editor/cactiva/editor/canvas/SingleTag';
import html from 'vs/editor/cactiva/libs/html';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';

export default observer(() => {

	return html`
		<${DndProvider} backend=${HTML5Backend}>
			<div className="cactiva-canvas">
				<div className="cactiva-canvas-content">
					${cactiva.selectedNode
						? html`
								<${SingleTag}
									node=${cactiva.selectedNode.node}
									onClick=${(cnode: any) => {
										cactiva.selectedNode = {
											node: cnode,
											start: {
												line: cnode.getStartLineNumber(),
												column: cnode.getPos()
											},
											end: {
												line: cnode.getEndLineNumber(),
												column: cnode.getEnd()
											}
										};
										// console.log(editor.selectedNode.node, toJS(editor.selectedNode.start), toJS(editor.selectedNode.end))
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
				}
			</style>
		<//>
	`;
});
