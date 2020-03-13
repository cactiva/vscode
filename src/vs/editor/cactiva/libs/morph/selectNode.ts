/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { cactiva, IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';
import { Range } from 'vs/editor/common/core/range';
import { generateNodeInfo } from 'vs/editor/cactiva/libs/morph/generateNodeInfo';

export function selectNode(canvas: IEditorCanvas, nodePath: string, selector: 'canvas' | 'code') {
	if (canvas) {
		canvas.breadcrumbs = [];
		getNodeFromPath(canvas.source, nodePath, (n, path) => {
			canvas.breadcrumbs.push(generateNodeInfo(n, path));
		});
		canvas.selectedNode = canvas.breadcrumbs[canvas.breadcrumbs.length - 1];

		if (selector === 'code') {
			if (!cactiva.propsEditor.hidden) {
				cactiva.propsEditor.nodeInfo = canvas.selectedNode;
			}
			const cnode = canvas.selectedNode.node.get().compilerNode;
			const dom = (cnode as any).domRef;
			if (dom && dom.current) {
				dom.current.scrollIntoView({
					behavior: 'auto',
					block: 'center',
					inline: 'center'
				});
			}
		} else if (selector === 'canvas') {
			cactiva.propsEditor.nodeInfo = canvas.selectedNode;
			const s = canvas.selectedNode.start;
			const e = canvas.selectedNode.end;
			canvas.selectingFromCanvas = true;
			canvas.editor?.setSelection(new Range(s.line, s.column, e.line, e.column));
			canvas.editor?.revealLineNearTop(s.line);
		}
	}
}
