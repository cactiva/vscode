import { Node } from 'ts-morph';

export const walkNode: any = (root: Node, f: (node: Node, meta?: any) => boolean, prevMeta?:any) => {
	if (!!root && root.forEachChild) {
		root.forEachChild(e => {
			const result = f(e, prevMeta);
			if (result) {
				if (e && e.forEachChild) {
					walkNode(e, f, result);
				}
			}
		});
	}
};
