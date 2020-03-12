import { observer, useObservable } from 'mobx-react-lite';
import * as React from 'react';
import { JsxElement, JsxExpression, JsxFragment, JsxSelfClosingElement, Node } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';
import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';
import Divider from './Divider';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';

export const TagChild = observer(({ idx, onClick, nodePath, e, Tag }: any) => {
	const meta = useObservable({
		hover: false
	});

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
						meta.hover = false;
					}}
					onMouseOver=${(e: any) => {
						meta.hover = true;
						e.stopPropagation();
					}}
					className=${`singletag expression vertical ${selected} ${meta.hover ? 'hover' : ''}`}
					key=${idx}
				>
					${!!content ? content : e.getText()}
				</div>
				<${Divider} position="after" node=${e as Node} index=${idx} />
			<//>
		`;
	}
	return null;
});
