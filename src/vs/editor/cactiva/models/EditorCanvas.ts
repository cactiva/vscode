import { observable, observe } from 'mobx';
import { ModelData } from 'vs/editor/browser/widget/codeEditorWidget';
import { CanvasEditorWidget } from 'vs/editor/cactiva/canvasEditorWidget';
import EditorBase from 'vs/editor/cactiva/models/EditorBase';
import EditorNode from 'vs/editor/cactiva/models/EditorNode';
import EditorSource from 'vs/editor/cactiva/models/EditorSource';
import { cactiva } from 'vs/editor/cactiva/models/store';
import { IEditorConstructionOptions } from 'vs/editor/common/config/editorOptions';
import { Range } from 'vs/editor/common/core/range';

export default class EditorCanvas extends EditorBase {
	@observable breadcrumbs: EditorNode[] = [];
	@observable id: string;
	@observable modelData?: ModelData;
	@observable editor?: CanvasEditorWidget;
	@observable editorOptions?: IEditorConstructionOptions;
	@observable source: EditorSource;
	@observable selectedNode?: EditorNode;
	@observable selectingFromCanvas?: boolean;
	@observable hoveredNode?: EditorNode;
	@observable isReady: boolean = false;

	constructor(id: string) {
		super();
		this.id = id;
		this.source = new EditorSource('', '', this);

		this._register({
			dispose: observe(this, 'source', async (e: any) => {
				await this.selectRootNode('0');
			})
		});
	}

	async selectRootNode(path: string) {
		this.isReady = false;
		this.breadcrumbs = [];
		await this.source.getNodeFromPath(path, (node, npath) => {
			this.breadcrumbs.push(node);
			cactiva.propsEditor.hidden = true;
		});
		this.isReady = true;
	}

	async selectNode(path: string, from: 'canvas' | 'code' | 'breadcrumb') {
		const breadrumbs: EditorNode[] = [];
		await this.source.getNodeFromPath(path, n => {
			breadrumbs.push(n);
		});
		this.breadcrumbs = breadrumbs;
		this.selectedNode = this.breadcrumbs[this.breadcrumbs.length - 1];

		if (!this.selectedNode) return;
		if (from === 'code') {
			// only show propsEditor when it's not hidden
			if (!cactiva.propsEditor.hidden) {
				cactiva.propsEditor.node = this.selectedNode;
			}

			// always show propsEditor on code select
			// cactiva.propsEditor.hidden = false;
			// cactiva.propsEditor.nodeInfo = this.selectedNode;

			const cnode = this.selectedNode;
			const dom = cnode.domRef;
			if (dom && dom.current) {
				dom.current.scrollIntoView({
					behavior: 'auto',
					block: 'center',
					inline: 'center'
				});
			}
		} else if (from === 'canvas' || from === 'breadcrumb') {
			cactiva.propsEditor.hidden = false;
			cactiva.propsEditor.node = this.selectedNode;
			const s = this.selectedNode.start;
			const e = this.selectedNode.end;
			this.selectingFromCanvas = true;
			this.editor?.setSelection(new Range(s.line, s.column, e.line, e.column));
			this.editor?.revealLineNearTop(s.line);
			this.editor?.focus();
		}
	}
}
