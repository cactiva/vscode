import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { JsxElement, JsxExpression, JsxFragment, JsxSelfClosingElement, Node } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';
import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';
import Divider from './Divider';

export const TagChild = observer(({ idx, onClick, nodePath, e, Tag }: any) => {
	if (e instanceof JsxFragment || e instanceof JsxSelfClosingElement || e instanceof JsxElement) {
		return html`
			<${React.Fragment} key=${idx}>
				<${Tag} onClick=${onClick} node=${e} nodePath=${`${nodePath}.${idx}`} />
				<${Divider} position="after" node=${e as Node} index=${idx} />
			<//>
		`;
	} else if (e instanceof JsxExpression) {
		let jsx = ([] as unknown) as Node[];
		walkNode(e, (c: Node) => {
			if (c instanceof JsxSelfClosingElement || c instanceof JsxElement || c instanceof JsxFragment) {
				jsx.push(c);
				return false;
			}
			return true;
		});
		const selected = cactiva.selectedNode?.node === e ? 'selected' : '';
		const hovered = cactiva.hoveredNode === e ? 'hover' : '';
		let content = null;
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

		const expressionProps = {
			style: {
				fontFamily: cactiva.editorOptions?.fontFamily,
				font: cactiva.editorOptions?.fontSize
			}
		};
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
					${!!content
						? content
						: html`
								<div ...${expressionProps} className="expression-code">${e.getText()}</div>
						  `}
				</div>
				<${Divider} position="after" node=${e as Node} index=${idx} />
			<//>
		`;
	}
	return null;
});
