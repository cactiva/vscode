import { observer } from 'mobx-react-lite';
import html from 'vs/editor/cactiva/libs/html';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import { cactiva, IEditorNodeInfo } from 'vs/editor/cactiva/models/cactiva';

export default observer(() => {
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
						${cactiva.breadcrumbs.map((nodeInfo: IEditorNodeInfo, idx: number) => {
							const tagName = getTagName(nodeInfo.node);
							return html`
								<div
									key=${idx}
									onClick=${() => {
										cactiva.selectedNode = nodeInfo;
									}}
									className="folder monaco-breadcrumb-item"
									role="listitem"
								>
									${idx === 0 &&
										html`
											<div className="breadcrumb-first-spacer"></div>
										`}
									<div className="monaco-icon-label">
										<div className="monaco-icon-label-container">
											<span className="monaco-icon-name-container"><a className="label-name"> ${tagName}</a></span
											><span className="monaco-icon-description-container"></span>
										</div>
									</div>
									${cactiva.breadcrumbs.length - 1 !== idx &&
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
