import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { JsxElement, JsxExpression, JsxFragment, JsxSelfClosingElement, JsxText, Node } from 'ts-morph';
import { TagPreview } from 'vs/editor/cactiva/editor/canvas/TagPreview';
import html from 'vs/editor/cactiva/libs/html';
import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';

export const TagChildPreview = observer(({ canvas, idx, nodePath, e, Tag, isLast }: any) => {
	if (!e || (e && e.wasForgotten())) return null;
	if (e instanceof JsxFragment || e instanceof JsxSelfClosingElement || e instanceof JsxElement) {
		return html`
			<${React.Fragment} key=${idx}>
				<${TagPreview} canvas=${canvas} isLast=${isLast} node=${e} nodePath=${`${nodePath}.${idx}`} />
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
						<${TagPreview}
							canvas=${canvas}
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
			return html`
				${content}
			`;
		}
	}
	return null;
});
