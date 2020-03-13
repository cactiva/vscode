import { SourceFile, Node } from 'ts-morph';
import { getChildrenFromNode } from 'vs/editor/cactiva/libs/morph/getChildrenFromNode';

export function getRootNodes(source: SourceFile): Node[] {
	if (!source) return [];
	return getChildrenFromNode(source);
}
