/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { cactiva, IEditorCanvas, IEditorNodeInfo } from 'vs/editor/cactiva/models/cactiva';
import { Range } from 'vs/editor/common/core/range';
import { generateNodeInfo } from 'vs/editor/cactiva/libs/morph/generateNodeInfo';

export function selectNode(canvas: IEditorCanvas, nodePath: string, selector: 'canvas' | 'code' | 'breadcrumb') {
	if (canvas) {
		const breadrumbs: IEditorNodeInfo[] = [];
		getNodeFromPath(canvas.source, nodePath, (n, path) => {
			breadrumbs.push(generateNodeInfo(n, path));
		});
		canvas.breadcrumbs = breadrumbs;
		canvas.selectedNode = canvas.breadcrumbs[canvas.breadcrumbs.length - 1];

		if (selector === 'code') {
			// only show propsEditor when it's not hidden
			if (!cactiva.propsEditor.hidden) {
				cactiva.propsEditor.nodeInfo = canvas.selectedNode;
			}

			// always show propsEditor on code select
			// cactiva.propsEditor.hidden = false;
			// cactiva.propsEditor.nodeInfo = canvas.selectedNode;

			const cnode = canvas.selectedNode.node.get().compilerNode;
			const dom = (cnode as any).domRef;
			if (dom && dom.current) {
				dom.current.scrollIntoView({
					behavior: 'auto',
					block: 'center',
					inline: 'center'
				});
			}
		} else if (selector === 'canvas' || selector === 'breadcrumb') {
			cactiva.propsEditor.hidden = false;
			cactiva.propsEditor.nodeInfo = canvas.selectedNode;
			const s = canvas.selectedNode.start;
			const e = canvas.selectedNode.end;
			canvas.selectingFromCanvas = true;
			canvas.editor?.setSelection(new Range(s.line, s.column, e.line, e.column));
			canvas.editor?.revealLineNearTop(s.line);
			canvas.editor?.focus();
		}
	}
}
