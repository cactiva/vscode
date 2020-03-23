import { observable } from 'mobx';
import EditorBase from 'vs/editor/cactiva/models/EditorBase';
import EditorNodeAttr from 'vs/editor/cactiva/models/EditorNodeAttr';
import EditorSource from 'vs/editor/cactiva/models/EditorSource';

export interface IEditorNodePos {
	line: number;
	column: number;
}

export default class EditorNode extends EditorBase {
	@observable start: IEditorNodePos = {
		line: 0,
		column: 0
	};
	@observable end: IEditorNodePos = {
		line: 0,
		column: 0
	};

	@observable path = '';
	@observable text = '';
	@observable kind = '';
	@observable expression = '';
	@observable children: EditorNode[] = [];
	@observable source: EditorSource;
	@observable domRef: any = undefined;

	constructor(props: {
		source: EditorSource;
		path: string;
		text: string;
		kind: string;
		children: EditorNode[];
		start: IEditorNodePos;
		end: IEditorNodePos;
		expression: string;
	}) {
		super();
		this.source = props.source;
		this.path = props.path;
		this.text = props.text;
		this.kind = props.kind;
		this.start = props.start;
		this.end = props.end;
		this.expression = props.expression;

		if (Array.isArray(props.children)) {
			this.children = props.children.map((e: any) => {
				if (e instanceof EditorNode) {
					return e;
				} else {
					return new EditorNode({ ...e, source: this.source });
				}
			});
		}
	}

	async getAttributes(): Promise<EditorNodeAttr[]> {
		const result = await this.executeInWorker('node:getAttributes', {
			fileName: this.source.fileName,
			path: this.path
		});
		if (result) {
			return result.map((e: any) => {
				return new EditorNodeAttr({ ...e, node: this });
			});
		} else {
			return [];
		}
	}
}
