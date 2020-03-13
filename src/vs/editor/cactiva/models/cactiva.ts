/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { observable } from 'mobx';
import { Node, Project, SourceFile } from 'ts-morph';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import { IEditorConstructionOptions } from 'vs/editor/common/config/editorOptions';
import { CanvasEditorWidget } from 'vs/editor/cactiva/canvasEditorWidget';

export interface IEditorNodeInfo {
	node: Node;
	nodePath: string;
	start: { line: number; column: number };
	end: { line: number; column: number };
}
export interface IEditorCanvas {
	breadcrumbs: IEditorNodeInfo[];
	modelData?: ModelData;
	editor?: CanvasEditorWidget;
	editorOptions?: IEditorConstructionOptions;
	source?: SourceFile;
	selectedNode?: IEditorNodeInfo;
	hoveredNode?: Node;
}
interface IEditorStore {
	project: Project;
	sidebarStyle?: CSSStyleDeclaration;
	canvas: { [key: string]: IEditorCanvas };
}

export const cactiva: IEditorStore = observable({
	project: new Project(),
	canvas: {}
});
