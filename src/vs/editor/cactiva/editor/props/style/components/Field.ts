import { ColorPicker, Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import html from 'vs/editor/cactiva/libs/html';
import { randStr } from 'vs/editor/cactiva/libs/utils';
import { get } from 'lodash';
import IconExpandMore from 'vs/editor/cactiva/editor/icons/IconExpandMore';

interface Item {
	value: any;
	label: any;
}

interface IOptionField {
	items: Item[];
	style: any;
}

interface IFieldProps {
	label: string;
	type: 'Input' | 'ColorPicker' | 'RadioButton' | 'Select';
	option: IOptionField;
	value: any;
	setValue: (value: any) => void;
	style: any;
}

export default ({ label, type, value = '', setValue, option, style }: IFieldProps) => {
	let Component = CompInput;
	switch (type) {
		case 'ColorPicker':
			Component = CompColorPicker;
			break;
		case 'RadioButton':
			Component = CompRadioButton;
			break;
		case 'Select':
			Component = CompSelect;
			break;
		default:
			break;
	}
	return html`
		<div className="fd-row field" style=${style}>
			${!!label &&
				html`
					<div className="label">${label}</div>
				`}
			<${Component} value=${value} setValue=${setValue} option=${option} />
		</div>
	`;
};

const CompInput = ({ value, setValue, option }: any) => {
	const style = get(option, 'style', {
		width: 40
	});
	const type = get(option, 'type', 'text');
	return html`
		<input
			className="input"
			value=${value}
			onChange=${(e: any) => {
				let v = e.target.value;
				if (type === 'number') {
					v = parseInt(v);
				}
				setValue(v);
			}}
			...${option}
			style=${style}
			autoFocus=${false}
		/>
	`;
};

const CompSelect = ({ value, setValue, option }: any) => {
	const style = get(option, 'style', {
		flexGrow: 1
	});
	const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
		setValue(item.key);
	  };
	return html`
		<${Dropdown}
			selectedKey=${value}
			onChange=${onChange}
			styles=${{
				root: style,
				title: {
					height: 22,
					lineHeight: 20,
					borderRadius: 4,
					backgroundColor: '#f9f9f9',
					fontSize: 12,
					borderColor: '#A4A4A4'
				},
				caretDownWrapper: {
					height: 22
				}
			}}
			...${option}
			options=${option.items.map((item: any) => ({key: item.value, text: item.label}))}
			onRenderCaretDown=${() => html`<${IconExpandMore} size=${20} color="#333"/>`}
		/>
	`;
};

const CompColorPicker = ({ value, setValue, _ }: any) => {
	return html`
		<${ColorPicker}
			color=${value}
			showPreview=${false}
			onChange=${(_: any, color: any) => {
				let { r, g, b, a } = color;
				a = a / 100;
				if (a < 1) {
					a = parseFloat(a).toFixed(2);
				}
				setValue(`rgba(${r},${g},${b},${a})`);
			}}
		/>
	`;
};

const CompRadioButton = ({ value, setValue, option }: any) => {
	const onClick = (v: any) => {
		setValue(v);
	};
	const items = option.items || [];
	const style = get(option, 'style', {});
	return html`
		<div className="fd-row" style=${style}>
			${items.map((item: any) => {
				return html`
					<div
						key=${randStr(10, 'radio-button-')}
						className=${`btn btn-only btn-radio ${value === item.value ? 'active' : ''}`}
						onClick=${() => onClick(item.value)}
					>
						${item.label}
					</div>
				`;
			})}
		</div>
	`;
};
