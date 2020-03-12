import { observer } from 'mobx-react-lite';
import { Node } from 'ts-morph';
import html from 'vs/editor/cactiva/libs/html';

export default observer(
	(props: { position: 'before' | 'after' | 'first-children' | 'last-children'; node?: Node; index: number }) => {
		// const layout = _.get(props, 'layout', 'vertical');
		return html`
			<div
				className=${'divider'}
				onMouseOver=${(e: any) => {
					e.stopPropagation();
				}}
			></div>
		`;
	}
);
