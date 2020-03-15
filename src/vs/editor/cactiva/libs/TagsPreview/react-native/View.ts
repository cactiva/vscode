import html from 'vs/editor/cactiva/libs/html';

export default ({ style, children, className }: any) => {
	return html`
		<div style=${style} className=${className}>
			${children}
		</div>
	`;
};
