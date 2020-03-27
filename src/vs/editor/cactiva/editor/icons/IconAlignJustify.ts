import html from 'vs/editor/cactiva/libs/html';

export default ({ color, size }: { color: string; size: any }) => {
	return html`
		<svg
			width=${size || 24}
			height=${size || 24}
			viewBox="0 0 24 24"
			fill=${color || '#fff'}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="icon/editor/format_align_justify_24px">
				<path
					id="icon/editor/format_align_justify_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M4 5C3.45001 5 3 4.54999 3 4C3 3.45001 3.45001 3 4 3H20C20.55 3 21 3.45001 21 4C21 4.54999 20.55 5 20 5H4ZM4 9H20C20.55 9 21 8.54999 21 8C21 7.45001 20.55 7 20 7H4C3.45001 7 3 7.45001 3 8C3 8.54999 3.45001 9 4 9ZM20 13H4C3.45001 13 3 12.55 3 12C3 11.45 3.45001 11 4 11H20C20.55 11 21 11.45 21 12C21 12.55 20.55 13 20 13ZM4 17H20C20.55 17 21 16.55 21 16C21 15.45 20.55 15 20 15H4C3.45001 15 3 15.45 3 16C3 16.55 3.45001 17 4 17ZM4 21H20C20.55 21 21 20.55 21 20C21 19.45 20.55 19 20 19H4C3.45001 19 3 19.45 3 20C3 20.55 3.45001 21 4 21Z"
				/>
			</g>
		</svg>
	`;
};
