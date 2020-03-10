import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useDrag } from 'react-dnd';
import { JsxElement, JsxExpression, JsxFragment, JsxSelfClosingElement, Node } from 'ts-morph';
import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';
import Divider from './Divider';
import html from 'vs/editor/cactiva/libs/html';

interface ISingleTag {
	node: Node,
	style?: any,
	onClick?: (node: Node) => void
}

const SingleTag: any = observer(({ node, style, onClick }: ISingleTag) => {
	if (!node || (node && node.wasForgotten())) return null;
	let n = null;
	let tagName = "";
	switch (true) {
		case node instanceof JsxFragment:
			n = (node as JsxFragment);
			tagName = "JsxFragment";
			break;
		case node instanceof JsxSelfClosingElement:
			n = (node as JsxSelfClosingElement);
			tagName = n.getTagNameNode().getText();
			break;
		case node instanceof JsxElement:
			n = node as JsxElement;
			tagName = n.getOpeningElement().getTagNameNode().getText();
			break;
	}

	const nodeArray = node.forEachChildAsArray();
	if (node instanceof JsxElement) {
		nodeArray.shift();
		nodeArray.pop();
	}
	const children = nodeArray.map((e, idx) => {
		if (e instanceof JsxFragment ||
			e instanceof JsxSelfClosingElement ||
			e instanceof JsxElement) {
			return html`<${React.Fragment} key=${idx}>
				<${SingleTag} onClick=${onClick} node=${e} />
				<${Divider} position="after" node=${e as Node} index=${idx} />
			<//>`
		} else if (e instanceof JsxExpression) {
			let jsx = ([] as unknown) as Node[];
			walkNode(e, (c: Node) => {
				if (c instanceof JsxSelfClosingElement ||
					c instanceof JsxElement ||
					c instanceof JsxFragment) {
					jsx.push(c);
					return false;
				}
				return true;
			});
			if (jsx.length > 0) {
				return html`<${React.Fragment} key=${idx}>
					<div style=${ { border: "1px dashed red" }} key=${idx}>
					${jsx.map((j, jix) => html`<${SingleTag}
							onClick=${onClick}
							node=${j}
							key=${jix}
							style=${{ border: 0, borderTop: jix > 0 ? '1px dashed red' : 0 }} />`)}
					</div>
					<${Divider} position="after" node=${e as Node} index=${idx} />
				<//>`;
			} else {
				return html`<div>${e.getText()}</div>`;
			}
		}
		return true;
	});

	const [, dragRef] = useDrag({
		item: { type: 'tag', node },
		collect: monitor => ({
			opacity: monitor.isDragging() ? 0.5 : 1,
		}),
	})

	return html`
		<div
			ref=${dragRef}
			onClick=${(e: any) => {
			if (onClick) {
				console.log(node);
				onClick(node);
				e.stopPropagation();
			}
		}}
			className="singletag vertical"
			style=${style}
		>
			<span className="tagname"> ${tagName} </span>
			<div className="children">
				<${Divider} position="before" node=${nodeArray[0] as Node} index=${0} />
				${children}
			</div>
		</div>
	`;
})

export default SingleTag;
