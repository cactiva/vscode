import { toJS } from 'mobx';
import { observer, useObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import 'vs/css!./StyleEditor';
import Background from 'vs/editor/cactiva/editor/props/style/background/index';
import Size from 'vs/editor/cactiva/editor/props/style/size/index';
import Typography from 'vs/editor/cactiva/editor/props/style/typography/index';
import html from 'vs/editor/cactiva/libs/html';
export default observer(({value}: any) => {
	const meta = useObservable({
		style: value
	});
	useEffect(() => {
		meta.style = value;
	}, [value]);
	console.log(toJS(meta.style));
	return html`
		<div>
			<${Size} meta=${meta} />
			<${Typography} meta=${meta} />
			<${Background} meta=${meta} />
		</div>
	`;
});
