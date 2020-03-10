/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Pane, IPaneOptions } from 'vs/base/browser/ui/splitview/paneview';
import { IView } from 'vs/base/browser/ui/splitview/splitview';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import Editor from 'vs/editor/cactiva/editor/Editor';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';
import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';
import { JsxSelfClosingElement, JsxExpression, JsxElement, JsxFragment, JsxText, Node } from 'ts-morph';

export class CanvasPane extends Pane implements IView {
	private _sidebarMutationObserver = {
		obs: null as any,
		el: null as any
	};

	public selectNode(node: Node) {
		cactiva.breadcrumbs = [];
		cactiva.breadcrumbs.push(node);
		cactiva.selectedNode = {
			node: node,
			start: {
				line: node.getStartLineNumber(),
				column: node.getPos()
			},
			end: {
				line: node.getEndLineNumber(),
				column: node.getEnd()
			}
		};
	}

	public updateModelData(modelData: ModelData) {
		cactiva.source = cactiva.project.createSourceFile(modelData.model.uri.fsPath, modelData.model.getValue(), {
			overwrite: true
		});

		const list = [] as Node[];
		walkNode(cactiva.source, (node: Node) => {
			if (
				node instanceof JsxSelfClosingElement ||
				node instanceof JsxExpression ||
				node instanceof JsxElement ||
				node instanceof JsxFragment ||
				node instanceof JsxText
			) {
				list.push(node);
				return false;
			}
			return true;
		});
		if (list.length > 0) {
			this.selectNode(list[0]);
		}
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
