import html from 'vs/editor/cactiva/libs/html';
import EditorNodeAttr from 'vs/editor/cactiva/models/EditorNodeAttr';

export default ({ item }: { item: EditorNodeAttr }) => {
	return html`
		<div
			className="prop highlight"
			onClick=${() => {
				item.selectInCode();
			}}
		>
			<div className="pointer row">
				<div className="title">
					${item.name}
				</div>
				<div className="field row space-between">
					<div className="input">
						<div className="overflow">
							${item.valueLabel}
						</div>
					</div>
					<div className="goto-source row center ">
						▸
					</div>
				</div>
			</div>
		</div>
	`;
};
