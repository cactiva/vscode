import { observer } from 'mobx-react-lite';
import * as React from 'react';
import html from 'vs/editor/cactiva/libs/html';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';
import EditorNode from 'vs/editor/cactiva/models/EditorNode';
import { cactiva } from 'vs/editor/cactiva/models/store';
import Divider from './Divider';

interface ITagChild {
	canvas: EditorCanvas;
	idx: number;
	onClick: (node: EditorNode) => void;
	node: EditorNode;
	Tag: any;
	isLast: boolean;
}

export const TagChild = observer(({ canvas, idx, onClick, node, Tag, isLast }: ITagChild) => {
	const mode = cactiva.mode;
	if (node.kind === 'JsxFragment' || node.kind === 'JsxSelfClosingElement' || node.kind === 'JsxElement') {
		return html`
			<${React.Fragment} key=${idx}>
				<${Tag} canvas=${canvas} onClick=${onClick} isLast=${isLast} node=${node} />

				${mode !== 'preview' &&
					html`
						<${Divider} position="after" bubbleHover=${isLast} node=${node} index=${idx} />
					`}
			<//>
		`;
	} else if (node.kind === 'JsxText' || node.kind === 'JsxExpression') {
		let content = null;
		if (node.kind === 'JsxExpression') {
			if (node.children.length > 0) {
				content = node.children.map(
					(j, jix) => html`
						<${Tag}
							canvas=${canvas}
							onClick=${onClick}
							node=${j}
							isLast=${jix === node.children.length - 1}
							key=${jix}
							style=${{ border: 0, borderTop: jix > 0 ? '1px dashed red' : 0 }}
						/>
					`
				);
			} else {
				content = node.text;
			}
		}

		if (!!content || node.kind === 'JsxText') {
			const expressionProps = {
				style: {
					fontFamily: canvas.editorOptions?.fontFamily,
					font: canvas.editorOptions?.fontSize
				}
			};

			const text = node.expression || node.text;
			if (text) {
				content = html`
					<div ...${expressionProps} className="expression-code">${text.substr(0, 200)}</div>
				`;
			}
		}

		if (content) {
			const selected = canvas.selectedNode === node ? 'selected' : '';
			const hovered = canvas.hoveredNode === node ? 'hover' : '';
			const type = node.kind === 'JsxText' ? '' : 'expression';
			return html`
				<${React.Fragment} key=${idx}>
					<div
						onClick=${(e: any) => {
							if (onClick) {
								onClick(node);
								e.stopPropagation();
							}
						}}
						onMouseOut=${() => {
							canvas.hoveredNode = undefined;
						}}
						onMouseOver=${(ev: any) => {
							canvas.hoveredNode = node;
							ev.stopPropagation();
						}}
						className=${`singletag vertical ${type} ${selected} ${hovered} ${mode}`}
						key=${idx}
					>
						${content}
					</div>
					${mode !== 'preview' &&
						html`
							<${Divider} position="after" bubbleHover=${isLast} node=${node} index=${idx} />
						`}
				<//>
			`;
		}
	}
	return null;
});
