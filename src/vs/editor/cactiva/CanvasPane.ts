/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as ReactDOM from 'react-dom';
import { IPaneOptions, Pane } from 'vs/base/browser/ui/splitview/paneview';
import { IView } from 'vs/base/browser/ui/splitview/splitview';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import { CanvasEditorWidget } from 'vs/editor/cactiva/canvasEditorWidget';
import Editor from 'vs/editor/cactiva/editor/Editor';
import html from 'vs/editor/cactiva/libs/html';
import EditorSource from 'vs/editor/cactiva/models/EditorSource';
import { cactiva } from 'vs/editor/cactiva/models/store';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';

export class CanvasPane extends Pane implements IView {
	private _canvas = observable({ id: '', root: undefined as EditorCanvas | undefined });
	public updateModelData(modelData: ModelData, editor: CanvasEditorWidget) {
		const id = modelData.model.id;
		if (!cactiva.canvas[id]) {
			cactiva.canvas[id] = new EditorCanvas(id);
		}

		this._canvas.id = id;
		this._canvas.root = cactiva.canvas[id];
		const canvas = this._canvas.root;

		if (canvas.source.fileName === modelData.model.uri.fsPath) {
			canvas.source.updateContent(modelData.model.getValue());
		} else {
			canvas.source.dispose();
			canvas.source = new EditorSource(modelData.model.uri.fsPath, modelData.model.getValue(), canvas);
		}

		canvas.editor = editor;
		canvas.modelData = modelData;
	}

	constructor(options: IPaneOptions) {
		super(options);

		const Canvas = observer(() => {
			if (!this._canvas.root) return null;
			return html`
				<${Editor} canvas=${this._canvas.root} />
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
