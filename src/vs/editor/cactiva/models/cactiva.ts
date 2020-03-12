/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { observable } from 'mobx';
import { Node, Project, SourceFile } from 'ts-morph';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import { IEditorConstructionOptions } from 'vs/editor/common/config/editorOptions';

export interface IEditorNodeInfo {
	node: Node;
	nodePath: string;
	start: { line: number; column: number };
	end: { line: number; column: number };
}
interface IEditorStore {
	project: Project;
	breadcrumbs: IEditorNodeInfo[];
	modelData?: ModelData;
	editorOptions?: IEditorConstructionOptions;
	source?: SourceFile;
	selectedNode?: IEditorNodeInfo;
	hoveredNode?: Node;
}

export const cactiva: IEditorStore = observable({
	project: new Project(),
	breadcrumbs: [],
	modelData: undefined,
	editorOptions: undefined,
	source: undefined,
	selectedNode: undefined,
	hoveredNode: undefined
});
