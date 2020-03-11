/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { observable } from 'mobx';
import { SourceFile, Project, Node } from 'ts-morph';

export interface IEditorNodeInfo {
	node: Node;
	nodePath: string;
	start: { line: number; column: number };
	end: { line: number; column: number };
}

export const cactiva = observable({
	project: new Project(),
	breadcrumbs: [] as IEditorNodeInfo[],
	source: null as SourceFile | null,
	selectedNode: undefined as IEditorNodeInfo | undefined
});
