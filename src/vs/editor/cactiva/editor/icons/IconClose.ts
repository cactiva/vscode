import html from 'vs/editor/cactiva/libs/html';

export default ({ color, size }: { color: string; size: any }) => {
	return html`
		<svg
			stroke=${color || '#fff'}
			fill=${color || '#fff'}
			width=${size || 24}
			height=${size || 24}
			strokeWidth='0'
			viewBox='0 0 24 24'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
			></path>
		</svg>
	`;
};
