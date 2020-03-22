import { Disposable } from 'vs/base/common/lifecycle';
import { CactivaWorker } from 'vs/editor/cactiva/models/store';

export default class EditorDisposable extends Disposable {
	private _lastMsgId = 1;
	private _sendMessage(type: string, message: any) {
		const id = this._lastMsgId++;
		CactivaWorker.postMessage({
			type,
			message,
			id
		});
		return id;
	}

	protected executeInWorker(type: string, message: any): Promise<any> {
		return new Promise(resolve => {
			let id = -1;
			const received = (e: any) => {
				if (e.data.id === id) {
					resolve(e.data.message);
					CactivaWorker.addEventListener('message', received);
				}
			};
			CactivaWorker.addEventListener('message', received);
			id = this._sendMessage(type, message);
		});
	}

	constructor() {
		super();
	}
}
