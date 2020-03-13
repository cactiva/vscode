/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
import * as ReactDOM from 'react-dom';
import { IPaneOptions, Pane } from 'vs/base/browser/ui/splitview/paneview';
import { IView } from 'vs/base/browser/ui/splitview/splitview';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import Editor, { generateNodeInfo } from 'vs/editor/cactiva/editor/Editor';
import html from 'vs/editor/cactiva/libs/html';
import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { cactiva, IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { CanvasEditorWidget } from 'vs/editor/cactiva/canvasEditorWidget';

export class CanvasPane extends Pane implements IView {
	private _sidebarMutationObserver = {
		obs: null as any,
		el: null as any
	};

	private _canvas = observable({ id: '', data: null as IEditorCanvas | null });
	private _selectFirstNode() {
		const canvas = this._canvas.data;
		if (!canvas) return;
		canvas.breadcrumbs = [];
		if (canvas.source) {
			getNodeFromPath(canvas.source, '0', (n, path) => {
				canvas.breadcrumbs.push(generateNodeInfo(n, path));
			});
		}
	}

	private _updateSidebarStyle(e: any) {
		console.log(e);
	}

	public updateModelData(modelData: ModelData, editor: CanvasEditorWidget) {
		const id = modelData.model.id;
		if (!cactiva.canvas[id]) {
			cactiva.canvas[id] = {
				breadcrumbs: []
			};
		}

		this._canvas.id = id;
		this._canvas.data = cactiva.canvas[id];
		const canvas = this._canvas.data;
		canvas.source = cactiva.project.createSourceFile(modelData.model.uri.fsPath, modelData.model.getValue(), {
			overwrite: true
		});
		canvas.editor = editor;
		canvas.modelData = modelData;
		this._selectFirstNode();
	}

	constructor(options: IPaneOptions) {
		super(options);

		const Canvas = observer(() => {
			if (!this._canvas.data) return null;
			return html`
				<${Editor} canvas=${this._canvas.data} />
			`;
		});

		ReactDOM.render(
			html`
				<${Canvas} />
			`,
			this.element
		);
	}

	private _updateStyle(): HTMLElement | null {
		this.element.setAttribute('style', `background:transparent;;width: 100%;height:100%;`);
		return null;
	}
	protected renderHeader(container: HTMLElement): void {}
	protected renderBody(container: HTMLElement): void {}

	dispose() {
		this.disposeSidebarMutationObserver();
	}

	disposeSidebarMutationObserver() {
		if (document.body.contains(this._sidebarMutationObserver.el) && this._sidebarMutationObserver.obs) {
			this._sidebarMutationObserver.obs.disconnect();
		}
	}
	protected layoutBody(height: number, width: number): void {
		this._updateStyle();
		const sidebar = document.getElementById('workbench.parts.sidebar');
		if (sidebar) {
			this.disposeSidebarMutationObserver();
			var obs = new MutationObserver(this._updateSidebarStyle);
			obs.observe(sidebar, { attributeFilter: ['style'] });
			this._sidebarMutationObserver.obs = obs;
			this._sidebarMutationObserver.el = sidebar;
		}
	}
}
