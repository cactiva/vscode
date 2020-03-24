import { get, set } from 'lodash';
import { observer } from 'mobx-react-lite';
import IconAlignCenter from 'vs/editor/cactiva/editor/icons/IconAlignCenter';
import IconAlignJustify from 'vs/editor/cactiva/editor/icons/IconAlignJustify';
import IconAlignLeft from 'vs/editor/cactiva/editor/icons/IconAlignLeft';
import IconAlignRight from 'vs/editor/cactiva/editor/icons/IconAlignRight';
import Field from 'vs/editor/cactiva/editor/props/style/components/Field';
import html from 'vs/editor/cactiva/libs/html';

export default observer(({meta, path}: any) => {
	const value = get(meta, `style.${path}`, '');
	const onChange = (v: any) => {
		set(meta, `style.${path}`, v);
	};
	return html`
		<${Field}
			type="RadioButton"
			value=${value}
			setValue=${onChange}
			option=${{
				items: [
					{
						value: 'left',
						label: html`
							<${IconAlignLeft} size=${20} color="#333" />
						`
					},
					{
						value: 'center',
						label: html`
							<${IconAlignCenter} size=${20} color="#333" />
						`
					},
					{
						value: 'right',
						label: html`
							<${IconAlignRight} size=${20} color="#333" />
						`
					},
					{
						value: 'justify',
						label: html`
							<${IconAlignJustify} size=${20} color="#333" />
						`
					}
				]
			}}
		/>
	`;
});
