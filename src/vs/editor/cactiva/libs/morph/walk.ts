import { Node } from 'ts-morph';

export const walkNode: any = (root: Node, f: (node: Node) => boolean) => {
	if (!!root && root.forEachChild) {
		root.forEachChild(e => {
			if (f(e)) {
				if (e && e.forEachChild) {
					walkNode(e, f);
				}
			}
		});
	}
}
