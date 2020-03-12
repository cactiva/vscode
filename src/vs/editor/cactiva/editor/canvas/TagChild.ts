import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { JsxElement, JsxExpression, JsxFragment, JsxSelfClosingElement, Node, JsxText } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';
import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';
import Divider from './Divider';

export const TagChild = observer(({ idx, onClick, nodePath, e, Tag }: any) => {
	if (!e || (e && e.wasForgotten())) return null;

	if (e instanceof JsxFragment || e instanceof JsxSelfClosingElement || e instanceof JsxElement) {
		return html`
			<${React.Fragment} key=${idx}>
				<${Tag} onClick=${onClick} node=${e} nodePath=${`${nodePath}.${idx}`} />
				<${Divider} position="after" node=${e as Node} index=${idx} />
			<//>
		`;
	} else if (e instanceof JsxText || e instanceof JsxExpression) {
		let content = null;
		if (e instanceof JsxExpression) {
			let jsx = ([] as unknown) as Node[];
			walkNode(e, (c: Node) => {
				if (c instanceof JsxSelfClosingElement || c instanceof JsxElement || c instanceof JsxFragment) {
					jsx.push(c);
					return false;
				}
				return true;
			});
			if (jsx.length > 0) {
				content = jsx.map(
					(j, jix) => html`
						<${Tag}
							onClick=${onClick}
							node=${j}
							nodePath=${`${nodePath}.${idx}.${jix}`}
							key=${jix}
							style=${{ border: 0, borderTop: jix > 0 ? '1px dashed red' : 0 }}
						/>
					`
				);
			}
		}

		if (!content && e instanceof JsxText) {
			const expressionProps = {
				style: {
					fontFamily: cactiva.editorOptions?.fontFamily,
					font: cactiva.editorOptions?.fontSize
				}
			};
			if (e.getText().trim()) {
				content = html`
					<div ...${expressionProps} className="expression-code">${e.getText().substr(0, 200)}</div>
				`;
			}
		}

		if (content) {
			const selected = cactiva.selectedNode?.node === e ? 'selected' : '';
			const hovered = cactiva.hoveredNode === e ? 'hover' : '';
			return html`
				<${React.Fragment} key=${idx}>
					<div
						onClick=${(e: any) => {
							if (onClick) {
								onClick(e, `${nodePath}.${idx}`);
								e.stopPropagation();
							}
						}}
						onMouseOut=${() => {
							cactiva.hoveredNode = undefined;
						}}
						onMouseOver=${(ev: any) => {
							cactiva.hoveredNode = e;
							ev.stopPropagation();
						}}
						className=${`singletag expression vertical ${selected} ${hovered}`}
						key=${idx}
					>
						${content}
					</div>
					<${Divider} position="after" node=${e as Node} index=${idx} />
				<//>
			`;
		}
	}
	return null;
});
