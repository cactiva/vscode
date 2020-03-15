/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { Pane } from 'vs/base/browser/ui/splitview/paneview';
import { IView } from 'vs/base/browser/ui/splitview/splitview';
import 'vs/css!./media/editor';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';

export class CodePane extends Pane implements IView {
	protected renderHeader(container: HTMLElement): void {}
	protected renderBody(container: HTMLElement): void {}
	protected layoutBody(height: number, width: number): void {
		const sidebar = document.getElementById('workbench.parts.sidebar');
		if (!document.getElementById('cactiva.props')) {
			const el = document.createElement('div');
			el.setAttribute('id', 'cactiva.props');
			sidebar?.appendChild(el);
			cactiva.propsEditor.el = el;
		}

		const bench = document.getElementsByClassName('monaco-workbench');
		if (bench.length > 0 && bench[0] instanceof HTMLElement) {
			const color = window.getComputedStyle(bench[0], null).getPropertyValue('color');
			if (cactiva.color != color) {
				cactiva.color = color;
			}
		}

		const activitybar = document.getElementById('workbench.parts.statusbar');
		let border = sidebar?.style.borderRight
			? `border-right: ${sidebar?.style.borderRight}`
			: `border-right: 1px solid ${activitybar?.style.backgroundColor}`;
		this.element.setAttribute('style', `width: 100%;height:100%;${border};box-sizing:border-box;`);
	}
}
