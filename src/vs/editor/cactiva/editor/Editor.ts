/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { observer, useObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import 'vs/css!./Editor';
import Breadcrumb from 'vs/editor/cactiva/editor/canvas/Breadcrumb';
import { Tag } from 'vs/editor/cactiva/editor/canvas/Tag';
import TagDragPreview from 'vs/editor/cactiva/editor/canvas/tag/TagDragPreview';
import PropsEditor from 'vs/editor/cactiva/editor/props/PropsEditor';
import html from 'vs/editor/cactiva/libs/html';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';
import EditorNode from 'vs/editor/cactiva/models/EditorNode';
import { cactiva } from 'vs/editor/cactiva/models/store';

export default observer(({ canvas }: { canvas: EditorCanvas }) => {
	const meta = useObservable({
		root: undefined as EditorNode | undefined
	});

	useEffect(() => {
		let rootItem: EditorNode | undefined = undefined;
		if (canvas.breadcrumbs.length > 0) {
			rootItem = canvas.breadcrumbs[0];
		}
		meta.root = rootItem;
	}, [canvas.breadcrumbs, canvas.breadcrumbs.length, canvas.selectedNode]);

	const propsEditorEl = cactiva.propsEditor.el;
	const mode = cactiva.mode;

	const tagClicked = (node: EditorNode) => {
		if (canvas.source) {
			canvas.selectNode(node.path, 'canvas');
		}
	};
	const breadcrumbClicked = (node: EditorNode) => {
		canvas.selectNode(node.path, 'canvas');
	};

	if (!canvas) {
		return html`
			<div>Canvas can't be loaded</div>
		`;
	}

	return html`
		<${DndProvider} backend=${HTML5Backend}>
			${propsEditorEl &&
				html`
					<${PropsEditor} domNode=${propsEditorEl} />
				`}
			<${TagDragPreview} />
			<div className="cactiva-canvas">
				<div className=${`cactiva-canvas-content ${mode}`}>
					${!meta.root
						? !canvas.isReady
							? null
							: html`
									<div>No Component to Render</div>
							  `
						: html`
								<${Tag} canvas=${canvas} isLast=${true} node=${meta.root} onClick=${tagClicked} />
						  `}
				</div>
				<${Breadcrumb} canvas=${canvas} onClick=${breadcrumbClicked} />
			</div>
		<//>
	`;
});
