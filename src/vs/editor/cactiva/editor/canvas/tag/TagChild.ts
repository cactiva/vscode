import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { JsxElement, JsxExpression, JsxFragment, JsxSelfClosingElement, JsxText, Node } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';
import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';
import Divider from './Divider';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';

export const TagChild = observer(({ canvas, idx, onClick, nodePath, e, Tag, isLast }: any) => {
	if (!e || (e && e.wasForgotten())) return null;

	const mode = cactiva.mode;
	if (e instanceof JsxFragment || e instanceof JsxSelfClosingElement || e instanceof JsxElement) {
		return html`
			<${React.Fragment} key=${idx}>
				<${Tag} canvas=${canvas} onClick=${onClick} isLast=${isLast} node=${e} nodePath=${`${nodePath}.${idx}`} />

				${mode !== 'preview' &&
					html`
						<${Divider} position="after" bubbleHover=${isLast} node=${e as Node} index=${idx} />
					`}
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
							canvas=${canvas}
							onClick=${onClick}
							node=${j}
							isLast=${jix === jsx.length - 1}
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
					fontFamily: canvas.editorOptions?.fontFamily,
					font: canvas.editorOptions?.fontSize
				}
			};
			if (e.getText().trim()) {
				content = html`
					<div ...${expressionProps} className="expression-code">${e.getText().substr(0, 200)}</div>
				`;
			}
		}

		if (content) {
			const selected = canvas.selectedNode?.node === e ? 'selected' : '';
			const hovered = canvas.hoveredNode === e ? 'hover' : '';
			const type = e instanceof JsxText ? '' : 'expression';
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
							canvas.hoveredNode = undefined;
						}}
						onMouseOver=${(ev: any) => {
							canvas.hoveredNode = e;
							ev.stopPropagation();
						}}
						className=${`singletag vertical ${type} ${selected} ${hovered} ${mode}`}
						key=${idx}
					>
						${content}
					</div>
					${mode !== 'preview' &&
						html`
							<${Divider} position="after" bubbleHover=${isLast} node=${e as Node} index=${idx} />
						`}
				<//>
			`;
		}
	}
	return null;
});
