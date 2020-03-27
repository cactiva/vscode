const mine = self as any;
const modules = {} as any;
const wpath = 'vs/editor/cactiva/models/worker';
const coreDefine = function(this: string, deps: any, definition: any) {
	const args = deps.map((e: string) => {
		if (e === 'require') {
			return require;
		}
		if (e === 'exports') {
			if (this) {
				if (modules[this]) {
					return modules[this];
				}
				modules[this] = {};
				return modules[this];
			}
			return {};
		}
		if (e.indexOf(wpath) === 0) {
			mine.define = coreDefine.bind(e);
			require('.' + e.substr(wpath.length) + '.js');
			return modules[e];
		} else {
			return require(e);
		}
	});
	definition(...args);
};

mine.define = coreDefine.bind('');

require('./CactivaWorker');
