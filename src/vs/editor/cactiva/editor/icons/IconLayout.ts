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
			<g id="icon/action/aspect_ratio_24px">
				<path
					id="icon/action/aspect_ratio_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M21 3H3C1.90002 3 1 3.89999 1 5V19C1 20.1 1.90002 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.89999 22.1 3 21 3ZM9 9H7V11C7 11.55 6.55005 12 6 12C5.44995 12 5 11.55 5 11V8C5 7.45001 5.44995 7 6 7H9C9.55005 7 10 7.45001 10 8C10 8.54999 9.55005 9 9 9ZM17 13C17 12.45 17.45 12 18 12C18.55 12 19 12.45 19 13V16C19 16.55 18.55 17 18 17H15C14.45 17 14 16.55 14 16C14 15.45 14.45 15 15 15H17V13ZM4 19.01H20C20.55 19.01 21 18.56 21 18.01V5.98999C21 5.44 20.55 4.98999 20 4.98999H4C3.44995 4.98999 3 5.44 3 5.98999V18.01C3 18.56 3.44995 19.01 4 19.01Z"
				/>
			</g>
		</svg>
	`;
};
