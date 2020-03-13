import { observer } from 'mobx-react-lite';
import html from 'vs/editor/cactiva/libs/html';
import * as ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import { getNodeAttributes } from 'vs/editor/cactiva/libs/morph/getNodeAttributes';
import { List } from 'office-ui-fabric-react';
import { JsxAttributeLike } from 'ts-morph';
import Attribute from 'vs/editor/cactiva/editor/props/Attribute';

export default observer(({ domNode }: any) => {
	let bgColor = 'white';
	let fontColor = 'black';

	const pe = cactiva.propsEditor;
	const sidebar = document.getElementById('workbench.parts.sidebar');

	if (sidebar) {
		bgColor = sidebar.style.backgroundColor;
		fontColor = sidebar.style.color;
	}

	useEffect(() => {
		pe.hidden = false;
	}, [pe.nodeInfo]);

	useEffect(() => {
		const mo = new MutationObserver(() => {
			// pe.hidden = true;
		});

		const sidebar = document.getElementById('workbench.parts.sidebar');
		if (sidebar) {
			mo.observe(sidebar, { childList: true, subtree: true });
		}
		return () => {
			mo.disconnect();
		};
	}, []);

	if (!pe.nodeInfo) return null;

	const attributes = getNodeAttributes(pe.nodeInfo.node);
	return ReactDOM.createPortal(
		html`
			<div className="cactiva-props-editor" style=${{ display: pe.hidden ? 'none' : 'flex' }}>
				<div className="title row pad space-between">
					<div>${getTagName(pe.nodeInfo.node)}</div>
					<div
						className="close-btn center"
						onClick=${() => {
							pe.hidden = !pe.hidden;
						}}
					>
						×
					</div>
				</div>
				<div>
					<${List}
						items=${attributes}
						onRenderCell=${(item: JsxAttributeLike, index: number): JSX.Element => {
							return html`
								<${Attribute} item=${item} />
							`;
						}}
					/>
				</div>
				<style>
					.cactiva-props-editor {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						z-index: 9;
						background: ${bgColor};
						display: flex;
						flex-direction: column;
					}

					.cactiva-props-editor div {
						display: flex;
						flex-direction: column;
						color: ${fontColor};
					}

					.cactiva-props-editor .pad {
						padding: 5px;
					}

					.cactiva-props-editor .full {
						flex: 1;
					}
					.cactiva-props-editor .row {
						align-items: center;
						flex-direction: row;
					}
					.cactiva-props-editor .center {
						align-items: center;
						justify-content: center;
					}
					.cactiva-props-editor .space-between {
						justify-content: space-between;
					}

					.cactiva-props-editor .close-btn {
						width: 16px;
						height: 16px;
						cursor: pointer;
						font-size: 18px;
					}

					.cactiva-props-editor .pointer {
						cursor: pointer;
					}

					.cactiva-props-editor .title {
						padding-left: 10px;
					}

					.cactiva-props-editor .ms-List-cell .prop {
						padding: 3px;
						border-bottom: 1px dotted ${fontColor};
						overflow: hidden;
					}

					.cactiva-props-editor .ms-List-cell:first-child .prop {
						border-top: 1px dotted ${fontColor};
					}

					.cactiva-props-editor .prop .title {
						flex-basis: 30%;
						min-width: 70px;
						max-width: 150px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						word-break: break-all;
					}

					.cactiva-props-editor .prop .field,
					.cactiva-props-editor .prop .field .input {
						flex: 1;
					}

					.cactiva-props-editor .prop .field .goto-source {
						flex-basis: 20px;
						display: none;
					}

					.cactiva-props-editor .prop:hover .field .goto-source {
						display: flex;
					}
					.cactiva-props-editor .prop:hover .field .goto-source:focus {
						opacity: 0.5;
					}
				</style>
			</div>
		`,
		domNode
	);
});
