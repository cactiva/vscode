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
			<g id="icon/navigation/expand_less_24px">
				<path
					id="icon/navigation/expand_less_24px_2"
					d="M11.295 8.99999L6.70498 13.59C6.31498 13.98 6.31498 14.61 6.70498 15C7.09498 15.39 7.72498 15.39 8.11498 15L12.005 11.12L15.885 15C16.275 15.39 16.905 15.39 17.295 15C17.685 14.61 17.685 13.98 17.295 13.59L12.705 8.99999C12.325 8.60999 11.685 8.60999 11.295 8.99999Z"
				/>
			</g>
		</svg>
	`;
};
