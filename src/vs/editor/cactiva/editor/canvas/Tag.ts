import { observer, useObservable } from 'mobx-react-lite';
import { useDrag } from 'react-dnd';
import { Node } from 'ts-morph';
import { URI } from 'vs/base/common/uri';
import 'vs/css!./Tag';
import { TagChild } from 'vs/editor/cactiva/editor/canvas/TagChild';
import html from 'vs/editor/cactiva/libs/html';
import { getChildrenFromNode } from 'vs/editor/cactiva/libs/morph/getChildrenFromNode';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';
import Divider from './Divider';
const icProps = URI.parse(require.toUrl('../../assets/images/ic-props.svg'));

interface ISingleTag {
	node: Node;
	nodePath: string;
	style?: any;
	onClick?: (node: Node, nodePath: string) => void;
}

export const Tag: React.FunctionComponent<ISingleTag> = observer(({ node, style, onClick, nodePath }: ISingleTag) => {
	if (!node || (node && node.wasForgotten())) return null;
	let tagName = getTagName(node);
	const meta = useObservable({
		hover: false
	});
	const childrenNode = getChildrenFromNode(node);

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
			onMouseOut=${() => {
				meta.hover = false;
			}}
			onMouseOver=${(e: any) => {
				meta.hover = true;
				e.stopPropagation();
			}}
			className=${`singletag vertical ${meta.hover ? 'hover' : ''}`}
			style=${style}
		>
			<div className="headertag">
				<span className="tagname"> ${tagName} </span>
				<div className="btn props">
					<img src=${icProps} className="ic-props" height="20" width="20" />
				</div>
			</div>
			${childrenNode.length > 0 &&
				html`
					<div className="children">
						<${Divider} position="before" node=${childrenNode[0]} index=${0} />
						${childrenNode.map((e, idx) => {
							return html`
								<${TagChild} Tag=${Tag} key=${idx} e=${e} idx=${idx} onClick=${onClick} nodePath=${nodePath} />
							`;
						})}
					</div>
				`}
		</div>
	`;
});
