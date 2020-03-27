import { getNodeFromPath } from 'vs/editor/cactiva/models/worker/morph/getNodeFromPath';
import { JsxElement, JsxFragment, SyntaxList, Node } from 'ts-morph';

export function cleanParentWhitespace(source: Node, pos: string): any {
	const fromParentPath = pos.split('.');
	fromParentPath.pop();
	const fromParent = getNodeFromPath(source, fromParentPath.join('.'));
	if (fromParent instanceof JsxElement || fromParent instanceof JsxFragment) {
		const children = fromParent
			.getChildren()
			.map(e => {
				if (e instanceof SyntaxList) {
					const c = e.getChildren();
					if (c) {
						return c
							.map(e => {
								return e.getText().trim();
							})
							.filter(e => !!e)
							.join('')
							.trim();
					}
				}
				return e.getText().trim();
			})
			.filter(e => !!e);
		fromParent.replaceWithText(children.join(''));
	}
}
