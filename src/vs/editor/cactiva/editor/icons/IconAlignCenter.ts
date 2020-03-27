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
			<g id="icon/editor/format_align_center_24px">
				<path
					id="icon/editor/format_align_center_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M4 5C3.45001 5 3 4.54999 3 4C3 3.45001 3.45001 3 4 3H20C20.55 3 21 3.45001 21 4C21 4.54999 20.55 5 20 5H4ZM7 8C7 8.54999 7.45001 9 8 9H16C16.55 9 17 8.54999 17 8C17 7.45001 16.55 7 16 7H8C7.45001 7 7 7.45001 7 8ZM20 13H4C3.45001 13 3 12.55 3 12C3 11.45 3.45001 11 4 11H20C20.55 11 21 11.45 21 12C21 12.55 20.55 13 20 13ZM7 16C7 16.55 7.45001 17 8 17H16C16.55 17 17 16.55 17 16C17 15.45 16.55 15 16 15H8C7.45001 15 7 15.45 7 16ZM4 21H20C20.55 21 21 20.55 21 20C21 19.45 20.55 19 20 19H4C3.45001 19 3 19.45 3 20C3 20.55 3.45001 21 4 21Z"
				/>
			</g>
		</svg>
	`;
};
