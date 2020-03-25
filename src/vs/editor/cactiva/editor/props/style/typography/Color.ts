import { DirectionalHint } from 'office-ui-fabric-react';
import Field from 'vs/editor/cactiva/editor/props/style/components/Field';
import Popover from 'vs/editor/cactiva/editor/ui/Popover';
import html from 'vs/editor/cactiva/libs/html';
import { cactiva } from 'vs/editor/cactiva/models/store';
import { observer } from 'mobx-react-lite';
import { get, set } from 'lodash';

export default observer(({meta, path}: any) => {
	const value = get(meta, `style.${path}`, '');
	const onChange = (v: any) => {
		set(meta, `style.${path}`, v);
	};
	return html`
		<div className="fd-row section">
			<${Popover}
				calloutProps=${{
					directionalHint: DirectionalHint.leftTopEdge,
					calloutWidth: 250
				}}
				content=${(popover: any) => {
					return html`
						<${Field} type="ColorPicker" value=${value} setValue=${onChange} />
					`;
				}}
			>
				<div className="fd-row section">
					<div className="label">Color</div>
					<div
						style=${{
							width: 20,
							height: 18,
							backgroundColor: value,
							border: `1px solid ${cactiva.fontColor}`,
							marginRight: 5
						}}
					></div>
				</div>
			<//>
			<${Field}
				value=${value}
				setValue=${onChange}
				option=${{
					style: {
						width: '100%'
					}
				}}
			/>
		</div>
	`;
});
