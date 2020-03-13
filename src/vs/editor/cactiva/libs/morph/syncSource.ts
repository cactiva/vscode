import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';
import { generateNodeInfo } from 'vs/editor/cactiva/libs/morph/generateNodeInfo';

export const syncSource = (canvas: IEditorCanvas) => {
	if (canvas.source) {
		const lastPath = canvas.breadcrumbs[canvas.breadcrumbs.length - 1];
		getNodeFromPath(canvas.source, lastPath.nodePath, (n, path) => {
			canvas.breadcrumbs.forEach((e, idx) => {
				if (e.nodePath === path) {
					canvas.breadcrumbs[idx] = generateNodeInfo(n, path);
				}
			});
		});
	}
};
