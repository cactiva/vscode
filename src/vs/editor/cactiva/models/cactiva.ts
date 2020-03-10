/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { observable } from 'mobx';
import { SourceFile, Project, Node } from 'ts-morph';

export interface IEditorSelectedNode {
	node: Node,
	start: { line: number, column: number },
	end: { line: number, column: number },
};

export const cactiva: any = observable({
	project: new Project(),
	breadcrumbs: [] as Node[],
	source: null as SourceFile | null,
	selectedNode: undefined as (IEditorSelectedNode | undefined),
});
