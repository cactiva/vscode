import { Node } from 'ts-morph';
import { getChildrenFromNode } from 'vs/editor/cactiva/models/worker/morph/getChildrenFromNode';

export function getNodeFromPath(
	source: Node | undefined,
	nodePath: string,
	whenEachFound?: (node: Node, path: string) => void
): Node | null {
	if (!nodePath || !source) return source || null;

	const lastPath: string[] = [];
	let lastNode = source;
	let continueLoop = true;
	nodePath.split('.').forEach((e, idx: number) => {
		if (!continueLoop) return;
		lastPath.push(e);
		const num = parseInt(e);
		const path = lastPath.join('.');
		const children = getChildrenFromNode(lastNode);
		const child = children[num];

		if (child) {
			if (whenEachFound) {
				whenEachFound(child, path);
			}
			lastNode = child;
		} else {
			continueLoop = false;
		}
	});
	return lastNode;
}
