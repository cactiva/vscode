/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

 import { observable } from 'mobx';
import { OutlineModel } from 'vs/editor/contrib/documentSymbols/outlineModel';

export const canvasStore = observable({
	outlineModel: null as OutlineModel | null
});
