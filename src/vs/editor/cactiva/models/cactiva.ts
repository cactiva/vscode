/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { IObservableValue, observable } from 'mobx';
import { MutableRefObject } from 'react';
import { Node, Project, SourceFile } from 'ts-morph';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import { CanvasEditorWidget } from 'vs/editor/cactiva/canvasEditorWidget';
import { IEditorConstructionOptions } from 'vs/editor/common/config/editorOptions';

export interface IEditorNodeInfo {
	node: IObservableValue<Node>;
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
	selectingFromCanvas?: boolean;
	hoveredNode?: Node;
}

interface IEditorProps {
	el?: HTMLElement;
	nodeInfo?: IEditorNodeInfo;
	hidden?: boolean;
}

interface IEditorStore {
	project: Project;
	propsEditor: IEditorProps;
	canvas: { [key: string]: IEditorCanvas };
	mode: 'preview' | 'layout';
}

export const cactiva: IEditorStore = observable({
	project: new Project(),
	propsEditor: {},
	canvas: {},
	mode: 'preview'
});
