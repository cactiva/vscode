import { cactiva } from 'vs/editor/cactiva/models/cactiva';
import { getNodeFromPath } from 'vs/editor/cactiva/libs/morph/getNodeFromPath';
import { generateNodeInfo } from 'vs/editor/cactiva/editor/Editor';

export const syncSource = () => {
	if (cactiva.source) {
		const lastPath = cactiva.breadcrumbs[cactiva.breadcrumbs.length - 1];
		getNodeFromPath(cactiva.source, lastPath.nodePath, (n, path) => {
			cactiva.breadcrumbs.forEach((e, idx) => {
				if (e.nodePath === path) {
					cactiva.breadcrumbs[idx] = generateNodeInfo(n, path);
				}
			});
		});
	}
};
