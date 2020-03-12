import { observer } from 'mobx-react-lite';
import html from 'vs/editor/cactiva/libs/html';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import { IEditorNodeInfo } from 'vs/editor/cactiva/models/cactiva';

export default observer(({ canvas, onClick }: any) => {
	return html`
		<div className="tabs-breadcrumbs">
			<div className="breadcrumbs-control relative-path backslash-path">
				<div
					className="monaco-scrollable-element"
					role="presentation"
					style=${{
						position: 'relative',
						overflow: 'hidden'
					}}
				>
					<div
						className="monaco-breadcrumbs"
						role="list"
						style=${{
							background: 'transparent',
							overflow: 'hidden',
							width: '100%',
							height: '22px'
						}}
					>
						${canvas.breadcrumbs.map((nodeInfo: IEditorNodeInfo, idx: number) => {
							const node = nodeInfo.node;
							if (node.wasForgotten()) return null;

							const tagName = getTagName(nodeInfo.node);
							const hovered = canvas.hoveredNode === node ? 'hover' : '';
							const selected = canvas.selectedNode?.node === node ? 'selected' : '';
							return html`
								<div
									key=${idx}
									onClick=${() => {
										onClick(nodeInfo);
									}}
									onMouseOut=${() => {
										canvas.hoveredNode = undefined;
									}}
									onMouseOver=${(ev: any) => {
										canvas.hoveredNode = node;
										ev.stopPropagation();
									}}
									className="cactiva folder monaco-breadcrumb-item"
									role="listitem"
								>
									${idx === 0 &&
										html`
											<div className="breadcrumb-first-spacer"></div>
										`}
									<div className=${`monaco-icon-label ${selected} ${hovered}`}>
										<div className="monaco-icon-label-container">
											<span className="monaco-icon-name-container"><a className="label-name"> ${tagName}</a></span
											><span className="monaco-icon-description-container"></span>
										</div>
									</div>
									${canvas.breadcrumbs.length - 1 !== idx &&
										html`
											<div className="codicon codicon-chevron-right"></div>
										`}
								</div>
							`;
						})}
					</div>
				</div>
			</div>
			<style>
				.breadcrumb-first-spacer {
					width: 8px;
					height: 22pc;
				}
			</style>
		</div>
	`;
});
