/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { observable } from 'mobx';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';
import EditorNode from 'vs/editor/cactiva/models/EditorNode';

export const CactivaWorker = new Worker(require.toUrl('./worker/CactivaWorkerIPC.js'));

interface IEditorProps {
	el?: HTMLElement;
	node?: EditorNode;
	hidden?: boolean;
	mode?: 'popup' | 'sidebar';
}

interface IEditorStore {
	propsEditor: IEditorProps;
	fontColor: string;
	canvas: { [key: string]: EditorCanvas };
	mode: 'layout' | 'hybrid' | 'preview';
}

export const cactiva: IEditorStore = observable({
	propsEditor: {
		mode: 'popup',
		hidden: false
	},
	fontColor: '#fff',
	canvas: {},
	mode: localStorage.cactivaMode || 'layout'
});
