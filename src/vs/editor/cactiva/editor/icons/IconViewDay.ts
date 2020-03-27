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
			<g id="icon/action/view_day_24px">
				<path
					id="icon/action/view_day_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M2.5 5V4C2.5 3.45001 2.94995 3 3.5 3H20.5C21.05 3 21.5 3.45001 21.5 4V5C21.5 5.54999 21.05 6 20.5 6H3.5C2.94995 6 2.5 5.54999 2.5 5ZM20.5 8H3.5C2.94995 8 2.5 8.45001 2.5 9V15C2.5 15.55 2.94995 16 3.5 16H20.5C21.05 16 21.5 15.55 21.5 15V9C21.5 8.45001 21.05 8 20.5 8ZM3.5 21H20.5C21.05 21 21.5 20.55 21.5 20V19C21.5 18.45 21.05 18 20.5 18H3.5C2.94995 18 2.5 18.45 2.5 19V20C2.5 20.55 2.94995 21 3.5 21Z"
				/>
			</g>
		</svg>
	`;
};
