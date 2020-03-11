import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { useDrag } from 'react-dnd';
import { JsxElement, JsxExpression, JsxFragment, JsxSelfClosingElement, Node } from 'ts-morph';
import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';
import Divider from './Divider';
import html from 'vs/editor/cactiva/libs/html';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import { getChildrenFromNode } from 'vs/editor/cactiva/libs/morph/getChildrenFromNode';
import 'vs/css!./SingleTag';
import { URI } from 'vs/base/common/uri';
const icProps = URI.parse(require.toUrl('../../assets/images/ic-props.svg'));

interface ISingleTag {
	node: Node;
	nodePath: string;
	style?: any;
	onClick?: (node: Node, nodePath: string) => void;
}

const SingleTag: any = observer(({ node, style, onClick, nodePath }: ISingleTag) => {
	if (!node || (node && node.wasForgotten())) return null;
	let tagName = getTagName(node);

	const childrenNode = getChildrenFromNode(node);
	const children = childrenNode.map((e, idx) => {
		if (e instanceof JsxFragment || e instanceof JsxSelfClosingElement || e instanceof JsxElement) {
			return html`
				<${React.Fragment} key=${idx}>
					<${SingleTag} onClick=${onClick} node=${e} nodePath=${`${nodePath}.${idx}`} />
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
			if (jsx.length > 0) {
				return html`
					<${React.Fragment} key=${idx}>
						<div style=${{ border: '1px dashed red' }} key=${idx}>
							${jsx.map(
								(j, jix) => html`
									<${SingleTag}
										onClick=${onClick}
										node=${j}
										nodePath=${`${nodePath}.${idx}.${jix}`}
										key=${jix}
										style=${{ border: 0, borderTop: jix > 0 ? '1px dashed red' : 0 }}
									/>
								`
							)}
						</div>
						<${Divider} position="after" node=${e as Node} index=${idx} />
					<//>
				`;
			} else {
				return html`
					<div
						onClick=${(e: any) => {
							if (onClick) {
								onClick(e, `${nodePath}.${idx}`);
								e.stopPropagation();
							}
						}}
						style=${{ border: '1px dashed red' }}
						key=${idx}
					>
						${e.getText()}
					</div>
				`;
			}
		}
		return true;
	});

	const [, dragRef] = useDrag({
		item: { type: 'tag', node },
		collect: monitor => ({
			opacity: monitor.isDragging() ? 0.5 : 1
		})
	});

	return html`
		<div
			ref=${dragRef}
			onClick=${(e: any) => {
				if (onClick) {
					onClick(node, nodePath);
					e.stopPropagation();
				}
			}}
			className="singletag vertical"
			style=${style}
		>
			<div className="headertag">
				<span className="tagname"> ${tagName} </span>
				<div className="btn props">
					<img src=${icProps} className="ic-props" height="20" width="20" />
				</div>
			</div>
			${children.findIndex(x => x !== true) > -1 &&
				html`
					<div className="children">
						<${Divider} position="before" node=${childrenNode[0]} index=${0} />
						${children}
					</div>
				`}
		</div>
	`;
});

export default SingleTag;
