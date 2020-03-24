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
	const onDrop = (item: any) => {
		console.log(item);
	};

	if (node.kind === 'JsxFragment' || node.kind === 'JsxSelfClosingElement' || node.kind === 'JsxElement') {
		return html`
			<${React.Fragment} key=${idx}>
				<${Tag} canvas=${canvas} onClick=${onClick} isLast=${isLast} node=${node} />

				${mode !== 'preview' &&
					html`
						<${Divider} position="after" onDrop=${onDrop} bubbleHover=${isLast} node=${node} index=${idx} />
					`}
			<//>
		`;
	} else if (node.kind === 'JsxText' || node.kind === 'JsxExpression') {
		let content = null;
		let children = null;
		if (node.kind === 'JsxExpression') {
			content = node.expression;
			if (node.children.length > 0) {
				children = node.children.map(
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
				if (cactiva.mode !== 'layout' && node.kind === 'JsxExpression') {
					content = null;
				} else {
					content = html`
						<div ...${expressionProps} className=${`expression-code ${children ? 'has-children' : ''}`}>
							${text}
						</div>
					`;
				}
			}
		}

		if (content || children) {
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
						${content} ${children}
					</div>
					${mode !== 'preview' &&
						html`
							<${Divider} onDrop=${onDrop} position="after" bubbleHover=${isLast} node=${node} index=${idx} />
						`}
				<//>
			`;
		}
	}
	return null;
});
