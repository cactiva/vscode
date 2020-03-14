import { generateNodeInfo } from 'vs/editor/cactiva/libs/morph/generateNodeInfo';
import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { cactiva, IEditorCanvas, IEditorNodeInfo } from 'vs/editor/cactiva/models/cactiva';

export function selectRootNode(canvas: IEditorCanvas, index: number): Promise<IEditorNodeInfo> {
	return new Promise(resolve => {
		if (!canvas) {
			resolve(undefined);
			return;
		}
		if (canvas.source) {
			canvas.breadcrumbs = [];
			getNodeFromPath(canvas.source, index.toString(), (n, path) => {
				const result = generateNodeInfo(n, path);
				canvas.breadcrumbs.push(result);
				cactiva.propsEditor.hidden = true;
				resolve(result);
			});
		}
	});
}
