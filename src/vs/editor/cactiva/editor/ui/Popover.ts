import { observer, useObservable } from 'mobx-react-lite';
import html from 'vs/editor/cactiva/libs/html';
import { Fragment, useRef } from 'react';
import { Callout } from 'office-ui-fabric-react';

export default observer(({ children, content }: { children: any; content: any }) => {
	const meta = useObservable({
		visible: false
	});
	const childrenProps = {
		show: () => {
			meta.visible = true;
		},
		hide: () => {
			meta.visible = false;
		},
		ref: useRef(null as any)
	};
	return html`
		<${Fragment}>
			${meta.visible &&
				html`
					<${Callout}
						target=${childrenProps.ref}
						onDismiss=${() => {
							meta.visible = false;
						}}
					>
						${typeof content === 'function' ? content(childrenProps) : content}
					<//>
				`}
			${typeof children === 'function'
				? children(childrenProps)
				: html`
						<div
							ref=${childrenProps.ref}
							onClickCapture=${(e: any) => {
								meta.visible = !meta.visible;
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							${children}
						</div>
				  `}
		<//>
	`;
});
