import { DirectionalHint } from 'office-ui-fabric-react';
import StyleEditor from 'vs/editor/cactiva/editor/props/style/StyleEditor';
import Popover from 'vs/editor/cactiva/editor/ui/Popover';
import html from 'vs/editor/cactiva/libs/html';
import EditorNodeAttr from 'vs/editor/cactiva/models/EditorNodeAttr';
import { cactiva } from 'vs/editor/cactiva/models/store';

export default ({ item }: { item: EditorNodeAttr }) => {
	return html`
		<${Popover}
			calloutProps=${{
				className: 'popover',
				directionalHint:
					cactiva.propsEditor.mode === 'popup' ? DirectionalHint.leftCenter : DirectionalHint.rightTopEdge,
				calloutWidth: 200,
				isBeakVisible: cactiva.propsEditor.mode === 'sidebar'
			}}
			content=${(popover: any) => {
				switch (item.name) {
					case 'style':
						return html`
							<div className="po-content">
								<${StyleEditor} value=${item.value} />
							</div>
						`;

					default:
						return html`
							<div className="po-content">
								${item.valueLabel}
							</div>
						`;
				}
			}}
			onClickCapture=${(e: any) => {
				item.selectInCode();
			}}
			visibleOnRightClick=${true}
		>
			<div className="prop highlight pointer row">
					<div className="title">
						${item.name}
					</div>
					<div className="field row space-between">
						<div className="overflow">
							${item.valueLabel}
						</div>
						<div className="goto-source row center ">
							▸
						</div>
					</div>
			</div>
		</${Popover}>
	`;
};
