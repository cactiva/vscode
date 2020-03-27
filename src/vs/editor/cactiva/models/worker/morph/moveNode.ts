import { JsxElement, JsxFragment, JsxSelfClosingElement, Node, SourceFile } from 'ts-morph';
import { getNodeFromPath } from 'vs/editor/cactiva/models/worker/morph/getNodeFromPath';
import { format } from 'prettier';

export function moveNode(
	source: Node | undefined,
	fromPath: string,
	toPath: string,
	position: 'children' | 'before' | 'after',
	count?: number
): any {
	if (!source) return '';
	if (count === 1) return source.getText();

	const from = getNodeFromPath(source, fromPath);
	let to = getNodeFromPath(source, toPath);
	const isMovingToSelf = toPath.indexOf(fromPath) === 0;

	if (!isMovingToSelf && from && to && !from.wasForgotten() && !to.wasForgotten()) {
		const code = from.getText().trim();
		from.replaceWithText('');

		if (position === 'children') {
			if (to instanceof JsxElement || to instanceof JsxFragment) {
				const children = to.getChildren().map(e => e.getText());
				children.splice(1, 0, code);
				to.replaceWithText(children.join(''));
			} else if (to instanceof JsxSelfClosingElement) {
				const toCode = to.getText();
				const toTagUnclosed = toCode.substr(0, toCode.length - 2);
				to.replaceWithText(`${toTagUnclosed}>${code}</${to.getTagNameNode().getText()}>`);
			}
		} else if (position === 'after') {
			const parent = to.getParent();
			if (parent) {
				let toIndex = -1;
				let children: any = null;
				let syntaxList = null;
				if (parent instanceof JsxElement || parent instanceof JsxFragment) {
					syntaxList = to.getParentSyntaxList();
					if (!syntaxList) {
						syntaxList = parent.getChildSyntaxList();
					}
					if (syntaxList) {
						children = syntaxList.getChildren();
					}
				} else {
					children = parent.getChildren();
				}

				if (children) {
					children.forEach((e: any, index: number) => {
						if (e === to) {
							toIndex = index;
						}
					});
					if (toIndex >= 0) {
						const childrenText = children.map((e: any) => e.getText().trim());
						childrenText.splice(toIndex + (position === 'after' ? 1 : 0), 0, code);
						if (syntaxList) {
							syntaxList.replaceWithText(childrenText.join(''));
						} else {
							parent.replaceWithText(childrenText.join(''));
						}
					}
				}
			}
		}

		const text = source.getText();
		return format(text);
	} else {
		if (source instanceof SourceFile) source.refreshFromFileSystem();
		return moveNode(source, fromPath, toPath, position, (count || 0) + 1);
	}
}
