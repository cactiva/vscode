import { observer } from 'mobx-react-lite';
import BackgroundColor from 'vs/editor/cactiva/editor/props/style/background/BackgroundColor';
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
				Background
			</div>
			<div className="body">
				<${BackgroundColor} meta=${meta} path="color" />
			</div>
		</div>
	`;
});
