/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
import * as ReactDOM from 'react-dom';
import { IPaneOptions, Pane } from 'vs/base/browser/ui/splitview/paneview';
import { IView } from 'vs/base/browser/ui/splitview/splitview';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import Editor from 'vs/editor/cactiva/editor/Editor';
import html from 'vs/editor/cactiva/libs/html';
import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { cactiva, IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { CanvasEditorWidget } from 'vs/editor/cactiva/canvasEditorWidget';
import { generateNodeInfo } from 'vs/editor/cactiva/libs/morph/generateNodeInfo';
import { selectRootNode } from 'vs/editor/cactiva/libs/morph/selectRootNode';

export class CanvasPane extends Pane implements IView {
	private _canvas = observable({ id: '', data: null as IEditorCanvas | null });
	private _selectFirstNode() {
		if (this._canvas.data) selectRootNode(this._canvas.data, 0);
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
		(canvas.source as any).editorId = id;
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

	protected renderHeader(container: HTMLElement): void {}
	protected renderBody(container: HTMLElement): void {}
	protected layoutBody(height: number, width: number): void {
		this.element.setAttribute('style', 'width: 100%;height:100%;');
	}
}
