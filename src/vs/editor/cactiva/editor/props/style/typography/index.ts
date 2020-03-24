import TextAlign from 'vs/editor/cactiva/editor/props/style/typography/TextAlign';
import html from 'vs/editor/cactiva/libs/html';
import { cactiva } from 'vs/editor/cactiva/models/store';
import FontStyle from 'vs/editor/cactiva/editor/props/style/typography/FontStyle';
import Color from 'vs/editor/cactiva/editor/props/style/typography/Color';
import FontSize from 'vs/editor/cactiva/editor/props/style/typography/FontSize';
import LineHeight from 'vs/editor/cactiva/editor/props/style/typography/LineHeight';
import { observer } from 'mobx-react-lite';
import FontWeight from 'vs/editor/cactiva/editor/props/style/typography/FontWeight';

export default observer(({meta}: any) => {
	return html`
		<div className="group">
			<div
				className="label-group"
				style=${{
					borderColor: cactiva.fontColor
				}}
			>
				Typography
			</div>
			<div className="body">
				<div
					className="fd-row section"
					style=${{
						justifyContent: 'space-between'
					}}
				>
					<${FontStyle} meta=${meta} path="fontStyle"/>
					<${TextAlign} meta=${meta} path="textAlign" />
				</div>
				<${Color} meta=${meta} path="color" />
				<${FontWeight} meta=${meta} path="fontStyle"/>
				<div
					className="fd-row section"
					style=${{
						justifyContent: 'space-between'
					}}
				>
					<${FontSize} meta=${meta} path="fontSize" />
					<${LineHeight} meta=${meta} path="lineHeight" />
				</div>
			</div>
		</div>
	`;
});
