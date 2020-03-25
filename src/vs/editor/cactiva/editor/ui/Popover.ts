import { observer, useObservable } from 'mobx-react-lite';
import { Callout, DirectionalHint } from 'office-ui-fabric-react';
import { Fragment, useRef } from 'react';
import html from 'vs/editor/cactiva/libs/html';
import { randStr } from 'vs/editor/cactiva/libs/utils';
import 'vs/css!./Popover';

export default observer(
	({
		children,
		content,
		calloutProps,
		onClickCapture,
		onContextMenu,
		visibleOnRightClick
	}: {
		children: any;
		content: any;
		calloutProps: any;
		onClickCapture: (event: any) => void;
		onContextMenu: (event: any) => void;
		visibleOnRightClick: boolean;
	}) => {
		const meta = useObservable({
			visible: false
		});
		const id = randStr(15);
		const describe = `popover-${id}`;
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
							target=${childrenProps.ref.current}
							onDismiss=${() => {
								meta.visible = false;
							}}
							ariaLabelledBy=${id}
							ariaDescribedBy=${describe}
							role="alertdialog"
							setInitialFocus=${false}
							gapSpace=${0}
							calloutWidth=${60}
							directionalHint=${DirectionalHint.topCenter}
							...${calloutProps}
						>
							<div className="monaco-breadcrumb-item">
								${typeof content === 'function' ? content(childrenProps) : content}
							</div>
						<//>
					`}
				${typeof children === 'function'
					? children(childrenProps)
					: html`
							<div
								ref=${childrenProps.ref}
								onClickCapture=${(e: any) => {
									onClickCapture && onClickCapture(e);
									if (!visibleOnRightClick) meta.visible = !meta.visible;
									e.preventDefault();
									e.stopPropagation();
								}}
								onContextMenu=${(e: any) => {
									onContextMenu && onContextMenu(e);
									if (!!visibleOnRightClick) meta.visible = !meta.visible;
									e.preventDefault();
									e.stopPropagation();
								}}
							>
								${children}
							</div>
					  `}
			<//>
		`;
	}
);
