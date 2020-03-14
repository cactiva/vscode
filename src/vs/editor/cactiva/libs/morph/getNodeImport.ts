import { JsxElement, JsxOpeningElement, JsxSelfClosingElement, Node, ClassDeclaration } from 'ts-morph';
import { walkNode } from 'vs/editor/cactiva/libs/morph/walk';
import { getTagName } from 'vs/editor/cactiva/libs/morph/getTagName';

export function getImportClause(root: Node) {
	let tagName = getTagName(root);
	let text = '';
	if (root instanceof JsxSelfClosingElement || root instanceof JsxElement) {
		walkNode(root, (node: Node) => {
			if (node instanceof JsxOpeningElement) {
				const tagNameNode: any = node.getTagNameNode();
				const definitionNodes = tagNameNode.getDefinitionNodes();
				for (const defNode of definitionNodes) {
					if (defNode instanceof ClassDeclaration) {
						const impDeclarations = node.getSourceFile().getImportDeclarations();
						for (const impDec of impDeclarations) {
							const moduleSpecifier: any = impDec.compilerNode.moduleSpecifier;
							const namedBindings: any = impDec.compilerNode.importClause?.namedBindings;
							if (!!namedBindings) {
								let idx = namedBindings.elements?.findIndex((x: any) => x.symbol.name === tagName);
								if (idx > -1) text = moduleSpecifier.text;
							}
						}
					} else text = walkParent(defNode.compilerNode);
				}
			}
		});
	}
	return text;
}

const walkParent = (node: any): string => {
	if (!!node && Object.keys(node).indexOf('moduleSpecifier') > -1) {
		return node.moduleSpecifier.text;
	} else if (!!node.parent) {
		return walkParent(node.parent);
	}
	return '';
};
