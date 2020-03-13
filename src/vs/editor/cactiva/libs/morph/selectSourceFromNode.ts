import { Node } from 'ts-morph';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';
import { getLeadingChar } from 'vs/editor/cactiva/libs/morph/getLeadingChar';
import { Range } from 'vs/editor/common/core/range';

export function selectSourceFromNode(node: Node) {
	const id = (node.getSourceFile() as any).editorId;
	const canvas = cactiva.canvas[id];

	const src = node.getSourceFile().getFullText();
	const startPos = node.getPos();
	const s = {
		line: node.getStartLineNumber(),
		column: getLeadingChar(src, startPos, true)
	};
	const e = {
		line: node.getEndLineNumber(),
		column: getLeadingChar(src, node.getEnd())
	};

	canvas.editor?.setSelection(new Range(s.line, s.column, e.line, e.column));
	canvas.editor?.revealLineNearTop(s.line);
}
