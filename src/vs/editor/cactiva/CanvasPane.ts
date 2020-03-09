/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { observer, useObservable } from 'mobx-react-lite';
import { deepObserve } from 'mobx-utils';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Pane } from 'vs/base/browser/ui/splitview/paneview';
import { IView } from 'vs/base/browser/ui/splitview/splitview';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import Canvas from 'vs/editor/cactiva/canvas/Canvas';
import { canvasStore } from 'vs/editor/cactiva/libs/canvasStore';
import html from './html';
import { Project } from 'ts-morph';

export class CanvasPane extends Pane implements IView {

	public updateModelData(modelData: ModelData) {
		// console.log(modes.DocumentSymbolProviderRegistry.all(modelData.model));
		console.log(modelData.model.getValue(), Project);
	}

	constructor() {
		super();

		const Mantab = () => {
			return html`<div>Joni</div>`;
		}
		const Greetings = observer(() => {
			const meta = useObservable({
				counter: 100,
				text: 'halo  tulisan'
			});
			const effect = () => {
				setInterval(() => {
					meta.counter += 1;
				}, 1000);
			};
			React.useEffect(effect, []);

			return html`<div>
				 wow <span>Mantab</span>
				 <div>${meta.text}</div>
				 <${Canvas} />
				 ${meta.counter}
				 <${Mantab}> Okedeh <//>
			</div>`;
		})
		ReactDOM.render(
			React.createElement(Greetings),
			this.element
		);
	}
	protected renderHeader(container: HTMLElement): void { }
	protected renderBody(container: HTMLElement): void {
	}
	protected layoutBody(height: number, width: number): void {
		this.element.setAttribute('style', 'background: white;width: 100%;height:100%;');
	}
}
