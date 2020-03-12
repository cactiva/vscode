/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IPaneOptions, Pane } from 'vs/base/browser/ui/splitview/paneview';
import { IView } from 'vs/base/browser/ui/splitview/splitview';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import Editor, { generateNodeInfo } from 'vs/editor/cactiva/editor/Editor';
import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';

export class CanvasPane extends Pane implements IView {
	private _sidebarMutationObserver = {
		obs: null as any,
		el: null as any
	};

	private _selectFirstNode() {
		cactiva.breadcrumbs = [];
		if (cactiva.source) {
			getNodeFromPath(cactiva.source, '0', (n, path) => {
				cactiva.breadcrumbs.push(generateNodeInfo(n, path));
			});
		}
	}

	public updateModelData(modelData: ModelData) {
		cactiva.source = cactiva.project.createSourceFile(modelData.model.uri.fsPath, modelData.model.getValue(), {
			overwrite: true
		});
		cactiva.modelData = modelData;
		this._selectFirstNode();

		// if (list.length === 1 && cactiva.breadcrumbs.length === 0) {
		// 	this.selectNode(list[0]);
		// }
	}

	constructor(options: IPaneOptions) {
		super(options);
		ReactDOM.render(React.createElement(Editor), this.element);
	}

	private _updateStyle(): HTMLElement | null {
		// const sidebar = document.getElementById('workbench.parts.sidebar');
		const style = `
		background:transparent;
		`;
		this.element.setAttribute('style', `${style};width: 100%;height:100%;`);
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
		// if (sidebar) {
		// 	this.disposeSidebarMutationObserver();
		// 	var obs = new MutationObserver(() => {
		// 		this._updateStyle();
		// 	});
		// 	obs.observe(sidebar, { attributeFilter: ['style'] });
		// 	this._sidebarMutationObserver.obs = obs;
		// 	this._sidebarMutationObserver.el = sidebar;
		// }
	}
}
