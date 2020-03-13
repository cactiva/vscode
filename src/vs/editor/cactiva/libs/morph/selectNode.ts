/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { generateNodeInfo } from 'vs/editor/cactiva/editor/Editor';
import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { cactiva, IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';
import { Range } from 'vs/editor/common/core/range';

export function selectNode(canvas: IEditorCanvas, nodePath: string, shouldSelectInEditor: boolean) {
	if (canvas) {
		canvas.breadcrumbs = [];
		getNodeFromPath(canvas.source, nodePath, (n, path) => {
			canvas.breadcrumbs.push(generateNodeInfo(n, path));
		});
		canvas.selectedNode = canvas.breadcrumbs[canvas.breadcrumbs.length - 1];
		cactiva.propsEditor.nodeInfo = canvas.selectedNode;

		if (!!shouldSelectInEditor) {
			const s = canvas.selectedNode.start;
			const e = canvas.selectedNode.end;
			canvas.editor?.setSelection(new Range(s.line, s.column, e.line, e.column));
			canvas.editor?.revealLineNearTop(s.line);
		}
	}
}
