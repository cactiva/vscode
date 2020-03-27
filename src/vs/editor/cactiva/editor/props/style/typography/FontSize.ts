import { get, set } from 'lodash';
import { observer } from 'mobx-react-lite';
import Field from 'vs/editor/cactiva/editor/props/style/components/Field';
import html from 'vs/editor/cactiva/libs/html';

export default observer(({ meta, path }: any) => {
	const value = get(meta, `style.${path}`, '');
	const onChange = (v: any) => {
		set(meta, `style.${path}`, v);
	};
	return html`
		<${Field}
			label="Size"
			value=${value}
			setValue=${onChange}
			option=${{
				type: 'number'
			}}
		/>
	`;
});
