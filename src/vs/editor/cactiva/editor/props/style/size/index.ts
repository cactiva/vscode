import { observer } from 'mobx-react-lite';
import Height from 'vs/editor/cactiva/editor/props/style/size/Height';
import MaxHeight from 'vs/editor/cactiva/editor/props/style/size/MaxHeight';
import MaxWidth from 'vs/editor/cactiva/editor/props/style/size/MaxWidth';
import MinHeight from 'vs/editor/cactiva/editor/props/style/size/MinHeight';
import MinWidth from 'vs/editor/cactiva/editor/props/style/size/MinWidth';
import Width from 'vs/editor/cactiva/editor/props/style/size/Width';
import html from 'vs/editor/cactiva/libs/html';
import { cactiva } from 'vs/editor/cactiva/models/store';

export default observer(({meta}: any) => {
	return html`
		<div className="group">
			<div
				className="label-group"
				style=${{
					borderColor: cactiva.fontColor
				}}
			>
				Size
			</div>
			<div className="body">
				<div
					className="fd-row section"
					style=${{
						justifyContent: 'space-between'
					}}
				>
					<${Width} meta=${meta} path="width" />
					<${Height} meta=${meta} path="height" />
				</div>
				<div
					className="fd-row section"
					style=${{
						justifyContent: 'space-between'
					}}
				>
					<${MinWidth} meta=${meta} path="minWidth" />
					<${MinHeight} meta=${meta} path="minHeight" />
				</div>
				<div
					className="fd-row section"
					style=${{
						justifyContent: 'space-between'
					}}
				>
					<${MaxWidth} meta=${meta} path="maxWidth" />
					<${MaxHeight} meta=${meta} path="maxHeight" />
				</div>
			</div>
		</div>
	`;
});
