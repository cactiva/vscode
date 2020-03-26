import { get, set, unset } from 'lodash';
import IconItalic from 'vs/editor/cactiva/editor/icons/IconItalic';
import IconTextField from 'vs/editor/cactiva/editor/icons/IconTextField';
import Field from 'vs/editor/cactiva/editor/props/style/components/Field';
import html from 'vs/editor/cactiva/libs/html';

export default ({ meta, path }: any) => {
	const value = get(meta, `style.${path}`, 'regular');
	const onChange = (v: any) => {
		if (v === 'italic') {
			set(meta, `style.${path}`, v);
		} else {
			unset(meta, `style.${path}`);
		}
	};
	return html`
		<${Field}
			type="RadioButton"
			value=${value}
			setValue=${onChange}
			option=${{
				items: [
					{
						value: 'regular',
						label: html`
							<${IconTextField} size=${18} color="#333" />
						`
					},
					{
						value: 'italic',
						label: html`
							<${IconItalic} size=${18} color="#333" />
						`
					}
				]
			}}
		/>
	`;
};
