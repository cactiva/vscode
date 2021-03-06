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
			<g id="icon/action/visibility_24px">
				<path
					id="icon/action/visibility_24px_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12 4.5C7 4.5 2.72998 7.60999 1 12C2.72998 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.60999 17 4.5 12 4.5ZM12 17C9.23999 17 7 14.76 7 12C7 9.23999 9.23999 7 12 7C14.76 7 17 9.23999 17 12C17 14.76 14.76 17 12 17ZM9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12Z"
				/>
			</g>
		</svg>
	`;
};
