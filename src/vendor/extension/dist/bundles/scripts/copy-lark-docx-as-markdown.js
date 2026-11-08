(function() {

//#region rolldown:runtime
	var __defProp = Object.defineProperty;
	var __export = (all$2) => {
		let target = {};
		for (var name in all$2) __defProp(target, name, {
			get: all$2[name],
			enumerable: true
		});
		return target;
	};

//#endregion

//#region ../../node_modules/.pnpm/i18next@23.16.8/node_modules/i18next/dist/esm/i18next.js
	const isString$1 = (obj) => typeof obj === "string";
	const defer = () => {
		let res;
		let rej;
		const promise = new Promise((resolve, reject) => {
			res = resolve;
			rej = reject;
		});
		promise.resolve = res;
		promise.reject = rej;
		return promise;
	};
	const makeString = (object) => {
		if (object == null) return "";
		return "" + object;
	};
	const copy = (a$2, s$2, t$2) => {
		a$2.forEach((m$1) => {
			if (s$2[m$1]) t$2[m$1] = s$2[m$1];
		});
	};
	const lastOfPathSeparatorRegExp = /###/g;
	const cleanKey = (key$1) => key$1 && key$1.indexOf("###") > -1 ? key$1.replace(lastOfPathSeparatorRegExp, ".") : key$1;
	const canNotTraverseDeeper = (object) => !object || isString$1(object);
	const getLastOfPath = (object, path, Empty) => {
		const stack = !isString$1(path) ? path : path.split(".");
		let stackIndex = 0;
		while (stackIndex < stack.length - 1) {
			if (canNotTraverseDeeper(object)) return {};
			const key$1 = cleanKey(stack[stackIndex]);
			if (!object[key$1] && Empty) object[key$1] = new Empty();
			if (Object.prototype.hasOwnProperty.call(object, key$1)) object = object[key$1];
			else object = {};
			++stackIndex;
		}
		if (canNotTraverseDeeper(object)) return {};
		return {
			obj: object,
			k: cleanKey(stack[stackIndex])
		};
	};
	const setPath = (object, path, newValue) => {
		const { obj, k: k$1 } = getLastOfPath(object, path, Object);
		if (obj !== void 0 || path.length === 1) {
			obj[k$1] = newValue;
			return;
		}
		let e$1 = path[path.length - 1];
		let p$3 = path.slice(0, path.length - 1);
		let last = getLastOfPath(object, p$3, Object);
		while (last.obj === void 0 && p$3.length) {
			e$1 = `${p$3[p$3.length - 1]}.${e$1}`;
			p$3 = p$3.slice(0, p$3.length - 1);
			last = getLastOfPath(object, p$3, Object);
			if (last && last.obj && typeof last.obj[`${last.k}.${e$1}`] !== "undefined") last.obj = void 0;
		}
		last.obj[`${last.k}.${e$1}`] = newValue;
	};
	const pushPath = (object, path, newValue, concat) => {
		const { obj, k: k$1 } = getLastOfPath(object, path, Object);
		obj[k$1] = obj[k$1] || [];
		obj[k$1].push(newValue);
	};
	const getPath = (object, path) => {
		const { obj, k: k$1 } = getLastOfPath(object, path);
		if (!obj) return void 0;
		return obj[k$1];
	};
	const getPathWithDefaults = (data, defaultData, key$1) => {
		const value = getPath(data, key$1);
		if (value !== void 0) return value;
		return getPath(defaultData, key$1);
	};
	const deepExtend = (target, source, overwrite) => {
		for (const prop in source) if (prop !== "__proto__" && prop !== "constructor") if (prop in target) if (isString$1(target[prop]) || target[prop] instanceof String || isString$1(source[prop]) || source[prop] instanceof String) {
			if (overwrite) target[prop] = source[prop];
		} else deepExtend(target[prop], source[prop], overwrite);
		else target[prop] = source[prop];
		return target;
	};
	const regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	var _entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;",
		"/": "&#x2F;"
	};
	const escape$2 = (data) => {
		if (isString$1(data)) return data.replace(/[&<>"'\/]/g, (s$2) => _entityMap[s$2]);
		return data;
	};
	var RegExpCache = class {
		constructor(capacity) {
			this.capacity = capacity;
			this.regExpMap = /* @__PURE__ */ new Map();
			this.regExpQueue = [];
		}
		getRegExp(pattern) {
			const regExpFromCache = this.regExpMap.get(pattern);
			if (regExpFromCache !== void 0) return regExpFromCache;
			const regExpNew = new RegExp(pattern);
			if (this.regExpQueue.length === this.capacity) this.regExpMap.delete(this.regExpQueue.shift());
			this.regExpMap.set(pattern, regExpNew);
			this.regExpQueue.push(pattern);
			return regExpNew;
		}
	};
	const chars = [
		" ",
		",",
		"?",
		"!",
		";"
	];
	const looksLikeObjectPathRegExpCache = new RegExpCache(20);
	const looksLikeObjectPath = (key$1, nsSeparator, keySeparator) => {
		nsSeparator = nsSeparator || "";
		keySeparator = keySeparator || "";
		const possibleChars = chars.filter((c$2) => nsSeparator.indexOf(c$2) < 0 && keySeparator.indexOf(c$2) < 0);
		if (possibleChars.length === 0) return true;
		const r$1 = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c$2) => c$2 === "?" ? "\\?" : c$2).join("|")})`);
		let matched = !r$1.test(key$1);
		if (!matched) {
			const ki = key$1.indexOf(keySeparator);
			if (ki > 0 && !r$1.test(key$1.substring(0, ki))) matched = true;
		}
		return matched;
	};
	const deepFind = function(obj, path) {
		let keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
		if (!obj) return void 0;
		if (obj[path]) return obj[path];
		const tokens = path.split(keySeparator);
		let current = obj;
		for (let i$1 = 0; i$1 < tokens.length;) {
			if (!current || typeof current !== "object") return;
			let next;
			let nextPath = "";
			for (let j = i$1; j < tokens.length; ++j) {
				if (j !== i$1) nextPath += keySeparator;
				nextPath += tokens[j];
				next = current[nextPath];
				if (next !== void 0) {
					if ([
						"string",
						"number",
						"boolean"
					].indexOf(typeof next) > -1 && j < tokens.length - 1) continue;
					i$1 += j - i$1 + 1;
					break;
				}
			}
			current = next;
		}
		return current;
	};
	const getCleanedCode = (code$2) => code$2 && code$2.replace("_", "-");
	const consoleLogger = {
		type: "logger",
		log(args) {
			this.output("log", args);
		},
		warn(args) {
			this.output("warn", args);
		},
		error(args) {
			this.output("error", args);
		},
		output(type, args) {
			if (console && console[type]) console[type].apply(console, args);
		}
	};
	var Logger = class Logger {
		constructor(concreteLogger) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			this.init(concreteLogger, options);
		}
		init(concreteLogger) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			this.prefix = options.prefix || "i18next:";
			this.logger = concreteLogger || consoleLogger;
			this.options = options;
			this.debug = options.debug;
		}
		log() {
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			return this.forward(args, "log", "", true);
		}
		warn() {
			for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
			return this.forward(args, "warn", "", true);
		}
		error() {
			for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) args[_key3] = arguments[_key3];
			return this.forward(args, "error", "");
		}
		deprecate() {
			for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
			return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
		}
		forward(args, lvl, prefix, debugOnly) {
			if (debugOnly && !this.debug) return null;
			if (isString$1(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
			return this.logger[lvl](args);
		}
		create(moduleName) {
			return new Logger(this.logger, {
				prefix: `${this.prefix}:${moduleName}:`,
				...this.options
			});
		}
		clone(options) {
			options = options || this.options;
			options.prefix = options.prefix || this.prefix;
			return new Logger(this.logger, options);
		}
	};
	var baseLogger = new Logger();
	var EventEmitter = class {
		constructor() {
			this.observers = {};
		}
		on(events, listener) {
			events.split(" ").forEach((event) => {
				if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
				const numListeners = this.observers[event].get(listener) || 0;
				this.observers[event].set(listener, numListeners + 1);
			});
			return this;
		}
		off(event, listener) {
			if (!this.observers[event]) return;
			if (!listener) {
				delete this.observers[event];
				return;
			}
			this.observers[event].delete(listener);
		}
		emit(event) {
			for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
			if (this.observers[event]) Array.from(this.observers[event].entries()).forEach((_ref) => {
				let [observer, numTimesAdded] = _ref;
				for (let i$1 = 0; i$1 < numTimesAdded; i$1++) observer(...args);
			});
			if (this.observers["*"]) Array.from(this.observers["*"].entries()).forEach((_ref2) => {
				let [observer, numTimesAdded] = _ref2;
				for (let i$1 = 0; i$1 < numTimesAdded; i$1++) observer.apply(observer, [event, ...args]);
			});
		}
	};
	var ResourceStore = class extends EventEmitter {
		constructor(data) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
				ns: ["translation"],
				defaultNS: "translation"
			};
			super();
			this.data = data || {};
			this.options = options;
			if (this.options.keySeparator === void 0) this.options.keySeparator = ".";
			if (this.options.ignoreJSONStructure === void 0) this.options.ignoreJSONStructure = true;
		}
		addNamespaces(ns) {
			if (this.options.ns.indexOf(ns) < 0) this.options.ns.push(ns);
		}
		removeNamespaces(ns) {
			const index = this.options.ns.indexOf(ns);
			if (index > -1) this.options.ns.splice(index, 1);
		}
		getResource(lng, ns, key$1) {
			let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
			const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
			const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
			let path;
			if (lng.indexOf(".") > -1) path = lng.split(".");
			else {
				path = [lng, ns];
				if (key$1) if (Array.isArray(key$1)) path.push(...key$1);
				else if (isString$1(key$1) && keySeparator) path.push(...key$1.split(keySeparator));
				else path.push(key$1);
			}
			const result = getPath(this.data, path);
			if (!result && !ns && !key$1 && lng.indexOf(".") > -1) {
				lng = path[0];
				ns = path[1];
				key$1 = path.slice(2).join(".");
			}
			if (result || !ignoreJSONStructure || !isString$1(key$1)) return result;
			return deepFind(this.data && this.data[lng] && this.data[lng][ns], key$1, keySeparator);
		}
		addResource(lng, ns, key$1, value) {
			let options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : { silent: false };
			const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
			let path = [lng, ns];
			if (key$1) path = path.concat(keySeparator ? key$1.split(keySeparator) : key$1);
			if (lng.indexOf(".") > -1) {
				path = lng.split(".");
				value = ns;
				ns = path[1];
			}
			this.addNamespaces(ns);
			setPath(this.data, path, value);
			if (!options.silent) this.emit("added", lng, ns, key$1, value);
		}
		addResources(lng, ns, resources) {
			let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : { silent: false };
			for (const m$1 in resources) if (isString$1(resources[m$1]) || Array.isArray(resources[m$1])) this.addResource(lng, ns, m$1, resources[m$1], { silent: true });
			if (!options.silent) this.emit("added", lng, ns, resources);
		}
		addResourceBundle(lng, ns, resources, deep, overwrite) {
			let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
				silent: false,
				skipCopy: false
			};
			let path = [lng, ns];
			if (lng.indexOf(".") > -1) {
				path = lng.split(".");
				deep = resources;
				resources = ns;
				ns = path[1];
			}
			this.addNamespaces(ns);
			let pack = getPath(this.data, path) || {};
			if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
			if (deep) deepExtend(pack, resources, overwrite);
			else pack = {
				...pack,
				...resources
			};
			setPath(this.data, path, pack);
			if (!options.silent) this.emit("added", lng, ns, resources);
		}
		removeResourceBundle(lng, ns) {
			if (this.hasResourceBundle(lng, ns)) delete this.data[lng][ns];
			this.removeNamespaces(ns);
			this.emit("removed", lng, ns);
		}
		hasResourceBundle(lng, ns) {
			return this.getResource(lng, ns) !== void 0;
		}
		getResourceBundle(lng, ns) {
			if (!ns) ns = this.options.defaultNS;
			if (this.options.compatibilityAPI === "v1") return { ...this.getResource(lng, ns) };
			return this.getResource(lng, ns);
		}
		getDataByLanguage(lng) {
			return this.data[lng];
		}
		hasLanguageSomeTranslations(lng) {
			const data = this.getDataByLanguage(lng);
			return !!(data && Object.keys(data) || []).find((v$1) => data[v$1] && Object.keys(data[v$1]).length > 0);
		}
		toJSON() {
			return this.data;
		}
	};
	var postProcessor = {
		processors: {},
		addPostProcessor(module) {
			this.processors[module.name] = module;
		},
		handle(processors, value, key$1, options, translator) {
			processors.forEach((processor) => {
				if (this.processors[processor]) value = this.processors[processor].process(value, key$1, options, translator);
			});
			return value;
		}
	};
	const checkedLoadedFor = {};
	var Translator = class Translator extends EventEmitter {
		constructor(services) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			super();
			copy([
				"resourceStore",
				"languageUtils",
				"pluralResolver",
				"interpolator",
				"backendConnector",
				"i18nFormat",
				"utils"
			], services, this);
			this.options = options;
			if (this.options.keySeparator === void 0) this.options.keySeparator = ".";
			this.logger = baseLogger.create("translator");
		}
		changeLanguage(lng) {
			if (lng) this.language = lng;
		}
		exists(key$1) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { interpolation: {} };
			if (key$1 === void 0 || key$1 === null) return false;
			const resolved = this.resolve(key$1, options);
			return resolved && resolved.res !== void 0;
		}
		extractFromKey(key$1, options) {
			let nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
			if (nsSeparator === void 0) nsSeparator = ":";
			const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
			let namespaces = options.ns || this.options.defaultNS || [];
			const wouldCheckForNsInKey = nsSeparator && key$1.indexOf(nsSeparator) > -1;
			const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key$1, nsSeparator, keySeparator);
			if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
				const m$1 = key$1.match(this.interpolator.nestingRegexp);
				if (m$1 && m$1.length > 0) return {
					key: key$1,
					namespaces: isString$1(namespaces) ? [namespaces] : namespaces
				};
				const parts = key$1.split(nsSeparator);
				if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
				key$1 = parts.join(keySeparator);
			}
			return {
				key: key$1,
				namespaces: isString$1(namespaces) ? [namespaces] : namespaces
			};
		}
		translate(keys$1, options, lastKey) {
			if (typeof options !== "object" && this.options.overloadTranslationOptionHandler) options = this.options.overloadTranslationOptionHandler(arguments);
			if (typeof options === "object") options = { ...options };
			if (!options) options = {};
			if (keys$1 === void 0 || keys$1 === null) return "";
			if (!Array.isArray(keys$1)) keys$1 = [String(keys$1)];
			const returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
			const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
			const { key: key$1, namespaces } = this.extractFromKey(keys$1[keys$1.length - 1], options);
			const namespace = namespaces[namespaces.length - 1];
			const lng = options.lng || this.language;
			const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
			if (lng && lng.toLowerCase() === "cimode") {
				if (appendNamespaceToCIMode) {
					const nsSeparator = options.nsSeparator || this.options.nsSeparator;
					if (returnDetails) return {
						res: `${namespace}${nsSeparator}${key$1}`,
						usedKey: key$1,
						exactUsedKey: key$1,
						usedLng: lng,
						usedNS: namespace,
						usedParams: this.getUsedParamsDetails(options)
					};
					return `${namespace}${nsSeparator}${key$1}`;
				}
				if (returnDetails) return {
					res: key$1,
					usedKey: key$1,
					exactUsedKey: key$1,
					usedLng: lng,
					usedNS: namespace,
					usedParams: this.getUsedParamsDetails(options)
				};
				return key$1;
			}
			const resolved = this.resolve(keys$1, options);
			let res = resolved && resolved.res;
			const resUsedKey = resolved && resolved.usedKey || key$1;
			const resExactUsedKey = resolved && resolved.exactUsedKey || key$1;
			const resType = Object.prototype.toString.apply(res);
			const noObject = [
				"[object Number]",
				"[object Function]",
				"[object RegExp]"
			];
			const joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
			const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
			const handleAsObject = !isString$1(res) && typeof res !== "boolean" && typeof res !== "number";
			if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(isString$1(joinArrays) && Array.isArray(res))) {
				if (!options.returnObjects && !this.options.returnObjects) {
					if (!this.options.returnedObjectHandler) this.logger.warn("accessing an object - but returnObjects options is not enabled!");
					const r$1 = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, {
						...options,
						ns: namespaces
					}) : `key '${key$1} (${this.language})' returned an object instead of string.`;
					if (returnDetails) {
						resolved.res = r$1;
						resolved.usedParams = this.getUsedParamsDetails(options);
						return resolved;
					}
					return r$1;
				}
				if (keySeparator) {
					const resTypeIsArray = Array.isArray(res);
					const copy$1 = resTypeIsArray ? [] : {};
					const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
					for (const m$1 in res) if (Object.prototype.hasOwnProperty.call(res, m$1)) {
						const deepKey = `${newKeyToUse}${keySeparator}${m$1}`;
						copy$1[m$1] = this.translate(deepKey, {
							...options,
							joinArrays: false,
							ns: namespaces
						});
						if (copy$1[m$1] === deepKey) copy$1[m$1] = res[m$1];
					}
					res = copy$1;
				}
			} else if (handleAsObjectInI18nFormat && isString$1(joinArrays) && Array.isArray(res)) {
				res = res.join(joinArrays);
				if (res) res = this.extendTranslation(res, keys$1, options, lastKey);
			} else {
				let usedDefault = false;
				let usedKey = false;
				const needsPluralHandling = options.count !== void 0 && !isString$1(options.count);
				const hasDefaultValue = Translator.hasDefaultValue(options);
				const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
				const defaultValueSuffixOrdinalFallback = options.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, { ordinal: false }) : "";
				const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
				const defaultValue = needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] || options[`defaultValue${defaultValueSuffix}`] || options[`defaultValue${defaultValueSuffixOrdinalFallback}`] || options.defaultValue;
				if (!this.isValidLookup(res) && hasDefaultValue) {
					usedDefault = true;
					res = defaultValue;
				}
				if (!this.isValidLookup(res)) {
					usedKey = true;
					res = key$1;
				}
				const resForMissing = (options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && usedKey ? void 0 : res;
				const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
				if (usedKey || usedDefault || updateMissing) {
					this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key$1, updateMissing ? defaultValue : res);
					if (keySeparator) {
						const fk = this.resolve(key$1, {
							...options,
							keySeparator: false
						});
						if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
					}
					let lngs = [];
					const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
					if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) for (let i$1 = 0; i$1 < fallbackLngs.length; i$1++) lngs.push(fallbackLngs[i$1]);
					else if (this.options.saveMissingTo === "all") lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
					else lngs.push(options.lng || this.language);
					const send = (l$2, k$1, specificDefaultValue) => {
						const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
						if (this.options.missingKeyHandler) this.options.missingKeyHandler(l$2, namespace, k$1, defaultForMissing, updateMissing, options);
						else if (this.backendConnector && this.backendConnector.saveMissing) this.backendConnector.saveMissing(l$2, namespace, k$1, defaultForMissing, updateMissing, options);
						this.emit("missingKey", l$2, namespace, k$1, res);
					};
					if (this.options.saveMissing) if (this.options.saveMissingPlurals && needsPluralHandling) lngs.forEach((language) => {
						const suffixes = this.pluralResolver.getSuffixes(language, options);
						if (needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) suffixes.push(`${this.options.pluralSeparator}zero`);
						suffixes.forEach((suffix) => {
							send([language], key$1 + suffix, options[`defaultValue${suffix}`] || defaultValue);
						});
					});
					else send(lngs, key$1, defaultValue);
				}
				res = this.extendTranslation(res, keys$1, options, resolved, lastKey);
				if (usedKey && res === key$1 && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key$1}`;
				if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) if (this.options.compatibilityAPI !== "v1") res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key$1}` : key$1, usedDefault ? res : void 0);
				else res = this.options.parseMissingKeyHandler(res);
			}
			if (returnDetails) {
				resolved.res = res;
				resolved.usedParams = this.getUsedParamsDetails(options);
				return resolved;
			}
			return res;
		}
		extendTranslation(res, key$1, options, resolved, lastKey) {
			var _this = this;
			if (this.i18nFormat && this.i18nFormat.parse) res = this.i18nFormat.parse(res, {
				...this.options.interpolation.defaultVariables,
				...options
			}, options.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, { resolved });
			else if (!options.skipInterpolation) {
				if (options.interpolation) this.interpolator.init({
					...options,
					interpolation: {
						...this.options.interpolation,
						...options.interpolation
					}
				});
				const skipOnVariables = isString$1(res) && (options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
				let nestBef;
				if (skipOnVariables) {
					const nb = res.match(this.interpolator.nestingRegexp);
					nestBef = nb && nb.length;
				}
				let data = options.replace && !isString$1(options.replace) ? options.replace : options;
				if (this.options.interpolation.defaultVariables) data = {
					...this.options.interpolation.defaultVariables,
					...data
				};
				res = this.interpolator.interpolate(res, data, options.lng || this.language || resolved.usedLng, options);
				if (skipOnVariables) {
					const na = res.match(this.interpolator.nestingRegexp);
					const nestAft = na && na.length;
					if (nestBef < nestAft) options.nest = false;
				}
				if (!options.lng && this.options.compatibilityAPI !== "v1" && resolved && resolved.res) options.lng = this.language || resolved.usedLng;
				if (options.nest !== false) res = this.interpolator.nest(res, function() {
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					if (lastKey && lastKey[0] === args[0] && !options.context) {
						_this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key$1[0]}`);
						return null;
					}
					return _this.translate(...args, key$1);
				}, options);
				if (options.interpolation) this.interpolator.reset();
			}
			const postProcess = options.postProcess || this.options.postProcess;
			const postProcessorNames = isString$1(postProcess) ? [postProcess] : postProcess;
			if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) res = postProcessor.handle(postProcessorNames, res, key$1, this.options && this.options.postProcessPassResolved ? {
				i18nResolved: {
					...resolved,
					usedParams: this.getUsedParamsDetails(options)
				},
				...options
			} : options, this);
			return res;
		}
		resolve(keys$1) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			let found;
			let usedKey;
			let exactUsedKey;
			let usedLng;
			let usedNS;
			if (isString$1(keys$1)) keys$1 = [keys$1];
			keys$1.forEach((k$1) => {
				if (this.isValidLookup(found)) return;
				const extracted = this.extractFromKey(k$1, options);
				const key$1 = extracted.key;
				usedKey = key$1;
				let namespaces = extracted.namespaces;
				if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
				const needsPluralHandling = options.count !== void 0 && !isString$1(options.count);
				const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
				const needsContextHandling = options.context !== void 0 && (isString$1(options.context) || typeof options.context === "number") && options.context !== "";
				const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);
				namespaces.forEach((ns) => {
					if (this.isValidLookup(found)) return;
					usedNS = ns;
					if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(usedNS)) {
						checkedLoadedFor[`${codes[0]}-${ns}`] = true;
						this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
					}
					codes.forEach((code$2) => {
						if (this.isValidLookup(found)) return;
						usedLng = code$2;
						const finalKeys = [key$1];
						if (this.i18nFormat && this.i18nFormat.addLookupKeys) this.i18nFormat.addLookupKeys(finalKeys, key$1, code$2, ns, options);
						else {
							let pluralSuffix;
							if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code$2, options.count, options);
							const zeroSuffix = `${this.options.pluralSeparator}zero`;
							const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
							if (needsPluralHandling) {
								finalKeys.push(key$1 + pluralSuffix);
								if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) finalKeys.push(key$1 + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
								if (needsZeroSuffixLookup) finalKeys.push(key$1 + zeroSuffix);
							}
							if (needsContextHandling) {
								const contextKey = `${key$1}${this.options.contextSeparator}${options.context}`;
								finalKeys.push(contextKey);
								if (needsPluralHandling) {
									finalKeys.push(contextKey + pluralSuffix);
									if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
									if (needsZeroSuffixLookup) finalKeys.push(contextKey + zeroSuffix);
								}
							}
						}
						let possibleKey;
						while (possibleKey = finalKeys.pop()) if (!this.isValidLookup(found)) {
							exactUsedKey = possibleKey;
							found = this.getResource(code$2, ns, possibleKey, options);
						}
					});
				});
			});
			return {
				res: found,
				usedKey,
				exactUsedKey,
				usedLng,
				usedNS
			};
		}
		isValidLookup(res) {
			return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
		}
		getResource(code$2, ns, key$1) {
			let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
			if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code$2, ns, key$1, options);
			return this.resourceStore.getResource(code$2, ns, key$1, options);
		}
		getUsedParamsDetails() {
			let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			const optionsKeys = [
				"defaultValue",
				"ordinal",
				"context",
				"replace",
				"lng",
				"lngs",
				"fallbackLng",
				"ns",
				"keySeparator",
				"nsSeparator",
				"returnObjects",
				"returnDetails",
				"joinArrays",
				"postProcess",
				"interpolation"
			];
			const useOptionsReplaceForData = options.replace && !isString$1(options.replace);
			let data = useOptionsReplaceForData ? options.replace : options;
			if (useOptionsReplaceForData && typeof options.count !== "undefined") data.count = options.count;
			if (this.options.interpolation.defaultVariables) data = {
				...this.options.interpolation.defaultVariables,
				...data
			};
			if (!useOptionsReplaceForData) {
				data = { ...data };
				for (const key$1 of optionsKeys) delete data[key$1];
			}
			return data;
		}
		static hasDefaultValue(options) {
			const prefix = "defaultValue";
			for (const option$1 in options) if (Object.prototype.hasOwnProperty.call(options, option$1) && prefix === option$1.substring(0, 12) && void 0 !== options[option$1]) return true;
			return false;
		}
	};
	const capitalize$1 = (string) => string.charAt(0).toUpperCase() + string.slice(1);
	var LanguageUtil = class {
		constructor(options) {
			this.options = options;
			this.supportedLngs = this.options.supportedLngs || false;
			this.logger = baseLogger.create("languageUtils");
		}
		getScriptPartFromCode(code$2) {
			code$2 = getCleanedCode(code$2);
			if (!code$2 || code$2.indexOf("-") < 0) return null;
			const p$3 = code$2.split("-");
			if (p$3.length === 2) return null;
			p$3.pop();
			if (p$3[p$3.length - 1].toLowerCase() === "x") return null;
			return this.formatLanguageCode(p$3.join("-"));
		}
		getLanguagePartFromCode(code$2) {
			code$2 = getCleanedCode(code$2);
			if (!code$2 || code$2.indexOf("-") < 0) return code$2;
			const p$3 = code$2.split("-");
			return this.formatLanguageCode(p$3[0]);
		}
		formatLanguageCode(code$2) {
			if (isString$1(code$2) && code$2.indexOf("-") > -1) {
				if (typeof Intl !== "undefined" && typeof Intl.getCanonicalLocales !== "undefined") try {
					let formattedCode = Intl.getCanonicalLocales(code$2)[0];
					if (formattedCode && this.options.lowerCaseLng) formattedCode = formattedCode.toLowerCase();
					if (formattedCode) return formattedCode;
				} catch (e$1) {}
				const specialCases = [
					"hans",
					"hant",
					"latn",
					"cyrl",
					"cans",
					"mong",
					"arab"
				];
				let p$3 = code$2.split("-");
				if (this.options.lowerCaseLng) p$3 = p$3.map((part) => part.toLowerCase());
				else if (p$3.length === 2) {
					p$3[0] = p$3[0].toLowerCase();
					p$3[1] = p$3[1].toUpperCase();
					if (specialCases.indexOf(p$3[1].toLowerCase()) > -1) p$3[1] = capitalize$1(p$3[1].toLowerCase());
				} else if (p$3.length === 3) {
					p$3[0] = p$3[0].toLowerCase();
					if (p$3[1].length === 2) p$3[1] = p$3[1].toUpperCase();
					if (p$3[0] !== "sgn" && p$3[2].length === 2) p$3[2] = p$3[2].toUpperCase();
					if (specialCases.indexOf(p$3[1].toLowerCase()) > -1) p$3[1] = capitalize$1(p$3[1].toLowerCase());
					if (specialCases.indexOf(p$3[2].toLowerCase()) > -1) p$3[2] = capitalize$1(p$3[2].toLowerCase());
				}
				return p$3.join("-");
			}
			return this.options.cleanCode || this.options.lowerCaseLng ? code$2.toLowerCase() : code$2;
		}
		isSupportedCode(code$2) {
			if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) code$2 = this.getLanguagePartFromCode(code$2);
			return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code$2) > -1;
		}
		getBestMatchFromCodes(codes) {
			if (!codes) return null;
			let found;
			codes.forEach((code$2) => {
				if (found) return;
				const cleanedLng = this.formatLanguageCode(code$2);
				if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
			});
			if (!found && this.options.supportedLngs) codes.forEach((code$2) => {
				if (found) return;
				const lngOnly = this.getLanguagePartFromCode(code$2);
				if (this.isSupportedCode(lngOnly)) return found = lngOnly;
				found = this.options.supportedLngs.find((supportedLng) => {
					if (supportedLng === lngOnly) return supportedLng;
					if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
					if (supportedLng.indexOf("-") > 0 && lngOnly.indexOf("-") < 0 && supportedLng.substring(0, supportedLng.indexOf("-")) === lngOnly) return supportedLng;
					if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
				});
			});
			if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
			return found;
		}
		getFallbackCodes(fallbacks, code$2) {
			if (!fallbacks) return [];
			if (typeof fallbacks === "function") fallbacks = fallbacks(code$2);
			if (isString$1(fallbacks)) fallbacks = [fallbacks];
			if (Array.isArray(fallbacks)) return fallbacks;
			if (!code$2) return fallbacks.default || [];
			let found = fallbacks[code$2];
			if (!found) found = fallbacks[this.getScriptPartFromCode(code$2)];
			if (!found) found = fallbacks[this.formatLanguageCode(code$2)];
			if (!found) found = fallbacks[this.getLanguagePartFromCode(code$2)];
			if (!found) found = fallbacks.default;
			return found || [];
		}
		toResolveHierarchy(code$2, fallbackCode) {
			const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code$2);
			const codes = [];
			const addCode = (c$2) => {
				if (!c$2) return;
				if (this.isSupportedCode(c$2)) codes.push(c$2);
				else this.logger.warn(`rejecting language code not found in supportedLngs: ${c$2}`);
			};
			if (isString$1(code$2) && (code$2.indexOf("-") > -1 || code$2.indexOf("_") > -1)) {
				if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code$2));
				if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code$2));
				if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code$2));
			} else if (isString$1(code$2)) addCode(this.formatLanguageCode(code$2));
			fallbackCodes.forEach((fc) => {
				if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
			});
			return codes;
		}
	};
	let sets = [
		{
			lngs: [
				"ach",
				"ak",
				"am",
				"arn",
				"br",
				"fil",
				"gun",
				"ln",
				"mfe",
				"mg",
				"mi",
				"oc",
				"pt",
				"pt-BR",
				"tg",
				"tl",
				"ti",
				"tr",
				"uz",
				"wa"
			],
			nr: [1, 2],
			fc: 1
		},
		{
			lngs: [
				"af",
				"an",
				"ast",
				"az",
				"bg",
				"bn",
				"ca",
				"da",
				"de",
				"dev",
				"el",
				"en",
				"eo",
				"es",
				"et",
				"eu",
				"fi",
				"fo",
				"fur",
				"fy",
				"gl",
				"gu",
				"ha",
				"hi",
				"hu",
				"hy",
				"ia",
				"it",
				"kk",
				"kn",
				"ku",
				"lb",
				"mai",
				"ml",
				"mn",
				"mr",
				"nah",
				"nap",
				"nb",
				"ne",
				"nl",
				"nn",
				"no",
				"nso",
				"pa",
				"pap",
				"pms",
				"ps",
				"pt-PT",
				"rm",
				"sco",
				"se",
				"si",
				"so",
				"son",
				"sq",
				"sv",
				"sw",
				"ta",
				"te",
				"tk",
				"ur",
				"yo"
			],
			nr: [1, 2],
			fc: 2
		},
		{
			lngs: [
				"ay",
				"bo",
				"cgg",
				"fa",
				"ht",
				"id",
				"ja",
				"jbo",
				"ka",
				"km",
				"ko",
				"ky",
				"lo",
				"ms",
				"sah",
				"su",
				"th",
				"tt",
				"ug",
				"vi",
				"wo",
				"zh"
			],
			nr: [1],
			fc: 3
		},
		{
			lngs: [
				"be",
				"bs",
				"cnr",
				"dz",
				"hr",
				"ru",
				"sr",
				"uk"
			],
			nr: [
				1,
				2,
				5
			],
			fc: 4
		},
		{
			lngs: ["ar"],
			nr: [
				0,
				1,
				2,
				3,
				11,
				100
			],
			fc: 5
		},
		{
			lngs: ["cs", "sk"],
			nr: [
				1,
				2,
				5
			],
			fc: 6
		},
		{
			lngs: ["csb", "pl"],
			nr: [
				1,
				2,
				5
			],
			fc: 7
		},
		{
			lngs: ["cy"],
			nr: [
				1,
				2,
				3,
				8
			],
			fc: 8
		},
		{
			lngs: ["fr"],
			nr: [1, 2],
			fc: 9
		},
		{
			lngs: ["ga"],
			nr: [
				1,
				2,
				3,
				7,
				11
			],
			fc: 10
		},
		{
			lngs: ["gd"],
			nr: [
				1,
				2,
				3,
				20
			],
			fc: 11
		},
		{
			lngs: ["is"],
			nr: [1, 2],
			fc: 12
		},
		{
			lngs: ["jv"],
			nr: [0, 1],
			fc: 13
		},
		{
			lngs: ["kw"],
			nr: [
				1,
				2,
				3,
				4
			],
			fc: 14
		},
		{
			lngs: ["lt"],
			nr: [
				1,
				2,
				10
			],
			fc: 15
		},
		{
			lngs: ["lv"],
			nr: [
				1,
				2,
				0
			],
			fc: 16
		},
		{
			lngs: ["mk"],
			nr: [1, 2],
			fc: 17
		},
		{
			lngs: ["mnk"],
			nr: [
				0,
				1,
				2
			],
			fc: 18
		},
		{
			lngs: ["mt"],
			nr: [
				1,
				2,
				11,
				20
			],
			fc: 19
		},
		{
			lngs: ["or"],
			nr: [2, 1],
			fc: 2
		},
		{
			lngs: ["ro"],
			nr: [
				1,
				2,
				20
			],
			fc: 20
		},
		{
			lngs: ["sl"],
			nr: [
				5,
				1,
				2,
				3
			],
			fc: 21
		},
		{
			lngs: ["he", "iw"],
			nr: [
				1,
				2,
				20,
				21
			],
			fc: 22
		}
	];
	let _rulesPluralsTypes = {
		1: (n) => Number(n > 1),
		2: (n) => Number(n != 1),
		3: (n) => 0,
		4: (n) => Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
		5: (n) => Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5),
		6: (n) => Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2),
		7: (n) => Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
		8: (n) => Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3),
		9: (n) => Number(n >= 2),
		10: (n) => Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4),
		11: (n) => Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3),
		12: (n) => Number(n % 10 != 1 || n % 100 == 11),
		13: (n) => Number(n !== 0),
		14: (n) => Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3),
		15: (n) => Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
		16: (n) => Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2),
		17: (n) => Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1),
		18: (n) => Number(n == 0 ? 0 : n == 1 ? 1 : 2),
		19: (n) => Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3),
		20: (n) => Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2),
		21: (n) => Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0),
		22: (n) => Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3)
	};
	const nonIntlVersions = [
		"v1",
		"v2",
		"v3"
	];
	const intlVersions = ["v4"];
	const suffixesOrder = {
		zero: 0,
		one: 1,
		two: 2,
		few: 3,
		many: 4,
		other: 5
	};
	const createRules = () => {
		const rules = {};
		sets.forEach((set) => {
			set.lngs.forEach((l$2) => {
				rules[l$2] = {
					numbers: set.nr,
					plurals: _rulesPluralsTypes[set.fc]
				};
			});
		});
		return rules;
	};
	var PluralResolver = class {
		constructor(languageUtils) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			this.languageUtils = languageUtils;
			this.options = options;
			this.logger = baseLogger.create("pluralResolver");
			if ((!this.options.compatibilityJSON || intlVersions.includes(this.options.compatibilityJSON)) && (typeof Intl === "undefined" || !Intl.PluralRules)) {
				this.options.compatibilityJSON = "v3";
				this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
			}
			this.rules = createRules();
			this.pluralRulesCache = {};
		}
		addRule(lng, obj) {
			this.rules[lng] = obj;
		}
		clearCache() {
			this.pluralRulesCache = {};
		}
		getRule(code$2) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			if (this.shouldUseIntlApi()) {
				const cleanedCode = getCleanedCode(code$2 === "dev" ? "en" : code$2);
				const type = options.ordinal ? "ordinal" : "cardinal";
				const cacheKey = JSON.stringify({
					cleanedCode,
					type
				});
				if (cacheKey in this.pluralRulesCache) return this.pluralRulesCache[cacheKey];
				let rule;
				try {
					rule = new Intl.PluralRules(cleanedCode, { type });
				} catch (err) {
					if (!code$2.match(/-|_/)) return;
					const lngPart = this.languageUtils.getLanguagePartFromCode(code$2);
					rule = this.getRule(lngPart, options);
				}
				this.pluralRulesCache[cacheKey] = rule;
				return rule;
			}
			return this.rules[code$2] || this.rules[this.languageUtils.getLanguagePartFromCode(code$2)];
		}
		needsPlural(code$2) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			const rule = this.getRule(code$2, options);
			if (this.shouldUseIntlApi()) return rule && rule.resolvedOptions().pluralCategories.length > 1;
			return rule && rule.numbers.length > 1;
		}
		getPluralFormsOfKey(code$2, key$1) {
			let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
			return this.getSuffixes(code$2, options).map((suffix) => `${key$1}${suffix}`);
		}
		getSuffixes(code$2) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			const rule = this.getRule(code$2, options);
			if (!rule) return [];
			if (this.shouldUseIntlApi()) return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
			return rule.numbers.map((number$1) => this.getSuffix(code$2, number$1, options));
		}
		getSuffix(code$2, count) {
			let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
			const rule = this.getRule(code$2, options);
			if (rule) {
				if (this.shouldUseIntlApi()) return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
				return this.getSuffixRetroCompatible(rule, count);
			}
			this.logger.warn(`no plural rule found for: ${code$2}`);
			return "";
		}
		getSuffixRetroCompatible(rule, count) {
			const idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
			let suffix = rule.numbers[idx];
			if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
				if (suffix === 2) suffix = "plural";
				else if (suffix === 1) suffix = "";
			}
			const returnSuffix = () => this.options.prepend && suffix.toString() ? this.options.prepend + suffix.toString() : suffix.toString();
			if (this.options.compatibilityJSON === "v1") {
				if (suffix === 1) return "";
				if (typeof suffix === "number") return `_plural_${suffix.toString()}`;
				return returnSuffix();
			} else if (this.options.compatibilityJSON === "v2") return returnSuffix();
			else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) return returnSuffix();
			return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
		}
		shouldUseIntlApi() {
			return !nonIntlVersions.includes(this.options.compatibilityJSON);
		}
	};
	const deepFindWithDefaults = function(data, defaultData, key$1) {
		let keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
		let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
		let path = getPathWithDefaults(data, defaultData, key$1);
		if (!path && ignoreJSONStructure && isString$1(key$1)) {
			path = deepFind(data, key$1, keySeparator);
			if (path === void 0) path = deepFind(defaultData, key$1, keySeparator);
		}
		return path;
	};
	const regexSafe = (val) => val.replace(/\$/g, "$$$$");
	var Interpolator = class {
		constructor() {
			let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			this.logger = baseLogger.create("interpolator");
			this.options = options;
			this.format = options.interpolation && options.interpolation.format || ((value) => value);
			this.init(options);
		}
		init() {
			let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			if (!options.interpolation) options.interpolation = { escapeValue: true };
			const { escape: escape$1$1, escapeValue, useRawValueToEscape, prefix, prefixEscaped, suffix, suffixEscaped, formatSeparator, unescapeSuffix, unescapePrefix, nestingPrefix, nestingPrefixEscaped, nestingSuffix, nestingSuffixEscaped, nestingOptionsSeparator, maxReplaces, alwaysFormat } = options.interpolation;
			this.escape = escape$1$1 !== void 0 ? escape$1$1 : escape$2;
			this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
			this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
			this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
			this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
			this.formatSeparator = formatSeparator || ",";
			this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix || "-";
			this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix || "";
			this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
			this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
			this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
			this.maxReplaces = maxReplaces || 1e3;
			this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
			this.resetRegExp();
		}
		reset() {
			if (this.options) this.init(this.options);
		}
		resetRegExp() {
			const getOrResetRegExp = (existingRegExp, pattern) => {
				if (existingRegExp && existingRegExp.source === pattern) {
					existingRegExp.lastIndex = 0;
					return existingRegExp;
				}
				return new RegExp(pattern, "g");
			};
			this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
			this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
			this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
		}
		interpolate(str, data, lng, options) {
			let match;
			let value;
			let replaces;
			const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
			const handleFormat = (key$1) => {
				if (key$1.indexOf(this.formatSeparator) < 0) {
					const path = deepFindWithDefaults(data, defaultData, key$1, this.options.keySeparator, this.options.ignoreJSONStructure);
					return this.alwaysFormat ? this.format(path, void 0, lng, {
						...options,
						...data,
						interpolationkey: key$1
					}) : path;
				}
				const p$3 = key$1.split(this.formatSeparator);
				const k$1 = p$3.shift().trim();
				const f$2 = p$3.join(this.formatSeparator).trim();
				return this.format(deepFindWithDefaults(data, defaultData, k$1, this.options.keySeparator, this.options.ignoreJSONStructure), f$2, lng, {
					...options,
					...data,
					interpolationkey: k$1
				});
			};
			this.resetRegExp();
			const missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
			const skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
			[{
				regex: this.regexpUnescape,
				safeValue: (val) => regexSafe(val)
			}, {
				regex: this.regexp,
				safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
			}].forEach((todo) => {
				replaces = 0;
				while (match = todo.regex.exec(str)) {
					const matchedVar = match[1].trim();
					value = handleFormat(matchedVar);
					if (value === void 0) if (typeof missingInterpolationHandler === "function") {
						const temp = missingInterpolationHandler(str, match, options);
						value = isString$1(temp) ? temp : "";
					} else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) value = "";
					else if (skipOnVariables) {
						value = match[0];
						continue;
					} else {
						this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
						value = "";
					}
					else if (!isString$1(value) && !this.useRawValueToEscape) value = makeString(value);
					const safeValue = todo.safeValue(value);
					str = str.replace(match[0], safeValue);
					if (skipOnVariables) {
						todo.regex.lastIndex += value.length;
						todo.regex.lastIndex -= match[0].length;
					} else todo.regex.lastIndex = 0;
					replaces++;
					if (replaces >= this.maxReplaces) break;
				}
			});
			return str;
		}
		nest(str, fc) {
			let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
			let match;
			let value;
			let clonedOptions;
			const handleHasOptions = (key$1, inheritedOptions) => {
				const sep = this.nestingOptionsSeparator;
				if (key$1.indexOf(sep) < 0) return key$1;
				const c$2 = key$1.split(/* @__PURE__ */ new RegExp(`${sep}[ ]*{`));
				let optionsString = `{${c$2[1]}`;
				key$1 = c$2[0];
				optionsString = this.interpolate(optionsString, clonedOptions);
				const matchedSingleQuotes = optionsString.match(/'/g);
				const matchedDoubleQuotes = optionsString.match(/"/g);
				if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) optionsString = optionsString.replace(/'/g, "\"");
				try {
					clonedOptions = JSON.parse(optionsString);
					if (inheritedOptions) clonedOptions = {
						...inheritedOptions,
						...clonedOptions
					};
				} catch (e$1) {
					this.logger.warn(`failed parsing options string in nesting for key ${key$1}`, e$1);
					return `${key$1}${sep}${optionsString}`;
				}
				if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
				return key$1;
			};
			while (match = this.nestingRegexp.exec(str)) {
				let formatters = [];
				clonedOptions = { ...options };
				clonedOptions = clonedOptions.replace && !isString$1(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
				clonedOptions.applyPostProcessor = false;
				delete clonedOptions.defaultValue;
				let doReduce = false;
				if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
					const r$1 = match[1].split(this.formatSeparator).map((elem) => elem.trim());
					match[1] = r$1.shift();
					formatters = r$1;
					doReduce = true;
				}
				value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
				if (value && match[0] === str && !isString$1(value)) return value;
				if (!isString$1(value)) value = makeString(value);
				if (!value) {
					this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
					value = "";
				}
				if (doReduce) value = formatters.reduce((v$1, f$2) => this.format(v$1, f$2, options.lng, {
					...options,
					interpolationkey: match[1].trim()
				}), value.trim());
				str = str.replace(match[0], value);
				this.regexp.lastIndex = 0;
			}
			return str;
		}
	};
	const parseFormatStr = (formatStr) => {
		let formatName = formatStr.toLowerCase().trim();
		const formatOptions = {};
		if (formatStr.indexOf("(") > -1) {
			const p$3 = formatStr.split("(");
			formatName = p$3[0].toLowerCase().trim();
			const optStr = p$3[1].substring(0, p$3[1].length - 1);
			if (formatName === "currency" && optStr.indexOf(":") < 0) {
				if (!formatOptions.currency) formatOptions.currency = optStr.trim();
			} else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
				if (!formatOptions.range) formatOptions.range = optStr.trim();
			} else optStr.split(";").forEach((opt) => {
				if (opt) {
					const [key$1, ...rest] = opt.split(":");
					const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
					const trimmedKey = key$1.trim();
					if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
					if (val === "false") formatOptions[trimmedKey] = false;
					if (val === "true") formatOptions[trimmedKey] = true;
					if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
				}
			});
		}
		return {
			formatName,
			formatOptions
		};
	};
	const createCachedFormatter = (fn) => {
		const cache = {};
		return (val, lng, options) => {
			let optForCache = options;
			if (options && options.interpolationkey && options.formatParams && options.formatParams[options.interpolationkey] && options[options.interpolationkey]) optForCache = {
				...optForCache,
				[options.interpolationkey]: void 0
			};
			const key$1 = lng + JSON.stringify(optForCache);
			let formatter = cache[key$1];
			if (!formatter) {
				formatter = fn(getCleanedCode(lng), options);
				cache[key$1] = formatter;
			}
			return formatter(val);
		};
	};
	var Formatter = class {
		constructor() {
			let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			this.logger = baseLogger.create("formatter");
			this.options = options;
			this.formats = {
				number: createCachedFormatter((lng, opt) => {
					const formatter = new Intl.NumberFormat(lng, { ...opt });
					return (val) => formatter.format(val);
				}),
				currency: createCachedFormatter((lng, opt) => {
					const formatter = new Intl.NumberFormat(lng, {
						...opt,
						style: "currency"
					});
					return (val) => formatter.format(val);
				}),
				datetime: createCachedFormatter((lng, opt) => {
					const formatter = new Intl.DateTimeFormat(lng, { ...opt });
					return (val) => formatter.format(val);
				}),
				relativetime: createCachedFormatter((lng, opt) => {
					const formatter = new Intl.RelativeTimeFormat(lng, { ...opt });
					return (val) => formatter.format(val, opt.range || "day");
				}),
				list: createCachedFormatter((lng, opt) => {
					const formatter = new Intl.ListFormat(lng, { ...opt });
					return (val) => formatter.format(val);
				})
			};
			this.init(options);
		}
		init(services) {
			this.formatSeparator = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { interpolation: {} }).interpolation.formatSeparator || ",";
		}
		add(name, fc) {
			this.formats[name.toLowerCase().trim()] = fc;
		}
		addCached(name, fc) {
			this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
		}
		format(value, format, lng) {
			let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
			const formats = format.split(this.formatSeparator);
			if (formats.length > 1 && formats[0].indexOf("(") > 1 && formats[0].indexOf(")") < 0 && formats.find((f$2) => f$2.indexOf(")") > -1)) {
				const lastIndex = formats.findIndex((f$2) => f$2.indexOf(")") > -1);
				formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
			}
			return formats.reduce((mem, f$2) => {
				const { formatName, formatOptions } = parseFormatStr(f$2);
				if (this.formats[formatName]) {
					let formatted = mem;
					try {
						const valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
						const l$2 = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
						formatted = this.formats[formatName](mem, l$2, {
							...formatOptions,
							...options,
							...valOptions
						});
					} catch (error) {
						this.logger.warn(error);
					}
					return formatted;
				} else this.logger.warn(`there was no format function for ${formatName}`);
				return mem;
			}, value);
		}
	};
	const removePending = (q, name) => {
		if (q.pending[name] !== void 0) {
			delete q.pending[name];
			q.pendingCount--;
		}
	};
	var Connector = class extends EventEmitter {
		constructor(backend, store, services) {
			let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
			super();
			this.backend = backend;
			this.store = store;
			this.services = services;
			this.languageUtils = services.languageUtils;
			this.options = options;
			this.logger = baseLogger.create("backendConnector");
			this.waitingReads = [];
			this.maxParallelReads = options.maxParallelReads || 10;
			this.readingCalls = 0;
			this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
			this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
			this.state = {};
			this.queue = [];
			if (this.backend && this.backend.init) this.backend.init(services, options.backend, options);
		}
		queueLoad(languages, namespaces, options, callback) {
			const toLoad = {};
			const pending = {};
			const toLoadLanguages = {};
			const toLoadNamespaces = {};
			languages.forEach((lng) => {
				let hasAllNamespaces = true;
				namespaces.forEach((ns) => {
					const name = `${lng}|${ns}`;
					if (!options.reload && this.store.hasResourceBundle(lng, ns)) this.state[name] = 2;
					else if (this.state[name] < 0);
					else if (this.state[name] === 1) {
						if (pending[name] === void 0) pending[name] = true;
					} else {
						this.state[name] = 1;
						hasAllNamespaces = false;
						if (pending[name] === void 0) pending[name] = true;
						if (toLoad[name] === void 0) toLoad[name] = true;
						if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
					}
				});
				if (!hasAllNamespaces) toLoadLanguages[lng] = true;
			});
			if (Object.keys(toLoad).length || Object.keys(pending).length) this.queue.push({
				pending,
				pendingCount: Object.keys(pending).length,
				loaded: {},
				errors: [],
				callback
			});
			return {
				toLoad: Object.keys(toLoad),
				pending: Object.keys(pending),
				toLoadLanguages: Object.keys(toLoadLanguages),
				toLoadNamespaces: Object.keys(toLoadNamespaces)
			};
		}
		loaded(name, err, data) {
			const s$2 = name.split("|");
			const lng = s$2[0];
			const ns = s$2[1];
			if (err) this.emit("failedLoading", lng, ns, err);
			if (!err && data) this.store.addResourceBundle(lng, ns, data, void 0, void 0, { skipCopy: true });
			this.state[name] = err ? -1 : 2;
			if (err && data) this.state[name] = 0;
			const loaded = {};
			this.queue.forEach((q) => {
				pushPath(q.loaded, [lng], ns);
				removePending(q, name);
				if (err) q.errors.push(err);
				if (q.pendingCount === 0 && !q.done) {
					Object.keys(q.loaded).forEach((l$2) => {
						if (!loaded[l$2]) loaded[l$2] = {};
						const loadedKeys = q.loaded[l$2];
						if (loadedKeys.length) loadedKeys.forEach((n) => {
							if (loaded[l$2][n] === void 0) loaded[l$2][n] = true;
						});
					});
					q.done = true;
					if (q.errors.length) q.callback(q.errors);
					else q.callback();
				}
			});
			this.emit("loaded", loaded);
			this.queue = this.queue.filter((q) => !q.done);
		}
		read(lng, ns, fcName) {
			let tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
			let wait = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
			let callback = arguments.length > 5 ? arguments[5] : void 0;
			if (!lng.length) return callback(null, {});
			if (this.readingCalls >= this.maxParallelReads) {
				this.waitingReads.push({
					lng,
					ns,
					fcName,
					tried,
					wait,
					callback
				});
				return;
			}
			this.readingCalls++;
			const resolver = (err, data) => {
				this.readingCalls--;
				if (this.waitingReads.length > 0) {
					const next = this.waitingReads.shift();
					this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
				}
				if (err && data && tried < this.maxRetries) {
					setTimeout(() => {
						this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
					}, wait);
					return;
				}
				callback(err, data);
			};
			const fc = this.backend[fcName].bind(this.backend);
			if (fc.length === 2) {
				try {
					const r$1 = fc(lng, ns);
					if (r$1 && typeof r$1.then === "function") r$1.then((data) => resolver(null, data)).catch(resolver);
					else resolver(null, r$1);
				} catch (err) {
					resolver(err);
				}
				return;
			}
			return fc(lng, ns, resolver);
		}
		prepareLoading(languages, namespaces) {
			let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
			let callback = arguments.length > 3 ? arguments[3] : void 0;
			if (!this.backend) {
				this.logger.warn("No backend was added via i18next.use. Will not load resources.");
				return callback && callback();
			}
			if (isString$1(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
			if (isString$1(namespaces)) namespaces = [namespaces];
			const toLoad = this.queueLoad(languages, namespaces, options, callback);
			if (!toLoad.toLoad.length) {
				if (!toLoad.pending.length) callback();
				return null;
			}
			toLoad.toLoad.forEach((name) => {
				this.loadOne(name);
			});
		}
		load(languages, namespaces, callback) {
			this.prepareLoading(languages, namespaces, {}, callback);
		}
		reload(languages, namespaces, callback) {
			this.prepareLoading(languages, namespaces, { reload: true }, callback);
		}
		loadOne(name) {
			let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
			const s$2 = name.split("|");
			const lng = s$2[0];
			const ns = s$2[1];
			this.read(lng, ns, "read", void 0, void 0, (err, data) => {
				if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
				if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
				this.loaded(name, err, data);
			});
		}
		saveMissing(languages, namespace, key$1, fallbackValue, isUpdate) {
			let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
			let clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {};
			if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
				this.logger.warn(`did not save key "${key$1}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
				return;
			}
			if (key$1 === void 0 || key$1 === null || key$1 === "") return;
			if (this.backend && this.backend.create) {
				const opts = {
					...options,
					isUpdate
				};
				const fc = this.backend.create.bind(this.backend);
				if (fc.length < 6) try {
					let r$1;
					if (fc.length === 5) r$1 = fc(languages, namespace, key$1, fallbackValue, opts);
					else r$1 = fc(languages, namespace, key$1, fallbackValue);
					if (r$1 && typeof r$1.then === "function") r$1.then((data) => clb(null, data)).catch(clb);
					else clb(null, r$1);
				} catch (err) {
					clb(err);
				}
				else fc(languages, namespace, key$1, fallbackValue, clb, opts);
			}
			if (!languages || !languages[0]) return;
			this.store.addResource(languages[0], namespace, key$1, fallbackValue);
		}
	};
	const get = () => ({
		debug: false,
		initImmediate: true,
		ns: ["translation"],
		defaultNS: ["translation"],
		fallbackLng: ["dev"],
		fallbackNS: false,
		supportedLngs: false,
		nonExplicitSupportedLngs: false,
		load: "all",
		preload: false,
		simplifyPluralSuffix: true,
		keySeparator: ".",
		nsSeparator: ":",
		pluralSeparator: "_",
		contextSeparator: "_",
		partialBundledLanguages: false,
		saveMissing: false,
		updateMissing: false,
		saveMissingTo: "fallback",
		saveMissingPlurals: true,
		missingKeyHandler: false,
		missingInterpolationHandler: false,
		postProcess: false,
		postProcessPassResolved: false,
		returnNull: false,
		returnEmptyString: true,
		returnObjects: false,
		joinArrays: false,
		returnedObjectHandler: false,
		parseMissingKeyHandler: false,
		appendNamespaceToMissingKey: false,
		appendNamespaceToCIMode: false,
		overloadTranslationOptionHandler: (args) => {
			let ret = {};
			if (typeof args[1] === "object") ret = args[1];
			if (isString$1(args[1])) ret.defaultValue = args[1];
			if (isString$1(args[2])) ret.tDescription = args[2];
			if (typeof args[2] === "object" || typeof args[3] === "object") {
				const options = args[3] || args[2];
				Object.keys(options).forEach((key$1) => {
					ret[key$1] = options[key$1];
				});
			}
			return ret;
		},
		interpolation: {
			escapeValue: true,
			format: (value) => value,
			prefix: "{{",
			suffix: "}}",
			formatSeparator: ",",
			unescapePrefix: "-",
			nestingPrefix: "$t(",
			nestingSuffix: ")",
			nestingOptionsSeparator: ",",
			maxReplaces: 1e3,
			skipOnVariables: true
		}
	});
	const transformOptions = (options) => {
		if (isString$1(options.ns)) options.ns = [options.ns];
		if (isString$1(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
		if (isString$1(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
		if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) options.supportedLngs = options.supportedLngs.concat(["cimode"]);
		return options;
	};
	const noop$1 = () => {};
	const bindMemberFunctions = (inst) => {
		Object.getOwnPropertyNames(Object.getPrototypeOf(inst)).forEach((mem) => {
			if (typeof inst[mem] === "function") inst[mem] = inst[mem].bind(inst);
		});
	};
	var I18n = class I18n extends EventEmitter {
		constructor() {
			let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			let callback = arguments.length > 1 ? arguments[1] : void 0;
			super();
			this.options = transformOptions(options);
			this.services = {};
			this.logger = baseLogger;
			this.modules = { external: [] };
			bindMemberFunctions(this);
			if (callback && !this.isInitialized && !options.isClone) {
				if (!this.options.initImmediate) {
					this.init(options, callback);
					return this;
				}
				setTimeout(() => {
					this.init(options, callback);
				}, 0);
			}
		}
		init() {
			var _this = this;
			let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			let callback = arguments.length > 1 ? arguments[1] : void 0;
			this.isInitializing = true;
			if (typeof options === "function") {
				callback = options;
				options = {};
			}
			if (!options.defaultNS && options.defaultNS !== false && options.ns) {
				if (isString$1(options.ns)) options.defaultNS = options.ns;
				else if (options.ns.indexOf("translation") < 0) options.defaultNS = options.ns[0];
			}
			const defOpts = get();
			this.options = {
				...defOpts,
				...this.options,
				...transformOptions(options)
			};
			if (this.options.compatibilityAPI !== "v1") this.options.interpolation = {
				...defOpts.interpolation,
				...this.options.interpolation
			};
			if (options.keySeparator !== void 0) this.options.userDefinedKeySeparator = options.keySeparator;
			if (options.nsSeparator !== void 0) this.options.userDefinedNsSeparator = options.nsSeparator;
			const createClassOnDemand = (ClassOrObject) => {
				if (!ClassOrObject) return null;
				if (typeof ClassOrObject === "function") return new ClassOrObject();
				return ClassOrObject;
			};
			if (!this.options.isClone) {
				if (this.modules.logger) baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
				else baseLogger.init(null, this.options);
				let formatter;
				if (this.modules.formatter) formatter = this.modules.formatter;
				else if (typeof Intl !== "undefined") formatter = Formatter;
				const lu = new LanguageUtil(this.options);
				this.store = new ResourceStore(this.options.resources, this.options);
				const s$2 = this.services;
				s$2.logger = baseLogger;
				s$2.resourceStore = this.store;
				s$2.languageUtils = lu;
				s$2.pluralResolver = new PluralResolver(lu, {
					prepend: this.options.pluralSeparator,
					compatibilityJSON: this.options.compatibilityJSON,
					simplifyPluralSuffix: this.options.simplifyPluralSuffix
				});
				if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
					s$2.formatter = createClassOnDemand(formatter);
					s$2.formatter.init(s$2, this.options);
					this.options.interpolation.format = s$2.formatter.format.bind(s$2.formatter);
				}
				s$2.interpolator = new Interpolator(this.options);
				s$2.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) };
				s$2.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s$2.resourceStore, s$2, this.options);
				s$2.backendConnector.on("*", function(event) {
					for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
					_this.emit(event, ...args);
				});
				if (this.modules.languageDetector) {
					s$2.languageDetector = createClassOnDemand(this.modules.languageDetector);
					if (s$2.languageDetector.init) s$2.languageDetector.init(s$2, this.options.detection, this.options);
				}
				if (this.modules.i18nFormat) {
					s$2.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
					if (s$2.i18nFormat.init) s$2.i18nFormat.init(this);
				}
				this.translator = new Translator(this.services, this.options);
				this.translator.on("*", function(event) {
					for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
					_this.emit(event, ...args);
				});
				this.modules.external.forEach((m$1) => {
					if (m$1.init) m$1.init(this);
				});
			}
			this.format = this.options.interpolation.format;
			if (!callback) callback = noop$1;
			if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
				const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
				if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
			}
			if (!this.services.languageDetector && !this.options.lng) this.logger.warn("init: no languageDetector is used and no lng is defined");
			[
				"getResource",
				"hasResourceBundle",
				"getResourceBundle",
				"getDataByLanguage"
			].forEach((fcName) => {
				this[fcName] = function() {
					return _this.store[fcName](...arguments);
				};
			});
			[
				"addResource",
				"addResources",
				"addResourceBundle",
				"removeResourceBundle"
			].forEach((fcName) => {
				this[fcName] = function() {
					_this.store[fcName](...arguments);
					return _this;
				};
			});
			const deferred = defer();
			const load = () => {
				const finish = (err, t$2) => {
					this.isInitializing = false;
					if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
					this.isInitialized = true;
					if (!this.options.isClone) this.logger.log("initialized", this.options);
					this.emit("initialized", this.options);
					deferred.resolve(t$2);
					callback(err, t$2);
				};
				if (this.languages && this.options.compatibilityAPI !== "v1" && !this.isInitialized) return finish(null, this.t.bind(this));
				this.changeLanguage(this.options.lng, finish);
			};
			if (this.options.resources || !this.options.initImmediate) load();
			else setTimeout(load, 0);
			return deferred;
		}
		loadResources(language) {
			let usedCallback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
			const usedLng = isString$1(language) ? language : this.language;
			if (typeof language === "function") usedCallback = language;
			if (!this.options.resources || this.options.partialBundledLanguages) {
				if (usedLng && usedLng.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
				const toLoad = [];
				const append = (lng) => {
					if (!lng) return;
					if (lng === "cimode") return;
					this.services.languageUtils.toResolveHierarchy(lng).forEach((l$2) => {
						if (l$2 === "cimode") return;
						if (toLoad.indexOf(l$2) < 0) toLoad.push(l$2);
					});
				};
				if (!usedLng) this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((l$2) => append(l$2));
				else append(usedLng);
				if (this.options.preload) this.options.preload.forEach((l$2) => append(l$2));
				this.services.backendConnector.load(toLoad, this.options.ns, (e$1) => {
					if (!e$1 && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
					usedCallback(e$1);
				});
			} else usedCallback(null);
		}
		reloadResources(lngs, ns, callback) {
			const deferred = defer();
			if (typeof lngs === "function") {
				callback = lngs;
				lngs = void 0;
			}
			if (typeof ns === "function") {
				callback = ns;
				ns = void 0;
			}
			if (!lngs) lngs = this.languages;
			if (!ns) ns = this.options.ns;
			if (!callback) callback = noop$1;
			this.services.backendConnector.reload(lngs, ns, (err) => {
				deferred.resolve();
				callback(err);
			});
			return deferred;
		}
		use(module) {
			if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
			if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
			if (module.type === "backend") this.modules.backend = module;
			if (module.type === "logger" || module.log && module.warn && module.error) this.modules.logger = module;
			if (module.type === "languageDetector") this.modules.languageDetector = module;
			if (module.type === "i18nFormat") this.modules.i18nFormat = module;
			if (module.type === "postProcessor") postProcessor.addPostProcessor(module);
			if (module.type === "formatter") this.modules.formatter = module;
			if (module.type === "3rdParty") this.modules.external.push(module);
			return this;
		}
		setResolvedLanguage(l$2) {
			if (!l$2 || !this.languages) return;
			if (["cimode", "dev"].indexOf(l$2) > -1) return;
			for (let li$1 = 0; li$1 < this.languages.length; li$1++) {
				const lngInLngs = this.languages[li$1];
				if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
				if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
					this.resolvedLanguage = lngInLngs;
					break;
				}
			}
		}
		changeLanguage(lng, callback) {
			var _this2 = this;
			this.isLanguageChangingTo = lng;
			const deferred = defer();
			this.emit("languageChanging", lng);
			const setLngProps = (l$2) => {
				this.language = l$2;
				this.languages = this.services.languageUtils.toResolveHierarchy(l$2);
				this.resolvedLanguage = void 0;
				this.setResolvedLanguage(l$2);
			};
			const done = (err, l$2) => {
				if (l$2) {
					setLngProps(l$2);
					this.translator.changeLanguage(l$2);
					this.isLanguageChangingTo = void 0;
					this.emit("languageChanged", l$2);
					this.logger.log("languageChanged", l$2);
				} else this.isLanguageChangingTo = void 0;
				deferred.resolve(function() {
					return _this2.t(...arguments);
				});
				if (callback) callback(err, function() {
					return _this2.t(...arguments);
				});
			};
			const setLng = (lngs) => {
				if (!lng && !lngs && this.services.languageDetector) lngs = [];
				const l$2 = isString$1(lngs) ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
				if (l$2) {
					if (!this.language) setLngProps(l$2);
					if (!this.translator.language) this.translator.changeLanguage(l$2);
					if (this.services.languageDetector && this.services.languageDetector.cacheUserLanguage) this.services.languageDetector.cacheUserLanguage(l$2);
				}
				this.loadResources(l$2, (err) => {
					done(err, l$2);
				});
			};
			if (!lng && this.services.languageDetector && !this.services.languageDetector.async) setLng(this.services.languageDetector.detect());
			else if (!lng && this.services.languageDetector && this.services.languageDetector.async) if (this.services.languageDetector.detect.length === 0) this.services.languageDetector.detect().then(setLng);
			else this.services.languageDetector.detect(setLng);
			else setLng(lng);
			return deferred;
		}
		getFixedT(lng, ns, keyPrefix) {
			var _this3 = this;
			const fixedT = function(key$1, opts) {
				let options;
				if (typeof opts !== "object") {
					for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) rest[_key3 - 2] = arguments[_key3];
					options = _this3.options.overloadTranslationOptionHandler([key$1, opts].concat(rest));
				} else options = { ...opts };
				options.lng = options.lng || fixedT.lng;
				options.lngs = options.lngs || fixedT.lngs;
				options.ns = options.ns || fixedT.ns;
				if (options.keyPrefix !== "") options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
				const keySeparator = _this3.options.keySeparator || ".";
				let resultKey;
				if (options.keyPrefix && Array.isArray(key$1)) resultKey = key$1.map((k$1) => `${options.keyPrefix}${keySeparator}${k$1}`);
				else resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key$1}` : key$1;
				return _this3.t(resultKey, options);
			};
			if (isString$1(lng)) fixedT.lng = lng;
			else fixedT.lngs = lng;
			fixedT.ns = ns;
			fixedT.keyPrefix = keyPrefix;
			return fixedT;
		}
		t() {
			return this.translator && this.translator.translate(...arguments);
		}
		exists() {
			return this.translator && this.translator.exists(...arguments);
		}
		setDefaultNamespace(ns) {
			this.options.defaultNS = ns;
		}
		hasLoadedNamespace(ns) {
			let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			if (!this.isInitialized) {
				this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
				return false;
			}
			if (!this.languages || !this.languages.length) {
				this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
				return false;
			}
			const lng = options.lng || this.resolvedLanguage || this.languages[0];
			const fallbackLng = this.options ? this.options.fallbackLng : false;
			const lastLng = this.languages[this.languages.length - 1];
			if (lng.toLowerCase() === "cimode") return true;
			const loadNotPending = (l$2, n) => {
				const loadState = this.services.backendConnector.state[`${l$2}|${n}`];
				return loadState === -1 || loadState === 0 || loadState === 2;
			};
			if (options.precheck) {
				const preResult = options.precheck(this, loadNotPending);
				if (preResult !== void 0) return preResult;
			}
			if (this.hasResourceBundle(lng, ns)) return true;
			if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
			if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
			return false;
		}
		loadNamespaces(ns, callback) {
			const deferred = defer();
			if (!this.options.ns) {
				if (callback) callback();
				return Promise.resolve();
			}
			if (isString$1(ns)) ns = [ns];
			ns.forEach((n) => {
				if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
			});
			this.loadResources((err) => {
				deferred.resolve();
				if (callback) callback(err);
			});
			return deferred;
		}
		loadLanguages(lngs, callback) {
			const deferred = defer();
			if (isString$1(lngs)) lngs = [lngs];
			const preloaded = this.options.preload || [];
			const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
			if (!newLngs.length) {
				if (callback) callback();
				return Promise.resolve();
			}
			this.options.preload = preloaded.concat(newLngs);
			this.loadResources((err) => {
				deferred.resolve();
				if (callback) callback(err);
			});
			return deferred;
		}
		dir(lng) {
			if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
			if (!lng) return "rtl";
			const rtlLngs = [
				"ar",
				"shu",
				"sqr",
				"ssh",
				"xaa",
				"yhd",
				"yud",
				"aao",
				"abh",
				"abv",
				"acm",
				"acq",
				"acw",
				"acx",
				"acy",
				"adf",
				"ads",
				"aeb",
				"aec",
				"afb",
				"ajp",
				"apc",
				"apd",
				"arb",
				"arq",
				"ars",
				"ary",
				"arz",
				"auz",
				"avl",
				"ayh",
				"ayl",
				"ayn",
				"ayp",
				"bbz",
				"pga",
				"he",
				"iw",
				"ps",
				"pbt",
				"pbu",
				"pst",
				"prp",
				"prd",
				"ug",
				"ur",
				"ydd",
				"yds",
				"yih",
				"ji",
				"yi",
				"hbo",
				"men",
				"xmn",
				"fa",
				"jpr",
				"peo",
				"pes",
				"prs",
				"dv",
				"sam",
				"ckb"
			];
			const languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get());
			return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
		}
		static createInstance() {
			return new I18n(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, arguments.length > 1 ? arguments[1] : void 0);
		}
		cloneInstance() {
			let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
			const forkResourceStore = options.forkResourceStore;
			if (forkResourceStore) delete options.forkResourceStore;
			const mergedOptions = {
				...this.options,
				...options,
				isClone: true
			};
			const clone = new I18n(mergedOptions);
			if (options.debug !== void 0 || options.prefix !== void 0) clone.logger = clone.logger.clone(options);
			[
				"store",
				"services",
				"language"
			].forEach((m$1) => {
				clone[m$1] = this[m$1];
			});
			clone.services = { ...this.services };
			clone.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
			if (forkResourceStore) {
				clone.store = new ResourceStore(this.store.data, mergedOptions);
				clone.services.resourceStore = clone.store;
			}
			clone.translator = new Translator(clone.services, mergedOptions);
			clone.translator.on("*", function(event) {
				for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) args[_key4 - 1] = arguments[_key4];
				clone.emit(event, ...args);
			});
			clone.init(mergedOptions, callback);
			clone.translator.options = mergedOptions;
			clone.translator.backendConnector.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
			return clone;
		}
		toJSON() {
			return {
				options: this.options,
				store: this.store,
				language: this.language,
				languages: this.languages,
				resolvedLanguage: this.resolvedLanguage
			};
		}
	};
	const instance = I18n.createInstance();
	instance.createInstance = I18n.createInstance;
	const createInstance = instance.createInstance;
	const dir = instance.dir;
	const init = instance.init;
	const loadResources = instance.loadResources;
	const reloadResources = instance.reloadResources;
	const use = instance.use;
	const changeLanguage = instance.changeLanguage;
	const getFixedT = instance.getFixedT;
	const t$1 = instance.t;
	const exists = instance.exists;
	const setDefaultNamespace = instance.setDefaultNamespace;
	const hasLoadedNamespace = instance.hasLoadedNamespace;
	const loadNamespaces = instance.loadNamespaces;
	const loadLanguages = instance.loadLanguages;

//#endregion
//#region ../../packages/lark/src/env.ts
	const noop = () => {};
	const defaultToast = {
		error: noop,
		warning: noop,
		info: noop,
		loading: noop,
		success: noop,
		remove: noop
	};
	const Toast = window.Toast ?? defaultToast;
	const User = window.User;
	const PageMain = window.PageMain;
	const isDoc = () => window.editor !== void 0;
	const isDocx = () => window.PageMain !== void 0;

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/array/chunk.mjs
	function chunk(arr, size) {
		if (!Number.isInteger(size) || size <= 0) throw new Error("Size must be an integer greater than zero.");
		const chunkLength = Math.ceil(arr.length / size);
		const result = Array(chunkLength);
		for (let index = 0; index < chunkLength; index++) {
			const start = index * size;
			const end = start + size;
			result[index] = arr.slice(start, end);
		}
		return result;
	}

//#endregion
//#region ../../packages/common/src/time.ts
	const Second = 1e3;
	const Minute = 60 * Second;
	const waitFor = (timeout = .4 * Second) => new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, timeout);
	});

//#endregion
//#region ../../packages/common/src/dom.ts
	const waitForFunction = async (func, options = {}) => {
		const { timeout = .4 * Second } = options;
		let timeoutId = setTimeout(() => {
			timeoutId = null;
		}, timeout);
		const isTimeout = () => timeoutId === null;
		const _func = () => Promise.resolve(func()).catch(() => false);
		while (!await _func() && !isTimeout()) await waitFor(.1 * Second);
		if (isTimeout()) throw new Error(`Timeout waiting for function: ${func.name}`);
		else clearTimeout(timeoutId);
	};

//#endregion
//#region ../../packages/common/src/svg.ts
	async function svgToDataURL(svg$2) {
		return Promise.resolve().then(() => new XMLSerializer().serializeToString(svg$2)).then(encodeURIComponent).then((html$6) => `data:image/svg+xml;charset=utf-8,${html$6}`);
	}
	function createImage(url) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				img.decode().then(() => {
					requestAnimationFrame(() => resolve(img));
				});
			};
			img.onerror = reject;
			img.crossOrigin = "anonymous";
			img.decoding = "async";
			img.src = url;
		});
	}
	const getSvgSize = (svg$2, options = {}) => {
		const fromAttr = (input) => {
			if (!input) return 0;
			const result = parseInt(input, 10);
			return Number.isNaN(result) ? 0 : result;
		};
		return {
			width: svg$2.clientWidth || fromAttr(svg$2.getAttribute("width")) || (options.width ?? 0),
			height: svg$2.clientHeight || fromAttr(svg$2.getAttribute("height")) || (options.height ?? 0)
		};
	};
	const canvasDimensionLimit = 16384;
	function checkCanvasDimensions(canvas) {
		if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) if (canvas.width > canvas.height) {
			canvas.height *= canvasDimensionLimit / canvas.width;
			canvas.width = canvasDimensionLimit;
		} else {
			canvas.width *= canvasDimensionLimit / canvas.height;
			canvas.height = canvasDimensionLimit;
		}
		else if (canvas.width > canvasDimensionLimit) {
			canvas.height *= canvasDimensionLimit / canvas.width;
			canvas.width = canvasDimensionLimit;
		} else {
			canvas.width *= canvasDimensionLimit / canvas.height;
			canvas.height = canvasDimensionLimit;
		}
	}
	async function toCanvas(svg$2, options = {}) {
		const { width: fallbackWidth, height: fallbackHeight } = getSvgSize(svg$2);
		const width = options.width ?? fallbackWidth;
		const height = options.height ?? fallbackHeight;
		const img = await createImage(await svgToDataURL(svg$2));
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		const ratio = options.pixelRatio ?? window.devicePixelRatio;
		const canvasWidth = options.canvasWidth ?? width;
		const canvasHeight = options.canvasHeight ?? height;
		canvas.width = canvasWidth * ratio;
		canvas.height = canvasHeight * ratio;
		if (!options.skipAutoScale) checkCanvasDimensions(canvas);
		canvas.style.width = `${canvasWidth}`;
		canvas.style.height = `${canvasHeight}`;
		if (options.backgroundColor) {
			context.fillStyle = options.backgroundColor;
			context.fillRect(0, 0, canvas.width, canvas.height);
		}
		context.drawImage(img, 0, 0, canvas.width, canvas.height);
		return canvas;
	}
	function canvasToBlob(canvas, options = {}) {
		return new Promise((resolve) => {
			canvas.toBlob(resolve, options.type ?? "image/png", options.quality ?? 1);
		});
	}
	async function toBlob(node$1, options = {}) {
		return await canvasToBlob(await toCanvas(node$1, options), options);
	}

//#endregion
//#region ../../packages/common/src/image.ts
	const imageDataToBlob = (imageData, options = {}) => {
		return new Promise((resolve) => {
			const { onDispose } = options;
			const width = imageData.width;
			const height = imageData.height;
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				resolve(null);
				return;
			}
			ctx.putImageData(imageData, 0, 0);
			onDispose?.();
			canvas.toBlob(resolve);
		});
	};

//#endregion
//#region ../../packages/common/src/number.ts
	const OneHundred = 100;

//#endregion
//#region ../../packages/common/src/utils.ts
	const compare = (a$2, b$1) => {
		if (a$2 === b$1) return 0;
		return a$2 > b$1 ? 1 : -1;
	};
	/**
	* @returns whether the provided parameter is defined.
	*/
	function isDefined(arg) {
		return !isUndefinedOrNull(arg);
	}
	/**
	* @returns whether the provided parameter is undefined or null.
	*/
	function isUndefinedOrNull(obj) {
		return isUndefined(obj) || obj === null;
	}
	/**
	* @returns whether the provided parameter is undefined.
	*/
	function isUndefined(obj) {
		return typeof obj === "undefined";
	}

//#endregion
//#region ../../node_modules/.pnpm/zwitch@2.0.4/node_modules/zwitch/index.js
/**
	* @callback Handler
	*   Handle a value, with a certain ID field set to a certain value.
	*   The ID field is passed to `zwitch`, and it’s value is this function’s
	*   place on the `handlers` record.
	* @param {...any} parameters
	*   Arbitrary parameters passed to the zwitch.
	*   The first will be an object with a certain ID field set to a certain value.
	* @returns {any}
	*   Anything!
	*/
	/**
	* @callback UnknownHandler
	*   Handle values that do have a certain ID field, but it’s set to a value
	*   that is not listed in the `handlers` record.
	* @param {unknown} value
	*   An object with a certain ID field set to an unknown value.
	* @param {...any} rest
	*   Arbitrary parameters passed to the zwitch.
	* @returns {any}
	*   Anything!
	*/
	/**
	* @callback InvalidHandler
	*   Handle values that do not have a certain ID field.
	* @param {unknown} value
	*   Any unknown value.
	* @param {...any} rest
	*   Arbitrary parameters passed to the zwitch.
	* @returns {void|null|undefined|never}
	*   This should crash or return nothing.
	*/
	/**
	* @template {InvalidHandler} [Invalid=InvalidHandler]
	* @template {UnknownHandler} [Unknown=UnknownHandler]
	* @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
	* @typedef Options
	*   Configuration (required).
	* @property {Invalid} [invalid]
	*   Handler to use for invalid values.
	* @property {Unknown} [unknown]
	*   Handler to use for unknown values.
	* @property {Handlers} [handlers]
	*   Handlers to use.
	*/
	const own$4 = {}.hasOwnProperty;
	/**
	* Handle values based on a field.
	*
	* @template {InvalidHandler} [Invalid=InvalidHandler]
	* @template {UnknownHandler} [Unknown=UnknownHandler]
	* @template {Record<string, Handler>} [Handlers=Record<string, Handler>]
	* @param {string} key
	*   Field to switch on.
	* @param {Options<Invalid, Unknown, Handlers>} [options]
	*   Configuration (required).
	* @returns {{unknown: Unknown, invalid: Invalid, handlers: Handlers, (...parameters: Parameters<Handlers[keyof Handlers]>): ReturnType<Handlers[keyof Handlers]>, (...parameters: Parameters<Unknown>): ReturnType<Unknown>}}
	*/
	function zwitch(key$1, options) {
		const settings = options || {};
		/**
		* Handle one value.
		*
		* Based on the bound `key`, a respective handler will be called.
		* If `value` is not an object, or doesn’t have a `key` property, the special
		* “invalid” handler will be called.
		* If `value` has an unknown `key`, the special “unknown” handler will be
		* called.
		*
		* All arguments, and the context object, are passed through to the handler,
		* and it’s result is returned.
		*
		* @this {unknown}
		*   Any context object.
		* @param {unknown} [value]
		*   Any value.
		* @param {...unknown} parameters
		*   Arbitrary parameters passed to the zwitch.
		* @property {Handler} invalid
		*   Handle for values that do not have a certain ID field.
		* @property {Handler} unknown
		*   Handle values that do have a certain ID field, but it’s set to a value
		*   that is not listed in the `handlers` record.
		* @property {Handlers} handlers
		*   Record of handlers.
		* @returns {unknown}
		*   Anything.
		*/
		function one$2(value, ...parameters) {
			/** @type {Handler|undefined} */
			let fn = one$2.invalid;
			const handlers$1 = one$2.handlers;
			if (value && own$4.call(value, key$1)) {
				const id$1 = String(value[key$1]);
				fn = own$4.call(handlers$1, id$1) ? handlers$1[id$1] : one$2.unknown;
			}
			if (fn) return fn.call(this, value, ...parameters);
		}
		one$2.handlers = settings.handlers || {};
		one$2.invalid = settings.invalid;
		one$2.unknown = settings.unknown;
		return one$2;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/configure.js
/**
	* @import {Options, State} from './types.js'
	*/
	const own$3 = {}.hasOwnProperty;
	/**
	* @param {State} base
	* @param {Options} extension
	* @returns {State}
	*/
	function configure(base, extension) {
		let index = -1;
		/** @type {keyof Options} */
		let key$1;
		if (extension.extensions) while (++index < extension.extensions.length) configure(base, extension.extensions[index]);
		for (key$1 in extension) if (own$3.call(extension, key$1)) switch (key$1) {
			case "extensions": break;
			case "unsafe":
				list$3(base[key$1], extension[key$1]);
				break;
			case "join":
				list$3(base[key$1], extension[key$1]);
				break;
			case "handlers":
				map$2(base[key$1], extension[key$1]);
				break;
			default: base.options[key$1] = extension[key$1];
		}
		return base;
	}
	/**
	* @template T
	* @param {Array<T>} left
	* @param {Array<T> | null | undefined} right
	*/
	function list$3(left, right) {
		if (right) left.push(...right);
	}
	/**
	* @template T
	* @param {Record<string, T>} left
	* @param {Record<string, T> | null | undefined} right
	*/
	function map$2(left, right) {
		if (right) Object.assign(left, right);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/blockquote.js
/**
	* @import {Blockquote, Parents} from 'mdast'
	* @import {Info, Map, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {Blockquote} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function blockquote$1(node$1, _$1, state, info) {
		const exit = state.enter("blockquote");
		const tracker = state.createTracker(info);
		tracker.move("> ");
		tracker.shift(2);
		const value = state.indentLines(state.containerFlow(node$1, tracker.current()), map$1);
		exit();
		return value;
	}
	/** @type {Map} */
	function map$1(line, _$1, blank) {
		return ">" + (blank ? "" : " ") + line;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js
/**
	* @import {ConstructName, Unsafe} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {Array<ConstructName>} stack
	* @param {Unsafe} pattern
	* @returns {boolean}
	*/
	function patternInScope(stack, pattern) {
		return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
	}
	/**
	* @param {Array<ConstructName>} stack
	* @param {Unsafe['inConstruct']} list
	* @param {boolean} none
	* @returns {boolean}
	*/
	function listInScope(stack, list$4, none) {
		if (typeof list$4 === "string") list$4 = [list$4];
		if (!list$4 || list$4.length === 0) return none;
		let index = -1;
		while (++index < list$4.length) if (stack.includes(list$4[index])) return true;
		return false;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/break.js
/**
	* @import {Break, Parents} from 'mdast'
	* @import {Info, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {Break} _
	* @param {Parents | undefined} _1
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function hardBreak$1(_$1, _1, state, info) {
		let index = -1;
		while (++index < state.unsafe.length) if (state.unsafe[index].character === "\n" && patternInScope(state.stack, state.unsafe[index])) return /[ \t]/.test(info.before) ? "" : " ";
		return "\\\n";
	}

//#endregion
//#region ../../node_modules/.pnpm/longest-streak@3.1.0/node_modules/longest-streak/index.js
/**
	* Get the count of the longest repeating streak of `substring` in `value`.
	*
	* @param {string} value
	*   Content to search in.
	* @param {string} substring
	*   Substring to look for, typically one character.
	* @returns {number}
	*   Count of most frequent adjacent `substring`s in `value`.
	*/
	function longestStreak(value, substring) {
		const source = String(value);
		let index = source.indexOf(substring);
		let expected = index;
		let count = 0;
		let max = 0;
		if (typeof substring !== "string") throw new TypeError("Expected substring");
		while (index !== -1) {
			if (index === expected) {
				if (++count > max) max = count;
			} else count = 1;
			expected = index + substring.length;
			index = source.indexOf(substring, expected);
		}
		return max;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js
/**
	* @import {State} from 'mdast-util-to-markdown'
	* @import {Code} from 'mdast'
	*/
	/**
	* @param {Code} node
	* @param {State} state
	* @returns {boolean}
	*/
	function formatCodeAsIndented(node$1, state) {
		return Boolean(state.options.fences === false && node$1.value && !node$1.lang && /[^ \r\n]/.test(node$1.value) && !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node$1.value));
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-fence.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['fence'], null | undefined>}
	*/
	function checkFence(state) {
		const marker = state.options.fence || "`";
		if (marker !== "`" && marker !== "~") throw new Error("Cannot serialize code with `" + marker + "` for `options.fence`, expected `` ` `` or `~`");
		return marker;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/code.js
/**
	* @import {Info, Map, State} from 'mdast-util-to-markdown'
	* @import {Code, Parents} from 'mdast'
	*/
	/**
	* @param {Code} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function code$1(node$1, _$1, state, info) {
		const marker = checkFence(state);
		const raw$1 = node$1.value || "";
		const suffix = marker === "`" ? "GraveAccent" : "Tilde";
		if (formatCodeAsIndented(node$1, state)) {
			const exit$1 = state.enter("codeIndented");
			const value$1 = state.indentLines(raw$1, map);
			exit$1();
			return value$1;
		}
		const tracker = state.createTracker(info);
		const sequence = marker.repeat(Math.max(longestStreak(raw$1, marker) + 1, 3));
		const exit = state.enter("codeFenced");
		let value = tracker.move(sequence);
		if (node$1.lang) {
			const subexit = state.enter(`codeFencedLang${suffix}`);
			value += tracker.move(state.safe(node$1.lang, {
				before: value,
				after: " ",
				encode: ["`"],
				...tracker.current()
			}));
			subexit();
		}
		if (node$1.lang && node$1.meta) {
			const subexit = state.enter(`codeFencedMeta${suffix}`);
			value += tracker.move(" ");
			value += tracker.move(state.safe(node$1.meta, {
				before: value,
				after: "\n",
				encode: ["`"],
				...tracker.current()
			}));
			subexit();
		}
		value += tracker.move("\n");
		if (raw$1) value += tracker.move(raw$1 + "\n");
		value += tracker.move(sequence);
		exit();
		return value;
	}
	/** @type {Map} */
	function map(line, _$1, blank) {
		return (blank ? "" : "    ") + line;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-quote.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['quote'], null | undefined>}
	*/
	function checkQuote(state) {
		const marker = state.options.quote || "\"";
		if (marker !== "\"" && marker !== "'") throw new Error("Cannot serialize title with `" + marker + "` for `options.quote`, expected `\"`, or `'`");
		return marker;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/definition.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {Definition, Parents} from 'mdast'
	*/
	/**
	* @param {Definition} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function definition(node$1, _$1, state, info) {
		const quote = checkQuote(state);
		const suffix = quote === "\"" ? "Quote" : "Apostrophe";
		const exit = state.enter("definition");
		let subexit = state.enter("label");
		const tracker = state.createTracker(info);
		let value = tracker.move("[");
		value += tracker.move(state.safe(state.associationId(node$1), {
			before: value,
			after: "]",
			...tracker.current()
		}));
		value += tracker.move("]: ");
		subexit();
		if (!node$1.url || /[\0- \u007F]/.test(node$1.url)) {
			subexit = state.enter("destinationLiteral");
			value += tracker.move("<");
			value += tracker.move(state.safe(node$1.url, {
				before: value,
				after: ">",
				...tracker.current()
			}));
			value += tracker.move(">");
		} else {
			subexit = state.enter("destinationRaw");
			value += tracker.move(state.safe(node$1.url, {
				before: value,
				after: node$1.title ? " " : "\n",
				...tracker.current()
			}));
		}
		subexit();
		if (node$1.title) {
			subexit = state.enter(`title${suffix}`);
			value += tracker.move(" " + quote);
			value += tracker.move(state.safe(node$1.title, {
				before: value,
				after: quote,
				...tracker.current()
			}));
			value += tracker.move(quote);
			subexit();
		}
		exit();
		return value;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['emphasis'], null | undefined>}
	*/
	function checkEmphasis(state) {
		const marker = state.options.emphasis || "*";
		if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize emphasis with `" + marker + "` for `options.emphasis`, expected `*`, or `_`");
		return marker;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js
/**
	* Encode a code point as a character reference.
	*
	* @param {number} code
	*   Code point to encode.
	* @returns {string}
	*   Encoded character reference.
	*/
	function encodeCharacterReference(code$2) {
		return "&#x" + code$2.toString(16).toUpperCase() + ";";
	}

//#endregion
//#region ../../node_modules/.pnpm/micromark-util-character@2.1.1/node_modules/micromark-util-character/index.js
/**
	* @import {Code} from 'micromark-util-types'
	*/
	/**
	* Check whether the character code represents an ASCII alpha (`a` through `z`,
	* case insensitive).
	*
	* An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
	*
	* An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
	* to U+005A (`Z`).
	*
	* An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
	* to U+007A (`z`).
	*
	* @param code
	*   Code.
	* @returns {boolean}
	*   Whether it matches.
	*/
	const asciiAlpha = regexCheck(/[A-Za-z]/);
	/**
	* Check whether the character code represents an ASCII alphanumeric (`a`
	* through `z`, case insensitive, or `0` through `9`).
	*
	* An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
	* (see `asciiAlpha`).
	*
	* @param code
	*   Code.
	* @returns {boolean}
	*   Whether it matches.
	*/
	const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
	/**
	* Check whether the character code represents an ASCII atext.
	*
	* atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
	* the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
	* U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
	* SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
	* CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
	* (`{`) to U+007E TILDE (`~`).
	*
	* See:
	* **\[RFC5322]**:
	* [Internet Message Format](https://tools.ietf.org/html/rfc5322).
	* P. Resnick.
	* IETF.
	*
	* @param code
	*   Code.
	* @returns {boolean}
	*   Whether it matches.
	*/
	const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
	/**
	* Check whether the character code represents an ASCII digit (`0` through `9`).
	*
	* An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
	* U+0039 (`9`).
	*
	* @param code
	*   Code.
	* @returns {boolean}
	*   Whether it matches.
	*/
	const asciiDigit = regexCheck(/\d/);
	/**
	* Check whether the character code represents an ASCII hex digit (`a` through
	* `f`, case insensitive, or `0` through `9`).
	*
	* An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
	* digit, or an ASCII lower hex digit.
	*
	* An **ASCII upper hex digit** is a character in the inclusive range U+0041
	* (`A`) to U+0046 (`F`).
	*
	* An **ASCII lower hex digit** is a character in the inclusive range U+0061
	* (`a`) to U+0066 (`f`).
	*
	* @param code
	*   Code.
	* @returns {boolean}
	*   Whether it matches.
	*/
	const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
	/**
	* Check whether the character code represents ASCII punctuation.
	*
	* An **ASCII punctuation** is a character in the inclusive ranges U+0021
	* EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
	* SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
	* (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
	*
	* @param code
	*   Code.
	* @returns {boolean}
	*   Whether it matches.
	*/
	const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
	/**
	* Check whether a character code is a markdown line ending (see
	* `markdownLineEnding`) or markdown space (see `markdownSpace`).
	*
	* @param {Code} code
	*   Code.
	* @returns {boolean}
	*   Whether it matches.
	*/
	function markdownLineEndingOrSpace(code$2) {
		return code$2 !== null && (code$2 < 0 || code$2 === 32);
	}
	/**
	* Check whether the character code represents Unicode punctuation.
	*
	* A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
	* Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
	* (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
	* (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
	* punctuation (see `asciiPunctuation`).
	*
	* See:
	* **\[UNICODE]**:
	* [The Unicode Standard](https://www.unicode.org/versions/).
	* Unicode Consortium.
	*
	* @param code
	*   Code.
	* @returns
	*   Whether it matches.
	*/
	const unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
	/**
	* Check whether the character code represents Unicode whitespace.
	*
	* Note that this does handle micromark specific markdown whitespace characters.
	* See `markdownLineEndingOrSpace` to check that.
	*
	* A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
	* Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
	* U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
	*
	* See:
	* **\[UNICODE]**:
	* [The Unicode Standard](https://www.unicode.org/versions/).
	* Unicode Consortium.
	*
	* @param code
	*   Code.
	* @returns
	*   Whether it matches.
	*/
	const unicodeWhitespace = regexCheck(/\s/);
	/**
	* Create a code check from a regex.
	*
	* @param {RegExp} regex
	*   Expression.
	* @returns {(code: Code) => boolean}
	*   Check.
	*/
	function regexCheck(regex) {
		return check;
		/**
		* Check whether a code matches the bound regex.
		*
		* @param {Code} code
		*   Character code.
		* @returns {boolean}
		*   Whether the character code matches the bound regex.
		*/
		function check(code$2) {
			return code$2 !== null && code$2 > -1 && regex.test(String.fromCharCode(code$2));
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/micromark-util-classify-character@2.0.1/node_modules/micromark-util-classify-character/index.js
/**
	* @import {Code} from 'micromark-util-types'
	*/
	/**
	* Classify whether a code represents whitespace, punctuation, or something
	* else.
	*
	* Used for attention (emphasis, strong), whose sequences can open or close
	* based on the class of surrounding characters.
	*
	* > 👉 **Note**: eof (`null`) is seen as whitespace.
	*
	* @param {Code} code
	*   Code.
	* @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
	*   Group.
	*/
	function classifyCharacter(code$2) {
		if (code$2 === null || markdownLineEndingOrSpace(code$2) || unicodeWhitespace(code$2)) return 1;
		if (unicodePunctuation(code$2)) return 2;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-info.js
/**
	* @import {EncodeSides} from '../types.js'
	*/
	/**
	* Check whether to encode (as a character reference) the characters
	* surrounding an attention run.
	*
	* Which characters are around an attention run influence whether it works or
	* not.
	*
	* See <https://github.com/orgs/syntax-tree/discussions/60> for more info.
	* See this markdown in a particular renderer to see what works:
	*
	* ```markdown
	* |                         | A (letter inside) | B (punctuation inside) | C (whitespace inside) | D (nothing inside) |
	* | ----------------------- | ----------------- | ---------------------- | --------------------- | ------------------ |
	* | 1 (letter outside)      | x*y*z             | x*.*z                  | x* *z                 | x**z               |
	* | 2 (punctuation outside) | .*y*.             | .*.*.                  | .* *.                 | .**.               |
	* | 3 (whitespace outside)  | x *y* z           | x *.* z                | x * * z               | x ** z             |
	* | 4 (nothing outside)     | *x*               | *.*                    | * *                   | **                 |
	* ```
	*
	* @param {number} outside
	*   Code point on the outer side of the run.
	* @param {number} inside
	*   Code point on the inner side of the run.
	* @param {'*' | '_'} marker
	*   Marker of the run.
	*   Underscores are handled more strictly (they form less often) than
	*   asterisks.
	* @returns {EncodeSides}
	*   Whether to encode characters.
	*/
	function encodeInfo(outside, inside, marker) {
		const outsideKind = classifyCharacter(outside);
		const insideKind = classifyCharacter(inside);
		if (outsideKind === void 0) return insideKind === void 0 ? marker === "_" ? {
			inside: true,
			outside: true
		} : {
			inside: false,
			outside: false
		} : insideKind === 1 ? {
			inside: true,
			outside: true
		} : {
			inside: false,
			outside: true
		};
		if (outsideKind === 1) return insideKind === void 0 ? {
			inside: false,
			outside: false
		} : insideKind === 1 ? {
			inside: true,
			outside: true
		} : {
			inside: false,
			outside: false
		};
		return insideKind === void 0 ? {
			inside: false,
			outside: false
		} : insideKind === 1 ? {
			inside: true,
			outside: false
		} : {
			inside: false,
			outside: false
		};
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/emphasis.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {Emphasis, Parents} from 'mdast'
	*/
	emphasis$1.peek = emphasisPeek;
	/**
	* @param {Emphasis} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function emphasis$1(node$1, _$1, state, info) {
		const marker = checkEmphasis(state);
		const exit = state.enter("emphasis");
		const tracker = state.createTracker(info);
		const before = tracker.move(marker);
		let between$1 = tracker.move(state.containerPhrasing(node$1, {
			after: marker,
			before,
			...tracker.current()
		}));
		const betweenHead = between$1.charCodeAt(0);
		const open = encodeInfo(info.before.charCodeAt(info.before.length - 1), betweenHead, marker);
		if (open.inside) between$1 = encodeCharacterReference(betweenHead) + between$1.slice(1);
		const betweenTail = between$1.charCodeAt(between$1.length - 1);
		const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
		if (close.inside) between$1 = between$1.slice(0, -1) + encodeCharacterReference(betweenTail);
		const after = tracker.move(marker);
		exit();
		state.attentionEncodeSurroundingInfo = {
			after: close.outside,
			before: open.outside
		};
		return before + between$1 + after;
	}
	/**
	* @param {Emphasis} _
	* @param {Parents | undefined} _1
	* @param {State} state
	* @returns {string}
	*/
	function emphasisPeek(_$1, _1, state) {
		return state.options.emphasis || "*";
	}

//#endregion
//#region ../../node_modules/.pnpm/unist-util-is@6.0.0/node_modules/unist-util-is/lib/index.js
/**
	* Generate an assertion from a test.
	*
	* Useful if you’re going to test many nodes, for example when creating a
	* utility where something else passes a compatible test.
	*
	* The created function is a bit faster because it expects valid input only:
	* a `node`, `index`, and `parent`.
	*
	* @param {Test} test
	*   *   when nullish, checks if `node` is a `Node`.
	*   *   when `string`, works like passing `(node) => node.type === test`.
	*   *   when `function` checks if function passed the node is true.
	*   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
	*   *   when `array`, checks if any one of the subtests pass.
	* @returns {Check}
	*   An assertion.
	*/
	const convert = (function(test) {
		if (test === null || test === void 0) return ok$1;
		if (typeof test === "function") return castFactory(test);
		if (typeof test === "object") return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
		if (typeof test === "string") return typeFactory(test);
		throw new Error("Expected function, string, or object as test");
	});
	/**
	* @param {Array<Props | TestFunction | string>} tests
	* @returns {Check}
	*/
	function anyFactory(tests) {
		/** @type {Array<Check>} */
		const checks$1 = [];
		let index = -1;
		while (++index < tests.length) checks$1[index] = convert(tests[index]);
		return castFactory(any);
		/**
		* @this {unknown}
		* @type {TestFunction}
		*/
		function any(...parameters) {
			let index$1 = -1;
			while (++index$1 < checks$1.length) if (checks$1[index$1].apply(this, parameters)) return true;
			return false;
		}
	}
	/**
	* Turn an object into a test for a node with a certain fields.
	*
	* @param {Props} check
	* @returns {Check}
	*/
	function propsFactory(check) {
		const checkAsRecord = check;
		return castFactory(all$2);
		/**
		* @param {Node} node
		* @returns {boolean}
		*/
		function all$2(node$1) {
			const nodeAsRecord = node$1;
			/** @type {string} */
			let key$1;
			for (key$1 in check) if (nodeAsRecord[key$1] !== checkAsRecord[key$1]) return false;
			return true;
		}
	}
	/**
	* Turn a string into a test for a node with a certain type.
	*
	* @param {string} check
	* @returns {Check}
	*/
	function typeFactory(check) {
		return castFactory(type);
		/**
		* @param {Node} node
		*/
		function type(node$1) {
			return node$1 && node$1.type === check;
		}
	}
	/**
	* Turn a custom test into a test for a node that passes that test.
	*
	* @param {TestFunction} testFunction
	* @returns {Check}
	*/
	function castFactory(testFunction) {
		return check;
		/**
		* @this {unknown}
		* @type {Check}
		*/
		function check(value, index, parent) {
			return Boolean(looksLikeANode(value) && testFunction.call(this, value, typeof index === "number" ? index : void 0, parent || void 0));
		}
	}
	function ok$1() {
		return true;
	}
	/**
	* @param {unknown} value
	* @returns {value is Node}
	*/
	function looksLikeANode(value) {
		return value !== null && typeof value === "object" && "type" in value;
	}

//#endregion
//#region ../../node_modules/.pnpm/unist-util-visit-parents@6.0.1/node_modules/unist-util-visit-parents/lib/color.js
/**
	* @param {string} d
	* @returns {string}
	*/
	function color(d$2) {
		return d$2;
	}

//#endregion
//#region ../../node_modules/.pnpm/unist-util-visit-parents@6.0.1/node_modules/unist-util-visit-parents/lib/index.js
/**
	* @typedef {import('unist').Node} UnistNode
	* @typedef {import('unist').Parent} UnistParent
	*/
	/**
	* @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
	*   Test from `unist-util-is`.
	*
	*   Note: we have remove and add `undefined`, because otherwise when generating
	*   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
	*   which doesn’t work when publishing on npm.
	*/
	/**
	* @typedef {(
	*   Fn extends (value: any) => value is infer Thing
	*   ? Thing
	*   : Fallback
	* )} Predicate
	*   Get the value of a type guard `Fn`.
	* @template Fn
	*   Value; typically function that is a type guard (such as `(x): x is Y`).
	* @template Fallback
	*   Value to yield if `Fn` is not a type guard.
	*/
	/**
	* @typedef {(
	*   Check extends null | undefined // No test.
	*   ? Value
	*   : Value extends {type: Check} // String (type) test.
	*   ? Value
	*   : Value extends Check // Partial test.
	*   ? Value
	*   : Check extends Function // Function test.
	*   ? Predicate<Check, Value> extends Value
	*     ? Predicate<Check, Value>
	*     : never
	*   : never // Some other test?
	* )} MatchesOne
	*   Check whether a node matches a primitive check in the type system.
	* @template Value
	*   Value; typically unist `Node`.
	* @template Check
	*   Value; typically `unist-util-is`-compatible test, but not arrays.
	*/
	/**
	* @typedef {(
	*   Check extends Array<any>
	*   ? MatchesOne<Value, Check[keyof Check]>
	*   : MatchesOne<Value, Check>
	* )} Matches
	*   Check whether a node matches a check in the type system.
	* @template Value
	*   Value; typically unist `Node`.
	* @template Check
	*   Value; typically `unist-util-is`-compatible test.
	*/
	/**
	* @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10} Uint
	*   Number; capped reasonably.
	*/
	/**
	* @typedef {I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10} Increment
	*   Increment a number in the type system.
	* @template {Uint} [I=0]
	*   Index.
	*/
	/**
	* @typedef {(
	*   Node extends UnistParent
	*   ? Node extends {children: Array<infer Children>}
	*     ? Child extends Children ? Node : never
	*     : never
	*   : never
	* )} InternalParent
	*   Collect nodes that can be parents of `Child`.
	* @template {UnistNode} Node
	*   All node types in a tree.
	* @template {UnistNode} Child
	*   Node to search for.
	*/
	/**
	* @typedef {InternalParent<InclusiveDescendant<Tree>, Child>} Parent
	*   Collect nodes in `Tree` that can be parents of `Child`.
	* @template {UnistNode} Tree
	*   All node types in a tree.
	* @template {UnistNode} Child
	*   Node to search for.
	*/
	/**
	* @typedef {(
	*   Depth extends Max
	*   ? never
	*   :
	*     | InternalParent<Node, Child>
	*     | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>
	* )} InternalAncestor
	*   Collect nodes in `Tree` that can be ancestors of `Child`.
	* @template {UnistNode} Node
	*   All node types in a tree.
	* @template {UnistNode} Child
	*   Node to search for.
	* @template {Uint} [Max=10]
	*   Max; searches up to this depth.
	* @template {Uint} [Depth=0]
	*   Current depth.
	*/
	/**
	* @typedef {InternalAncestor<InclusiveDescendant<Tree>, Child>} Ancestor
	*   Collect nodes in `Tree` that can be ancestors of `Child`.
	* @template {UnistNode} Tree
	*   All node types in a tree.
	* @template {UnistNode} Child
	*   Node to search for.
	*/
	/**
	* @typedef {(
	*   Tree extends UnistParent
	*     ? Depth extends Max
	*       ? Tree
	*       : Tree | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
	*     : Tree
	* )} InclusiveDescendant
	*   Collect all (inclusive) descendants of `Tree`.
	*
	*   > 👉 **Note**: for performance reasons, this seems to be the fastest way to
	*   > recurse without actually running into an infinite loop, which the
	*   > previous version did.
	*   >
	*   > Practically, a max of `2` is typically enough assuming a `Root` is
	*   > passed, but it doesn’t improve performance.
	*   > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
	*   > Using up to `10` doesn’t hurt or help either.
	* @template {UnistNode} Tree
	*   Tree type.
	* @template {Uint} [Max=10]
	*   Max; searches up to this depth.
	* @template {Uint} [Depth=0]
	*   Current depth.
	*/
	/**
	* @typedef {'skip' | boolean} Action
	*   Union of the action types.
	*
	* @typedef {number} Index
	*   Move to the sibling at `index` next (after node itself is completely
	*   traversed).
	*
	*   Useful if mutating the tree, such as removing the node the visitor is
	*   currently on, or any of its previous siblings.
	*   Results less than 0 or greater than or equal to `children.length` stop
	*   traversing the parent.
	*
	* @typedef {[(Action | null | undefined | void)?, (Index | null | undefined)?]} ActionTuple
	*   List with one or two values, the first an action, the second an index.
	*
	* @typedef {Action | ActionTuple | Index | null | undefined | void} VisitorResult
	*   Any value that can be returned from a visitor.
	*/
	/**
	* @callback Visitor
	*   Handle a node (matching `test`, if given).
	*
	*   Visitors are free to transform `node`.
	*   They can also transform the parent of node (the last of `ancestors`).
	*
	*   Replacing `node` itself, if `SKIP` is not returned, still causes its
	*   descendants to be walked (which is a bug).
	*
	*   When adding or removing previous siblings of `node` (or next siblings, in
	*   case of reverse), the `Visitor` should return a new `Index` to specify the
	*   sibling to traverse after `node` is traversed.
	*   Adding or removing next siblings of `node` (or previous siblings, in case
	*   of reverse) is handled as expected without needing to return a new `Index`.
	*
	*   Removing the children property of an ancestor still results in them being
	*   traversed.
	* @param {Visited} node
	*   Found node.
	* @param {Array<VisitedParents>} ancestors
	*   Ancestors of `node`.
	* @returns {VisitorResult}
	*   What to do next.
	*
	*   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
	*   An `Action` is treated as a tuple of `[Action]`.
	*
	*   Passing a tuple back only makes sense if the `Action` is `SKIP`.
	*   When the `Action` is `EXIT`, that action can be returned.
	*   When the `Action` is `CONTINUE`, `Index` can be returned.
	* @template {UnistNode} [Visited=UnistNode]
	*   Visited node type.
	* @template {UnistParent} [VisitedParents=UnistParent]
	*   Ancestor type.
	*/
	/**
	* @typedef {Visitor<Matches<InclusiveDescendant<Tree>, Check>, Ancestor<Tree, Matches<InclusiveDescendant<Tree>, Check>>>} BuildVisitor
	*   Build a typed `Visitor` function from a tree and a test.
	*
	*   It will infer which values are passed as `node` and which as `parents`.
	* @template {UnistNode} [Tree=UnistNode]
	*   Tree type.
	* @template {Test} [Check=Test]
	*   Test type.
	*/
	/** @type {Readonly<ActionTuple>} */
	const empty$1 = [];
	/**
	* Continue traversing as normal.
	*/
	const CONTINUE = true;
	/**
	* Stop traversing immediately.
	*/
	const EXIT = false;
	/**
	* Do not traverse this node’s children.
	*/
	const SKIP = "skip";
	/**
	* Visit nodes, with ancestral information.
	*
	* This algorithm performs *depth-first* *tree traversal* in *preorder*
	* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
	*
	* You can choose for which nodes `visitor` is called by passing a `test`.
	* For complex tests, you should test yourself in `visitor`, as it will be
	* faster and will have improved type information.
	*
	* Walking the tree is an intensive task.
	* Make use of the return values of the visitor when possible.
	* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
	* to check if a node matches, and then perform different operations.
	*
	* You can change the tree.
	* See `Visitor` for more info.
	*
	* @overload
	* @param {Tree} tree
	* @param {Check} check
	* @param {BuildVisitor<Tree, Check>} visitor
	* @param {boolean | null | undefined} [reverse]
	* @returns {undefined}
	*
	* @overload
	* @param {Tree} tree
	* @param {BuildVisitor<Tree>} visitor
	* @param {boolean | null | undefined} [reverse]
	* @returns {undefined}
	*
	* @param {UnistNode} tree
	*   Tree to traverse.
	* @param {Visitor | Test} test
	*   `unist-util-is`-compatible test
	* @param {Visitor | boolean | null | undefined} [visitor]
	*   Handle each node.
	* @param {boolean | null | undefined} [reverse]
	*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
	* @returns {undefined}
	*   Nothing.
	*
	* @template {UnistNode} Tree
	*   Node type.
	* @template {Test} Check
	*   `unist-util-is`-compatible test.
	*/
	function visitParents(tree, test, visitor, reverse) {
		/** @type {Test} */
		let check;
		if (typeof test === "function" && typeof visitor !== "function") {
			reverse = visitor;
			visitor = test;
		} else check = test;
		const is = convert(check);
		const step = reverse ? -1 : 1;
		factory(tree, void 0, [])();
		/**
		* @param {UnistNode} node
		* @param {number | undefined} index
		* @param {Array<UnistParent>} parents
		*/
		function factory(node$1, index, parents) {
			const value = node$1 && typeof node$1 === "object" ? node$1 : {};
			if (typeof value.type === "string") {
				const name = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : void 0;
				Object.defineProperty(visit$1, "name", { value: "node (" + color(node$1.type + (name ? "<" + name + ">" : "")) + ")" });
			}
			return visit$1;
			function visit$1() {
				/** @type {Readonly<ActionTuple>} */
				let result = empty$1;
				/** @type {Readonly<ActionTuple>} */
				let subresult;
				/** @type {number} */
				let offset;
				/** @type {Array<UnistParent>} */
				let grandparents;
				if (!test || is(node$1, index, parents[parents.length - 1] || void 0)) {
					result = toResult(visitor(node$1, parents));
					if (result[0] === EXIT) return result;
				}
				if ("children" in node$1 && node$1.children) {
					const nodeAsParent = node$1;
					if (nodeAsParent.children && result[0] !== SKIP) {
						offset = (reverse ? nodeAsParent.children.length : -1) + step;
						grandparents = parents.concat(nodeAsParent);
						while (offset > -1 && offset < nodeAsParent.children.length) {
							const child = nodeAsParent.children[offset];
							subresult = factory(child, offset, grandparents)();
							if (subresult[0] === EXIT) return subresult;
							offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
						}
					}
				}
				return result;
			}
		}
	}
	/**
	* Turn a return value into a clean result.
	*
	* @param {VisitorResult} value
	*   Valid return values from visitors.
	* @returns {Readonly<ActionTuple>}
	*   Clean result.
	*/
	function toResult(value) {
		if (Array.isArray(value)) return value;
		if (typeof value === "number") return [CONTINUE, value];
		return value === null || value === void 0 ? empty$1 : [value];
	}

//#endregion
//#region ../../node_modules/.pnpm/unist-util-visit@5.0.0/node_modules/unist-util-visit/lib/index.js
/**
	* @typedef {import('unist').Node} UnistNode
	* @typedef {import('unist').Parent} UnistParent
	* @typedef {import('unist-util-visit-parents').VisitorResult} VisitorResult
	*/
	/**
	* @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
	*   Test from `unist-util-is`.
	*
	*   Note: we have remove and add `undefined`, because otherwise when generating
	*   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
	*   which doesn’t work when publishing on npm.
	*/
	/**
	* @typedef {(
	*   Fn extends (value: any) => value is infer Thing
	*   ? Thing
	*   : Fallback
	* )} Predicate
	*   Get the value of a type guard `Fn`.
	* @template Fn
	*   Value; typically function that is a type guard (such as `(x): x is Y`).
	* @template Fallback
	*   Value to yield if `Fn` is not a type guard.
	*/
	/**
	* @typedef {(
	*   Check extends null | undefined // No test.
	*   ? Value
	*   : Value extends {type: Check} // String (type) test.
	*   ? Value
	*   : Value extends Check // Partial test.
	*   ? Value
	*   : Check extends Function // Function test.
	*   ? Predicate<Check, Value> extends Value
	*     ? Predicate<Check, Value>
	*     : never
	*   : never // Some other test?
	* )} MatchesOne
	*   Check whether a node matches a primitive check in the type system.
	* @template Value
	*   Value; typically unist `Node`.
	* @template Check
	*   Value; typically `unist-util-is`-compatible test, but not arrays.
	*/
	/**
	* @typedef {(
	*   Check extends Array<any>
	*   ? MatchesOne<Value, Check[keyof Check]>
	*   : MatchesOne<Value, Check>
	* )} Matches
	*   Check whether a node matches a check in the type system.
	* @template Value
	*   Value; typically unist `Node`.
	* @template Check
	*   Value; typically `unist-util-is`-compatible test.
	*/
	/**
	* @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10} Uint
	*   Number; capped reasonably.
	*/
	/**
	* @typedef {I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10} Increment
	*   Increment a number in the type system.
	* @template {Uint} [I=0]
	*   Index.
	*/
	/**
	* @typedef {(
	*   Node extends UnistParent
	*   ? Node extends {children: Array<infer Children>}
	*     ? Child extends Children ? Node : never
	*     : never
	*   : never
	* )} InternalParent
	*   Collect nodes that can be parents of `Child`.
	* @template {UnistNode} Node
	*   All node types in a tree.
	* @template {UnistNode} Child
	*   Node to search for.
	*/
	/**
	* @typedef {InternalParent<InclusiveDescendant<Tree>, Child>} Parent
	*   Collect nodes in `Tree` that can be parents of `Child`.
	* @template {UnistNode} Tree
	*   All node types in a tree.
	* @template {UnistNode} Child
	*   Node to search for.
	*/
	/**
	* @typedef {(
	*   Depth extends Max
	*   ? never
	*   :
	*     | InternalParent<Node, Child>
	*     | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>
	* )} InternalAncestor
	*   Collect nodes in `Tree` that can be ancestors of `Child`.
	* @template {UnistNode} Node
	*   All node types in a tree.
	* @template {UnistNode} Child
	*   Node to search for.
	* @template {Uint} [Max=10]
	*   Max; searches up to this depth.
	* @template {Uint} [Depth=0]
	*   Current depth.
	*/
	/**
	* @typedef {(
	*   Tree extends UnistParent
	*     ? Depth extends Max
	*       ? Tree
	*       : Tree | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
	*     : Tree
	* )} InclusiveDescendant
	*   Collect all (inclusive) descendants of `Tree`.
	*
	*   > 👉 **Note**: for performance reasons, this seems to be the fastest way to
	*   > recurse without actually running into an infinite loop, which the
	*   > previous version did.
	*   >
	*   > Practically, a max of `2` is typically enough assuming a `Root` is
	*   > passed, but it doesn’t improve performance.
	*   > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
	*   > Using up to `10` doesn’t hurt or help either.
	* @template {UnistNode} Tree
	*   Tree type.
	* @template {Uint} [Max=10]
	*   Max; searches up to this depth.
	* @template {Uint} [Depth=0]
	*   Current depth.
	*/
	/**
	* @callback Visitor
	*   Handle a node (matching `test`, if given).
	*
	*   Visitors are free to transform `node`.
	*   They can also transform `parent`.
	*
	*   Replacing `node` itself, if `SKIP` is not returned, still causes its
	*   descendants to be walked (which is a bug).
	*
	*   When adding or removing previous siblings of `node` (or next siblings, in
	*   case of reverse), the `Visitor` should return a new `Index` to specify the
	*   sibling to traverse after `node` is traversed.
	*   Adding or removing next siblings of `node` (or previous siblings, in case
	*   of reverse) is handled as expected without needing to return a new `Index`.
	*
	*   Removing the children property of `parent` still results in them being
	*   traversed.
	* @param {Visited} node
	*   Found node.
	* @param {Visited extends UnistNode ? number | undefined : never} index
	*   Index of `node` in `parent`.
	* @param {Ancestor extends UnistParent ? Ancestor | undefined : never} parent
	*   Parent of `node`.
	* @returns {VisitorResult}
	*   What to do next.
	*
	*   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
	*   An `Action` is treated as a tuple of `[Action]`.
	*
	*   Passing a tuple back only makes sense if the `Action` is `SKIP`.
	*   When the `Action` is `EXIT`, that action can be returned.
	*   When the `Action` is `CONTINUE`, `Index` can be returned.
	* @template {UnistNode} [Visited=UnistNode]
	*   Visited node type.
	* @template {UnistParent} [Ancestor=UnistParent]
	*   Ancestor type.
	*/
	/**
	* @typedef {Visitor<Visited, Parent<Ancestor, Visited>>} BuildVisitorFromMatch
	*   Build a typed `Visitor` function from a node and all possible parents.
	*
	*   It will infer which values are passed as `node` and which as `parent`.
	* @template {UnistNode} Visited
	*   Node type.
	* @template {UnistParent} Ancestor
	*   Parent type.
	*/
	/**
	* @typedef {(
	*   BuildVisitorFromMatch<
	*     Matches<Descendant, Check>,
	*     Extract<Descendant, UnistParent>
	*   >
	* )} BuildVisitorFromDescendants
	*   Build a typed `Visitor` function from a list of descendants and a test.
	*
	*   It will infer which values are passed as `node` and which as `parent`.
	* @template {UnistNode} Descendant
	*   Node type.
	* @template {Test} Check
	*   Test type.
	*/
	/**
	* @typedef {(
	*   BuildVisitorFromDescendants<
	*     InclusiveDescendant<Tree>,
	*     Check
	*   >
	* )} BuildVisitor
	*   Build a typed `Visitor` function from a tree and a test.
	*
	*   It will infer which values are passed as `node` and which as `parent`.
	* @template {UnistNode} [Tree=UnistNode]
	*   Node type.
	* @template {Test} [Check=Test]
	*   Test type.
	*/
	/**
	* Visit nodes.
	*
	* This algorithm performs *depth-first* *tree traversal* in *preorder*
	* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
	*
	* You can choose for which nodes `visitor` is called by passing a `test`.
	* For complex tests, you should test yourself in `visitor`, as it will be
	* faster and will have improved type information.
	*
	* Walking the tree is an intensive task.
	* Make use of the return values of the visitor when possible.
	* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
	* to check if a node matches, and then perform different operations.
	*
	* You can change the tree.
	* See `Visitor` for more info.
	*
	* @overload
	* @param {Tree} tree
	* @param {Check} check
	* @param {BuildVisitor<Tree, Check>} visitor
	* @param {boolean | null | undefined} [reverse]
	* @returns {undefined}
	*
	* @overload
	* @param {Tree} tree
	* @param {BuildVisitor<Tree>} visitor
	* @param {boolean | null | undefined} [reverse]
	* @returns {undefined}
	*
	* @param {UnistNode} tree
	*   Tree to traverse.
	* @param {Visitor | Test} testOrVisitor
	*   `unist-util-is`-compatible test (optional, omit to pass a visitor).
	* @param {Visitor | boolean | null | undefined} [visitorOrReverse]
	*   Handle each node (when test is omitted, pass `reverse`).
	* @param {boolean | null | undefined} [maybeReverse=false]
	*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
	* @returns {undefined}
	*   Nothing.
	*
	* @template {UnistNode} Tree
	*   Node type.
	* @template {Test} Check
	*   `unist-util-is`-compatible test.
	*/
	function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
		/** @type {boolean | null | undefined} */
		let reverse;
		/** @type {Test} */
		let test;
		/** @type {Visitor} */
		let visitor;
		if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
			test = void 0;
			visitor = testOrVisitor;
			reverse = visitorOrReverse;
		} else {
			test = testOrVisitor;
			visitor = visitorOrReverse;
			reverse = maybeReverse;
		}
		visitParents(tree, test, overload, reverse);
		/**
		* @param {UnistNode} node
		* @param {Array<UnistParent>} parents
		*/
		function overload(node$1, parents) {
			const parent = parents[parents.length - 1];
			const index = parent ? parent.children.indexOf(node$1) : void 0;
			return visitor(node$1, index, parent);
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-string@4.0.0/node_modules/mdast-util-to-string/lib/index.js
/**
	* @typedef {import('mdast').Nodes} Nodes
	*
	* @typedef Options
	*   Configuration (optional).
	* @property {boolean | null | undefined} [includeImageAlt=true]
	*   Whether to use `alt` for `image`s (default: `true`).
	* @property {boolean | null | undefined} [includeHtml=true]
	*   Whether to use `value` of HTML (default: `true`).
	*/
	/** @type {Options} */
	const emptyOptions$2 = {};
	/**
	* Get the text content of a node or list of nodes.
	*
	* Prefers the node’s plain-text fields, otherwise serializes its children,
	* and if the given value is an array, serialize the nodes in it.
	*
	* @param {unknown} [value]
	*   Thing to serialize, typically `Node`.
	* @param {Options | null | undefined} [options]
	*   Configuration (optional).
	* @returns {string}
	*   Serialized `value`.
	*/
	function toString$2(value, options) {
		const settings = options || emptyOptions$2;
		return one$1(value, typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true, typeof settings.includeHtml === "boolean" ? settings.includeHtml : true);
	}
	/**
	* One node or several nodes.
	*
	* @param {unknown} value
	*   Thing to serialize.
	* @param {boolean} includeImageAlt
	*   Include image `alt`s.
	* @param {boolean} includeHtml
	*   Include HTML.
	* @returns {string}
	*   Serialized node.
	*/
	function one$1(value, includeImageAlt, includeHtml) {
		if (node(value)) {
			if ("value" in value) return value.type === "html" && !includeHtml ? "" : value.value;
			if (includeImageAlt && "alt" in value && value.alt) return value.alt;
			if ("children" in value) return all$1(value.children, includeImageAlt, includeHtml);
		}
		if (Array.isArray(value)) return all$1(value, includeImageAlt, includeHtml);
		return "";
	}
	/**
	* Serialize a list of nodes.
	*
	* @param {Array<unknown>} values
	*   Thing to serialize.
	* @param {boolean} includeImageAlt
	*   Include image `alt`s.
	* @param {boolean} includeHtml
	*   Include HTML.
	* @returns {string}
	*   Serialized nodes.
	*/
	function all$1(values, includeImageAlt, includeHtml) {
		/** @type {Array<string>} */
		const result = [];
		let index = -1;
		while (++index < values.length) result[index] = one$1(values[index], includeImageAlt, includeHtml);
		return result.join("");
	}
	/**
	* Check if `value` looks like a node.
	*
	* @param {unknown} value
	*   Thing.
	* @returns {value is Nodes}
	*   Whether `value` is a node.
	*/
	function node(value) {
		return Boolean(value && typeof value === "object");
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js
/**
	* @import {State} from 'mdast-util-to-markdown'
	* @import {Heading} from 'mdast'
	*/
	/**
	* @param {Heading} node
	* @param {State} state
	* @returns {boolean}
	*/
	function formatHeadingAsSetext(node$1, state) {
		let literalWithBreak = false;
		visit(node$1, function(node$2) {
			if ("value" in node$2 && /\r?\n|\r/.test(node$2.value) || node$2.type === "break") {
				literalWithBreak = true;
				return EXIT;
			}
		});
		return Boolean((!node$1.depth || node$1.depth < 3) && toString$2(node$1) && (state.options.setext || literalWithBreak));
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/heading.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {Heading, Parents} from 'mdast'
	*/
	/**
	* @param {Heading} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function heading$1(node$1, _$1, state, info) {
		const rank = Math.max(Math.min(6, node$1.depth || 1), 1);
		const tracker = state.createTracker(info);
		if (formatHeadingAsSetext(node$1, state)) {
			const exit$1 = state.enter("headingSetext");
			const subexit$1 = state.enter("phrasing");
			const value$1 = state.containerPhrasing(node$1, {
				...tracker.current(),
				before: "\n",
				after: "\n"
			});
			subexit$1();
			exit$1();
			return value$1 + "\n" + (rank === 1 ? "=" : "-").repeat(value$1.length - (Math.max(value$1.lastIndexOf("\r"), value$1.lastIndexOf("\n")) + 1));
		}
		const sequence = "#".repeat(rank);
		const exit = state.enter("headingAtx");
		const subexit = state.enter("phrasing");
		tracker.move(sequence + " ");
		let value = state.containerPhrasing(node$1, {
			before: "# ",
			after: "\n",
			...tracker.current()
		});
		if (/^[\t ]/.test(value)) value = encodeCharacterReference(value.charCodeAt(0)) + value.slice(1);
		value = value ? sequence + " " + value : sequence;
		if (state.options.closeAtx) value += " " + sequence;
		subexit();
		exit();
		return value;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/html.js
/**
	* @import {Html} from 'mdast'
	*/
	html$5.peek = htmlPeek;
	/**
	* @param {Html} node
	* @returns {string}
	*/
	function html$5(node$1) {
		return node$1.value || "";
	}
	/**
	* @returns {string}
	*/
	function htmlPeek() {
		return "<";
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {Image, Parents} from 'mdast'
	*/
	image$1.peek = imagePeek;
	/**
	* @param {Image} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function image$1(node$1, _$1, state, info) {
		const quote = checkQuote(state);
		const suffix = quote === "\"" ? "Quote" : "Apostrophe";
		const exit = state.enter("image");
		let subexit = state.enter("label");
		const tracker = state.createTracker(info);
		let value = tracker.move("![");
		value += tracker.move(state.safe(node$1.alt, {
			before: value,
			after: "]",
			...tracker.current()
		}));
		value += tracker.move("](");
		subexit();
		if (!node$1.url && node$1.title || /[\0- \u007F]/.test(node$1.url)) {
			subexit = state.enter("destinationLiteral");
			value += tracker.move("<");
			value += tracker.move(state.safe(node$1.url, {
				before: value,
				after: ">",
				...tracker.current()
			}));
			value += tracker.move(">");
		} else {
			subexit = state.enter("destinationRaw");
			value += tracker.move(state.safe(node$1.url, {
				before: value,
				after: node$1.title ? " " : ")",
				...tracker.current()
			}));
		}
		subexit();
		if (node$1.title) {
			subexit = state.enter(`title${suffix}`);
			value += tracker.move(" " + quote);
			value += tracker.move(state.safe(node$1.title, {
				before: value,
				after: quote,
				...tracker.current()
			}));
			value += tracker.move(quote);
			subexit();
		}
		value += tracker.move(")");
		exit();
		return value;
	}
	/**
	* @returns {string}
	*/
	function imagePeek() {
		return "!";
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image-reference.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {ImageReference, Parents} from 'mdast'
	*/
	imageReference$1.peek = imageReferencePeek;
	/**
	* @param {ImageReference} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function imageReference$1(node$1, _$1, state, info) {
		const type = node$1.referenceType;
		const exit = state.enter("imageReference");
		let subexit = state.enter("label");
		const tracker = state.createTracker(info);
		let value = tracker.move("![");
		const alt = state.safe(node$1.alt, {
			before: value,
			after: "]",
			...tracker.current()
		});
		value += tracker.move(alt + "][");
		subexit();
		const stack = state.stack;
		state.stack = [];
		subexit = state.enter("reference");
		const reference = state.safe(state.associationId(node$1), {
			before: value,
			after: "]",
			...tracker.current()
		});
		subexit();
		state.stack = stack;
		exit();
		if (type === "full" || !alt || alt !== reference) value += tracker.move(reference + "]");
		else if (type === "shortcut") value = value.slice(0, -1);
		else value += tracker.move("]");
		return value;
	}
	/**
	* @returns {string}
	*/
	function imageReferencePeek() {
		return "!";
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/inline-code.js
/**
	* @import {State} from 'mdast-util-to-markdown'
	* @import {InlineCode, Parents} from 'mdast'
	*/
	inlineCode$1.peek = inlineCodePeek;
	/**
	* @param {InlineCode} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @returns {string}
	*/
	function inlineCode$1(node$1, _$1, state) {
		let value = node$1.value || "";
		let sequence = "`";
		let index = -1;
		while ((/* @__PURE__ */ new RegExp("(^|[^`])" + sequence + "([^`]|$)")).test(value)) sequence += "`";
		if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) value = " " + value + " ";
		while (++index < state.unsafe.length) {
			const pattern = state.unsafe[index];
			const expression = state.compilePattern(pattern);
			/** @type {RegExpExecArray | null} */
			let match;
			if (!pattern.atBreak) continue;
			while (match = expression.exec(value)) {
				let position$1 = match.index;
				if (value.charCodeAt(position$1) === 10 && value.charCodeAt(position$1 - 1) === 13) position$1--;
				value = value.slice(0, position$1) + " " + value.slice(match.index + 1);
			}
		}
		return sequence + value + sequence;
	}
	/**
	* @returns {string}
	*/
	function inlineCodePeek() {
		return "`";
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js
/**
	* @import {State} from 'mdast-util-to-markdown'
	* @import {Link} from 'mdast'
	*/
	/**
	* @param {Link} node
	* @param {State} state
	* @returns {boolean}
	*/
	function formatLinkAsAutolink(node$1, state) {
		const raw$1 = toString$2(node$1);
		return Boolean(!state.options.resourceLink && node$1.url && !node$1.title && node$1.children && node$1.children.length === 1 && node$1.children[0].type === "text" && (raw$1 === node$1.url || "mailto:" + raw$1 === node$1.url) && /^[a-z][a-z+.-]+:/i.test(node$1.url) && !/[\0- <>\u007F]/.test(node$1.url));
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {Link, Parents} from 'mdast'
	* @import {Exit} from '../types.js'
	*/
	link$1.peek = linkPeek;
	/**
	* @param {Link} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function link$1(node$1, _$1, state, info) {
		const quote = checkQuote(state);
		const suffix = quote === "\"" ? "Quote" : "Apostrophe";
		const tracker = state.createTracker(info);
		/** @type {Exit} */
		let exit;
		/** @type {Exit} */
		let subexit;
		if (formatLinkAsAutolink(node$1, state)) {
			const stack = state.stack;
			state.stack = [];
			exit = state.enter("autolink");
			let value$1 = tracker.move("<");
			value$1 += tracker.move(state.containerPhrasing(node$1, {
				before: value$1,
				after: ">",
				...tracker.current()
			}));
			value$1 += tracker.move(">");
			exit();
			state.stack = stack;
			return value$1;
		}
		exit = state.enter("link");
		subexit = state.enter("label");
		let value = tracker.move("[");
		value += tracker.move(state.containerPhrasing(node$1, {
			before: value,
			after: "](",
			...tracker.current()
		}));
		value += tracker.move("](");
		subexit();
		if (!node$1.url && node$1.title || /[\0- \u007F]/.test(node$1.url)) {
			subexit = state.enter("destinationLiteral");
			value += tracker.move("<");
			value += tracker.move(state.safe(node$1.url, {
				before: value,
				after: ">",
				...tracker.current()
			}));
			value += tracker.move(">");
		} else {
			subexit = state.enter("destinationRaw");
			value += tracker.move(state.safe(node$1.url, {
				before: value,
				after: node$1.title ? " " : ")",
				...tracker.current()
			}));
		}
		subexit();
		if (node$1.title) {
			subexit = state.enter(`title${suffix}`);
			value += tracker.move(" " + quote);
			value += tracker.move(state.safe(node$1.title, {
				before: value,
				after: quote,
				...tracker.current()
			}));
			value += tracker.move(quote);
			subexit();
		}
		value += tracker.move(")");
		exit();
		return value;
	}
	/**
	* @param {Link} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @returns {string}
	*/
	function linkPeek(node$1, _$1, state) {
		return formatLinkAsAutolink(node$1, state) ? "<" : "[";
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link-reference.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {LinkReference, Parents} from 'mdast'
	*/
	linkReference$1.peek = linkReferencePeek;
	/**
	* @param {LinkReference} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function linkReference$1(node$1, _$1, state, info) {
		const type = node$1.referenceType;
		const exit = state.enter("linkReference");
		let subexit = state.enter("label");
		const tracker = state.createTracker(info);
		let value = tracker.move("[");
		const text$3 = state.containerPhrasing(node$1, {
			before: value,
			after: "]",
			...tracker.current()
		});
		value += tracker.move(text$3 + "][");
		subexit();
		const stack = state.stack;
		state.stack = [];
		subexit = state.enter("reference");
		const reference = state.safe(state.associationId(node$1), {
			before: value,
			after: "]",
			...tracker.current()
		});
		subexit();
		state.stack = stack;
		exit();
		if (type === "full" || !text$3 || text$3 !== reference) value += tracker.move(reference + "]");
		else if (type === "shortcut") value = value.slice(0, -1);
		else value += tracker.move("]");
		return value;
	}
	/**
	* @returns {string}
	*/
	function linkReferencePeek() {
		return "[";
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['bullet'], null | undefined>}
	*/
	function checkBullet(state) {
		const marker = state.options.bullet || "*";
		if (marker !== "*" && marker !== "+" && marker !== "-") throw new Error("Cannot serialize items with `" + marker + "` for `options.bullet`, expected `*`, `+`, or `-`");
		return marker;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['bullet'], null | undefined>}
	*/
	function checkBulletOther(state) {
		const bullet = checkBullet(state);
		const bulletOther = state.options.bulletOther;
		if (!bulletOther) return bullet === "*" ? "-" : "*";
		if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") throw new Error("Cannot serialize items with `" + bulletOther + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
		if (bulletOther === bullet) throw new Error("Expected `bullet` (`" + bullet + "`) and `bulletOther` (`" + bulletOther + "`) to be different");
		return bulletOther;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['bulletOrdered'], null | undefined>}
	*/
	function checkBulletOrdered(state) {
		const marker = state.options.bulletOrdered || ".";
		if (marker !== "." && marker !== ")") throw new Error("Cannot serialize items with `" + marker + "` for `options.bulletOrdered`, expected `.` or `)`");
		return marker;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['rule'], null | undefined>}
	*/
	function checkRule(state) {
		const marker = state.options.rule || "*";
		if (marker !== "*" && marker !== "-" && marker !== "_") throw new Error("Cannot serialize rules with `" + marker + "` for `options.rule`, expected `*`, `-`, or `_`");
		return marker;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {List, Parents} from 'mdast'
	*/
	/**
	* @param {List} node
	* @param {Parents | undefined} parent
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function list$2(node$1, parent, state, info) {
		const exit = state.enter("list");
		const bulletCurrent = state.bulletCurrent;
		/** @type {string} */
		let bullet = node$1.ordered ? checkBulletOrdered(state) : checkBullet(state);
		/** @type {string} */
		const bulletOther = node$1.ordered ? bullet === "." ? ")" : "." : checkBulletOther(state);
		let useDifferentMarker = parent && state.bulletLastUsed ? bullet === state.bulletLastUsed : false;
		if (!node$1.ordered) {
			const firstListItem = node$1.children ? node$1.children[0] : void 0;
			if ((bullet === "*" || bullet === "-") && firstListItem && (!firstListItem.children || !firstListItem.children[0]) && state.stack[state.stack.length - 1] === "list" && state.stack[state.stack.length - 2] === "listItem" && state.stack[state.stack.length - 3] === "list" && state.stack[state.stack.length - 4] === "listItem" && state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0) useDifferentMarker = true;
			if (checkRule(state) === bullet && firstListItem) {
				let index = -1;
				while (++index < node$1.children.length) {
					const item = node$1.children[index];
					if (item && item.type === "listItem" && item.children && item.children[0] && item.children[0].type === "thematicBreak") {
						useDifferentMarker = true;
						break;
					}
				}
			}
		}
		if (useDifferentMarker) bullet = bulletOther;
		state.bulletCurrent = bullet;
		const value = state.containerFlow(node$1, info);
		state.bulletLastUsed = bullet;
		state.bulletCurrent = bulletCurrent;
		exit();
		return value;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['listItemIndent'], null | undefined>}
	*/
	function checkListItemIndent(state) {
		const style = state.options.listItemIndent || "one";
		if (style !== "tab" && style !== "one" && style !== "mixed") throw new Error("Cannot serialize items with `" + style + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");
		return style;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list-item.js
/**
	* @import {Info, Map, State} from 'mdast-util-to-markdown'
	* @import {ListItem, Parents} from 'mdast'
	*/
	/**
	* @param {ListItem} node
	* @param {Parents | undefined} parent
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function listItem$1(node$1, parent, state, info) {
		const listItemIndent = checkListItemIndent(state);
		let bullet = state.bulletCurrent || checkBullet(state);
		if (parent && parent.type === "list" && parent.ordered) bullet = (typeof parent.start === "number" && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node$1)) + bullet;
		let size = bullet.length + 1;
		if (listItemIndent === "tab" || listItemIndent === "mixed" && (parent && parent.type === "list" && parent.spread || node$1.spread)) size = Math.ceil(size / 4) * 4;
		const tracker = state.createTracker(info);
		tracker.move(bullet + " ".repeat(size - bullet.length));
		tracker.shift(size);
		const exit = state.enter("listItem");
		const value = state.indentLines(state.containerFlow(node$1, tracker.current()), map$3);
		exit();
		return value;
		/** @type {Map} */
		function map$3(line, index, blank) {
			if (index) return (blank ? "" : " ".repeat(size)) + line;
			return (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line;
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/paragraph.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {Paragraph, Parents} from 'mdast'
	*/
	/**
	* @param {Paragraph} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function paragraph$1(node$1, _$1, state, info) {
		const exit = state.enter("paragraph");
		const subexit = state.enter("phrasing");
		const value = state.containerPhrasing(node$1, info);
		subexit();
		exit();
		return value;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-phrasing@4.1.0/node_modules/mdast-util-phrasing/lib/index.js
/**
	* @typedef {import('mdast').Html} Html
	* @typedef {import('mdast').PhrasingContent} PhrasingContent
	*/
	/**
	* Check if the given value is *phrasing content*.
	*
	* > 👉 **Note**: Excludes `html`, which can be both phrasing or flow.
	*
	* @param node
	*   Thing to check, typically `Node`.
	* @returns
	*   Whether `value` is phrasing content.
	*/
	const phrasing = convert([
		"break",
		"delete",
		"emphasis",
		"footnote",
		"footnoteReference",
		"image",
		"imageReference",
		"inlineCode",
		"inlineMath",
		"link",
		"linkReference",
		"mdxJsxTextElement",
		"mdxTextExpression",
		"strong",
		"text",
		"textDirective"
	]);

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/root.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {Parents, Root} from 'mdast'
	*/
	/**
	* @param {Root} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function root$2(node$1, _$1, state, info) {
		return (node$1.children.some(function(d$2) {
			return phrasing(d$2);
		}) ? state.containerPhrasing : state.containerFlow).call(state, node$1, info);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-strong.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['strong'], null | undefined>}
	*/
	function checkStrong(state) {
		const marker = state.options.strong || "*";
		if (marker !== "*" && marker !== "_") throw new Error("Cannot serialize strong with `" + marker + "` for `options.strong`, expected `*`, or `_`");
		return marker;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/strong.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {Parents, Strong} from 'mdast'
	*/
	strong$1.peek = strongPeek;
	/**
	* @param {Strong} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function strong$1(node$1, _$1, state, info) {
		const marker = checkStrong(state);
		const exit = state.enter("strong");
		const tracker = state.createTracker(info);
		const before = tracker.move(marker + marker);
		let between$1 = tracker.move(state.containerPhrasing(node$1, {
			after: marker,
			before,
			...tracker.current()
		}));
		const betweenHead = between$1.charCodeAt(0);
		const open = encodeInfo(info.before.charCodeAt(info.before.length - 1), betweenHead, marker);
		if (open.inside) between$1 = encodeCharacterReference(betweenHead) + between$1.slice(1);
		const betweenTail = between$1.charCodeAt(between$1.length - 1);
		const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);
		if (close.inside) between$1 = between$1.slice(0, -1) + encodeCharacterReference(betweenTail);
		const after = tracker.move(marker + marker);
		exit();
		state.attentionEncodeSurroundingInfo = {
			after: close.outside,
			before: open.outside
		};
		return before + between$1 + after;
	}
	/**
	* @param {Strong} _
	* @param {Parents | undefined} _1
	* @param {State} state
	* @returns {string}
	*/
	function strongPeek(_$1, _1, state) {
		return state.options.strong || "*";
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/text.js
/**
	* @import {Info, State} from 'mdast-util-to-markdown'
	* @import {Parents, Text} from 'mdast'
	*/
	/**
	* @param {Text} node
	* @param {Parents | undefined} _
	* @param {State} state
	* @param {Info} info
	* @returns {string}
	*/
	function text$2(node$1, _$1, state, info) {
		return state.safe(node$1.value, info);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js
/**
	* @import {Options, State} from 'mdast-util-to-markdown'
	*/
	/**
	* @param {State} state
	* @returns {Exclude<Options['ruleRepetition'], null | undefined>}
	*/
	function checkRuleRepetition(state) {
		const repetition = state.options.ruleRepetition || 3;
		if (repetition < 3) throw new Error("Cannot serialize rules with repetition `" + repetition + "` for `options.ruleRepetition`, expected `3` or more");
		return repetition;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js
/**
	* @import {State} from 'mdast-util-to-markdown'
	* @import {Parents, ThematicBreak} from 'mdast'
	*/
	/**
	* @param {ThematicBreak} _
	* @param {Parents | undefined} _1
	* @param {State} state
	* @returns {string}
	*/
	function thematicBreak$1(_$1, _1, state) {
		const value = (checkRule(state) + (state.options.ruleSpaces ? " " : "")).repeat(checkRuleRepetition(state));
		return state.options.ruleSpaces ? value.slice(0, -1) : value;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/index.js
/**
	* Default (CommonMark) handlers.
	*/
	const handle$1 = {
		blockquote: blockquote$1,
		break: hardBreak$1,
		code: code$1,
		definition,
		emphasis: emphasis$1,
		hardBreak: hardBreak$1,
		heading: heading$1,
		html: html$5,
		image: image$1,
		imageReference: imageReference$1,
		inlineCode: inlineCode$1,
		link: link$1,
		linkReference: linkReference$1,
		list: list$2,
		listItem: listItem$1,
		paragraph: paragraph$1,
		root: root$2,
		strong: strong$1,
		text: text$2,
		thematicBreak: thematicBreak$1
	};

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/join.js
/**
	* @import {Join} from 'mdast-util-to-markdown'
	*/
	/** @type {Array<Join>} */
	const join = [joinDefaults];
	/** @type {Join} */
	function joinDefaults(left, right, parent, state) {
		if (right.type === "code" && formatCodeAsIndented(right, state) && (left.type === "list" || left.type === right.type && formatCodeAsIndented(left, state))) return false;
		if ("spread" in parent && typeof parent.spread === "boolean") {
			if (left.type === "paragraph" && (left.type === right.type || right.type === "definition" || right.type === "heading" && formatHeadingAsSetext(right, state))) return;
			return parent.spread ? 1 : 0;
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/unsafe.js
/**
	* @import {ConstructName, Unsafe} from 'mdast-util-to-markdown'
	*/
	/**
	* List of constructs that occur in phrasing (paragraphs, headings), but cannot
	* contain things like attention (emphasis, strong), images, or links.
	* So they sort of cancel each other out.
	* Note: could use a better name.
	*
	* @type {Array<ConstructName>}
	*/
	const fullPhrasingSpans = [
		"autolink",
		"destinationLiteral",
		"destinationRaw",
		"reference",
		"titleQuote",
		"titleApostrophe"
	];
	/** @type {Array<Unsafe>} */
	const unsafe = [
		{
			character: "	",
			after: "[\\r\\n]",
			inConstruct: "phrasing"
		},
		{
			character: "	",
			before: "[\\r\\n]",
			inConstruct: "phrasing"
		},
		{
			character: "	",
			inConstruct: ["codeFencedLangGraveAccent", "codeFencedLangTilde"]
		},
		{
			character: "\r",
			inConstruct: [
				"codeFencedLangGraveAccent",
				"codeFencedLangTilde",
				"codeFencedMetaGraveAccent",
				"codeFencedMetaTilde",
				"destinationLiteral",
				"headingAtx"
			]
		},
		{
			character: "\n",
			inConstruct: [
				"codeFencedLangGraveAccent",
				"codeFencedLangTilde",
				"codeFencedMetaGraveAccent",
				"codeFencedMetaTilde",
				"destinationLiteral",
				"headingAtx"
			]
		},
		{
			character: " ",
			after: "[\\r\\n]",
			inConstruct: "phrasing"
		},
		{
			character: " ",
			before: "[\\r\\n]",
			inConstruct: "phrasing"
		},
		{
			character: " ",
			inConstruct: ["codeFencedLangGraveAccent", "codeFencedLangTilde"]
		},
		{
			character: "!",
			after: "\\[",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			character: "\"",
			inConstruct: "titleQuote"
		},
		{
			atBreak: true,
			character: "#"
		},
		{
			character: "#",
			inConstruct: "headingAtx",
			after: "(?:[\r\n]|$)"
		},
		{
			character: "&",
			after: "[#A-Za-z]",
			inConstruct: "phrasing"
		},
		{
			character: "'",
			inConstruct: "titleApostrophe"
		},
		{
			character: "(",
			inConstruct: "destinationRaw"
		},
		{
			before: "\\]",
			character: "(",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			atBreak: true,
			before: "\\d+",
			character: ")"
		},
		{
			character: ")",
			inConstruct: "destinationRaw"
		},
		{
			atBreak: true,
			character: "*",
			after: "(?:[ 	\r\n*])"
		},
		{
			character: "*",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			atBreak: true,
			character: "+",
			after: "(?:[ 	\r\n])"
		},
		{
			atBreak: true,
			character: "-",
			after: "(?:[ 	\r\n-])"
		},
		{
			atBreak: true,
			before: "\\d+",
			character: ".",
			after: "(?:[ 	\r\n]|$)"
		},
		{
			atBreak: true,
			character: "<",
			after: "[!/?A-Za-z]"
		},
		{
			character: "<",
			after: "[!/?A-Za-z]",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			character: "<",
			inConstruct: "destinationLiteral"
		},
		{
			atBreak: true,
			character: "="
		},
		{
			atBreak: true,
			character: ">"
		},
		{
			character: ">",
			inConstruct: "destinationLiteral"
		},
		{
			atBreak: true,
			character: "["
		},
		{
			character: "[",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			character: "[",
			inConstruct: ["label", "reference"]
		},
		{
			character: "\\",
			after: "[\\r\\n]",
			inConstruct: "phrasing"
		},
		{
			character: "]",
			inConstruct: ["label", "reference"]
		},
		{
			atBreak: true,
			character: "_"
		},
		{
			character: "_",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			atBreak: true,
			character: "`"
		},
		{
			character: "`",
			inConstruct: ["codeFencedLangGraveAccent", "codeFencedMetaGraveAccent"]
		},
		{
			character: "`",
			inConstruct: "phrasing",
			notInConstruct: fullPhrasingSpans
		},
		{
			atBreak: true,
			character: "~"
		}
	];

//#endregion
//#region ../../node_modules/.pnpm/decode-named-character-reference@1.2.0/node_modules/decode-named-character-reference/index.dom.js
	const element$1 = document.createElement("i");
	/**
	* @param {string} value
	* @returns {string | false}
	*/
	function decodeNamedCharacterReference(value) {
		const characterReference = "&" + value + ";";
		element$1.innerHTML = characterReference;
		const character = element$1.textContent;
		if (character.charCodeAt(character.length - 1) === 59 && value !== "semi") return false;
		return character === characterReference ? false : character;
	}

//#endregion
//#region ../../node_modules/.pnpm/micromark-util-decode-numeric-character-reference@2.0.2/node_modules/micromark-util-decode-numeric-character-reference/index.js
/**
	* Turn the number (in string form as either hexa- or plain decimal) coming from
	* a numeric character reference into a character.
	*
	* Sort of like `String.fromCodePoint(Number.parseInt(value, base))`, but makes
	* non-characters and control characters safe.
	*
	* @param {string} value
	*   Value to decode.
	* @param {number} base
	*   Numeric base.
	* @returns {string}
	*   Character.
	*/
	function decodeNumericCharacterReference(value, base) {
		const code$2 = Number.parseInt(value, base);
		if (code$2 < 9 || code$2 === 11 || code$2 > 13 && code$2 < 32 || code$2 > 126 && code$2 < 160 || code$2 > 55295 && code$2 < 57344 || code$2 > 64975 && code$2 < 65008 || (code$2 & 65535) === 65535 || (code$2 & 65535) === 65534 || code$2 > 1114111) return "�";
		return String.fromCodePoint(code$2);
	}

//#endregion
//#region ../../node_modules/.pnpm/micromark-util-decode-string@2.0.1/node_modules/micromark-util-decode-string/index.js
	const characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
	/**
	* Decode markdown strings (which occur in places such as fenced code info
	* strings, destinations, labels, and titles).
	*
	* The “string” content type allows character escapes and -references.
	* This decodes those.
	*
	* @param {string} value
	*   Value to decode.
	* @returns {string}
	*   Decoded value.
	*/
	function decodeString(value) {
		return value.replace(characterEscapeOrReference, decode);
	}
	/**
	* @param {string} $0
	*   Match.
	* @param {string} $1
	*   Character escape.
	* @param {string} $2
	*   Character reference.
	* @returns {string}
	*   Decoded value
	*/
	function decode($0, $1, $2) {
		if ($1) return $1;
		if ($2.charCodeAt(0) === 35) {
			const head$1 = $2.charCodeAt(1);
			const hex = head$1 === 120 || head$1 === 88;
			return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
		}
		return decodeNamedCharacterReference($2) || $0;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/association.js
/**
	* @import {AssociationId} from '../types.js'
	*/
	/**
	* Get an identifier from an association to match it to others.
	*
	* Associations are nodes that match to something else through an ID:
	* <https://github.com/syntax-tree/mdast#association>.
	*
	* The `label` of an association is the string value: character escapes and
	* references work, and casing is intact.
	* The `identifier` is used to match one association to another:
	* controversially, character escapes and references don’t work in this
	* matching: `&copy;` does not match `©`, and `\+` does not match `+`.
	*
	* But casing is ignored (and whitespace) is trimmed and collapsed: ` A\nb`
	* matches `a b`.
	* So, we do prefer the label when figuring out how we’re going to serialize:
	* it has whitespace, casing, and we can ignore most useless character
	* escapes and all character references.
	*
	* @type {AssociationId}
	*/
	function association(node$1) {
		if (node$1.label || !node$1.identifier) return node$1.label || "";
		return decodeString(node$1.identifier);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/compile-pattern.js
/**
	* @import {CompilePattern} from '../types.js'
	*/
	/**
	* @type {CompilePattern}
	*/
	function compilePattern(pattern) {
		if (!pattern._compiled) {
			const before = (pattern.atBreak ? "[\\r\\n][\\t ]*" : "") + (pattern.before ? "(?:" + pattern.before + ")" : "");
			pattern._compiled = new RegExp((before ? "(" + before + ")" : "") + (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? "\\" : "") + pattern.character + (pattern.after ? "(?:" + pattern.after + ")" : ""), "g");
		}
		return pattern._compiled;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/container-phrasing.js
/**
	* @import {Handle, Info, State} from 'mdast-util-to-markdown'
	* @import {PhrasingParents} from '../types.js'
	*/
	/**
	* Serialize the children of a parent that contains phrasing children.
	*
	* These children will be joined flush together.
	*
	* @param {PhrasingParents} parent
	*   Parent of flow nodes.
	* @param {State} state
	*   Info passed around about the current state.
	* @param {Info} info
	*   Info on where we are in the document we are generating.
	* @returns {string}
	*   Serialized children, joined together.
	*/
	function containerPhrasing(parent, state, info) {
		const indexStack = state.indexStack;
		const children = parent.children || [];
		/** @type {Array<string>} */
		const results = [];
		let index = -1;
		let before = info.before;
		/** @type {string | undefined} */
		let encodeAfter;
		indexStack.push(-1);
		let tracker = state.createTracker(info);
		while (++index < children.length) {
			const child = children[index];
			/** @type {string} */
			let after;
			indexStack[indexStack.length - 1] = index;
			if (index + 1 < children.length) {
				/** @type {Handle} */
				let handle$2 = state.handle.handlers[children[index + 1].type];
				/** @type {Handle} */
				if (handle$2 && handle$2.peek) handle$2 = handle$2.peek;
				after = handle$2 ? handle$2(children[index + 1], parent, state, {
					before: "",
					after: "",
					...tracker.current()
				}).charAt(0) : "";
			} else after = info.after;
			if (results.length > 0 && (before === "\r" || before === "\n") && child.type === "html") {
				results[results.length - 1] = results[results.length - 1].replace(/(\r?\n|\r)$/, " ");
				before = " ";
				tracker = state.createTracker(info);
				tracker.move(results.join(""));
			}
			let value = state.handle(child, parent, state, {
				...tracker.current(),
				after,
				before
			});
			if (encodeAfter && encodeAfter === value.slice(0, 1)) value = encodeCharacterReference(encodeAfter.charCodeAt(0)) + value.slice(1);
			const encodingInfo = state.attentionEncodeSurroundingInfo;
			state.attentionEncodeSurroundingInfo = void 0;
			encodeAfter = void 0;
			if (encodingInfo) {
				if (results.length > 0 && encodingInfo.before && before === results[results.length - 1].slice(-1)) results[results.length - 1] = results[results.length - 1].slice(0, -1) + encodeCharacterReference(before.charCodeAt(0));
				if (encodingInfo.after) encodeAfter = after;
			}
			tracker.move(value);
			results.push(value);
			before = value.slice(-1);
		}
		indexStack.pop();
		return results.join("");
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/container-flow.js
/**
	* @import {State} from 'mdast-util-to-markdown'
	* @import {FlowChildren, FlowParents, TrackFields} from '../types.js'
	*/
	/**
	* @param {FlowParents} parent
	*   Parent of flow nodes.
	* @param {State} state
	*   Info passed around about the current state.
	* @param {TrackFields} info
	*   Info on where we are in the document we are generating.
	* @returns {string}
	*   Serialized children, joined by (blank) lines.
	*/
	function containerFlow(parent, state, info) {
		const indexStack = state.indexStack;
		const children = parent.children || [];
		const tracker = state.createTracker(info);
		/** @type {Array<string>} */
		const results = [];
		let index = -1;
		indexStack.push(-1);
		while (++index < children.length) {
			const child = children[index];
			indexStack[indexStack.length - 1] = index;
			results.push(tracker.move(state.handle(child, parent, state, {
				before: "\n",
				after: "\n",
				...tracker.current()
			})));
			if (child.type !== "list") state.bulletLastUsed = void 0;
			if (index < children.length - 1) results.push(tracker.move(between(child, children[index + 1], parent, state)));
		}
		indexStack.pop();
		return results.join("");
	}
	/**
	* @param {FlowChildren} left
	* @param {FlowChildren} right
	* @param {FlowParents} parent
	* @param {State} state
	* @returns {string}
	*/
	function between(left, right, parent, state) {
		let index = state.join.length;
		while (index--) {
			const result = state.join[index](left, right, parent, state);
			if (result === true || result === 1) break;
			if (typeof result === "number") return "\n".repeat(1 + result);
			if (result === false) return "\n\n<!---->\n\n";
		}
		return "\n\n";
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/indent-lines.js
/**
	* @import {IndentLines} from '../types.js'
	*/
	const eol = /\r?\n|\r/g;
	/**
	* @type {IndentLines}
	*/
	function indentLines(value, map$3) {
		/** @type {Array<string>} */
		const result = [];
		let start = 0;
		let line = 0;
		/** @type {RegExpExecArray | null} */
		let match;
		while (match = eol.exec(value)) {
			one$2(value.slice(start, match.index));
			result.push(match[0]);
			start = match.index + match[0].length;
			line++;
		}
		one$2(value.slice(start));
		return result.join("");
		/**
		* @param {string} value
		*/
		function one$2(value$1) {
			result.push(map$3(value$1, line, !value$1));
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/safe.js
/**
	* @import {SafeConfig, State} from 'mdast-util-to-markdown'
	*/
	/**
	* Make a string safe for embedding in markdown constructs.
	*
	* In markdown, almost all punctuation characters can, in certain cases,
	* result in something.
	* Whether they do is highly subjective to where they happen and in what
	* they happen.
	*
	* To solve this, `mdast-util-to-markdown` tracks:
	*
	* * Characters before and after something;
	* * What “constructs” we are in.
	*
	* This information is then used by this function to escape or encode
	* special characters.
	*
	* @param {State} state
	*   Info passed around about the current state.
	* @param {string | null | undefined} input
	*   Raw value to make safe.
	* @param {SafeConfig} config
	*   Configuration.
	* @returns {string}
	*   Serialized markdown safe for embedding.
	*/
	function safe(state, input, config) {
		const value = (config.before || "") + (input || "") + (config.after || "");
		/** @type {Array<number>} */
		const positions = [];
		/** @type {Array<string>} */
		const result = [];
		/** @type {Record<number, {before: boolean, after: boolean}>} */
		const infos = {};
		let index = -1;
		while (++index < state.unsafe.length) {
			const pattern = state.unsafe[index];
			if (!patternInScope(state.stack, pattern)) continue;
			const expression = state.compilePattern(pattern);
			/** @type {RegExpExecArray | null} */
			let match;
			while (match = expression.exec(value)) {
				const before = "before" in pattern || Boolean(pattern.atBreak);
				const after = "after" in pattern;
				const position$1 = match.index + (before ? match[1].length : 0);
				if (positions.includes(position$1)) {
					if (infos[position$1].before && !before) infos[position$1].before = false;
					if (infos[position$1].after && !after) infos[position$1].after = false;
				} else {
					positions.push(position$1);
					infos[position$1] = {
						before,
						after
					};
				}
			}
		}
		positions.sort(numerical);
		let start = config.before ? config.before.length : 0;
		const end = value.length - (config.after ? config.after.length : 0);
		index = -1;
		while (++index < positions.length) {
			const position$1 = positions[index];
			if (position$1 < start || position$1 >= end) continue;
			if (position$1 + 1 < end && positions[index + 1] === position$1 + 1 && infos[position$1].after && !infos[position$1 + 1].before && !infos[position$1 + 1].after || positions[index - 1] === position$1 - 1 && infos[position$1].before && !infos[position$1 - 1].before && !infos[position$1 - 1].after) continue;
			if (start !== position$1) result.push(escapeBackslashes(value.slice(start, position$1), "\\"));
			start = position$1;
			if (/[!-/:-@[-`{-~]/.test(value.charAt(position$1)) && (!config.encode || !config.encode.includes(value.charAt(position$1)))) result.push("\\");
			else {
				result.push(encodeCharacterReference(value.charCodeAt(position$1)));
				start++;
			}
		}
		result.push(escapeBackslashes(value.slice(start, end), config.after));
		return result.join("");
	}
	/**
	* @param {number} a
	* @param {number} b
	* @returns {number}
	*/
	function numerical(a$2, b$1) {
		return a$2 - b$1;
	}
	/**
	* @param {string} value
	* @param {string} after
	* @returns {string}
	*/
	function escapeBackslashes(value, after) {
		const expression = /\\(?=[!-/:-@[-`{-~])/g;
		/** @type {Array<number>} */
		const positions = [];
		/** @type {Array<string>} */
		const results = [];
		const whole = value + after;
		let index = -1;
		let start = 0;
		/** @type {RegExpExecArray | null} */
		let match;
		while (match = expression.exec(whole)) positions.push(match.index);
		while (++index < positions.length) {
			if (start !== positions[index]) results.push(value.slice(start, positions[index]));
			results.push("\\");
			start = positions[index];
		}
		results.push(value.slice(start));
		return results.join("");
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/track.js
/**
	* @import {CreateTracker, TrackCurrent, TrackMove, TrackShift} from '../types.js'
	*/
	/**
	* Track positional info in the output.
	*
	* @type {CreateTracker}
	*/
	function track(config) {
		/* c8 ignore next 5 */
		const options = config || {};
		const now = options.now || {};
		let lineShift = options.lineShift || 0;
		let line = now.line || 1;
		let column = now.column || 1;
		return {
			move,
			current,
			shift
		};
		/**
		* Get the current tracked info.
		*
		* @type {TrackCurrent}
		*/
		function current() {
			return {
				now: {
					line,
					column
				},
				lineShift
			};
		}
		/**
		* Define an increased line shift (the typical indent for lines).
		*
		* @type {TrackShift}
		*/
		function shift(value) {
			lineShift += value;
		}
		/**
		* Move past some generated markdown.
		*
		* @type {TrackMove}
		*/
		function move(input) {
			const value = input || "";
			const chunks = value.split(/\r?\n|\r/g);
			const tail = chunks[chunks.length - 1];
			line += chunks.length - 1;
			column = chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
			return value;
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/index.js
/**
	* @import {Info, Join, Options, SafeConfig, State} from 'mdast-util-to-markdown'
	* @import {Nodes} from 'mdast'
	* @import {Enter, FlowParents, PhrasingParents, TrackFields} from './types.js'
	*/
	/**
	* Turn an mdast syntax tree into markdown.
	*
	* @param {Nodes} tree
	*   Tree to serialize.
	* @param {Options | null | undefined} [options]
	*   Configuration (optional).
	* @returns {string}
	*   Serialized markdown representing `tree`.
	*/
	function toMarkdown(tree, options) {
		const settings = options || {};
		/** @type {State} */
		const state = {
			associationId: association,
			containerPhrasing: containerPhrasingBound,
			containerFlow: containerFlowBound,
			createTracker: track,
			compilePattern,
			enter,
			handlers: { ...handle$1 },
			handle: void 0,
			indentLines,
			indexStack: [],
			join: [...join],
			options: {},
			safe: safeBound,
			stack: [],
			unsafe: [...unsafe]
		};
		configure(state, settings);
		if (state.options.tightDefinitions) state.join.push(joinDefinition);
		state.handle = zwitch("type", {
			invalid: invalid$1,
			unknown: unknown$1,
			handlers: state.handlers
		});
		let result = state.handle(tree, void 0, state, {
			before: "\n",
			after: "\n",
			now: {
				line: 1,
				column: 1
			},
			lineShift: 0
		});
		if (result && result.charCodeAt(result.length - 1) !== 10 && result.charCodeAt(result.length - 1) !== 13) result += "\n";
		return result;
		/** @type {Enter} */
		function enter(name) {
			state.stack.push(name);
			return exit;
			/**
			* @returns {undefined}
			*/
			function exit() {
				state.stack.pop();
			}
		}
	}
	/**
	* @param {unknown} value
	* @returns {never}
	*/
	function invalid$1(value) {
		throw new Error("Cannot handle value `" + value + "`, expected node");
	}
	/**
	* @param {unknown} value
	* @returns {never}
	*/
	function unknown$1(value) {
		const node$1 = value;
		throw new Error("Cannot handle unknown node `" + node$1.type + "`");
	}
	/** @type {Join} */
	function joinDefinition(left, right) {
		if (left.type === "definition" && left.type === right.type) return 0;
	}
	/**
	* Serialize the children of a parent that contains phrasing children.
	*
	* These children will be joined flush together.
	*
	* @this {State}
	*   Info passed around about the current state.
	* @param {PhrasingParents} parent
	*   Parent of flow nodes.
	* @param {Info} info
	*   Info on where we are in the document we are generating.
	* @returns {string}
	*   Serialized children, joined together.
	*/
	function containerPhrasingBound(parent, info) {
		return containerPhrasing(parent, this, info);
	}
	/**
	* Serialize the children of a parent that contains flow children.
	*
	* These children will typically be joined by blank lines.
	* What they are joined by exactly is defined by `Join` functions.
	*
	* @this {State}
	*   Info passed around about the current state.
	* @param {FlowParents} parent
	*   Parent of flow nodes.
	* @param {TrackFields} info
	*   Info on where we are in the document we are generating.
	* @returns {string}
	*   Serialized children, joined by (blank) lines.
	*/
	function containerFlowBound(parent, info) {
		return containerFlow(parent, this, info);
	}
	/**
	* Make a string safe for embedding in markdown constructs.
	*
	* In markdown, almost all punctuation characters can, in certain cases,
	* result in something.
	* Whether they do is highly subjective to where they happen and in what
	* they happen.
	*
	* To solve this, `mdast-util-to-markdown` tracks:
	*
	* * Characters before and after something;
	* * What “constructs” we are in.
	*
	* This information is then used by this function to escape or encode
	* special characters.
	*
	* @this {State}
	*   Info passed around about the current state.
	* @param {string | null | undefined} value
	*   Raw value to make safe.
	* @param {SafeConfig} config
	*   Configuration.
	* @returns {string}
	*   Serialized markdown safe for embedding.
	*/
	function safeBound(value, config) {
		return safe(this, value, config);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-gfm-strikethrough@2.0.0/node_modules/mdast-util-gfm-strikethrough/lib/index.js
/**
	* @typedef {import('mdast').Delete} Delete
	*
	* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
	* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
	* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
	*
	* @typedef {import('mdast-util-to-markdown').ConstructName} ConstructName
	* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
	* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
	*/
	/**
	* List of constructs that occur in phrasing (paragraphs, headings), but cannot
	* contain strikethrough.
	* So they sort of cancel each other out.
	* Note: could use a better name.
	*
	* Note: keep in sync with: <https://github.com/syntax-tree/mdast-util-to-markdown/blob/8ce8dbf/lib/unsafe.js#L14>
	*
	* @type {Array<ConstructName>}
	*/
	const constructsWithoutStrikethrough = [
		"autolink",
		"destinationLiteral",
		"destinationRaw",
		"reference",
		"titleQuote",
		"titleApostrophe"
	];
	handleDelete.peek = peekDelete;
	/**
	* Create an extension for `mdast-util-to-markdown` to enable GFM
	* strikethrough in markdown.
	*
	* @returns {ToMarkdownExtension}
	*   Extension for `mdast-util-to-markdown` to enable GFM strikethrough.
	*/
	function gfmStrikethroughToMarkdown() {
		return {
			unsafe: [{
				character: "~",
				inConstruct: "phrasing",
				notInConstruct: constructsWithoutStrikethrough
			}],
			handlers: { delete: handleDelete }
		};
	}
	/**
	* @type {ToMarkdownHandle}
	* @param {Delete} node
	*/
	function handleDelete(node$1, _$1, state, info) {
		const tracker = state.createTracker(info);
		const exit = state.enter("strikethrough");
		let value = tracker.move("~~");
		value += state.containerPhrasing(node$1, {
			...tracker.current(),
			before: value,
			after: "~"
		});
		value += tracker.move("~~");
		exit();
		return value;
	}
	/** @type {ToMarkdownHandle} */
	function peekDelete() {
		return "~";
	}

//#endregion
//#region ../../node_modules/.pnpm/devlop@1.1.0/node_modules/devlop/lib/default.js
	function ok() {}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-gfm-task-list-item@2.0.0/node_modules/mdast-util-gfm-task-list-item/lib/index.js
/**
	* Create an extension for `mdast-util-to-markdown` to enable GFM task list
	* items in markdown.
	*
	* @returns {ToMarkdownExtension}
	*   Extension for `mdast-util-to-markdown` to enable GFM task list items.
	*/
	function gfmTaskListItemToMarkdown() {
		return {
			unsafe: [{
				atBreak: true,
				character: "-",
				after: "[:|-]"
			}],
			handlers: { listItem: listItemWithTaskListItem }
		};
	}
	/**
	* @type {ToMarkdownHandle}
	* @param {ListItem} node
	*/
	function listItemWithTaskListItem(node$1, parent, state, info) {
		const head$1 = node$1.children[0];
		const checkable = typeof node$1.checked === "boolean" && head$1 && head$1.type === "paragraph";
		const checkbox = "[" + (node$1.checked ? "x" : " ") + "] ";
		const tracker = state.createTracker(info);
		if (checkable) tracker.move(checkbox);
		let value = handle$1.listItem(node$1, parent, state, {
			...info,
			...tracker.current()
		});
		if (checkable) value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
		return value;
		/**
		* @param {string} $0
		* @returns {string}
		*/
		function check($0) {
			return $0 + checkbox;
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/markdown-table@3.0.4/node_modules/markdown-table/index.js
/**
	* @typedef {Options} MarkdownTableOptions
	*   Configuration.
	*/
	/**
	* @typedef Options
	*   Configuration.
	* @property {boolean | null | undefined} [alignDelimiters=true]
	*   Whether to align the delimiters (default: `true`);
	*   they are aligned by default:
	*
	*   ```markdown
	*   | Alpha | B     |
	*   | ----- | ----- |
	*   | C     | Delta |
	*   ```
	*
	*   Pass `false` to make them staggered:
	*
	*   ```markdown
	*   | Alpha | B |
	*   | - | - |
	*   | C | Delta |
	*   ```
	* @property {ReadonlyArray<string | null | undefined> | string | null | undefined} [align]
	*   How to align columns (default: `''`);
	*   one style for all columns or styles for their respective columns;
	*   each style is either `'l'` (left), `'r'` (right), or `'c'` (center);
	*   other values are treated as `''`, which doesn’t place the colon in the
	*   alignment row but does align left;
	*   *only the lowercased first character is used, so `Right` is fine.*
	* @property {boolean | null | undefined} [delimiterEnd=true]
	*   Whether to end each row with the delimiter (default: `true`).
	*
	*   > 👉 **Note**: please don’t use this: it could create fragile structures
	*   > that aren’t understandable to some markdown parsers.
	*
	*   When `true`, there are ending delimiters:
	*
	*   ```markdown
	*   | Alpha | B     |
	*   | ----- | ----- |
	*   | C     | Delta |
	*   ```
	*
	*   When `false`, there are no ending delimiters:
	*
	*   ```markdown
	*   | Alpha | B
	*   | ----- | -----
	*   | C     | Delta
	*   ```
	* @property {boolean | null | undefined} [delimiterStart=true]
	*   Whether to begin each row with the delimiter (default: `true`).
	*
	*   > 👉 **Note**: please don’t use this: it could create fragile structures
	*   > that aren’t understandable to some markdown parsers.
	*
	*   When `true`, there are starting delimiters:
	*
	*   ```markdown
	*   | Alpha | B     |
	*   | ----- | ----- |
	*   | C     | Delta |
	*   ```
	*
	*   When `false`, there are no starting delimiters:
	*
	*   ```markdown
	*   Alpha | B     |
	*   ----- | ----- |
	*   C     | Delta |
	*   ```
	* @property {boolean | null | undefined} [padding=true]
	*   Whether to add a space of padding between delimiters and cells
	*   (default: `true`).
	*
	*   When `true`, there is padding:
	*
	*   ```markdown
	*   | Alpha | B     |
	*   | ----- | ----- |
	*   | C     | Delta |
	*   ```
	*
	*   When `false`, there is no padding:
	*
	*   ```markdown
	*   |Alpha|B    |
	*   |-----|-----|
	*   |C    |Delta|
	*   ```
	* @property {((value: string) => number) | null | undefined} [stringLength]
	*   Function to detect the length of table cell content (optional);
	*   this is used when aligning the delimiters (`|`) between table cells;
	*   full-width characters and emoji mess up delimiter alignment when viewing
	*   the markdown source;
	*   to fix this, you can pass this function,
	*   which receives the cell content and returns its “visible” size;
	*   note that what is and isn’t visible depends on where the text is displayed.
	*
	*   Without such a function, the following:
	*
	*   ```js
	*   markdownTable([
	*     ['Alpha', 'Bravo'],
	*     ['中文', 'Charlie'],
	*     ['👩‍❤️‍👩', 'Delta']
	*   ])
	*   ```
	*
	*   Yields:
	*
	*   ```markdown
	*   | Alpha | Bravo |
	*   | - | - |
	*   | 中文 | Charlie |
	*   | 👩‍❤️‍👩 | Delta |
	*   ```
	*
	*   With [`string-width`](https://github.com/sindresorhus/string-width):
	*
	*   ```js
	*   import stringWidth from 'string-width'
	*
	*   markdownTable(
	*     [
	*       ['Alpha', 'Bravo'],
	*       ['中文', 'Charlie'],
	*       ['👩‍❤️‍👩', 'Delta']
	*     ],
	*     {stringLength: stringWidth}
	*   )
	*   ```
	*
	*   Yields:
	*
	*   ```markdown
	*   | Alpha | Bravo   |
	*   | ----- | ------- |
	*   | 中文  | Charlie |
	*   | 👩‍❤️‍👩    | Delta   |
	*   ```
	*/
	/**
	* @param {string} value
	*   Cell value.
	* @returns {number}
	*   Cell size.
	*/
	function defaultStringLength(value) {
		return value.length;
	}
	/**
	* Generate a markdown
	* ([GFM](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables))
	* table.
	*
	* @param {ReadonlyArray<ReadonlyArray<string | null | undefined>>} table
	*   Table data (matrix of strings).
	* @param {Readonly<Options> | null | undefined} [options]
	*   Configuration (optional).
	* @returns {string}
	*   Result.
	*/
	function markdownTable(table$1, options) {
		const settings = options || {};
		const align = (settings.align || []).concat();
		const stringLength = settings.stringLength || defaultStringLength;
		/** @type {Array<number>} Character codes as symbols for alignment per column. */
		const alignments = [];
		/** @type {Array<Array<string>>} Cells per row. */
		const cellMatrix = [];
		/** @type {Array<Array<number>>} Sizes of each cell per row. */
		const sizeMatrix = [];
		/** @type {Array<number>} */
		const longestCellByColumn = [];
		let mostCellsPerRow = 0;
		let rowIndex = -1;
		while (++rowIndex < table$1.length) {
			/** @type {Array<string>} */
			const row$1 = [];
			/** @type {Array<number>} */
			const sizes$1 = [];
			let columnIndex$1 = -1;
			if (table$1[rowIndex].length > mostCellsPerRow) mostCellsPerRow = table$1[rowIndex].length;
			while (++columnIndex$1 < table$1[rowIndex].length) {
				const cell = serialize$1(table$1[rowIndex][columnIndex$1]);
				if (settings.alignDelimiters !== false) {
					const size = stringLength(cell);
					sizes$1[columnIndex$1] = size;
					if (longestCellByColumn[columnIndex$1] === void 0 || size > longestCellByColumn[columnIndex$1]) longestCellByColumn[columnIndex$1] = size;
				}
				row$1.push(cell);
			}
			cellMatrix[rowIndex] = row$1;
			sizeMatrix[rowIndex] = sizes$1;
		}
		let columnIndex = -1;
		if (typeof align === "object" && "length" in align) while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = toAlignment(align[columnIndex]);
		else {
			const code$2 = toAlignment(align);
			while (++columnIndex < mostCellsPerRow) alignments[columnIndex] = code$2;
		}
		columnIndex = -1;
		/** @type {Array<string>} */
		const row = [];
		/** @type {Array<number>} */
		const sizes = [];
		while (++columnIndex < mostCellsPerRow) {
			const code$2 = alignments[columnIndex];
			let before = "";
			let after = "";
			if (code$2 === 99) {
				before = ":";
				after = ":";
			} else if (code$2 === 108) before = ":";
			else if (code$2 === 114) after = ":";
			let size = settings.alignDelimiters === false ? 1 : Math.max(1, longestCellByColumn[columnIndex] - before.length - after.length);
			const cell = before + "-".repeat(size) + after;
			if (settings.alignDelimiters !== false) {
				size = before.length + size + after.length;
				if (size > longestCellByColumn[columnIndex]) longestCellByColumn[columnIndex] = size;
				sizes[columnIndex] = size;
			}
			row[columnIndex] = cell;
		}
		cellMatrix.splice(1, 0, row);
		sizeMatrix.splice(1, 0, sizes);
		rowIndex = -1;
		/** @type {Array<string>} */
		const lines = [];
		while (++rowIndex < cellMatrix.length) {
			const row$1 = cellMatrix[rowIndex];
			const sizes$1 = sizeMatrix[rowIndex];
			columnIndex = -1;
			/** @type {Array<string>} */
			const line = [];
			while (++columnIndex < mostCellsPerRow) {
				const cell = row$1[columnIndex] || "";
				let before = "";
				let after = "";
				if (settings.alignDelimiters !== false) {
					const size = longestCellByColumn[columnIndex] - (sizes$1[columnIndex] || 0);
					const code$2 = alignments[columnIndex];
					if (code$2 === 114) before = " ".repeat(size);
					else if (code$2 === 99) if (size % 2) {
						before = " ".repeat(size / 2 + .5);
						after = " ".repeat(size / 2 - .5);
					} else {
						before = " ".repeat(size / 2);
						after = before;
					}
					else after = " ".repeat(size);
				}
				if (settings.delimiterStart !== false && !columnIndex) line.push("|");
				if (settings.padding !== false && !(settings.alignDelimiters === false && cell === "") && (settings.delimiterStart !== false || columnIndex)) line.push(" ");
				if (settings.alignDelimiters !== false) line.push(before);
				line.push(cell);
				if (settings.alignDelimiters !== false) line.push(after);
				if (settings.padding !== false) line.push(" ");
				if (settings.delimiterEnd !== false || columnIndex !== mostCellsPerRow - 1) line.push("|");
			}
			lines.push(settings.delimiterEnd === false ? line.join("").replace(/ +$/, "") : line.join(""));
		}
		return lines.join("\n");
	}
	/**
	* @param {string | null | undefined} [value]
	*   Value to serialize.
	* @returns {string}
	*   Result.
	*/
	function serialize$1(value) {
		return value === null || value === void 0 ? "" : String(value);
	}
	/**
	* @param {string | null | undefined} value
	*   Value.
	* @returns {number}
	*   Alignment.
	*/
	function toAlignment(value) {
		const code$2 = typeof value === "string" ? value.codePointAt(0) : 0;
		return code$2 === 67 || code$2 === 99 ? 99 : code$2 === 76 || code$2 === 108 ? 108 : code$2 === 82 || code$2 === 114 ? 114 : 0;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-gfm-table@2.0.0/node_modules/mdast-util-gfm-table/lib/index.js
/**
	* Create an extension for `mdast-util-to-markdown` to enable GFM tables in
	* markdown.
	*
	* @param {Options | null | undefined} [options]
	*   Configuration.
	* @returns {ToMarkdownExtension}
	*   Extension for `mdast-util-to-markdown` to enable GFM tables.
	*/
	function gfmTableToMarkdown(options) {
		const settings = options || {};
		const padding = settings.tableCellPadding;
		const alignDelimiters = settings.tablePipeAlign;
		const stringLength = settings.stringLength;
		const around = padding ? " " : "|";
		return {
			unsafe: [
				{
					character: "\r",
					inConstruct: "tableCell"
				},
				{
					character: "\n",
					inConstruct: "tableCell"
				},
				{
					atBreak: true,
					character: "|",
					after: "[	 :-]"
				},
				{
					character: "|",
					inConstruct: "tableCell"
				},
				{
					atBreak: true,
					character: ":",
					after: "-"
				},
				{
					atBreak: true,
					character: "-",
					after: "[:|-]"
				}
			],
			handlers: {
				inlineCode: inlineCodeWithTable,
				table: handleTable,
				tableCell: handleTableCell,
				tableRow: handleTableRow
			}
		};
		/**
		* @type {ToMarkdownHandle}
		* @param {Table} node
		*/
		function handleTable(node$1, _$1, state, info) {
			return serializeData(handleTableAsData(node$1, state, info), node$1.align);
		}
		/**
		* This function isn’t really used normally, because we handle rows at the
		* table level.
		* But, if someone passes in a table row, this ensures we make somewhat sense.
		*
		* @type {ToMarkdownHandle}
		* @param {TableRow} node
		*/
		function handleTableRow(node$1, _$1, state, info) {
			const value = serializeData([handleTableRowAsData(node$1, state, info)]);
			return value.slice(0, value.indexOf("\n"));
		}
		/**
		* @type {ToMarkdownHandle}
		* @param {TableCell} node
		*/
		function handleTableCell(node$1, _$1, state, info) {
			const exit = state.enter("tableCell");
			const subexit = state.enter("phrasing");
			const value = state.containerPhrasing(node$1, {
				...info,
				before: around,
				after: around
			});
			subexit();
			exit();
			return value;
		}
		/**
		* @param {Array<Array<string>>} matrix
		* @param {Array<string | null | undefined> | null | undefined} [align]
		*/
		function serializeData(matrix, align) {
			return markdownTable(matrix, {
				align,
				alignDelimiters,
				padding,
				stringLength
			});
		}
		/**
		* @param {Table} node
		* @param {State} state
		* @param {Info} info
		*/
		function handleTableAsData(node$1, state, info) {
			const children = node$1.children;
			let index = -1;
			/** @type {Array<Array<string>>} */
			const result = [];
			const subexit = state.enter("table");
			while (++index < children.length) result[index] = handleTableRowAsData(children[index], state, info);
			subexit();
			return result;
		}
		/**
		* @param {TableRow} node
		* @param {State} state
		* @param {Info} info
		*/
		function handleTableRowAsData(node$1, state, info) {
			const children = node$1.children;
			let index = -1;
			/** @type {Array<string>} */
			const result = [];
			const subexit = state.enter("tableRow");
			while (++index < children.length) result[index] = handleTableCell(children[index], node$1, state, info);
			subexit();
			return result;
		}
		/**
		* @type {ToMarkdownHandle}
		* @param {InlineCode} node
		*/
		function inlineCodeWithTable(node$1, parent, state) {
			let value = handle$1.inlineCode(node$1, parent, state);
			if (state.stack.includes("tableCell")) value = value.replace(/\|/g, "\\$&");
			return value;
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-math@3.0.0/node_modules/mdast-util-math/lib/index.js
/**
	* Create an extension for `mdast-util-to-markdown`.
	*
	* @param {ToOptions | null | undefined} [options]
	*   Configuration (optional).
	* @returns {ToMarkdownExtension}
	*   Extension for `mdast-util-to-markdown`.
	*/
	function mathToMarkdown(options) {
		let single = (options || {}).singleDollarTextMath;
		if (single === null || single === void 0) single = true;
		inlineMath.peek = inlineMathPeek;
		return {
			unsafe: [
				{
					character: "\r",
					inConstruct: "mathFlowMeta"
				},
				{
					character: "\n",
					inConstruct: "mathFlowMeta"
				},
				{
					character: "$",
					after: single ? void 0 : "\\$",
					inConstruct: "phrasing"
				},
				{
					character: "$",
					inConstruct: "mathFlowMeta"
				},
				{
					atBreak: true,
					character: "$",
					after: "\\$"
				}
			],
			handlers: {
				math,
				inlineMath
			}
		};
		/**
		* @type {ToMarkdownHandle}
		* @param {Math} node
		*/
		function math(node$1, _$1, state, info) {
			const raw$1 = node$1.value || "";
			const tracker = state.createTracker(info);
			const sequence = "$".repeat(Math.max(longestStreak(raw$1, "$") + 1, 2));
			const exit = state.enter("mathFlow");
			let value = tracker.move(sequence);
			if (node$1.meta) {
				const subexit = state.enter("mathFlowMeta");
				value += tracker.move(state.safe(node$1.meta, {
					after: "\n",
					before: value,
					encode: ["$"],
					...tracker.current()
				}));
				subexit();
			}
			value += tracker.move("\n");
			if (raw$1) value += tracker.move(raw$1 + "\n");
			value += tracker.move(sequence);
			exit();
			return value;
		}
		/**
		* @type {ToMarkdownHandle}
		* @param {InlineMath} node
		*/
		function inlineMath(node$1, _$1, state) {
			let value = node$1.value || "";
			let size = 1;
			if (!single) size++;
			while ((/* @__PURE__ */ new RegExp("(^|[^$])" + "\\$".repeat(size) + "([^$]|$)")).test(value)) size++;
			const sequence = "$".repeat(size);
			if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^\$|\$$/.test(value))) value = " " + value + " ";
			let index = -1;
			while (++index < state.unsafe.length) {
				const pattern = state.unsafe[index];
				if (!pattern.atBreak) continue;
				const expression = state.compilePattern(pattern);
				/** @type {RegExpExecArray | null} */
				let match;
				while (match = expression.exec(value)) {
					let position$1 = match.index;
					if (value.codePointAt(position$1) === 10 && value.codePointAt(position$1 - 1) === 13) position$1--;
					value = value.slice(0, position$1) + " " + value.slice(match.index + 1);
				}
			}
			return sequence + value + sequence;
		}
		/**
		* @returns {string}
		*/
		function inlineMathPeek() {
			return "$";
		}
	}

//#endregion
//#region ../../packages/lark/src/utils/mdast.ts
	const isParent = (node$1) => "children" in node$1 && Array.isArray(node$1.children);
	const isRootContent = (node$1) => !isRoot(node$1);
	const isBlockContent = (node$1) => node$1.type === "blockquote" || node$1.type === "code" || node$1.type === "heading" || node$1.type === "html" || node$1.type === "list" || node$1.type === "paragraph" || node$1.type === "table" || node$1.type === "thematicBreak";
	const isDefinitionContent = (node$1) => node$1.type === "definition" || node$1.type === "footnoteDefinition";
	const isBlockquoteContent = (node$1) => isBlockContent(node$1) || isDefinitionContent(node$1);
	const isListItemContent = isBlockquoteContent;
	const isPhrasingContent = (node$1) => node$1.type === "break" || node$1.type === "delete" || node$1.type === "emphasis" || node$1.type === "footnoteReference" || node$1.type === "html" || node$1.type === "image" || node$1.type === "imageReference" || node$1.type === "inlineCode" || node$1.type === "link" || node$1.type === "linkReference" || node$1.type === "strong" || node$1.type === "text";
	const isRoot = (node$1) => node$1.type === "root";
	const isTableCell = (node$1) => node$1.type === "tableCell";

//#endregion
//#region ../../packages/lark/src/file.ts
	const BASE_PATHNAME = "/api/box/stream/download/all/";
	/**
	* @description Resolve file download link.
	*/
	const resolveFileDownloadUrl = ({ token, recordId }) => {
		const pathname = `/space${BASE_PATHNAME}${token}`;
		const hostname = window.globalConfig?.drive_api?.[0];
		if (!hostname) throw new Error("Failed to resolve file download url");
		const url = new URL("https://" + hostname + pathname);
		url.searchParams.set("mount_node_token", recordId);
		url.searchParams.set("mount_point", "docx_file");
		url.searchParams.set("synced_block_host_token", window.location.pathname.split("/").at(-1) ?? "");
		url.searchParams.set("synced_block_host_type", "22");
		return url.toString();
	};

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/compat/predicate/isString.mjs
	function isString(value) {
		return typeof value === "string" || value instanceof String;
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/compat/predicate/isArray.mjs
	function isArray(value) {
		return Array.isArray(value);
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/compat/util/toString.mjs
	function toString$1(value) {
		if (value == null) return "";
		if (typeof value === "string") return value;
		if (Array.isArray(value)) return value.map(toString$1).join(",");
		const result = String(value);
		if (result === "0" && Object.is(Number(value), -0)) return "-0";
		return result;
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/predicate/isPlainObject.mjs
	function isPlainObject(value) {
		if (!value || typeof value !== "object") return false;
		const proto = Object.getPrototypeOf(value);
		if (!(proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null)) return false;
		return Object.prototype.toString.call(value) === "[object Object]";
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/compat/predicate/isPlainObject.mjs
	function isPlainObject$1(object) {
		if (typeof object !== "object") return false;
		if (object == null) return false;
		if (Object.getPrototypeOf(object) === null) return true;
		if (Object.prototype.toString.call(object) !== "[object Object]") {
			const tag = object[Symbol.toStringTag];
			if (tag == null) return false;
			if (!Object.getOwnPropertyDescriptor(object, Symbol.toStringTag)?.writable) return false;
			return object.toString() === `[object ${tag}]`;
		}
		let proto = object;
		while (Object.getPrototypeOf(proto) !== null) proto = Object.getPrototypeOf(proto);
		return Object.getPrototypeOf(object) === proto;
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/compat/object/defaultsDeep.mjs
	function defaultsDeep(target, ...sources) {
		target = Object(target);
		for (let i$1 = 0; i$1 < sources.length; i$1++) {
			const source = sources[i$1];
			if (source != null) defaultsDeepRecursive(target, source, /* @__PURE__ */ new WeakMap());
		}
		return target;
	}
	function defaultsDeepRecursive(target, source, stack) {
		for (const key$1 in source) {
			const sourceValue = source[key$1];
			const targetValue = target[key$1];
			if (targetValue === void 0 || !Object.hasOwn(target, key$1)) {
				target[key$1] = handleMissingProperty(sourceValue, stack);
				continue;
			}
			if (stack.get(sourceValue) === targetValue) continue;
			handleExistingProperty(targetValue, sourceValue, stack);
		}
	}
	function handleMissingProperty(sourceValue, stack) {
		if (stack.has(sourceValue)) return stack.get(sourceValue);
		if (isPlainObject$1(sourceValue)) {
			const newObj = {};
			stack.set(sourceValue, newObj);
			defaultsDeepRecursive(newObj, sourceValue, stack);
			return newObj;
		}
		return sourceValue;
	}
	function handleExistingProperty(targetValue, sourceValue, stack) {
		if (isPlainObject$1(targetValue) && isPlainObject$1(sourceValue)) {
			stack.set(sourceValue, targetValue);
			defaultsDeepRecursive(targetValue, sourceValue, stack);
			return;
		}
		if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
			stack.set(sourceValue, targetValue);
			mergeArrays(targetValue, sourceValue, stack);
		}
	}
	function mergeArrays(targetArray, sourceArray, stack) {
		const minLength = Math.min(sourceArray.length, targetArray.length);
		for (let i$1 = 0; i$1 < minLength; i$1++) if (isPlainObject$1(targetArray[i$1]) && isPlainObject$1(sourceArray[i$1])) defaultsDeepRecursive(targetArray[i$1], sourceArray[i$1], stack);
		for (let i$1 = minLength; i$1 < sourceArray.length; i$1++) targetArray.push(sourceArray[i$1]);
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/capitalize.mjs
	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/words.mjs
	const CASE_SPLIT_PATTERN = /\p{Lu}?\p{Ll}+|[0-9]+|\p{Lu}+(?!\p{Ll})|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{L}+/gu;
	function words(str) {
		return Array.from(str.match(CASE_SPLIT_PATTERN) ?? []);
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/camelCase.mjs
	function camelCase(str) {
		const words$1 = words(str);
		if (words$1.length === 0) return "";
		const [first, ...rest] = words$1;
		return `${first.toLowerCase()}${rest.map((word) => capitalize(word)).join("")}`;
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/escape.mjs
	const htmlEscapes = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	};
	function escape$1(str) {
		return str.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/compat/string/escape.mjs
	function escape(string) {
		return escape$1(toString$1(string));
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/object/pick.mjs
	function pick(obj, keys$1) {
		const result = {};
		for (let i$1 = 0; i$1 < keys$1.length; i$1++) {
			const key$1 = keys$1[i$1];
			if (Object.hasOwn(obj, key$1)) result[key$1] = obj[key$1];
		}
		return result;
	}

//#endregion
//#region ../../node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/object/toCamelCaseKeys.mjs
	function toCamelCaseKeys(obj) {
		if (isArray(obj)) return obj.map((item) => toCamelCaseKeys(item));
		if (isPlainObject(obj)) {
			const result = {};
			const keys$1 = Object.keys(obj);
			for (let i$1 = 0; i$1 < keys$1.length; i$1++) {
				const key$1 = keys$1[i$1];
				const camelKey = camelCase(key$1);
				result[camelKey] = toCamelCaseKeys(obj[key$1]);
			}
			return result;
		}
		return obj;
	}

//#endregion
//#region ../../packages/lark/src/docx.ts
/**
	* @see https://open.feishu.cn/document/client-docs/docs-add-on/06-data-structure/BlockType
	*/
	let BlockType = /* @__PURE__ */ function(BlockType$1) {
		BlockType$1["PAGE"] = "page";
		BlockType$1["BITABLE"] = "bitable";
		BlockType$1["CALLOUT"] = "callout";
		BlockType$1["CHAT_CARD"] = "chat_card";
		BlockType$1["CODE"] = "code";
		BlockType$1["DIAGRAM"] = "diagram";
		BlockType$1["DIVIDER"] = "divider";
		BlockType$1["FILE"] = "file";
		BlockType$1["GRID"] = "grid";
		BlockType$1["GRID_COLUMN"] = "grid_column";
		BlockType$1["HEADING1"] = "heading1";
		BlockType$1["HEADING2"] = "heading2";
		BlockType$1["HEADING3"] = "heading3";
		BlockType$1["HEADING4"] = "heading4";
		BlockType$1["HEADING5"] = "heading5";
		BlockType$1["HEADING6"] = "heading6";
		BlockType$1["HEADING7"] = "heading7";
		BlockType$1["HEADING8"] = "heading8";
		BlockType$1["HEADING9"] = "heading9";
		BlockType$1["IFRAME"] = "iframe";
		BlockType$1["IMAGE"] = "image";
		BlockType$1["ISV"] = "isv";
		BlockType$1["MINDNOTE"] = "mindnote";
		BlockType$1["BULLET"] = "bullet";
		BlockType$1["ORDERED"] = "ordered";
		BlockType$1["TODO"] = "todo";
		BlockType$1["QUOTE"] = "quote";
		BlockType$1["QUOTE_CONTAINER"] = "quote_container";
		BlockType$1["SHEET"] = "sheet";
		BlockType$1["TABLE"] = "table";
		BlockType$1["CELL"] = "table_cell";
		BlockType$1["TEXT"] = "text";
		BlockType$1["VIEW"] = "view";
		BlockType$1["SYNCED_SOURCE"] = "synced_source";
		BlockType$1["SYNCED_REFERENCE"] = "synced_reference";
		BlockType$1["WHITEBOARD"] = "whiteboard";
		BlockType$1["FALLBACK"] = "fallback";
		return BlockType$1;
	}({});
	var ISVBlockTypeId = /* @__PURE__ */ function(ISVBlockTypeId$1) {
		/**
		* Text Drawing
		*/
		ISVBlockTypeId$1["TextDrawing"] = "blk_631fefbbae02400430b8f9f4";
		/**
		* Timeline
		*/
		ISVBlockTypeId$1["Timeline"] = "blk_6358a421bca0001c22536e4c";
		/**
		* Other ISV block (type inference)
		*/
		ISVBlockTypeId$1["_Other"] = "";
		return ISVBlockTypeId$1;
	}(ISVBlockTypeId || {});
	const iframeToHTML = (iframe) => {
		const { height = 4 * OneHundred, component = {} } = iframe.snapshot.iframe;
		const { url } = component;
		if (!url) return null;
		return {
			type: "html",
			value: `<iframe src="${url}" sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-downloads" allowfullscreen allow="encrypted-media; fullscreen; autoplay" referrerpolicy="strict-origin-when-cross-origin" frameborder="0" style="width: 100%; min-height: ${height.toFixed()}px; border-radius: 8px;"></iframe>`
		};
	};
	/**
	* @description Removes an enter from the end of this string if it exists.
	*/
	const trimEndEnter = (input) => input.length > 0 && input.endsWith("\n") ? input.slice(0, -1) : input;
	const chunkBy = (items, isEqual) => {
		const chunks = [];
		let index = 0;
		while (index < items.length) {
			let nextIndex = index + 1;
			while (nextIndex < items.length && isEqual(items[index], items[nextIndex])) nextIndex++;
			chunks.push(items.slice(index, nextIndex));
			index = nextIndex;
		}
		return chunks;
	};
	const mergeListItems = (nodes) => chunkBy(nodes, (current, next) => {
		const listItemType = (listItem$2) => {
			if (typeof listItem$2.checked === "boolean") return BlockType.TODO;
			if (typeof listItem$2.data?.seq === "number" || listItem$2.data?.seq === "auto") return BlockType.ORDERED;
			return BlockType.BULLET;
		};
		const isEqualOrderedListItem = (node$1, other) => {
			const seq = node$1.data?.seq;
			const otherSeq = other.data?.seq;
			if (!seq || !otherSeq) return false;
			if (seq === "auto") return otherSeq === "auto";
			return otherSeq === "auto" || seq + 1 === otherSeq;
		};
		const isEqualListItem = (node$1, other) => {
			const type = listItemType(node$1);
			if (type === listItemType(other)) return type === BlockType.ORDERED ? isEqualOrderedListItem(node$1, other) : true;
			return false;
		};
		return current.type === "listItem" && next.type === "listItem" && isEqualListItem(current, next);
	}).map((nodes$1) => {
		const node$1 = nodes$1[0];
		if (node$1.type === "listItem") return {
			type: "list",
			...typeof node$1.data?.seq === "number" ? {
				ordered: true,
				start: node$1.data.seq
			} : null,
			children: nodes$1
		};
		return node$1;
	});
	const mergePhrasingContents = (nodes) => chunkBy(nodes, (current, next) => {
		if (current.type === "link" && next.type === "link") return current.url === next.url;
		if (current.type === "emphasis" || current.type === "strong" || current.type === "delete" || current.type === "text" || current.type === "inlineCode" && !current.data?.mentionUserId) return current.type === next.type;
		return false;
	}).map((nodes$1) => {
		const node$1 = nodes$1.reduce((pre, cur) => {
			if ("children" in pre && "children" in cur) return {
				...pre,
				...cur,
				children: pre.children.concat(cur.children)
			};
			if ("value" in pre && "value" in cur) return {
				...pre,
				...cur,
				value: pre.value.concat(cur.value)
			};
			return pre;
		});
		if ("children" in node$1) node$1.children = mergePhrasingContents(node$1.children);
		return node$1;
	}).flatMap((current, index, merged) => {
		const next = merged.at(index + 1);
		return next && current.type === next.type ? [current, {
			type: "text",
			value: " "
		}] : [current];
	});
	const transformOperationsToPhrasingContents = (ops, options = {}) => {
		const mentionUsers = [];
		const operations = ops.filter((operation) => {
			if (isDefined(operation.attributes) && isDefined(operation.attributes.fixEnter)) return false;
			if (!isDefined(operation.attributes) && operation.insert === "\n") return false;
			return true;
		}).map((op) => {
			if (isDefined(op.attributes) && op.attributes["inline-component"]) try {
				const inlineComponent = JSON.parse(op.attributes["inline-component"]);
				if (inlineComponent.type === "mention_doc") return {
					attributes: {
						...op.attributes,
						link: inlineComponent.data.raw_url
					},
					insert: op.insert + inlineComponent.data.title
				};
				else if (inlineComponent.type === "user") return {
					attributes: {
						...op.attributes,
						mentionUserId: inlineComponent.data.uid
					},
					insert: ""
				};
				return op;
			} catch {
				return op;
			}
			return op;
		});
		let indexToMarks = operations.map(({ attributes = {} }) => {
			const isSupportAttr = (attr) => attr === "italic" || attr === "bold" || attr === "strikethrough" || attr === "link";
			const attrNameToNodeType = (attr) => {
				switch (attr) {
					case "italic": return "emphasis";
					case "bold": return "strong";
					case "strikethrough": return "delete";
					case "link": return "link";
					default: return;
				}
			};
			return Object.keys(attributes).filter(isSupportAttr).map(attrNameToNodeType);
		});
		indexToMarks = indexToMarks.map((marks, index) => {
			const markToPriority = new Map(marks.map((mark$1) => [mark$1, 0]));
			marks.forEach((mark$1) => {
				let priority = 0;
				let start = index;
				while (start >= 0 && indexToMarks[start].includes(mark$1)) {
					priority += operations[start].insert.length;
					start--;
				}
				let end = index + 1;
				while (end < indexToMarks.length && indexToMarks[end].includes(mark$1)) {
					priority += operations[end].insert.length;
					end++;
				}
				markToPriority.set(mark$1, priority);
			});
			return marks.sort((a$2, b$1) => compare(markToPriority.get(a$2) ?? 0, markToPriority.get(b$1) ?? 0));
		});
		const createLiteral = (op) => {
			const { attributes, insert } = op;
			const { inlineCode: inlineCode$2, equation, textHighlight, textHighlightBackground, mentionUserId, underline } = attributes ?? {};
			if (mentionUserId) {
				const mentionUser = {
					type: "inlineCode",
					value: insert,
					data: { mentionUserId }
				};
				mentionUsers.push(mentionUser);
				return mentionUser;
			}
			if (inlineCode$2) return {
				type: "inlineCode",
				value: insert
			};
			if (equation && equation.length > 0) return {
				type: "inlineMath",
				value: trimEndEnter(equation)
			};
			if (options.highlight && (textHighlight || textHighlightBackground)) {
				const highlighted = `<span style="color: ${textHighlight ?? "inherit"}; background-color: ${textHighlightBackground ?? "inherit"}">${escape(insert)}</span>`;
				return {
					type: "html",
					value: underline ? `<u>${highlighted}</u>` : highlighted
				};
			}
			if (underline) return {
				type: "html",
				value: `<u>${escape(insert)}</u>`
			};
			return {
				type: "text",
				value: insert
			};
		};
		return {
			contents: mergePhrasingContents(indexToMarks.map((marks, index) => {
				const op = operations[index];
				let node$1 = createLiteral(op);
				for (const mark$1 of marks) node$1 = mark$1 === "link" ? {
					type: mark$1,
					url: decodeURIComponent(op.attributes?.link ?? ""),
					children: [node$1]
				} : {
					type: mark$1,
					children: [node$1]
				};
				return node$1;
			})),
			mentionUsers
		};
	};
	const fetchImageSources = (imageBlock) => new Promise((resolve, reject) => {
		const { imageManager, snapshot: { image: { token } } } = imageBlock;
		imageManager.fetch({
			token,
			isHD: true,
			fuzzy: false
		}, {}, resolve).catch(reject);
	});
	/**
	* @description Whether the whiteboard's scene has finished loading and can be
	* captured. Merely having `whiteboardBlock` defined is not enough: when the
	* block is captured before its nodes are laid out, `getNodesBounds()` returns a
	* degenerate box, producing a blank image with abnormal dimensions.
	*/
	const isWhiteboardContentReady = (whiteboard) => {
		const block = whiteboard.whiteboardBlock;
		if (!block) return false;
		const ratioApp = block.abilityKit.getRatioApp();
		if (ratioApp.app) {
			const { minX, maxX, minY, maxY } = ratioApp.app.application.nodeManager.getNodesBounds();
			if (maxX - minX > 0 && maxY - minY > 0) return true;
		}
		return block.isolateEnv.hasRatioApp() && block.isolateEnv.getRatioApp().ratioAppProxy !== void 0;
	};
	/**
	* @description Capture via the new `abilityKit` app path. Returns `null` when it
	* cannot produce a valid image (no app, empty scene bounds, or no canvas) so the
	* caller can fall back to the isolateEnv path.
	*/
	const whiteboardAppToBlob = async (block, { padding, ratio, backgroundColor }) => {
		const ratioApp = block.abilityKit.getRatioApp();
		if (!ratioApp.app) return null;
		const bounds = ratioApp.app.application.nodeManager.getNodesBounds();
		if (bounds.maxX - bounds.minX <= 0 || bounds.maxY - bounds.minY <= 0) return null;
		bounds.maxX += padding;
		bounds.minX -= padding;
		bounds.maxY += padding;
		bounds.minY -= padding;
		const canvas = ratioApp.app.renderManager.getImageOffscreenCanvas(bounds, ratio, backgroundColor);
		if (!canvas) return null;
		return await new Promise((resolve) => {
			checkCanvasDimensions(canvas);
			canvas.toBlob(resolve);
		});
	};
	/**
	* @description Capture via the legacy `isolateEnv` path. Used as a fallback when
	* the app path is unavailable or its scene bounds are still empty.
	*/
	const whiteboardIsolateEnvToBlob = async (block, { padding, ratio }) => {
		const imageDataWrapper = await block.isolateEnv.getRatioApp().ratioAppProxy?.getOriginImageDataByNodeId(padding, [""], false, ratio);
		if (!imageDataWrapper) return null;
		return await imageDataToBlob(imageDataWrapper.data, { onDispose: imageDataWrapper.release });
	};
	const whiteboardToBlob = async (whiteboard) => {
		const block = whiteboard.whiteboardBlock;
		if (!block) return null;
		const options = {
			padding: 24,
			ratio: window.devicePixelRatio,
			backgroundColor: "#ffffff"
		};
		return await whiteboardAppToBlob(block, options) ?? await whiteboardIsolateEnvToBlob(block, options);
	};
	const diagramToSVGElement = (diagram) => {
		if (!diagram.blockManager) return null;
		const blockView = diagram.blockManager.getBlockViewByBlockId(diagram.id);
		if (!blockView) return null;
		const svgElement = blockView.getSvg();
		if (!svgElement) return null;
		return svgElement;
	};
	const generateMermaidTimeline = (items) => {
		let chart = "timeline\n";
		items.forEach((item) => {
			const cleanTitle = (item.title || "").replace(/:/g, "：");
			const time = item.time || "";
			if (item.text) {
				const cleanText = item.text.replace(/\n/g, "<br>");
				chart += `    ${time} : ${cleanTitle} : ${cleanText}\n`;
			} else chart += `    ${time} : ${cleanTitle}\n`;
		});
		return chart;
	};
	const evaluateAlt = (caption) => trimEndEnter(caption?.text.initialAttributedTexts.text?.[0] ?? "");
	var Transformer = class {
		parent = null;
		images = [];
		mentionUsers = [];
		tableWithParents = [];
		/**
		* Resource link to file.
		*/
		files = [];
		/**
		* heading sequence state
		*/
		sequences = [];
		constructor(options = {
			whiteboard: false,
			diagram: false,
			file: false,
			highlight: false,
			flatGrid: false
		}) {
			this.options = options;
		}
		normalizeImage(image$2) {
			return this.parent?.type === "tableCell" ? image$2 : {
				type: "paragraph",
				children: [image$2]
			};
		}
		transformParentBlock(block, evaluateNode, transformChildren) {
			const previousParent = this.parent;
			const currentParent = evaluateNode(block);
			if (!currentParent || !isParent(currentParent)) return currentParent;
			this.parent = currentParent;
			const flatChildren = (children) => children.map((child) => {
				if (child.type === BlockType.GRID && this.options.flatGrid) return flatChildren(child.children.map((column) => column.children).flat(1));
				if (child.type === BlockType.HEADING1 || child.type === BlockType.HEADING2 || child.type === BlockType.HEADING3 || child.type === BlockType.HEADING4 || child.type === BlockType.HEADING5 || child.type === BlockType.HEADING6 || child.type === BlockType.HEADING7 || child.type === BlockType.HEADING8 || child.type === BlockType.HEADING9 || child.type === BlockType.TEXT) return [child, ...flatChildren(child.children)];
				if (child.type === BlockType.SYNCED_SOURCE) return flatChildren(child.children);
				if (child.type === BlockType.SYNCED_REFERENCE) return flatChildren(child.innerBlockManager?.rootBlockModel?.children ?? child.children);
				return child;
			}).flat(1);
			currentParent.children = transformChildren(flatChildren(block.children).map(this._transform).filter(isDefined));
			this.parent = previousParent;
			return currentParent;
		}
		_transform = (block) => {
			const createChildrenFromOps = () => {
				const { contents, mentionUsers } = transformOperationsToPhrasingContents(block.zoneState?.content.ops ?? [], { highlight: this.options.highlight });
				mentionUsers.forEach((user) => {
					if (user.data) user.data.parentBlockRecordId = block.record?.id;
				});
				this.mentionUsers = this.mentionUsers.concat(mentionUsers);
				return contents;
			};
			switch (block.type) {
				case BlockType.PAGE: return this.transformParentBlock(block, () => ({
					type: "root",
					children: []
				}), (nodes) => mergeListItems(nodes).filter(isRootContent));
				case BlockType.DIVIDER: return { type: "thematicBreak" };
				case BlockType.HEADING1:
				case BlockType.HEADING2:
				case BlockType.HEADING3:
				case BlockType.HEADING4:
				case BlockType.HEADING5:
				case BlockType.HEADING6: {
					const depth = Number(block.type.at(-1));
					const heading$2 = {
						type: "heading",
						depth,
						children: createChildrenFromOps()
					};
					if (typeof block.snapshot.seq === "string") {
						this.sequences = this.sequences.slice(0, depth);
						if (block.snapshot.seq === "auto") {
							const previousSequenceSibling = this.sequences[depth - 1] ?? "0";
							this.sequences[depth - 1] = String(parseInt(previousSequenceSibling, 10) + 1);
						} else this.sequences[depth - 1] = block.snapshot.seq;
						const sequences = block.snapshot.seq_level === "auto" ? this.sequences.slice(0, depth).filter(isString) : [block.snapshot.seq];
						heading$2.children.unshift({
							type: "text",
							value: sequences.join(".") + (sequences.length === 1 ? ". " : " ")
						});
					}
					return heading$2;
				}
				case BlockType.CODE: return {
					type: "code",
					lang: block.language.toLocaleLowerCase(),
					value: trimEndEnter(block.zoneState?.allText ?? "")
				};
				case BlockType.QUOTE_CONTAINER:
				case BlockType.CALLOUT: return this.transformParentBlock(block, () => ({
					type: "blockquote",
					children: []
				}), (nodes) => mergeListItems(nodes).filter(isBlockquoteContent));
				case BlockType.BULLET:
				case BlockType.ORDERED:
				case BlockType.TODO: {
					const paragraph$2 = {
						type: "paragraph",
						children: createChildrenFromOps()
					};
					return this.transformParentBlock(block, () => ({
						type: "listItem",
						children: [],
						...block.type === BlockType.TODO ? { checked: Boolean(block.snapshot.done) } : null,
						...block.type === BlockType.ORDERED ? { data: { seq: /[0-9]+/.test(block.snapshot.seq) ? Number(block.snapshot.seq) : "auto" } } : null
					}), (nodes) => [paragraph$2, ...mergeListItems(nodes).filter(isListItemContent)]);
				}
				case BlockType.TEXT:
				case BlockType.HEADING7:
				case BlockType.HEADING8:
				case BlockType.HEADING9: return {
					type: "paragraph",
					children: createChildrenFromOps()
				};
				case BlockType.IMAGE: {
					const imageBlockToImage = (block$1) => {
						const { caption, name, token } = block$1.snapshot.image;
						return {
							type: "image",
							url: "",
							alt: evaluateAlt(caption),
							data: {
								name,
								token,
								fetchSources: () => fetchImageSources(block$1)
							}
						};
					};
					const image$2 = imageBlockToImage(block);
					this.images.push(image$2);
					return this.normalizeImage(image$2);
				}
				case BlockType.WHITEBOARD: {
					if (!this.options.whiteboard) return null;
					const whiteboardToImage = (whiteboard) => {
						return {
							type: "image",
							url: "",
							alt: evaluateAlt(whiteboard.snapshot.caption),
							data: { fetchBlob: async () => {
								try {
									const { locateBlockWithRecordId = () => Promise.resolve(false) } = this.options;
									await waitForFunction(() => locateBlockWithRecordId(whiteboard.record?.id ?? "").then((isSuccess) => isSuccess && isWhiteboardContentReady(whiteboard)), { timeout: 10 * Second });
								} catch (error) {
									console.error(error);
								}
								return await whiteboardToBlob(whiteboard);
							} }
						};
					};
					const image$2 = whiteboardToImage(block);
					this.images.push(image$2);
					return this.normalizeImage(image$2);
				}
				case BlockType.DIAGRAM: {
					if (!this.options.diagram) return null;
					const diagramToImage = (diagram) => {
						return {
							type: "image",
							url: "",
							data: { fetchBlob: async () => {
								try {
									const { locateBlockWithRecordId = () => Promise.resolve(false) } = this.options;
									await waitForFunction(() => locateBlockWithRecordId(diagram.record?.id ?? "").then((isSuccess) => isSuccess), { timeout: 3 * Second });
								} catch (error) {
									console.error(error);
								}
								const svgElement = diagramToSVGElement(diagram);
								if (!svgElement) return null;
								return await toBlob(svgElement);
							} }
						};
					};
					const image$2 = diagramToImage(block);
					this.images.push(image$2);
					return this.normalizeImage(image$2);
				}
				case BlockType.TABLE:
				case BlockType.GRID: {
					let table$1 = {
						type: "table",
						children: [],
						data: {
							type: block.type,
							...block.type === BlockType.TABLE ? { cellSet: block.snapshot.cell_set } : {}
						}
					};
					table$1 = this.transformParentBlock(block, () => table$1, (nodes) => {
						const tableCells = nodes.filter(isTableCell);
						const widthCells = tableCells.filter((cell) => typeof cell.data?.width === "number");
						const colWidths = block.type === BlockType.GRID ? widthCells.length === tableCells.length ? widthCells.map((cell) => cell.data.width) : void 0 : block.snapshot.columns_id.map((id$1) => block.snapshot.column_set[id$1].column_width);
						table$1.data = {
							...table$1.data,
							type: block.type,
							...colWidths ? { colWidths } : {},
							invalid: tableCells.some((cell) => cell.data?.invalidChildren)
						};
						return (block.type === BlockType.GRID ? [tableCells] : chunk(tableCells, block.snapshot.columns_id.length)).map((tableCells$1) => ({
							type: "tableRow",
							children: tableCells$1
						}));
					});
					this.tableWithParents.push({
						inner: table$1,
						parent: this.parent
					});
					return table$1;
				}
				case BlockType.CELL:
				case BlockType.GRID_COLUMN: {
					const cell = {
						type: "tableCell",
						children: [],
						...block.type === BlockType.GRID_COLUMN ? { data: { width: block.snapshot.width_ratio } } : { data: { ...toCamelCaseKeys(this.parent.data?.cellSet?.[block.cellId]?.merge_info) } }
					};
					return this.transformParentBlock(block, () => cell, (nodes) => {
						const mergedNodes = mergeListItems(nodes);
						const normalizedNodes = [];
						for (let i$1 = 0; i$1 < mergedNodes.length; i$1++) {
							const node$1 = mergedNodes[i$1];
							const nextNode = mergedNodes.at(i$1 + 1);
							if (node$1.type === "paragraph") normalizedNodes.push(...node$1.children);
							else normalizedNodes.push(node$1);
							if (nextNode && node$1.type === "paragraph" && nextNode.type === "paragraph") normalizedNodes.push({
								type: "html",
								value: "<br />"
							});
						}
						if (normalizedNodes.every(isPhrasingContent)) return normalizedNodes;
						cell.data = {
							...cell.data,
							invalidChildren: normalizedNodes
						};
						return normalizedNodes.filter(isPhrasingContent);
					});
				}
				case BlockType.VIEW:
					if (!this.options.file) return null;
					return this.transformParentBlock(block, () => ({
						type: "paragraph",
						children: []
					}), (nodes) => nodes.filter(isPhrasingContent));
				case BlockType.FILE: {
					if (!this.options.file) return null;
					const { name, token } = block.snapshot.file;
					const link$2 = {
						type: "link",
						url: "",
						children: [{
							type: "text",
							value: name
						}],
						data: {
							name,
							fetchFile: (init$1) => fetch(resolveFileDownloadUrl({
								token,
								recordId: block.record?.id ?? ""
							}), {
								method: "Get",
								credentials: "include",
								...init$1
							})
						}
					};
					this.files.push(link$2);
					return link$2;
				}
				case BlockType.IFRAME: return iframeToHTML(block);
				case BlockType.ISV:
					if (block.snapshot.block_type_id === ISVBlockTypeId.TextDrawing) return {
						type: "code",
						lang: "mermaid",
						value: block.snapshot.data.data
					};
					else if (block.snapshot.block_type_id === ISVBlockTypeId.Timeline) return {
						type: "code",
						lang: "mermaid",
						value: generateMermaidTimeline(block.snapshot.data.items)
					};
					return null;
				default: return null;
			}
		};
		transform(block) {
			const result = {
				root: this._transform(block),
				images: this.images,
				tableWithParents: this.tableWithParents,
				files: this.files,
				mentionUsers: this.mentionUsers
			};
			this.parent = null;
			this.images = [];
			this.tableWithParents = [];
			this.files = [];
			this.mentionUsers = [];
			this.sequences = [];
			return result;
		}
	};
	var Docx = class Docx {
		static stringify(root$3, options) {
			return toMarkdown(root$3, {
				...options,
				extensions: [
					gfmStrikethroughToMarkdown(),
					gfmTaskListItemToMarkdown(),
					gfmTableToMarkdown(),
					mathToMarkdown({ singleDollarTextMath: false }),
					...options?.extensions ?? []
				]
			});
		}
		static async locateBlockWithRecordId(recordId) {
			try {
				if (!PageMain) return false;
				return await PageMain.locateBlockWithRecordIdImpl(recordId);
			} catch (error) {
				console.error(error);
			}
			return false;
		}
		get isDocx() {
			return isDocx();
		}
		get isDoc() {
			return !isDocx() && isDoc();
		}
		get rootBlock() {
			if (!PageMain) return null;
			return PageMain.blockManager.rootBlockModel;
		}
		get language() {
			return User?.language === "zh" ? "zh" : "en";
		}
		get pageTitle() {
			if (!this.rootBlock?.zoneState) return void 0;
			return trimEndEnter(this.rootBlock.zoneState.allText);
		}
		get container() {
			return document.querySelector("#mainBox .bear-web-x-container");
		}
		isReady(options = {}) {
			const { checkWhiteboard = false } = options;
			return !!this.rootBlock && this.rootBlock.children.every((block) => {
				const prerequisite = block.snapshot.type !== "pending";
				const isWhiteboard = (block$1) => block$1.type === BlockType.WHITEBOARD || block$1.type === BlockType.FALLBACK && block$1.snapshot.type === BlockType.WHITEBOARD;
				const isSyncedReferenceReady = (block$1) => block$1.type !== BlockType.SYNCED_REFERENCE || block$1.isAllDataReady;
				if (checkWhiteboard && isWhiteboard(block)) return prerequisite && block.type !== BlockType.FALLBACK;
				return prerequisite && isSyncedReferenceReady(block);
			});
		}
		scrollTo(options) {
			const container = this.container;
			if (container) {
				const { left, top: top$1 = container.scrollHeight, behavior = "smooth" } = options;
				container.scrollTo({
					left,
					top: Math.min(top$1, container.scrollHeight),
					behavior
				});
			}
		}
		intoMarkdownAST(transformerOptions = {}) {
			if (!this.rootBlock) return {
				root: {
					type: "root",
					children: []
				},
				images: [],
				tableWithParents: [],
				files: [],
				mentionUsers: []
			};
			return new Transformer({
				locateBlockWithRecordId: (recordId) => Docx.locateBlockWithRecordId(recordId),
				...transformerOptions
			}).transform(this.rootBlock);
		}
	};
	const docx = new Docx();

//#endregion
//#region ../../node_modules/.pnpm/js-base64@3.7.8/node_modules/js-base64/base64.mjs
	const _hasBuffer = typeof Buffer === "function";
	const _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
	const _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
	const b64chs = Array.prototype.slice.call("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=");
	const b64tab = ((a$2) => {
		let tab$1 = {};
		a$2.forEach((c$2, i$1) => tab$1[c$2] = i$1);
		return tab$1;
	})(b64chs);
	const _fromCC = String.fromCharCode.bind(String);
	const _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
	const _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
	/**
	* polyfill version of `btoa`
	*/
	const btoaPolyfill = (bin) => {
		let u32, c0, c1, c2, asc = "";
		const pad = bin.length % 3;
		for (let i$1 = 0; i$1 < bin.length;) {
			if ((c0 = bin.charCodeAt(i$1++)) > 255 || (c1 = bin.charCodeAt(i$1++)) > 255 || (c2 = bin.charCodeAt(i$1++)) > 255) throw new TypeError("invalid character found");
			u32 = c0 << 16 | c1 << 8 | c2;
			asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
		}
		return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
	};
	/**
	* does what `window.btoa` of web browsers do.
	* @param {String} bin binary string
	* @returns {string} Base64-encoded string
	*/
	const _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
	const _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
		const maxargs = 4096;
		let strs = [];
		for (let i$1 = 0, l$2 = u8a.length; i$1 < l$2; i$1 += maxargs) strs.push(_fromCC.apply(null, u8a.subarray(i$1, i$1 + maxargs)));
		return _btoa(strs.join(""));
	};
	const cb_utob = (c$2) => {
		if (c$2.length < 2) {
			var cc = c$2.charCodeAt(0);
			return cc < 128 ? c$2 : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
		} else {
			var cc = 65536 + (c$2.charCodeAt(0) - 55296) * 1024 + (c$2.charCodeAt(1) - 56320);
			return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
		}
	};
	const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
	/**
	* @deprecated should have been internal use only.
	* @param {string} src UTF-8 string
	* @returns {string} UTF-16 string
	*/
	const utob = (u$2) => u$2.replace(re_utob, cb_utob);
	const _encode = _hasBuffer ? (s$2) => Buffer.from(s$2, "utf8").toString("base64") : _TE ? (s$2) => _fromUint8Array(_TE.encode(s$2)) : (s$2) => _btoa(utob(s$2));
	/**
	* converts a UTF-8-encoded string to a Base64 string.
	* @param {boolean} [urlsafe] if `true` make the result URL-safe
	* @returns {string} Base64 string
	*/
	const encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);

//#endregion
//#region ../../packages/lark/src/compiled/encode-token.js
	const characters$1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	function seed(e$1 = 20) {
		let t$2 = "";
		for (let n = 0; n < e$1; n++) {
			const e$2 = Math.floor(Math.random() * 62);
			t$2 += characters$1[e$2];
		}
		return t$2;
	}
	function _(e$1) {
		var t$2, n = "", r$1 = 32 * e$1.length;
		for (t$2 = 0; t$2 < r$1; t$2 += 8) n += String.fromCharCode(e$1[t$2 >> 5] >>> t$2 % 32 & 255);
		return n;
	}
	function i(e$1, t$2) {
		var n = (65535 & e$1) + (65535 & t$2);
		return (e$1 >> 16) + (t$2 >> 16) + (n >> 16) << 16 | 65535 & n;
	}
	function a$1(e$1, t$2, n, r$1, o, a$2) {
		return i((s$2 = i(i(t$2, e$1), i(r$1, a$2))) << (c$2 = o) | s$2 >>> 32 - c$2, n);
		var s$2, c$2;
	}
	function s$1(e$1, t$2, n, r$1, o, i$1, s$2) {
		return a$1(t$2 & n | ~t$2 & r$1, e$1, t$2, o, i$1, s$2);
	}
	function c$1(e$1, t$2, n, r$1, o, i$1, s$2) {
		return a$1(t$2 & r$1 | n & ~r$1, e$1, t$2, o, i$1, s$2);
	}
	function u$1(e$1, t$2, n, r$1, o, i$1, s$2) {
		return a$1(t$2 ^ n ^ r$1, e$1, t$2, o, i$1, s$2);
	}
	function l$1(e$1, t$2, n, r$1, o, i$1, s$2) {
		return a$1(n ^ (t$2 | ~r$1), e$1, t$2, o, i$1, s$2);
	}
	function d$1(e$1, t$2) {
		var n, r$1, o, a$2, d$2;
		e$1[t$2 >> 5] |= 128 << t$2 % 32, e$1[14 + (t$2 + 64 >>> 9 << 4)] = t$2;
		var _$1 = 1732584193, f$2 = -271733879, E$1 = -1732584194, p$3 = 271733878;
		for (n = 0; n < e$1.length; n += 16) r$1 = _$1, o = f$2, a$2 = E$1, d$2 = p$3, _$1 = s$1(_$1, f$2, E$1, p$3, e$1[n], 7, -680876936), p$3 = s$1(p$3, _$1, f$2, E$1, e$1[n + 1], 12, -389564586), E$1 = s$1(E$1, p$3, _$1, f$2, e$1[n + 2], 17, 606105819), f$2 = s$1(f$2, E$1, p$3, _$1, e$1[n + 3], 22, -1044525330), _$1 = s$1(_$1, f$2, E$1, p$3, e$1[n + 4], 7, -176418897), p$3 = s$1(p$3, _$1, f$2, E$1, e$1[n + 5], 12, 1200080426), E$1 = s$1(E$1, p$3, _$1, f$2, e$1[n + 6], 17, -1473231341), f$2 = s$1(f$2, E$1, p$3, _$1, e$1[n + 7], 22, -45705983), _$1 = s$1(_$1, f$2, E$1, p$3, e$1[n + 8], 7, 1770035416), p$3 = s$1(p$3, _$1, f$2, E$1, e$1[n + 9], 12, -1958414417), E$1 = s$1(E$1, p$3, _$1, f$2, e$1[n + 10], 17, -42063), f$2 = s$1(f$2, E$1, p$3, _$1, e$1[n + 11], 22, -1990404162), _$1 = s$1(_$1, f$2, E$1, p$3, e$1[n + 12], 7, 1804603682), p$3 = s$1(p$3, _$1, f$2, E$1, e$1[n + 13], 12, -40341101), E$1 = s$1(E$1, p$3, _$1, f$2, e$1[n + 14], 17, -1502002290), _$1 = c$1(_$1, f$2 = s$1(f$2, E$1, p$3, _$1, e$1[n + 15], 22, 1236535329), E$1, p$3, e$1[n + 1], 5, -165796510), p$3 = c$1(p$3, _$1, f$2, E$1, e$1[n + 6], 9, -1069501632), E$1 = c$1(E$1, p$3, _$1, f$2, e$1[n + 11], 14, 643717713), f$2 = c$1(f$2, E$1, p$3, _$1, e$1[n], 20, -373897302), _$1 = c$1(_$1, f$2, E$1, p$3, e$1[n + 5], 5, -701558691), p$3 = c$1(p$3, _$1, f$2, E$1, e$1[n + 10], 9, 38016083), E$1 = c$1(E$1, p$3, _$1, f$2, e$1[n + 15], 14, -660478335), f$2 = c$1(f$2, E$1, p$3, _$1, e$1[n + 4], 20, -405537848), _$1 = c$1(_$1, f$2, E$1, p$3, e$1[n + 9], 5, 568446438), p$3 = c$1(p$3, _$1, f$2, E$1, e$1[n + 14], 9, -1019803690), E$1 = c$1(E$1, p$3, _$1, f$2, e$1[n + 3], 14, -187363961), f$2 = c$1(f$2, E$1, p$3, _$1, e$1[n + 8], 20, 1163531501), _$1 = c$1(_$1, f$2, E$1, p$3, e$1[n + 13], 5, -1444681467), p$3 = c$1(p$3, _$1, f$2, E$1, e$1[n + 2], 9, -51403784), E$1 = c$1(E$1, p$3, _$1, f$2, e$1[n + 7], 14, 1735328473), _$1 = u$1(_$1, f$2 = c$1(f$2, E$1, p$3, _$1, e$1[n + 12], 20, -1926607734), E$1, p$3, e$1[n + 5], 4, -378558), p$3 = u$1(p$3, _$1, f$2, E$1, e$1[n + 8], 11, -2022574463), E$1 = u$1(E$1, p$3, _$1, f$2, e$1[n + 11], 16, 1839030562), f$2 = u$1(f$2, E$1, p$3, _$1, e$1[n + 14], 23, -35309556), _$1 = u$1(_$1, f$2, E$1, p$3, e$1[n + 1], 4, -1530992060), p$3 = u$1(p$3, _$1, f$2, E$1, e$1[n + 4], 11, 1272893353), E$1 = u$1(E$1, p$3, _$1, f$2, e$1[n + 7], 16, -155497632), f$2 = u$1(f$2, E$1, p$3, _$1, e$1[n + 10], 23, -1094730640), _$1 = u$1(_$1, f$2, E$1, p$3, e$1[n + 13], 4, 681279174), p$3 = u$1(p$3, _$1, f$2, E$1, e$1[n], 11, -358537222), E$1 = u$1(E$1, p$3, _$1, f$2, e$1[n + 3], 16, -722521979), f$2 = u$1(f$2, E$1, p$3, _$1, e$1[n + 6], 23, 76029189), _$1 = u$1(_$1, f$2, E$1, p$3, e$1[n + 9], 4, -640364487), p$3 = u$1(p$3, _$1, f$2, E$1, e$1[n + 12], 11, -421815835), E$1 = u$1(E$1, p$3, _$1, f$2, e$1[n + 15], 16, 530742520), _$1 = l$1(_$1, f$2 = u$1(f$2, E$1, p$3, _$1, e$1[n + 2], 23, -995338651), E$1, p$3, e$1[n], 6, -198630844), p$3 = l$1(p$3, _$1, f$2, E$1, e$1[n + 7], 10, 1126891415), E$1 = l$1(E$1, p$3, _$1, f$2, e$1[n + 14], 15, -1416354905), f$2 = l$1(f$2, E$1, p$3, _$1, e$1[n + 5], 21, -57434055), _$1 = l$1(_$1, f$2, E$1, p$3, e$1[n + 12], 6, 1700485571), p$3 = l$1(p$3, _$1, f$2, E$1, e$1[n + 3], 10, -1894986606), E$1 = l$1(E$1, p$3, _$1, f$2, e$1[n + 10], 15, -1051523), f$2 = l$1(f$2, E$1, p$3, _$1, e$1[n + 1], 21, -2054922799), _$1 = l$1(_$1, f$2, E$1, p$3, e$1[n + 8], 6, 1873313359), p$3 = l$1(p$3, _$1, f$2, E$1, e$1[n + 15], 10, -30611744), E$1 = l$1(E$1, p$3, _$1, f$2, e$1[n + 6], 15, -1560198380), f$2 = l$1(f$2, E$1, p$3, _$1, e$1[n + 13], 21, 1309151649), _$1 = l$1(_$1, f$2, E$1, p$3, e$1[n + 4], 6, -145523070), p$3 = l$1(p$3, _$1, f$2, E$1, e$1[n + 11], 10, -1120210379), E$1 = l$1(E$1, p$3, _$1, f$2, e$1[n + 2], 15, 718787259), f$2 = l$1(f$2, E$1, p$3, _$1, e$1[n + 9], 21, -343485551), _$1 = i(_$1, r$1), f$2 = i(f$2, o), E$1 = i(E$1, a$2), p$3 = i(p$3, d$2);
		return [
			_$1,
			f$2,
			E$1,
			p$3
		];
	}
	function f$1(e$1) {
		var t$2, n = [];
		for (n[(e$1.length >> 2) - 1] = void 0, t$2 = 0; t$2 < n.length; t$2 += 1) n[t$2] = 0;
		var r$1 = 8 * e$1.length;
		for (t$2 = 0; t$2 < r$1; t$2 += 8) n[t$2 >> 5] |= (255 & e$1.charCodeAt(t$2 / 8)) << t$2 % 32;
		return n;
	}
	function p$2(e$1) {
		return unescape(encodeURIComponent(e$1));
	}
	function h$1(e$1) {
		return function(e$2) {
			return _(d$1(f$1(e$2), 8 * e$2.length));
		}(p$2(e$1));
	}
	function E(e$1) {
		var t$2, n, r$1 = "0123456789abcdef", o = "";
		for (n = 0; n < e$1.length; n += 1) t$2 = e$1.charCodeAt(n), o += r$1.charAt(t$2 >>> 4 & 15) + r$1.charAt(15 & t$2);
		return o;
	}
	const encodeToken = function(e$1) {
		const t$2 = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3), n = t$2 + 3600, r$1 = "".concat(t$2, ":").concat(n), i$1 = "Token:".concat(e$1), s$2 = seed(32), c$2 = E(h$1("".concat(s$2, "_").concat(i$1, "_").concat(r$1, "_").concat("V4")));
		return "".concat(c$2, "_").concat(s$2, "_").concat(i$1, "_").concat(r$1, "_").concat("V4");
	};

//#endregion
//#region ../../packages/lark/src/image.ts
	const isNewHost = () => ["docs.bytedance.net"].every((hostname) => -1 === hostname.indexOf(location.hostname));
	const evaluateBaseUrl = () => {
		if (isNewHost()) return (window.local?.apiHost ?? "https://".concat(location.host)).concat("/space");
		return window.docsLocation?.origin ?? location.origin;
	};
	const generateApiUrl = (url) => evaluateBaseUrl().concat(url);
	const generatePublicUrl = (token) => {
		const code$2 = encode(encodeToken(token), true);
		return generateApiUrl("/api/box/stream/download/asynccode/?code=".concat(code$2));
	};
	const csrfToken = () => {
		const t$2 = new RegExp("(?:^|;)\\s*".concat("_csrf_token", "=([^;]+)")).exec(document.cookie);
		return window.decodeURIComponent(t$2 ? t$2[1] : "");
	};
	const makePublicUrlEffective = async (tokens) => {
		try {
			if ((await (await fetch(generateApiUrl("/api/docx/resources/copy_out"), {
				method: "POST",
				headers: { "X-Csrftoken": csrfToken() },
				body: JSON.stringify({ tokens })
			})).json()).code !== 0) return false;
			return true;
		} catch {
			return false;
		}
	};

//#endregion
//#region src/common/i18n.ts
	let Namespace = /* @__PURE__ */ function(Namespace$1) {
		Namespace$1["COMMON"] = "common";
		return Namespace$1;
	}({});
	let CommonTranslationKey = /* @__PURE__ */ function(CommonTranslationKey$1) {
		CommonTranslationKey$1["CONTINUE"] = "continue";
		CommonTranslationKey$1["CONFIRM_TEXT"] = "confirm_text";
		CommonTranslationKey$1["CONFIRM_REPORT_BUG"] = "confirm_report_bug";
		CommonTranslationKey$1["ISSUE_TEMPLATE_BODY"] = "issue_template_body";
		return CommonTranslationKey$1;
	}({});
	const en = { common: {
		[CommonTranslationKey.CONTINUE]: "Please click Confirm to continue",
		[CommonTranslationKey.CONFIRM_TEXT]: "Confirm",
		[CommonTranslationKey.CONFIRM_REPORT_BUG]: "Report Bug",
		[CommonTranslationKey.ISSUE_TEMPLATE_BODY]: `
**Description**

A clear and concise description of what the bug is.

**Recording**

A GIF or video showing the issue happening. (If you don't include this, there's a very good chance your issue will be closed, because it's much too hard to figure out exactly what is going wrong, and it makes maintenance much harder.)

**Example Document**

A link to a Lark Document where the error can be reproduced. (Please ensure that the documentation is publicly accessible.)

**Steps**

To reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expectation**

A clear and concise description of what you expected to happen.

**Environment**

- Extension Version: {{version}}
- Browser: [e.g. Chrome, Edge]

**Context**

Add any other context about the problem here. (The fastest way to have an issue fixed is to create a pull request with working, tested code and we'll help merge it.)

**Error Information**
\`\`\`json
{{errorInfo}}
\`\`\`
`
	} };
	const zh = { common: {
		[CommonTranslationKey.CONTINUE]: "请点击确认以继续",
		[CommonTranslationKey.CONFIRM_TEXT]: "确认",
		[CommonTranslationKey.CONFIRM_REPORT_BUG]: "报告错误",
		[CommonTranslationKey.ISSUE_TEMPLATE_BODY]: `
**问题描述**

清晰简洁地描述这个 Bug 是什么。

**录屏**

展示问题发生的 GIF 或视频。（如果不包含这个，你的问题很可能会被关闭，因为很难准确了解问题出在哪里，这会使维护变得更加困难。）

**示例文档**

一个可以重现错误的飞书文档链接。（请确保文档是公开可访问的。）

**复现步骤**

重现该行为的步骤：

1. 前往 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**期望行为**

清晰简洁地描述你期望发生的情况。

**环境信息**

- 扩展版本：{{version}}
- 浏览器：[例如 Chrome、Edge]

**上下文**

在此添加关于该问题的任何其他上下文。（修复问题最快的方法是创建一个包含已经过测试的可用代码的 Pull Request，我们会协助合并。）

**错误信息**
\`\`\`json
{{errorInfo}}
\`\`\`
`
	} };

//#endregion
//#region src/common/notification.ts
	const confirm = () => {
		return new Promise((resolve) => {
			let confirmed = false;
			Toast.info({
				closable: true,
				duration: Minute,
				content: instance.t(CommonTranslationKey.CONTINUE, { ns: Namespace.COMMON }),
				actionText: instance.t(CommonTranslationKey.CONFIRM_TEXT, { ns: Namespace.COMMON }),
				onActionClick: () => {
					confirmed = true;
				},
				onClose: () => {
					resolve(confirmed);
				}
			});
		});
	};

//#endregion
//#region ../../node_modules/.pnpm/serialize-error@12.0.0/node_modules/serialize-error/error-constructors.js
	const list$1 = [
		Error,
		EvalError,
		RangeError,
		ReferenceError,
		SyntaxError,
		TypeError,
		URIError,
		AggregateError,
		globalThis.DOMException,
		globalThis.AssertionError,
		globalThis.SystemError
	].filter(Boolean).map((constructor) => [constructor.name, constructor]);
	const errorConstructors = new Map(list$1);

//#endregion
//#region ../../node_modules/.pnpm/serialize-error@12.0.0/node_modules/serialize-error/index.js
	const errorProperties = [
		{
			property: "name",
			enumerable: false
		},
		{
			property: "message",
			enumerable: false
		},
		{
			property: "stack",
			enumerable: false
		},
		{
			property: "code",
			enumerable: true
		},
		{
			property: "cause",
			enumerable: false
		},
		{
			property: "errors",
			enumerable: false
		}
	];
	const toJsonWasCalled = /* @__PURE__ */ new WeakSet();
	const toJSON = (from) => {
		toJsonWasCalled.add(from);
		const json = from.toJSON();
		toJsonWasCalled.delete(from);
		return json;
	};
	const newError = (name) => {
		const ErrorConstructor = errorConstructors.get(name) ?? Error;
		return ErrorConstructor === AggregateError ? new ErrorConstructor([]) : new ErrorConstructor();
	};
	const destroyCircular = ({ from, seen, to, forceEnumerable, maxDepth, depth, useToJSON, serialize: serialize$2 }) => {
		if (!to) if (Array.isArray(from)) to = [];
		else if (!serialize$2 && isErrorLike(from)) to = newError(from.name);
		else to = {};
		seen.push(from);
		if (depth >= maxDepth) return to;
		if (useToJSON && typeof from.toJSON === "function" && !toJsonWasCalled.has(from)) return toJSON(from);
		const continueDestroyCircular = (value) => destroyCircular({
			from: value,
			seen: [...seen],
			forceEnumerable,
			maxDepth,
			depth,
			useToJSON,
			serialize: serialize$2
		});
		for (const [key$1, value] of Object.entries(from)) {
			if (value && value instanceof Uint8Array && value.constructor.name === "Buffer") {
				to[key$1] = "[object Buffer]";
				continue;
			}
			if (value !== null && typeof value === "object" && typeof value.pipe === "function") {
				to[key$1] = "[object Stream]";
				continue;
			}
			if (typeof value === "function") continue;
			if (!value || typeof value !== "object") {
				try {
					to[key$1] = value;
				} catch {}
				continue;
			}
			if (!seen.includes(from[key$1])) {
				depth++;
				to[key$1] = continueDestroyCircular(from[key$1]);
				continue;
			}
			to[key$1] = "[Circular]";
		}
		if (serialize$2 || to instanceof Error) {
			for (const { property, enumerable } of errorProperties) if (from[property] !== void 0 && from[property] !== null) Object.defineProperty(to, property, {
				value: isErrorLike(from[property]) || Array.isArray(from[property]) ? continueDestroyCircular(from[property]) : from[property],
				enumerable: forceEnumerable ? true : enumerable,
				configurable: true,
				writable: true
			});
		}
		return to;
	};
	function serializeError(value, options = {}) {
		const { maxDepth = Number.POSITIVE_INFINITY, useToJSON = true } = options;
		if (typeof value === "object" && value !== null) return destroyCircular({
			from: value,
			seen: [],
			forceEnumerable: true,
			maxDepth,
			depth: 0,
			useToJSON,
			serialize: true
		});
		if (typeof value === "function") return `[Function: ${value.name || "anonymous"}]`;
		return value;
	}
	function isErrorLike(value) {
		return Boolean(value) && typeof value === "object" && typeof value.name === "string" && typeof value.message === "string" && typeof value.stack === "string";
	}

//#endregion
//#region package.json
	var version = "1.11.0";

//#endregion
//#region src/common/issue.ts
	var Label = /* @__PURE__ */ function(Label$1) {
		/**
		* Something isn't working
		*/
		Label$1["Bug"] = "bug";
		return Label$1;
	}(Label || {});
	function generateIssueUrl(issue) {
		const { title, body: body$2, labels = [], template } = issue;
		const url = new URL("https://github.com/whale4113/cloud-document-converter/issues/new");
		if (title) url.searchParams.set("title", title);
		if (body$2) url.searchParams.set("body", body$2);
		if (labels.length > 0) url.searchParams.set("labels", labels.join(","));
		if (template) url.searchParams.set("template", template);
		return url.toString();
	}
	const reportBug = (error) => {
		let errorInfo = JSON.stringify(serializeError(error), null, 2);
		const MAX_ERROR_LENGTH = 1e3;
		if (errorInfo.length > MAX_ERROR_LENGTH) errorInfo = errorInfo.slice(0, MAX_ERROR_LENGTH) + "\n...[truncated due to length]";
		const url = generateIssueUrl({
			title: "",
			body: instance.t(CommonTranslationKey.ISSUE_TEMPLATE_BODY, {
				version,
				errorInfo,
				ns: Namespace.COMMON,
				interpolation: { escapeValue: false }
			}),
			labels: [Label.Bug],
			template: "bug.md"
		});
		window.open(url, "__blank");
	};

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').Blockquote} Blockquote
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `blockquote` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Blockquote} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function blockquote(state, node$1) {
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "blockquote",
			properties: {},
			children: state.wrap(state.all(node$1), true)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/break.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').Text} Text
	* @typedef {import('mdast').Break} Break
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `break` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Break} node
	*   mdast node.
	* @returns {Array<Element | Text>}
	*   hast element content.
	*/
	function hardBreak(state, node$1) {
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "br",
			properties: {},
			children: []
		};
		state.patch(node$1, result);
		return [state.applyData(node$1, result), {
			type: "text",
			value: "\n"
		}];
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/code.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').Properties} Properties
	* @typedef {import('mdast').Code} Code
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `code` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Code} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function code(state, node$1) {
		const value = node$1.value ? node$1.value + "\n" : "";
		/** @type {Properties} */
		const properties = {};
		if (node$1.lang) properties.className = ["language-" + node$1.lang];
		/** @type {Element} */
		let result = {
			type: "element",
			tagName: "code",
			properties,
			children: [{
				type: "text",
				value
			}]
		};
		if (node$1.meta) result.data = { meta: node$1.meta };
		state.patch(node$1, result);
		result = state.applyData(node$1, result);
		result = {
			type: "element",
			tagName: "pre",
			properties: {},
			children: [result]
		};
		state.patch(node$1, result);
		return result;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/delete.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').Delete} Delete
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `delete` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Delete} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function strikethrough(state, node$1) {
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "del",
			properties: {},
			children: state.all(node$1)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').Emphasis} Emphasis
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `emphasis` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Emphasis} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function emphasis(state, node$1) {
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "em",
			properties: {},
			children: state.all(node$1)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/micromark-util-sanitize-uri@2.0.1/node_modules/micromark-util-sanitize-uri/index.js
/**
	* Normalize a URL.
	*
	* Encode unsafe characters with percent-encoding, skipping already encoded
	* sequences.
	*
	* @param {string} value
	*   URI to normalize.
	* @returns {string}
	*   Normalized URI.
	*/
	function normalizeUri(value) {
		/** @type {Array<string>} */
		const result = [];
		let index = -1;
		let start = 0;
		let skip = 0;
		while (++index < value.length) {
			const code$2 = value.charCodeAt(index);
			/** @type {string} */
			let replace = "";
			if (code$2 === 37 && asciiAlphanumeric(value.charCodeAt(index + 1)) && asciiAlphanumeric(value.charCodeAt(index + 2))) skip = 2;
			else if (code$2 < 128) {
				if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code$2))) replace = String.fromCharCode(code$2);
			} else if (code$2 > 55295 && code$2 < 57344) {
				const next = value.charCodeAt(index + 1);
				if (code$2 < 56320 && next > 56319 && next < 57344) {
					replace = String.fromCharCode(code$2, next);
					skip = 1;
				} else replace = "�";
			} else replace = String.fromCharCode(code$2);
			if (replace) {
				result.push(value.slice(start, index), encodeURIComponent(replace));
				start = index + skip + 1;
				replace = "";
			}
			if (skip) {
				index += skip;
				skip = 0;
			}
		}
		return result.join("") + value.slice(start);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').FootnoteReference} FootnoteReference
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `footnoteReference` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {FootnoteReference} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function footnoteReference(state, node$1) {
		const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
		const id$1 = String(node$1.identifier).toUpperCase();
		const safeId = normalizeUri(id$1.toLowerCase());
		const index = state.footnoteOrder.indexOf(id$1);
		/** @type {number} */
		let counter;
		let reuseCounter = state.footnoteCounts.get(id$1);
		if (reuseCounter === void 0) {
			reuseCounter = 0;
			state.footnoteOrder.push(id$1);
			counter = state.footnoteOrder.length;
		} else counter = index + 1;
		reuseCounter += 1;
		state.footnoteCounts.set(id$1, reuseCounter);
		/** @type {Element} */
		const link$2 = {
			type: "element",
			tagName: "a",
			properties: {
				href: "#" + clobberPrefix + "fn-" + safeId,
				id: clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
				dataFootnoteRef: true,
				ariaDescribedBy: ["footnote-label"]
			},
			children: [{
				type: "text",
				value: String(counter)
			}]
		};
		state.patch(node$1, link$2);
		/** @type {Element} */
		const sup = {
			type: "element",
			tagName: "sup",
			properties: {},
			children: [link$2]
		};
		state.patch(node$1, sup);
		return state.applyData(node$1, sup);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/heading.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').Heading} Heading
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `heading` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Heading} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function heading(state, node$1) {
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "h" + node$1.depth,
			properties: {},
			children: state.all(node$1)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/html.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').Html} Html
	* @typedef {import('../state.js').State} State
	* @typedef {import('../../index.js').Raw} Raw
	*/
	/**
	* Turn an mdast `html` node into hast (`raw` node in dangerous mode, otherwise
	* nothing).
	*
	* @param {State} state
	*   Info passed around.
	* @param {Html} node
	*   mdast node.
	* @returns {Element | Raw | undefined}
	*   hast node.
	*/
	function html$4(state, node$1) {
		if (state.options.allowDangerousHtml) {
			/** @type {Raw} */
			const result = {
				type: "raw",
				value: node$1.value
			};
			state.patch(node$1, result);
			return state.applyData(node$1, result);
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/revert.js
/**
	* @typedef {import('hast').ElementContent} ElementContent
	*
	* @typedef {import('mdast').Nodes} Nodes
	* @typedef {import('mdast').Reference} Reference
	*
	* @typedef {import('./state.js').State} State
	*/
	/**
	* Return the content of a reference without definition as plain text.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Extract<Nodes, Reference>} node
	*   Reference node (image, link).
	* @returns {Array<ElementContent>}
	*   hast content.
	*/
	function revert(state, node$1) {
		const subtype = node$1.referenceType;
		let suffix = "]";
		if (subtype === "collapsed") suffix += "[]";
		else if (subtype === "full") suffix += "[" + (node$1.label || node$1.identifier) + "]";
		if (node$1.type === "imageReference") return [{
			type: "text",
			value: "![" + node$1.alt + suffix
		}];
		const contents = state.all(node$1);
		const head$1 = contents[0];
		if (head$1 && head$1.type === "text") head$1.value = "[" + head$1.value;
		else contents.unshift({
			type: "text",
			value: "["
		});
		const tail = contents[contents.length - 1];
		if (tail && tail.type === "text") tail.value += suffix;
		else contents.push({
			type: "text",
			value: suffix
		});
		return contents;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').ElementContent} ElementContent
	* @typedef {import('hast').Properties} Properties
	* @typedef {import('mdast').ImageReference} ImageReference
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `imageReference` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {ImageReference} node
	*   mdast node.
	* @returns {Array<ElementContent> | ElementContent}
	*   hast node.
	*/
	function imageReference(state, node$1) {
		const id$1 = String(node$1.identifier).toUpperCase();
		const definition$1 = state.definitionById.get(id$1);
		if (!definition$1) return revert(state, node$1);
		/** @type {Properties} */
		const properties = {
			src: normalizeUri(definition$1.url || ""),
			alt: node$1.alt
		};
		if (definition$1.title !== null && definition$1.title !== void 0) properties.title = definition$1.title;
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "img",
			properties,
			children: []
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/image.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').Properties} Properties
	* @typedef {import('mdast').Image} Image
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `image` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Image} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function image(state, node$1) {
		/** @type {Properties} */
		const properties = { src: normalizeUri(node$1.url) };
		if (node$1.alt !== null && node$1.alt !== void 0) properties.alt = node$1.alt;
		if (node$1.title !== null && node$1.title !== void 0) properties.title = node$1.title;
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "img",
			properties,
			children: []
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').Text} Text
	* @typedef {import('mdast').InlineCode} InlineCode
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `inlineCode` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {InlineCode} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function inlineCode(state, node$1) {
		/** @type {Text} */
		const text$3 = {
			type: "text",
			value: node$1.value.replace(/\r?\n|\r/g, " ")
		};
		state.patch(node$1, text$3);
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "code",
			properties: {},
			children: [text$3]
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').ElementContent} ElementContent
	* @typedef {import('hast').Properties} Properties
	* @typedef {import('mdast').LinkReference} LinkReference
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `linkReference` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {LinkReference} node
	*   mdast node.
	* @returns {Array<ElementContent> | ElementContent}
	*   hast node.
	*/
	function linkReference(state, node$1) {
		const id$1 = String(node$1.identifier).toUpperCase();
		const definition$1 = state.definitionById.get(id$1);
		if (!definition$1) return revert(state, node$1);
		/** @type {Properties} */
		const properties = { href: normalizeUri(definition$1.url || "") };
		if (definition$1.title !== null && definition$1.title !== void 0) properties.title = definition$1.title;
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "a",
			properties,
			children: state.all(node$1)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/link.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').Properties} Properties
	* @typedef {import('mdast').Link} Link
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `link` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Link} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function link(state, node$1) {
		/** @type {Properties} */
		const properties = { href: normalizeUri(node$1.url) };
		if (node$1.title !== null && node$1.title !== void 0) properties.title = node$1.title;
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "a",
			properties,
			children: state.all(node$1)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/list-item.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').ElementContent} ElementContent
	* @typedef {import('hast').Properties} Properties
	* @typedef {import('mdast').ListItem} ListItem
	* @typedef {import('mdast').Parents} Parents
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `listItem` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {ListItem} node
	*   mdast node.
	* @param {Parents | undefined} parent
	*   Parent of `node`.
	* @returns {Element}
	*   hast node.
	*/
	function listItem(state, node$1, parent) {
		const results = state.all(node$1);
		const loose = parent ? listLoose(parent) : listItemLoose(node$1);
		/** @type {Properties} */
		const properties = {};
		/** @type {Array<ElementContent>} */
		const children = [];
		if (typeof node$1.checked === "boolean") {
			const head$1 = results[0];
			/** @type {Element} */
			let paragraph$2;
			if (head$1 && head$1.type === "element" && head$1.tagName === "p") paragraph$2 = head$1;
			else {
				paragraph$2 = {
					type: "element",
					tagName: "p",
					properties: {},
					children: []
				};
				results.unshift(paragraph$2);
			}
			if (paragraph$2.children.length > 0) paragraph$2.children.unshift({
				type: "text",
				value: " "
			});
			paragraph$2.children.unshift({
				type: "element",
				tagName: "input",
				properties: {
					type: "checkbox",
					checked: node$1.checked,
					disabled: true
				},
				children: []
			});
			properties.className = ["task-list-item"];
		}
		let index = -1;
		while (++index < results.length) {
			const child = results[index];
			if (loose || index !== 0 || child.type !== "element" || child.tagName !== "p") children.push({
				type: "text",
				value: "\n"
			});
			if (child.type === "element" && child.tagName === "p" && !loose) children.push(...child.children);
			else children.push(child);
		}
		const tail = results[results.length - 1];
		if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) children.push({
			type: "text",
			value: "\n"
		});
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "li",
			properties,
			children
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}
	/**
	* @param {Parents} node
	* @return {Boolean}
	*/
	function listLoose(node$1) {
		let loose = false;
		if (node$1.type === "list") {
			loose = node$1.spread || false;
			const children = node$1.children;
			let index = -1;
			while (!loose && ++index < children.length) loose = listItemLoose(children[index]);
		}
		return loose;
	}
	/**
	* @param {ListItem} node
	* @return {Boolean}
	*/
	function listItemLoose(node$1) {
		const spread = node$1.spread;
		return spread === null || spread === void 0 ? node$1.children.length > 1 : spread;
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/list.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').Properties} Properties
	* @typedef {import('mdast').List} List
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `list` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {List} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function list(state, node$1) {
		/** @type {Properties} */
		const properties = {};
		const results = state.all(node$1);
		let index = -1;
		if (typeof node$1.start === "number" && node$1.start !== 1) properties.start = node$1.start;
		while (++index < results.length) {
			const child = results[index];
			if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
				properties.className = ["contains-task-list"];
				break;
			}
		}
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: node$1.ordered ? "ol" : "ul",
			properties,
			children: state.wrap(results, true)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').Paragraph} Paragraph
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `paragraph` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Paragraph} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function paragraph(state, node$1) {
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "p",
			properties: {},
			children: state.all(node$1)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/root.js
/**
	* @typedef {import('hast').Parents} HastParents
	* @typedef {import('hast').Root} HastRoot
	* @typedef {import('mdast').Root} MdastRoot
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `root` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {MdastRoot} node
	*   mdast node.
	* @returns {HastParents}
	*   hast node.
	*/
	function root$1(state, node$1) {
		/** @type {HastRoot} */
		const result = {
			type: "root",
			children: state.wrap(state.all(node$1))
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/strong.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').Strong} Strong
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `strong` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Strong} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function strong(state, node$1) {
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "strong",
			properties: {},
			children: state.all(node$1)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/unist-util-position@5.0.0/node_modules/unist-util-position/lib/index.js
/**
	* @typedef {import('unist').Node} Node
	* @typedef {import('unist').Point} Point
	* @typedef {import('unist').Position} Position
	*/
	/**
	* @typedef NodeLike
	* @property {string} type
	* @property {PositionLike | null | undefined} [position]
	*
	* @typedef PositionLike
	* @property {PointLike | null | undefined} [start]
	* @property {PointLike | null | undefined} [end]
	*
	* @typedef PointLike
	* @property {number | null | undefined} [line]
	* @property {number | null | undefined} [column]
	* @property {number | null | undefined} [offset]
	*/
	/**
	* Get the ending point of `node`.
	*
	* @param node
	*   Node.
	* @returns
	*   Point.
	*/
	const pointEnd = point("end");
	/**
	* Get the starting point of `node`.
	*
	* @param node
	*   Node.
	* @returns
	*   Point.
	*/
	const pointStart = point("start");
	/**
	* Get the positional info of `node`.
	*
	* @param {'end' | 'start'} type
	*   Side.
	* @returns
	*   Getter.
	*/
	function point(type) {
		return point$1;
		/**
		* Get the point info of `node` at a bound side.
		*
		* @param {Node | NodeLike | null | undefined} [node]
		* @returns {Point | undefined}
		*/
		function point$1(node$1) {
			const point$2 = node$1 && node$1.position && node$1.position[type] || {};
			if (typeof point$2.line === "number" && point$2.line > 0 && typeof point$2.column === "number" && point$2.column > 0) return {
				line: point$2.line,
				column: point$2.column,
				offset: typeof point$2.offset === "number" && point$2.offset > -1 ? point$2.offset : void 0
			};
		}
	}
	/**
	* Get the positional info of `node`.
	*
	* @param {Node | NodeLike | null | undefined} [node]
	*   Node.
	* @returns {Position | undefined}
	*   Position.
	*/
	function position(node$1) {
		const start = pointStart(node$1);
		const end = pointEnd(node$1);
		if (start && end) return {
			start,
			end
		};
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/table.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').Table} Table
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `table` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {Table} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function table(state, node$1) {
		const rows = state.all(node$1);
		const firstRow = rows.shift();
		/** @type {Array<Element>} */
		const tableContent = [];
		if (firstRow) {
			/** @type {Element} */
			const head$1 = {
				type: "element",
				tagName: "thead",
				properties: {},
				children: state.wrap([firstRow], true)
			};
			state.patch(node$1.children[0], head$1);
			tableContent.push(head$1);
		}
		if (rows.length > 0) {
			/** @type {Element} */
			const body$2 = {
				type: "element",
				tagName: "tbody",
				properties: {},
				children: state.wrap(rows, true)
			};
			const start = pointStart(node$1.children[1]);
			const end = pointEnd(node$1.children[node$1.children.length - 1]);
			if (start && end) body$2.position = {
				start,
				end
			};
			tableContent.push(body$2);
		}
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "table",
			properties: {},
			children: state.wrap(tableContent, true)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/table-row.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').ElementContent} ElementContent
	* @typedef {import('hast').Properties} Properties
	* @typedef {import('mdast').Parents} Parents
	* @typedef {import('mdast').TableRow} TableRow
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `tableRow` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {TableRow} node
	*   mdast node.
	* @param {Parents | undefined} parent
	*   Parent of `node`.
	* @returns {Element}
	*   hast node.
	*/
	function tableRow(state, node$1, parent) {
		const siblings$1 = parent ? parent.children : void 0;
		const tagName = (siblings$1 ? siblings$1.indexOf(node$1) : 1) === 0 ? "th" : "td";
		const align = parent && parent.type === "table" ? parent.align : void 0;
		const length = align ? align.length : node$1.children.length;
		let cellIndex = -1;
		/** @type {Array<ElementContent>} */
		const cells$1 = [];
		while (++cellIndex < length) {
			const cell = node$1.children[cellIndex];
			/** @type {Properties} */
			const properties = {};
			const alignValue = align ? align[cellIndex] : void 0;
			if (alignValue) properties.align = alignValue;
			/** @type {Element} */
			let result$1 = {
				type: "element",
				tagName,
				properties,
				children: []
			};
			if (cell) {
				result$1.children = state.all(cell);
				state.patch(cell, result$1);
				result$1 = state.applyData(cell, result$1);
			}
			cells$1.push(result$1);
		}
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "tr",
			properties: {},
			children: state.wrap(cells$1, true)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').TableCell} TableCell
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `tableCell` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {TableCell} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function tableCell(state, node$1) {
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "td",
			properties: {},
			children: state.all(node$1)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/trim-lines@3.0.1/node_modules/trim-lines/index.js
	const tab = 9;
	const space = 32;
	/**
	* Remove initial and final spaces and tabs at the line breaks in `value`.
	* Does not trim initial and final spaces and tabs of the value itself.
	*
	* @param {string} value
	*   Value to trim.
	* @returns {string}
	*   Trimmed value.
	*/
	function trimLines(value) {
		const source = String(value);
		const search = /\r?\n|\r/g;
		let match = search.exec(source);
		let last = 0;
		/** @type {Array<string>} */
		const lines = [];
		while (match) {
			lines.push(trimLine(source.slice(last, match.index), last > 0, true), match[0]);
			last = match.index + match[0].length;
			match = search.exec(source);
		}
		lines.push(trimLine(source.slice(last), last > 0, false));
		return lines.join("");
	}
	/**
	* @param {string} value
	*   Line to trim.
	* @param {boolean} start
	*   Whether to trim the start of the line.
	* @param {boolean} end
	*   Whether to trim the end of the line.
	* @returns {string}
	*   Trimmed line.
	*/
	function trimLine(value, start, end) {
		let startIndex = 0;
		let endIndex = value.length;
		if (start) {
			let code$2 = value.codePointAt(startIndex);
			while (code$2 === tab || code$2 === space) {
				startIndex++;
				code$2 = value.codePointAt(startIndex);
			}
		}
		if (end) {
			let code$2 = value.codePointAt(endIndex - 1);
			while (code$2 === tab || code$2 === space) {
				endIndex--;
				code$2 = value.codePointAt(endIndex - 1);
			}
		}
		return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/text.js
/**
	* @typedef {import('hast').Element} HastElement
	* @typedef {import('hast').Text} HastText
	* @typedef {import('mdast').Text} MdastText
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `text` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {MdastText} node
	*   mdast node.
	* @returns {HastElement | HastText}
	*   hast node.
	*/
	function text$1(state, node$1) {
		/** @type {HastText} */
		const result = {
			type: "text",
			value: trimLines(String(node$1.value))
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('mdast').ThematicBreak} ThematicBreak
	* @typedef {import('../state.js').State} State
	*/
	/**
	* Turn an mdast `thematicBreak` node into hast.
	*
	* @param {State} state
	*   Info passed around.
	* @param {ThematicBreak} node
	*   mdast node.
	* @returns {Element}
	*   hast node.
	*/
	function thematicBreak(state, node$1) {
		/** @type {Element} */
		const result = {
			type: "element",
			tagName: "hr",
			properties: {},
			children: []
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/handlers/index.js
/**
	* Default handlers for nodes.
	*
	* @satisfies {import('../state.js').Handlers}
	*/
	const handlers = {
		blockquote,
		break: hardBreak,
		code,
		delete: strikethrough,
		emphasis,
		footnoteReference,
		heading,
		html: html$4,
		imageReference,
		image,
		inlineCode,
		linkReference,
		link,
		listItem,
		list,
		paragraph,
		root: root$1,
		strong,
		table,
		tableCell,
		tableRow,
		text: text$1,
		thematicBreak,
		toml: ignore,
		yaml: ignore,
		definition: ignore,
		footnoteDefinition: ignore
	};
	function ignore() {}

//#endregion
//#region ../../node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/types.js
	const VOID = -1;
	const PRIMITIVE = 0;
	const ARRAY = 1;
	const OBJECT = 2;
	const DATE = 3;
	const REGEXP = 4;
	const MAP = 5;
	const SET = 6;
	const ERROR = 7;
	const BIGINT = 8;

//#endregion
//#region ../../node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/deserialize.js
	const env = typeof self === "object" ? self : globalThis;
	const deserializer = ($, _$1) => {
		const as = (out, index) => {
			$.set(index, out);
			return out;
		};
		const unpair = (index) => {
			if ($.has(index)) return $.get(index);
			const [type, value] = _$1[index];
			switch (type) {
				case PRIMITIVE:
				case VOID: return as(value, index);
				case ARRAY: {
					const arr = as([], index);
					for (const index$1 of value) arr.push(unpair(index$1));
					return arr;
				}
				case OBJECT: {
					const object = as({}, index);
					for (const [key$1, index$1] of value) object[unpair(key$1)] = unpair(index$1);
					return object;
				}
				case DATE: return as(new Date(value), index);
				case REGEXP: {
					const { source, flags } = value;
					return as(new RegExp(source, flags), index);
				}
				case MAP: {
					const map$3 = as(/* @__PURE__ */ new Map(), index);
					for (const [key$1, index$1] of value) map$3.set(unpair(key$1), unpair(index$1));
					return map$3;
				}
				case SET: {
					const set = as(/* @__PURE__ */ new Set(), index);
					for (const index$1 of value) set.add(unpair(index$1));
					return set;
				}
				case ERROR: {
					const { name, message } = value;
					return as(new env[name](message), index);
				}
				case BIGINT: return as(BigInt(value), index);
				case "BigInt": return as(Object(BigInt(value)), index);
				case "ArrayBuffer": return as(new Uint8Array(value).buffer, value);
				case "DataView": {
					const { buffer } = new Uint8Array(value);
					return as(new DataView(buffer), value);
				}
			}
			return as(new env[type](value), index);
		};
		return unpair;
	};
	/**
	* @typedef {Array<string,any>} Record a type representation
	*/
	/**
	* Returns a deserialized value from a serialized array of Records.
	* @param {Record[]} serialized a previously serialized value.
	* @returns {any}
	*/
	const deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);

//#endregion
//#region ../../node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/serialize.js
	const EMPTY = "";
	const { toString } = {};
	const { keys } = Object;
	const typeOf = (value) => {
		const type = typeof value;
		if (type !== "object" || !value) return [PRIMITIVE, type];
		const asString = toString.call(value).slice(8, -1);
		switch (asString) {
			case "Array": return [ARRAY, EMPTY];
			case "Object": return [OBJECT, EMPTY];
			case "Date": return [DATE, EMPTY];
			case "RegExp": return [REGEXP, EMPTY];
			case "Map": return [MAP, EMPTY];
			case "Set": return [SET, EMPTY];
			case "DataView": return [ARRAY, asString];
		}
		if (asString.includes("Array")) return [ARRAY, asString];
		if (asString.includes("Error")) return [ERROR, asString];
		return [OBJECT, asString];
	};
	const shouldSkip = ([TYPE, type]) => TYPE === PRIMITIVE && (type === "function" || type === "symbol");
	const serializer = (strict, json, $, _$1) => {
		const as = (out, value) => {
			const index = _$1.push(out) - 1;
			$.set(value, index);
			return index;
		};
		const pair = (value) => {
			if ($.has(value)) return $.get(value);
			let [TYPE, type] = typeOf(value);
			switch (TYPE) {
				case PRIMITIVE: {
					let entry = value;
					switch (type) {
						case "bigint":
							TYPE = BIGINT;
							entry = value.toString();
							break;
						case "function":
						case "symbol":
							if (strict) throw new TypeError("unable to serialize " + type);
							entry = null;
							break;
						case "undefined": return as([VOID], value);
					}
					return as([TYPE, entry], value);
				}
				case ARRAY: {
					if (type) {
						let spread = value;
						if (type === "DataView") spread = new Uint8Array(value.buffer);
						else if (type === "ArrayBuffer") spread = new Uint8Array(value);
						return as([type, [...spread]], value);
					}
					const arr = [];
					const index = as([TYPE, arr], value);
					for (const entry of value) arr.push(pair(entry));
					return index;
				}
				case OBJECT: {
					if (type) switch (type) {
						case "BigInt": return as([type, value.toString()], value);
						case "Boolean":
						case "Number":
						case "String": return as([type, value.valueOf()], value);
					}
					if (json && "toJSON" in value) return pair(value.toJSON());
					const entries = [];
					const index = as([TYPE, entries], value);
					for (const key$1 of keys(value)) if (strict || !shouldSkip(typeOf(value[key$1]))) entries.push([pair(key$1), pair(value[key$1])]);
					return index;
				}
				case DATE: return as([TYPE, value.toISOString()], value);
				case REGEXP: {
					const { source, flags } = value;
					return as([TYPE, {
						source,
						flags
					}], value);
				}
				case MAP: {
					const entries = [];
					const index = as([TYPE, entries], value);
					for (const [key$1, entry] of value) if (strict || !(shouldSkip(typeOf(key$1)) || shouldSkip(typeOf(entry)))) entries.push([pair(key$1), pair(entry)]);
					return index;
				}
				case SET: {
					const entries = [];
					const index = as([TYPE, entries], value);
					for (const entry of value) if (strict || !shouldSkip(typeOf(entry))) entries.push(pair(entry));
					return index;
				}
			}
			const { message } = value;
			return as([TYPE, {
				name: type,
				message
			}], value);
		};
		return pair;
	};
	/**
	* @typedef {Array<string,any>} Record a type representation
	*/
	/**
	* Returns an array of serialized Records.
	* @param {any} value a serializable value.
	* @param {{json?: boolean, lossy?: boolean}?} options an object with a `lossy` or `json` property that,
	*  if `true`, will not throw errors on incompatible types, and behave more
	*  like JSON stringify would behave. Symbol and Function will be discarded.
	* @returns {Record[]}
	*/
	const serialize = (value, { json, lossy } = {}) => {
		const _$1 = [];
		return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _$1)(value), _$1;
	};

//#endregion
//#region ../../node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/index.js
/**
	* @typedef {Array<string,any>} Record a type representation
	*/
	/**
	* Returns an array of serialized Records.
	* @param {any} any a serializable value.
	* @param {{transfer?: any[], json?: boolean, lossy?: boolean}?} options an object with
	* a transfer option (ignored when polyfilled) and/or non standard fields that
	* fallback to the polyfill if present.
	* @returns {Record[]}
	*/
	var esm_default = typeof structuredClone === "function" ? (any, options) => options && ("json" in options || "lossy" in options) ? deserialize(serialize(any, options)) : structuredClone(any) : (any, options) => deserialize(serialize(any, options));

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/footer.js
/**
	* @typedef {import('hast').Element} Element
	* @typedef {import('hast').ElementContent} ElementContent
	*
	* @typedef {import('./state.js').State} State
	*/
	/**
	* @callback FootnoteBackContentTemplate
	*   Generate content for the backreference dynamically.
	*
	*   For the following markdown:
	*
	*   ```markdown
	*   Alpha[^micromark], bravo[^micromark], and charlie[^remark].
	*
	*   [^remark]: things about remark
	*   [^micromark]: things about micromark
	*   ```
	*
	*   This function will be called with:
	*
	*   *  `0` and `0` for the backreference from `things about micromark` to
	*      `alpha`, as it is the first used definition, and the first call to it
	*   *  `0` and `1` for the backreference from `things about micromark` to
	*      `bravo`, as it is the first used definition, and the second call to it
	*   *  `1` and `0` for the backreference from `things about remark` to
	*      `charlie`, as it is the second used definition
	* @param {number} referenceIndex
	*   Index of the definition in the order that they are first referenced,
	*   0-indexed.
	* @param {number} rereferenceIndex
	*   Index of calls to the same definition, 0-indexed.
	* @returns {Array<ElementContent> | ElementContent | string}
	*   Content for the backreference when linking back from definitions to their
	*   reference.
	*
	* @callback FootnoteBackLabelTemplate
	*   Generate a back label dynamically.
	*
	*   For the following markdown:
	*
	*   ```markdown
	*   Alpha[^micromark], bravo[^micromark], and charlie[^remark].
	*
	*   [^remark]: things about remark
	*   [^micromark]: things about micromark
	*   ```
	*
	*   This function will be called with:
	*
	*   *  `0` and `0` for the backreference from `things about micromark` to
	*      `alpha`, as it is the first used definition, and the first call to it
	*   *  `0` and `1` for the backreference from `things about micromark` to
	*      `bravo`, as it is the first used definition, and the second call to it
	*   *  `1` and `0` for the backreference from `things about remark` to
	*      `charlie`, as it is the second used definition
	* @param {number} referenceIndex
	*   Index of the definition in the order that they are first referenced,
	*   0-indexed.
	* @param {number} rereferenceIndex
	*   Index of calls to the same definition, 0-indexed.
	* @returns {string}
	*   Back label to use when linking back from definitions to their reference.
	*/
	/**
	* Generate the default content that GitHub uses on backreferences.
	*
	* @param {number} _
	*   Index of the definition in the order that they are first referenced,
	*   0-indexed.
	* @param {number} rereferenceIndex
	*   Index of calls to the same definition, 0-indexed.
	* @returns {Array<ElementContent>}
	*   Content.
	*/
	function defaultFootnoteBackContent(_$1, rereferenceIndex) {
		/** @type {Array<ElementContent>} */
		const result = [{
			type: "text",
			value: "↩"
		}];
		if (rereferenceIndex > 1) result.push({
			type: "element",
			tagName: "sup",
			properties: {},
			children: [{
				type: "text",
				value: String(rereferenceIndex)
			}]
		});
		return result;
	}
	/**
	* Generate the default label that GitHub uses on backreferences.
	*
	* @param {number} referenceIndex
	*   Index of the definition in the order that they are first referenced,
	*   0-indexed.
	* @param {number} rereferenceIndex
	*   Index of calls to the same definition, 0-indexed.
	* @returns {string}
	*   Label.
	*/
	function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
		return "Back to reference " + (referenceIndex + 1) + (rereferenceIndex > 1 ? "-" + rereferenceIndex : "");
	}
	/**
	* Generate a hast footer for called footnote definitions.
	*
	* @param {State} state
	*   Info passed around.
	* @returns {Element | undefined}
	*   `section` element or `undefined`.
	*/
	function footer(state) {
		const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
		const footnoteBackContent = state.options.footnoteBackContent || defaultFootnoteBackContent;
		const footnoteBackLabel = state.options.footnoteBackLabel || defaultFootnoteBackLabel;
		const footnoteLabel = state.options.footnoteLabel || "Footnotes";
		const footnoteLabelTagName = state.options.footnoteLabelTagName || "h2";
		const footnoteLabelProperties = state.options.footnoteLabelProperties || { className: ["sr-only"] };
		/** @type {Array<ElementContent>} */
		const listItems = [];
		let referenceIndex = -1;
		while (++referenceIndex < state.footnoteOrder.length) {
			const definition$1 = state.footnoteById.get(state.footnoteOrder[referenceIndex]);
			if (!definition$1) continue;
			const content = state.all(definition$1);
			const id$1 = String(definition$1.identifier).toUpperCase();
			const safeId = normalizeUri(id$1.toLowerCase());
			let rereferenceIndex = 0;
			/** @type {Array<ElementContent>} */
			const backReferences = [];
			const counts = state.footnoteCounts.get(id$1);
			while (counts !== void 0 && ++rereferenceIndex <= counts) {
				if (backReferences.length > 0) backReferences.push({
					type: "text",
					value: " "
				});
				let children = typeof footnoteBackContent === "string" ? footnoteBackContent : footnoteBackContent(referenceIndex, rereferenceIndex);
				if (typeof children === "string") children = {
					type: "text",
					value: children
				};
				backReferences.push({
					type: "element",
					tagName: "a",
					properties: {
						href: "#" + clobberPrefix + "fnref-" + safeId + (rereferenceIndex > 1 ? "-" + rereferenceIndex : ""),
						dataFootnoteBackref: "",
						ariaLabel: typeof footnoteBackLabel === "string" ? footnoteBackLabel : footnoteBackLabel(referenceIndex, rereferenceIndex),
						className: ["data-footnote-backref"]
					},
					children: Array.isArray(children) ? children : [children]
				});
			}
			const tail = content[content.length - 1];
			if (tail && tail.type === "element" && tail.tagName === "p") {
				const tailTail = tail.children[tail.children.length - 1];
				if (tailTail && tailTail.type === "text") tailTail.value += " ";
				else tail.children.push({
					type: "text",
					value: " "
				});
				tail.children.push(...backReferences);
			} else content.push(...backReferences);
			/** @type {Element} */
			const listItem$2 = {
				type: "element",
				tagName: "li",
				properties: { id: clobberPrefix + "fn-" + safeId },
				children: state.wrap(content, true)
			};
			state.patch(definition$1, listItem$2);
			listItems.push(listItem$2);
		}
		if (listItems.length === 0) return;
		return {
			type: "element",
			tagName: "section",
			properties: {
				dataFootnotes: true,
				className: ["footnotes"]
			},
			children: [
				{
					type: "element",
					tagName: footnoteLabelTagName,
					properties: {
						...esm_default(footnoteLabelProperties),
						id: "footnote-label"
					},
					children: [{
						type: "text",
						value: footnoteLabel
					}]
				},
				{
					type: "text",
					value: "\n"
				},
				{
					type: "element",
					tagName: "ol",
					properties: {},
					children: state.wrap(listItems, true)
				},
				{
					type: "text",
					value: "\n"
				}
			]
		};
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/state.js
/**
	* @typedef {import('hast').Element} HastElement
	* @typedef {import('hast').ElementContent} HastElementContent
	* @typedef {import('hast').Nodes} HastNodes
	* @typedef {import('hast').Properties} HastProperties
	* @typedef {import('hast').RootContent} HastRootContent
	* @typedef {import('hast').Text} HastText
	*
	* @typedef {import('mdast').Definition} MdastDefinition
	* @typedef {import('mdast').FootnoteDefinition} MdastFootnoteDefinition
	* @typedef {import('mdast').Nodes} MdastNodes
	* @typedef {import('mdast').Parents} MdastParents
	*
	* @typedef {import('vfile').VFile} VFile
	*
	* @typedef {import('./footer.js').FootnoteBackContentTemplate} FootnoteBackContentTemplate
	* @typedef {import('./footer.js').FootnoteBackLabelTemplate} FootnoteBackLabelTemplate
	*/
	/**
	* @callback Handler
	*   Handle a node.
	* @param {State} state
	*   Info passed around.
	* @param {any} node
	*   mdast node to handle.
	* @param {MdastParents | undefined} parent
	*   Parent of `node`.
	* @returns {Array<HastElementContent> | HastElementContent | undefined}
	*   hast node.
	*
	* @typedef {Partial<Record<MdastNodes['type'], Handler>>} Handlers
	*   Handle nodes.
	*
	* @typedef Options
	*   Configuration (optional).
	* @property {boolean | null | undefined} [allowDangerousHtml=false]
	*   Whether to persist raw HTML in markdown in the hast tree (default:
	*   `false`).
	* @property {string | null | undefined} [clobberPrefix='user-content-']
	*   Prefix to use before the `id` property on footnotes to prevent them from
	*   *clobbering* (default: `'user-content-'`).
	*
	*   Pass `''` for trusted markdown and when you are careful with
	*   polyfilling.
	*   You could pass a different prefix.
	*
	*   DOM clobbering is this:
	*
	*   ```html
	*   <p id="x"></p>
	*   <script>alert(x) // `x` now refers to the `p#x` DOM element<\/script>
	*   ```
	*
	*   The above example shows that elements are made available by browsers, by
	*   their ID, on the `window` object.
	*   This is a security risk because you might be expecting some other variable
	*   at that place.
	*   It can also break polyfills.
	*   Using a prefix solves these problems.
	* @property {VFile | null | undefined} [file]
	*   Corresponding virtual file representing the input document (optional).
	* @property {FootnoteBackContentTemplate | string | null | undefined} [footnoteBackContent]
	*   Content of the backreference back to references (default: `defaultFootnoteBackContent`).
	*
	*   The default value is:
	*
	*   ```js
	*   function defaultFootnoteBackContent(_, rereferenceIndex) {
	*     const result = [{type: 'text', value: '↩'}]
	*
	*     if (rereferenceIndex > 1) {
	*       result.push({
	*         type: 'element',
	*         tagName: 'sup',
	*         properties: {},
	*         children: [{type: 'text', value: String(rereferenceIndex)}]
	*       })
	*     }
	*
	*     return result
	*   }
	*   ```
	*
	*   This content is used in the `a` element of each backreference (the `↩`
	*   links).
	* @property {FootnoteBackLabelTemplate | string | null | undefined} [footnoteBackLabel]
	*   Label to describe the backreference back to references (default:
	*   `defaultFootnoteBackLabel`).
	*
	*   The default value is:
	*
	*   ```js
	*   function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
	*    return (
	*      'Back to reference ' +
	*      (referenceIndex + 1) +
	*      (rereferenceIndex > 1 ? '-' + rereferenceIndex : '')
	*    )
	*   }
	*   ```
	*
	*   Change it when the markdown is not in English.
	*
	*   This label is used in the `ariaLabel` property on each backreference
	*   (the `↩` links).
	*   It affects users of assistive technology.
	* @property {string | null | undefined} [footnoteLabel='Footnotes']
	*   Textual label to use for the footnotes section (default: `'Footnotes'`).
	*
	*   Change it when the markdown is not in English.
	*
	*   This label is typically hidden visually (assuming a `sr-only` CSS class
	*   is defined that does that) and so affects screen readers only.
	*   If you do have such a class, but want to show this section to everyone,
	*   pass different properties with the `footnoteLabelProperties` option.
	* @property {HastProperties | null | undefined} [footnoteLabelProperties={className: ['sr-only']}]
	*   Properties to use on the footnote label (default: `{className:
	*   ['sr-only']}`).
	*
	*   Change it to show the label and add other properties.
	*
	*   This label is typically hidden visually (assuming an `sr-only` CSS class
	*   is defined that does that) and so affects screen readers only.
	*   If you do have such a class, but want to show this section to everyone,
	*   pass an empty string.
	*   You can also add different properties.
	*
	*   > **Note**: `id: 'footnote-label'` is always added, because footnote
	*   > calls use it with `aria-describedby` to provide an accessible label.
	* @property {string | null | undefined} [footnoteLabelTagName='h2']
	*   HTML tag name to use for the footnote label element (default: `'h2'`).
	*
	*   Change it to match your document structure.
	*
	*   This label is typically hidden visually (assuming a `sr-only` CSS class
	*   is defined that does that) and so affects screen readers only.
	*   If you do have such a class, but want to show this section to everyone,
	*   pass different properties with the `footnoteLabelProperties` option.
	* @property {Handlers | null | undefined} [handlers]
	*   Extra handlers for nodes (optional).
	* @property {Array<MdastNodes['type']> | null | undefined} [passThrough]
	*   List of custom mdast node types to pass through (keep) in hast (note that
	*   the node itself is passed, but eventual children are transformed)
	*   (optional).
	* @property {Handler | null | undefined} [unknownHandler]
	*   Handler for all unknown nodes (optional).
	*
	* @typedef State
	*   Info passed around.
	* @property {(node: MdastNodes) => Array<HastElementContent>} all
	*   Transform the children of an mdast parent to hast.
	* @property {<Type extends HastNodes>(from: MdastNodes, to: Type) => HastElement | Type} applyData
	*   Honor the `data` of `from`, and generate an element instead of `node`.
	* @property {Map<string, MdastDefinition>} definitionById
	*   Definitions by their identifier.
	* @property {Map<string, MdastFootnoteDefinition>} footnoteById
	*   Footnote definitions by their identifier.
	* @property {Map<string, number>} footnoteCounts
	*   Counts for how often the same footnote was called.
	* @property {Array<string>} footnoteOrder
	*   Identifiers of order when footnote calls first appear in tree order.
	* @property {Handlers} handlers
	*   Applied handlers.
	* @property {(node: MdastNodes, parent: MdastParents | undefined) => Array<HastElementContent> | HastElementContent | undefined} one
	*   Transform an mdast node to hast.
	* @property {Options} options
	*   Configuration.
	* @property {(from: MdastNodes, node: HastNodes) => undefined} patch
	*   Copy a node’s positional info.
	* @property {<Type extends HastRootContent>(nodes: Array<Type>, loose?: boolean | undefined) => Array<HastText | Type>} wrap
	*   Wrap `nodes` with line endings between each node, adds initial/final line endings when `loose`.
	*/
	const own$2 = {}.hasOwnProperty;
	/** @type {Options} */
	const emptyOptions$1 = {};
	/**
	* Create `state` from an mdast tree.
	*
	* @param {MdastNodes} tree
	*   mdast node to transform.
	* @param {Options | null | undefined} [options]
	*   Configuration (optional).
	* @returns {State}
	*   `state` function.
	*/
	function createState(tree, options) {
		const settings = options || emptyOptions$1;
		/** @type {Map<string, MdastDefinition>} */
		const definitionById = /* @__PURE__ */ new Map();
		/** @type {Map<string, MdastFootnoteDefinition>} */
		const footnoteById = /* @__PURE__ */ new Map();
		/** @type {State} */
		const state = {
			all: all$2,
			applyData,
			definitionById,
			footnoteById,
			footnoteCounts: /* @__PURE__ */ new Map(),
			footnoteOrder: [],
			handlers: {
				...handlers,
				...settings.handlers
			},
			one: one$2,
			options: settings,
			patch,
			wrap
		};
		visit(tree, function(node$1) {
			if (node$1.type === "definition" || node$1.type === "footnoteDefinition") {
				const map$3 = node$1.type === "definition" ? definitionById : footnoteById;
				const id$1 = String(node$1.identifier).toUpperCase();
				if (!map$3.has(id$1)) map$3.set(id$1, node$1);
			}
		});
		return state;
		/**
		* Transform an mdast node into a hast node.
		*
		* @param {MdastNodes} node
		*   mdast node.
		* @param {MdastParents | undefined} [parent]
		*   Parent of `node`.
		* @returns {Array<HastElementContent> | HastElementContent | undefined}
		*   Resulting hast node.
		*/
		function one$2(node$1, parent) {
			const type = node$1.type;
			const handle$2 = state.handlers[type];
			if (own$2.call(state.handlers, type) && handle$2) return handle$2(state, node$1, parent);
			if (state.options.passThrough && state.options.passThrough.includes(type)) {
				if ("children" in node$1) {
					const { children,...shallow } = node$1;
					const result = esm_default(shallow);
					result.children = state.all(node$1);
					return result;
				}
				return esm_default(node$1);
			}
			return (state.options.unknownHandler || defaultUnknownHandler)(state, node$1, parent);
		}
		/**
		* Transform the children of an mdast node into hast nodes.
		*
		* @param {MdastNodes} parent
		*   mdast node to compile
		* @returns {Array<HastElementContent>}
		*   Resulting hast nodes.
		*/
		function all$2(parent) {
			/** @type {Array<HastElementContent>} */
			const values = [];
			if ("children" in parent) {
				const nodes = parent.children;
				let index = -1;
				while (++index < nodes.length) {
					const result = state.one(nodes[index], parent);
					if (result) {
						if (index && nodes[index - 1].type === "break") {
							if (!Array.isArray(result) && result.type === "text") result.value = trimMarkdownSpaceStart(result.value);
							if (!Array.isArray(result) && result.type === "element") {
								const head$1 = result.children[0];
								if (head$1 && head$1.type === "text") head$1.value = trimMarkdownSpaceStart(head$1.value);
							}
						}
						if (Array.isArray(result)) values.push(...result);
						else values.push(result);
					}
				}
			}
			return values;
		}
	}
	/**
	* Copy a node’s positional info.
	*
	* @param {MdastNodes} from
	*   mdast node to copy from.
	* @param {HastNodes} to
	*   hast node to copy into.
	* @returns {undefined}
	*   Nothing.
	*/
	function patch(from, to) {
		if (from.position) to.position = position(from);
	}
	/**
	* Honor the `data` of `from` and maybe generate an element instead of `to`.
	*
	* @template {HastNodes} Type
	*   Node type.
	* @param {MdastNodes} from
	*   mdast node to use data from.
	* @param {Type} to
	*   hast node to change.
	* @returns {HastElement | Type}
	*   Nothing.
	*/
	function applyData(from, to) {
		/** @type {HastElement | Type} */
		let result = to;
		if (from && from.data) {
			const hName = from.data.hName;
			const hChildren = from.data.hChildren;
			const hProperties = from.data.hProperties;
			if (typeof hName === "string") if (result.type === "element") result.tagName = hName;
			else result = {
				type: "element",
				tagName: hName,
				properties: {},
				children: "children" in result ? result.children : [result]
			};
			if (result.type === "element" && hProperties) Object.assign(result.properties, esm_default(hProperties));
			if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) result.children = hChildren;
		}
		return result;
	}
	/**
	* Transform an unknown node.
	*
	* @param {State} state
	*   Info passed around.
	* @param {MdastNodes} node
	*   Unknown mdast node.
	* @returns {HastElement | HastText}
	*   Resulting hast node.
	*/
	function defaultUnknownHandler(state, node$1) {
		const data = node$1.data || {};
		/** @type {HastElement | HastText} */
		const result = "value" in node$1 && !(own$2.call(data, "hProperties") || own$2.call(data, "hChildren")) ? {
			type: "text",
			value: node$1.value
		} : {
			type: "element",
			tagName: "div",
			properties: {},
			children: state.all(node$1)
		};
		state.patch(node$1, result);
		return state.applyData(node$1, result);
	}
	/**
	* Wrap `nodes` with line endings between each node.
	*
	* @template {HastRootContent} Type
	*   Node type.
	* @param {Array<Type>} nodes
	*   List of nodes to wrap.
	* @param {boolean | undefined} [loose=false]
	*   Whether to add line endings at start and end (default: `false`).
	* @returns {Array<HastText | Type>}
	*   Wrapped nodes.
	*/
	function wrap(nodes, loose) {
		/** @type {Array<HastText | Type>} */
		const result = [];
		let index = -1;
		if (loose) result.push({
			type: "text",
			value: "\n"
		});
		while (++index < nodes.length) {
			if (index) result.push({
				type: "text",
				value: "\n"
			});
			result.push(nodes[index]);
		}
		if (loose && nodes.length > 0) result.push({
			type: "text",
			value: "\n"
		});
		return result;
	}
	/**
	* Trim spaces and tabs at the start of `value`.
	*
	* @param {string} value
	*   Value to trim.
	* @returns {string}
	*   Result.
	*/
	function trimMarkdownSpaceStart(value) {
		let index = 0;
		let code$2 = value.charCodeAt(index);
		while (code$2 === 9 || code$2 === 32) {
			index++;
			code$2 = value.charCodeAt(index);
		}
		return value.slice(index);
	}

//#endregion
//#region ../../node_modules/.pnpm/mdast-util-to-hast@13.2.0/node_modules/mdast-util-to-hast/lib/index.js
/**
	* @typedef {import('hast').Nodes} HastNodes
	* @typedef {import('mdast').Nodes} MdastNodes
	* @typedef {import('./state.js').Options} Options
	*/
	/**
	* Transform mdast to hast.
	*
	* ##### Notes
	*
	* ###### HTML
	*
	* Raw HTML is available in mdast as `html` nodes and can be embedded in hast
	* as semistandard `raw` nodes.
	* Most utilities ignore `raw` nodes but two notable ones don’t:
	*
	* *   `hast-util-to-html` also has an option `allowDangerousHtml` which will
	*     output the raw HTML.
	*     This is typically discouraged as noted by the option name but is useful
	*     if you completely trust authors
	* *   `hast-util-raw` can handle the raw embedded HTML strings by parsing them
	*     into standard hast nodes (`element`, `text`, etc).
	*     This is a heavy task as it needs a full HTML parser, but it is the only
	*     way to support untrusted content
	*
	* ###### Footnotes
	*
	* Many options supported here relate to footnotes.
	* Footnotes are not specified by CommonMark, which we follow by default.
	* They are supported by GitHub, so footnotes can be enabled in markdown with
	* `mdast-util-gfm`.
	*
	* The options `footnoteBackLabel` and `footnoteLabel` define natural language
	* that explains footnotes, which is hidden for sighted users but shown to
	* assistive technology.
	* When your page is not in English, you must define translated values.
	*
	* Back references use ARIA attributes, but the section label itself uses a
	* heading that is hidden with an `sr-only` class.
	* To show it to sighted users, define different attributes in
	* `footnoteLabelProperties`.
	*
	* ###### Clobbering
	*
	* Footnotes introduces a problem, as it links footnote calls to footnote
	* definitions on the page through `id` attributes generated from user content,
	* which results in DOM clobbering.
	*
	* DOM clobbering is this:
	*
	* ```html
	* <p id=x></p>
	* <script>alert(x) // `x` now refers to the DOM `p#x` element<\/script>
	* ```
	*
	* Elements by their ID are made available by browsers on the `window` object,
	* which is a security risk.
	* Using a prefix solves this problem.
	*
	* More information on how to handle clobbering and the prefix is explained in
	* Example: headings (DOM clobbering) in `rehype-sanitize`.
	*
	* ###### Unknown nodes
	*
	* Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
	* The default behavior for unknown nodes is:
	*
	* *   when the node has a `value` (and doesn’t have `data.hName`,
	*     `data.hProperties`, or `data.hChildren`, see later), create a hast `text`
	*     node
	* *   otherwise, create a `<div>` element (which could be changed with
	*     `data.hName`), with its children mapped from mdast to hast as well
	*
	* This behavior can be changed by passing an `unknownHandler`.
	*
	* @param {MdastNodes} tree
	*   mdast tree.
	* @param {Options | null | undefined} [options]
	*   Configuration (optional).
	* @returns {HastNodes}
	*   hast tree.
	*/
	function toHast(tree, options) {
		const state = createState(tree, options);
		const node$1 = state.one(tree, void 0);
		const foot = footer(state);
		/** @type {HastNodes} */
		const result = Array.isArray(node$1) ? {
			type: "root",
			children: node$1
		} : node$1 || {
			type: "root",
			children: []
		};
		if (foot) {
			/* @__PURE__ */ ok("children" in result);
			result.children.push({
				type: "text",
				value: "\n"
			}, foot);
		}
		return result;
	}

//#endregion
//#region ../../node_modules/.pnpm/html-void-elements@3.0.0/node_modules/html-void-elements/index.js
/**
	* List of HTML void tag names.
	*
	* @type {Array<string>}
	*/
	const htmlVoidElements = [
		"area",
		"base",
		"basefont",
		"bgsound",
		"br",
		"col",
		"command",
		"embed",
		"frame",
		"hr",
		"image",
		"img",
		"input",
		"keygen",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr"
	];

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/schema.js
/**
	* @import {Schema as SchemaType, Space} from 'property-information'
	*/
	/** @type {SchemaType} */
	var Schema = class {
		/**
		* @param {SchemaType['property']} property
		*   Property.
		* @param {SchemaType['normal']} normal
		*   Normal.
		* @param {Space | undefined} [space]
		*   Space.
		* @returns
		*   Schema.
		*/
		constructor(property, normal, space$1) {
			this.normal = normal;
			this.property = property;
			if (space$1) this.space = space$1;
		}
	};
	Schema.prototype.normal = {};
	Schema.prototype.property = {};
	Schema.prototype.space = void 0;

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/merge.js
/**
	* @import {Info, Space} from 'property-information'
	*/
	/**
	* @param {ReadonlyArray<Schema>} definitions
	*   Definitions.
	* @param {Space | undefined} [space]
	*   Space.
	* @returns {Schema}
	*   Schema.
	*/
	function merge(definitions, space$1) {
		/** @type {Record<string, Info>} */
		const property = {};
		/** @type {Record<string, string>} */
		const normal = {};
		for (const definition$1 of definitions) {
			Object.assign(property, definition$1.property);
			Object.assign(normal, definition$1.normal);
		}
		return new Schema(property, normal, space$1);
	}

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/normalize.js
/**
	* Get the cleaned case insensitive form of an attribute or property.
	*
	* @param {string} value
	*   An attribute-like or property-like name.
	* @returns {string}
	*   Value that can be used to look up the properly cased property on a
	*   `Schema`.
	*/
	function normalize(value) {
		return value.toLowerCase();
	}

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/info.js
/**
	* @import {Info as InfoType} from 'property-information'
	*/
	/** @type {InfoType} */
	var Info = class {
		/**
		* @param {string} property
		*   Property.
		* @param {string} attribute
		*   Attribute.
		* @returns
		*   Info.
		*/
		constructor(property, attribute) {
			this.attribute = attribute;
			this.property = property;
		}
	};
	Info.prototype.attribute = "";
	Info.prototype.booleanish = false;
	Info.prototype.boolean = false;
	Info.prototype.commaOrSpaceSeparated = false;
	Info.prototype.commaSeparated = false;
	Info.prototype.defined = false;
	Info.prototype.mustUseProperty = false;
	Info.prototype.number = false;
	Info.prototype.overloadedBoolean = false;
	Info.prototype.property = "";
	Info.prototype.spaceSeparated = false;
	Info.prototype.space = void 0;

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/types.js
	var types_exports = /* @__PURE__ */ __export({
		boolean: () => boolean,
		booleanish: () => booleanish,
		commaOrSpaceSeparated: () => commaOrSpaceSeparated,
		commaSeparated: () => commaSeparated,
		number: () => number,
		overloadedBoolean: () => overloadedBoolean,
		spaceSeparated: () => spaceSeparated
	});
	let powers = 0;
	const boolean = increment();
	const booleanish = increment();
	const overloadedBoolean = increment();
	const number = increment();
	const spaceSeparated = increment();
	const commaSeparated = increment();
	const commaOrSpaceSeparated = increment();
	function increment() {
		return 2 ** ++powers;
	}

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/defined-info.js
/**
	* @import {Space} from 'property-information'
	*/
	const checks = Object.keys(types_exports);
	var DefinedInfo = class extends Info {
		/**
		* @constructor
		* @param {string} property
		*   Property.
		* @param {string} attribute
		*   Attribute.
		* @param {number | null | undefined} [mask]
		*   Mask.
		* @param {Space | undefined} [space]
		*   Space.
		* @returns
		*   Info.
		*/
		constructor(property, attribute, mask, space$1) {
			let index = -1;
			super(property, attribute);
			mark(this, "space", space$1);
			if (typeof mask === "number") while (++index < checks.length) {
				const check = checks[index];
				mark(this, checks[index], (mask & types_exports[check]) === types_exports[check]);
			}
		}
	};
	DefinedInfo.prototype.defined = true;
	/**
	* @template {keyof DefinedInfo} Key
	*   Key type.
	* @param {DefinedInfo} values
	*   Info.
	* @param {Key} key
	*   Key.
	* @param {DefinedInfo[Key]} value
	*   Value.
	* @returns {undefined}
	*   Nothing.
	*/
	function mark(values, key$1, value) {
		if (value) values[key$1] = value;
	}

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/create.js
/**
	* @import {Info, Space} from 'property-information'
	*/
	/**
	* @typedef Definition
	*   Definition of a schema.
	* @property {Record<string, string> | undefined} [attributes]
	*   Normalzed names to special attribute case.
	* @property {ReadonlyArray<string> | undefined} [mustUseProperty]
	*   Normalized names that must be set as properties.
	* @property {Record<string, number | null>} properties
	*   Property names to their types.
	* @property {Space | undefined} [space]
	*   Space.
	* @property {Transform} transform
	*   Transform a property name.
	*/
	/**
	* @callback Transform
	*   Transform.
	* @param {Record<string, string>} attributes
	*   Attributes.
	* @param {string} property
	*   Property.
	* @returns {string}
	*   Attribute.
	*/
	/**
	* @param {Definition} definition
	*   Definition.
	* @returns {Schema}
	*   Schema.
	*/
	function create(definition$1) {
		/** @type {Record<string, Info>} */
		const properties = {};
		/** @type {Record<string, string>} */
		const normals = {};
		for (const [property, value] of Object.entries(definition$1.properties)) {
			const info = new DefinedInfo(property, definition$1.transform(definition$1.attributes || {}, property), value, definition$1.space);
			if (definition$1.mustUseProperty && definition$1.mustUseProperty.includes(property)) info.mustUseProperty = true;
			properties[property] = info;
			normals[normalize(property)] = property;
			normals[normalize(info.attribute)] = property;
		}
		return new Schema(properties, normals, definition$1.space);
	}

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/aria.js
	const aria = create({
		properties: {
			ariaActiveDescendant: null,
			ariaAtomic: booleanish,
			ariaAutoComplete: null,
			ariaBusy: booleanish,
			ariaChecked: booleanish,
			ariaColCount: number,
			ariaColIndex: number,
			ariaColSpan: number,
			ariaControls: spaceSeparated,
			ariaCurrent: null,
			ariaDescribedBy: spaceSeparated,
			ariaDetails: null,
			ariaDisabled: booleanish,
			ariaDropEffect: spaceSeparated,
			ariaErrorMessage: null,
			ariaExpanded: booleanish,
			ariaFlowTo: spaceSeparated,
			ariaGrabbed: booleanish,
			ariaHasPopup: null,
			ariaHidden: booleanish,
			ariaInvalid: null,
			ariaKeyShortcuts: null,
			ariaLabel: null,
			ariaLabelledBy: spaceSeparated,
			ariaLevel: number,
			ariaLive: null,
			ariaModal: booleanish,
			ariaMultiLine: booleanish,
			ariaMultiSelectable: booleanish,
			ariaOrientation: null,
			ariaOwns: spaceSeparated,
			ariaPlaceholder: null,
			ariaPosInSet: number,
			ariaPressed: booleanish,
			ariaReadOnly: booleanish,
			ariaRelevant: null,
			ariaRequired: booleanish,
			ariaRoleDescription: spaceSeparated,
			ariaRowCount: number,
			ariaRowIndex: number,
			ariaRowSpan: number,
			ariaSelected: booleanish,
			ariaSetSize: number,
			ariaSort: null,
			ariaValueMax: number,
			ariaValueMin: number,
			ariaValueNow: number,
			ariaValueText: null,
			role: null
		},
		transform(_$1, property) {
			return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
		}
	});

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/case-sensitive-transform.js
/**
	* @param {Record<string, string>} attributes
	*   Attributes.
	* @param {string} attribute
	*   Attribute.
	* @returns {string}
	*   Transformed attribute.
	*/
	function caseSensitiveTransform(attributes, attribute) {
		return attribute in attributes ? attributes[attribute] : attribute;
	}

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/util/case-insensitive-transform.js
/**
	* @param {Record<string, string>} attributes
	*   Attributes.
	* @param {string} property
	*   Property.
	* @returns {string}
	*   Transformed property.
	*/
	function caseInsensitiveTransform(attributes, property) {
		return caseSensitiveTransform(attributes, property.toLowerCase());
	}

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/html.js
	const html$3 = create({
		attributes: {
			acceptcharset: "accept-charset",
			classname: "class",
			htmlfor: "for",
			httpequiv: "http-equiv"
		},
		mustUseProperty: [
			"checked",
			"multiple",
			"muted",
			"selected"
		],
		properties: {
			abbr: null,
			accept: commaSeparated,
			acceptCharset: spaceSeparated,
			accessKey: spaceSeparated,
			action: null,
			allow: null,
			allowFullScreen: boolean,
			allowPaymentRequest: boolean,
			allowUserMedia: boolean,
			alt: null,
			as: null,
			async: boolean,
			autoCapitalize: null,
			autoComplete: spaceSeparated,
			autoFocus: boolean,
			autoPlay: boolean,
			blocking: spaceSeparated,
			capture: null,
			charSet: null,
			checked: boolean,
			cite: null,
			className: spaceSeparated,
			cols: number,
			colSpan: null,
			content: null,
			contentEditable: booleanish,
			controls: boolean,
			controlsList: spaceSeparated,
			coords: number | commaSeparated,
			crossOrigin: null,
			data: null,
			dateTime: null,
			decoding: null,
			default: boolean,
			defer: boolean,
			dir: null,
			dirName: null,
			disabled: boolean,
			download: overloadedBoolean,
			draggable: booleanish,
			encType: null,
			enterKeyHint: null,
			fetchPriority: null,
			form: null,
			formAction: null,
			formEncType: null,
			formMethod: null,
			formNoValidate: boolean,
			formTarget: null,
			headers: spaceSeparated,
			height: number,
			hidden: overloadedBoolean,
			high: number,
			href: null,
			hrefLang: null,
			htmlFor: spaceSeparated,
			httpEquiv: spaceSeparated,
			id: null,
			imageSizes: null,
			imageSrcSet: null,
			inert: boolean,
			inputMode: null,
			integrity: null,
			is: null,
			isMap: boolean,
			itemId: null,
			itemProp: spaceSeparated,
			itemRef: spaceSeparated,
			itemScope: boolean,
			itemType: spaceSeparated,
			kind: null,
			label: null,
			lang: null,
			language: null,
			list: null,
			loading: null,
			loop: boolean,
			low: number,
			manifest: null,
			max: null,
			maxLength: number,
			media: null,
			method: null,
			min: null,
			minLength: number,
			multiple: boolean,
			muted: boolean,
			name: null,
			nonce: null,
			noModule: boolean,
			noValidate: boolean,
			onAbort: null,
			onAfterPrint: null,
			onAuxClick: null,
			onBeforeMatch: null,
			onBeforePrint: null,
			onBeforeToggle: null,
			onBeforeUnload: null,
			onBlur: null,
			onCancel: null,
			onCanPlay: null,
			onCanPlayThrough: null,
			onChange: null,
			onClick: null,
			onClose: null,
			onContextLost: null,
			onContextMenu: null,
			onContextRestored: null,
			onCopy: null,
			onCueChange: null,
			onCut: null,
			onDblClick: null,
			onDrag: null,
			onDragEnd: null,
			onDragEnter: null,
			onDragExit: null,
			onDragLeave: null,
			onDragOver: null,
			onDragStart: null,
			onDrop: null,
			onDurationChange: null,
			onEmptied: null,
			onEnded: null,
			onError: null,
			onFocus: null,
			onFormData: null,
			onHashChange: null,
			onInput: null,
			onInvalid: null,
			onKeyDown: null,
			onKeyPress: null,
			onKeyUp: null,
			onLanguageChange: null,
			onLoad: null,
			onLoadedData: null,
			onLoadedMetadata: null,
			onLoadEnd: null,
			onLoadStart: null,
			onMessage: null,
			onMessageError: null,
			onMouseDown: null,
			onMouseEnter: null,
			onMouseLeave: null,
			onMouseMove: null,
			onMouseOut: null,
			onMouseOver: null,
			onMouseUp: null,
			onOffline: null,
			onOnline: null,
			onPageHide: null,
			onPageShow: null,
			onPaste: null,
			onPause: null,
			onPlay: null,
			onPlaying: null,
			onPopState: null,
			onProgress: null,
			onRateChange: null,
			onRejectionHandled: null,
			onReset: null,
			onResize: null,
			onScroll: null,
			onScrollEnd: null,
			onSecurityPolicyViolation: null,
			onSeeked: null,
			onSeeking: null,
			onSelect: null,
			onSlotChange: null,
			onStalled: null,
			onStorage: null,
			onSubmit: null,
			onSuspend: null,
			onTimeUpdate: null,
			onToggle: null,
			onUnhandledRejection: null,
			onUnload: null,
			onVolumeChange: null,
			onWaiting: null,
			onWheel: null,
			open: boolean,
			optimum: number,
			pattern: null,
			ping: spaceSeparated,
			placeholder: null,
			playsInline: boolean,
			popover: null,
			popoverTarget: null,
			popoverTargetAction: null,
			poster: null,
			preload: null,
			readOnly: boolean,
			referrerPolicy: null,
			rel: spaceSeparated,
			required: boolean,
			reversed: boolean,
			rows: number,
			rowSpan: number,
			sandbox: spaceSeparated,
			scope: null,
			scoped: boolean,
			seamless: boolean,
			selected: boolean,
			shadowRootClonable: boolean,
			shadowRootDelegatesFocus: boolean,
			shadowRootMode: null,
			shape: null,
			size: number,
			sizes: null,
			slot: null,
			span: number,
			spellCheck: booleanish,
			src: null,
			srcDoc: null,
			srcLang: null,
			srcSet: null,
			start: number,
			step: null,
			style: null,
			tabIndex: number,
			target: null,
			title: null,
			translate: null,
			type: null,
			typeMustMatch: boolean,
			useMap: null,
			value: booleanish,
			width: number,
			wrap: null,
			writingSuggestions: null,
			align: null,
			aLink: null,
			archive: spaceSeparated,
			axis: null,
			background: null,
			bgColor: null,
			border: number,
			borderColor: null,
			bottomMargin: number,
			cellPadding: null,
			cellSpacing: null,
			char: null,
			charOff: null,
			classId: null,
			clear: null,
			code: null,
			codeBase: null,
			codeType: null,
			color: null,
			compact: boolean,
			declare: boolean,
			event: null,
			face: null,
			frame: null,
			frameBorder: null,
			hSpace: number,
			leftMargin: number,
			link: null,
			longDesc: null,
			lowSrc: null,
			marginHeight: number,
			marginWidth: number,
			noResize: boolean,
			noHref: boolean,
			noShade: boolean,
			noWrap: boolean,
			object: null,
			profile: null,
			prompt: null,
			rev: null,
			rightMargin: number,
			rules: null,
			scheme: null,
			scrolling: booleanish,
			standby: null,
			summary: null,
			text: null,
			topMargin: number,
			valueType: null,
			version: null,
			vAlign: null,
			vLink: null,
			vSpace: number,
			allowTransparency: null,
			autoCorrect: null,
			autoSave: null,
			disablePictureInPicture: boolean,
			disableRemotePlayback: boolean,
			prefix: null,
			property: null,
			results: number,
			security: null,
			unselectable: null
		},
		space: "html",
		transform: caseInsensitiveTransform
	});

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/svg.js
	const svg$1 = create({
		attributes: {
			accentHeight: "accent-height",
			alignmentBaseline: "alignment-baseline",
			arabicForm: "arabic-form",
			baselineShift: "baseline-shift",
			capHeight: "cap-height",
			className: "class",
			clipPath: "clip-path",
			clipRule: "clip-rule",
			colorInterpolation: "color-interpolation",
			colorInterpolationFilters: "color-interpolation-filters",
			colorProfile: "color-profile",
			colorRendering: "color-rendering",
			crossOrigin: "crossorigin",
			dataType: "datatype",
			dominantBaseline: "dominant-baseline",
			enableBackground: "enable-background",
			fillOpacity: "fill-opacity",
			fillRule: "fill-rule",
			floodColor: "flood-color",
			floodOpacity: "flood-opacity",
			fontFamily: "font-family",
			fontSize: "font-size",
			fontSizeAdjust: "font-size-adjust",
			fontStretch: "font-stretch",
			fontStyle: "font-style",
			fontVariant: "font-variant",
			fontWeight: "font-weight",
			glyphName: "glyph-name",
			glyphOrientationHorizontal: "glyph-orientation-horizontal",
			glyphOrientationVertical: "glyph-orientation-vertical",
			hrefLang: "hreflang",
			horizAdvX: "horiz-adv-x",
			horizOriginX: "horiz-origin-x",
			horizOriginY: "horiz-origin-y",
			imageRendering: "image-rendering",
			letterSpacing: "letter-spacing",
			lightingColor: "lighting-color",
			markerEnd: "marker-end",
			markerMid: "marker-mid",
			markerStart: "marker-start",
			navDown: "nav-down",
			navDownLeft: "nav-down-left",
			navDownRight: "nav-down-right",
			navLeft: "nav-left",
			navNext: "nav-next",
			navPrev: "nav-prev",
			navRight: "nav-right",
			navUp: "nav-up",
			navUpLeft: "nav-up-left",
			navUpRight: "nav-up-right",
			onAbort: "onabort",
			onActivate: "onactivate",
			onAfterPrint: "onafterprint",
			onBeforePrint: "onbeforeprint",
			onBegin: "onbegin",
			onCancel: "oncancel",
			onCanPlay: "oncanplay",
			onCanPlayThrough: "oncanplaythrough",
			onChange: "onchange",
			onClick: "onclick",
			onClose: "onclose",
			onCopy: "oncopy",
			onCueChange: "oncuechange",
			onCut: "oncut",
			onDblClick: "ondblclick",
			onDrag: "ondrag",
			onDragEnd: "ondragend",
			onDragEnter: "ondragenter",
			onDragExit: "ondragexit",
			onDragLeave: "ondragleave",
			onDragOver: "ondragover",
			onDragStart: "ondragstart",
			onDrop: "ondrop",
			onDurationChange: "ondurationchange",
			onEmptied: "onemptied",
			onEnd: "onend",
			onEnded: "onended",
			onError: "onerror",
			onFocus: "onfocus",
			onFocusIn: "onfocusin",
			onFocusOut: "onfocusout",
			onHashChange: "onhashchange",
			onInput: "oninput",
			onInvalid: "oninvalid",
			onKeyDown: "onkeydown",
			onKeyPress: "onkeypress",
			onKeyUp: "onkeyup",
			onLoad: "onload",
			onLoadedData: "onloadeddata",
			onLoadedMetadata: "onloadedmetadata",
			onLoadStart: "onloadstart",
			onMessage: "onmessage",
			onMouseDown: "onmousedown",
			onMouseEnter: "onmouseenter",
			onMouseLeave: "onmouseleave",
			onMouseMove: "onmousemove",
			onMouseOut: "onmouseout",
			onMouseOver: "onmouseover",
			onMouseUp: "onmouseup",
			onMouseWheel: "onmousewheel",
			onOffline: "onoffline",
			onOnline: "ononline",
			onPageHide: "onpagehide",
			onPageShow: "onpageshow",
			onPaste: "onpaste",
			onPause: "onpause",
			onPlay: "onplay",
			onPlaying: "onplaying",
			onPopState: "onpopstate",
			onProgress: "onprogress",
			onRateChange: "onratechange",
			onRepeat: "onrepeat",
			onReset: "onreset",
			onResize: "onresize",
			onScroll: "onscroll",
			onSeeked: "onseeked",
			onSeeking: "onseeking",
			onSelect: "onselect",
			onShow: "onshow",
			onStalled: "onstalled",
			onStorage: "onstorage",
			onSubmit: "onsubmit",
			onSuspend: "onsuspend",
			onTimeUpdate: "ontimeupdate",
			onToggle: "ontoggle",
			onUnload: "onunload",
			onVolumeChange: "onvolumechange",
			onWaiting: "onwaiting",
			onZoom: "onzoom",
			overlinePosition: "overline-position",
			overlineThickness: "overline-thickness",
			paintOrder: "paint-order",
			panose1: "panose-1",
			pointerEvents: "pointer-events",
			referrerPolicy: "referrerpolicy",
			renderingIntent: "rendering-intent",
			shapeRendering: "shape-rendering",
			stopColor: "stop-color",
			stopOpacity: "stop-opacity",
			strikethroughPosition: "strikethrough-position",
			strikethroughThickness: "strikethrough-thickness",
			strokeDashArray: "stroke-dasharray",
			strokeDashOffset: "stroke-dashoffset",
			strokeLineCap: "stroke-linecap",
			strokeLineJoin: "stroke-linejoin",
			strokeMiterLimit: "stroke-miterlimit",
			strokeOpacity: "stroke-opacity",
			strokeWidth: "stroke-width",
			tabIndex: "tabindex",
			textAnchor: "text-anchor",
			textDecoration: "text-decoration",
			textRendering: "text-rendering",
			transformOrigin: "transform-origin",
			typeOf: "typeof",
			underlinePosition: "underline-position",
			underlineThickness: "underline-thickness",
			unicodeBidi: "unicode-bidi",
			unicodeRange: "unicode-range",
			unitsPerEm: "units-per-em",
			vAlphabetic: "v-alphabetic",
			vHanging: "v-hanging",
			vIdeographic: "v-ideographic",
			vMathematical: "v-mathematical",
			vectorEffect: "vector-effect",
			vertAdvY: "vert-adv-y",
			vertOriginX: "vert-origin-x",
			vertOriginY: "vert-origin-y",
			wordSpacing: "word-spacing",
			writingMode: "writing-mode",
			xHeight: "x-height",
			playbackOrder: "playbackorder",
			timelineBegin: "timelinebegin"
		},
		properties: {
			about: commaOrSpaceSeparated,
			accentHeight: number,
			accumulate: null,
			additive: null,
			alignmentBaseline: null,
			alphabetic: number,
			amplitude: number,
			arabicForm: null,
			ascent: number,
			attributeName: null,
			attributeType: null,
			azimuth: number,
			bandwidth: null,
			baselineShift: null,
			baseFrequency: null,
			baseProfile: null,
			bbox: null,
			begin: null,
			bias: number,
			by: null,
			calcMode: null,
			capHeight: number,
			className: spaceSeparated,
			clip: null,
			clipPath: null,
			clipPathUnits: null,
			clipRule: null,
			color: null,
			colorInterpolation: null,
			colorInterpolationFilters: null,
			colorProfile: null,
			colorRendering: null,
			content: null,
			contentScriptType: null,
			contentStyleType: null,
			crossOrigin: null,
			cursor: null,
			cx: null,
			cy: null,
			d: null,
			dataType: null,
			defaultAction: null,
			descent: number,
			diffuseConstant: number,
			direction: null,
			display: null,
			dur: null,
			divisor: number,
			dominantBaseline: null,
			download: boolean,
			dx: null,
			dy: null,
			edgeMode: null,
			editable: null,
			elevation: number,
			enableBackground: null,
			end: null,
			event: null,
			exponent: number,
			externalResourcesRequired: null,
			fill: null,
			fillOpacity: number,
			fillRule: null,
			filter: null,
			filterRes: null,
			filterUnits: null,
			floodColor: null,
			floodOpacity: null,
			focusable: null,
			focusHighlight: null,
			fontFamily: null,
			fontSize: null,
			fontSizeAdjust: null,
			fontStretch: null,
			fontStyle: null,
			fontVariant: null,
			fontWeight: null,
			format: null,
			fr: null,
			from: null,
			fx: null,
			fy: null,
			g1: commaSeparated,
			g2: commaSeparated,
			glyphName: commaSeparated,
			glyphOrientationHorizontal: null,
			glyphOrientationVertical: null,
			glyphRef: null,
			gradientTransform: null,
			gradientUnits: null,
			handler: null,
			hanging: number,
			hatchContentUnits: null,
			hatchUnits: null,
			height: null,
			href: null,
			hrefLang: null,
			horizAdvX: number,
			horizOriginX: number,
			horizOriginY: number,
			id: null,
			ideographic: number,
			imageRendering: null,
			initialVisibility: null,
			in: null,
			in2: null,
			intercept: number,
			k: number,
			k1: number,
			k2: number,
			k3: number,
			k4: number,
			kernelMatrix: commaOrSpaceSeparated,
			kernelUnitLength: null,
			keyPoints: null,
			keySplines: null,
			keyTimes: null,
			kerning: null,
			lang: null,
			lengthAdjust: null,
			letterSpacing: null,
			lightingColor: null,
			limitingConeAngle: number,
			local: null,
			markerEnd: null,
			markerMid: null,
			markerStart: null,
			markerHeight: null,
			markerUnits: null,
			markerWidth: null,
			mask: null,
			maskContentUnits: null,
			maskUnits: null,
			mathematical: null,
			max: null,
			media: null,
			mediaCharacterEncoding: null,
			mediaContentEncodings: null,
			mediaSize: number,
			mediaTime: null,
			method: null,
			min: null,
			mode: null,
			name: null,
			navDown: null,
			navDownLeft: null,
			navDownRight: null,
			navLeft: null,
			navNext: null,
			navPrev: null,
			navRight: null,
			navUp: null,
			navUpLeft: null,
			navUpRight: null,
			numOctaves: null,
			observer: null,
			offset: null,
			onAbort: null,
			onActivate: null,
			onAfterPrint: null,
			onBeforePrint: null,
			onBegin: null,
			onCancel: null,
			onCanPlay: null,
			onCanPlayThrough: null,
			onChange: null,
			onClick: null,
			onClose: null,
			onCopy: null,
			onCueChange: null,
			onCut: null,
			onDblClick: null,
			onDrag: null,
			onDragEnd: null,
			onDragEnter: null,
			onDragExit: null,
			onDragLeave: null,
			onDragOver: null,
			onDragStart: null,
			onDrop: null,
			onDurationChange: null,
			onEmptied: null,
			onEnd: null,
			onEnded: null,
			onError: null,
			onFocus: null,
			onFocusIn: null,
			onFocusOut: null,
			onHashChange: null,
			onInput: null,
			onInvalid: null,
			onKeyDown: null,
			onKeyPress: null,
			onKeyUp: null,
			onLoad: null,
			onLoadedData: null,
			onLoadedMetadata: null,
			onLoadStart: null,
			onMessage: null,
			onMouseDown: null,
			onMouseEnter: null,
			onMouseLeave: null,
			onMouseMove: null,
			onMouseOut: null,
			onMouseOver: null,
			onMouseUp: null,
			onMouseWheel: null,
			onOffline: null,
			onOnline: null,
			onPageHide: null,
			onPageShow: null,
			onPaste: null,
			onPause: null,
			onPlay: null,
			onPlaying: null,
			onPopState: null,
			onProgress: null,
			onRateChange: null,
			onRepeat: null,
			onReset: null,
			onResize: null,
			onScroll: null,
			onSeeked: null,
			onSeeking: null,
			onSelect: null,
			onShow: null,
			onStalled: null,
			onStorage: null,
			onSubmit: null,
			onSuspend: null,
			onTimeUpdate: null,
			onToggle: null,
			onUnload: null,
			onVolumeChange: null,
			onWaiting: null,
			onZoom: null,
			opacity: null,
			operator: null,
			order: null,
			orient: null,
			orientation: null,
			origin: null,
			overflow: null,
			overlay: null,
			overlinePosition: number,
			overlineThickness: number,
			paintOrder: null,
			panose1: null,
			path: null,
			pathLength: number,
			patternContentUnits: null,
			patternTransform: null,
			patternUnits: null,
			phase: null,
			ping: spaceSeparated,
			pitch: null,
			playbackOrder: null,
			pointerEvents: null,
			points: null,
			pointsAtX: number,
			pointsAtY: number,
			pointsAtZ: number,
			preserveAlpha: null,
			preserveAspectRatio: null,
			primitiveUnits: null,
			propagate: null,
			property: commaOrSpaceSeparated,
			r: null,
			radius: null,
			referrerPolicy: null,
			refX: null,
			refY: null,
			rel: commaOrSpaceSeparated,
			rev: commaOrSpaceSeparated,
			renderingIntent: null,
			repeatCount: null,
			repeatDur: null,
			requiredExtensions: commaOrSpaceSeparated,
			requiredFeatures: commaOrSpaceSeparated,
			requiredFonts: commaOrSpaceSeparated,
			requiredFormats: commaOrSpaceSeparated,
			resource: null,
			restart: null,
			result: null,
			rotate: null,
			rx: null,
			ry: null,
			scale: null,
			seed: null,
			shapeRendering: null,
			side: null,
			slope: null,
			snapshotTime: null,
			specularConstant: number,
			specularExponent: number,
			spreadMethod: null,
			spacing: null,
			startOffset: null,
			stdDeviation: null,
			stemh: null,
			stemv: null,
			stitchTiles: null,
			stopColor: null,
			stopOpacity: null,
			strikethroughPosition: number,
			strikethroughThickness: number,
			string: null,
			stroke: null,
			strokeDashArray: commaOrSpaceSeparated,
			strokeDashOffset: null,
			strokeLineCap: null,
			strokeLineJoin: null,
			strokeMiterLimit: number,
			strokeOpacity: number,
			strokeWidth: null,
			style: null,
			surfaceScale: number,
			syncBehavior: null,
			syncBehaviorDefault: null,
			syncMaster: null,
			syncTolerance: null,
			syncToleranceDefault: null,
			systemLanguage: commaOrSpaceSeparated,
			tabIndex: number,
			tableValues: null,
			target: null,
			targetX: number,
			targetY: number,
			textAnchor: null,
			textDecoration: null,
			textRendering: null,
			textLength: null,
			timelineBegin: null,
			title: null,
			transformBehavior: null,
			type: null,
			typeOf: commaOrSpaceSeparated,
			to: null,
			transform: null,
			transformOrigin: null,
			u1: null,
			u2: null,
			underlinePosition: number,
			underlineThickness: number,
			unicode: null,
			unicodeBidi: null,
			unicodeRange: null,
			unitsPerEm: number,
			values: null,
			vAlphabetic: number,
			vMathematical: number,
			vectorEffect: null,
			vHanging: number,
			vIdeographic: number,
			version: null,
			vertAdvY: number,
			vertOriginX: number,
			vertOriginY: number,
			viewBox: null,
			viewTarget: null,
			visibility: null,
			width: null,
			widths: null,
			wordSpacing: null,
			writingMode: null,
			x: null,
			x1: null,
			x2: null,
			xChannelSelector: null,
			xHeight: number,
			y: null,
			y1: null,
			y2: null,
			yChannelSelector: null,
			z: null,
			zoomAndPan: null
		},
		space: "svg",
		transform: caseSensitiveTransform
	});

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/xlink.js
	const xlink = create({
		properties: {
			xLinkActuate: null,
			xLinkArcRole: null,
			xLinkHref: null,
			xLinkRole: null,
			xLinkShow: null,
			xLinkTitle: null,
			xLinkType: null
		},
		space: "xlink",
		transform(_$1, property) {
			return "xlink:" + property.slice(5).toLowerCase();
		}
	});

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/xmlns.js
	const xmlns = create({
		attributes: { xmlnsxlink: "xmlns:xlink" },
		properties: {
			xmlnsXLink: null,
			xmlns: null
		},
		space: "xmlns",
		transform: caseInsensitiveTransform
	});

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/xml.js
	const xml = create({
		properties: {
			xmlBase: null,
			xmlLang: null,
			xmlSpace: null
		},
		space: "xml",
		transform(_$1, property) {
			return "xml:" + property.slice(3).toLowerCase();
		}
	});

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/lib/find.js
/**
	* @import {Schema} from 'property-information'
	*/
	const cap = /[A-Z]/g;
	const dash = /-[a-z]/g;
	const valid = /^data[-\w.:]+$/i;
	/**
	* Look up info on a property.
	*
	* In most cases the given `schema` contains info on the property.
	* All standard,
	* most legacy,
	* and some non-standard properties are supported.
	* For these cases,
	* the returned `Info` has hints about the value of the property.
	*
	* `name` can also be a valid data attribute or property,
	* in which case an `Info` object with the correctly cased `attribute` and
	* `property` is returned.
	*
	* `name` can be an unknown attribute,
	* in which case an `Info` object with `attribute` and `property` set to the
	* given name is returned.
	* It is not recommended to provide unsupported legacy or recently specced
	* properties.
	*
	*
	* @param {Schema} schema
	*   Schema;
	*   either the `html` or `svg` export.
	* @param {string} value
	*   An attribute-like or property-like name;
	*   it will be passed through `normalize` to hopefully find the correct info.
	* @returns {Info}
	*   Info.
	*/
	function find(schema, value) {
		const normal = normalize(value);
		let property = value;
		let Type = Info;
		if (normal in schema.normal) return schema.property[schema.normal[normal]];
		if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
			if (value.charAt(4) === "-") {
				const rest = value.slice(5).replace(dash, camelcase);
				property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
			} else {
				const rest = value.slice(4);
				if (!dash.test(rest)) {
					let dashes = rest.replace(cap, kebab);
					if (dashes.charAt(0) !== "-") dashes = "-" + dashes;
					value = "data" + dashes;
				}
			}
			Type = DefinedInfo;
		}
		return new Type(property, value);
	}
	/**
	* @param {string} $0
	*   Value.
	* @returns {string}
	*   Kebab.
	*/
	function kebab($0) {
		return "-" + $0.toLowerCase();
	}
	/**
	* @param {string} $0
	*   Value.
	* @returns {string}
	*   Camel.
	*/
	function camelcase($0) {
		return $0.charAt(1).toUpperCase();
	}

//#endregion
//#region ../../node_modules/.pnpm/property-information@7.1.0/node_modules/property-information/index.js
	const html = merge([
		aria,
		html$3,
		xlink,
		xmlns,
		xml
	], "html");
	const svg = merge([
		aria,
		svg$1,
		xlink,
		xmlns,
		xml
	], "svg");

//#endregion
//#region ../../node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/core.js
/**
	* @typedef CoreOptions
	* @property {ReadonlyArray<string>} [subset=[]]
	*   Whether to only escape the given subset of characters.
	* @property {boolean} [escapeOnly=false]
	*   Whether to only escape possibly dangerous characters.
	*   Those characters are `"`, `&`, `'`, `<`, `>`, and `` ` ``.
	*
	* @typedef FormatOptions
	* @property {(code: number, next: number, options: CoreWithFormatOptions) => string} format
	*   Format strategy.
	*
	* @typedef {CoreOptions & FormatOptions & import('./util/format-smart.js').FormatSmartOptions} CoreWithFormatOptions
	*/
	const defaultSubsetRegex = /["&'<>`]/g;
	const surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	const controlCharactersRegex = /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
	const regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
	/** @type {WeakMap<ReadonlyArray<string>, RegExp>} */
	const subsetToRegexCache = /* @__PURE__ */ new WeakMap();
	/**
	* Encode certain characters in `value`.
	*
	* @param {string} value
	* @param {CoreWithFormatOptions} options
	* @returns {string}
	*/
	function core(value, options) {
		value = value.replace(options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex, basic);
		if (options.subset || options.escapeOnly) return value;
		return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
		/**
		* @param {string} pair
		* @param {number} index
		* @param {string} all
		*/
		function surrogate(pair, index, all$2) {
			return options.format((pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536, all$2.charCodeAt(index + 2), options);
		}
		/**
		* @param {string} character
		* @param {number} index
		* @param {string} all
		*/
		function basic(character, index, all$2) {
			return options.format(character.charCodeAt(0), all$2.charCodeAt(index + 1), options);
		}
	}
	/**
	* A wrapper function that caches the result of `charactersToExpression` with a WeakMap.
	* This can improve performance when tooling calls `charactersToExpression` repeatedly
	* with the same subset.
	*
	* @param {ReadonlyArray<string>} subset
	* @returns {RegExp}
	*/
	function charactersToExpressionCached(subset) {
		let cached = subsetToRegexCache.get(subset);
		if (!cached) {
			cached = charactersToExpression(subset);
			subsetToRegexCache.set(subset, cached);
		}
		return cached;
	}
	/**
	* @param {ReadonlyArray<string>} subset
	* @returns {RegExp}
	*/
	function charactersToExpression(subset) {
		/** @type {Array<string>} */
		const groups = [];
		let index = -1;
		while (++index < subset.length) groups.push(subset[index].replace(regexEscapeRegex, "\\$&"));
		return new RegExp("(?:" + groups.join("|") + ")", "g");
	}

//#endregion
//#region ../../node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/util/to-hexadecimal.js
	const hexadecimalRegex = /[\dA-Fa-f]/;
	/**
	* Configurable ways to encode characters as hexadecimal references.
	*
	* @param {number} code
	* @param {number} next
	* @param {boolean|undefined} omit
	* @returns {string}
	*/
	function toHexadecimal(code$2, next, omit) {
		const value = "&#x" + code$2.toString(16).toUpperCase();
		return omit && next && !hexadecimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
	}

//#endregion
//#region ../../node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/util/to-decimal.js
	const decimalRegex = /\d/;
	/**
	* Configurable ways to encode characters as decimal references.
	*
	* @param {number} code
	* @param {number} next
	* @param {boolean|undefined} omit
	* @returns {string}
	*/
	function toDecimal(code$2, next, omit) {
		const value = "&#" + String(code$2);
		return omit && next && !decimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
	}

//#endregion
//#region ../../node_modules/.pnpm/character-entities-legacy@3.0.0/node_modules/character-entities-legacy/index.js
/**
	* List of legacy HTML named character references that don’t need a trailing semicolon.
	*
	* @type {Array<string>}
	*/
	const characterEntitiesLegacy = [
		"AElig",
		"AMP",
		"Aacute",
		"Acirc",
		"Agrave",
		"Aring",
		"Atilde",
		"Auml",
		"COPY",
		"Ccedil",
		"ETH",
		"Eacute",
		"Ecirc",
		"Egrave",
		"Euml",
		"GT",
		"Iacute",
		"Icirc",
		"Igrave",
		"Iuml",
		"LT",
		"Ntilde",
		"Oacute",
		"Ocirc",
		"Ograve",
		"Oslash",
		"Otilde",
		"Ouml",
		"QUOT",
		"REG",
		"THORN",
		"Uacute",
		"Ucirc",
		"Ugrave",
		"Uuml",
		"Yacute",
		"aacute",
		"acirc",
		"acute",
		"aelig",
		"agrave",
		"amp",
		"aring",
		"atilde",
		"auml",
		"brvbar",
		"ccedil",
		"cedil",
		"cent",
		"copy",
		"curren",
		"deg",
		"divide",
		"eacute",
		"ecirc",
		"egrave",
		"eth",
		"euml",
		"frac12",
		"frac14",
		"frac34",
		"gt",
		"iacute",
		"icirc",
		"iexcl",
		"igrave",
		"iquest",
		"iuml",
		"laquo",
		"lt",
		"macr",
		"micro",
		"middot",
		"nbsp",
		"not",
		"ntilde",
		"oacute",
		"ocirc",
		"ograve",
		"ordf",
		"ordm",
		"oslash",
		"otilde",
		"ouml",
		"para",
		"plusmn",
		"pound",
		"quot",
		"raquo",
		"reg",
		"sect",
		"shy",
		"sup1",
		"sup2",
		"sup3",
		"szlig",
		"thorn",
		"times",
		"uacute",
		"ucirc",
		"ugrave",
		"uml",
		"uuml",
		"yacute",
		"yen",
		"yuml"
	];

//#endregion
//#region ../../node_modules/.pnpm/character-entities-html4@2.1.0/node_modules/character-entities-html4/index.js
/**
	* Map of named character references from HTML 4.
	*
	* @type {Record<string, string>}
	*/
	const characterEntitiesHtml4 = {
		nbsp: "\xA0",
		iexcl: "¡",
		cent: "¢",
		pound: "£",
		curren: "¤",
		yen: "¥",
		brvbar: "¦",
		sect: "§",
		uml: "¨",
		copy: "©",
		ordf: "ª",
		laquo: "«",
		not: "¬",
		shy: "­",
		reg: "®",
		macr: "¯",
		deg: "°",
		plusmn: "±",
		sup2: "²",
		sup3: "³",
		acute: "´",
		micro: "µ",
		para: "¶",
		middot: "·",
		cedil: "¸",
		sup1: "¹",
		ordm: "º",
		raquo: "»",
		frac14: "¼",
		frac12: "½",
		frac34: "¾",
		iquest: "¿",
		Agrave: "À",
		Aacute: "Á",
		Acirc: "Â",
		Atilde: "Ã",
		Auml: "Ä",
		Aring: "Å",
		AElig: "Æ",
		Ccedil: "Ç",
		Egrave: "È",
		Eacute: "É",
		Ecirc: "Ê",
		Euml: "Ë",
		Igrave: "Ì",
		Iacute: "Í",
		Icirc: "Î",
		Iuml: "Ï",
		ETH: "Ð",
		Ntilde: "Ñ",
		Ograve: "Ò",
		Oacute: "Ó",
		Ocirc: "Ô",
		Otilde: "Õ",
		Ouml: "Ö",
		times: "×",
		Oslash: "Ø",
		Ugrave: "Ù",
		Uacute: "Ú",
		Ucirc: "Û",
		Uuml: "Ü",
		Yacute: "Ý",
		THORN: "Þ",
		szlig: "ß",
		agrave: "à",
		aacute: "á",
		acirc: "â",
		atilde: "ã",
		auml: "ä",
		aring: "å",
		aelig: "æ",
		ccedil: "ç",
		egrave: "è",
		eacute: "é",
		ecirc: "ê",
		euml: "ë",
		igrave: "ì",
		iacute: "í",
		icirc: "î",
		iuml: "ï",
		eth: "ð",
		ntilde: "ñ",
		ograve: "ò",
		oacute: "ó",
		ocirc: "ô",
		otilde: "õ",
		ouml: "ö",
		divide: "÷",
		oslash: "ø",
		ugrave: "ù",
		uacute: "ú",
		ucirc: "û",
		uuml: "ü",
		yacute: "ý",
		thorn: "þ",
		yuml: "ÿ",
		fnof: "ƒ",
		Alpha: "Α",
		Beta: "Β",
		Gamma: "Γ",
		Delta: "Δ",
		Epsilon: "Ε",
		Zeta: "Ζ",
		Eta: "Η",
		Theta: "Θ",
		Iota: "Ι",
		Kappa: "Κ",
		Lambda: "Λ",
		Mu: "Μ",
		Nu: "Ν",
		Xi: "Ξ",
		Omicron: "Ο",
		Pi: "Π",
		Rho: "Ρ",
		Sigma: "Σ",
		Tau: "Τ",
		Upsilon: "Υ",
		Phi: "Φ",
		Chi: "Χ",
		Psi: "Ψ",
		Omega: "Ω",
		alpha: "α",
		beta: "β",
		gamma: "γ",
		delta: "δ",
		epsilon: "ε",
		zeta: "ζ",
		eta: "η",
		theta: "θ",
		iota: "ι",
		kappa: "κ",
		lambda: "λ",
		mu: "μ",
		nu: "ν",
		xi: "ξ",
		omicron: "ο",
		pi: "π",
		rho: "ρ",
		sigmaf: "ς",
		sigma: "σ",
		tau: "τ",
		upsilon: "υ",
		phi: "φ",
		chi: "χ",
		psi: "ψ",
		omega: "ω",
		thetasym: "ϑ",
		upsih: "ϒ",
		piv: "ϖ",
		bull: "•",
		hellip: "…",
		prime: "′",
		Prime: "″",
		oline: "‾",
		frasl: "⁄",
		weierp: "℘",
		image: "ℑ",
		real: "ℜ",
		trade: "™",
		alefsym: "ℵ",
		larr: "←",
		uarr: "↑",
		rarr: "→",
		darr: "↓",
		harr: "↔",
		crarr: "↵",
		lArr: "⇐",
		uArr: "⇑",
		rArr: "⇒",
		dArr: "⇓",
		hArr: "⇔",
		forall: "∀",
		part: "∂",
		exist: "∃",
		empty: "∅",
		nabla: "∇",
		isin: "∈",
		notin: "∉",
		ni: "∋",
		prod: "∏",
		sum: "∑",
		minus: "−",
		lowast: "∗",
		radic: "√",
		prop: "∝",
		infin: "∞",
		ang: "∠",
		and: "∧",
		or: "∨",
		cap: "∩",
		cup: "∪",
		int: "∫",
		there4: "∴",
		sim: "∼",
		cong: "≅",
		asymp: "≈",
		ne: "≠",
		equiv: "≡",
		le: "≤",
		ge: "≥",
		sub: "⊂",
		sup: "⊃",
		nsub: "⊄",
		sube: "⊆",
		supe: "⊇",
		oplus: "⊕",
		otimes: "⊗",
		perp: "⊥",
		sdot: "⋅",
		lceil: "⌈",
		rceil: "⌉",
		lfloor: "⌊",
		rfloor: "⌋",
		lang: "〈",
		rang: "〉",
		loz: "◊",
		spades: "♠",
		clubs: "♣",
		hearts: "♥",
		diams: "♦",
		quot: "\"",
		amp: "&",
		lt: "<",
		gt: ">",
		OElig: "Œ",
		oelig: "œ",
		Scaron: "Š",
		scaron: "š",
		Yuml: "Ÿ",
		circ: "ˆ",
		tilde: "˜",
		ensp: " ",
		emsp: " ",
		thinsp: " ",
		zwnj: "‌",
		zwj: "‍",
		lrm: "‎",
		rlm: "‏",
		ndash: "–",
		mdash: "—",
		lsquo: "‘",
		rsquo: "’",
		sbquo: "‚",
		ldquo: "“",
		rdquo: "”",
		bdquo: "„",
		dagger: "†",
		Dagger: "‡",
		permil: "‰",
		lsaquo: "‹",
		rsaquo: "›",
		euro: "€"
	};

//#endregion
//#region ../../node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/constant/dangerous.js
/**
	* List of legacy (that don’t need a trailing `;`) named references which could,
	* depending on what follows them, turn into a different meaning
	*
	* @type {Array<string>}
	*/
	const dangerous = [
		"cent",
		"copy",
		"divide",
		"gt",
		"lt",
		"not",
		"para",
		"times"
	];

//#endregion
//#region ../../node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/util/to-named.js
	const own$1 = {}.hasOwnProperty;
	/**
	* `characterEntitiesHtml4` but inverted.
	*
	* @type {Record<string, string>}
	*/
	const characters = {};
	/** @type {string} */
	let key;
	for (key in characterEntitiesHtml4) if (own$1.call(characterEntitiesHtml4, key)) characters[characterEntitiesHtml4[key]] = key;
	const notAlphanumericRegex = /[^\dA-Za-z]/;
	/**
	* Configurable ways to encode characters as named references.
	*
	* @param {number} code
	* @param {number} next
	* @param {boolean|undefined} omit
	* @param {boolean|undefined} attribute
	* @returns {string}
	*/
	function toNamed(code$2, next, omit, attribute) {
		const character = String.fromCharCode(code$2);
		if (own$1.call(characters, character)) {
			const name = characters[character];
			const value = "&" + name;
			if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && notAlphanumericRegex.test(String.fromCharCode(next)))) return value;
			return value + ";";
		}
		return "";
	}

//#endregion
//#region ../../node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/util/format-smart.js
/**
	* @typedef FormatSmartOptions
	* @property {boolean} [useNamedReferences=false]
	*   Prefer named character references (`&amp;`) where possible.
	* @property {boolean} [useShortestReferences=false]
	*   Prefer the shortest possible reference, if that results in less bytes.
	*   **Note**: `useNamedReferences` can be omitted when using `useShortestReferences`.
	* @property {boolean} [omitOptionalSemicolons=false]
	*   Whether to omit semicolons when possible.
	*   **Note**: This creates what HTML calls “parse errors” but is otherwise still valid HTML — don’t use this except when building a minifier.
	*   Omitting semicolons is possible for certain named and numeric references in some cases.
	* @property {boolean} [attribute=false]
	*   Create character references which don’t fail in attributes.
	*   **Note**: `attribute` only applies when operating dangerously with
	*   `omitOptionalSemicolons: true`.
	*/
	/**
	* Configurable ways to encode a character yielding pretty or small results.
	*
	* @param {number} code
	* @param {number} next
	* @param {FormatSmartOptions} options
	* @returns {string}
	*/
	function formatSmart(code$2, next, options) {
		let numeric = toHexadecimal(code$2, next, options.omitOptionalSemicolons);
		/** @type {string|undefined} */
		let named;
		if (options.useNamedReferences || options.useShortestReferences) named = toNamed(code$2, next, options.omitOptionalSemicolons, options.attribute);
		if ((options.useShortestReferences || !named) && options.useShortestReferences) {
			const decimal = toDecimal(code$2, next, options.omitOptionalSemicolons);
			if (decimal.length < numeric.length) numeric = decimal;
		}
		return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
	}

//#endregion
//#region ../../node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/index.js
/**
	* @typedef {import('./core.js').CoreOptions & import('./util/format-smart.js').FormatSmartOptions} Options
	* @typedef {import('./core.js').CoreOptions} LightOptions
	*/
	/**
	* Encode special characters in `value`.
	*
	* @param {string} value
	*   Value to encode.
	* @param {Options} [options]
	*   Configuration.
	* @returns {string}
	*   Encoded value.
	*/
	function stringifyEntities(value, options) {
		return core(value, Object.assign({ format: formatSmart }, options));
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/handle/comment.js
/**
	* @import {Comment, Parents} from 'hast'
	* @import {State} from '../index.js'
	*/
	const htmlCommentRegex = /^>|^->|<!--|-->|--!>|<!-$/g;
	const bogusCommentEntitySubset = [">"];
	const commentEntitySubset = ["<", ">"];
	/**
	* Serialize a comment.
	*
	* @param {Comment} node
	*   Node to handle.
	* @param {number | undefined} _1
	*   Index of `node` in `parent.
	* @param {Parents | undefined} _2
	*   Parent of `node`.
	* @param {State} state
	*   Info passed around about the current state.
	* @returns {string}
	*   Serialized node.
	*/
	function comment(node$1, _1, _2, state) {
		return state.settings.bogusComments ? "<?" + stringifyEntities(node$1.value, Object.assign({}, state.settings.characterReferences, { subset: bogusCommentEntitySubset })) + ">" : "<!--" + node$1.value.replace(htmlCommentRegex, encode$1) + "-->";
		/**
		* @param {string} $0
		*/
		function encode$1($0) {
			return stringifyEntities($0, Object.assign({}, state.settings.characterReferences, { subset: commentEntitySubset }));
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/handle/doctype.js
/**
	* @import {Doctype, Parents} from 'hast'
	* @import {State} from '../index.js'
	*/
	/**
	* Serialize a doctype.
	*
	* @param {Doctype} _1
	*   Node to handle.
	* @param {number | undefined} _2
	*   Index of `node` in `parent.
	* @param {Parents | undefined} _3
	*   Parent of `node`.
	* @param {State} state
	*   Info passed around about the current state.
	* @returns {string}
	*   Serialized node.
	*/
	function doctype(_1, _2, _3, state) {
		return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
	}

//#endregion
//#region ../../node_modules/.pnpm/ccount@2.0.1/node_modules/ccount/index.js
/**
	* Count how often a character (or substring) is used in a string.
	*
	* @param {string} value
	*   Value to search in.
	* @param {string} character
	*   Character (or substring) to look for.
	* @return {number}
	*   Number of times `character` occurred in `value`.
	*/
	function ccount(value, character) {
		const source = String(value);
		if (typeof character !== "string") throw new TypeError("Expected character");
		let count = 0;
		let index = source.indexOf(character);
		while (index !== -1) {
			count++;
			index = source.indexOf(character, index + character.length);
		}
		return count;
	}

//#endregion
//#region ../../node_modules/.pnpm/comma-separated-tokens@2.0.3/node_modules/comma-separated-tokens/index.js
/**
	* Serialize an array of strings or numbers to comma-separated tokens.
	*
	* @param {Array<string|number>} values
	*   List of tokens.
	* @param {Options} [options]
	*   Configuration for `stringify` (optional).
	* @returns {string}
	*   Comma-separated tokens.
	*/
	function stringify(values, options) {
		const settings = options || {};
		return (values[values.length - 1] === "" ? [...values, ""] : values).join((settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")).trim();
	}

//#endregion
//#region ../../node_modules/.pnpm/space-separated-tokens@2.0.2/node_modules/space-separated-tokens/index.js
/**
	* Serialize an array of strings as space separated-tokens.
	*
	* @param {Array<string|number>} values
	*   List of tokens.
	* @returns {string}
	*   Space-separated tokens.
	*/
	function stringify$1(values) {
		return values.join(" ").trim();
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-whitespace@3.0.0/node_modules/hast-util-whitespace/lib/index.js
/**
	* @typedef {import('hast').Nodes} Nodes
	*/
	const re = /[ \t\n\f\r]/g;
	/**
	* Check if the given value is *inter-element whitespace*.
	*
	* @param {Nodes | string} thing
	*   Thing to check (`Node` or `string`).
	* @returns {boolean}
	*   Whether the `value` is inter-element whitespace (`boolean`): consisting of
	*   zero or more of space, tab (`\t`), line feed (`\n`), carriage return
	*   (`\r`), or form feed (`\f`); if a node is passed it must be a `Text` node,
	*   whose `value` field is checked.
	*/
	function whitespace(thing) {
		return typeof thing === "object" ? thing.type === "text" ? empty(thing.value) : false : empty(thing);
	}
	/**
	* @param {string} value
	* @returns {boolean}
	*/
	function empty(value) {
		return value.replace(re, "") === "";
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/omission/util/siblings.js
/**
	* @import {Parents, RootContent} from 'hast'
	*/
	const siblingAfter = siblings(1);
	const siblingBefore = siblings(-1);
	/** @type {Array<RootContent>} */
	const emptyChildren$1 = [];
	/**
	* Factory to check siblings in a direction.
	*
	* @param {number} increment
	*/
	function siblings(increment$1) {
		return sibling;
		/**
		* Find applicable siblings in a direction.
		*
		* @template {Parents} Parent
		*   Parent type.
		* @param {Parent | undefined} parent
		*   Parent.
		* @param {number | undefined} index
		*   Index of child in `parent`.
		* @param {boolean | undefined} [includeWhitespace=false]
		*   Whether to include whitespace (default: `false`).
		* @returns {Parent extends {children: Array<infer Child>} ? Child | undefined : never}
		*   Child of parent.
		*/
		function sibling(parent, index, includeWhitespace) {
			const siblings$1 = parent ? parent.children : emptyChildren$1;
			let offset = (index || 0) + increment$1;
			let next = siblings$1[offset];
			if (!includeWhitespace) while (next && whitespace(next)) {
				offset += increment$1;
				next = siblings$1[offset];
			}
			return next;
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/omission/omission.js
/**
	* @import {Element, Parents} from 'hast'
	*/
	/**
	* @callback OmitHandle
	*   Check if a tag can be omitted.
	* @param {Element} element
	*   Element to check.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether to omit a tag.
	*
	*/
	const own = {}.hasOwnProperty;
	/**
	* Factory to check if a given node can have a tag omitted.
	*
	* @param {Record<string, OmitHandle>} handlers
	*   Omission handlers, where each key is a tag name, and each value is the
	*   corresponding handler.
	* @returns {OmitHandle}
	*   Whether to omit a tag of an element.
	*/
	function omission(handlers$1) {
		return omit;
		/**
		* Check if a given node can have a tag omitted.
		*
		* @type {OmitHandle}
		*/
		function omit(node$1, index, parent) {
			return own.call(handlers$1, node$1.tagName) && handlers$1[node$1.tagName](node$1, index, parent);
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/omission/closing.js
/**
	* @import {Element, Parents} from 'hast'
	*/
	const closing = omission({
		body: body$1,
		caption: headOrColgroupOrCaption,
		colgroup: headOrColgroupOrCaption,
		dd,
		dt,
		head: headOrColgroupOrCaption,
		html: html$2,
		li,
		optgroup,
		option,
		p: p$1,
		rp: rubyElement,
		rt: rubyElement,
		tbody: tbody$1,
		td: cells,
		tfoot,
		th: cells,
		thead,
		tr
	});
	/**
	* Macro for `</head>`, `</colgroup>`, and `</caption>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function headOrColgroupOrCaption(_$1, index, parent) {
		const next = siblingAfter(parent, index, true);
		return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
	}
	/**
	* Whether to omit `</html>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function html$2(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type !== "comment";
	}
	/**
	* Whether to omit `</body>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function body$1(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type !== "comment";
	}
	/**
	* Whether to omit `</p>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function p$1(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
	}
	/**
	* Whether to omit `</li>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function li(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && next.tagName === "li";
	}
	/**
	* Whether to omit `</dt>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function dt(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return Boolean(next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd"));
	}
	/**
	* Whether to omit `</dd>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function dd(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
	}
	/**
	* Whether to omit `</rt>` or `</rp>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function rubyElement(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
	}
	/**
	* Whether to omit `</optgroup>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function optgroup(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && next.tagName === "optgroup";
	}
	/**
	* Whether to omit `</option>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function option(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
	}
	/**
	* Whether to omit `</thead>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function thead(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return Boolean(next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot"));
	}
	/**
	* Whether to omit `</tbody>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function tbody$1(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
	}
	/**
	* Whether to omit `</tfoot>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function tfoot(_$1, index, parent) {
		return !siblingAfter(parent, index);
	}
	/**
	* Whether to omit `</tr>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function tr(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && next.tagName === "tr";
	}
	/**
	* Whether to omit `</td>` or `</th>`.
	*
	* @param {Element} _
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the closing tag can be omitted.
	*/
	function cells(_$1, index, parent) {
		const next = siblingAfter(parent, index);
		return !next || next.type === "element" && (next.tagName === "td" || next.tagName === "th");
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/omission/opening.js
/**
	* @import {Element, Parents} from 'hast'
	*/
	const opening = omission({
		body,
		colgroup,
		head,
		html: html$1,
		tbody
	});
	/**
	* Whether to omit `<html>`.
	*
	* @param {Element} node
	*   Element.
	* @returns {boolean}
	*   Whether the opening tag can be omitted.
	*/
	function html$1(node$1) {
		const head$1 = siblingAfter(node$1, -1);
		return !head$1 || head$1.type !== "comment";
	}
	/**
	* Whether to omit `<head>`.
	*
	* @param {Element} node
	*   Element.
	* @returns {boolean}
	*   Whether the opening tag can be omitted.
	*/
	function head(node$1) {
		/** @type {Set<string>} */
		const seen = /* @__PURE__ */ new Set();
		for (const child$1 of node$1.children) if (child$1.type === "element" && (child$1.tagName === "base" || child$1.tagName === "title")) {
			if (seen.has(child$1.tagName)) return false;
			seen.add(child$1.tagName);
		}
		const child = node$1.children[0];
		return !child || child.type === "element";
	}
	/**
	* Whether to omit `<body>`.
	*
	* @param {Element} node
	*   Element.
	* @returns {boolean}
	*   Whether the opening tag can be omitted.
	*/
	function body(node$1) {
		const head$1 = siblingAfter(node$1, -1, true);
		return !head$1 || head$1.type !== "comment" && !(head$1.type === "text" && whitespace(head$1.value.charAt(0))) && !(head$1.type === "element" && (head$1.tagName === "meta" || head$1.tagName === "link" || head$1.tagName === "script" || head$1.tagName === "style" || head$1.tagName === "template"));
	}
	/**
	* Whether to omit `<colgroup>`.
	* The spec describes some logic for the opening tag, but it’s easier to
	* implement in the closing tag, to the same effect, so we handle it there
	* instead.
	*
	* @param {Element} node
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the opening tag can be omitted.
	*/
	function colgroup(node$1, index, parent) {
		const previous = siblingBefore(parent, index);
		const head$1 = siblingAfter(node$1, -1, true);
		if (parent && previous && previous.type === "element" && previous.tagName === "colgroup" && closing(previous, parent.children.indexOf(previous), parent)) return false;
		return Boolean(head$1 && head$1.type === "element" && head$1.tagName === "col");
	}
	/**
	* Whether to omit `<tbody>`.
	*
	* @param {Element} node
	*   Element.
	* @param {number | undefined} index
	*   Index of element in parent.
	* @param {Parents | undefined} parent
	*   Parent of element.
	* @returns {boolean}
	*   Whether the opening tag can be omitted.
	*/
	function tbody(node$1, index, parent) {
		const previous = siblingBefore(parent, index);
		const head$1 = siblingAfter(node$1, -1);
		if (parent && previous && previous.type === "element" && (previous.tagName === "thead" || previous.tagName === "tbody") && closing(previous, parent.children.indexOf(previous), parent)) return false;
		return Boolean(head$1 && head$1.type === "element" && head$1.tagName === "tr");
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/handle/element.js
/**
	* @import {Element, Parents, Properties} from 'hast'
	* @import {State} from '../index.js'
	*/
	/**
	* Maps of subsets.
	*
	* Each value is a matrix of tuples.
	* The value at `0` causes parse errors, the value at `1` is valid.
	* Of both, the value at `0` is unsafe, and the value at `1` is safe.
	*
	* @type {Record<'double' | 'name' | 'single' | 'unquoted', Array<[Array<string>, Array<string>]>>}
	*/
	const constants = {
		name: [["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")], ["\0	\n\f\r \"&'/<=>".split(""), "\0	\n\f\r \"&'/<=>`".split("")]],
		unquoted: [["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")], ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]],
		single: [["&'".split(""), "\"&'`".split("")], ["\0&'".split(""), "\0\"&'`".split("")]],
		double: [["\"&".split(""), "\"&'`".split("")], ["\0\"&".split(""), "\0\"&'`".split("")]]
	};
	/**
	* Serialize an element node.
	*
	* @param {Element} node
	*   Node to handle.
	* @param {number | undefined} index
	*   Index of `node` in `parent.
	* @param {Parents | undefined} parent
	*   Parent of `node`.
	* @param {State} state
	*   Info passed around about the current state.
	* @returns {string}
	*   Serialized node.
	*/
	function element(node$1, index, parent, state) {
		const schema = state.schema;
		const omit = schema.space === "svg" ? false : state.settings.omitOptionalTags;
		let selfClosing = schema.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node$1.tagName.toLowerCase());
		/** @type {Array<string>} */
		const parts = [];
		/** @type {string} */
		let last;
		if (schema.space === "html" && node$1.tagName === "svg") state.schema = svg;
		const attributes = serializeAttributes(state, node$1.properties);
		const content = state.all(schema.space === "html" && node$1.tagName === "template" ? node$1.content : node$1);
		state.schema = schema;
		if (content) selfClosing = false;
		if (attributes || !omit || !opening(node$1, index, parent)) {
			parts.push("<", node$1.tagName, attributes ? " " + attributes : "");
			if (selfClosing && (schema.space === "svg" || state.settings.closeSelfClosing)) {
				last = attributes.charAt(attributes.length - 1);
				if (!state.settings.tightSelfClosing || last === "/" || last && last !== "\"" && last !== "'") parts.push(" ");
				parts.push("/");
			}
			parts.push(">");
		}
		parts.push(content);
		if (!selfClosing && (!omit || !closing(node$1, index, parent))) parts.push("</" + node$1.tagName + ">");
		return parts.join("");
	}
	/**
	* @param {State} state
	* @param {Properties | null | undefined} properties
	* @returns {string}
	*/
	function serializeAttributes(state, properties) {
		/** @type {Array<string>} */
		const values = [];
		let index = -1;
		/** @type {string} */
		let key$1;
		if (properties) {
			for (key$1 in properties) if (properties[key$1] !== null && properties[key$1] !== void 0) {
				const value = serializeAttribute(state, key$1, properties[key$1]);
				if (value) values.push(value);
			}
		}
		while (++index < values.length) {
			const last = state.settings.tightAttributes ? values[index].charAt(values[index].length - 1) : void 0;
			if (index !== values.length - 1 && last !== "\"" && last !== "'") values[index] += " ";
		}
		return values.join("");
	}
	/**
	* @param {State} state
	* @param {string} key
	* @param {Properties[keyof Properties]} value
	* @returns {string}
	*/
	function serializeAttribute(state, key$1, value) {
		const info = find(state.schema, key$1);
		const x = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
		const y$1 = state.settings.allowDangerousCharacters ? 0 : 1;
		let quote = state.quote;
		/** @type {string | undefined} */
		let result;
		if (info.overloadedBoolean && (value === info.attribute || value === "")) value = true;
		else if ((info.boolean || info.overloadedBoolean) && (typeof value !== "string" || value === info.attribute || value === "")) value = Boolean(value);
		if (value === null || value === void 0 || value === false || typeof value === "number" && Number.isNaN(value)) return "";
		const name = stringifyEntities(info.attribute, Object.assign({}, state.settings.characterReferences, { subset: constants.name[x][y$1] }));
		if (value === true) return name;
		value = Array.isArray(value) ? (info.commaSeparated ? stringify : stringify$1)(value, { padLeft: !state.settings.tightCommaSeparatedLists }) : String(value);
		if (state.settings.collapseEmptyAttributes && !value) return name;
		if (state.settings.preferUnquoted) result = stringifyEntities(value, Object.assign({}, state.settings.characterReferences, {
			attribute: true,
			subset: constants.unquoted[x][y$1]
		}));
		if (result !== value) {
			if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) quote = state.alternative;
			result = quote + stringifyEntities(value, Object.assign({}, state.settings.characterReferences, {
				subset: (quote === "'" ? constants.single : constants.double)[x][y$1],
				attribute: true
			})) + quote;
		}
		return name + (result ? "=" + result : result);
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/handle/text.js
/**
	* @import {Parents, Text} from 'hast'
	* @import {Raw} from 'mdast-util-to-hast'
	* @import {State} from '../index.js'
	*/
	const textEntitySubset = ["<", "&"];
	/**
	* Serialize a text node.
	*
	* @param {Raw | Text} node
	*   Node to handle.
	* @param {number | undefined} _
	*   Index of `node` in `parent.
	* @param {Parents | undefined} parent
	*   Parent of `node`.
	* @param {State} state
	*   Info passed around about the current state.
	* @returns {string}
	*   Serialized node.
	*/
	function text(node$1, _$1, parent, state) {
		return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node$1.value : stringifyEntities(node$1.value, Object.assign({}, state.settings.characterReferences, { subset: textEntitySubset }));
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/handle/raw.js
/**
	* @import {Parents} from 'hast'
	* @import {Raw} from 'mdast-util-to-hast'
	* @import {State} from '../index.js'
	*/
	/**
	* Serialize a raw node.
	*
	* @param {Raw} node
	*   Node to handle.
	* @param {number | undefined} index
	*   Index of `node` in `parent.
	* @param {Parents | undefined} parent
	*   Parent of `node`.
	* @param {State} state
	*   Info passed around about the current state.
	* @returns {string}
	*   Serialized node.
	*/
	function raw(node$1, index, parent, state) {
		return state.settings.allowDangerousHtml ? node$1.value : text(node$1, index, parent, state);
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/handle/root.js
/**
	* @import {Parents, Root} from 'hast'
	* @import {State} from '../index.js'
	*/
	/**
	* Serialize a root.
	*
	* @param {Root} node
	*   Node to handle.
	* @param {number | undefined} _1
	*   Index of `node` in `parent.
	* @param {Parents | undefined} _2
	*   Parent of `node`.
	* @param {State} state
	*   Info passed around about the current state.
	* @returns {string}
	*   Serialized node.
	*/
	function root(node$1, _1, _2, state) {
		return state.all(node$1);
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/handle/index.js
/**
	* @import {Nodes, Parents} from 'hast'
	* @import {State} from '../index.js'
	*/
	/**
	* @type {(node: Nodes, index: number | undefined, parent: Parents | undefined, state: State) => string}
	*/
	const handle = zwitch("type", {
		invalid,
		unknown,
		handlers: {
			comment,
			doctype,
			element,
			raw,
			root,
			text
		}
	});
	/**
	* Fail when a non-node is found in the tree.
	*
	* @param {unknown} node
	*   Unknown value.
	* @returns {never}
	*   Never.
	*/
	function invalid(node$1) {
		throw new Error("Expected node, not `" + node$1 + "`");
	}
	/**
	* Fail when a node with an unknown type is found in the tree.
	*
	* @param {unknown} node_
	*  Unknown node.
	* @returns {never}
	*   Never.
	*/
	function unknown(node_) {
		const node$1 = node_;
		throw new Error("Cannot compile unknown node `" + node$1.type + "`");
	}

//#endregion
//#region ../../node_modules/.pnpm/hast-util-to-html@9.0.5/node_modules/hast-util-to-html/lib/index.js
/**
	* @import {Nodes, Parents, RootContent} from 'hast'
	* @import {Schema} from 'property-information'
	* @import {Options as StringifyEntitiesOptions} from 'stringify-entities'
	*/
	/**
	* @typedef {Omit<StringifyEntitiesOptions, 'attribute' | 'escapeOnly' | 'subset'>} CharacterReferences
	*
	* @typedef Options
	*   Configuration.
	* @property {boolean | null | undefined} [allowDangerousCharacters=false]
	*   Do not encode some characters which cause XSS vulnerabilities in older
	*   browsers (default: `false`).
	*
	*   > ⚠️ **Danger**: only set this if you completely trust the content.
	* @property {boolean | null | undefined} [allowDangerousHtml=false]
	*   Allow `raw` nodes and insert them as raw HTML (default: `false`).
	*
	*   When `false`, `Raw` nodes are encoded.
	*
	*   > ⚠️ **Danger**: only set this if you completely trust the content.
	* @property {boolean | null | undefined} [allowParseErrors=false]
	*   Do not encode characters which cause parse errors (even though they work),
	*   to save bytes (default: `false`).
	*
	*   Not used in the SVG space.
	*
	*   > 👉 **Note**: intentionally creates parse errors in markup (how parse
	*   > errors are handled is well defined, so this works but isn’t pretty).
	* @property {boolean | null | undefined} [bogusComments=false]
	*   Use “bogus comments” instead of comments to save byes: `<?charlie>`
	*   instead of `<!--charlie-->` (default: `false`).
	*
	*   > 👉 **Note**: intentionally creates parse errors in markup (how parse
	*   > errors are handled is well defined, so this works but isn’t pretty).
	* @property {CharacterReferences | null | undefined} [characterReferences]
	*   Configure how to serialize character references (optional).
	* @property {boolean | null | undefined} [closeEmptyElements=false]
	*   Close SVG elements without any content with slash (`/`) on the opening tag
	*   instead of an end tag: `<circle />` instead of `<circle></circle>`
	*   (default: `false`).
	*
	*   See `tightSelfClosing` to control whether a space is used before the
	*   slash.
	*
	*   Not used in the HTML space.
	* @property {boolean | null | undefined} [closeSelfClosing=false]
	*   Close self-closing nodes with an extra slash (`/`): `<img />` instead of
	*   `<img>` (default: `false`).
	*
	*   See `tightSelfClosing` to control whether a space is used before the
	*   slash.
	*
	*   Not used in the SVG space.
	* @property {boolean | null | undefined} [collapseEmptyAttributes=false]
	*   Collapse empty attributes: get `class` instead of `class=""` (default:
	*   `false`).
	*
	*   Not used in the SVG space.
	*
	*   > 👉 **Note**: boolean attributes (such as `hidden`) are always collapsed.
	* @property {boolean | null | undefined} [omitOptionalTags=false]
	*   Omit optional opening and closing tags (default: `false`).
	*
	*   For example, in `<ol><li>one</li><li>two</li></ol>`, both `</li>` closing
	*   tags can be omitted.
	*   The first because it’s followed by another `li`, the last because it’s
	*   followed by nothing.
	*
	*   Not used in the SVG space.
	* @property {boolean | null | undefined} [preferUnquoted=false]
	*   Leave attributes unquoted if that results in less bytes (default: `false`).
	*
	*   Not used in the SVG space.
	* @property {boolean | null | undefined} [quoteSmart=false]
	*   Use the other quote if that results in less bytes (default: `false`).
	* @property {Quote | null | undefined} [quote='"']
	*   Preferred quote to use (default: `'"'`).
	* @property {Space | null | undefined} [space='html']
	*   When an `<svg>` element is found in the HTML space, this package already
	*   automatically switches to and from the SVG space when entering and exiting
	*   it (default: `'html'`).
	*
	*   > 👉 **Note**: hast is not XML.
	*   > It supports SVG as embedded in HTML.
	*   > It does not support the features available in XML.
	*   > Passing SVG might break but fragments of modern SVG should be fine.
	*   > Use [`xast`][xast] if you need to support SVG as XML.
	* @property {boolean | null | undefined} [tightAttributes=false]
	*   Join attributes together, without whitespace, if possible: get
	*   `class="a b"title="c d"` instead of `class="a b" title="c d"` to save
	*   bytes (default: `false`).
	*
	*   Not used in the SVG space.
	*
	*   > 👉 **Note**: intentionally creates parse errors in markup (how parse
	*   > errors are handled is well defined, so this works but isn’t pretty).
	* @property {boolean | null | undefined} [tightCommaSeparatedLists=false]
	*   Join known comma-separated attribute values with just a comma (`,`),
	*   instead of padding them on the right as well (`,␠`, where `␠` represents a
	*   space) (default: `false`).
	* @property {boolean | null | undefined} [tightDoctype=false]
	*   Drop unneeded spaces in doctypes: `<!doctypehtml>` instead of
	*   `<!doctype html>` to save bytes (default: `false`).
	*
	*   > 👉 **Note**: intentionally creates parse errors in markup (how parse
	*   > errors are handled is well defined, so this works but isn’t pretty).
	* @property {boolean | null | undefined} [tightSelfClosing=false]
	*   Do not use an extra space when closing self-closing elements: `<img/>`
	*   instead of `<img />` (default: `false`).
	*
	*   > 👉 **Note**: only used if `closeSelfClosing: true` or
	*   > `closeEmptyElements: true`.
	* @property {boolean | null | undefined} [upperDoctype=false]
	*   Use a `<!DOCTYPE…` instead of `<!doctype…` (default: `false`).
	*
	*   Useless except for XHTML.
	* @property {ReadonlyArray<string> | null | undefined} [voids]
	*   Tag names of elements to serialize without closing tag (default: `html-void-elements`).
	*
	*   Not used in the SVG space.
	*
	*   > 👉 **Note**: It’s highly unlikely that you want to pass this, because
	*   > hast is not for XML, and HTML will not add more void elements.
	*
	* @typedef {'"' | "'"} Quote
	*   HTML quotes for attribute values.
	*
	* @typedef {Omit<Required<{[key in keyof Options]: Exclude<Options[key], null | undefined>}>, 'space' | 'quote'>} Settings
	*
	* @typedef {'html' | 'svg'} Space
	*   Namespace.
	*
	* @typedef State
	*   Info passed around about the current state.
	* @property {(node: Parents | undefined) => string} all
	*   Serialize the children of a parent node.
	* @property {Quote} alternative
	*   Alternative quote.
	* @property {(node: Nodes, index: number | undefined, parent: Parents | undefined) => string} one
	*   Serialize one node.
	* @property {Quote} quote
	*   Preferred quote.
	* @property {Schema} schema
	*   Current schema.
	* @property {Settings} settings
	*   User configuration.
	*/
	/** @type {Options} */
	const emptyOptions = {};
	/** @type {CharacterReferences} */
	const emptyCharacterReferences = {};
	/** @type {Array<never>} */
	const emptyChildren = [];
	/**
	* Serialize hast as HTML.
	*
	* @param {Array<RootContent> | Nodes} tree
	*   Tree to serialize.
	* @param {Options | null | undefined} [options]
	*   Configuration (optional).
	* @returns {string}
	*   Serialized HTML.
	*/
	function toHtml(tree, options) {
		const options_ = options || emptyOptions;
		const quote = options_.quote || "\"";
		const alternative = quote === "\"" ? "'" : "\"";
		if (quote !== "\"" && quote !== "'") throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
		return {
			one,
			all,
			settings: {
				omitOptionalTags: options_.omitOptionalTags || false,
				allowParseErrors: options_.allowParseErrors || false,
				allowDangerousCharacters: options_.allowDangerousCharacters || false,
				quoteSmart: options_.quoteSmart || false,
				preferUnquoted: options_.preferUnquoted || false,
				tightAttributes: options_.tightAttributes || false,
				upperDoctype: options_.upperDoctype || false,
				tightDoctype: options_.tightDoctype || false,
				bogusComments: options_.bogusComments || false,
				tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
				tightSelfClosing: options_.tightSelfClosing || false,
				collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
				allowDangerousHtml: options_.allowDangerousHtml || false,
				voids: options_.voids || htmlVoidElements,
				characterReferences: options_.characterReferences || emptyCharacterReferences,
				closeSelfClosing: options_.closeSelfClosing || false,
				closeEmptyElements: options_.closeEmptyElements || false
			},
			schema: options_.space === "svg" ? svg : html,
			quote,
			alternative
		}.one(Array.isArray(tree) ? {
			type: "root",
			children: tree
		} : tree, void 0, void 0);
	}
	/**
	* Serialize a node.
	*
	* @this {State}
	*   Info passed around about the current state.
	* @param {Nodes} node
	*   Node to handle.
	* @param {number | undefined} index
	*   Index of `node` in `parent.
	* @param {Parents | undefined} parent
	*   Parent of `node`.
	* @returns {string}
	*   Serialized node.
	*/
	function one(node$1, index, parent) {
		return handle(node$1, index, parent, this);
	}
	/**
	* Serialize all children of `parent`.
	*
	* @this {State}
	*   Info passed around about the current state.
	* @param {Parents | undefined} parent
	*   Parent whose children to serialize.
	* @returns {string}
	*/
	function all(parent) {
		/** @type {Array<string>} */
		const results = [];
		const children = parent && parent.children || emptyChildren;
		let index = -1;
		while (++index < children.length) results[index] = this.one(children[index], index, parent);
		return results.join("");
	}

//#endregion
//#region ../../node_modules/.pnpm/browser-fs-access@0.35.0/node_modules/browser-fs-access/dist/index.modern.js
	const e = (() => {
		if ("undefined" == typeof self) return !1;
		if ("top" in self && self !== top) try {
			top.window.document._ = 0;
		} catch (e$1) {
			return !1;
		}
		return "showOpenFilePicker" in self;
	})(), t = e ? Promise.resolve().then(function() {
		return l;
	}) : Promise.resolve().then(function() {
		return v;
	});
	const r = e ? Promise.resolve().then(function() {
		return y;
	}) : Promise.resolve().then(function() {
		return b;
	});
	const a = e ? Promise.resolve().then(function() {
		return m;
	}) : Promise.resolve().then(function() {
		return k;
	});
	const s = async (e$1) => {
		const t$2 = await e$1.getFile();
		return t$2.handle = e$1, t$2;
	};
	var c = async (e$1 = [{}]) => {
		Array.isArray(e$1) || (e$1 = [e$1]);
		const t$2 = [];
		e$1.forEach((e$2, n$1) => {
			t$2[n$1] = {
				description: e$2.description || "Files",
				accept: {}
			}, e$2.mimeTypes ? e$2.mimeTypes.map((r$2) => {
				t$2[n$1].accept[r$2] = e$2.extensions || [];
			}) : t$2[n$1].accept["*/*"] = e$2.extensions || [];
		});
		const n = await window.showOpenFilePicker({
			id: e$1[0].id,
			startIn: e$1[0].startIn,
			types: t$2,
			multiple: e$1[0].multiple || !1,
			excludeAcceptAllOption: e$1[0].excludeAcceptAllOption || !1
		}), r$1 = await Promise.all(n.map(s));
		return e$1[0].multiple ? r$1 : r$1[0];
	}, l = {
		__proto__: null,
		default: c
	};
	function u(e$1) {
		function t$2(e$2) {
			if (Object(e$2) !== e$2) return Promise.reject(/* @__PURE__ */ new TypeError(e$2 + " is not an object."));
			var t$3 = e$2.done;
			return Promise.resolve(e$2.value).then(function(e$3) {
				return {
					value: e$3,
					done: t$3
				};
			});
		}
		return u = function(e$2) {
			this.s = e$2, this.n = e$2.next;
		}, u.prototype = {
			s: null,
			n: null,
			next: function() {
				return t$2(this.n.apply(this.s, arguments));
			},
			return: function(e$2) {
				var n = this.s.return;
				return void 0 === n ? Promise.resolve({
					value: e$2,
					done: !0
				}) : t$2(n.apply(this.s, arguments));
			},
			throw: function(e$2) {
				var n = this.s.return;
				return void 0 === n ? Promise.reject(e$2) : t$2(n.apply(this.s, arguments));
			}
		}, new u(e$1);
	}
	const p = async (e$1, t$2, n = e$1.name, r$1) => {
		const i$1 = [], a$2 = [];
		var o, s$2 = !1, c$2 = !1;
		try {
			for (var l$2, d$2 = function(e$2) {
				var t$3, n$1, r$2, i$2 = 2;
				for ("undefined" != typeof Symbol && (n$1 = Symbol.asyncIterator, r$2 = Symbol.iterator); i$2--;) {
					if (n$1 && null != (t$3 = e$2[n$1])) return t$3.call(e$2);
					if (r$2 && null != (t$3 = e$2[r$2])) return new u(t$3.call(e$2));
					n$1 = "@@asyncIterator", r$2 = "@@iterator";
				}
				throw new TypeError("Object is not async iterable");
			}(e$1.values()); s$2 = !(l$2 = await d$2.next()).done; s$2 = !1) {
				const o$1 = l$2.value, s$3 = `${n}/${o$1.name}`;
				"file" === o$1.kind ? a$2.push(o$1.getFile().then((t$3) => (t$3.directoryHandle = e$1, t$3.handle = o$1, Object.defineProperty(t$3, "webkitRelativePath", {
					configurable: !0,
					enumerable: !0,
					get: () => s$3
				})))) : "directory" !== o$1.kind || !t$2 || r$1 && r$1(o$1) || i$1.push(p(o$1, t$2, s$3, r$1));
			}
		} catch (e$2) {
			c$2 = !0, o = e$2;
		} finally {
			try {
				s$2 && null != d$2.return && await d$2.return();
			} finally {
				if (c$2) throw o;
			}
		}
		return [...(await Promise.all(i$1)).flat(), ...await Promise.all(a$2)];
	};
	var d = async (e$1 = {}) => {
		e$1.recursive = e$1.recursive || !1, e$1.mode = e$1.mode || "read";
		const t$2 = await window.showDirectoryPicker({
			id: e$1.id,
			startIn: e$1.startIn,
			mode: e$1.mode
		});
		return (await (await t$2.values()).next()).done ? [t$2] : p(t$2, e$1.recursive, void 0, e$1.skipDirectory);
	}, y = {
		__proto__: null,
		default: d
	}, f = async (e$1, t$2 = [{}], n = null, r$1 = !1, i$1 = null) => {
		Array.isArray(t$2) || (t$2 = [t$2]), t$2[0].fileName = t$2[0].fileName || "Untitled";
		const a$2 = [];
		let o = null;
		if (e$1 instanceof Blob && e$1.type ? o = e$1.type : e$1.headers && e$1.headers.get("content-type") && (o = e$1.headers.get("content-type")), t$2.forEach((e$2, t$3) => {
			a$2[t$3] = {
				description: e$2.description || "Files",
				accept: {}
			}, e$2.mimeTypes ? (0 === t$3 && o && e$2.mimeTypes.push(o), e$2.mimeTypes.map((n$1) => {
				a$2[t$3].accept[n$1] = e$2.extensions || [];
			})) : o ? a$2[t$3].accept[o] = e$2.extensions || [] : a$2[t$3].accept["*/*"] = e$2.extensions || [];
		}), n) try {
			await n.getFile();
		} catch (e$2) {
			if (n = null, r$1) throw e$2;
		}
		const s$2 = n || await window.showSaveFilePicker({
			suggestedName: t$2[0].fileName,
			id: t$2[0].id,
			startIn: t$2[0].startIn,
			types: a$2,
			excludeAcceptAllOption: t$2[0].excludeAcceptAllOption || !1
		});
		!n && i$1 && i$1(s$2);
		const c$2 = await s$2.createWritable();
		if ("stream" in e$1) return await e$1.stream().pipeTo(c$2), s$2;
		return "body" in e$1 ? (await e$1.body.pipeTo(c$2), s$2) : (await c$2.write(await e$1), await c$2.close(), s$2);
	}, m = {
		__proto__: null,
		default: f
	}, w = async (e$1 = [{}]) => (Array.isArray(e$1) || (e$1 = [e$1]), new Promise((t$2, n) => {
		const r$1 = document.createElement("input");
		r$1.type = "file";
		const i$1 = [...e$1.map((e$2) => e$2.mimeTypes || []), ...e$1.map((e$2) => e$2.extensions || [])].join();
		r$1.multiple = e$1[0].multiple || !1, r$1.accept = i$1 || "", r$1.style.display = "none", document.body.append(r$1);
		const a$2 = (e$2) => {
			"function" == typeof o && o(), t$2(e$2);
		}, o = e$1[0].legacySetup && e$1[0].legacySetup(a$2, () => o(n), r$1), s$2 = () => {
			window.removeEventListener("focus", s$2), r$1.remove();
		};
		r$1.addEventListener("click", () => {
			window.addEventListener("focus", s$2);
		}), r$1.addEventListener("change", () => {
			window.removeEventListener("focus", s$2), r$1.remove(), a$2(r$1.multiple ? Array.from(r$1.files) : r$1.files[0]);
		}), "showPicker" in HTMLInputElement.prototype ? r$1.showPicker() : r$1.click();
	})), v = {
		__proto__: null,
		default: w
	}, h = async (e$1 = [{}]) => (Array.isArray(e$1) || (e$1 = [e$1]), e$1[0].recursive = e$1[0].recursive || !1, new Promise((t$2, n) => {
		const r$1 = document.createElement("input");
		r$1.type = "file", r$1.webkitdirectory = !0;
		const i$1 = (e$2) => {
			"function" == typeof a$2 && a$2(), t$2(e$2);
		}, a$2 = e$1[0].legacySetup && e$1[0].legacySetup(i$1, () => a$2(n), r$1);
		r$1.addEventListener("change", () => {
			let t$3 = Array.from(r$1.files);
			e$1[0].recursive ? e$1[0].recursive && e$1[0].skipDirectory && (t$3 = t$3.filter((t$4) => t$4.webkitRelativePath.split("/").every((t$5) => !e$1[0].skipDirectory({
				name: t$5,
				kind: "directory"
			})))) : t$3 = t$3.filter((e$2) => 2 === e$2.webkitRelativePath.split("/").length), i$1(t$3);
		}), "showPicker" in HTMLInputElement.prototype ? r$1.showPicker() : r$1.click();
	})), b = {
		__proto__: null,
		default: h
	}, P = async (e$1, t$2 = {}) => {
		Array.isArray(t$2) && (t$2 = t$2[0]);
		const n = document.createElement("a");
		let r$1 = e$1;
		"body" in e$1 && (r$1 = await async function(e$2, t$3) {
			const n$1 = e$2.getReader(), r$2 = new ReadableStream({ start: (e$3) => async function t$4() {
				return n$1.read().then(({ done: n$2, value: r$3 }) => {
					if (!n$2) return e$3.enqueue(r$3), t$4();
					e$3.close();
				});
			}() }), a$3 = await new Response(r$2).blob();
			return n$1.releaseLock(), new Blob([a$3], { type: t$3 });
		}(e$1.body, e$1.headers.get("content-type"))), n.download = t$2.fileName || "Untitled", n.href = URL.createObjectURL(await r$1);
		const i$1 = () => {
			"function" == typeof a$2 && a$2();
		}, a$2 = t$2.legacySetup && t$2.legacySetup(i$1, () => a$2(), n);
		return n.addEventListener("click", () => {
			setTimeout(() => URL.revokeObjectURL(n.href), 3e4), i$1();
		}), n.click(), null;
	}, k = {
		__proto__: null,
		default: P
	};

//#endregion
//#region ../../packages/common/src/message.ts
	let MessageType = /* @__PURE__ */ function(MessageType$1) {
		MessageType$1[MessageType$1["Request"] = 0] = "Request";
		MessageType$1[MessageType$1["Response"] = 1] = "Response";
		return MessageType$1;
	}({});
	let id = 0;
	const uuid = () => id += 1;
	const isMessage = (message) => {
		if (typeof message !== "object" || message === null) return false;
		const { __dolphin__ } = message;
		return __dolphin__ === true;
	};
	var Port = class {
		queue = [];
		eventNameToHandlers = /* @__PURE__ */ new Map();
		constructor(from, to, options = {}) {
			this.from = from;
			this.to = to;
			this.options = options;
			window.addEventListener("message", (event) => {
				if (event.source !== window) return;
				const { data: message } = event;
				if (isMessage(message) && message.to === this.from && message.from === this.to) {
					const response = Promise.race(this.eventNameToHandlers.get(message.name)?.map((handler) => handler(message.data)) ?? []);
					if (message.type === MessageType.Request && message.async) response.then((data) => {
						window.postMessage({
							...message,
							type: MessageType.Response,
							async: false,
							from: this.from,
							to: this.to,
							data
						});
					}).catch(() => void 0);
					if (message.type === MessageType.Response && !message.async) {
						const pending = [];
						const resolved = [];
						this.queue.forEach((message$1) => {
							if (message$1.id === message$1.id) resolved.push(message$1);
							else pending.push(message$1);
						});
						this.queue = pending;
						resolved.forEach((asyncMessage) => {
							clearTimeout(asyncMessage.timer);
							asyncMessage.resolve(message.data);
						});
					}
				}
			});
		}
		send(name, data) {
			const message = {
				__dolphin__: true,
				from: this.from,
				to: this.to,
				type: MessageType.Request,
				id: uuid(),
				async: false,
				name,
				data
			};
			window.postMessage(message);
		}
		sendAsync(name, data) {
			const { promise, resolve, reject } = Promise.withResolvers();
			const asyncMessage = {
				id: uuid(),
				promise,
				resolve,
				reject,
				timer: setTimeout(() => {
					asyncMessage.timer = void 0;
					reject(/* @__PURE__ */ new Error("timeout"));
				}, this.options.timeout ?? 10 * 1e3)
			};
			this.queue.push(asyncMessage);
			const message = {
				__dolphin__: true,
				from: this.from,
				to: this.to,
				type: MessageType.Request,
				id: asyncMessage.id,
				async: true,
				name,
				data
			};
			window.postMessage(message);
			return promise;
		}
		on(name, handler) {
			const handlers$1 = this.eventNameToHandlers.get(name);
			if (handlers$1) handlers$1.push(handler);
			else this.eventNameToHandlers.set(name, [handler]);
		}
		off(name, handler) {
			const handlers$1 = this.eventNameToHandlers.get(name);
			if (handlers$1) if (handler) handlers$1.splice(handlers$1.indexOf(handler) >>> 0, 1);
			else this.eventNameToHandlers.set(name, []);
		}
	};

//#endregion
//#region src/common/message.ts
	let EventName = /* @__PURE__ */ function(EventName$1) {
		EventName$1["Console"] = "console";
		EventName$1["GetSettings"] = "get_settings";
		return EventName$1;
	}({});
	var PortImpl = class {
		_sender = null;
		_receiver = null;
		get sender() {
			this._sender ??= new Port("sender", "receiver");
			return this._sender;
		}
		get receiver() {
			this._receiver ??= new Port("receiver", "sender");
			return this._receiver;
		}
	};
	const portImpl = /* @__PURE__ */ new PortImpl();

//#endregion
//#region src/common/settings.ts
	let SettingKey = /* @__PURE__ */ function(SettingKey$1) {
		SettingKey$1["Locale"] = "general.locale";
		SettingKey$1["Theme"] = "general.theme";
		SettingKey$1["DownloadMethod"] = "download.method";
		SettingKey$1["Table"] = "general.table";
		SettingKey$1["Grid"] = "general.grid";
		SettingKey$1["TextHighlight"] = "general.text_highlight";
		SettingKey$1["DownloadFileWithUniqueName"] = "download.file_with_unique_name";
		return SettingKey$1;
	}({});
	let Theme = /* @__PURE__ */ function(Theme$1) {
		Theme$1["Light"] = "light";
		Theme$1["Dark"] = "dark";
		Theme$1["System"] = "system";
		return Theme$1;
	}({});
	let DownloadMethod = /* @__PURE__ */ function(DownloadMethod$1) {
		DownloadMethod$1["Direct"] = "direct";
		DownloadMethod$1["ShowSaveFilePicker"] = "showSaveFilePicker";
		return DownloadMethod$1;
	}({});
	let Table = /* @__PURE__ */ function(Table$1) {
		Table$1["Filtered"] = "filtered";
		Table$1["NonPhrasingContentToHTML"] = "nonPhrasingContentToHTML";
		Table$1["ToHTML"] = "toHTML";
		return Table$1;
	}({});
	let Grid = /* @__PURE__ */ function(Grid$1) {
		Grid$1["Flatten"] = "flatten";
		Grid$1["ToTable"] = "toTable";
		Grid$1["ToHTML"] = "toHTML";
		return Grid$1;
	}({});
	const fallbackSettings = {
		[SettingKey.Locale]: "en-US",
		[SettingKey.Theme]: Theme.System,
		[SettingKey.DownloadMethod]: e ? DownloadMethod.ShowSaveFilePicker : DownloadMethod.Direct,
		[SettingKey.Table]: Table.NonPhrasingContentToHTML,
		[SettingKey.Grid]: Grid.Flatten,
		[SettingKey.TextHighlight]: true,
		[SettingKey.DownloadFileWithUniqueName]: false
	};
	const getSettings = async (keys$1) => {
		try {
			return pick(defaultsDeep(await portImpl.sender.sendAsync(EventName.GetSettings, keys$1), fallbackSettings), keys$1);
		} catch (error) {
			console.error(error);
			return pick(fallbackSettings, keys$1);
		}
	};

//#endregion
//#region src/common/utils.ts
	const mapTableBySettings = (tables, settings) => {
		if (settings[SettingKey.Table] === Table.Filtered) return [];
		return tables.map((table$1) => {
			if (!table$1.inner.data?.invalid) return table$1;
			const tableIndex = table$1.parent?.children.findIndex((child) => child === table$1.inner);
			if (tableIndex !== void 0 && tableIndex !== -1) {
				const inner = {
					...table$1.inner,
					children: table$1.inner.children.map((row) => ({
						...row,
						children: row.children.map((cell) => ({
							...cell,
							children: cell.data?.invalidChildren ?? cell.children
						}))
					}))
				};
				table$1.parent?.children.splice(tableIndex, 1, inner);
				return {
					...table$1,
					inner
				};
			}
			return table$1;
		}).filter((table$1) => settings[SettingKey.Table] === Table.NonPhrasingContentToHTML ? table$1.inner.data?.invalid : true);
	};
	/**
	* Filters out redundant cells that are covered by rowSpan/colSpan
	* and adds appropriate HTML properties to the spanning cells.
	*
	* @param table The Markdown AST table to process
	*/
	const processTableSpans = (table$1) => {
		const occupied = [];
		for (let rowIndex = 0; rowIndex < table$1.children.length; rowIndex++) {
			const row = table$1.children[rowIndex];
			const newCells = [];
			for (let columnIndex = 0; columnIndex < row.children.length; columnIndex++) {
				if (occupied[rowIndex]?.[columnIndex]) continue;
				const cell = row.children[columnIndex];
				newCells.push(cell);
				const rowSpan = cell.data?.rowSpan ?? 1;
				const colSpan = cell.data?.colSpan ?? 1;
				if (rowSpan > 1 || colSpan > 1) {
					cell.data ??= {};
					cell.data.hProperties ??= {};
					if (rowSpan > 1) cell.data.hProperties["rowSpan"] = rowSpan;
					if (colSpan > 1) cell.data.hProperties["colSpan"] = colSpan;
					for (let i$1 = 0; i$1 < rowSpan; i$1++) for (let j = 0; j < colSpan; j++) {
						if (i$1 === 0 && j === 0) continue;
						const targetRow = rowIndex + i$1;
						const targetCol = columnIndex + j;
						occupied[targetRow] ??= [];
						occupied[targetRow][targetCol] = true;
					}
				}
			}
			row.children = newCells;
		}
	};
	const transformTableToHtml = (tables, options = { allowDangerousHtml: false }) => {
		tables.forEach((table$1) => {
			const tableIndex = table$1.parent?.children.findIndex((child) => child === table$1.inner);
			if (tableIndex !== void 0 && tableIndex !== -1) {
				processTableSpans(table$1.inner);
				const hastTable = toHast(table$1.inner, { allowDangerousHtml: options.allowDangerousHtml });
				if (hastTable.type === "element") hastTable.children = [{
					type: "element",
					tagName: "colgroup",
					properties: {},
					children: table$1.inner.data?.colWidths?.map((width) => ({
						type: "element",
						tagName: "col",
						properties: { width: table$1.inner.data?.type === BlockType.GRID ? `${width.toFixed(2)}%` : width },
						children: []
					})) ?? []
				}].concat(hastTable.children);
				table$1.parent?.children.splice(tableIndex, 1, {
					type: "html",
					value: toHtml(hastTable, { allowDangerousHtml: options.allowDangerousHtml })
				});
			}
		});
	};
	const transformGridToHtml = (grids, options = { allowDangerousHtml: false }) => {
		const normalizeWidthValue = (value) => {
			if (value.includes("%") || /[a-z]/i.test(value)) return value;
			const numeric = Number(value);
			if (!Number.isFinite(numeric)) return value;
			return numeric <= 1 ? `${String(numeric * 100)}%` : `${String(numeric)}px`;
		};
		const extractColumnWidths = (table$1) => {
			const colWidths = table$1.data?.colWidths;
			if (!colWidths || colWidths.length === 0) return null;
			if (table$1.children.length === 0) return null;
			const columnCount = table$1.children[0].children.length;
			if (colWidths.length !== columnCount) return null;
			return colWidths.map((value) => normalizeWidthValue(String(value)));
		};
		for (const grid of grids) {
			const gridIndex = grid.parent?.children.findIndex((child) => child === grid.inner);
			if (gridIndex !== void 0 && gridIndex !== -1) {
				const hast = toHast(grid.inner.data?.invalid ? {
					...grid.inner,
					children: grid.inner.children.map((row) => ({
						...row,
						children: row.children.map((cell) => ({
							...cell,
							children: cell.data?.invalidChildren ?? cell.children
						}))
					}))
				} : grid.inner, { allowDangerousHtml: options.allowDangerousHtml });
				const colWidths = extractColumnWidths(grid.inner);
				if (colWidths) {
					const colgroup$1 = {
						type: "element",
						tagName: "colgroup",
						properties: {},
						children: colWidths.map((width) => ({
							type: "element",
							tagName: "col",
							properties: { style: `width: ${width}` },
							children: []
						}))
					};
					if (hast.type === "element") hast.children = [colgroup$1].concat(hast.children);
				}
				grid.parent?.children.splice(gridIndex, 1, {
					type: "html",
					value: toHtml(hast, { allowDangerousHtml: options.allowDangerousHtml })
				});
			}
		}
	};
	const transformMentionUsers = async (mentionUsers) => {
		for (const user of mentionUsers) if (user.data?.parentBlockRecordId && user.data.mentionUserId) {
			await waitForFunction(() => Docx.locateBlockWithRecordId(user.data?.parentBlockRecordId ?? "").then((isSuccess) => isSuccess && document.querySelector(`a[data-token="${user.data?.mentionUserId ?? ""}"]`) !== null), { timeout: 3 * Second });
			const el = document.querySelector(`a[data-token="${user.data.mentionUserId}"]`);
			if (el?.innerText) user.value = "@" + el.innerText;
		}
	};
	const transformTableBySettings = (tables, settings) => {
		if (settings[SettingKey.Grid] === Grid.ToHTML) transformGridToHtml(tables.filter((item) => item.inner.data?.type === BlockType.GRID), { allowDangerousHtml: true });
		transformTableToHtml(mapTableBySettings(settings[SettingKey.Grid] === Grid.ToHTML ? tables.filter((item) => item.inner.data?.type !== BlockType.GRID) : tables, settings), { allowDangerousHtml: true });
	};

//#endregion
//#region src/scripts/copy-lark-docx-as-markdown.ts
	var TranslationKey = /* @__PURE__ */ function(TranslationKey$1) {
		TranslationKey$1["FAILED_TO_COPY_IMAGES"] = "failed_to_copy_images";
		TranslationKey$1["UNKNOWN_ERROR"] = "unknown_error";
		TranslationKey$1["CONTENT_LOADING"] = "content_loading";
		TranslationKey$1["NOT_SUPPORT"] = "not_support";
		TranslationKey$1["NOT_SUPPORT_DOC_1_0"] = "not_support_doc_1_0";
		return TranslationKey$1;
	}(TranslationKey || {});
	instance.init({
		lng: docx.language,
		resources: {
			en: {
				translation: {
					[TranslationKey.FAILED_TO_COPY_IMAGES]: "Failed to copy images",
					[TranslationKey.UNKNOWN_ERROR]: "Unknown error during download",
					[TranslationKey.CONTENT_LOADING]: "Part of the content is still loading and cannot be copied at the moment. Please wait for loading to complete and retry",
					[TranslationKey.NOT_SUPPORT]: "This is not a lark document page and cannot be copied as Markdown",
					[TranslationKey.NOT_SUPPORT_DOC_1_0]: "This is a old version lark document page and cannot be copied as Markdown"
				},
				...en
			},
			zh: {
				translation: {
					[TranslationKey.FAILED_TO_COPY_IMAGES]: "复制图片失败",
					[TranslationKey.UNKNOWN_ERROR]: "下载过程中出现未知错误",
					[TranslationKey.CONTENT_LOADING]: "部分内容仍在加载中，暂时无法复制。请等待加载完成后重试",
					[TranslationKey.NOT_SUPPORT]: "这不是一个飞书文档页面，无法复制为 Markdown",
					[TranslationKey.NOT_SUPPORT_DOC_1_0]: "这是一个旧版飞书文档页面，无法复制为 Markdown"
				},
				...zh
			}
		}
	}).catch(console.error);
	const main = async () => {
		if (docx.isDoc) {
			Toast.warning({ content: instance.t(TranslationKey.NOT_SUPPORT_DOC_1_0) });
			return;
		}
		if (!docx.isDocx) {
			Toast.warning({ content: instance.t(TranslationKey.NOT_SUPPORT) });
			return;
		}
		if (!docx.isReady()) {
			Toast.warning({ content: instance.t(TranslationKey.CONTENT_LOADING) });
			return;
		}
		const settings = await getSettings([
			SettingKey.Table,
			SettingKey.Grid,
			SettingKey.TextHighlight
		]);
		const { root: root$3, images, tableWithParents, mentionUsers } = docx.intoMarkdownAST({
			highlight: settings[SettingKey.TextHighlight],
			flatGrid: settings[SettingKey.Grid] === Grid.Flatten
		});
		await transformMentionUsers(mentionUsers);
		const tokens = images.map((image$2) => {
			if (!image$2.data?.token) return null;
			const { token } = image$2.data;
			const publicUrl = generatePublicUrl(token);
			const code$2 = new URL(publicUrl).searchParams.get("code");
			if (!code$2) return null;
			image$2.url = publicUrl;
			return [token, code$2];
		}).filter(isDefined);
		transformTableBySettings(tableWithParents, settings);
		const markdown = Docx.stringify(root$3);
		if (!window.document.hasFocus()) {
			if (!await confirm()) return;
		}
		await Object.getPrototypeOf(window.navigator.clipboard).write.bind(window.navigator.clipboard)([new ClipboardItem({ "text/plain": new Blob([markdown], { type: "text/plain" }) })]);
		if (tokens.length > 0) {
			if (!await makePublicUrlEffective(Object.fromEntries(tokens))) Toast.error({ content: instance.t(TranslationKey.FAILED_TO_COPY_IMAGES) });
		}
	};
	main().catch((error) => {
		Toast.error({
			content: instance.t(TranslationKey.UNKNOWN_ERROR),
			actionText: instance.t(CommonTranslationKey.CONFIRM_REPORT_BUG, { ns: Namespace.COMMON }),
			onActionClick: () => {
				reportBug(error);
			}
		});
	});

//#endregion
})();