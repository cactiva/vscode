import html from 'vs/editor/cactiva/libs/html';

export default ({ style, children }: any) => {
	return html`
		<div style=${style}>
			${children}
		</div>
	`;
};
