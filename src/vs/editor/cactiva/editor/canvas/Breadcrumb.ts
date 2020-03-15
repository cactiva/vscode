import { observer } from 'mobx-react-lite';
import html from 'vs/editor/cactiva/libs/html';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import { IEditorNodeInfo, cactiva } from 'vs/editor/cactiva/models/cactiva';
import { URI } from 'vs/base/common/uri';
import 'vs/css!./Breadcrumb';

const icHybrid = URI.parse(require.toUrl('../../assets/images/ic-hybrid.svg'));
const icLayout = URI.parse(require.toUrl('../../assets/images/ic-layout.svg'));
const icPreview = URI.parse(require.toUrl('../../assets/images/ic-preview.svg'));

export default observer(({ canvas, onClick }: any) => {
	const mode = cactiva.mode;
	const changeMode = (mode: 'preview' | 'layout' | 'hybrid') => {
		cactiva.mode = mode;
	};
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
							const node = nodeInfo.node.get();
							if (node.wasForgotten()) return null;

							const tagName = getTagName(node);
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
					<div className="canvas-toolbar">
						<div
							className=${`btn btn-toolbar btn-layout ${mode === 'preview' ? 'active' : ''}`}
							onClick=${() => {
								changeMode('preview');
							}}
						>
							<img src=${icPreview} className="ic ic-preview" height="14" width="14" />
						</div>
						<div
							className=${`btn btn-toolbar btn-preview ${mode === 'hybrid' ? 'active' : ''}`}
							onClick=${() => {
								changeMode('hybrid');
							}}
						>
							<img src=${icHybrid} className="ic ic-hybrid" height="14" width="14" />
						</div>
						<div
							className=${`btn btn-toolbar btn-preview ${mode === 'layout' ? 'active' : ''}`}
							onClick=${() => {
								changeMode('layout');
							}}
						>
							<img src=${icLayout} className="ic ic-layout" height="14" width="14" />
						</div>
					</div>
					<div className="breadcrumb-first-spacer"></div>
				</div>
			</div>
			<style></style>
		</div>
	`;
});
