"use strong";
"use strict";

const _require = Module.prototype.require;
const _readJson = require('read-package-json');

function readJson(file, log_, strict_, cb_) {
	let log, strict, cb;
	for(let i = 1; i < arguments.length - 1; i++) {
		if(typeof arguments[i] === 'boolean') {
			strict = arguments[i];
		} else if(typeof arguments[i] === 'function') {
			log = arguments[i];
		}
	}

	if (!log) {
		log = function () {};
	}
	cb = arguments[arguments.length - 1];

	// We replace cb with our own callback that modifies
	// data.dependencies before it is given to the user.
	readJson_(file, log, strict, function(err, data) {
		if(data) {
			if(typeof data.dependencies === "object") {
				delete data.dependencies["request"];
			}
		}
		cb(err, data);
	});
}

Module.prototype.require = function cachePathsRequire(name) {
	if(name === 'read-package-json') {
		return readJson;
	}
	return _require.call(this, name);
}
