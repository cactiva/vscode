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
		<div className="fd-row section">
			<${Field}
				type="Select"
				label="Weight"
				value=${value}
				setValue=${onChange}
				option=${{
					items: [
						{
							value: '100',
							label: '100 - Thin'
						},
						{
							value: '200',
							label: '200 - Extra Light'
						},
						{
							value: '300',
							label: '300 - Light'
						},
						{
							value: '400',
							label: '400 - Normal'
						},
						{
							value: '500',
							label: '500 - Medium'
						},
						{
							value: '600',
							label: '600 - Semi Bold'
						},
						{
							value: '700',
							label: '700 - Bold'
						},
						{
							value: '800',
							label: '800 - Extra Bold'
						},
						{
							value: '900',
							label: '900 - Black'
						}
					]
				}}
			/>
		</div>
	`;
});
