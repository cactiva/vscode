import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Node } from 'ts-morph';
import { URI } from 'vs/base/common/uri';
import 'vs/css!./Tag';
import { TagChild } from 'vs/editor/cactiva/editor/canvas/TagChild';
import html from 'vs/editor/cactiva/libs/html';
import { getChildrenFromNode } from 'vs/editor/cactiva/libs/morph/getChildrenFromNode';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import { IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';
import Divider from './Divider';
import { TagPreview } from 'vs/editor/cactiva/editor/canvas/TagPreview';
const icProps = URI.parse(require.toUrl('../../assets/images/ic-props.svg'));

interface ISingleTag {
	canvas: IEditorCanvas;
	node: Node;
	nodePath: string;
	style?: any;
	isLast?: boolean;
	onClick?: (node: Node, nodePath: string) => void;
}

export const Tag: React.FunctionComponent<ISingleTag> = observer(
	({ canvas, node, style, onClick, nodePath, isLast }: ISingleTag) => {
		const [, dragRef] = useDrag({
			item: { type: 'cactiva-tag', node, dropEffect: 'none' },
			canDrag: monitor => {
				return true;
			},
			collect: monitor => ({
				opacity: monitor.isDragging() ? 0.5 : 1
			})
		});
		if (!node || (node && node.wasForgotten())) return null;

		let tagName = getTagName(node);
		const childrenNode = getChildrenFromNode(node);
		const hovered = canvas.hoveredNode === node ? 'hover' : '';
		const selected = canvas.selectedNode?.node.get() === node ? 'selected' : '';

		(node.compilerNode as any).cactivaPath = nodePath;
		(node.compilerNode as any).domRef = useRef(undefined as HTMLElement | undefined);

		dragRef((node.compilerNode as any).domRef);

		return html`
			<div
				ref=${(node.compilerNode as any).domRef}
				onClick=${(e: any) => {
					if (onClick) {
						onClick(node, nodePath);
						e.stopPropagation();
					}
				}}
				onMouseOut=${() => {
					canvas.hoveredNode = undefined;
				}}
				onMouseOver=${(e: any) => {
					canvas.hoveredNode = node;
					e.stopPropagation();
				}}
				className=${`singletag vertical ${selected} ${hovered}`}
				style=${style}
			>
				<div className="headertag">
					<span className="tagname"> ${tagName} </span>
					<div className="btn props">
						<img src=${icProps} className="ic-props" height="16" width="16" />
					</div>
				</div>
				<${TagPreview} node=${node}>
					${childrenNode.length > 0 &&
						html`
							<div className="children">
								<${Divider} position="before" node=${childrenNode[0]} index=${0} />
								${childrenNode.map((e, idx) => {
									return html`
										<${TagChild}
											canvas=${canvas}
											Tag=${Tag}
											isLast=${idx === childrenNode.length - 1}
											key=${idx}
											e=${e}
											idx=${idx}
											onClick=${onClick}
											nodePath=${nodePath}
										/>
									`;
								})}
							</div>
						`}
				<//>
			</div>
		`;
	}
);
