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
	const copy = (a$1, s$1, t$3) => {
		a$1.forEach((m$1) => {
			if (s$1[m$1]) t$3[m$1] = s$1[m$1];
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
		let p$2 = path.slice(0, path.length - 1);
		let last = getLastOfPath(object, p$2, Object);
		while (last.obj === void 0 && p$2.length) {
			e$1 = `${p$2[p$2.length - 1]}.${e$1}`;
			p$2 = p$2.slice(0, p$2.length - 1);
			last = getLastOfPath(object, p$2, Object);
			if (last && last.obj && typeof last.obj[`${last.k}.${e$1}`] !== "undefined") last.obj = void 0;
		}
		last.obj[`${last.k}.${e$1}`] = newValue;
	};
	const pushPath = (object, path, newValue, concat$1) => {
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
		if (isString$1(data)) return data.replace(/[&<>"'\/]/g, (s$1) => _entityMap[s$1]);
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
		const possibleChars = chars.filter((c$1) => nsSeparator.indexOf(c$1) < 0 && keySeparator.indexOf(c$1) < 0);
		if (possibleChars.length === 0) return true;
		const r$1 = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c$1) => c$1 === "?" ? "\\?" : c$1).join("|")})`);
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
		for (let i = 0; i < tokens.length;) {
			if (!current || typeof current !== "object") return;
			let next;
			let nextPath = "";
			for (let j = i; j < tokens.length; ++j) {
				if (j !== i) nextPath += keySeparator;
				nextPath += tokens[j];
				next = current[nextPath];
				if (next !== void 0) {
					if ([
						"string",
						"number",
						"boolean"
					].indexOf(typeof next) > -1 && j < tokens.length - 1) continue;
					i += j - i + 1;
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
				for (let i = 0; i < numTimesAdded; i++) observer(...args);
			});
			if (this.observers["*"]) Array.from(this.observers["*"].entries()).forEach((_ref2) => {
				let [observer, numTimesAdded] = _ref2;
				for (let i = 0; i < numTimesAdded; i++) observer.apply(observer, [event, ...args]);
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
					if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) for (let i = 0; i < fallbackLngs.length; i++) lngs.push(fallbackLngs[i]);
					else if (this.options.saveMissingTo === "all") lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
					else lngs.push(options.lng || this.language);
					const send = (l$1, k$1, specificDefaultValue) => {
						const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
						if (this.options.missingKeyHandler) this.options.missingKeyHandler(l$1, namespace, k$1, defaultForMissing, updateMissing, options);
						else if (this.backendConnector && this.backendConnector.saveMissing) this.backendConnector.saveMissing(l$1, namespace, k$1, defaultForMissing, updateMissing, options);
						this.emit("missingKey", l$1, namespace, k$1, res);
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
			const p$2 = code$2.split("-");
			if (p$2.length === 2) return null;
			p$2.pop();
			if (p$2[p$2.length - 1].toLowerCase() === "x") return null;
			return this.formatLanguageCode(p$2.join("-"));
		}
		getLanguagePartFromCode(code$2) {
			code$2 = getCleanedCode(code$2);
			if (!code$2 || code$2.indexOf("-") < 0) return code$2;
			const p$2 = code$2.split("-");
			return this.formatLanguageCode(p$2[0]);
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
				let p$2 = code$2.split("-");
				if (this.options.lowerCaseLng) p$2 = p$2.map((part) => part.toLowerCase());
				else if (p$2.length === 2) {
					p$2[0] = p$2[0].toLowerCase();
					p$2[1] = p$2[1].toUpperCase();
					if (specialCases.indexOf(p$2[1].toLowerCase()) > -1) p$2[1] = capitalize$1(p$2[1].toLowerCase());
				} else if (p$2.length === 3) {
					p$2[0] = p$2[0].toLowerCase();
					if (p$2[1].length === 2) p$2[1] = p$2[1].toUpperCase();
					if (p$2[0] !== "sgn" && p$2[2].length === 2) p$2[2] = p$2[2].toUpperCase();
					if (specialCases.indexOf(p$2[1].toLowerCase()) > -1) p$2[1] = capitalize$1(p$2[1].toLowerCase());
					if (specialCases.indexOf(p$2[2].toLowerCase()) > -1) p$2[2] = capitalize$1(p$2[2].toLowerCase());
				}
				return p$2.join("-");
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
			const addCode = (c$1) => {
				if (!c$1) return;
				if (this.isSupportedCode(c$1)) codes.push(c$1);
				else this.logger.warn(`rejecting language code not found in supportedLngs: ${c$1}`);
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
			set.lngs.forEach((l$1) => {
				rules[l$1] = {
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
				const p$2 = key$1.split(this.formatSeparator);
				const k$1 = p$2.shift().trim();
				const f$1 = p$2.join(this.formatSeparator).trim();
				return this.format(deepFindWithDefaults(data, defaultData, k$1, this.options.keySeparator, this.options.ignoreJSONStructure), f$1, lng, {
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
				const c$1 = key$1.split(/* @__PURE__ */ new RegExp(`${sep}[ ]*{`));
				let optionsString = `{${c$1[1]}`;
				key$1 = c$1[0];
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
				if (doReduce) value = formatters.reduce((v$1, f$1) => this.format(v$1, f$1, options.lng, {
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
			const p$2 = formatStr.split("(");
			formatName = p$2[0].toLowerCase().trim();
			const optStr = p$2[1].substring(0, p$2[1].length - 1);
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
			if (formats.length > 1 && formats[0].indexOf("(") > 1 && formats[0].indexOf(")") < 0 && formats.find((f$1) => f$1.indexOf(")") > -1)) {
				const lastIndex = formats.findIndex((f$1) => f$1.indexOf(")") > -1);
				formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
			}
			return formats.reduce((mem, f$1) => {
				const { formatName, formatOptions } = parseFormatStr(f$1);
				if (this.formats[formatName]) {
					let formatted = mem;
					try {
						const valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
						const l$1 = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
						formatted = this.formats[formatName](mem, l$1, {
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
			const s$1 = name.split("|");
			const lng = s$1[0];
			const ns = s$1[1];
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
					Object.keys(q.loaded).forEach((l$1) => {
						if (!loaded[l$1]) loaded[l$1] = {};
						const loadedKeys = q.loaded[l$1];
						if (loadedKeys.length) loadedKeys.forEach((n) => {
							if (loaded[l$1][n] === void 0) loaded[l$1][n] = true;
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
			const s$1 = name.split("|");
			const lng = s$1[0];
			const ns = s$1[1];
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
				const s$1 = this.services;
				s$1.logger = baseLogger;
				s$1.resourceStore = this.store;
				s$1.languageUtils = lu;
				s$1.pluralResolver = new PluralResolver(lu, {
					prepend: this.options.pluralSeparator,
					compatibilityJSON: this.options.compatibilityJSON,
					simplifyPluralSuffix: this.options.simplifyPluralSuffix
				});
				if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
					s$1.formatter = createClassOnDemand(formatter);
					s$1.formatter.init(s$1, this.options);
					this.options.interpolation.format = s$1.formatter.format.bind(s$1.formatter);
				}
				s$1.interpolator = new Interpolator(this.options);
				s$1.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) };
				s$1.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s$1.resourceStore, s$1, this.options);
				s$1.backendConnector.on("*", function(event) {
					for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
					_this.emit(event, ...args);
				});
				if (this.modules.languageDetector) {
					s$1.languageDetector = createClassOnDemand(this.modules.languageDetector);
					if (s$1.languageDetector.init) s$1.languageDetector.init(s$1, this.options.detection, this.options);
				}
				if (this.modules.i18nFormat) {
					s$1.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
					if (s$1.i18nFormat.init) s$1.i18nFormat.init(this);
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
				const finish = (err, t$3) => {
					this.isInitializing = false;
					if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
					this.isInitialized = true;
					if (!this.options.isClone) this.logger.log("initialized", this.options);
					this.emit("initialized", this.options);
					deferred.resolve(t$3);
					callback(err, t$3);
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
				const append$1 = (lng) => {
					if (!lng) return;
					if (lng === "cimode") return;
					this.services.languageUtils.toResolveHierarchy(lng).forEach((l$1) => {
						if (l$1 === "cimode") return;
						if (toLoad.indexOf(l$1) < 0) toLoad.push(l$1);
					});
				};
				if (!usedLng) this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((l$1) => append$1(l$1));
				else append$1(usedLng);
				if (this.options.preload) this.options.preload.forEach((l$1) => append$1(l$1));
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
		setResolvedLanguage(l$1) {
			if (!l$1 || !this.languages) return;
			if (["cimode", "dev"].indexOf(l$1) > -1) return;
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
			const setLngProps = (l$1) => {
				this.language = l$1;
				this.languages = this.services.languageUtils.toResolveHierarchy(l$1);
				this.resolvedLanguage = void 0;
				this.setResolvedLanguage(l$1);
			};
			const done = (err, l$1) => {
				if (l$1) {
					setLngProps(l$1);
					this.translator.changeLanguage(l$1);
					this.isLanguageChangingTo = void 0;
					this.emit("languageChanged", l$1);
					this.logger.log("languageChanged", l$1);
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
				const l$1 = isString$1(lngs) ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
				if (l$1) {
					if (!this.language) setLngProps(l$1);
					if (!this.translator.language) this.translator.changeLanguage(l$1);
					if (this.services.languageDetector && this.services.languageDetector.cacheUserLanguage) this.services.languageDetector.cacheUserLanguage(l$1);
				}
				this.loadResources(l$1, (err) => {
					done(err, l$1);
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
			const loadNotPending = (l$1, n) => {
				const loadState = this.services.backendConnector.state[`${l$1}|${n}`];
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
	const t$2 = instance.t;
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
	async function toBlob$1(node$1, options = {}) {
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
	const compare = (a$1, b$1) => {
		if (a$1 === b$1) return 0;
		return a$1 > b$1 ? 1 : -1;
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
	function configure$1(base, extension) {
		let index = -1;
		/** @type {keyof Options} */
		let key$1;
		if (extension.extensions) while (++index < extension.extensions.length) configure$1(base, extension.extensions[index]);
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
	function blockquote$1(node$1, _, state, info) {
		const exit = state.enter("blockquote");
		const tracker = state.createTracker(info);
		tracker.move("> ");
		tracker.shift(2);
		const value = state.indentLines(state.containerFlow(node$1, tracker.current()), map$1);
		exit();
		return value;
	}
	/** @type {Map} */
	function map$1(line, _, blank) {
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
	function hardBreak$1(_, _1, state, info) {
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
	function code$1(node$1, _, state, info) {
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
	function map(line, _, blank) {
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
	function definition(node$1, _, state, info) {
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
	function emphasis$1(node$1, _, state, info) {
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
	function emphasisPeek(_, _1, state) {
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
	function color(d$1) {
		return d$1;
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
	function heading$1(node$1, _, state, info) {
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
	function image$1(node$1, _, state, info) {
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
	function imageReference$1(node$1, _, state, info) {
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
	function inlineCode$1(node$1, _, state) {
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
	function link$1(node$1, _, state, info) {
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
	function linkPeek(node$1, _, state) {
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
	function linkReference$1(node$1, _, state, info) {
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
	function paragraph$1(node$1, _, state, info) {
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
	function root$2(node$1, _, state, info) {
		return (node$1.children.some(function(d$1) {
			return phrasing(d$1);
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
	function strong$1(node$1, _, state, info) {
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
	function strongPeek(_, _1, state) {
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
	function text$2(node$1, _, state, info) {
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
	function thematicBreak$1(_, _1, state) {
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
	function safe(state, input, config$1) {
		const value = (config$1.before || "") + (input || "") + (config$1.after || "");
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
		let start = config$1.before ? config$1.before.length : 0;
		const end = value.length - (config$1.after ? config$1.after.length : 0);
		index = -1;
		while (++index < positions.length) {
			const position$1 = positions[index];
			if (position$1 < start || position$1 >= end) continue;
			if (position$1 + 1 < end && positions[index + 1] === position$1 + 1 && infos[position$1].after && !infos[position$1 + 1].before && !infos[position$1 + 1].after || positions[index - 1] === position$1 - 1 && infos[position$1].before && !infos[position$1 - 1].before && !infos[position$1 - 1].after) continue;
			if (start !== position$1) result.push(escapeBackslashes(value.slice(start, position$1), "\\"));
			start = position$1;
			if (/[!-/:-@[-`{-~]/.test(value.charAt(position$1)) && (!config$1.encode || !config$1.encode.includes(value.charAt(position$1)))) result.push("\\");
			else {
				result.push(encodeCharacterReference(value.charCodeAt(position$1)));
				start++;
			}
		}
		result.push(escapeBackslashes(value.slice(start, end), config$1.after));
		return result.join("");
	}
	/**
	* @param {number} a
	* @param {number} b
	* @returns {number}
	*/
	function numerical(a$1, b$1) {
		return a$1 - b$1;
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
	function track(config$1) {
		/* c8 ignore next 5 */
		const options = config$1 || {};
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
		configure$1(state, settings);
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
	function safeBound(value, config$1) {
		return safe(this, value, config$1);
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
	function handleDelete(node$1, _, state, info) {
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
	function markdownTable(table$3, options) {
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
		while (++rowIndex < table$3.length) {
			/** @type {Array<string>} */
			const row$1 = [];
			/** @type {Array<number>} */
			const sizes$1 = [];
			let columnIndex$1 = -1;
			if (table$3[rowIndex].length > mostCellsPerRow) mostCellsPerRow = table$3[rowIndex].length;
			while (++columnIndex$1 < table$3[rowIndex].length) {
				const cell = serialize$1(table$3[rowIndex][columnIndex$1]);
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
		function handleTable(node$1, _, state, info) {
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
		function handleTableRow(node$1, _, state, info) {
			const value = serializeData([handleTableRowAsData(node$1, state, info)]);
			return value.slice(0, value.indexOf("\n"));
		}
		/**
		* @type {ToMarkdownHandle}
		* @param {TableCell} node
		*/
		function handleTableCell(node$1, _, state, info) {
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
		function math(node$1, _, state, info) {
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
		function inlineMath(node$1, _, state) {
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
		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];
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
		for (let i = 0; i < minLength; i++) if (isPlainObject$1(targetArray[i]) && isPlainObject$1(sourceArray[i])) defaultsDeepRecursive(targetArray[i], sourceArray[i], stack);
		for (let i = minLength; i < sourceArray.length; i++) targetArray.push(sourceArray[i]);
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
		for (let i = 0; i < keys$1.length; i++) {
			const key$1 = keys$1[i];
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
			for (let i = 0; i < keys$1.length; i++) {
				const key$1 = keys$1[i];
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
			return marks.sort((a$1, b$1) => compare(markToPriority.get(a$1) ?? 0, markToPriority.get(b$1) ?? 0));
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
								return await toBlob$1(svgElement);
							} }
						};
					};
					const image$2 = diagramToImage(block);
					this.images.push(image$2);
					return this.normalizeImage(image$2);
				}
				case BlockType.TABLE:
				case BlockType.GRID: {
					let table$3 = {
						type: "table",
						children: [],
						data: {
							type: block.type,
							...block.type === BlockType.TABLE ? { cellSet: block.snapshot.cell_set } : {}
						}
					};
					table$3 = this.transformParentBlock(block, () => table$3, (nodes) => {
						const tableCells = nodes.filter(isTableCell);
						const widthCells = tableCells.filter((cell) => typeof cell.data?.width === "number");
						const colWidths = block.type === BlockType.GRID ? widthCells.length === tableCells.length ? widthCells.map((cell) => cell.data.width) : void 0 : block.snapshot.columns_id.map((id$1) => block.snapshot.column_set[id$1].column_width);
						table$3.data = {
							...table$3.data,
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
						inner: table$3,
						parent: this.parent
					});
					return table$3;
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
						for (let i = 0; i < mergedNodes.length; i++) {
							const node$1 = mergedNodes[i];
							const nextNode = mergedNodes.at(i + 1);
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
//#region ../../node_modules/.pnpm/browser-fs-access@0.35.0/node_modules/browser-fs-access/dist/index.modern.js
	const e = (() => {
		if ("undefined" == typeof self) return !1;
		if ("top" in self && self !== top) try {
			top.window.document._ = 0;
		} catch (e$1) {
			return !1;
		}
		return "showOpenFilePicker" in self;
	})(), t$1 = e ? Promise.resolve().then(function() {
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
	async function o(...e$1) {
		return (await a).default(...e$1);
	}
	const s = async (e$1) => {
		const t$3 = await e$1.getFile();
		return t$3.handle = e$1, t$3;
	};
	var c = async (e$1 = [{}]) => {
		Array.isArray(e$1) || (e$1 = [e$1]);
		const t$3 = [];
		e$1.forEach((e$2, n$1) => {
			t$3[n$1] = {
				description: e$2.description || "Files",
				accept: {}
			}, e$2.mimeTypes ? e$2.mimeTypes.map((r$2) => {
				t$3[n$1].accept[r$2] = e$2.extensions || [];
			}) : t$3[n$1].accept["*/*"] = e$2.extensions || [];
		});
		const n = await window.showOpenFilePicker({
			id: e$1[0].id,
			startIn: e$1[0].startIn,
			types: t$3,
			multiple: e$1[0].multiple || !1,
			excludeAcceptAllOption: e$1[0].excludeAcceptAllOption || !1
		}), r$1 = await Promise.all(n.map(s));
		return e$1[0].multiple ? r$1 : r$1[0];
	}, l = {
		__proto__: null,
		default: c
	};
	function u(e$1) {
		function t$3(e$2) {
			if (Object(e$2) !== e$2) return Promise.reject(/* @__PURE__ */ new TypeError(e$2 + " is not an object."));
			var t$4 = e$2.done;
			return Promise.resolve(e$2.value).then(function(e$3) {
				return {
					value: e$3,
					done: t$4
				};
			});
		}
		return u = function(e$2) {
			this.s = e$2, this.n = e$2.next;
		}, u.prototype = {
			s: null,
			n: null,
			next: function() {
				return t$3(this.n.apply(this.s, arguments));
			},
			return: function(e$2) {
				var n = this.s.return;
				return void 0 === n ? Promise.resolve({
					value: e$2,
					done: !0
				}) : t$3(n.apply(this.s, arguments));
			},
			throw: function(e$2) {
				var n = this.s.return;
				return void 0 === n ? Promise.reject(e$2) : t$3(n.apply(this.s, arguments));
			}
		}, new u(e$1);
	}
	const p$1 = async (e$1, t$3, n = e$1.name, r$1) => {
		const i = [], a$1 = [];
		var o$1, s$1 = !1, c$1 = !1;
		try {
			for (var l$1, d$1 = function(e$2) {
				var t$4, n$1, r$2, i$1 = 2;
				for ("undefined" != typeof Symbol && (n$1 = Symbol.asyncIterator, r$2 = Symbol.iterator); i$1--;) {
					if (n$1 && null != (t$4 = e$2[n$1])) return t$4.call(e$2);
					if (r$2 && null != (t$4 = e$2[r$2])) return new u(t$4.call(e$2));
					n$1 = "@@asyncIterator", r$2 = "@@iterator";
				}
				throw new TypeError("Object is not async iterable");
			}(e$1.values()); s$1 = !(l$1 = await d$1.next()).done; s$1 = !1) {
				const o$2 = l$1.value, s$2 = `${n}/${o$2.name}`;
				"file" === o$2.kind ? a$1.push(o$2.getFile().then((t$4) => (t$4.directoryHandle = e$1, t$4.handle = o$2, Object.defineProperty(t$4, "webkitRelativePath", {
					configurable: !0,
					enumerable: !0,
					get: () => s$2
				})))) : "directory" !== o$2.kind || !t$3 || r$1 && r$1(o$2) || i.push(p$1(o$2, t$3, s$2, r$1));
			}
		} catch (e$2) {
			c$1 = !0, o$1 = e$2;
		} finally {
			try {
				s$1 && null != d$1.return && await d$1.return();
			} finally {
				if (c$1) throw o$1;
			}
		}
		return [...(await Promise.all(i)).flat(), ...await Promise.all(a$1)];
	};
	var d = async (e$1 = {}) => {
		e$1.recursive = e$1.recursive || !1, e$1.mode = e$1.mode || "read";
		const t$3 = await window.showDirectoryPicker({
			id: e$1.id,
			startIn: e$1.startIn,
			mode: e$1.mode
		});
		return (await (await t$3.values()).next()).done ? [t$3] : p$1(t$3, e$1.recursive, void 0, e$1.skipDirectory);
	}, y = {
		__proto__: null,
		default: d
	}, f = async (e$1, t$3 = [{}], n = null, r$1 = !1, i = null) => {
		Array.isArray(t$3) || (t$3 = [t$3]), t$3[0].fileName = t$3[0].fileName || "Untitled";
		const a$1 = [];
		let o$1 = null;
		if (e$1 instanceof Blob && e$1.type ? o$1 = e$1.type : e$1.headers && e$1.headers.get("content-type") && (o$1 = e$1.headers.get("content-type")), t$3.forEach((e$2, t$4) => {
			a$1[t$4] = {
				description: e$2.description || "Files",
				accept: {}
			}, e$2.mimeTypes ? (0 === t$4 && o$1 && e$2.mimeTypes.push(o$1), e$2.mimeTypes.map((n$1) => {
				a$1[t$4].accept[n$1] = e$2.extensions || [];
			})) : o$1 ? a$1[t$4].accept[o$1] = e$2.extensions || [] : a$1[t$4].accept["*/*"] = e$2.extensions || [];
		}), n) try {
			await n.getFile();
		} catch (e$2) {
			if (n = null, r$1) throw e$2;
		}
		const s$1 = n || await window.showSaveFilePicker({
			suggestedName: t$3[0].fileName,
			id: t$3[0].id,
			startIn: t$3[0].startIn,
			types: a$1,
			excludeAcceptAllOption: t$3[0].excludeAcceptAllOption || !1
		});
		!n && i && i(s$1);
		const c$1 = await s$1.createWritable();
		if ("stream" in e$1) return await e$1.stream().pipeTo(c$1), s$1;
		return "body" in e$1 ? (await e$1.body.pipeTo(c$1), s$1) : (await c$1.write(await e$1), await c$1.close(), s$1);
	}, m = {
		__proto__: null,
		default: f
	}, w = async (e$1 = [{}]) => (Array.isArray(e$1) || (e$1 = [e$1]), new Promise((t$3, n) => {
		const r$1 = document.createElement("input");
		r$1.type = "file";
		const i = [...e$1.map((e$2) => e$2.mimeTypes || []), ...e$1.map((e$2) => e$2.extensions || [])].join();
		r$1.multiple = e$1[0].multiple || !1, r$1.accept = i || "", r$1.style.display = "none", document.body.append(r$1);
		const a$1 = (e$2) => {
			"function" == typeof o$1 && o$1(), t$3(e$2);
		}, o$1 = e$1[0].legacySetup && e$1[0].legacySetup(a$1, () => o$1(n), r$1), s$1 = () => {
			window.removeEventListener("focus", s$1), r$1.remove();
		};
		r$1.addEventListener("click", () => {
			window.addEventListener("focus", s$1);
		}), r$1.addEventListener("change", () => {
			window.removeEventListener("focus", s$1), r$1.remove(), a$1(r$1.multiple ? Array.from(r$1.files) : r$1.files[0]);
		}), "showPicker" in HTMLInputElement.prototype ? r$1.showPicker() : r$1.click();
	})), v = {
		__proto__: null,
		default: w
	}, h = async (e$1 = [{}]) => (Array.isArray(e$1) || (e$1 = [e$1]), e$1[0].recursive = e$1[0].recursive || !1, new Promise((t$3, n) => {
		const r$1 = document.createElement("input");
		r$1.type = "file", r$1.webkitdirectory = !0;
		const i = (e$2) => {
			"function" == typeof a$1 && a$1(), t$3(e$2);
		}, a$1 = e$1[0].legacySetup && e$1[0].legacySetup(i, () => a$1(n), r$1);
		r$1.addEventListener("change", () => {
			let t$4 = Array.from(r$1.files);
			e$1[0].recursive ? e$1[0].recursive && e$1[0].skipDirectory && (t$4 = t$4.filter((t$5) => t$5.webkitRelativePath.split("/").every((t$6) => !e$1[0].skipDirectory({
				name: t$6,
				kind: "directory"
			})))) : t$4 = t$4.filter((e$2) => 2 === e$2.webkitRelativePath.split("/").length), i(t$4);
		}), "showPicker" in HTMLInputElement.prototype ? r$1.showPicker() : r$1.click();
	})), b = {
		__proto__: null,
		default: h
	}, P = async (e$1, t$3 = {}) => {
		Array.isArray(t$3) && (t$3 = t$3[0]);
		const n = document.createElement("a");
		let r$1 = e$1;
		"body" in e$1 && (r$1 = await async function(e$2, t$4) {
			const n$1 = e$2.getReader(), r$2 = new ReadableStream({ start: (e$3) => async function t$5() {
				return n$1.read().then(({ done: n$2, value: r$3 }) => {
					if (!n$2) return e$3.enqueue(r$3), t$5();
					e$3.close();
				});
			}() }), a$2 = await new Response(r$2).blob();
			return n$1.releaseLock(), new Blob([a$2], { type: t$4 });
		}(e$1.body, e$1.headers.get("content-type"))), n.download = t$3.fileName || "Untitled", n.href = URL.createObjectURL(await r$1);
		const i = () => {
			"function" == typeof a$1 && a$1();
		}, a$1 = t$3.legacySetup && t$3.legacySetup(i, () => a$1(), n);
		return n.addEventListener("click", () => {
			setTimeout(() => URL.revokeObjectURL(n.href), 3e4), i();
		}), n.click(), null;
	}, k = {
		__proto__: null,
		default: P
	};

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/constants.js
	const MAX_32_BITS = 4294967295;
	const MAX_16_BITS = 65535;
	const COMPRESSION_METHOD_DEFLATE = 8;
	const COMPRESSION_METHOD_DEFLATE_64 = 9;
	const COMPRESSION_METHOD_STORE = 0;
	const COMPRESSION_METHOD_AES = 99;
	const LOCAL_FILE_HEADER_SIGNATURE = 67324752;
	const SPLIT_ZIP_FILE_SIGNATURE = 134695760;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE = SPLIT_ZIP_FILE_SIGNATURE;
	const CENTRAL_FILE_HEADER_SIGNATURE = 33639248;
	const END_OF_CENTRAL_DIR_SIGNATURE = 101010256;
	const ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 101075792;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 117853008;
	const END_OF_CENTRAL_DIR_LENGTH = 22;
	const ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
	const ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
	const ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH = END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;
	const DATA_DESCRIPTOR_RECORD_LENGTH = 12;
	const DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH = 20;
	const DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH = 4;
	const EXTRAFIELD_TYPE_ZIP64 = 1;
	const EXTRAFIELD_TYPE_AES = 39169;
	const EXTRAFIELD_TYPE_NTFS = 10;
	const EXTRAFIELD_TYPE_NTFS_TAG1 = 1;
	const EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 21589;
	const EXTRAFIELD_TYPE_UNICODE_PATH = 28789;
	const EXTRAFIELD_TYPE_UNICODE_COMMENT = 25461;
	const EXTRAFIELD_TYPE_USDZ = 6534;
	const BITFLAG_ENCRYPTED = 1;
	const BITFLAG_LEVEL = 6;
	const BITFLAG_LEVEL_MAX_MASK = 2;
	const BITFLAG_LEVEL_FAST_MASK = 4;
	const BITFLAG_LEVEL_SUPER_FAST_MASK = 6;
	const BITFLAG_DATA_DESCRIPTOR = 8;
	const BITFLAG_LANG_ENCODING_FLAG = 2048;
	const FILE_ATTR_MSDOS_DIR_MASK = 16;
	const FILE_ATTR_UNIX_TYPE_MASK = 61440;
	const FILE_ATTR_UNIX_TYPE_DIR = 16384;
	const FILE_ATTR_UNIX_EXECUTABLE_MASK = 73;
	const FILE_ATTR_UNIX_DEFAULT_MASK = 420;
	const VERSION_DEFLATE = 20;
	const VERSION_ZIP64 = 45;
	const VERSION_AES = 51;
	const DIRECTORY_SIGNATURE = "/";
	const HEADER_SIZE = 30;
	const HEADER_OFFSET_SIGNATURE = 10;
	const HEADER_OFFSET_COMPRESSED_SIZE = 14;
	const HEADER_OFFSET_UNCOMPRESSED_SIZE = 18;
	const MAX_DATE = new Date(2107, 11, 31);
	const MIN_DATE = new Date(1980, 0, 1);
	const UNDEFINED_VALUE = void 0;
	const UNDEFINED_TYPE = "undefined";
	const FUNCTION_TYPE = "function";

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/configuration.js
	const MINIMUM_CHUNK_SIZE = 64;
	let maxWorkers = 2;
	try {
		if (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) maxWorkers = navigator.hardwareConcurrency;
	} catch {}
	const DEFAULT_CONFIGURATION = {
		workerURI: "./core/web-worker-wasm.js",
		wasmURI: "./core/streams/zlib-wasm/zlib-streams.wasm",
		chunkSize: 64 * 1024,
		maxWorkers,
		terminateWorkerTimeout: 5e3,
		useWebWorkers: true,
		useCompressionStream: true,
		CompressionStream: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,
		DecompressionStream: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream
	};
	const config = Object.assign({}, DEFAULT_CONFIGURATION);
	function getConfiguration() {
		return config;
	}
	function getChunkSize(config$1) {
		return Math.max(config$1.chunkSize, MINIMUM_CHUNK_SIZE);
	}
	function configure(configuration) {
		const { baseURI, chunkSize, maxWorkers: maxWorkers$1, terminateWorkerTimeout, useCompressionStream, useWebWorkers, CompressionStream: CompressionStream$1, DecompressionStream: DecompressionStream$1, CompressionStreamZlib: CompressionStreamZlib$1, DecompressionStreamZlib: DecompressionStreamZlib$1, workerURI, wasmURI } = configuration;
		setIfDefined("baseURI", baseURI);
		setIfDefined("wasmURI", wasmURI);
		setIfDefined("workerURI", workerURI);
		setIfDefined("chunkSize", chunkSize);
		setIfDefined("maxWorkers", maxWorkers$1);
		setIfDefined("terminateWorkerTimeout", terminateWorkerTimeout);
		setIfDefined("useCompressionStream", useCompressionStream);
		setIfDefined("useWebWorkers", useWebWorkers);
		setIfDefined("CompressionStream", CompressionStream$1);
		setIfDefined("DecompressionStream", DecompressionStream$1);
		setIfDefined("CompressionStreamZlib", CompressionStreamZlib$1);
		setIfDefined("DecompressionStreamZlib", DecompressionStreamZlib$1);
	}
	function setIfDefined(propertyName, propertyValue) {
		if (propertyValue !== UNDEFINED_VALUE) config[propertyName] = propertyValue;
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/web-worker-inline-wasm.js
	function t(t$3) {
		let e$1;
		t$3({ workerURI: () => (e$1 || (e$1 = "data:text/javascript," + encodeURIComponent("(t=>{\"function\"==typeof define&&define.amd?define(t):t()})(function(){\"use strict\";const{Array:t,Object:e,Number:n,Math:s,Error:r,Uint8Array:o,Uint16Array:i,Uint32Array:c,Int32Array:a,Map:h,DataView:f,Promise:l,TextEncoder:u,crypto:w,postMessage:p,TransformStream:d,ReadableStream:y,WritableStream:m,CompressionStream:g,DecompressionStream:S}=self,b=void 0,v=\"undefined\",k=\"function\",z=[];for(let t=0;256>t;t++){let e=t;for(let t=0;8>t;t++)1&e?e=e>>>1^3988292384:e>>>=1;z[t]=e}class C{constructor(t){this.t=t||-1}append(t){let e=0|this.t;for(let n=0,s=0|t.length;s>n;n++)e=e>>>8^z[255&(e^t[n])];this.t=e}get(){return~this.t}}class A extends d{constructor(){let t;const e=new C;super({transform(t,n){e.append(t),n.enqueue(t)},flush(){const n=new o(4);new f(n.buffer).setUint32(0,e.get()),t.value=n}}),t=this}}const x={concat(t,e){if(0===t.length||0===e.length)return t.concat(e);const n=t[t.length-1],s=x.o(n);return 32===s?t.concat(e):x.i(e,s,0|n,t.slice(0,t.length-1))},h(t){const e=t.length;if(0===e)return 0;const n=t[e-1];return 32*(e-1)+x.o(n)},l(t,e){if(32*t.length<e)return t;const n=(t=t.slice(0,s.ceil(e/32))).length;return e&=31,n>0&&e&&(t[n-1]=x.u(e,t[n-1]&2147483648>>e-1,1)),t},u:(t,e,n)=>32===t?e:(n?0|e:e<<32-t)+1099511627776*t,o:t=>s.round(t/1099511627776)||32,i(t,e,n,s){for(void 0===s&&(s=[]);e>=32;e-=32)s.push(n),n=0;if(0===e)return s.concat(t);for(let r=0;r<t.length;r++)s.push(n|t[r]>>>e),n=t[r]<<32-e;const r=t.length?t[t.length-1]:0,o=x.o(r);return s.push(x.u(e+o&31,e+o>32?n:s.pop(),1)),s}},I={bytes:{p(t){const e=x.h(t)/8,n=new o(e);let s;for(let r=0;e>r;r++)3&r||(s=t[r/4]),n[r]=s>>>24,s<<=8;return n},m(t){const e=[];let n,s=0;for(n=0;n<t.length;n++)s=s<<8|t[n],3&~n||(e.push(s),s=0);return 3&n&&e.push(x.u(8*(3&n),s)),e}}},R=class{constructor(t){const e=this;e.blockSize=512,e.S=[1732584193,4023233417,2562383102,271733878,3285377520],e.v=[1518500249,1859775393,2400959708,3395469782],t?(e.k=t.k.slice(0),e.C=t.C.slice(0),e.A=t.A):e.reset()}reset(){const t=this;return t.k=t.S.slice(0),t.C=[],t.A=0,t}update(t){const e=this;\"string\"==typeof t&&(t=I.I.m(t));const n=e.C=x.concat(e.C,t),s=e.A,o=e.A=s+x.h(t);if(o>9007199254740991)throw new r(\"Cannot hash more than 2^53 - 1 bits\");const i=new c(n);let a=0;for(let t=e.blockSize+s-(e.blockSize+s&e.blockSize-1);o>=t;t+=e.blockSize)e.R(i.subarray(16*a,16*(a+1))),a+=1;return n.splice(0,16*a),e}P(){const t=this;let e=t.C;const n=t.k;e=x.concat(e,[x.u(1,1)]);for(let t=e.length+2;15&t;t++)e.push(0);for(e.push(s.floor(t.A/4294967296)),e.push(0|t.A);e.length;)t.R(e.splice(0,16));return t.reset(),n}U(t,e,n,s){return t>19?t>39?t>59?t>79?void 0:e^n^s:e&n|e&s|n&s:e^n^s:e&n|~e&s}V(t,e){return e<<t|e>>>32-t}R(e){const n=this,r=n.k,o=t(80);for(let t=0;16>t;t++)o[t]=e[t];let i=r[0],c=r[1],a=r[2],h=r[3],f=r[4];for(let t=0;79>=t;t++){16>t||(o[t]=n.V(1,o[t-3]^o[t-8]^o[t-14]^o[t-16]));const e=n.V(5,i)+n.U(t,c,a,h)+f+o[t]+n.v[s.floor(t/20)]|0;f=h,h=a,a=n.V(30,c),c=i,i=e}r[0]=r[0]+i|0,r[1]=r[1]+c|0,r[2]=r[2]+a|0,r[3]=r[3]+h|0,r[4]=r[4]+f|0}},P={getRandomValues(t){const e=new c(t.buffer),n=t=>{let e=987654321;const n=4294967295;return()=>(e=36969*(65535&e)+(e>>16)&n,(((e<<16)+(t=18e3*(65535&t)+(t>>16)&n)&n)/4294967296+.5)*(s.random()>.5?1:-1))};for(let r,o=0;o<t.length;o+=4){const t=n(4294967296*(r||s.random()));r=987654071*t(),e[o/4]=4294967296*t()|0}return t}},U={importKey:t=>new U.M(I.bytes.m(t)),_(t,e,n,s){if(n=n||1e4,0>s||0>n)throw new r(\"invalid params to pbkdf2\");const o=1+(s>>5)<<2;let i,c,a,h,l;const u=new ArrayBuffer(o),w=new f(u);let p=0;const d=x;for(e=I.bytes.m(e),l=1;(o||1)>p;l++){for(i=c=t.encrypt(d.concat(e,[l])),a=1;n>a;a++)for(c=t.encrypt(c),h=0;h<c.length;h++)i[h]^=c[h];for(a=0;(o||1)>p&&a<i.length;a++)w.setInt32(p,i[a]),p+=4}return u.slice(0,s/8)},M:class{constructor(t){const e=this,n=e.B=R,s=[[],[]];e.D=[new n,new n];const r=e.D[0].blockSize/32;t.length>r&&(t=(new n).update(t).P());for(let e=0;r>e;e++)s[0][e]=909522486^t[e],s[1][e]=1549556828^t[e];e.D[0].update(s[0]),e.D[1].update(s[1]),e.W=new n(e.D[0])}reset(){const t=this;t.W=new t.B(t.D[0]),t.K=!1}update(t){this.K=!0,this.W.update(t)}digest(){const t=this,e=t.W.P(),n=new t.B(t.D[1]).update(e).P();return t.reset(),n}encrypt(t){if(this.K)throw new r(\"encrypt on already updated hmac called!\");return this.update(t),this.digest(t)}}},V=typeof w!=v&&typeof w.getRandomValues==k,M=\"Invalid password\",_=\"Invalid signature\",B=\"zipjs-abort-check-password\";function D(t){return V?w.getRandomValues(t):P.getRandomValues(t)}const W=16,K={name:\"PBKDF2\"},E=e.assign({hash:{name:\"HMAC\"}},K),L=e.assign({iterations:1e3,hash:{name:\"SHA-1\"}},K),O=[\"deriveBits\"],T=[8,12,16],j=[16,24,32],H=10,Z=[0,0,0,0],F=typeof w!=v,N=F&&w.subtle,q=F&&typeof N!=v,G=I.bytes,J=class{constructor(t){const e=this;e.L=[[[],[],[],[],[]],[[],[],[],[],[]]],e.L[0][0][0]||e.O();const n=e.L[0][4],s=e.L[1],o=t.length;let i,c,a,h=1;if(4!==o&&6!==o&&8!==o)throw new r(\"invalid aes key size\");for(e.v=[c=t.slice(0),a=[]],i=o;4*o+28>i;i++){let t=c[i-1];(i%o===0||8===o&&i%o===4)&&(t=n[t>>>24]<<24^n[t>>16&255]<<16^n[t>>8&255]<<8^n[255&t],i%o===0&&(t=t<<8^t>>>24^h<<24,h=h<<1^283*(h>>7))),c[i]=c[i-o]^t}for(let t=0;i;t++,i--){const e=c[3&t?i:i-4];a[t]=4>=i||4>t?e:s[0][n[e>>>24]]^s[1][n[e>>16&255]]^s[2][n[e>>8&255]]^s[3][n[255&e]]}}encrypt(t){return this.T(t,0)}decrypt(t){return this.T(t,1)}O(){const t=this.L[0],e=this.L[1],n=t[4],s=e[4],r=[],o=[];let i,c,a,h;for(let t=0;256>t;t++)o[(r[t]=t<<1^283*(t>>7))^t]=t;for(let f=i=0;!n[f];f^=c||1,i=o[i]||1){let o=i^i<<1^i<<2^i<<3^i<<4;o=o>>8^255&o^99,n[f]=o,s[o]=f,h=r[a=r[c=r[f]]];let l=16843009*h^65537*a^257*c^16843008*f,u=257*r[o]^16843008*o;for(let n=0;4>n;n++)t[n][f]=u=u<<24^u>>>8,e[n][o]=l=l<<24^l>>>8}for(let n=0;5>n;n++)t[n]=t[n].slice(0),e[n]=e[n].slice(0)}T(t,e){if(4!==t.length)throw new r(\"invalid aes block size\");const n=this.v[e],s=n.length/4-2,o=[0,0,0,0],i=this.L[e],c=i[0],a=i[1],h=i[2],f=i[3],l=i[4];let u,w,p,d=t[0]^n[0],y=t[e?3:1]^n[1],m=t[2]^n[2],g=t[e?1:3]^n[3],S=4;for(let t=0;s>t;t++)u=c[d>>>24]^a[y>>16&255]^h[m>>8&255]^f[255&g]^n[S],w=c[y>>>24]^a[m>>16&255]^h[g>>8&255]^f[255&d]^n[S+1],p=c[m>>>24]^a[g>>16&255]^h[d>>8&255]^f[255&y]^n[S+2],g=c[g>>>24]^a[d>>16&255]^h[y>>8&255]^f[255&m]^n[S+3],S+=4,d=u,y=w,m=p;for(let t=0;4>t;t++)o[e?3&-t:t]=l[d>>>24]<<24^l[y>>16&255]<<16^l[m>>8&255]<<8^l[255&g]^n[S++],u=d,d=y,y=m,m=g,g=u;return o}},Q=class{constructor(t,e){this.j=t,this.H=e,this.Z=e}reset(){this.Z=this.H}update(t){return this.F(this.j,t,this.Z)}N(t){if(255&~(t>>24))t+=1<<24;else{let e=t>>16&255,n=t>>8&255,s=255&t;255===e?(e=0,255===n?(n=0,255===s?s=0:++s):++n):++e,t=0,t+=e<<16,t+=n<<8,t+=s}return t}q(t){0===(t[0]=this.N(t[0]))&&(t[1]=this.N(t[1]))}F(t,e,n){let s;if(!(s=e.length))return[];const r=x.h(e);for(let r=0;s>r;r+=4){this.q(n);const s=t.encrypt(n);e[r]^=s[0],e[r+1]^=s[1],e[r+2]^=s[2],e[r+3]^=s[3]}return x.l(e,r)}},X=U.M;let Y=F&&q&&typeof N.importKey==k,$=F&&q&&typeof N.deriveBits==k;class tt extends d{constructor({password:t,rawPassword:n,signed:s,encryptionStrength:i,checkPasswordOnly:c}){super({start(){e.assign(this,{ready:new l(t=>this.G=t),password:rt(t,n),signed:s,J:i-1,pending:new o})},async transform(t,e){const n=this,{password:s,J:i,G:a,ready:h}=n;s?(await(async(t,e,n,s)=>{const o=await st(t,e,n,it(s,0,T[e])),i=it(s,T[e]);if(o[0]!=i[0]||o[1]!=i[1])throw new r(M)})(n,i,s,it(t,0,T[i]+2)),t=it(t,T[i]+2),c?e.error(new r(B)):a()):await h;const f=new o(t.length-H-(t.length-H)%W);e.enqueue(nt(n,t,f,0,H,!0))},async flush(t){const{signed:e,X:n,Y:s,pending:i,ready:c}=this;if(s&&n){await c;const a=it(i,0,i.length-H),h=it(i,i.length-H);let f=new o;if(a.length){const t=at(G,a);s.update(t);const e=n.update(t);f=ct(G,e)}if(e){const t=it(ct(G,s.digest()),0,H);for(let e=0;H>e;e++)if(t[e]!=h[e])throw new r(_)}t.enqueue(f)}}})}}class et extends d{constructor({password:t,rawPassword:n,encryptionStrength:s}){let r;super({start(){e.assign(this,{ready:new l(t=>this.G=t),password:rt(t,n),J:s-1,pending:new o})},async transform(t,e){const n=this,{password:s,J:r,G:i,ready:c}=n;let a=new o;s?(a=await(async(t,e,n)=>{const s=D(new o(T[e]));return ot(s,await st(t,e,n,s))})(n,r,s),i()):await c;const h=new o(a.length+t.length-t.length%W);h.set(a,0),e.enqueue(nt(n,t,h,a.length,0))},async flush(t){const{X:e,Y:n,pending:s,ready:i}=this;if(n&&e){await i;let c=new o;if(s.length){const t=e.update(at(G,s));n.update(t),c=ct(G,t)}r.signature=ct(G,n.digest()).slice(0,H),t.enqueue(ot(c,r.signature))}}}),r=this}}function nt(t,e,n,s,r,i){const{X:c,Y:a,pending:h}=t,f=e.length-r;let l;for(h.length&&(e=ot(h,e),n=((t,e)=>{if(e&&e>t.length){const n=t;(t=new o(e)).set(n,0)}return t})(n,f-f%W)),l=0;f-W>=l;l+=W){const t=at(G,it(e,l,l+W));i&&a.update(t);const r=c.update(t);i||a.update(r),n.set(ct(G,r),l+s)}return t.pending=it(e,l),n}async function st(n,s,r,i){n.password=null;const c=await(async(t,e,n,s,r)=>{if(!Y)return U.importKey(e);try{return await N.importKey(\"raw\",e,n,!1,r)}catch{return Y=!1,U.importKey(e)}})(0,r,E,0,O),a=await(async(t,e,n)=>{if(!$)return U._(e,t.salt,L.iterations,n);try{return await N.deriveBits(t,e,n)}catch{return $=!1,U._(e,t.salt,L.iterations,n)}})(e.assign({salt:i},L),c,8*(2*j[s]+2)),h=new o(a),f=at(G,it(h,0,j[s])),l=at(G,it(h,j[s],2*j[s])),u=it(h,2*j[s]);return e.assign(n,{keys:{key:f,$:l,passwordVerification:u},X:new Q(new J(f),t.from(Z)),Y:new X(l)}),u}function rt(t,e){return e===b?(t=>{if(typeof u==v){const e=new o((t=unescape(encodeURIComponent(t))).length);for(let n=0;n<e.length;n++)e[n]=t.charCodeAt(n);return e}return(new u).encode(t)})(t):e}function ot(t,e){let n=t;return t.length+e.length&&(n=new o(t.length+e.length),n.set(t,0),n.set(e,t.length)),n}function it(t,e,n){return t.subarray(e,n)}function ct(t,e){return t.p(e)}function at(t,e){return t.m(e)}class ht extends d{constructor({password:t,passwordVerification:n,checkPasswordOnly:s}){super({start(){e.assign(this,{password:t,passwordVerification:n}),wt(this,t)},transform(t,e){const n=this;if(n.password){const e=lt(n,t.subarray(0,12));if(n.password=null,e.at(-1)!=n.passwordVerification)throw new r(M);t=t.subarray(12)}s?e.error(new r(B)):e.enqueue(lt(n,t))}})}}class ft extends d{constructor({password:t,passwordVerification:n}){super({start(){e.assign(this,{password:t,passwordVerification:n}),wt(this,t)},transform(t,e){const n=this;let s,r;if(n.password){n.password=null;const e=D(new o(12));e[11]=n.passwordVerification,s=new o(t.length+e.length),s.set(ut(n,e),0),r=12}else s=new o(t.length),r=0;s.set(ut(n,t),r),e.enqueue(s)}})}}function lt(t,e){const n=new o(e.length);for(let s=0;s<e.length;s++)n[s]=dt(t)^e[s],pt(t,n[s]);return n}function ut(t,e){const n=new o(e.length);for(let s=0;s<e.length;s++)n[s]=dt(t)^e[s],pt(t,e[s]);return n}function wt(t,n){const s=[305419896,591751049,878082192];e.assign(t,{keys:s,tt:new C(s[0]),et:new C(s[2])});for(let e=0;e<n.length;e++)pt(t,n.charCodeAt(e))}function pt(t,e){let[n,r,o]=t.keys;t.tt.append([e]),n=~t.tt.get(),r=mt(s.imul(mt(r+yt(n)),134775813)+1),t.et.append([r>>>24]),o=~t.et.get(),t.keys=[n,r,o]}function dt(t){const e=2|t.keys[2];return yt(s.imul(e,1^e)>>>8)}function yt(t){return 255&t}function mt(t){return 4294967295&t}class gt extends d{constructor(t,{chunkSize:e,nt:n,CompressionStream:s}){super({});const{compressed:r,encrypted:o,useCompressionStream:i,zipCrypto:c,signed:a,level:h}=t,l=this;let u,w,p=super.readable;o&&!c||!a||(u=new A,p=kt(p,u)),r&&(p=vt(p,i,{level:h,chunkSize:e},s,n,s)),o&&(c?p=kt(p,new ft(t)):(w=new et(t),p=kt(p,w))),bt(l,p,()=>{let t;o&&!c&&(t=w.signature),o&&!c||!a||(t=new f(u.value.buffer).getUint32(0)),l.signature=t})}}class St extends d{constructor(t,{chunkSize:e,st:n,DecompressionStream:s}){super({});const{zipCrypto:o,encrypted:i,signed:c,signature:a,compressed:h,useCompressionStream:l,rt:u}=t;let w,p,d=super.readable;i&&(o?d=kt(d,new ht(t)):(p=new tt(t),d=kt(d,p))),h&&(d=vt(d,l,{chunkSize:e,rt:u},s,n,s)),i&&!o||!c||(w=new A,d=kt(d,w)),bt(this,d,()=>{if((!i||o)&&c){const t=new f(w.value.buffer);if(a!=t.getUint32(0,!1))throw new r(_)}})}}function bt(t,n,s){n=kt(n,new d({flush:s})),e.defineProperty(t,\"readable\",{get:()=>n})}function vt(t,e,n,s,r,o){const i=e&&s?s:r||o,c=n.rt?\"deflate64-raw\":\"deflate-raw\";try{t=kt(t,new i(c,n))}catch(s){if(!e)throw s;if(r)t=kt(t,new r(c,n));else{if(!o)throw s;t=kt(t,new o(c,n))}}return t}function kt(t,e){return t.pipeThrough(e)}const zt=\"data\",Ct=\"close\";class At extends d{constructor(t,n){super({});const s=this,{codecType:o}=t;let i;o.startsWith(\"deflate\")?i=gt:o.startsWith(\"inflate\")&&(i=St),s.outputSize=0;let c=0;const a=new i(t,n),h=super.readable,f=new d({transform(t,e){t&&t.length&&(c+=t.length,e.enqueue(t))},flush(){e.assign(s,{inputSize:c})}}),l=new d({transform(e,n){if(e&&e.length&&(n.enqueue(e),s.outputSize+=e.length,t.outputSize!==b&&s.outputSize>t.outputSize))throw new r(\"Invalid uncompressed size\")},flush(){const{signature:t}=a;e.assign(s,{signature:t,inputSize:c})}});e.defineProperty(s,\"readable\",{get:()=>h.pipeThrough(f).pipeThrough(a).pipeThrough(l)})}}class xt extends d{constructor(t){let e;super({transform:function n(s,r){if(e){const t=new o(e.length+s.length);t.set(e),t.set(s,e.length),s=t,e=null}s.length>t?(r.enqueue(s.slice(0,t)),n(s.slice(t),r)):e=s},flush(t){e&&e.length&&t.enqueue(e)}})}}const It=new h,Rt=new h;let Pt,Ut,Vt,Mt,_t,Bt=0;async function Dt(t){try{const{options:e,config:s}=t;if(!e.useCompressionStream)try{await self.initModule(t.config)}catch{e.useCompressionStream=!0}s.CompressionStream=self.CompressionStream,s.DecompressionStream=self.DecompressionStream;const r={highWaterMark:1},o=t.readable||new y({async pull(t){const e=new l(t=>It.set(Bt,t));Wt({type:\"pull\",messageId:Bt}),Bt=(Bt+1)%n.MAX_SAFE_INTEGER;const{value:s,done:r}=await e;t.enqueue(s),r&&t.close()}},r),i=t.writable||new m({async write(t){let e;const s=new l(t=>e=t);Rt.set(Bt,e),Wt({type:zt,value:t,messageId:Bt}),Bt=(Bt+1)%n.MAX_SAFE_INTEGER,await s}},r),c=new At(e,s);Pt=new AbortController;const{signal:a}=Pt;await o.pipeThrough(c).pipeThrough(new xt(s.chunkSize)).pipeTo(i,{signal:a,preventClose:!0,preventAbort:!0}),await i.getWriter().close();const{signature:h,inputSize:f,outputSize:u}=c;Wt({type:Ct,result:{signature:h,inputSize:f,outputSize:u}})}catch(t){t.outputSize=0,Kt(t)}}function Wt(t){let{value:e}=t;if(e)if(e.length)try{e=new o(e),t.value=e.buffer,p(t,[t.value])}catch{p(t)}else p(t);else p(t)}function Kt(t=new r(\"Unknown error\")){const{message:e,stack:n,code:s,name:o,outputSize:i}=t;p({error:{message:e,stack:n,code:s,name:o,outputSize:i}})}function Et(t,e,n={}){const i=\"number\"==typeof n.level?n.level:-1,c=\"number\"==typeof n.ot?n.ot:65536,a=\"number\"==typeof n.it?n.it:65536;return new d({start(){let n;if(this.ct=Vt(c),this.in=Vt(a),this.it=a,this.ht=new o(c),t?(this.ft=Ut.deflate_process,this.lt=Ut.deflate_last_consumed,this.ut=Ut.deflate_end,this.wt=Ut.deflate_new(),n=\"gzip\"===e?Ut.deflate_init_gzip(this.wt,i):\"deflate-raw\"===e?Ut.deflate_init_raw(this.wt,i):Ut.deflate_init(this.wt,i)):\"deflate64-raw\"===e?(this.ft=Ut.inflate9_process,this.lt=Ut.inflate9_last_consumed,this.ut=Ut.inflate9_end,this.wt=Ut.inflate9_new(),n=Ut.inflate9_init_raw(this.wt)):(this.ft=Ut.inflate_process,this.lt=Ut.inflate_last_consumed,this.ut=Ut.inflate_end,this.wt=Ut.inflate_new(),n=\"deflate-raw\"===e?Ut.inflate_init_raw(this.wt):\"gzip\"===e?Ut.inflate_init_gzip(this.wt):Ut.inflate_init(this.wt)),0!==n)throw new r(\"init failed:\"+n)},transform(e,n){try{const i=e,a=new o(_t.buffer),h=this.ft,f=this.lt,l=this.ct,u=this.ht;let w=0;for(;w<i.length;){const e=s.min(i.length-w,32768);this.in&&this.it>=e||(this.in&&Mt&&Mt(this.in),this.in=Vt(e),this.it=e),a.set(i.subarray(w,w+e),this.in);const o=h(this.wt,this.in,e,l,c,0);if(!t&&0>o)throw new r(\"process error:\"+o);const p=16777215&o;p&&(u.set(a.subarray(l,l+p),0),n.enqueue(u.slice(0,p)));const d=f(this.wt);if(0===d)break;w+=d}}catch(t){this.ut&&this.wt&&this.ut(this.wt),this.in&&Mt&&Mt(this.in),this.ct&&Mt&&Mt(this.ct),n.error(t)}},flush(e){try{const n=new o(_t.buffer),s=this.ft,i=this.ct,a=this.ht;for(;;){const o=s(this.wt,0,0,i,c,4);if(!t&&0>o)throw new r(\"process error:\"+o);const h=16777215&o,f=o>>24&255;if(h&&(a.set(n.subarray(i,i+h),0),e.enqueue(a.slice(0,h))),1===f||0===h)break}}catch(t){e.error(t)}finally{if(this.ut&&this.wt){const t=this.ut(this.wt);0!==t&&e.error(new r(\"end error:\"+t))}this.in&&Mt&&Mt(this.in),this.ct&&Mt&&Mt(this.ct)}}})}addEventListener(\"message\",({data:t})=>{const{type:e,messageId:n,value:s,done:r}=t;try{if(\"start\"==e&&Dt(t),e==zt){const t=It.get(n);It.delete(n),t({value:new o(s),done:r})}if(\"ack\"==e){const t=Rt.get(n);Rt.delete(n),t()}e==Ct&&Pt.abort()}catch(t){Kt(t)}});class Lt{constructor(t=\"deflate\",e){return Et(!0,t,e)}}class Ot{constructor(t=\"deflate\",e){return Et(!1,t,e)}}let Tt=!1;self.initModule=async t=>{try{const e=await(async(t,{baseURI:e})=>{if(!Tt){let n,s;try{try{s=new URL(t,e)}catch{}const r=await fetch(s);n=await r.arrayBuffer()}catch(e){if(!t.startsWith(\"data:application/wasm;base64,\"))throw e;n=(t=>{const e=t.split(\",\")[1],n=atob(e),s=n.length,r=new o(s);for(let t=0;s>t;++t)r[t]=n.charCodeAt(t);return r.buffer})(t)}(t=>{if(Ut=t,({malloc:Vt,free:Mt,memory:_t}=Ut),\"function\"!=typeof Vt||\"function\"!=typeof Mt||!_t)throw Ut=Vt=Mt=_t=null,new r(\"Invalid WASM module\")})((await WebAssembly.instantiate(n)).instance.exports),Tt=!0}})(t.wasmURI,t);return t.nt=Lt,t.st=Ot,e}catch{}}});\n")), e$1) });
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/codecs/crc32.js
	const table$2 = [];
	for (let i = 0; i < 256; i++) {
		let t$3 = i;
		for (let j = 0; j < 8; j++) if (t$3 & 1) t$3 = t$3 >>> 1 ^ 3988292384;
		else t$3 = t$3 >>> 1;
		table$2[i] = t$3;
	}
	var Crc32 = class {
		constructor(crc) {
			this.crc = crc || -1;
		}
		append(data) {
			let crc = this.crc | 0;
			for (let offset = 0, length = data.length | 0; offset < length; offset++) crc = crc >>> 8 ^ table$2[(crc ^ data[offset]) & 255];
			this.crc = crc;
		}
		get() {
			return ~this.crc;
		}
	};

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/crc32-stream.js
	var Crc32Stream = class extends TransformStream {
		constructor() {
			let stream;
			const crc32 = new Crc32();
			super({
				transform(chunk$1, controller$1) {
					crc32.append(chunk$1);
					controller$1.enqueue(chunk$1);
				},
				flush() {
					const value = new Uint8Array(4);
					new DataView(value.buffer).setUint32(0, crc32.get());
					stream.value = value;
				}
			});
			stream = this;
		}
	};

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/util/encode-text.js
	function encodeText(value) {
		if (typeof TextEncoder == UNDEFINED_TYPE) {
			value = unescape(encodeURIComponent(value));
			const result = new Uint8Array(value.length);
			for (let i = 0; i < result.length; i++) result[i] = value.charCodeAt(i);
			return result;
		} else return new TextEncoder().encode(value);
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/codecs/sjcl.js
/** @fileOverview Javascript cryptography implementation.
	*
	* Crush to remove comments, shorten variable names and
	* generally reduce transmission size.
	*
	* @author Emily Stark
	* @author Mike Hamburg
	* @author Dan Boneh
	*/
	/** @fileOverview Arrays of bits, encoded as arrays of Numbers.
	*
	* @author Emily Stark
	* @author Mike Hamburg
	* @author Dan Boneh
	*/
	/**
	* Arrays of bits, encoded as arrays of Numbers.
	* @namespace
	* @description
	* <p>
	* These objects are the currency accepted by SJCL's crypto functions.
	* </p>
	*
	* <p>
	* Most of our crypto primitives operate on arrays of 4-byte words internally,
	* but many of them can take arguments that are not a multiple of 4 bytes.
	* This library encodes arrays of bits (whose size need not be a multiple of 8
	* bits) as arrays of 32-bit words.  The bits are packed, big-endian, into an
	* array of words, 32 bits at a time.  Since the words are double-precision
	* floating point numbers, they fit some extra data.  We use this (in a private,
	* possibly-changing manner) to encode the number of bits actually  present
	* in the last word of the array.
	* </p>
	*
	* <p>
	* Because bitwise ops clear this out-of-band data, these arrays can be passed
	* to ciphers like AES which want arrays of words.
	* </p>
	*/
	const bitArray = {
		concat(a1, a2) {
			if (a1.length === 0 || a2.length === 0) return a1.concat(a2);
			const last = a1[a1.length - 1], shift = bitArray.getPartial(last);
			if (shift === 32) return a1.concat(a2);
			else return bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
		},
		bitLength(a$1) {
			const l$1 = a$1.length;
			if (l$1 === 0) return 0;
			const x = a$1[l$1 - 1];
			return (l$1 - 1) * 32 + bitArray.getPartial(x);
		},
		clamp(a$1, len) {
			if (a$1.length * 32 < len) return a$1;
			a$1 = a$1.slice(0, Math.ceil(len / 32));
			const l$1 = a$1.length;
			len = len & 31;
			if (l$1 > 0 && len) a$1[l$1 - 1] = bitArray.partial(len, a$1[l$1 - 1] & 2147483648 >> len - 1, 1);
			return a$1;
		},
		partial(len, x, _end) {
			if (len === 32) return x;
			return (_end ? x | 0 : x << 32 - len) + len * 1099511627776;
		},
		getPartial(x) {
			return Math.round(x / 1099511627776) || 32;
		},
		_shiftRight(a$1, shift, carry, out) {
			if (out === void 0) out = [];
			for (; shift >= 32; shift -= 32) {
				out.push(carry);
				carry = 0;
			}
			if (shift === 0) return out.concat(a$1);
			for (let i = 0; i < a$1.length; i++) {
				out.push(carry | a$1[i] >>> shift);
				carry = a$1[i] << 32 - shift;
			}
			const last2 = a$1.length ? a$1[a$1.length - 1] : 0;
			const shift2 = bitArray.getPartial(last2);
			out.push(bitArray.partial(shift + shift2 & 31, shift + shift2 > 32 ? carry : out.pop(), 1));
			return out;
		}
	};
	/** @fileOverview Bit array codec implementations.
	*
	* @author Emily Stark
	* @author Mike Hamburg
	* @author Dan Boneh
	*/
	/**
	* Arrays of bytes
	* @namespace
	*/
	const codec = { bytes: {
		fromBits(arr) {
			const byteLength = bitArray.bitLength(arr) / 8;
			const out = new Uint8Array(byteLength);
			let tmp;
			for (let i = 0; i < byteLength; i++) {
				if ((i & 3) === 0) tmp = arr[i / 4];
				out[i] = tmp >>> 24;
				tmp <<= 8;
			}
			return out;
		},
		toBits(bytes) {
			const out = [];
			let i;
			let tmp = 0;
			for (i = 0; i < bytes.length; i++) {
				tmp = tmp << 8 | bytes[i];
				if ((i & 3) === 3) {
					out.push(tmp);
					tmp = 0;
				}
			}
			if (i & 3) out.push(bitArray.partial(8 * (i & 3), tmp));
			return out;
		}
	} };
	const hash = {};
	/**
	* Context for a SHA-1 operation in progress.
	* @constructor
	*/
	hash.sha1 = class {
		constructor(hash$1) {
			const sha1 = this;
			/**
			* The hash's block size, in bits.
			* @constant
			*/
			sha1.blockSize = 512;
			/**
			* The SHA-1 initialization vector.
			* @private
			*/
			sha1._init = [
				1732584193,
				4023233417,
				2562383102,
				271733878,
				3285377520
			];
			/**
			* The SHA-1 hash key.
			* @private
			*/
			sha1._key = [
				1518500249,
				1859775393,
				2400959708,
				3395469782
			];
			if (hash$1) {
				sha1._h = hash$1._h.slice(0);
				sha1._buffer = hash$1._buffer.slice(0);
				sha1._length = hash$1._length;
			} else sha1.reset();
		}
		/**
		* Reset the hash state.
		* @return this
		*/
		reset() {
			const sha1 = this;
			sha1._h = sha1._init.slice(0);
			sha1._buffer = [];
			sha1._length = 0;
			return sha1;
		}
		/**
		* Input several words to the hash.
		* @param {bitArray|String} data the data to hash.
		* @return this
		*/
		update(data) {
			const sha1 = this;
			if (typeof data === "string") data = codec.utf8String.toBits(data);
			const b$1 = sha1._buffer = bitArray.concat(sha1._buffer, data);
			const ol = sha1._length;
			const nl = sha1._length = ol + bitArray.bitLength(data);
			if (nl > 9007199254740991) throw new Error("Cannot hash more than 2^53 - 1 bits");
			const c$1 = new Uint32Array(b$1);
			let j = 0;
			for (let i = sha1.blockSize + ol - (sha1.blockSize + ol & sha1.blockSize - 1); i <= nl; i += sha1.blockSize) {
				sha1._block(c$1.subarray(16 * j, 16 * (j + 1)));
				j += 1;
			}
			b$1.splice(0, 16 * j);
			return sha1;
		}
		/**
		* Complete hashing and output the hash value.
		* @return {bitArray} The hash value, an array of 5 big-endian words. TODO
		*/
		finalize() {
			const sha1 = this;
			let b$1 = sha1._buffer;
			const h$1 = sha1._h;
			b$1 = bitArray.concat(b$1, [bitArray.partial(1, 1)]);
			for (let i = b$1.length + 2; i & 15; i++) b$1.push(0);
			b$1.push(Math.floor(sha1._length / 4294967296));
			b$1.push(sha1._length | 0);
			while (b$1.length) sha1._block(b$1.splice(0, 16));
			sha1.reset();
			return h$1;
		}
		/**
		* The SHA-1 logical functions f(0), f(1), ..., f(79).
		* @private
		*/
		_f(t$3, b$1, c$1, d$1) {
			if (t$3 <= 19) return b$1 & c$1 | ~b$1 & d$1;
			else if (t$3 <= 39) return b$1 ^ c$1 ^ d$1;
			else if (t$3 <= 59) return b$1 & c$1 | b$1 & d$1 | c$1 & d$1;
			else if (t$3 <= 79) return b$1 ^ c$1 ^ d$1;
		}
		/**
		* Circular left-shift operator.
		* @private
		*/
		_S(n, x) {
			return x << n | x >>> 32 - n;
		}
		/**
		* Perform one cycle of SHA-1.
		* @param {Uint32Array|bitArray} words one block of words.
		* @private
		*/
		_block(words$1) {
			const sha1 = this;
			const h$1 = sha1._h;
			const w$1 = Array(80);
			for (let j = 0; j < 16; j++) w$1[j] = words$1[j];
			let a$1 = h$1[0];
			let b$1 = h$1[1];
			let c$1 = h$1[2];
			let d$1 = h$1[3];
			let e$1 = h$1[4];
			for (let t$3 = 0; t$3 <= 79; t$3++) {
				if (t$3 >= 16) w$1[t$3] = sha1._S(1, w$1[t$3 - 3] ^ w$1[t$3 - 8] ^ w$1[t$3 - 14] ^ w$1[t$3 - 16]);
				const tmp = sha1._S(5, a$1) + sha1._f(t$3, b$1, c$1, d$1) + e$1 + w$1[t$3] + sha1._key[Math.floor(t$3 / 20)] | 0;
				e$1 = d$1;
				d$1 = c$1;
				c$1 = sha1._S(30, b$1);
				b$1 = a$1;
				a$1 = tmp;
			}
			h$1[0] = h$1[0] + a$1 | 0;
			h$1[1] = h$1[1] + b$1 | 0;
			h$1[2] = h$1[2] + c$1 | 0;
			h$1[3] = h$1[3] + d$1 | 0;
			h$1[4] = h$1[4] + e$1 | 0;
		}
	};
	/** @fileOverview Low-level AES implementation.
	*
	* This file contains a low-level implementation of AES, optimized for
	* size and for efficiency on several browsers.  It is based on
	* OpenSSL's aes_core.c, a public-domain implementation by Vincent
	* Rijmen, Antoon Bosselaers and Paulo Barreto.
	*
	* An older version of this implementation is available in the public
	* domain, but this one is (c) Emily Stark, Mike Hamburg, Dan Boneh,
	* Stanford University 2008-2010 and BSD-licensed for liability
	* reasons.
	*
	* @author Emily Stark
	* @author Mike Hamburg
	* @author Dan Boneh
	*/
	const cipher = {};
	/**
	* Schedule out an AES key for both encryption and decryption.  This
	* is a low-level class.  Use a cipher mode to do bulk encryption.
	*
	* @constructor
	* @param {Array} key The key as an array of 4, 6 or 8 words.
	*/
	cipher.aes = class {
		constructor(key$1) {
			/**
			* The expanded S-box and inverse S-box tables.  These will be computed
			* on the client so that we don't have to send them down the wire.
			*
			* There are two tables, _tables[0] is for encryption and
			* _tables[1] is for decryption.
			*
			* The first 4 sub-tables are the expanded S-box with MixColumns.  The
			* last (_tables[01][4]) is the S-box itself.
			*
			* @private
			*/
			const aes = this;
			aes._tables = [[
				[],
				[],
				[],
				[],
				[]
			], [
				[],
				[],
				[],
				[],
				[]
			]];
			if (!aes._tables[0][0][0]) aes._precompute();
			const sbox = aes._tables[0][4];
			const decTable = aes._tables[1];
			const keyLen = key$1.length;
			let i, encKey, decKey, rcon = 1;
			if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) throw new Error("invalid aes key size");
			aes._key = [encKey = key$1.slice(0), decKey = []];
			for (i = keyLen; i < 4 * keyLen + 28; i++) {
				let tmp = encKey[i - 1];
				if (i % keyLen === 0 || keyLen === 8 && i % keyLen === 4) {
					tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];
					if (i % keyLen === 0) {
						tmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;
						rcon = rcon << 1 ^ (rcon >> 7) * 283;
					}
				}
				encKey[i] = encKey[i - keyLen] ^ tmp;
			}
			for (let j = 0; i; j++, i--) {
				const tmp = encKey[j & 3 ? i : i - 4];
				if (i <= 4 || j < 4) decKey[j] = tmp;
				else decKey[j] = decTable[0][sbox[tmp >>> 24]] ^ decTable[1][sbox[tmp >> 16 & 255]] ^ decTable[2][sbox[tmp >> 8 & 255]] ^ decTable[3][sbox[tmp & 255]];
			}
		}
		/**
		* Encrypt an array of 4 big-endian words.
		* @param {Array} data The plaintext.
		* @return {Array} The ciphertext.
		*/
		encrypt(data) {
			return this._crypt(data, 0);
		}
		/**
		* Decrypt an array of 4 big-endian words.
		* @param {Array} data The ciphertext.
		* @return {Array} The plaintext.
		*/
		decrypt(data) {
			return this._crypt(data, 1);
		}
		/**
		* Expand the S-box tables.
		*
		* @private
		*/
		_precompute() {
			const encTable = this._tables[0];
			const decTable = this._tables[1];
			const sbox = encTable[4];
			const sboxInv = decTable[4];
			const d$1 = [];
			const th = [];
			let xInv, x2, x4, x8;
			for (let i = 0; i < 256; i++) th[(d$1[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;
			for (let x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
				let s$1 = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
				s$1 = s$1 >> 8 ^ s$1 & 255 ^ 99;
				sbox[x] = s$1;
				sboxInv[s$1] = x;
				x8 = d$1[x4 = d$1[x2 = d$1[x]]];
				let tDec = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
				let tEnc = d$1[s$1] * 257 ^ s$1 * 16843008;
				for (let i = 0; i < 4; i++) {
					encTable[i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
					decTable[i][s$1] = tDec = tDec << 24 ^ tDec >>> 8;
				}
			}
			for (let i = 0; i < 5; i++) {
				encTable[i] = encTable[i].slice(0);
				decTable[i] = decTable[i].slice(0);
			}
		}
		/**
		* Encryption and decryption core.
		* @param {Array} input Four words to be encrypted or decrypted.
		* @param dir The direction, 0 for encrypt and 1 for decrypt.
		* @return {Array} The four encrypted or decrypted words.
		* @private
		*/
		_crypt(input, dir$1) {
			if (input.length !== 4) throw new Error("invalid aes block size");
			const key$1 = this._key[dir$1];
			const nInnerRounds = key$1.length / 4 - 2;
			const out = [
				0,
				0,
				0,
				0
			];
			const table$3 = this._tables[dir$1];
			const t0 = table$3[0];
			const t1 = table$3[1];
			const t2 = table$3[2];
			const t3 = table$3[3];
			const sbox = table$3[4];
			let a$1 = input[0] ^ key$1[0];
			let b$1 = input[dir$1 ? 3 : 1] ^ key$1[1];
			let c$1 = input[2] ^ key$1[2];
			let d$1 = input[dir$1 ? 1 : 3] ^ key$1[3];
			let kIndex = 4;
			let a2, b2, c2;
			for (let i = 0; i < nInnerRounds; i++) {
				a2 = t0[a$1 >>> 24] ^ t1[b$1 >> 16 & 255] ^ t2[c$1 >> 8 & 255] ^ t3[d$1 & 255] ^ key$1[kIndex];
				b2 = t0[b$1 >>> 24] ^ t1[c$1 >> 16 & 255] ^ t2[d$1 >> 8 & 255] ^ t3[a$1 & 255] ^ key$1[kIndex + 1];
				c2 = t0[c$1 >>> 24] ^ t1[d$1 >> 16 & 255] ^ t2[a$1 >> 8 & 255] ^ t3[b$1 & 255] ^ key$1[kIndex + 2];
				d$1 = t0[d$1 >>> 24] ^ t1[a$1 >> 16 & 255] ^ t2[b$1 >> 8 & 255] ^ t3[c$1 & 255] ^ key$1[kIndex + 3];
				kIndex += 4;
				a$1 = a2;
				b$1 = b2;
				c$1 = c2;
			}
			for (let i = 0; i < 4; i++) {
				out[dir$1 ? 3 & -i : i] = sbox[a$1 >>> 24] << 24 ^ sbox[b$1 >> 16 & 255] << 16 ^ sbox[c$1 >> 8 & 255] << 8 ^ sbox[d$1 & 255] ^ key$1[kIndex++];
				a2 = a$1;
				a$1 = b$1;
				b$1 = c$1;
				c$1 = d$1;
				d$1 = a2;
			}
			return out;
		}
	};
	/**
	* Random values
	* @namespace
	*/
	const random = { getRandomValues(typedArray) {
		const words$1 = new Uint32Array(typedArray.buffer);
		const r$1 = (m_w) => {
			let m_z = 987654321;
			const mask = 4294967295;
			return function() {
				m_z = 36969 * (m_z & 65535) + (m_z >> 16) & mask;
				m_w = 18e3 * (m_w & 65535) + (m_w >> 16) & mask;
				return (((m_z << 16) + m_w & mask) / 4294967296 + .5) * (Math.random() > .5 ? 1 : -1);
			};
		};
		for (let i = 0, rcache; i < typedArray.length; i += 4) {
			const _r = r$1((rcache || Math.random()) * 4294967296);
			rcache = _r() * 987654071;
			words$1[i / 4] = _r() * 4294967296 | 0;
		}
		return typedArray;
	} };
	/** @fileOverview CTR mode implementation.
	*
	* Special thanks to Roy Nicholson for pointing out a bug in our
	* implementation.
	*
	* @author Emily Stark
	* @author Mike Hamburg
	* @author Dan Boneh
	*/
	/** Brian Gladman's CTR Mode.
	* @constructor
	* @param {Object} _prf The aes instance to generate key.
	* @param {bitArray} _iv The iv for ctr mode, it must be 128 bits.
	*/
	const mode = {};
	/**
	* Brian Gladman's CTR Mode.
	* @namespace
	*/
	mode.ctrGladman = class {
		constructor(prf, iv) {
			this._prf = prf;
			this._initIv = iv;
			this._iv = iv;
		}
		reset() {
			this._iv = this._initIv;
		}
		/** Input some data to calculate.
		* @param {bitArray} data the data to process, it must be intergral multiple of 128 bits unless it's the last.
		*/
		update(data) {
			return this.calculate(this._prf, data, this._iv);
		}
		incWord(word) {
			if ((word >> 24 & 255) === 255) {
				let b1 = word >> 16 & 255;
				let b2 = word >> 8 & 255;
				let b3 = word & 255;
				if (b1 === 255) {
					b1 = 0;
					if (b2 === 255) {
						b2 = 0;
						if (b3 === 255) b3 = 0;
						else ++b3;
					} else ++b2;
				} else ++b1;
				word = 0;
				word += b1 << 16;
				word += b2 << 8;
				word += b3;
			} else word += 1 << 24;
			return word;
		}
		incCounter(counter) {
			if ((counter[0] = this.incWord(counter[0])) === 0) counter[1] = this.incWord(counter[1]);
		}
		calculate(prf, data, iv) {
			let l$1;
			if (!(l$1 = data.length)) return [];
			const bl = bitArray.bitLength(data);
			for (let i = 0; i < l$1; i += 4) {
				this.incCounter(iv);
				const e$1 = prf.encrypt(iv);
				data[i] ^= e$1[0];
				data[i + 1] ^= e$1[1];
				data[i + 2] ^= e$1[2];
				data[i + 3] ^= e$1[3];
			}
			return bitArray.clamp(data, bl);
		}
	};
	const misc = {
		importKey(password) {
			return new misc.hmacSha1(codec.bytes.toBits(password));
		},
		pbkdf2(prf, salt, count, length) {
			count = count || 1e4;
			if (length < 0 || count < 0) throw new Error("invalid params to pbkdf2");
			const byteLength = (length >> 5) + 1 << 2;
			let u$1, ui, i, j, k$1;
			const arrayBuffer = new ArrayBuffer(byteLength);
			const out = new DataView(arrayBuffer);
			let outLength = 0;
			const b$1 = bitArray;
			salt = codec.bytes.toBits(salt);
			for (k$1 = 1; outLength < (byteLength || 1); k$1++) {
				u$1 = ui = prf.encrypt(b$1.concat(salt, [k$1]));
				for (i = 1; i < count; i++) {
					ui = prf.encrypt(ui);
					for (j = 0; j < ui.length; j++) u$1[j] ^= ui[j];
				}
				for (i = 0; outLength < (byteLength || 1) && i < u$1.length; i++) {
					out.setInt32(outLength, u$1[i]);
					outLength += 4;
				}
			}
			return arrayBuffer.slice(0, length / 8);
		}
	};
	/** @fileOverview HMAC implementation.
	*
	* @author Emily Stark
	* @author Mike Hamburg
	* @author Dan Boneh
	*/
	/** HMAC with the specified hash function.
	* @constructor
	* @param {bitArray} key the key for HMAC.
	* @param {Object} [Hash=hash.sha1] The hash function to use.
	*/
	misc.hmacSha1 = class {
		constructor(key$1) {
			const hmac = this;
			const Hash = hmac._hash = hash.sha1;
			const exKey = [[], []];
			hmac._baseHash = [new Hash(), new Hash()];
			const bs = hmac._baseHash[0].blockSize / 32;
			if (key$1.length > bs) key$1 = new Hash().update(key$1).finalize();
			for (let i = 0; i < bs; i++) {
				exKey[0][i] = key$1[i] ^ 909522486;
				exKey[1][i] = key$1[i] ^ 1549556828;
			}
			hmac._baseHash[0].update(exKey[0]);
			hmac._baseHash[1].update(exKey[1]);
			hmac._resultHash = new Hash(hmac._baseHash[0]);
		}
		reset() {
			const hmac = this;
			hmac._resultHash = new hmac._hash(hmac._baseHash[0]);
			hmac._updated = false;
		}
		update(data) {
			const hmac = this;
			hmac._updated = true;
			hmac._resultHash.update(data);
		}
		digest() {
			const hmac = this;
			const w$1 = hmac._resultHash.finalize();
			const result = new hmac._hash(hmac._baseHash[1]).update(w$1).finalize();
			hmac.reset();
			return result;
		}
		encrypt(data) {
			if (!this._updated) {
				this.update(data);
				return this.digest(data);
			} else throw new Error("encrypt on already updated hmac called!");
		}
	};

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/common-crypto.js
	const GET_RANDOM_VALUES_SUPPORTED = typeof crypto != UNDEFINED_TYPE && typeof crypto.getRandomValues == FUNCTION_TYPE;
	const ERR_INVALID_PASSWORD = "Invalid password";
	const ERR_INVALID_SIGNATURE = "Invalid signature";
	const ERR_ABORT_CHECK_PASSWORD = "zipjs-abort-check-password";
	function getRandomValues$1(array) {
		if (GET_RANDOM_VALUES_SUPPORTED) return crypto.getRandomValues(array);
		else return random.getRandomValues(array);
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/aes-crypto-stream.js
	const BLOCK_LENGTH = 16;
	const RAW_FORMAT = "raw";
	const PBKDF2_ALGORITHM = { name: "PBKDF2" };
	const HASH_ALGORITHM = { name: "HMAC" };
	const HASH_FUNCTION = "SHA-1";
	const BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);
	const DERIVED_BITS_ALGORITHM = Object.assign({
		iterations: 1e3,
		hash: { name: HASH_FUNCTION }
	}, PBKDF2_ALGORITHM);
	const DERIVED_BITS_USAGE = ["deriveBits"];
	const SALT_LENGTH = [
		8,
		12,
		16
	];
	const KEY_LENGTH = [
		16,
		24,
		32
	];
	const SIGNATURE_LENGTH = 10;
	const COUNTER_DEFAULT_VALUE = [
		0,
		0,
		0,
		0
	];
	const CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE;
	const subtle = CRYPTO_API_SUPPORTED && crypto.subtle;
	const SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != UNDEFINED_TYPE;
	const codecBytes = codec.bytes;
	const Aes = cipher.aes;
	const CtrGladman = mode.ctrGladman;
	const HmacSha1 = misc.hmacSha1;
	let IMPORT_KEY_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.importKey == FUNCTION_TYPE;
	let DERIVE_BITS_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.deriveBits == FUNCTION_TYPE;
	var AESDecryptionStream = class extends TransformStream {
		constructor({ password, rawPassword, signed, encryptionStrength, checkPasswordOnly }) {
			super({
				start() {
					Object.assign(this, {
						ready: new Promise((resolve) => this.resolveReady = resolve),
						password: encodePassword(password, rawPassword),
						signed,
						strength: encryptionStrength - 1,
						pending: new Uint8Array()
					});
				},
				async transform(chunk$1, controller$1) {
					const aesCrypto = this;
					const { password: password$1, strength, resolveReady, ready } = aesCrypto;
					if (password$1) {
						await createDecryptionKeys(aesCrypto, strength, password$1, subarray(chunk$1, 0, SALT_LENGTH[strength] + 2));
						chunk$1 = subarray(chunk$1, SALT_LENGTH[strength] + 2);
						if (checkPasswordOnly) controller$1.error(new Error(ERR_ABORT_CHECK_PASSWORD));
						else resolveReady();
					} else await ready;
					const output = new Uint8Array(chunk$1.length - SIGNATURE_LENGTH - (chunk$1.length - SIGNATURE_LENGTH) % BLOCK_LENGTH);
					controller$1.enqueue(append(aesCrypto, chunk$1, output, 0, SIGNATURE_LENGTH, true));
				},
				async flush(controller$1) {
					const { signed: signed$1, ctr, hmac, pending, ready } = this;
					if (hmac && ctr) {
						await ready;
						const chunkToDecrypt = subarray(pending, 0, pending.length - SIGNATURE_LENGTH);
						const originalSignature = subarray(pending, pending.length - SIGNATURE_LENGTH);
						let decryptedChunkArray = new Uint8Array();
						if (chunkToDecrypt.length) {
							const encryptedChunk = toBits(codecBytes, chunkToDecrypt);
							hmac.update(encryptedChunk);
							decryptedChunkArray = fromBits(codecBytes, ctr.update(encryptedChunk));
						}
						if (signed$1) {
							const signature = subarray(fromBits(codecBytes, hmac.digest()), 0, SIGNATURE_LENGTH);
							for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) if (signature[indexSignature] != originalSignature[indexSignature]) throw new Error(ERR_INVALID_SIGNATURE);
						}
						controller$1.enqueue(decryptedChunkArray);
					}
				}
			});
		}
	};
	var AESEncryptionStream = class extends TransformStream {
		constructor({ password, rawPassword, encryptionStrength }) {
			let stream;
			super({
				start() {
					Object.assign(this, {
						ready: new Promise((resolve) => this.resolveReady = resolve),
						password: encodePassword(password, rawPassword),
						strength: encryptionStrength - 1,
						pending: new Uint8Array()
					});
				},
				async transform(chunk$1, controller$1) {
					const aesCrypto = this;
					const { password: password$1, strength, resolveReady, ready } = aesCrypto;
					let preamble = new Uint8Array();
					if (password$1) {
						preamble = await createEncryptionKeys(aesCrypto, strength, password$1);
						resolveReady();
					} else await ready;
					const output = new Uint8Array(preamble.length + chunk$1.length - chunk$1.length % BLOCK_LENGTH);
					output.set(preamble, 0);
					controller$1.enqueue(append(aesCrypto, chunk$1, output, preamble.length, 0));
				},
				async flush(controller$1) {
					const { ctr, hmac, pending, ready } = this;
					if (hmac && ctr) {
						await ready;
						let encryptedChunkArray = new Uint8Array();
						if (pending.length) {
							const encryptedChunk = ctr.update(toBits(codecBytes, pending));
							hmac.update(encryptedChunk);
							encryptedChunkArray = fromBits(codecBytes, encryptedChunk);
						}
						stream.signature = fromBits(codecBytes, hmac.digest()).slice(0, SIGNATURE_LENGTH);
						controller$1.enqueue(concat(encryptedChunkArray, stream.signature));
					}
				}
			});
			stream = this;
		}
	};
	function append(aesCrypto, input, output, paddingStart, paddingEnd, verifySignature) {
		const { ctr, hmac, pending } = aesCrypto;
		const inputLength = input.length - paddingEnd;
		if (pending.length) {
			input = concat(pending, input);
			output = expand(output, inputLength - inputLength % BLOCK_LENGTH);
		}
		let offset;
		for (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
			const inputChunk = toBits(codecBytes, subarray(input, offset, offset + BLOCK_LENGTH));
			if (verifySignature) hmac.update(inputChunk);
			const outputChunk = ctr.update(inputChunk);
			if (!verifySignature) hmac.update(outputChunk);
			output.set(fromBits(codecBytes, outputChunk), offset + paddingStart);
		}
		aesCrypto.pending = subarray(input, offset);
		return output;
	}
	async function createDecryptionKeys(decrypt$1, strength, password, preamble) {
		const passwordVerificationKey = await createKeys$1(decrypt$1, strength, password, subarray(preamble, 0, SALT_LENGTH[strength]));
		const passwordVerification = subarray(preamble, SALT_LENGTH[strength]);
		if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) throw new Error(ERR_INVALID_PASSWORD);
	}
	async function createEncryptionKeys(encrypt$1, strength, password) {
		const salt = getRandomValues$1(new Uint8Array(SALT_LENGTH[strength]));
		return concat(salt, await createKeys$1(encrypt$1, strength, password, salt));
	}
	async function createKeys$1(aesCrypto, strength, password, salt) {
		aesCrypto.password = null;
		const baseKey = await importKey(RAW_FORMAT, password, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
		const derivedBits = await deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), baseKey, 8 * (KEY_LENGTH[strength] * 2 + 2));
		const compositeKey = new Uint8Array(derivedBits);
		const key$1 = toBits(codecBytes, subarray(compositeKey, 0, KEY_LENGTH[strength]));
		const authentication = toBits(codecBytes, subarray(compositeKey, KEY_LENGTH[strength], KEY_LENGTH[strength] * 2));
		const passwordVerification = subarray(compositeKey, KEY_LENGTH[strength] * 2);
		Object.assign(aesCrypto, {
			keys: {
				key: key$1,
				authentication,
				passwordVerification
			},
			ctr: new CtrGladman(new Aes(key$1), Array.from(COUNTER_DEFAULT_VALUE)),
			hmac: new HmacSha1(authentication)
		});
		return passwordVerification;
	}
	async function importKey(format, password, algorithm, extractable, keyUsages) {
		if (IMPORT_KEY_SUPPORTED) try {
			return await subtle.importKey(format, password, algorithm, extractable, keyUsages);
		} catch {
			IMPORT_KEY_SUPPORTED = false;
			return misc.importKey(password);
		}
		else return misc.importKey(password);
	}
	async function deriveBits(algorithm, baseKey, length) {
		if (DERIVE_BITS_SUPPORTED) try {
			return await subtle.deriveBits(algorithm, baseKey, length);
		} catch {
			DERIVE_BITS_SUPPORTED = false;
			return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
		}
		else return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
	}
	function encodePassword(password, rawPassword) {
		if (rawPassword === UNDEFINED_VALUE) return encodeText(password);
		else return rawPassword;
	}
	function concat(leftArray, rightArray) {
		let array = leftArray;
		if (leftArray.length + rightArray.length) {
			array = new Uint8Array(leftArray.length + rightArray.length);
			array.set(leftArray, 0);
			array.set(rightArray, leftArray.length);
		}
		return array;
	}
	function expand(inputArray, length) {
		if (length && length > inputArray.length) {
			const array = inputArray;
			inputArray = new Uint8Array(length);
			inputArray.set(array, 0);
		}
		return inputArray;
	}
	function subarray(array, begin, end) {
		return array.subarray(begin, end);
	}
	function fromBits(codecBytes$1, chunk$1) {
		return codecBytes$1.fromBits(chunk$1);
	}
	function toBits(codecBytes$1, chunk$1) {
		return codecBytes$1.toBits(chunk$1);
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/zip-crypto-stream.js
	const HEADER_LENGTH = 12;
	var ZipCryptoDecryptionStream = class extends TransformStream {
		constructor({ password, passwordVerification, checkPasswordOnly }) {
			super({
				start() {
					Object.assign(this, {
						password,
						passwordVerification
					});
					createKeys(this, password);
				},
				transform(chunk$1, controller$1) {
					const zipCrypto = this;
					if (zipCrypto.password) {
						const decryptedHeader = decrypt(zipCrypto, chunk$1.subarray(0, HEADER_LENGTH));
						zipCrypto.password = null;
						if (decryptedHeader.at(-1) != zipCrypto.passwordVerification) throw new Error(ERR_INVALID_PASSWORD);
						chunk$1 = chunk$1.subarray(HEADER_LENGTH);
					}
					if (checkPasswordOnly) controller$1.error(new Error(ERR_ABORT_CHECK_PASSWORD));
					else controller$1.enqueue(decrypt(zipCrypto, chunk$1));
				}
			});
		}
	};
	var ZipCryptoEncryptionStream = class extends TransformStream {
		constructor({ password, passwordVerification }) {
			super({
				start() {
					Object.assign(this, {
						password,
						passwordVerification
					});
					createKeys(this, password);
				},
				transform(chunk$1, controller$1) {
					const zipCrypto = this;
					let output;
					let offset;
					if (zipCrypto.password) {
						zipCrypto.password = null;
						const header = getRandomValues$1(new Uint8Array(HEADER_LENGTH));
						header[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;
						output = new Uint8Array(chunk$1.length + header.length);
						output.set(encrypt(zipCrypto, header), 0);
						offset = HEADER_LENGTH;
					} else {
						output = new Uint8Array(chunk$1.length);
						offset = 0;
					}
					output.set(encrypt(zipCrypto, chunk$1), offset);
					controller$1.enqueue(output);
				}
			});
		}
	};
	function decrypt(target, input) {
		const output = new Uint8Array(input.length);
		for (let index = 0; index < input.length; index++) {
			output[index] = getByte(target) ^ input[index];
			updateKeys(target, output[index]);
		}
		return output;
	}
	function encrypt(target, input) {
		const output = new Uint8Array(input.length);
		for (let index = 0; index < input.length; index++) {
			output[index] = getByte(target) ^ input[index];
			updateKeys(target, input[index]);
		}
		return output;
	}
	function createKeys(target, password) {
		const keys$1 = [
			305419896,
			591751049,
			878082192
		];
		Object.assign(target, {
			keys: keys$1,
			crcKey0: new Crc32(keys$1[0]),
			crcKey2: new Crc32(keys$1[2])
		});
		for (let index = 0; index < password.length; index++) updateKeys(target, password.charCodeAt(index));
	}
	function updateKeys(target, byte) {
		let [key0, key1, key2] = target.keys;
		target.crcKey0.append([byte]);
		key0 = ~target.crcKey0.get();
		key1 = getInt32(Math.imul(getInt32(key1 + getInt8(key0)), 134775813) + 1);
		target.crcKey2.append([key1 >>> 24]);
		key2 = ~target.crcKey2.get();
		target.keys = [
			key0,
			key1,
			key2
		];
	}
	function getByte(target) {
		const temp = target.keys[2] | 2;
		return getInt8(Math.imul(temp, temp ^ 1) >>> 8);
	}
	function getInt8(number$1) {
		return number$1 & 255;
	}
	function getInt32(number$1) {
		return number$1 & 4294967295;
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/zip-entry-stream.js
	const ERR_INVALID_UNCOMPRESSED_SIZE = "Invalid uncompressed size";
	const FORMAT_DEFLATE_RAW = "deflate-raw";
	const FORMAT_DEFLATE64_RAW = "deflate64-raw";
	var DeflateStream = class extends TransformStream {
		constructor(options, { chunkSize, CompressionStreamZlib: CompressionStreamZlib$1, CompressionStream: CompressionStream$1 }) {
			super({});
			const { compressed, encrypted, useCompressionStream, zipCrypto, signed, level } = options;
			const stream = this;
			let crc32Stream, encryptionStream;
			let readable = super.readable;
			if ((!encrypted || zipCrypto) && signed) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			if (compressed) readable = pipeThroughCommpressionStream(readable, useCompressionStream, {
				level,
				chunkSize
			}, CompressionStream$1, CompressionStreamZlib$1, CompressionStream$1);
			if (encrypted) if (zipCrypto) readable = pipeThrough(readable, new ZipCryptoEncryptionStream(options));
			else {
				encryptionStream = new AESEncryptionStream(options);
				readable = pipeThrough(readable, encryptionStream);
			}
			setReadable(stream, readable, () => {
				let signature;
				if (encrypted && !zipCrypto) signature = encryptionStream.signature;
				if ((!encrypted || zipCrypto) && signed) signature = new DataView(crc32Stream.value.buffer).getUint32(0);
				stream.signature = signature;
			});
		}
	};
	var InflateStream = class extends TransformStream {
		constructor(options, { chunkSize, DecompressionStreamZlib: DecompressionStreamZlib$1, DecompressionStream: DecompressionStream$1 }) {
			super({});
			const { zipCrypto, encrypted, signed, signature, compressed, useCompressionStream, deflate64 } = options;
			let crc32Stream, decryptionStream;
			let readable = super.readable;
			if (encrypted) if (zipCrypto) readable = pipeThrough(readable, new ZipCryptoDecryptionStream(options));
			else {
				decryptionStream = new AESDecryptionStream(options);
				readable = pipeThrough(readable, decryptionStream);
			}
			if (compressed) readable = pipeThroughCommpressionStream(readable, useCompressionStream, {
				chunkSize,
				deflate64
			}, DecompressionStream$1, DecompressionStreamZlib$1, DecompressionStream$1);
			if ((!encrypted || zipCrypto) && signed) {
				crc32Stream = new Crc32Stream();
				readable = pipeThrough(readable, crc32Stream);
			}
			setReadable(this, readable, () => {
				if ((!encrypted || zipCrypto) && signed) {
					if (signature != new DataView(crc32Stream.value.buffer).getUint32(0, false)) throw new Error(ERR_INVALID_SIGNATURE);
				}
			});
		}
	};
	function setReadable(stream, readable, flush) {
		readable = pipeThrough(readable, new TransformStream({ flush }));
		Object.defineProperty(stream, "readable", { get() {
			return readable;
		} });
	}
	function pipeThroughCommpressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamZlib$1, CompressionStream$1) {
		const Stream$1 = useCompressionStream && CompressionStreamNative ? CompressionStreamNative : CompressionStreamZlib$1 || CompressionStream$1;
		const format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;
		try {
			readable = pipeThrough(readable, new Stream$1(format, options));
		} catch (error) {
			if (useCompressionStream) if (CompressionStreamZlib$1) readable = pipeThrough(readable, new CompressionStreamZlib$1(format, options));
			else if (CompressionStream$1) readable = pipeThrough(readable, new CompressionStream$1(format, options));
			else throw error;
			else throw error;
		}
		return readable;
	}
	function pipeThrough(readable, transformStream) {
		return readable.pipeThrough(transformStream);
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/codec-stream.js
	const MESSAGE_EVENT_TYPE = "message";
	const MESSAGE_START = "start";
	const MESSAGE_PULL = "pull";
	const MESSAGE_DATA = "data";
	const MESSAGE_ACK_DATA = "ack";
	const MESSAGE_CLOSE = "close";
	const CODEC_DEFLATE = "deflate";
	const CODEC_INFLATE = "inflate";
	var CodecStream = class extends TransformStream {
		constructor(options, config$1) {
			super({});
			const codec$1 = this;
			const { codecType } = options;
			let Stream$1;
			if (codecType.startsWith(CODEC_DEFLATE)) Stream$1 = DeflateStream;
			else if (codecType.startsWith(CODEC_INFLATE)) Stream$1 = InflateStream;
			codec$1.outputSize = 0;
			let inputSize = 0;
			const stream = new Stream$1(options, config$1);
			const readable = super.readable;
			const inputSizeStream = new TransformStream({
				transform(chunk$1, controller$1) {
					if (chunk$1 && chunk$1.length) {
						inputSize += chunk$1.length;
						controller$1.enqueue(chunk$1);
					}
				},
				flush() {
					Object.assign(codec$1, { inputSize });
				}
			});
			const outputSizeStream = new TransformStream({
				transform(chunk$1, controller$1) {
					if (chunk$1 && chunk$1.length) {
						controller$1.enqueue(chunk$1);
						codec$1.outputSize += chunk$1.length;
						if (options.outputSize !== UNDEFINED_VALUE && codec$1.outputSize > options.outputSize) throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
					}
				},
				flush() {
					const { signature } = stream;
					Object.assign(codec$1, {
						signature,
						inputSize
					});
				}
			});
			Object.defineProperty(codec$1, "readable", { get() {
				return readable.pipeThrough(inputSizeStream).pipeThrough(stream).pipeThrough(outputSizeStream);
			} });
		}
	};
	var ChunkStream = class extends TransformStream {
		constructor(chunkSize) {
			let pendingChunk;
			super({
				transform,
				flush(controller$1) {
					if (pendingChunk && pendingChunk.length) controller$1.enqueue(pendingChunk);
				}
			});
			function transform(chunk$1, controller$1) {
				if (pendingChunk) {
					const newChunk = new Uint8Array(pendingChunk.length + chunk$1.length);
					newChunk.set(pendingChunk);
					newChunk.set(chunk$1, pendingChunk.length);
					chunk$1 = newChunk;
					pendingChunk = null;
				}
				if (chunk$1.length > chunkSize) {
					controller$1.enqueue(chunk$1.slice(0, chunkSize));
					transform(chunk$1.slice(chunkSize), controller$1);
				} else pendingChunk = chunk$1;
			}
		}
	};

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/codec-worker.js
	let WEB_WORKERS_SUPPORTED = typeof Worker != UNDEFINED_TYPE;
	let initModule$1 = () => {};
	function configureWorker({ initModule: initModuleFunction }) {
		initModule$1 = initModuleFunction;
	}
	var CodecWorker = class {
		constructor(workerData, { readable, writable }, { options, config: config$1, streamOptions, useWebWorkers, transferStreams, workerURI }, onTaskFinished) {
			const { signal } = streamOptions;
			Object.assign(workerData, {
				busy: true,
				readable: readable.pipeThrough(new ChunkStream(config$1.chunkSize)).pipeThrough(new ProgressWatcherStream(streamOptions), { signal }),
				writable,
				options: Object.assign({}, options),
				workerURI,
				transferStreams,
				terminate() {
					return new Promise((resolve) => {
						const { worker, busy } = workerData;
						if (worker) {
							if (busy) workerData.resolveTerminated = resolve;
							else {
								worker.terminate();
								resolve();
							}
							workerData.interface = null;
						} else resolve();
					});
				},
				onTaskFinished() {
					const { resolveTerminated } = workerData;
					if (resolveTerminated) {
						workerData.resolveTerminated = null;
						workerData.terminated = true;
						workerData.worker.terminate();
						resolveTerminated();
					}
					workerData.busy = false;
					onTaskFinished(workerData);
				}
			});
			return (useWebWorkers && WEB_WORKERS_SUPPORTED ? createWebWorkerInterface : createWorkerInterface)(workerData, config$1);
		}
	};
	var ProgressWatcherStream = class extends TransformStream {
		constructor({ onstart, onprogress, size, onend }) {
			let chunkOffset = 0;
			super({
				async start() {
					if (onstart) await callHandler(onstart, size);
				},
				async transform(chunk$1, controller$1) {
					chunkOffset += chunk$1.length;
					if (onprogress) await callHandler(onprogress, chunkOffset, size);
					controller$1.enqueue(chunk$1);
				},
				async flush() {
					if (onend) await callHandler(onend, chunkOffset);
				}
			});
		}
	};
	async function callHandler(handler, ...parameters) {
		try {
			await handler(...parameters);
		} catch {}
	}
	function createWorkerInterface(workerData, config$1) {
		return { run: () => runWorker$1(workerData, config$1) };
	}
	function createWebWorkerInterface(workerData, config$1) {
		const { baseURI, chunkSize } = config$1;
		let { wasmURI } = config$1;
		if (!workerData.interface) {
			if (typeof wasmURI == FUNCTION_TYPE) wasmURI = wasmURI();
			let worker;
			try {
				worker = getWebWorker(workerData.workerURI, baseURI, workerData);
			} catch {
				WEB_WORKERS_SUPPORTED = false;
				return createWorkerInterface(workerData, config$1);
			}
			Object.assign(workerData, {
				worker,
				interface: { run: () => runWebWorker(workerData, {
					chunkSize,
					wasmURI,
					baseURI
				}) }
			});
		}
		return workerData.interface;
	}
	async function runWorker$1({ options, readable, writable, onTaskFinished }, config$1) {
		let codecStream;
		try {
			if (!options.useCompressionStream) try {
				await initModule$1(config$1);
			} catch {
				options.useCompressionStream = true;
			}
			codecStream = new CodecStream(options, config$1);
			await readable.pipeThrough(codecStream).pipeTo(writable, {
				preventClose: true,
				preventAbort: true
			});
			const { signature, inputSize, outputSize } = codecStream;
			return {
				signature,
				inputSize,
				outputSize
			};
		} catch (error) {
			if (codecStream) error.outputSize = codecStream.outputSize;
			throw error;
		} finally {
			onTaskFinished();
		}
	}
	async function runWebWorker(workerData, config$1) {
		let resolveResult, rejectResult;
		const result = new Promise((resolve, reject) => {
			resolveResult = resolve;
			rejectResult = reject;
		});
		Object.assign(workerData, {
			reader: null,
			writer: null,
			resolveResult,
			rejectResult,
			result
		});
		const { readable, options } = workerData;
		const { writable, closed } = watchClosedStream(workerData.writable);
		const streamsTransferred = sendMessage({
			type: MESSAGE_START,
			options,
			config: config$1,
			readable,
			writable
		}, workerData);
		if (!streamsTransferred) Object.assign(workerData, {
			reader: readable.getReader(),
			writer: writable.getWriter()
		});
		const resultValue = await result;
		if (!streamsTransferred) await writable.getWriter().close();
		await closed;
		return resultValue;
	}
	function watchClosedStream(writableSource) {
		let resolveStreamClosed;
		const closed = new Promise((resolve) => resolveStreamClosed = resolve);
		return {
			writable: new WritableStream({
				async write(chunk$1) {
					const writer = writableSource.getWriter();
					await writer.ready;
					await writer.write(chunk$1);
					writer.releaseLock();
				},
				close() {
					resolveStreamClosed();
				},
				abort(reason) {
					return writableSource.getWriter().abort(reason);
				}
			}),
			closed
		};
	}
	let transferStreamsSupported = true;
	function getWebWorker(url, baseURI, workerData) {
		const workerOptions = { type: "module" };
		let scriptUrl, worker;
		if (typeof url == FUNCTION_TYPE) url = url();
		if (url.startsWith("data:") || url.startsWith("blob:")) try {
			worker = new Worker(url);
		} catch {
			worker = new Worker(url, workerOptions);
		}
		else {
			try {
				scriptUrl = new URL(url, baseURI);
			} catch {
				scriptUrl = url;
			}
			worker = new Worker(scriptUrl, workerOptions);
		}
		worker.addEventListener(MESSAGE_EVENT_TYPE, (event) => onMessage(event, workerData));
		return worker;
	}
	function sendMessage(message, { worker, writer, onTaskFinished, transferStreams }) {
		try {
			const { value, readable, writable } = message;
			const transferables = [];
			if (value) {
				message.value = value;
				transferables.push(message.value.buffer);
			}
			if (transferStreams && transferStreamsSupported) {
				if (readable) transferables.push(readable);
				if (writable) transferables.push(writable);
			} else message.readable = message.writable = null;
			if (transferables.length) try {
				worker.postMessage(message, transferables);
				return true;
			} catch {
				transferStreamsSupported = false;
				message.readable = message.writable = null;
				worker.postMessage(message);
			}
			else worker.postMessage(message);
		} catch (error) {
			if (writer) writer.releaseLock();
			onTaskFinished();
			throw error;
		}
	}
	async function onMessage({ data }, workerData) {
		const { type, value, messageId, result, error } = data;
		const { reader, writer, resolveResult, rejectResult, onTaskFinished } = workerData;
		try {
			if (error) {
				const { message, stack, code: code$2, name, outputSize } = error;
				const responseError = new Error(message);
				Object.assign(responseError, {
					stack,
					code: code$2,
					name,
					outputSize
				});
				close(responseError);
			} else {
				if (type == MESSAGE_PULL) {
					const { value: value$1, done } = await reader.read();
					sendMessage({
						type: MESSAGE_DATA,
						value: value$1,
						done,
						messageId
					}, workerData);
				}
				if (type == MESSAGE_DATA) {
					await writer.ready;
					await writer.write(new Uint8Array(value));
					sendMessage({
						type: MESSAGE_ACK_DATA,
						messageId
					}, workerData);
				}
				if (type == MESSAGE_CLOSE) close(null, result);
			}
		} catch (error$1) {
			sendMessage({
				type: MESSAGE_CLOSE,
				messageId
			}, workerData);
			close(error$1);
		}
		function close(error$1, result$1) {
			if (error$1) rejectResult(error$1);
			else resolveResult(result$1);
			if (writer) writer.releaseLock();
			onTaskFinished();
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/codec-pool.js
	let pool = [];
	const pendingRequests = [];
	let indexWorker = 0;
	async function runWorker(stream, workerOptions) {
		const { options, config: config$1 } = workerOptions;
		const { transferStreams, useWebWorkers, useCompressionStream, compressed, signed, encrypted } = options;
		const { workerURI, maxWorkers: maxWorkers$1 } = config$1;
		workerOptions.transferStreams = transferStreams || transferStreams === UNDEFINED_VALUE;
		workerOptions.useWebWorkers = !(!compressed && !signed && !encrypted && !workerOptions.transferStreams) && (useWebWorkers || useWebWorkers === UNDEFINED_VALUE && config$1.useWebWorkers);
		workerOptions.workerURI = workerOptions.useWebWorkers && workerURI ? workerURI : UNDEFINED_VALUE;
		options.useCompressionStream = useCompressionStream || useCompressionStream === UNDEFINED_VALUE && config$1.useCompressionStream;
		return (await getWorker()).run();
		async function getWorker() {
			const workerData = pool.find((workerData$1) => !workerData$1.busy);
			if (workerData) {
				clearTerminateTimeout(workerData);
				return new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
			} else if (pool.length < maxWorkers$1) {
				const workerData$1 = { indexWorker };
				indexWorker++;
				pool.push(workerData$1);
				return new CodecWorker(workerData$1, stream, workerOptions, onTaskFinished);
			} else return new Promise((resolve) => pendingRequests.push({
				resolve,
				stream,
				workerOptions
			}));
		}
		function onTaskFinished(workerData) {
			if (pendingRequests.length) {
				const [{ resolve, stream: stream$1, workerOptions: workerOptions$1 }] = pendingRequests.splice(0, 1);
				resolve(new CodecWorker(workerData, stream$1, workerOptions$1, onTaskFinished));
			} else if (workerData.worker) {
				clearTerminateTimeout(workerData);
				terminateWorker(workerData, workerOptions);
			} else pool = pool.filter((data) => data != workerData);
		}
	}
	function terminateWorker(workerData, workerOptions) {
		const { config: config$1 } = workerOptions;
		const { terminateWorkerTimeout } = config$1;
		if (Number.isFinite(terminateWorkerTimeout) && terminateWorkerTimeout >= 0) if (workerData.terminated) workerData.terminated = false;
		else workerData.terminateTimeout = setTimeout(async () => {
			pool = pool.filter((data) => data != workerData);
			try {
				await workerData.terminate();
			} catch {}
		}, terminateWorkerTimeout);
	}
	function clearTerminateTimeout(workerData) {
		const { terminateTimeout } = workerData;
		if (terminateTimeout) {
			clearTimeout(terminateTimeout);
			workerData.terminateTimeout = null;
		}
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/io.js
	const ERR_HTTP_STATUS = "HTTP error ";
	const ERR_HTTP_RANGE = "HTTP Range not supported";
	const ERR_ITERATOR_COMPLETED_TOO_SOON = "Writer iterator completed too soon";
	const ERR_WRITER_NOT_INITIALIZED = "Writer not initialized";
	const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
	const HTTP_HEADER_CONTENT_LENGTH = "Content-Length";
	const HTTP_HEADER_CONTENT_RANGE = "Content-Range";
	const HTTP_HEADER_ACCEPT_RANGES = "Accept-Ranges";
	const HTTP_HEADER_RANGE = "Range";
	const HTTP_HEADER_CONTENT_TYPE = "Content-Type";
	const HTTP_METHOD_HEAD = "HEAD";
	const HTTP_METHOD_GET = "GET";
	const HTTP_RANGE_UNIT = "bytes";
	const DEFAULT_CHUNK_SIZE = 64 * 1024;
	const PROPERTY_NAME_WRITABLE = "writable";
	var Stream = class {
		constructor() {
			this.size = 0;
		}
		init() {
			this.initialized = true;
		}
	};
	var Reader = class extends Stream {
		get readable() {
			const reader = this;
			const { chunkSize = DEFAULT_CHUNK_SIZE } = reader;
			const readable = new ReadableStream({
				start() {
					this.chunkOffset = 0;
				},
				async pull(controller$1) {
					const { offset = 0, size, diskNumberStart } = readable;
					const { chunkOffset } = this;
					const dataSize = size === UNDEFINED_VALUE ? chunkSize : Math.min(chunkSize, size - chunkOffset);
					const data = await readUint8Array(reader, offset + chunkOffset, dataSize, diskNumberStart);
					controller$1.enqueue(data);
					if (chunkOffset + chunkSize > size || size === UNDEFINED_VALUE && !data.length && dataSize) controller$1.close();
					else this.chunkOffset += chunkSize;
				}
			});
			return readable;
		}
	};
	var Writer = class extends Stream {
		constructor() {
			super();
			const writer = this;
			const writable = new WritableStream({ write(chunk$1) {
				if (!writer.initialized) throw new Error(ERR_WRITER_NOT_INITIALIZED);
				return writer.writeUint8Array(chunk$1);
			} });
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, { get() {
				return writable;
			} });
		}
		writeUint8Array() {}
	};
	var Data64URIReader = class extends Reader {
		constructor(dataURI) {
			super();
			let dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=") dataEnd--;
			const dataStart = dataURI.indexOf(",") + 1;
			Object.assign(this, {
				dataURI,
				dataStart,
				size: Math.floor((dataEnd - dataStart) * .75)
			});
		}
		readUint8Array(offset, length) {
			const { dataStart, dataURI } = this;
			const dataArray = new Uint8Array(length);
			const start = Math.floor(offset / 3) * 4;
			const bytes = atob(dataURI.substring(start + dataStart, Math.ceil((offset + length) / 3) * 4 + dataStart));
			const delta = offset - Math.floor(start / 4) * 3;
			let effectiveLength = 0;
			for (let indexByte = delta; indexByte < delta + length && indexByte < bytes.length; indexByte++) {
				dataArray[indexByte - delta] = bytes.charCodeAt(indexByte);
				effectiveLength++;
			}
			if (effectiveLength < dataArray.length) return dataArray.subarray(0, effectiveLength);
			else return dataArray;
		}
	};
	var Data64URIWriter = class extends Writer {
		constructor(contentType) {
			super();
			Object.assign(this, {
				data: "data:" + (contentType || "") + ";base64,",
				pending: []
			});
		}
		writeUint8Array(array) {
			const writer = this;
			let indexArray = 0;
			let dataString = writer.pending;
			const delta = writer.pending.length;
			writer.pending = "";
			for (indexArray = 0; indexArray < Math.floor((delta + array.length) / 3) * 3 - delta; indexArray++) dataString += String.fromCharCode(array[indexArray]);
			for (; indexArray < array.length; indexArray++) writer.pending += String.fromCharCode(array[indexArray]);
			if (dataString.length) if (dataString.length > 2) writer.data += btoa(dataString);
			else writer.pending += dataString;
		}
		getData() {
			return this.data + btoa(this.pending);
		}
	};
	var BlobReader = class extends Reader {
		constructor(blob) {
			super();
			Object.assign(this, {
				blob,
				size: blob.size
			});
		}
		async readUint8Array(offset, length) {
			const reader = this;
			const offsetEnd = offset + length;
			let arrayBuffer = await (offset || offsetEnd < reader.size ? reader.blob.slice(offset, offsetEnd) : reader.blob).arrayBuffer();
			if (arrayBuffer.byteLength > length) arrayBuffer = arrayBuffer.slice(offset, offsetEnd);
			return new Uint8Array(arrayBuffer);
		}
	};
	var BlobWriter = class extends Stream {
		constructor(contentType) {
			super();
			const writer = this;
			const transformStream = new TransformStream();
			const headers = [];
			if (contentType) headers.push([HTTP_HEADER_CONTENT_TYPE, contentType]);
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, { get() {
				return transformStream.writable;
			} });
			writer.blob = new Response(transformStream.readable, { headers }).blob();
		}
		getData() {
			return this.blob;
		}
	};
	var TextReader = class extends BlobReader {
		constructor(text$3) {
			super(new Blob([text$3], { type: CONTENT_TYPE_TEXT_PLAIN }));
		}
	};
	var TextWriter = class extends BlobWriter {
		constructor(encoding) {
			super(encoding);
			Object.assign(this, {
				encoding,
				utf8: !encoding || encoding.toLowerCase() == "utf-8"
			});
		}
		async getData() {
			const { encoding, utf8 } = this;
			const blob = await super.getData();
			if (blob.text && utf8) return blob.text();
			else {
				const reader = new FileReader();
				return new Promise((resolve, reject) => {
					Object.assign(reader, {
						onload: ({ target }) => resolve(target.result),
						onerror: () => reject(reader.error)
					});
					reader.readAsText(blob, encoding);
				});
			}
		}
	};
	var FetchReader = class extends Reader {
		constructor(url, options) {
			super();
			createHttpReader(this, url, options);
		}
		async init() {
			await initHttpReader(this, sendFetchRequest, getFetchRequestData);
			super.init();
		}
		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendFetchRequest, getFetchRequestData);
		}
	};
	var XHRReader = class extends Reader {
		constructor(url, options) {
			super();
			createHttpReader(this, url, options);
		}
		async init() {
			await initHttpReader(this, sendXMLHttpRequest, getXMLHttpRequestData);
			super.init();
		}
		readUint8Array(index, length) {
			return readUint8ArrayHttpReader(this, index, length, sendXMLHttpRequest, getXMLHttpRequestData);
		}
	};
	function createHttpReader(httpReader, url, options) {
		const { preventHeadRequest, useRangeHeader, forceRangeRequests, combineSizeEocd } = options;
		options = Object.assign({}, options);
		delete options.preventHeadRequest;
		delete options.useRangeHeader;
		delete options.forceRangeRequests;
		delete options.combineSizeEocd;
		delete options.useXHR;
		Object.assign(httpReader, {
			url,
			options,
			preventHeadRequest,
			useRangeHeader,
			forceRangeRequests,
			combineSizeEocd
		});
	}
	async function initHttpReader(httpReader, sendRequest, getRequestData$1) {
		const { url, preventHeadRequest, useRangeHeader, forceRangeRequests, combineSizeEocd } = httpReader;
		if (isHttpFamily(url) && (useRangeHeader || forceRangeRequests) && (typeof preventHeadRequest == "undefined" || preventHeadRequest)) {
			const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, combineSizeEocd ? -END_OF_CENTRAL_DIR_LENGTH : void 0));
			const acceptRanges = response.headers.get(HTTP_HEADER_ACCEPT_RANGES);
			if (!forceRangeRequests && (!acceptRanges || acceptRanges.toLowerCase() != HTTP_RANGE_UNIT)) throw new Error(ERR_HTTP_RANGE);
			else {
				if (combineSizeEocd) httpReader.eocdCache = new Uint8Array(await response.arrayBuffer());
				let contentSize;
				const contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);
				if (contentRangeHeader) {
					const splitHeader = contentRangeHeader.trim().split(/\s*\/\s*/);
					if (splitHeader.length) {
						const headerValue = splitHeader[1];
						if (headerValue && headerValue != "*") contentSize = Number(headerValue);
					}
				}
				if (contentSize === UNDEFINED_VALUE) await getContentLength(httpReader, sendRequest, getRequestData$1);
				else httpReader.size = contentSize;
			}
		} else await getContentLength(httpReader, sendRequest, getRequestData$1);
	}
	async function readUint8ArrayHttpReader(httpReader, index, length, sendRequest, getRequestData$1) {
		const { useRangeHeader, forceRangeRequests, eocdCache, size, options } = httpReader;
		if (useRangeHeader || forceRangeRequests) {
			if (eocdCache && index == size - END_OF_CENTRAL_DIR_LENGTH && length == END_OF_CENTRAL_DIR_LENGTH) return eocdCache;
			if (index >= size) return new Uint8Array();
			else {
				if (index + length > size) length = size - index;
				const response = await sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, index, length));
				if (response.status != 206) throw new Error(ERR_HTTP_RANGE);
				return new Uint8Array(await response.arrayBuffer());
			}
		} else {
			const { data } = httpReader;
			if (!data) await getRequestData$1(httpReader, options);
			return new Uint8Array(httpReader.data.subarray(index, index + length));
		}
	}
	function getRangeHeaders(httpReader, index = 0, length = 1) {
		return Object.assign({}, getHeaders(httpReader), { [HTTP_HEADER_RANGE]: HTTP_RANGE_UNIT + "=" + (index < 0 ? index : index + "-" + (index + length - 1)) });
	}
	function getHeaders({ options }) {
		const { headers } = options;
		if (headers) if (Symbol.iterator in headers) return Object.fromEntries(headers);
		else return headers;
	}
	async function getFetchRequestData(httpReader) {
		await getRequestData(httpReader, sendFetchRequest);
	}
	async function getXMLHttpRequestData(httpReader) {
		await getRequestData(httpReader, sendXMLHttpRequest);
	}
	async function getRequestData(httpReader, sendRequest) {
		const response = await sendRequest(HTTP_METHOD_GET, httpReader, getHeaders(httpReader));
		httpReader.data = new Uint8Array(await response.arrayBuffer());
		if (!httpReader.size) httpReader.size = httpReader.data.length;
	}
	async function getContentLength(httpReader, sendRequest, getRequestData$1) {
		if (httpReader.preventHeadRequest) await getRequestData$1(httpReader, httpReader.options);
		else {
			const contentLength = (await sendRequest(HTTP_METHOD_HEAD, httpReader, getHeaders(httpReader))).headers.get(HTTP_HEADER_CONTENT_LENGTH);
			if (contentLength) httpReader.size = Number(contentLength);
			else await getRequestData$1(httpReader, httpReader.options);
		}
	}
	async function sendFetchRequest(method, { options, url }, headers) {
		const response = await fetch(url, Object.assign({}, options, {
			method,
			headers
		}));
		if (response.status < 400) return response;
		else throw response.status == 416 ? new Error(ERR_HTTP_RANGE) : new Error(ERR_HTTP_STATUS + (response.statusText || response.status));
	}
	function sendXMLHttpRequest(method, { url }, headers) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.addEventListener("load", () => {
				if (request.status < 400) {
					const headers$1 = [];
					request.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach((header) => {
						const splitHeader = header.trim().split(/\s*:\s*/);
						splitHeader[0] = splitHeader[0].trim().replace(/^[a-z]|-[a-z]/g, (value) => value.toUpperCase());
						headers$1.push(splitHeader);
					});
					resolve({
						status: request.status,
						arrayBuffer: () => request.response,
						headers: new Map(headers$1)
					});
				} else reject(request.status == 416 ? new Error(ERR_HTTP_RANGE) : new Error(ERR_HTTP_STATUS + (request.statusText || request.status)));
			}, false);
			request.addEventListener("error", (event) => reject(event.detail ? event.detail.error : /* @__PURE__ */ new Error("Network error")), false);
			request.open(method, url);
			if (headers) for (const entry of Object.entries(headers)) request.setRequestHeader(entry[0], entry[1]);
			request.responseType = "arraybuffer";
			request.send();
		});
	}
	var HttpReader = class extends Reader {
		constructor(url, options = {}) {
			super();
			Object.assign(this, {
				url,
				reader: options.useXHR ? new XHRReader(url, options) : new FetchReader(url, options)
			});
		}
		set size(value) {}
		get size() {
			return this.reader.size;
		}
		async init() {
			await this.reader.init();
			super.init();
		}
		readUint8Array(index, length) {
			return this.reader.readUint8Array(index, length);
		}
	};
	var Uint8ArrayReader = class extends Reader {
		constructor(array) {
			super();
			array = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
			Object.assign(this, {
				array,
				size: array.length
			});
		}
		readUint8Array(index, length) {
			return this.array.slice(index, index + length);
		}
	};
	var Uint8ArrayWriter = class extends Writer {
		init(initSize = 0) {
			Object.assign(this, {
				offset: 0,
				array: new Uint8Array(initSize)
			});
			super.init();
		}
		writeUint8Array(array) {
			const writer = this;
			if (writer.offset + array.length > writer.array.length) {
				const previousArray = writer.array;
				writer.array = new Uint8Array(previousArray.length + array.length);
				writer.array.set(previousArray);
			}
			writer.array.set(array, writer.offset);
			writer.offset += array.length;
		}
		getData() {
			return this.array;
		}
	};
	var SplitDataReader = class extends Reader {
		constructor(readers) {
			super();
			this.readers = readers;
		}
		async init() {
			const reader = this;
			const { readers } = reader;
			reader.lastDiskNumber = 0;
			reader.lastDiskOffset = 0;
			await Promise.all(readers.map(async (diskReader, indexDiskReader) => {
				await diskReader.init();
				if (indexDiskReader != readers.length - 1) reader.lastDiskOffset += diskReader.size;
				reader.size += diskReader.size;
			}));
			super.init();
		}
		async readUint8Array(offset, length, diskNumber = 0) {
			const reader = this;
			const { readers } = this;
			let result;
			let currentDiskNumber = diskNumber;
			if (currentDiskNumber == -1) currentDiskNumber = readers.length - 1;
			let currentReaderOffset = offset;
			while (readers[currentDiskNumber] && currentReaderOffset >= readers[currentDiskNumber].size) {
				currentReaderOffset -= readers[currentDiskNumber].size;
				currentDiskNumber++;
			}
			const currentReader = readers[currentDiskNumber];
			if (currentReader) {
				const currentReaderSize = currentReader.size;
				if (currentReaderOffset + length <= currentReaderSize) result = await readUint8Array(currentReader, currentReaderOffset, length);
				else {
					const chunkLength = currentReaderSize - currentReaderOffset;
					result = new Uint8Array(length);
					const firstPart = await readUint8Array(currentReader, currentReaderOffset, chunkLength);
					result.set(firstPart, 0);
					const secondPart = await reader.readUint8Array(offset + chunkLength, length - chunkLength, diskNumber);
					result.set(secondPart, chunkLength);
					if (firstPart.length + secondPart.length < length) result = result.subarray(0, firstPart.length + secondPart.length);
				}
			} else result = new Uint8Array();
			reader.lastDiskNumber = Math.max(currentDiskNumber, reader.lastDiskNumber);
			return result;
		}
	};
	var SplitDataWriter = class extends Stream {
		constructor(writerGenerator, maxSize = 4294967295) {
			super();
			const writer = this;
			Object.assign(writer, {
				diskNumber: 0,
				diskOffset: 0,
				size: 0,
				maxSize,
				availableSize: maxSize
			});
			let diskSourceWriter, diskWritable, diskWriter;
			const writable = new WritableStream({
				async write(chunk$1) {
					const { availableSize } = writer;
					if (!diskWriter) {
						const { value, done } = await writerGenerator.next();
						if (done && !value) throw new Error(ERR_ITERATOR_COMPLETED_TOO_SOON);
						else {
							diskSourceWriter = value;
							diskSourceWriter.size = 0;
							if (diskSourceWriter.maxSize) writer.maxSize = diskSourceWriter.maxSize;
							writer.availableSize = writer.maxSize;
							await initStream(diskSourceWriter);
							diskWritable = value.writable;
							diskWriter = diskWritable.getWriter();
						}
						await this.write(chunk$1);
					} else if (chunk$1.length >= availableSize) {
						await writeChunk(chunk$1.subarray(0, availableSize));
						await closeDisk();
						writer.diskOffset += diskSourceWriter.size;
						writer.diskNumber++;
						diskWriter = null;
						await this.write(chunk$1.subarray(availableSize));
					} else await writeChunk(chunk$1);
				},
				async close() {
					await diskWriter.ready;
					await closeDisk();
				}
			});
			Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, { get() {
				return writable;
			} });
			async function writeChunk(chunk$1) {
				const chunkLength = chunk$1.length;
				if (chunkLength) {
					await diskWriter.ready;
					await diskWriter.write(chunk$1);
					diskSourceWriter.size += chunkLength;
					writer.size += chunkLength;
					writer.availableSize -= chunkLength;
				}
			}
			async function closeDisk() {
				await diskWriter.close();
			}
		}
	};
	var GenericReader = class {
		constructor(reader) {
			if (Array.isArray(reader)) reader = new SplitDataReader(reader);
			if (reader instanceof ReadableStream) reader = { readable: reader };
			return reader;
		}
	};
	var GenericWriter = class {
		constructor(writer) {
			if (writer.writable === UNDEFINED_VALUE && typeof writer.next == FUNCTION_TYPE) writer = new SplitDataWriter(writer);
			if (writer instanceof WritableStream) writer = { writable: writer };
			if (writer.size === UNDEFINED_VALUE) writer.size = 0;
			if (!(writer instanceof SplitDataWriter)) Object.assign(writer, {
				diskNumber: 0,
				diskOffset: 0,
				availableSize: Infinity,
				maxSize: Infinity
			});
			return writer;
		}
	};
	function isHttpFamily(url) {
		const { baseURI } = getConfiguration();
		const { protocol } = new URL(url, baseURI);
		return protocol == "http:" || protocol == "https:";
	}
	async function initStream(stream, initSize) {
		if (stream.init && !stream.initialized) await stream.init(initSize);
		else return Promise.resolve();
	}
	function readUint8Array(reader, offset, size, diskNumber) {
		return reader.readUint8Array(offset, size, diskNumber);
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/util/decode-cp437.js
	const CP437 = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split("");
	const VALID_CP437 = CP437.length == 256;
	function decodeCP437(stringValue) {
		if (VALID_CP437) {
			let result = "";
			for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) result += CP437[stringValue[indexCharacter]];
			return result;
		} else return new TextDecoder().decode(stringValue);
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/util/decode-text.js
	function decodeText(value, encoding) {
		if (encoding && encoding.trim().toLowerCase() == "cp437") return decodeCP437(value);
		else return new TextDecoder(encoding).decode(value);
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/zip-entry.js
	const PROPERTY_NAME_FILENAME = "filename";
	const PROPERTY_NAME_RAW_FILENAME = "rawFilename";
	const PROPERTY_NAME_COMMENT = "comment";
	const PROPERTY_NAME_RAW_COMMENT = "rawComment";
	const PROPERTY_NAME_UNCOMPRESSED_SIZE = "uncompressedSize";
	const PROPERTY_NAME_COMPRESSED_SIZE = "compressedSize";
	const PROPERTY_NAME_OFFSET = "offset";
	const PROPERTY_NAME_DISK_NUMBER_START = "diskNumberStart";
	const PROPERTY_NAME_LAST_MODIFICATION_DATE = "lastModDate";
	const PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE = "rawLastModDate";
	const PROPERTY_NAME_LAST_ACCESS_DATE = "lastAccessDate";
	const PROPERTY_NAME_RAW_LAST_ACCESS_DATE = "rawLastAccessDate";
	const PROPERTY_NAME_CREATION_DATE = "creationDate";
	const PROPERTY_NAME_RAW_CREATION_DATE = "rawCreationDate";
	const PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES = "internalFileAttributes";
	const PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES = "externalFileAttributes";
	const PROPERTY_NAME_MS_DOS_COMPATIBLE = "msDosCompatible";
	const PROPERTY_NAME_ZIP64 = "zip64";
	const PROPERTY_NAME_ENCRYPTED = "encrypted";
	const PROPERTY_NAME_VERSION = "version";
	const PROPERTY_NAME_VERSION_MADE_BY = "versionMadeBy";
	const PROPERTY_NAME_ZIPCRYPTO = "zipCrypto";
	const PROPERTY_NAME_DIRECTORY = "directory";
	const PROPERTY_NAME_EXECUTABLE = "executable";
	const PROPERTY_NAME_COMPRESSION_METHOD = "compressionMethod";
	const PROPERTY_NAME_SIGNATURE = "signature";
	const PROPERTY_NAME_EXTRA_FIELD = "extraField";
	const PROPERTY_NAMES = [
		PROPERTY_NAME_FILENAME,
		PROPERTY_NAME_RAW_FILENAME,
		PROPERTY_NAME_COMPRESSED_SIZE,
		PROPERTY_NAME_UNCOMPRESSED_SIZE,
		PROPERTY_NAME_LAST_MODIFICATION_DATE,
		PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE,
		PROPERTY_NAME_COMMENT,
		PROPERTY_NAME_RAW_COMMENT,
		PROPERTY_NAME_LAST_ACCESS_DATE,
		PROPERTY_NAME_CREATION_DATE,
		PROPERTY_NAME_OFFSET,
		PROPERTY_NAME_DISK_NUMBER_START,
		PROPERTY_NAME_DISK_NUMBER_START,
		PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES,
		PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES,
		PROPERTY_NAME_MS_DOS_COMPATIBLE,
		PROPERTY_NAME_ZIP64,
		PROPERTY_NAME_ENCRYPTED,
		PROPERTY_NAME_VERSION,
		PROPERTY_NAME_VERSION_MADE_BY,
		PROPERTY_NAME_ZIPCRYPTO,
		PROPERTY_NAME_DIRECTORY,
		PROPERTY_NAME_EXECUTABLE,
		PROPERTY_NAME_COMPRESSION_METHOD,
		PROPERTY_NAME_SIGNATURE,
		PROPERTY_NAME_EXTRA_FIELD,
		"bitFlag",
		"filenameUTF8",
		"commentUTF8",
		"rawExtraField",
		"extraFieldZip64",
		"extraFieldUnicodePath",
		"extraFieldUnicodeComment",
		"extraFieldAES",
		"extraFieldNTFS",
		"extraFieldExtendedTimestamp"
	];
	var Entry = class {
		constructor(data) {
			PROPERTY_NAMES.forEach((name) => this[name] = data[name]);
		}
	};

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/options.js
	const OPTION_FILENAME_ENCODING = "filenameEncoding";
	const OPTION_COMMENT_ENCODING = "commentEncoding";
	const OPTION_DECODE_TEXT = "decodeText";
	const OPTION_EXTRACT_PREPENDED_DATA = "extractPrependedData";
	const OPTION_EXTRACT_APPENDED_DATA = "extractAppendedData";
	const OPTION_PASSWORD = "password";
	const OPTION_RAW_PASSWORD = "rawPassword";
	const OPTION_PASS_THROUGH = "passThrough";
	const OPTION_SIGNAL = "signal";
	const OPTION_CHECK_PASSWORD_ONLY = "checkPasswordOnly";
	const OPTION_CHECK_OVERLAPPING_ENTRY_ONLY = "checkOverlappingEntryOnly";
	const OPTION_CHECK_OVERLAPPING_ENTRY = "checkOverlappingEntry";
	const OPTION_CHECK_SIGNATURE = "checkSignature";
	const OPTION_USE_WEB_WORKERS = "useWebWorkers";
	const OPTION_USE_COMPRESSION_STREAM = "useCompressionStream";
	const OPTION_TRANSFER_STREAMS = "transferStreams";
	const OPTION_PREVENT_CLOSE = "preventClose";
	const OPTION_ENCRYPTION_STRENGTH = "encryptionStrength";
	const OPTION_EXTENDED_TIMESTAMP = "extendedTimestamp";
	const OPTION_KEEP_ORDER = "keepOrder";
	const OPTION_LEVEL = "level";
	const OPTION_BUFFERED_WRITE = "bufferedWrite";
	const OPTION_DATA_DESCRIPTOR_SIGNATURE = "dataDescriptorSignature";
	const OPTION_USE_UNICODE_FILE_NAMES = "useUnicodeFileNames";
	const OPTION_DATA_DESCRIPTOR = "dataDescriptor";
	const OPTION_SUPPORT_ZIP64_SPLIT_FILE = "supportZip64SplitFile";
	const OPTION_ENCODE_TEXT = "encodeText";
	const OPTION_OFFSET = "offset";
	const OPTION_USDZ = "usdz";

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/zip-reader.js
	const ERR_BAD_FORMAT = "File format is not recognized";
	const ERR_EOCDR_NOT_FOUND = "End of central directory not found";
	const ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
	const ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
	const ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
	const ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
	const ERR_ENCRYPTED = "File contains encrypted entry";
	const ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
	const ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
	const ERR_SPLIT_ZIP_FILE = "Split zip file";
	const ERR_OVERLAPPING_ENTRY = "Overlapping entry found";
	const CHARSET_UTF8 = "utf-8";
	const CHARSET_CP437 = "cp437";
	const ZIP64_PROPERTIES = [
		[PROPERTY_NAME_UNCOMPRESSED_SIZE, MAX_32_BITS],
		[PROPERTY_NAME_COMPRESSED_SIZE, MAX_32_BITS],
		[PROPERTY_NAME_OFFSET, MAX_32_BITS],
		[PROPERTY_NAME_DISK_NUMBER_START, MAX_16_BITS]
	];
	const ZIP64_EXTRACTION = {
		[MAX_16_BITS]: {
			getValue: getUint32,
			bytes: 4
		},
		[MAX_32_BITS]: {
			getValue: getBigUint64,
			bytes: 8
		}
	};
	var ZipReader = class {
		constructor(reader, options = {}) {
			Object.assign(this, {
				reader: new GenericReader(reader),
				options,
				config: getConfiguration(),
				readRanges: []
			});
		}
		async *getEntriesGenerator(options = {}) {
			const zipReader = this;
			let { reader } = zipReader;
			const { config: config$1 } = zipReader;
			await initStream(reader);
			if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
				reader = new BlobReader(await new Response(reader.readable).blob());
				await initStream(reader);
			}
			if (reader.size < END_OF_CENTRAL_DIR_LENGTH) throw new Error(ERR_BAD_FORMAT);
			reader.chunkSize = getChunkSize(config$1);
			const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, reader.size, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS * 16);
			if (!endOfDirectoryInfo) if (getUint32(getDataView$1(await readUint8Array(reader, 0, 4))) == SPLIT_ZIP_FILE_SIGNATURE) throw new Error(ERR_SPLIT_ZIP_FILE);
			else throw new Error(ERR_EOCDR_NOT_FOUND);
			const endOfDirectoryView = getDataView$1(endOfDirectoryInfo);
			let directoryDataLength = getUint32(endOfDirectoryView, 12);
			let directoryDataOffset = getUint32(endOfDirectoryView, 16);
			const commentOffset = endOfDirectoryInfo.offset;
			const commentLength = getUint16(endOfDirectoryView, 20);
			const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
			let lastDiskNumber = getUint16(endOfDirectoryView, 4);
			const expectedLastDiskNumber = reader.lastDiskNumber || 0;
			let diskNumber = getUint16(endOfDirectoryView, 6);
			let filesLength = getUint16(endOfDirectoryView, 8);
			let prependedDataLength = 0;
			let startOffset = 0;
			if (directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS || diskNumber == MAX_16_BITS) {
				const endOfDirectoryLocatorView = getDataView$1(await readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH));
				if (getUint32(endOfDirectoryLocatorView, 0) == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
					directoryDataOffset = getBigUint64(endOfDirectoryLocatorView, 8);
					let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
					let endOfDirectoryView$1 = getDataView$1(endOfDirectoryArray);
					const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
					if (getUint32(endOfDirectoryView$1, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
						const originalDirectoryDataOffset = directoryDataOffset;
						directoryDataOffset = expectedDirectoryDataOffset;
						if (directoryDataOffset > originalDirectoryDataOffset) prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
						endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
						endOfDirectoryView$1 = getDataView$1(endOfDirectoryArray);
					}
					if (getUint32(endOfDirectoryView$1, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
					if (lastDiskNumber == MAX_16_BITS) lastDiskNumber = getUint32(endOfDirectoryView$1, 16);
					if (diskNumber == MAX_16_BITS) diskNumber = getUint32(endOfDirectoryView$1, 20);
					if (filesLength == MAX_16_BITS) filesLength = getBigUint64(endOfDirectoryView$1, 32);
					if (directoryDataLength == MAX_32_BITS) directoryDataLength = getBigUint64(endOfDirectoryView$1, 40);
					directoryDataOffset -= directoryDataLength;
				}
			}
			if (directoryDataOffset >= reader.size) {
				prependedDataLength = reader.size - directoryDataOffset - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
				directoryDataOffset = reader.size - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
			}
			if (expectedLastDiskNumber != lastDiskNumber) throw new Error(ERR_SPLIT_ZIP_FILE);
			if (directoryDataOffset < 0) throw new Error(ERR_BAD_FORMAT);
			let offset = 0;
			let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
			let directoryView = getDataView$1(directoryArray);
			if (directoryDataLength) {
				const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
					const originalDirectoryDataOffset = directoryDataOffset;
					directoryDataOffset = expectedDirectoryDataOffset;
					if (directoryDataOffset > originalDirectoryDataOffset) prependedDataLength += directoryDataOffset - originalDirectoryDataOffset;
					directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
					directoryView = getDataView$1(directoryArray);
				}
			}
			const expectedDirectoryDataLength = endOfDirectoryInfo.offset - directoryDataOffset - (reader.lastDiskOffset || 0);
			if (directoryDataLength != expectedDirectoryDataLength && expectedDirectoryDataLength >= 0) {
				directoryDataLength = expectedDirectoryDataLength;
				directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
				directoryView = getDataView$1(directoryArray);
			}
			if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) throw new Error(ERR_BAD_FORMAT);
			const filenameEncoding = getOptionValue$1(zipReader, options, OPTION_FILENAME_ENCODING);
			const commentEncoding = getOptionValue$1(zipReader, options, OPTION_COMMENT_ENCODING);
			for (let indexFile = 0; indexFile < filesLength; indexFile++) {
				const fileEntry = new ZipEntry$1(reader, config$1, zipReader.options);
				if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
				readCommonHeader(fileEntry, directoryView, offset + 6);
				const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
				const filenameOffset = offset + 46;
				const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
				const commentOffset$1 = extraFieldOffset + fileEntry.extraFieldLength;
				const versionMadeBy = getUint16(directoryView, offset + 4);
				const msDosCompatible = versionMadeBy >> 8 == 0;
				const unixCompatible = versionMadeBy >> 8 == 3;
				const rawFilename = directoryArray.subarray(filenameOffset, extraFieldOffset);
				const commentLength$1 = getUint16(directoryView, offset + 32);
				const endOffset = commentOffset$1 + commentLength$1;
				const rawComment = directoryArray.subarray(commentOffset$1, endOffset);
				const filenameUTF8 = languageEncodingFlag;
				const commentUTF8 = languageEncodingFlag;
				const externalFileAttributes = getUint32(directoryView, offset + 38);
				const directory = msDosCompatible && (getUint8(directoryView, offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK || unixCompatible && (externalFileAttributes >> 16 & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR || rawFilename.length && rawFilename.at(-1) == DIRECTORY_SIGNATURE.charCodeAt(0);
				const executable = unixCompatible && (externalFileAttributes >> 16 & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0;
				const offsetFileEntry = getUint32(directoryView, offset + 42) + prependedDataLength;
				Object.assign(fileEntry, {
					versionMadeBy,
					msDosCompatible,
					compressedSize: 0,
					uncompressedSize: 0,
					commentLength: commentLength$1,
					directory,
					offset: offsetFileEntry,
					diskNumberStart: getUint16(directoryView, offset + 34),
					internalFileAttributes: getUint16(directoryView, offset + 36),
					externalFileAttributes,
					rawFilename,
					filenameUTF8,
					commentUTF8,
					rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset$1),
					executable
				});
				fileEntry.internalFileAttribute = fileEntry.internalFileAttributes;
				fileEntry.externalFileAttribute = fileEntry.externalFileAttributes;
				const decode$1 = getOptionValue$1(zipReader, options, OPTION_DECODE_TEXT) || decodeText;
				const rawFilenameEncoding = filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437;
				const rawCommentEncoding = commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437;
				let filename = decode$1(rawFilename, rawFilenameEncoding);
				if (filename === UNDEFINED_VALUE) filename = decodeText(rawFilename, rawFilenameEncoding);
				let comment$1 = decode$1(rawComment, rawCommentEncoding);
				if (comment$1 === UNDEFINED_VALUE) comment$1 = decodeText(rawComment, rawCommentEncoding);
				Object.assign(fileEntry, {
					rawComment,
					filename,
					comment: comment$1,
					directory: directory || filename.endsWith(DIRECTORY_SIGNATURE)
				});
				startOffset = Math.max(offsetFileEntry, startOffset);
				readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
				fileEntry.zipCrypto = fileEntry.encrypted && !fileEntry.extraFieldAES;
				const entry = new Entry(fileEntry);
				entry.getData = (writer, options$1) => fileEntry.getData(writer, entry, zipReader.readRanges, options$1);
				entry.arrayBuffer = async (options$1) => {
					const writer = new TransformStream();
					const [arrayBuffer] = await Promise.all([new Response(writer.readable).arrayBuffer(), fileEntry.getData(writer, entry, zipReader.readRanges, options$1)]);
					return arrayBuffer;
				};
				offset = endOffset;
				const { onprogress } = options;
				if (onprogress) try {
					await onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
				} catch {}
				yield entry;
			}
			const extractPrependedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
			const extractAppendedData = getOptionValue$1(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
			if (extractPrependedData) zipReader.prependedData = startOffset > 0 ? await readUint8Array(reader, 0, startOffset) : new Uint8Array();
			zipReader.comment = commentLength ? await readUint8Array(reader, commentOffset + END_OF_CENTRAL_DIR_LENGTH, commentLength) : new Uint8Array();
			if (extractAppendedData) zipReader.appendedData = appendedDataOffset < reader.size ? await readUint8Array(reader, appendedDataOffset, reader.size - appendedDataOffset) : new Uint8Array();
			return true;
		}
		async getEntries(options = {}) {
			const entries = [];
			for await (const entry of this.getEntriesGenerator(options)) entries.push(entry);
			return entries;
		}
		async close() {}
	};
	var ZipEntry$1 = class {
		constructor(reader, config$1, options) {
			Object.assign(this, {
				reader,
				config: config$1,
				options
			});
		}
		async getData(writer, fileEntry, readRanges, options = {}) {
			const zipEntry = this;
			const { reader, offset, diskNumberStart, extraFieldAES, extraFieldZip64, compressionMethod, config: config$1, bitFlag, signature, rawLastModDate, uncompressedSize, compressedSize } = zipEntry;
			const { dataDescriptor } = bitFlag;
			const localDirectory = fileEntry.localDirectory = {};
			const dataView = getDataView$1(await readUint8Array(reader, offset, HEADER_SIZE, diskNumberStart));
			let password = getOptionValue$1(zipEntry, options, OPTION_PASSWORD);
			let rawPassword = getOptionValue$1(zipEntry, options, OPTION_RAW_PASSWORD);
			const passThrough = getOptionValue$1(zipEntry, options, OPTION_PASS_THROUGH);
			password = password && password.length && password;
			rawPassword = rawPassword && rawPassword.length && rawPassword;
			if (extraFieldAES) {
				if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			}
			if (compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE && compressionMethod != COMPRESSION_METHOD_DEFLATE_64 && !passThrough) throw new Error(ERR_UNSUPPORTED_COMPRESSION);
			if (getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
			readCommonHeader(localDirectory, dataView, 4);
			const { extraFieldLength, filenameLength, lastAccessDate, creationDate } = localDirectory;
			localDirectory.rawExtraField = extraFieldLength ? await readUint8Array(reader, offset + HEADER_SIZE + filenameLength, extraFieldLength, diskNumberStart) : new Uint8Array();
			readCommonFooter(zipEntry, localDirectory, dataView, 4, true);
			Object.assign(fileEntry, {
				lastAccessDate,
				creationDate
			});
			const encrypted = zipEntry.encrypted && localDirectory.encrypted && !passThrough;
			const zipCrypto = encrypted && !extraFieldAES;
			if (!passThrough) fileEntry.zipCrypto = zipCrypto;
			if (encrypted) {
				if (!zipCrypto && extraFieldAES.strength === UNDEFINED_VALUE) throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
				else if (!password && !rawPassword) throw new Error(ERR_ENCRYPTED);
			}
			const dataOffset = offset + HEADER_SIZE + filenameLength + extraFieldLength;
			const size = compressedSize;
			const readable = reader.readable;
			Object.assign(readable, {
				diskNumberStart,
				offset: dataOffset,
				size
			});
			const signal = getOptionValue$1(zipEntry, options, OPTION_SIGNAL);
			const checkPasswordOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
			let checkOverlappingEntry = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
			const checkOverlappingEntryOnly = getOptionValue$1(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
			if (checkOverlappingEntryOnly) checkOverlappingEntry = true;
			const { onstart, onprogress, onend } = options;
			const deflate64 = compressionMethod == COMPRESSION_METHOD_DEFLATE_64;
			let useCompressionStream = getOptionValue$1(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
			if (deflate64) useCompressionStream = false;
			const workerOptions = {
				options: {
					codecType: CODEC_INFLATE,
					password,
					rawPassword,
					zipCrypto,
					encryptionStrength: extraFieldAES && extraFieldAES.strength,
					signed: getOptionValue$1(zipEntry, options, OPTION_CHECK_SIGNATURE) && !passThrough,
					passwordVerification: zipCrypto && (dataDescriptor ? rawLastModDate >>> 8 & 255 : signature >>> 24 & 255),
					outputSize: passThrough ? compressedSize : uncompressedSize,
					signature,
					compressed: compressionMethod != 0 && !passThrough,
					encrypted: zipEntry.encrypted && !passThrough,
					useWebWorkers: getOptionValue$1(zipEntry, options, OPTION_USE_WEB_WORKERS),
					useCompressionStream,
					transferStreams: getOptionValue$1(zipEntry, options, OPTION_TRANSFER_STREAMS),
					deflate64,
					checkPasswordOnly
				},
				config: config$1,
				streamOptions: {
					signal,
					size,
					onstart,
					onprogress,
					onend
				}
			};
			if (checkOverlappingEntry) await detectOverlappingEntry({
				reader,
				fileEntry,
				offset,
				diskNumberStart,
				signature,
				compressedSize,
				uncompressedSize,
				dataOffset,
				dataDescriptor: dataDescriptor || localDirectory.bitFlag.dataDescriptor,
				extraFieldZip64: extraFieldZip64 || localDirectory.extraFieldZip64,
				readRanges
			});
			let writable;
			try {
				if (!checkOverlappingEntryOnly) {
					if (checkPasswordOnly) writer = new WritableStream();
					writer = new GenericWriter(writer);
					await initStream(writer, passThrough ? compressedSize : uncompressedSize);
					({writable} = writer);
					const { outputSize } = await runWorker({
						readable,
						writable
					}, workerOptions);
					writer.size += outputSize;
					if (outputSize != (passThrough ? compressedSize : uncompressedSize)) throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
				}
			} catch (error) {
				if (error.outputSize !== UNDEFINED_VALUE) writer.size += error.outputSize;
				if (!checkPasswordOnly || error.message != ERR_ABORT_CHECK_PASSWORD) throw error;
			} finally {
				if (!getOptionValue$1(zipEntry, options, OPTION_PREVENT_CLOSE) && writable && !writable.locked) await writable.getWriter().close();
			}
			return checkPasswordOnly || checkOverlappingEntryOnly ? UNDEFINED_VALUE : writer.getData ? writer.getData() : writable;
		}
	};
	function readCommonHeader(directory, dataView, offset) {
		const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
		const encrypted = (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED;
		const rawLastModDate = getUint32(dataView, offset + 6);
		Object.assign(directory, {
			encrypted,
			version: getUint16(dataView, offset),
			bitFlag: {
				level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
				dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
				languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
			},
			rawLastModDate,
			lastModDate: getDate(rawLastModDate),
			filenameLength: getUint16(dataView, offset + 22),
			extraFieldLength: getUint16(dataView, offset + 24)
		});
	}
	function readCommonFooter(fileEntry, directory, dataView, offset, localDirectory) {
		const { rawExtraField } = directory;
		const extraField = directory.extraField = /* @__PURE__ */ new Map();
		const rawExtraFieldView = getDataView$1(new Uint8Array(rawExtraField));
		let offsetExtraField = 0;
		try {
			while (offsetExtraField < rawExtraField.length) {
				const type = getUint16(rawExtraFieldView, offsetExtraField);
				const size = getUint16(rawExtraFieldView, offsetExtraField + 2);
				extraField.set(type, {
					type,
					data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
				});
				offsetExtraField += 4 + size;
			}
		} catch {}
		const compressionMethod = getUint16(dataView, offset + 4);
		Object.assign(directory, {
			signature: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
			compressedSize: getUint32(dataView, offset + HEADER_OFFSET_COMPRESSED_SIZE),
			uncompressedSize: getUint32(dataView, offset + HEADER_OFFSET_UNCOMPRESSED_SIZE)
		});
		const extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
		if (extraFieldZip64) {
			readExtraFieldZip64(extraFieldZip64, directory);
			directory.extraFieldZip64 = extraFieldZip64;
		}
		const extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
		if (extraFieldUnicodePath) {
			readExtraFieldUnicode(extraFieldUnicodePath, PROPERTY_NAME_FILENAME, PROPERTY_NAME_RAW_FILENAME, directory, fileEntry);
			directory.extraFieldUnicodePath = extraFieldUnicodePath;
		}
		const extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
		if (extraFieldUnicodeComment) {
			readExtraFieldUnicode(extraFieldUnicodeComment, PROPERTY_NAME_COMMENT, PROPERTY_NAME_RAW_COMMENT, directory, fileEntry);
			directory.extraFieldUnicodeComment = extraFieldUnicodeComment;
		}
		const extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
		if (extraFieldAES) {
			readExtraFieldAES(extraFieldAES, directory, compressionMethod);
			directory.extraFieldAES = extraFieldAES;
		} else directory.compressionMethod = compressionMethod;
		const extraFieldNTFS = extraField.get(EXTRAFIELD_TYPE_NTFS);
		if (extraFieldNTFS) {
			readExtraFieldNTFS(extraFieldNTFS, directory);
			directory.extraFieldNTFS = extraFieldNTFS;
		}
		const extraFieldExtendedTimestamp = extraField.get(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
		if (extraFieldExtendedTimestamp) {
			readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory);
			directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
		}
		const extraFieldUSDZ = extraField.get(EXTRAFIELD_TYPE_USDZ);
		if (extraFieldUSDZ) directory.extraFieldUSDZ = extraFieldUSDZ;
	}
	function readExtraFieldZip64(extraFieldZip64, directory) {
		directory.zip64 = true;
		const extraFieldView = getDataView$1(extraFieldZip64.data);
		const missingProperties = ZIP64_PROPERTIES.filter(([propertyName, max]) => directory[propertyName] == max);
		for (let indexMissingProperty = 0, offset = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
			const [propertyName, max] = missingProperties[indexMissingProperty];
			if (directory[propertyName] == max) {
				const extraction = ZIP64_EXTRACTION[max];
				directory[propertyName] = extraFieldZip64[propertyName] = extraction.getValue(extraFieldView, offset);
				offset += extraction.bytes;
			} else if (extraFieldZip64[propertyName]) throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
		}
	}
	function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
		const extraFieldView = getDataView$1(extraFieldUnicode.data);
		const crc32 = new Crc32();
		crc32.append(fileEntry[rawPropertyName]);
		const dataViewSignature = getDataView$1(new Uint8Array(4));
		dataViewSignature.setUint32(0, crc32.get(), true);
		const signature = getUint32(extraFieldView, 1);
		Object.assign(extraFieldUnicode, {
			version: getUint8(extraFieldView, 0),
			[propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
			valid: !fileEntry.bitFlag.languageEncodingFlag && signature == getUint32(dataViewSignature, 0)
		});
		if (extraFieldUnicode.valid) {
			directory[propertyName] = extraFieldUnicode[propertyName];
			directory[propertyName + "UTF8"] = true;
		}
	}
	function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
		const extraFieldView = getDataView$1(extraFieldAES.data);
		const strength = getUint8(extraFieldView, 4);
		Object.assign(extraFieldAES, {
			vendorVersion: getUint8(extraFieldView, 0),
			vendorId: getUint8(extraFieldView, 2),
			strength,
			originalCompressionMethod: compressionMethod,
			compressionMethod: getUint16(extraFieldView, 5)
		});
		directory.compressionMethod = extraFieldAES.compressionMethod;
	}
	function readExtraFieldNTFS(extraFieldNTFS, directory) {
		const extraFieldView = getDataView$1(extraFieldNTFS.data);
		let offsetExtraField = 4;
		let tag1Data;
		try {
			while (offsetExtraField < extraFieldNTFS.data.length && !tag1Data) {
				const tagValue = getUint16(extraFieldView, offsetExtraField);
				const attributeSize = getUint16(extraFieldView, offsetExtraField + 2);
				if (tagValue == EXTRAFIELD_TYPE_NTFS_TAG1) tag1Data = extraFieldNTFS.data.slice(offsetExtraField + 4, offsetExtraField + 4 + attributeSize);
				offsetExtraField += 4 + attributeSize;
			}
		} catch {}
		try {
			if (tag1Data && tag1Data.length == 24) {
				const tag1View = getDataView$1(tag1Data);
				const rawLastModDate = tag1View.getBigUint64(0, true);
				const rawLastAccessDate = tag1View.getBigUint64(8, true);
				const rawCreationDate = tag1View.getBigUint64(16, true);
				Object.assign(extraFieldNTFS, {
					rawLastModDate,
					rawLastAccessDate,
					rawCreationDate
				});
				const extraFieldData = {
					lastModDate: getDateNTFS(rawLastModDate),
					lastAccessDate: getDateNTFS(rawLastAccessDate),
					creationDate: getDateNTFS(rawCreationDate)
				};
				Object.assign(extraFieldNTFS, extraFieldData);
				Object.assign(directory, extraFieldData);
			}
		} catch {}
	}
	function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory) {
		const extraFieldView = getDataView$1(extraFieldExtendedTimestamp.data);
		const flags = getUint8(extraFieldView, 0);
		const timeProperties = [];
		const timeRawProperties = [];
		if (localDirectory) {
			if ((flags & 1) == 1) {
				timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
				timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
			}
			if ((flags & 2) == 2) {
				timeProperties.push(PROPERTY_NAME_LAST_ACCESS_DATE);
				timeRawProperties.push(PROPERTY_NAME_RAW_LAST_ACCESS_DATE);
			}
			if ((flags & 4) == 4) {
				timeProperties.push(PROPERTY_NAME_CREATION_DATE);
				timeRawProperties.push(PROPERTY_NAME_RAW_CREATION_DATE);
			}
		} else if (extraFieldExtendedTimestamp.data.length >= 5) {
			timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
			timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
		}
		let offset = 1;
		timeProperties.forEach((propertyName, indexProperty) => {
			if (extraFieldExtendedTimestamp.data.length >= offset + 4) {
				const time = getUint32(extraFieldView, offset);
				directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = /* @__PURE__ */ new Date(time * 1e3);
				const rawPropertyName = timeRawProperties[indexProperty];
				extraFieldExtendedTimestamp[rawPropertyName] = time;
			}
			offset += 4;
		});
	}
	async function detectOverlappingEntry({ reader, fileEntry, offset, diskNumberStart, signature, compressedSize, uncompressedSize, dataOffset, dataDescriptor, extraFieldZip64, readRanges }) {
		let diskOffset = 0;
		if (diskNumberStart) for (let indexReader = 0; indexReader < diskNumberStart; indexReader++) {
			const diskReader = reader.readers[indexReader];
			diskOffset += diskReader.size;
		}
		let dataDescriptorLength = 0;
		if (dataDescriptor) if (extraFieldZip64) dataDescriptorLength = DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH;
		else dataDescriptorLength = DATA_DESCRIPTOR_RECORD_LENGTH;
		if (dataDescriptorLength) {
			const dataDescriptorArray = await readUint8Array(reader, dataOffset + compressedSize, dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH, diskNumberStart);
			if (getUint32(getDataView$1(dataDescriptorArray), 0) == DATA_DESCRIPTOR_RECORD_SIGNATURE) {
				const readSignature = getUint32(getDataView$1(dataDescriptorArray), 4);
				let readCompressedSize;
				let readUncompressedSize;
				if (extraFieldZip64) {
					readCompressedSize = getBigUint64(getDataView$1(dataDescriptorArray), 8);
					readUncompressedSize = getBigUint64(getDataView$1(dataDescriptorArray), 16);
				} else {
					readCompressedSize = getUint32(getDataView$1(dataDescriptorArray), 8);
					readUncompressedSize = getUint32(getDataView$1(dataDescriptorArray), 12);
				}
				if ((fileEntry.encrypted && !fileEntry.zipCrypto || readSignature == signature) && readCompressedSize == compressedSize && readUncompressedSize == uncompressedSize) dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
			}
		}
		const range = {
			start: diskOffset + offset,
			end: diskOffset + dataOffset + compressedSize + dataDescriptorLength,
			fileEntry
		};
		for (const otherRange of readRanges) if (otherRange.fileEntry != fileEntry && range.start >= otherRange.start && range.start < otherRange.end) {
			const error = new Error(ERR_OVERLAPPING_ENTRY);
			error.overlappingEntry = otherRange.fileEntry;
			throw error;
		}
		readRanges.push(range);
	}
	async function seekSignature(reader, signature, startOffset, minimumBytes, maximumLength) {
		const signatureArray = new Uint8Array(4);
		setUint32$1(getDataView$1(signatureArray), 0, signature);
		const maximumBytes = minimumBytes + maximumLength;
		return await seek(minimumBytes) || await seek(Math.min(maximumBytes, startOffset));
		async function seek(length) {
			const offset = startOffset - length;
			const bytes = await readUint8Array(reader, offset, length);
			for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) if (bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] && bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3]) return {
				offset: offset + indexByte,
				buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
			};
		}
	}
	function getOptionValue$1(zipReader, options, name) {
		return options[name] === UNDEFINED_VALUE ? zipReader.options[name] : options[name];
	}
	function getDate(timeRaw) {
		const date = (timeRaw & 4294901760) >> 16, time = timeRaw & 65535;
		try {
			return new Date(1980 + ((date & 65024) >> 9), ((date & 480) >> 5) - 1, date & 31, (time & 63488) >> 11, (time & 2016) >> 5, (time & 31) * 2, 0);
		} catch {}
	}
	function getDateNTFS(timeRaw) {
		return new Date(Number(timeRaw / BigInt(1e4) - BigInt(0xa9730b66800)));
	}
	function getUint8(view, offset) {
		return view.getUint8(offset);
	}
	function getUint16(view, offset) {
		return view.getUint16(offset, true);
	}
	function getUint32(view, offset) {
		return view.getUint32(offset, true);
	}
	function getBigUint64(view, offset) {
		return Number(view.getBigUint64(offset, true));
	}
	function setUint32$1(view, offset, value) {
		view.setUint32(offset, value, true);
	}
	function getDataView$1(array) {
		return new DataView(array.buffer);
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/zip-writer.js
	const ERR_DUPLICATED_NAME = "File already exists";
	const ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
	const ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
	const ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
	const ERR_INVALID_VERSION = "Version exceeds 65535";
	const ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
	const ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
	const ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
	const ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported (make sure 'keepOrder' is set to 'true')";
	const ERR_UNDEFINED_UNCOMPRESSED_SIZE = "Undefined uncompressed size";
	const ERR_ZIP_NOT_EMPTY = "Zip file not empty";
	const EXTRAFIELD_DATA_AES = new Uint8Array([
		7,
		0,
		2,
		0,
		65,
		69,
		3,
		0,
		0
	]);
	let workers = 0;
	const pendingEntries = [];
	var ZipWriter = class {
		constructor(writer, options = {}) {
			writer = new GenericWriter(writer);
			const addSplitZipSignature = writer.availableSize !== UNDEFINED_VALUE && writer.availableSize > 0 && writer.availableSize !== Infinity && writer.maxSize !== UNDEFINED_VALUE && writer.maxSize > 0 && writer.maxSize !== Infinity;
			Object.assign(this, {
				writer,
				addSplitZipSignature,
				options,
				config: getConfiguration(),
				files: /* @__PURE__ */ new Map(),
				filenames: /* @__PURE__ */ new Set(),
				offset: options[OPTION_OFFSET] === UNDEFINED_VALUE ? writer.size || writer.writable.size || 0 : options[OPTION_OFFSET],
				pendingEntriesSize: 0,
				pendingAddFileCalls: /* @__PURE__ */ new Set(),
				bufferedWrites: 0
			});
		}
		async prependZip(reader) {
			if (this.filenames.size) throw new Error(ERR_ZIP_NOT_EMPTY);
			reader = new GenericReader(reader);
			const zipReader = new ZipReader(reader.readable);
			const entries = await zipReader.getEntries();
			await zipReader.close();
			await reader.readable.pipeTo(this.writer.writable, {
				preventClose: true,
				preventAbort: true
			});
			this.writer.size = this.offset = reader.size;
			this.filenames = new Set(entries.map((entry) => entry.filename));
			this.files = new Map(entries.map((entry) => {
				const { version: version$1, compressionMethod, lastModDate, lastAccessDate, creationDate, rawFilename, bitFlag, encrypted, uncompressedSize, compressedSize, diskOffset, diskNumber, zip64 } = entry;
				let { rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField } = entry;
				const { level, languageEncodingFlag, dataDescriptor } = bitFlag;
				rawExtraFieldZip64 = rawExtraFieldZip64 || new Uint8Array();
				rawExtraFieldAES = rawExtraFieldAES || new Uint8Array();
				rawExtraFieldExtendedTimestamp = rawExtraFieldExtendedTimestamp || new Uint8Array();
				rawExtraFieldNTFS = rawExtraFieldNTFS || new Uint8Array();
				rawExtraField = rawExtraField || new Uint8Array();
				const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
				const zip64UncompressedSize = zip64 && uncompressedSize > MAX_32_BITS;
				const zip64CompressedSize = zip64 && compressedSize > MAX_32_BITS;
				const { headerArray, headerView } = getHeaderArrayData({
					version: version$1,
					bitFlag: getBitFlag(level, languageEncodingFlag, dataDescriptor, encrypted, compressionMethod),
					compressionMethod,
					uncompressedSize,
					compressedSize,
					lastModDate,
					rawFilename,
					zip64CompressedSize,
					zip64UncompressedSize,
					extraFieldLength
				});
				Object.assign(entry, {
					zip64UncompressedSize,
					zip64CompressedSize,
					zip64Offset: zip64 && this.offset - diskOffset > MAX_32_BITS,
					zip64DiskNumberStart: zip64 && diskNumber > MAX_16_BITS,
					rawExtraFieldZip64,
					rawExtraFieldAES,
					rawExtraFieldExtendedTimestamp,
					rawExtraFieldNTFS,
					rawExtraField,
					extendedTimestamp: rawExtraFieldExtendedTimestamp.length > 0 || rawExtraFieldNTFS.length > 0,
					extraFieldExtendedTimestampFlag: 1 + (lastAccessDate ? 2 : 0) + (creationDate ? 4 : 0),
					headerArray,
					headerView
				});
				return [entry.filename, entry];
			}));
		}
		async add(name = "", reader, options = {}) {
			const zipWriter = this;
			const { pendingAddFileCalls, config: config$1 } = zipWriter;
			if (workers < config$1.maxWorkers) workers++;
			else await new Promise((resolve) => pendingEntries.push(resolve));
			let promiseAddFile;
			try {
				name = name.trim();
				if (zipWriter.filenames.has(name)) throw new Error(ERR_DUPLICATED_NAME);
				zipWriter.filenames.add(name);
				promiseAddFile = addFile(zipWriter, name, reader, options);
				pendingAddFileCalls.add(promiseAddFile);
				return await promiseAddFile;
			} catch (error) {
				zipWriter.filenames.delete(name);
				throw error;
			} finally {
				pendingAddFileCalls.delete(promiseAddFile);
				const pendingEntry = pendingEntries.shift();
				if (pendingEntry) pendingEntry();
				else workers--;
			}
		}
		remove(entry) {
			const { filenames, files } = this;
			if (typeof entry == "string") entry = files.get(entry);
			if (entry && entry.filename !== UNDEFINED_VALUE) {
				const { filename } = entry;
				if (filenames.has(filename) && files.has(filename)) {
					filenames.delete(filename);
					files.delete(filename);
					return true;
				}
			}
			return false;
		}
		async close(comment$1 = new Uint8Array(), options = {}) {
			const zipWriter = this;
			const { pendingAddFileCalls, writer } = this;
			const { writable } = writer;
			while (pendingAddFileCalls.size) await Promise.allSettled(Array.from(pendingAddFileCalls));
			await closeFile(this, comment$1, options);
			if (!getOptionValue(zipWriter, options, OPTION_PREVENT_CLOSE)) await writable.getWriter().close();
			return writer.getData ? writer.getData() : writable;
		}
	};
	async function addFile(zipWriter, name, reader, options) {
		name = name.trim();
		const msDosCompatible = getOptionValue(zipWriter, options, PROPERTY_NAME_MS_DOS_COMPATIBLE);
		const versionMadeBy = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION_MADE_BY, msDosCompatible ? 20 : 768);
		const executable = getOptionValue(zipWriter, options, PROPERTY_NAME_EXECUTABLE);
		if (versionMadeBy > MAX_16_BITS) throw new Error(ERR_INVALID_VERSION);
		let externalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES, 0);
		if (!options[PROPERTY_NAME_DIRECTORY] && name.endsWith(DIRECTORY_SIGNATURE)) options[PROPERTY_NAME_DIRECTORY] = true;
		if (getOptionValue(zipWriter, options, PROPERTY_NAME_DIRECTORY)) {
			if (!name.endsWith(DIRECTORY_SIGNATURE)) name += DIRECTORY_SIGNATURE;
			if (externalFileAttributes === 0) {
				externalFileAttributes = FILE_ATTR_MSDOS_DIR_MASK;
				if (!msDosCompatible) externalFileAttributes |= (FILE_ATTR_UNIX_TYPE_DIR | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
			}
		} else if (!msDosCompatible && externalFileAttributes === 0) if (executable) externalFileAttributes = (FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_DEFAULT_MASK) << 16;
		else externalFileAttributes = FILE_ATTR_UNIX_DEFAULT_MASK << 16;
		const encode = getOptionValue(zipWriter, options, OPTION_ENCODE_TEXT, encodeText);
		let rawFilename = encode(name);
		if (rawFilename === UNDEFINED_VALUE) rawFilename = encodeText(name);
		if (getLength(rawFilename) > MAX_16_BITS) throw new Error(ERR_INVALID_ENTRY_NAME);
		const comment$1 = options[PROPERTY_NAME_COMMENT] || "";
		let rawComment = encode(comment$1);
		if (rawComment === UNDEFINED_VALUE) rawComment = encodeText(comment$1);
		if (getLength(rawComment) > MAX_16_BITS) throw new Error(ERR_INVALID_ENTRY_COMMENT);
		const version$1 = getOptionValue(zipWriter, options, PROPERTY_NAME_VERSION, VERSION_DEFLATE);
		if (version$1 > MAX_16_BITS) throw new Error(ERR_INVALID_VERSION);
		const lastModDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_MODIFICATION_DATE, /* @__PURE__ */ new Date());
		const lastAccessDate = getOptionValue(zipWriter, options, PROPERTY_NAME_LAST_ACCESS_DATE);
		const creationDate = getOptionValue(zipWriter, options, PROPERTY_NAME_CREATION_DATE);
		const internalFileAttributes = getOptionValue(zipWriter, options, PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES, 0);
		const passThrough = getOptionValue(zipWriter, options, OPTION_PASS_THROUGH);
		let password, rawPassword;
		if (!passThrough) {
			password = getOptionValue(zipWriter, options, OPTION_PASSWORD);
			rawPassword = getOptionValue(zipWriter, options, OPTION_RAW_PASSWORD);
		}
		const encryptionStrength = getOptionValue(zipWriter, options, OPTION_ENCRYPTION_STRENGTH, 3);
		const zipCrypto = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIPCRYPTO);
		const extendedTimestamp = getOptionValue(zipWriter, options, OPTION_EXTENDED_TIMESTAMP, true);
		const keepOrder = getOptionValue(zipWriter, options, OPTION_KEEP_ORDER, true);
		const useWebWorkers = getOptionValue(zipWriter, options, OPTION_USE_WEB_WORKERS);
		const bufferedWrite = getOptionValue(zipWriter, options, OPTION_BUFFERED_WRITE);
		const dataDescriptorSignature = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR_SIGNATURE, false);
		const signal = getOptionValue(zipWriter, options, OPTION_SIGNAL);
		const useUnicodeFileNames = getOptionValue(zipWriter, options, OPTION_USE_UNICODE_FILE_NAMES, true);
		const compressionMethod = getOptionValue(zipWriter, options, PROPERTY_NAME_COMPRESSION_METHOD);
		let level = getOptionValue(zipWriter, options, OPTION_LEVEL);
		let useCompressionStream = getOptionValue(zipWriter, options, OPTION_USE_COMPRESSION_STREAM);
		let dataDescriptor = getOptionValue(zipWriter, options, OPTION_DATA_DESCRIPTOR);
		if (bufferedWrite && dataDescriptor === UNDEFINED_VALUE) dataDescriptor = false;
		if (dataDescriptor === UNDEFINED_VALUE || zipCrypto) dataDescriptor = true;
		if (level !== UNDEFINED_VALUE && level != 6) useCompressionStream = false;
		if (!useCompressionStream && zipWriter.config.CompressionStream === UNDEFINED_VALUE && zipWriter.config.CompressionStreamZlib === UNDEFINED_VALUE) level = 0;
		let zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
		if (!zipCrypto && (password !== UNDEFINED_VALUE || rawPassword !== UNDEFINED_VALUE) && !(encryptionStrength >= 1 && encryptionStrength <= 3)) throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);
		let rawExtraField = new Uint8Array();
		const extraField = options[PROPERTY_NAME_EXTRA_FIELD];
		if (extraField) {
			let extraFieldSize = 0;
			let offset = 0;
			extraField.forEach((data) => extraFieldSize += 4 + getLength(data));
			rawExtraField = new Uint8Array(extraFieldSize);
			extraField.forEach((data, type) => {
				if (type > MAX_16_BITS) throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
				if (getLength(data) > MAX_16_BITS) throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
				arraySet(rawExtraField, new Uint16Array([type]), offset);
				arraySet(rawExtraField, new Uint16Array([getLength(data)]), offset + 2);
				arraySet(rawExtraField, data, offset + 4);
				offset += 4 + getLength(data);
			});
		}
		let maximumCompressedSize = 0;
		let maximumEntrySize = 0;
		let uncompressedSize = 0;
		if (passThrough) {
			uncompressedSize = options[PROPERTY_NAME_UNCOMPRESSED_SIZE];
			if (uncompressedSize === UNDEFINED_VALUE) throw new Error(ERR_UNDEFINED_UNCOMPRESSED_SIZE);
		}
		const zip64Enabled = zip64 === true;
		if (reader) {
			reader = new GenericReader(reader);
			await initStream(reader);
			if (!passThrough) if (reader.size === UNDEFINED_VALUE) {
				dataDescriptor = true;
				if (zip64 || zip64 === UNDEFINED_VALUE) {
					zip64 = true;
					uncompressedSize = maximumCompressedSize = MAX_32_BITS + 1;
				}
			} else {
				options.uncompressedSize = uncompressedSize = reader.size;
				maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
			}
			else {
				options.uncompressedSize = uncompressedSize;
				maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);
			}
		}
		const { diskOffset, diskNumber, maxSize } = zipWriter.writer;
		const zip64UncompressedSize = zip64Enabled || uncompressedSize > MAX_32_BITS;
		const zip64CompressedSize = zip64Enabled || maximumCompressedSize > MAX_32_BITS;
		const zip64Offset = zip64Enabled || zipWriter.offset + zipWriter.pendingEntriesSize - diskOffset > MAX_32_BITS;
		const zip64DiskNumberStart = getOptionValue(zipWriter, options, OPTION_SUPPORT_ZIP64_SPLIT_FILE, true) && zip64Enabled || diskNumber + Math.ceil(zipWriter.pendingEntriesSize / maxSize) > MAX_16_BITS;
		if (zip64Offset || zip64UncompressedSize || zip64CompressedSize || zip64DiskNumberStart) if (zip64 === false || !keepOrder) throw new Error(ERR_UNSUPPORTED_FORMAT);
		else zip64 = true;
		zip64 = zip64 || false;
		const encrypted = getOptionValue(zipWriter, options, PROPERTY_NAME_ENCRYPTED);
		options = Object.assign({}, options, {
			rawFilename,
			rawComment,
			version: version$1,
			versionMadeBy,
			lastModDate,
			lastAccessDate,
			creationDate,
			rawExtraField,
			zip64,
			zip64UncompressedSize,
			zip64CompressedSize,
			zip64Offset,
			zip64DiskNumberStart,
			password,
			rawPassword,
			level,
			useWebWorkers,
			encryptionStrength,
			extendedTimestamp,
			zipCrypto,
			bufferedWrite,
			keepOrder,
			useUnicodeFileNames,
			dataDescriptor,
			dataDescriptorSignature,
			signal,
			msDosCompatible,
			internalFileAttribute: internalFileAttributes,
			internalFileAttributes,
			externalFileAttribute: externalFileAttributes,
			externalFileAttributes,
			useCompressionStream,
			passThrough,
			encrypted: Boolean(password && getLength(password) || rawPassword && getLength(rawPassword)) || passThrough && encrypted,
			signature: options[PROPERTY_NAME_SIGNATURE],
			compressionMethod,
			uncompressedSize,
			offset: zipWriter.offset - diskOffset,
			diskNumberStart: diskNumber
		});
		const headerInfo = getHeaderInfo(options);
		const dataDescriptorInfo = getDataDescriptorInfo(options);
		const metadataSize = getLength(headerInfo.localHeaderArray, dataDescriptorInfo.dataDescriptorArray);
		maximumEntrySize = metadataSize + maximumCompressedSize;
		if (zipWriter.options[OPTION_USDZ]) maximumEntrySize += maximumEntrySize + 64;
		zipWriter.pendingEntriesSize += maximumEntrySize;
		let fileEntry;
		try {
			fileEntry = await getFileEntry(zipWriter, name, reader, {
				headerInfo,
				dataDescriptorInfo,
				metadataSize
			}, options);
		} finally {
			zipWriter.pendingEntriesSize -= maximumEntrySize;
		}
		Object.assign(fileEntry, {
			name,
			comment: comment$1,
			extraField
		});
		return new Entry(fileEntry);
	}
	async function getFileEntry(zipWriter, name, reader, entryInfo, options) {
		const { files, writer } = zipWriter;
		const { keepOrder, dataDescriptor, signal } = options;
		const { headerInfo } = entryInfo;
		const usdz = zipWriter.options[OPTION_USDZ];
		const previousFileEntry = Array.from(files.values()).pop();
		let fileEntry = {};
		let bufferedWrite;
		let releaseLockWriter;
		let releaseLockCurrentFileEntry;
		let writingBufferedEntryData;
		let writingEntryData;
		let fileWriter;
		let blobPromise;
		files.set(name, fileEntry);
		try {
			let lockPreviousFileEntry;
			if (keepOrder) {
				lockPreviousFileEntry = previousFileEntry && previousFileEntry.lock;
				requestLockCurrentFileEntry();
			}
			if ((options.bufferedWrite || zipWriter.writerLocked || zipWriter.bufferedWrites && keepOrder || !dataDescriptor) && !usdz) {
				fileWriter = new TransformStream();
				fileWriter.size = 0;
				bufferedWrite = true;
				zipWriter.bufferedWrites++;
				await initStream(writer);
			} else {
				fileWriter = writer;
				await requestLockWriter();
			}
			await initStream(fileWriter);
			const { writable, diskOffset } = writer;
			if (zipWriter.addSplitZipSignature) {
				delete zipWriter.addSplitZipSignature;
				const signatureArray = new Uint8Array(4);
				setUint32(getDataView(signatureArray), 0, SPLIT_ZIP_FILE_SIGNATURE);
				await writeData(writer, signatureArray);
				zipWriter.offset += 4;
			}
			if (usdz) appendExtraFieldUSDZ(entryInfo, zipWriter.offset - diskOffset);
			const { localHeaderView, localHeaderArray } = headerInfo;
			if (!bufferedWrite) {
				await lockPreviousFileEntry;
				await skipDiskIfNeeded(writable);
			}
			const { diskNumber } = writer;
			writingEntryData = true;
			fileEntry.diskNumberStart = diskNumber;
			if (bufferedWrite) blobPromise = new Response(fileWriter.readable).blob();
			else await writeData(fileWriter, localHeaderArray);
			fileEntry = await createFileEntry(reader, fileWriter, fileEntry, entryInfo, zipWriter.config, options);
			const { zip64 } = fileEntry;
			writingEntryData = false;
			files.set(name, fileEntry);
			fileEntry.filename = name;
			if (bufferedWrite) {
				const [blob] = await Promise.all([
					blobPromise,
					fileWriter.writable.getWriter().close(),
					lockPreviousFileEntry
				]);
				await requestLockWriter();
				writingBufferedEntryData = true;
				fileEntry.diskNumberStart = writer.diskNumber;
				fileEntry.offset = zipWriter.offset - writer.diskOffset;
				if (zip64) updateZip64ExtraField(fileEntry);
				updateLocalHeader(fileEntry, localHeaderView, options);
				await skipDiskIfNeeded(writable);
				await writeData(writer, localHeaderArray);
				await blob.stream().pipeTo(writable, {
					preventClose: true,
					preventAbort: true,
					signal
				});
				writer.size += fileWriter.size;
				writingBufferedEntryData = false;
			} else {
				fileEntry.offset = zipWriter.offset - diskOffset;
				if (zip64) updateZip64ExtraField(fileEntry);
			}
			if (fileEntry.offset > MAX_32_BITS && !zip64) throw new Error(ERR_UNSUPPORTED_FORMAT);
			zipWriter.offset += fileEntry.size;
			return fileEntry;
		} catch (error) {
			if (bufferedWrite && writingBufferedEntryData || !bufferedWrite && writingEntryData) {
				zipWriter.hasCorruptedEntries = true;
				if (error) try {
					error.corruptedEntry = true;
				} catch {}
				if (bufferedWrite) zipWriter.offset += fileWriter.size;
				else zipWriter.offset = fileWriter.size;
			}
			files.delete(name);
			throw error;
		} finally {
			if (bufferedWrite) zipWriter.bufferedWrites--;
			if (releaseLockCurrentFileEntry) releaseLockCurrentFileEntry();
			if (releaseLockWriter) releaseLockWriter();
		}
		function requestLockCurrentFileEntry() {
			fileEntry.lock = new Promise((resolve) => releaseLockCurrentFileEntry = resolve);
		}
		async function requestLockWriter() {
			zipWriter.writerLocked = true;
			const { lockWriter } = zipWriter;
			zipWriter.lockWriter = new Promise((resolve) => releaseLockWriter = () => {
				zipWriter.writerLocked = false;
				resolve();
			});
			await lockWriter;
		}
		async function skipDiskIfNeeded(writable) {
			if (getLength(headerInfo.localHeaderArray) > writer.availableSize) {
				writer.availableSize = 0;
				await writeData(writable, new Uint8Array());
			}
		}
	}
	async function createFileEntry(reader, writer, { diskNumberStart, lock }, entryInfo, config$1, options) {
		const { headerInfo, dataDescriptorInfo, metadataSize } = entryInfo;
		const { headerArray, headerView, lastModDate, rawLastModDate, encrypted, compressed, version: version$1, compressionMethod, rawExtraFieldZip64, localExtraFieldZip64Length, rawExtraFieldExtendedTimestamp, extraFieldExtendedTimestampFlag, rawExtraFieldNTFS, rawExtraFieldAES } = headerInfo;
		const { dataDescriptorArray } = dataDescriptorInfo;
		const { rawFilename, lastAccessDate, creationDate, password, rawPassword, level, zip64, zip64UncompressedSize, zip64CompressedSize, zip64Offset, zip64DiskNumberStart, zipCrypto, dataDescriptor, directory, executable, versionMadeBy, rawComment, rawExtraField, useWebWorkers, onstart, onprogress, onend, signal, encryptionStrength, extendedTimestamp, msDosCompatible, internalFileAttributes, externalFileAttributes, useCompressionStream, passThrough } = options;
		const fileEntry = {
			lock,
			versionMadeBy,
			zip64,
			directory: Boolean(directory),
			executable: Boolean(executable),
			filenameUTF8: true,
			rawFilename,
			commentUTF8: true,
			rawComment,
			rawExtraFieldZip64,
			localExtraFieldZip64Length,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldAES,
			rawExtraField,
			extendedTimestamp,
			msDosCompatible,
			internalFileAttributes,
			externalFileAttributes,
			diskNumberStart
		};
		let { signature, uncompressedSize } = options;
		let compressedSize = 0;
		if (!passThrough) uncompressedSize = 0;
		const { writable } = writer;
		if (reader) {
			reader.chunkSize = getChunkSize(config$1);
			const readable = reader.readable;
			const size = reader.size;
			const workerOptions = {
				options: {
					codecType: CODEC_DEFLATE,
					level,
					rawPassword,
					password,
					encryptionStrength,
					zipCrypto: encrypted && zipCrypto,
					passwordVerification: encrypted && zipCrypto && rawLastModDate >> 8 & 255,
					signed: !passThrough,
					compressed: compressed && !passThrough,
					encrypted: encrypted && !passThrough,
					useWebWorkers,
					useCompressionStream,
					transferStreams: false
				},
				config: config$1,
				streamOptions: {
					signal,
					size,
					onstart,
					onprogress,
					onend
				}
			};
			try {
				const result = await runWorker({
					readable,
					writable
				}, workerOptions);
				compressedSize = result.outputSize;
				writer.size += compressedSize;
				if (!passThrough) {
					uncompressedSize = result.inputSize;
					signature = result.signature;
				}
			} catch (error) {
				if (error.outputSize !== UNDEFINED_VALUE) writer.size += error.outputSize;
				throw error;
			}
		}
		setEntryInfo({
			signature,
			compressedSize,
			uncompressedSize,
			headerInfo,
			dataDescriptorInfo
		}, options);
		if (dataDescriptor) await writeData(writer, dataDescriptorArray);
		Object.assign(fileEntry, {
			uncompressedSize,
			compressedSize,
			lastModDate,
			rawLastModDate,
			creationDate,
			lastAccessDate,
			encrypted,
			zipCrypto,
			size: metadataSize + compressedSize,
			compressionMethod,
			version: version$1,
			headerArray,
			headerView,
			signature,
			extraFieldExtendedTimestampFlag,
			zip64UncompressedSize,
			zip64CompressedSize,
			zip64Offset,
			zip64DiskNumberStart
		});
		return fileEntry;
	}
	function getHeaderInfo(options) {
		const { rawFilename, lastModDate, lastAccessDate, creationDate, level, zip64, zipCrypto, useUnicodeFileNames, dataDescriptor, directory, rawExtraField, encryptionStrength, extendedTimestamp, passThrough, encrypted, zip64UncompressedSize, zip64CompressedSize, zip64Offset, zip64DiskNumberStart, uncompressedSize, offset, diskNumberStart } = options;
		let { version: version$1, compressionMethod } = options;
		const compressed = !directory && (level > 0 || level === UNDEFINED_VALUE && compressionMethod !== 0);
		let rawExtraFieldZip64;
		const uncompressedFile = passThrough || !compressed;
		const zip64ExtraFieldComplete = zip64 && (options.bufferedWrite || !zip64UncompressedSize && !zip64CompressedSize || uncompressedFile);
		if (zip64) {
			let rawExtraFieldZip64Length = 4;
			if (zip64UncompressedSize) rawExtraFieldZip64Length += 8;
			if (zip64CompressedSize) rawExtraFieldZip64Length += 8;
			if (zip64Offset) rawExtraFieldZip64Length += 8;
			if (zip64DiskNumberStart) rawExtraFieldZip64Length += 4;
			rawExtraFieldZip64 = new Uint8Array(rawExtraFieldZip64Length);
			const rawExtraFieldZip64View = getDataView(rawExtraFieldZip64);
			setUint16(rawExtraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
			setUint16(rawExtraFieldZip64View, 2, getLength(rawExtraFieldZip64) - 4);
			if (zip64ExtraFieldComplete) {
				const rawExtraFieldZip64View$1 = getDataView(rawExtraFieldZip64);
				let rawExtraFieldZip64Offset = 4;
				if (zip64UncompressedSize) {
					setBigUint64(rawExtraFieldZip64View$1, rawExtraFieldZip64Offset, BigInt(uncompressedSize));
					rawExtraFieldZip64Offset += 8;
				}
				if (zip64CompressedSize && uncompressedFile) {
					setBigUint64(rawExtraFieldZip64View$1, rawExtraFieldZip64Offset, BigInt(uncompressedSize));
					rawExtraFieldZip64Offset += 8;
				}
				if (zip64Offset) {
					setBigUint64(rawExtraFieldZip64View$1, rawExtraFieldZip64Offset, BigInt(offset));
					rawExtraFieldZip64Offset += 8;
				}
				if (zip64DiskNumberStart) {
					setUint32(rawExtraFieldZip64View$1, rawExtraFieldZip64Offset, diskNumberStart);
					rawExtraFieldZip64Offset += 4;
				}
			}
		} else rawExtraFieldZip64 = new Uint8Array();
		let rawExtraFieldAES;
		if (encrypted && !zipCrypto) {
			rawExtraFieldAES = new Uint8Array(getLength(EXTRAFIELD_DATA_AES) + 2);
			const extraFieldAESView = getDataView(rawExtraFieldAES);
			setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
			arraySet(rawExtraFieldAES, EXTRAFIELD_DATA_AES, 2);
			setUint8(extraFieldAESView, 8, encryptionStrength);
		} else rawExtraFieldAES = new Uint8Array();
		let rawExtraFieldNTFS;
		let rawExtraFieldExtendedTimestamp;
		let extraFieldExtendedTimestampFlag;
		if (extendedTimestamp) {
			rawExtraFieldExtendedTimestamp = new Uint8Array(9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0));
			const extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
			setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
			setUint16(extraFieldExtendedTimestampView, 2, getLength(rawExtraFieldExtendedTimestamp) - 4);
			extraFieldExtendedTimestampFlag = 1 + (lastAccessDate ? 2 : 0) + (creationDate ? 4 : 0);
			setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
			let offset$1 = 5;
			setUint32(extraFieldExtendedTimestampView, offset$1, Math.floor(lastModDate.getTime() / 1e3));
			offset$1 += 4;
			if (lastAccessDate) {
				setUint32(extraFieldExtendedTimestampView, offset$1, Math.floor(lastAccessDate.getTime() / 1e3));
				offset$1 += 4;
			}
			if (creationDate) setUint32(extraFieldExtendedTimestampView, offset$1, Math.floor(creationDate.getTime() / 1e3));
			try {
				rawExtraFieldNTFS = new Uint8Array(36);
				const extraFieldNTFSView = getDataView(rawExtraFieldNTFS);
				const lastModTimeNTFS = getTimeNTFS(lastModDate);
				setUint16(extraFieldNTFSView, 0, EXTRAFIELD_TYPE_NTFS);
				setUint16(extraFieldNTFSView, 2, 32);
				setUint16(extraFieldNTFSView, 8, EXTRAFIELD_TYPE_NTFS_TAG1);
				setUint16(extraFieldNTFSView, 10, 24);
				setBigUint64(extraFieldNTFSView, 12, lastModTimeNTFS);
				setBigUint64(extraFieldNTFSView, 20, getTimeNTFS(lastAccessDate) || lastModTimeNTFS);
				setBigUint64(extraFieldNTFSView, 28, getTimeNTFS(creationDate) || lastModTimeNTFS);
			} catch {
				rawExtraFieldNTFS = new Uint8Array();
			}
		} else rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array();
		if (compressionMethod === UNDEFINED_VALUE) compressionMethod = compressed ? COMPRESSION_METHOD_DEFLATE : COMPRESSION_METHOD_STORE;
		if (zip64) version$1 = version$1 > VERSION_ZIP64 ? version$1 : VERSION_ZIP64;
		if (encrypted && !zipCrypto) {
			version$1 = version$1 > VERSION_AES ? version$1 : VERSION_AES;
			rawExtraFieldAES[9] = compressionMethod;
			compressionMethod = COMPRESSION_METHOD_AES;
		}
		const localExtraFieldZip64Length = zip64ExtraFieldComplete ? getLength(rawExtraFieldZip64) : 0;
		const extraFieldLength = localExtraFieldZip64Length + getLength(rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
		const { headerArray, headerView, rawLastModDate } = getHeaderArrayData({
			version: version$1,
			bitFlag: getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod),
			compressionMethod,
			uncompressedSize,
			lastModDate: lastModDate < MIN_DATE ? MIN_DATE : lastModDate > MAX_DATE ? MAX_DATE : lastModDate,
			rawFilename,
			zip64CompressedSize,
			zip64UncompressedSize,
			extraFieldLength
		});
		let localHeaderOffset = HEADER_SIZE;
		const localHeaderArray = new Uint8Array(localHeaderOffset + getLength(rawFilename) + extraFieldLength);
		const localHeaderView = getDataView(localHeaderArray);
		setUint32(localHeaderView, 0, LOCAL_FILE_HEADER_SIGNATURE);
		arraySet(localHeaderArray, headerArray, 4);
		arraySet(localHeaderArray, rawFilename, localHeaderOffset);
		localHeaderOffset += getLength(rawFilename);
		if (zip64ExtraFieldComplete) arraySet(localHeaderArray, rawExtraFieldZip64, localHeaderOffset);
		localHeaderOffset += localExtraFieldZip64Length;
		arraySet(localHeaderArray, rawExtraFieldAES, localHeaderOffset);
		localHeaderOffset += getLength(rawExtraFieldAES);
		arraySet(localHeaderArray, rawExtraFieldExtendedTimestamp, localHeaderOffset);
		localHeaderOffset += getLength(rawExtraFieldExtendedTimestamp);
		arraySet(localHeaderArray, rawExtraFieldNTFS, localHeaderOffset);
		localHeaderOffset += getLength(rawExtraFieldNTFS);
		arraySet(localHeaderArray, rawExtraField, localHeaderOffset);
		if (dataDescriptor) {
			setUint32(localHeaderView, HEADER_OFFSET_COMPRESSED_SIZE + 4, 0);
			setUint32(localHeaderView, HEADER_OFFSET_UNCOMPRESSED_SIZE + 4, 0);
		}
		return {
			localHeaderArray,
			localHeaderView,
			headerArray,
			headerView,
			lastModDate,
			rawLastModDate,
			encrypted,
			compressed,
			version: version$1,
			compressionMethod,
			extraFieldExtendedTimestampFlag,
			rawExtraFieldZip64,
			localExtraFieldZip64Length,
			rawExtraFieldExtendedTimestamp,
			rawExtraFieldNTFS,
			rawExtraFieldAES,
			extraFieldLength
		};
	}
	function appendExtraFieldUSDZ(entryInfo, zipWriterOffset) {
		const { headerInfo } = entryInfo;
		let { localHeaderArray, extraFieldLength } = headerInfo;
		let localHeaderArrayView = getDataView(localHeaderArray);
		let extraBytesLength = 64 - (zipWriterOffset + getLength(localHeaderArray)) % 64;
		if (extraBytesLength < 4) extraBytesLength += 64;
		const rawExtraFieldUSDZ = new Uint8Array(extraBytesLength);
		const extraFieldUSDZView = getDataView(rawExtraFieldUSDZ);
		setUint16(extraFieldUSDZView, 0, EXTRAFIELD_TYPE_USDZ);
		setUint16(extraFieldUSDZView, 2, extraBytesLength - 2);
		const previousLocalHeaderArray = localHeaderArray;
		headerInfo.localHeaderArray = localHeaderArray = new Uint8Array(getLength(previousLocalHeaderArray) + extraBytesLength);
		arraySet(localHeaderArray, previousLocalHeaderArray);
		arraySet(localHeaderArray, rawExtraFieldUSDZ, getLength(previousLocalHeaderArray));
		localHeaderArrayView = getDataView(localHeaderArray);
		setUint16(localHeaderArrayView, 28, extraFieldLength + extraBytesLength);
		entryInfo.metadataSize += extraBytesLength;
	}
	function getDataDescriptorInfo({ zip64, dataDescriptor, dataDescriptorSignature }) {
		let dataDescriptorArray = new Uint8Array();
		let dataDescriptorView, dataDescriptorOffset = 0;
		let dataDescriptorLength = zip64 ? DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH : DATA_DESCRIPTOR_RECORD_LENGTH;
		if (dataDescriptorSignature) dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
		if (dataDescriptor) {
			dataDescriptorArray = new Uint8Array(dataDescriptorLength);
			dataDescriptorView = getDataView(dataDescriptorArray);
			if (dataDescriptorSignature) {
				dataDescriptorOffset = DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
				setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
			}
		}
		return {
			dataDescriptorArray,
			dataDescriptorView,
			dataDescriptorOffset
		};
	}
	function setEntryInfo({ signature, compressedSize, uncompressedSize, headerInfo, dataDescriptorInfo }, { zip64, zipCrypto, dataDescriptor }) {
		const { headerView, encrypted } = headerInfo;
		const { dataDescriptorView, dataDescriptorOffset } = dataDescriptorInfo;
		if ((!encrypted || zipCrypto) && signature !== UNDEFINED_VALUE) {
			setUint32(headerView, HEADER_OFFSET_SIGNATURE, signature);
			if (dataDescriptor) setUint32(dataDescriptorView, dataDescriptorOffset, signature);
		}
		if (zip64) {
			if (dataDescriptor) {
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 4, BigInt(compressedSize));
				setBigUint64(dataDescriptorView, dataDescriptorOffset + 12, BigInt(uncompressedSize));
			}
		} else {
			setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, compressedSize);
			setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, uncompressedSize);
			if (dataDescriptor) {
				setUint32(dataDescriptorView, dataDescriptorOffset + 4, compressedSize);
				setUint32(dataDescriptorView, dataDescriptorOffset + 8, uncompressedSize);
			}
		}
	}
	function updateLocalHeader({ rawFilename, encrypted, zip64, localExtraFieldZip64Length, signature, compressedSize, uncompressedSize, offset, diskNumberStart, zip64UncompressedSize, zip64CompressedSize, zip64Offset, zip64DiskNumberStart }, localHeaderView, { dataDescriptor }) {
		if (!dataDescriptor) {
			if (!encrypted) setUint32(localHeaderView, HEADER_OFFSET_SIGNATURE + 4, signature);
			if (!zip64) {
				setUint32(localHeaderView, HEADER_OFFSET_COMPRESSED_SIZE + 4, compressedSize);
				setUint32(localHeaderView, HEADER_OFFSET_UNCOMPRESSED_SIZE + 4, uncompressedSize);
			}
		}
		if (zip64) {
			if (localExtraFieldZip64Length) {
				let localHeaderOffset = HEADER_SIZE + getLength(rawFilename) + 4;
				if (zip64UncompressedSize) {
					setBigUint64(localHeaderView, localHeaderOffset, BigInt(uncompressedSize));
					localHeaderOffset += 8;
				}
				if (zip64CompressedSize) {
					setBigUint64(localHeaderView, localHeaderOffset, BigInt(compressedSize));
					localHeaderOffset += 8;
				}
				if (zip64Offset) {
					setBigUint64(localHeaderView, localHeaderOffset, BigInt(offset));
					localHeaderOffset += 8;
				}
				if (zip64DiskNumberStart) setUint32(localHeaderView, localHeaderOffset, diskNumberStart);
			}
		}
	}
	function updateZip64ExtraField({ compressedSize, uncompressedSize, offset, diskNumberStart, zip64UncompressedSize, zip64CompressedSize, zip64Offset, zip64DiskNumberStart, rawExtraFieldZip64 }) {
		const rawExtraFieldZip64View = getDataView(rawExtraFieldZip64);
		let rawExtraFieldZip64Offset = 4;
		if (zip64UncompressedSize) {
			setBigUint64(rawExtraFieldZip64View, rawExtraFieldZip64Offset, BigInt(uncompressedSize));
			rawExtraFieldZip64Offset += 8;
		}
		if (zip64CompressedSize) {
			setBigUint64(rawExtraFieldZip64View, rawExtraFieldZip64Offset, BigInt(compressedSize));
			rawExtraFieldZip64Offset += 8;
		}
		if (zip64Offset) {
			setBigUint64(rawExtraFieldZip64View, rawExtraFieldZip64Offset, BigInt(offset));
			rawExtraFieldZip64Offset += 8;
		}
		if (zip64DiskNumberStart) setUint32(rawExtraFieldZip64View, rawExtraFieldZip64Offset, diskNumberStart);
	}
	async function closeFile(zipWriter, comment$1, options) {
		const { files, writer } = zipWriter;
		const { diskOffset } = writer;
		let { diskNumber } = writer;
		let offset = 0;
		let directoryDataLength = 0;
		let directoryOffset = zipWriter.offset - diskOffset;
		let filesLength = files.size;
		for (const [, fileEntry] of files) {
			const { rawFilename, rawExtraFieldZip64, rawExtraFieldAES, rawComment, rawExtraFieldNTFS, rawExtraField, extendedTimestamp, extraFieldExtendedTimestampFlag, lastModDate } = fileEntry;
			let rawExtraFieldTimestamp;
			if (extendedTimestamp) {
				rawExtraFieldTimestamp = new Uint8Array(9);
				const extraFieldExtendedTimestampView = getDataView(rawExtraFieldTimestamp);
				setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
				setUint16(extraFieldExtendedTimestampView, 2, 5);
				setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
				setUint32(extraFieldExtendedTimestampView, 5, Math.floor(lastModDate.getTime() / 1e3));
			} else rawExtraFieldTimestamp = new Uint8Array();
			fileEntry.rawExtraFieldExtendedTimestamp = rawExtraFieldTimestamp;
			directoryDataLength += 46 + getLength(rawFilename, rawComment, rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldNTFS, rawExtraFieldTimestamp, rawExtraField);
		}
		const directoryArray = new Uint8Array(directoryDataLength);
		const directoryView = getDataView(directoryArray);
		await initStream(writer);
		let directoryDiskOffset = 0;
		for (const [indexFileEntry, fileEntry] of Array.from(files.values()).entries()) {
			const { offset: fileEntryOffset, rawFilename, rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField, rawComment, versionMadeBy, headerArray, headerView, zip64: zip64$1, zip64UncompressedSize, zip64CompressedSize, zip64DiskNumberStart, zip64Offset, internalFileAttributes, externalFileAttributes, diskNumberStart, uncompressedSize, compressedSize } = fileEntry;
			const extraFieldLength = getLength(rawExtraFieldZip64, rawExtraFieldAES, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, rawExtraField);
			setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
			setUint16(directoryView, offset + 4, versionMadeBy);
			if (!zip64UncompressedSize) setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, uncompressedSize);
			if (!zip64CompressedSize) setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, compressedSize);
			arraySet(directoryArray, headerArray, offset + 6);
			let directoryOffset$1 = offset + HEADER_SIZE;
			setUint16(directoryView, directoryOffset$1, extraFieldLength);
			directoryOffset$1 += 2;
			setUint16(directoryView, directoryOffset$1, getLength(rawComment));
			directoryOffset$1 += 2;
			setUint16(directoryView, directoryOffset$1, zip64$1 && zip64DiskNumberStart ? MAX_16_BITS : diskNumberStart);
			directoryOffset$1 += 2;
			setUint16(directoryView, directoryOffset$1, internalFileAttributes);
			directoryOffset$1 += 2;
			if (externalFileAttributes) setUint32(directoryView, directoryOffset$1, externalFileAttributes);
			directoryOffset$1 += 4;
			setUint32(directoryView, directoryOffset$1, zip64$1 && zip64Offset ? MAX_32_BITS : fileEntryOffset);
			directoryOffset$1 += 4;
			arraySet(directoryArray, rawFilename, directoryOffset$1);
			directoryOffset$1 += getLength(rawFilename);
			arraySet(directoryArray, rawExtraFieldZip64, directoryOffset$1);
			directoryOffset$1 += getLength(rawExtraFieldZip64);
			arraySet(directoryArray, rawExtraFieldAES, directoryOffset$1);
			directoryOffset$1 += getLength(rawExtraFieldAES);
			arraySet(directoryArray, rawExtraFieldExtendedTimestamp, directoryOffset$1);
			directoryOffset$1 += getLength(rawExtraFieldExtendedTimestamp);
			arraySet(directoryArray, rawExtraFieldNTFS, directoryOffset$1);
			directoryOffset$1 += getLength(rawExtraFieldNTFS);
			arraySet(directoryArray, rawExtraField, directoryOffset$1);
			directoryOffset$1 += getLength(rawExtraField);
			arraySet(directoryArray, rawComment, directoryOffset$1);
			if (offset - directoryDiskOffset > writer.availableSize) {
				writer.availableSize = 0;
				await writeData(writer, directoryArray.slice(directoryDiskOffset, offset));
				directoryDiskOffset = offset;
			}
			offset = directoryOffset$1;
			if (options.onprogress) try {
				await options.onprogress(indexFileEntry + 1, files.size, new Entry(fileEntry));
			} catch {}
		}
		await writeData(writer, directoryDiskOffset ? directoryArray.slice(directoryDiskOffset) : directoryArray);
		let lastDiskNumber = writer.diskNumber;
		const { availableSize } = writer;
		if (availableSize < END_OF_CENTRAL_DIR_LENGTH) lastDiskNumber++;
		let zip64 = getOptionValue(zipWriter, options, PROPERTY_NAME_ZIP64);
		if (directoryOffset > MAX_32_BITS || directoryDataLength > MAX_32_BITS || filesLength > MAX_16_BITS || lastDiskNumber > MAX_16_BITS) if (zip64 === false) throw new Error(ERR_UNSUPPORTED_FORMAT);
		else zip64 = true;
		const endOfdirectoryArray = new Uint8Array(zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH);
		const endOfdirectoryView = getDataView(endOfdirectoryArray);
		offset = 0;
		if (zip64) {
			setUint32(endOfdirectoryView, 0, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
			setBigUint64(endOfdirectoryView, 4, BigInt(44));
			setUint16(endOfdirectoryView, 12, 45);
			setUint16(endOfdirectoryView, 14, 45);
			setUint32(endOfdirectoryView, 16, lastDiskNumber);
			setUint32(endOfdirectoryView, 20, diskNumber);
			setBigUint64(endOfdirectoryView, 24, BigInt(filesLength));
			setBigUint64(endOfdirectoryView, 32, BigInt(filesLength));
			setBigUint64(endOfdirectoryView, 40, BigInt(directoryDataLength));
			setBigUint64(endOfdirectoryView, 48, BigInt(directoryOffset));
			setUint32(endOfdirectoryView, 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
			setBigUint64(endOfdirectoryView, 64, BigInt(directoryOffset) + BigInt(directoryDataLength));
			setUint32(endOfdirectoryView, 72, lastDiskNumber + 1);
			if (getOptionValue(zipWriter, options, OPTION_SUPPORT_ZIP64_SPLIT_FILE, true)) {
				lastDiskNumber = MAX_16_BITS;
				diskNumber = MAX_16_BITS;
			}
			filesLength = MAX_16_BITS;
			directoryOffset = MAX_32_BITS;
			directoryDataLength = MAX_32_BITS;
			offset += ZIP64_END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH;
		}
		setUint32(endOfdirectoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
		setUint16(endOfdirectoryView, offset + 4, lastDiskNumber);
		setUint16(endOfdirectoryView, offset + 6, diskNumber);
		setUint16(endOfdirectoryView, offset + 8, filesLength);
		setUint16(endOfdirectoryView, offset + 10, filesLength);
		setUint32(endOfdirectoryView, offset + 12, directoryDataLength);
		setUint32(endOfdirectoryView, offset + 16, directoryOffset);
		const commentLength = getLength(comment$1);
		if (commentLength) if (commentLength <= MAX_16_BITS) setUint16(endOfdirectoryView, offset + 20, commentLength);
		else throw new Error(ERR_INVALID_COMMENT);
		await writeData(writer, endOfdirectoryArray);
		if (commentLength) await writeData(writer, comment$1);
	}
	async function writeData(writer, array) {
		const { writable } = writer;
		const streamWriter = writable.getWriter();
		try {
			await streamWriter.ready;
			writer.size += getLength(array);
			await streamWriter.write(array);
		} finally {
			streamWriter.releaseLock();
		}
	}
	function getTimeNTFS(date) {
		if (date) return (BigInt(date.getTime()) + BigInt(0xa9730b66800)) * BigInt(1e4);
	}
	function getOptionValue(zipWriter, options, name, defaultValue) {
		const result = options[name] === UNDEFINED_VALUE ? zipWriter.options[name] : options[name];
		return result === UNDEFINED_VALUE ? defaultValue : result;
	}
	function getMaximumCompressedSize(uncompressedSize) {
		return uncompressedSize + 5 * (Math.floor(uncompressedSize / 16383) + 1);
	}
	function setUint8(view, offset, value) {
		view.setUint8(offset, value);
	}
	function setUint16(view, offset, value) {
		view.setUint16(offset, value, true);
	}
	function setUint32(view, offset, value) {
		view.setUint32(offset, value, true);
	}
	function setBigUint64(view, offset, value) {
		view.setBigUint64(offset, value, true);
	}
	function arraySet(array, typedArray, offset) {
		array.set(typedArray, offset);
	}
	function getDataView(array) {
		return new DataView(array.buffer);
	}
	function getLength(...arrayLikes) {
		let result = 0;
		arrayLikes.forEach((arrayLike) => arrayLike && (result += arrayLike.length));
		return result;
	}
	function getHeaderArrayData({ version: version$1, bitFlag, compressionMethod, uncompressedSize, compressedSize, lastModDate, rawFilename, zip64CompressedSize, zip64UncompressedSize, extraFieldLength }) {
		const headerArray = new Uint8Array(HEADER_SIZE - 4);
		const headerView = getDataView(headerArray);
		setUint16(headerView, 0, version$1);
		setUint16(headerView, 2, bitFlag);
		setUint16(headerView, 4, compressionMethod);
		const dateArray = new Uint32Array(1);
		const dateView = getDataView(dateArray);
		setUint16(dateView, 0, (lastModDate.getHours() << 6 | lastModDate.getMinutes()) << 5 | lastModDate.getSeconds() / 2);
		setUint16(dateView, 2, (lastModDate.getFullYear() - 1980 << 4 | lastModDate.getMonth() + 1) << 5 | lastModDate.getDate());
		const rawLastModDate = dateArray[0];
		setUint32(headerView, 6, rawLastModDate);
		if (zip64CompressedSize || compressedSize !== UNDEFINED_VALUE) setUint32(headerView, HEADER_OFFSET_COMPRESSED_SIZE, zip64CompressedSize ? MAX_32_BITS : compressedSize);
		if (zip64UncompressedSize || uncompressedSize !== UNDEFINED_VALUE) setUint32(headerView, HEADER_OFFSET_UNCOMPRESSED_SIZE, zip64UncompressedSize ? MAX_32_BITS : uncompressedSize);
		setUint16(headerView, 22, getLength(rawFilename));
		setUint16(headerView, 24, extraFieldLength);
		return {
			headerArray,
			headerView,
			rawLastModDate
		};
	}
	function getBitFlag(level, useUnicodeFileNames, dataDescriptor, encrypted, compressionMethod) {
		let bitFlag = 0;
		if (useUnicodeFileNames) bitFlag = bitFlag | BITFLAG_LANG_ENCODING_FLAG;
		if (dataDescriptor) bitFlag = bitFlag | BITFLAG_DATA_DESCRIPTOR;
		if (compressionMethod == COMPRESSION_METHOD_DEFLATE || compressionMethod == COMPRESSION_METHOD_DEFLATE_64) {
			if (level >= 0 && level <= 3) bitFlag = bitFlag | BITFLAG_LEVEL_SUPER_FAST_MASK;
			if (level > 3 && level <= 5) bitFlag = bitFlag | BITFLAG_LEVEL_FAST_MASK;
			if (level == 9) bitFlag = bitFlag | BITFLAG_LEVEL_MAX_MASK;
		}
		if (encrypted) bitFlag = bitFlag | BITFLAG_ENCRYPTED;
		return bitFlag;
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/zip-core-base.js
	try {
		configure({ baseURI: {}.url });
	} catch {}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/zlib-streams-inline.js
	const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	function g(g$1) {
		let B;
		g$1({ wasmURI: () => (B || (B = "data:application/wasm;base64," + ((g$2) => {
			g$2 = ((g$3) => {
				const B$2 = (g$3 = (g$3 + "").replace(/[^A-Za-z0-9+/=]/g, "")).length, E$1 = [];
				for (let I$1 = 0; B$2 > I$1; I$1 += 4) {
					const B$3 = A.indexOf(g$3[I$1]) << 18 | A.indexOf(g$3[I$1 + 1]) << 12 | (63 & A.indexOf(g$3[I$1 + 2])) << 6 | 63 & A.indexOf(g$3[I$1 + 3]);
					E$1.push(B$3 >> 16 & 255), "=" !== g$3[I$1 + 2] && E$1.push(B$3 >> 8 & 255), "=" !== g$3[I$1 + 3] && E$1.push(255 & B$3);
				}
				return new Uint8Array(E$1);
			})(g$2);
			let B$1 = new Uint8Array(1024), E = 0;
			for (let A$1 = 0; A$1 < g$2.length;) {
				const C = g$2[A$1++];
				if (128 & C) {
					const Q = 3 + (127 & C), Y = g$2[A$1++] << 8 | g$2[A$1++], D = E - Y;
					I(E + Q);
					for (let A$2 = 0; Q > A$2; A$2++) B$1[E++] = B$1[D + A$2];
				} else {
					const Q = C;
					I(E + Q);
					for (let I$1 = 0; Q > I$1 && A$1 < g$2.length; I$1++) B$1[E++] = g$2[A$1++];
				}
			}
			return ((g$3) => {
				let B$2 = "";
				const E$1 = g$3.length;
				let I$1 = 0;
				for (; E$1 > I$1 + 2; I$1 += 3) {
					const E$2 = g$3[I$1] << 16 | g$3[I$1 + 1] << 8 | g$3[I$1 + 2];
					B$2 += A[E$2 >> 18 & 63] + A[E$2 >> 12 & 63] + A[E$2 >> 6 & 63] + A[63 & E$2];
				}
				const C = E$1 - I$1;
				if (1 === C) {
					const E$2 = g$3[I$1] << 16;
					B$2 += A[E$2 >> 18 & 63] + A[E$2 >> 12 & 63] + "==";
				} else if (2 === C) {
					const E$2 = g$3[I$1] << 16 | g$3[I$1 + 1] << 8;
					B$2 += A[E$2 >> 18 & 63] + A[E$2 >> 12 & 63] + A[E$2 >> 6 & 63] + "=";
				}
				return B$2;
			})(new Uint8Array(B$1.buffer.slice(0, E)));
			function I(A$1) {
				if (B$1.length < A$1) {
					let g$3 = 2 * B$1.length;
					for (; A$1 > g$3;) g$3 *= 2;
					const I$1 = new Uint8Array(g$3);
					I$1.set(B$1.subarray(0, E)), B$1 = I$1;
				}
			}
		})("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mYAABAFZgAAEAdmAAAQBOYAABAG5gAAEAXmAAAQB+YAABAEFgAAEAYWAAAQBRYAABAHFgAAEASWAAAQBpYAABAFlgAAEAeWAAAQBFYAABAGVgAAEAVWAAAQB1YAABAE1gAAEAbWAAAQBdYAABAH1gAAEAQ2AAAQBjYAABAFNgAAEAc2AAASAETMCAK2AAAQBbYAABAHtgAAEAR2AAAQBnYAABAFdgAAEAd2AAAQBPYAABAG9gAAEAX2AAAQB/YAABAETgADCBRMBCQCTgAAIAZOAAAgBU4AACAFTgAAIAdOAAAgB04AACAEzgAAIATOAAAgBs4AACAGzgAAIAXOAAAgBc4AACAHzgAAIAfOAAAgBC4AACIAQ2oAEAoAABIAACAFLgAAIAUuAAAgBy4AACAHLgAAIASuAAAgBK4AACAGrgAAIAauAAAgBa4AACAFrgAAIAeuAAAgB64AACAEbgAAIARuAAAgBm4AACAGbgAAIAVuAAAgBW4AACAHbgAAIAduAAAgBO4AACAE7gAAIAbuAAAgBu4AACAF7gAAIAXuAAAgB+4AACAH7gAAIgQO2AQeAAAgBh4AACAGHgAAIAUeAAAgBR4AACAHHgAAIAceAAAgBJ4AACAEngAAIAaeAAAgBp4AACAFngAAIAWeAAAgB54AACAHngAAIAReAAAgBF4AACAGXgAAIAZeAAAgBV4AACAFXgAAIAdeAAAgB14AACAE3gAAIATeAAAgBt4AACAG3gAAIAXeAAAgBd4AACAH3gAAIAfeAAAgBD4AACAEPgAAIAY+AAAgBj4AACAFPgAAIAU+AAAgBz4AACAHPgAAIAS+AAAgBL4AACAGvgAAIAa+AAAgBb4AACAFvgAAIAe+AAAgB74AACAEfgAAIAR+AAAgBn4AACAGfgAAIAV+AAAgBX4AACAHfgAAIAd+AAAgBP4AACAE/gAAIAb+AAAgBv4AACAF/gAAIAX+AAAgB/4AACAH/gAAIgQQKAUCAAAQBIIAABAFggAAEARCAAAQBUIAABAEwgAAEAXCCBVYDBwBIgAAEASiAAAQBaIAABAEYgAAEAViAAAQBOIAABAF4gAAEAQSAAAQBRIAABAEkgAAEAWSAAAQBFIAABAFUgAAEATSAAAQBdIAABAEDgABCAYOAAAQBQ4AABAHDgAAEASOAAAQBo4AABAFjgAAEAeOAAASAveaAAHSBAsYBBYAAXAEFggVKARSAAAQBDIAABAEcgAAEgL34gAREAQWCBgQBGoIF6gEFgAPUAQWAA7gBBYADnIBPdoAABAERgAAEAQmAAAQBGYAABIEAAgEVgAAEAQ2AAAQBHYAABAEDgAAEAROCBkABBYACLIEFpgEFgAG0AQWAPd8DGwtNgx+5hwAEAQKMAASBB1GJAAQBBIwABAEFigAEBEGwHAuAvMWLAEuNADuFAC8BBoQABIEFiIEABIEBCoEABIEBkoEABICEcYIABAELhAAEAQyEAASABduBR3kE4B0LI4UAX4UFywIQEYAFbQYHCQYKBQuAOrgEDQIOAYAHJQSUHgtphQCQhQCIhQCAhQB4gQBogQBcgQYfARCAAAQBFIAABAEYgAAEARyAAAQBIIAABAEogAAEATCAAAQBOIAABAFAgAAEAVCAAASBBr0BcIAABAGAgAAEAaCAAAQBwIAABAHggABvAx8Lco0Ab4EAa4EAZ4EAY4EAX4EAW4EAV4EAU4EAT4EAS4EAR4EAQ4EBPAGArwBBgFHNAgttgQDHAQSAAAIBCIAABIEBM4ECSwEQgAAOgwAMgYVpgKomhAAkgQdzgQBPAQiAAAiBABiFAAyBCLeDAAwBIIEAlIAyhIEAawGAgQgvAQSDAAyAP0gKAQAQDABBkSEL/4AlHwEDgpvTBQgJCQoKgEk3gAABAQ2AAAEBDoAAAQEPgAABARCEAAEBEYQAAQEShAABAROEAAEBFIwAAQEVjAABARaMAAEBF4wAAQEYnAABARmcAAEBGpwAAQEbmwABARyBffsEBAQFBYHBkAEHgAABAQiEAAGAXSqCAAEBCowAAYAnsooAAYEBMJkAAYEBTJkAAYEBaLkAAYEBpLkAAYIDdYABzoUBvI0BqJ0BkLwBgAIbHLwAAQEdvAABgA9PgH05A9AqAQ==")), B) });
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/zlib-wasm/zlib-streams.js
	let wasm, malloc, free, memory;
	function setWasmExports(wasmAPI) {
		wasm = wasmAPI;
		({malloc, free, memory} = wasm);
		if (typeof malloc !== "function" || typeof free !== "function" || !memory) {
			wasm = malloc = free = memory = null;
			throw new Error("Invalid WASM module");
		}
	}
	function _make(isCompress, type, options = {}) {
		const level = typeof options.level === "number" ? options.level : -1;
		const outBufferSize = typeof options.outBuffer === "number" ? options.outBuffer : 64 * 1024;
		const inBufferSize = typeof options.inBufferSize === "number" ? options.inBufferSize : 64 * 1024;
		return new TransformStream({
			start() {
				let result;
				this.out = malloc(outBufferSize);
				this.in = malloc(inBufferSize);
				this.inBufferSize = inBufferSize;
				this._scratch = new Uint8Array(outBufferSize);
				if (isCompress) {
					this._process = wasm.deflate_process;
					this._last_consumed = wasm.deflate_last_consumed;
					this._end = wasm.deflate_end;
					this.streamHandle = wasm.deflate_new();
					if (type === "gzip") result = wasm.deflate_init_gzip(this.streamHandle, level);
					else if (type === "deflate-raw") result = wasm.deflate_init_raw(this.streamHandle, level);
					else result = wasm.deflate_init(this.streamHandle, level);
				} else if (type === "deflate64-raw") {
					this._process = wasm.inflate9_process;
					this._last_consumed = wasm.inflate9_last_consumed;
					this._end = wasm.inflate9_end;
					this.streamHandle = wasm.inflate9_new();
					result = wasm.inflate9_init_raw(this.streamHandle);
				} else {
					this._process = wasm.inflate_process;
					this._last_consumed = wasm.inflate_last_consumed;
					this._end = wasm.inflate_end;
					this.streamHandle = wasm.inflate_new();
					if (type === "deflate-raw") result = wasm.inflate_init_raw(this.streamHandle);
					else if (type === "gzip") result = wasm.inflate_init_gzip(this.streamHandle);
					else result = wasm.inflate_init(this.streamHandle);
				}
				if (result !== 0) throw new Error("init failed:" + result);
			},
			transform(chunk$1, controller$1) {
				try {
					const buffer = chunk$1;
					const heap = new Uint8Array(memory.buffer);
					const process = this._process;
					const last_consumed = this._last_consumed;
					const out = this.out;
					const scratch = this._scratch;
					let offset = 0;
					while (offset < buffer.length) {
						const toRead = Math.min(buffer.length - offset, 32 * 1024);
						if (!this.in || this.inBufferSize < toRead) {
							if (this.in && free) free(this.in);
							this.in = malloc(toRead);
							this.inBufferSize = toRead;
						}
						heap.set(buffer.subarray(offset, offset + toRead), this.in);
						const result = process(this.streamHandle, this.in, toRead, out, outBufferSize, 0);
						if (!isCompress && result < 0) throw new Error("process error:" + result);
						const prod = result & 16777215;
						if (prod) {
							scratch.set(heap.subarray(out, out + prod), 0);
							controller$1.enqueue(scratch.slice(0, prod));
						}
						const consumed = last_consumed(this.streamHandle);
						if (consumed === 0) break;
						offset += consumed;
					}
				} catch (error) {
					if (this._end && this.streamHandle) this._end(this.streamHandle);
					if (this.in && free) free(this.in);
					if (this.out && free) free(this.out);
					controller$1.error(error);
				}
			},
			flush(controller$1) {
				try {
					const heap = new Uint8Array(memory.buffer);
					const process = this._process;
					const out = this.out;
					const scratch = this._scratch;
					while (true) {
						const result = process(this.streamHandle, 0, 0, out, outBufferSize, 4);
						if (!isCompress && result < 0) throw new Error("process error:" + result);
						const produced = result & 16777215;
						const code$2 = result >> 24 & 255;
						if (produced) {
							scratch.set(heap.subarray(out, out + produced), 0);
							controller$1.enqueue(scratch.slice(0, produced));
						}
						if (code$2 === 1 || produced === 0) break;
					}
				} catch (error) {
					controller$1.error(error);
				} finally {
					if (this._end && this.streamHandle) {
						const result = this._end(this.streamHandle);
						if (result !== 0) controller$1.error(/* @__PURE__ */ new Error("end error:" + result));
					}
					if (this.in && free) free(this.in);
					if (this.out && free) free(this.out);
				}
			}
		});
	}
	var CompressionStreamZlib = class {
		constructor(type = "deflate", options) {
			return _make(true, type, options);
		}
	};
	var DecompressionStreamZlib = class {
		constructor(type = "deflate", options) {
			return _make(false, type, options);
		}
	};

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/streams/zlib-wasm/zlib-streams-loader.js
	let initializedModule = false;
	async function initModule(wasmURI, { baseURI }) {
		if (!initializedModule) {
			let arrayBuffer, uri;
			try {
				try {
					uri = new URL(wasmURI, baseURI);
				} catch {}
				arrayBuffer = await (await fetch(uri)).arrayBuffer();
			} catch (error) {
				if (wasmURI.startsWith("data:application/wasm;base64,")) arrayBuffer = arrayBufferFromDataURI(wasmURI);
				else throw error;
			}
			setWasmExports((await WebAssembly.instantiate(arrayBuffer)).instance.exports);
			initializedModule = true;
		}
	}
	function arrayBufferFromDataURI(dataURI) {
		const base64 = dataURI.split(",")[1];
		const binary = atob(base64);
		const len = binary.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; ++i) bytes[i] = binary.charCodeAt(i);
		return bytes.buffer;
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/zip-module-wasm.js
	let modulePromise;
	g(configure);
	configureWorker({ initModule: (config$1) => {
		if (!modulePromise) {
			let { wasmURI } = config$1;
			if (typeof wasmURI == FUNCTION_TYPE) wasmURI = wasmURI();
			modulePromise = initModule(wasmURI, config$1);
		}
		return modulePromise;
	} });
	configure({
		CompressionStreamZlib,
		DecompressionStreamZlib
	});

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/zip-fs.js
	var ZipEntry = class {
		constructor(fs$1, name, params, parent) {
			const zipEntry = this;
			if (fs$1.root && parent && parent.getChildByName(name)) throw new Error("Entry filename already exists");
			if (!params) params = {};
			Object.assign(zipEntry, {
				fs: fs$1,
				name,
				data: params.data,
				options: params.options,
				id: fs$1.entries.length,
				parent,
				children: [],
				uncompressedSize: params.uncompressedSize || 0,
				passThrough: params.passThrough
			});
			fs$1.entries.push(zipEntry);
			if (parent) zipEntry.parent.children.push(zipEntry);
		}
		moveTo(target) {
			const zipEntry = this;
			zipEntry.fs.move(zipEntry, target);
		}
		getFullname() {
			return this.getRelativeName();
		}
		getRelativeName(ancestor = this.fs.root) {
			const zipEntry = this;
			let relativeName = zipEntry.name;
			let entry = zipEntry.parent;
			while (entry && entry != ancestor) {
				relativeName = (entry.name ? entry.name + "/" : "") + relativeName;
				entry = entry.parent;
			}
			return relativeName;
		}
		isDescendantOf(ancestor) {
			let entry = this.parent;
			while (entry && entry.id != ancestor.id) entry = entry.parent;
			return Boolean(entry);
		}
		rename(name) {
			const parent = this.parent;
			if (parent && parent.getChildByName(name)) throw new Error("Entry filename already exists");
			else this.name = name;
		}
	};
	var ZipFileEntry = class ZipFileEntry extends ZipEntry {
		constructor(fs$1, name, params, parent) {
			super(fs$1, name, params, parent);
			const zipEntry = this;
			zipEntry.Reader = params.Reader;
			zipEntry.Writer = params.Writer;
			if (params.getData) zipEntry.getData = params.getData;
		}
		clone() {
			return new ZipFileEntry(this.fs, this.name, this);
		}
		async getData(writer, options = {}) {
			const zipEntry = this;
			if (!writer || writer.constructor == zipEntry.Writer && zipEntry.data) return zipEntry.data;
			else {
				const reader = zipEntry.reader = new zipEntry.Reader(zipEntry.data, options);
				const uncompressedSize = zipEntry.data ? zipEntry.data.uncompressedSize : reader.size;
				await Promise.all([initStream(reader), initStream(writer, uncompressedSize)]);
				const { readable } = reader;
				zipEntry.uncompressedSize = reader.size;
				await readable.pipeTo(writer.writable);
				return writer.getData ? writer.getData() : writer.writable;
			}
		}
		isPasswordProtected() {
			return this.data.encrypted;
		}
		async checkPassword(password, options = {}) {
			const zipEntry = this;
			if (zipEntry.isPasswordProtected()) {
				options.password = password;
				options.checkPasswordOnly = true;
				try {
					await zipEntry.data.getData(null, options);
					return true;
				} catch (error) {
					if (error.message == ERR_INVALID_PASSWORD) return false;
					else throw error;
				}
			} else return true;
		}
		getText(encoding, options) {
			return this.getData(new TextWriter(encoding), options);
		}
		getBlob(mimeType, options) {
			return this.getData(new BlobWriter(mimeType), options);
		}
		getData64URI(mimeType, options) {
			return this.getData(new Data64URIWriter(mimeType), options);
		}
		getUint8Array(options) {
			return this.getData(new Uint8ArrayWriter(), options);
		}
		getWritable(writable = new WritableStream(), options) {
			return this.getData({ writable }, options);
		}
		getArrayBuffer(options) {
			return this.data.arrayBuffer(options);
		}
		replaceBlob(blob) {
			Object.assign(this, {
				data: blob,
				Reader: BlobReader,
				Writer: BlobWriter,
				reader: null
			});
		}
		replaceText(text$3) {
			Object.assign(this, {
				data: text$3,
				Reader: TextReader,
				Writer: TextWriter,
				reader: null
			});
		}
		replaceData64URI(dataURI) {
			Object.assign(this, {
				data: dataURI,
				Reader: Data64URIReader,
				Writer: Data64URIWriter,
				reader: null
			});
		}
		replaceUint8Array(array) {
			Object.assign(this, {
				data: array,
				Reader: Uint8ArrayReader,
				Writer: Uint8ArrayWriter,
				reader: null
			});
		}
		replaceReadable(readable) {
			Object.assign(this, {
				data: null,
				Reader: function() {
					return { readable };
				},
				Writer: null,
				reader: null
			});
		}
	};
	var ZipDirectoryEntry = class ZipDirectoryEntry extends ZipEntry {
		constructor(fs$1, name, params, parent) {
			super(fs$1, name, params, parent);
			this.directory = true;
		}
		clone(deepClone) {
			const zipEntry = this;
			const clonedEntry = new ZipDirectoryEntry(zipEntry.fs, zipEntry.name);
			if (deepClone) clonedEntry.children = zipEntry.children.map((child) => {
				const childClone = child.clone(deepClone);
				childClone.parent = clonedEntry;
				return childClone;
			});
			return clonedEntry;
		}
		addDirectory(name, options) {
			return addChild(this, name, { options }, true);
		}
		addText(name, text$3, options = {}) {
			return addChild(this, name, {
				data: text$3,
				Reader: TextReader,
				Writer: TextWriter,
				options,
				uncompressedSize: text$3.length
			});
		}
		addBlob(name, blob, options = {}) {
			return addChild(this, name, {
				data: blob,
				Reader: BlobReader,
				Writer: BlobWriter,
				options,
				uncompressedSize: blob.size
			});
		}
		addData64URI(name, dataURI, options = {}) {
			let dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=") dataEnd--;
			const dataStart = dataURI.indexOf(",") + 1;
			return addChild(this, name, {
				data: dataURI,
				Reader: Data64URIReader,
				Writer: Data64URIWriter,
				options,
				uncompressedSize: Math.floor((dataEnd - dataStart) * .75)
			});
		}
		addUint8Array(name, array, options = {}) {
			return addChild(this, name, {
				data: array,
				Reader: Uint8ArrayReader,
				Writer: Uint8ArrayWriter,
				options,
				uncompressedSize: array.length
			});
		}
		addHttpContent(name, url, options = {}) {
			return addChild(this, name, {
				data: url,
				Reader: class extends HttpReader {
					constructor(url$1) {
						super(url$1, options);
					}
				},
				options
			});
		}
		addReadable(name, readable, options = {}) {
			return addChild(this, name, {
				Reader: function() {
					return { readable };
				},
				options
			});
		}
		addFileSystemEntry(fileSystemEntry, options = {}) {
			return addFileSystemHandle(this, fileSystemEntry, options);
		}
		addFileSystemHandle(handle$2, options = {}) {
			return addFileSystemHandle(this, handle$2, options);
		}
		addFile(file, options = {}) {
			if (!options.lastModDate) options.lastModDate = new Date(file.lastModified);
			return addChild(this, file.name, {
				data: file,
				Reader: function() {
					return {
						readable: file.stream(),
						size: file.size
					};
				},
				options,
				uncompressedSize: file.size
			});
		}
		addData(name, params) {
			return addChild(this, name, params);
		}
		importBlob(blob, options) {
			return this.importZip(new BlobReader(blob), options);
		}
		importData64URI(dataURI, options) {
			return this.importZip(new Data64URIReader(dataURI), options);
		}
		importUint8Array(array, options) {
			return this.importZip(new Uint8ArrayReader(array), options);
		}
		importHttpContent(url, options) {
			return this.importZip(new HttpReader(url, options), options);
		}
		importReadable(readable, options) {
			return this.importZip({ readable }, options);
		}
		exportBlob(options = {}) {
			return this.exportZip(new BlobWriter(options.mimeType || "application/zip"), options);
		}
		exportData64URI(options = {}) {
			return this.exportZip(new Data64URIWriter(options.mimeType || "application/zip"), options);
		}
		exportUint8Array(options = {}) {
			return this.exportZip(new Uint8ArrayWriter(), options);
		}
		async exportWritable(writable = new WritableStream(), options = {}) {
			await this.exportZip({ writable }, options);
			return writable;
		}
		async importZip(reader, options = {}) {
			await initStream(reader);
			const zipReader = new ZipReader(reader, options);
			const importedEntries = [];
			const entries = await zipReader.getEntries();
			for (const entry of entries) {
				let parent = this;
				try {
					const path = entry.filename.split("/");
					const name = path.pop();
					path.forEach((pathPart, pathIndex) => {
						const previousParent = parent;
						parent = parent.getChildByName(pathPart);
						if (!parent) {
							parent = new ZipDirectoryEntry(this.fs, pathPart, { data: pathIndex == path.length - 1 ? entry : null }, previousParent);
							importedEntries.push(parent);
						}
					});
					if (!entry.directory) importedEntries.push(addChild(parent, name, {
						data: entry,
						Reader: getZipBlobReader(Object.assign({}, options)),
						uncompressedSize: entry.uncompressedSize,
						passThrough: options.passThrough
					}));
				} catch (error) {
					try {
						error.cause = { entry };
					} catch {}
					throw error;
				}
			}
			return importedEntries;
		}
		async exportZip(writer, options) {
			const zipEntry = this;
			if (options.bufferedWrite === UNDEFINED_VALUE) options.bufferedWrite = true;
			await Promise.all([initReaders(zipEntry, options.readerOptions), initStream(writer)]);
			const zipWriter = new ZipWriter(writer, options);
			await exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], "uncompressedSize"), options);
			await zipWriter.close();
			return writer.getData ? writer.getData() : writer.writable;
		}
		getChildByName(name) {
			const children = this.children;
			for (let childIndex = 0; childIndex < children.length; childIndex++) {
				const child = children[childIndex];
				if (child.name == name) return child;
			}
		}
		isPasswordProtected() {
			const children = this.children;
			for (let childIndex = 0; childIndex < children.length; childIndex++) if (children[childIndex].isPasswordProtected()) return true;
			return false;
		}
		async checkPassword(password, options = {}) {
			const children = this.children;
			return !(await Promise.all(children.map((child) => child.checkPassword(password, options)))).includes(false);
		}
	};
	var FS = class {
		constructor() {
			resetFS(this);
		}
		get children() {
			return this.root.children;
		}
		remove(entry) {
			detach(entry);
			this.entries[entry.id] = null;
		}
		move(entry, destination) {
			if (entry == this.root) throw new Error("Root directory cannot be moved");
			else if (destination.directory) if (!destination.isDescendantOf(entry)) {
				if (entry != destination) {
					if (destination.getChildByName(entry.name)) throw new Error("Entry filename already exists");
					detach(entry);
					entry.parent = destination;
					destination.children.push(entry);
				}
			} else throw new Error("Entry is a ancestor of target entry");
			else throw new Error("Target entry is not a directory");
		}
		find(fullname) {
			const path = fullname.split("/");
			let node$1 = this.root;
			for (let index = 0; node$1 && index < path.length; index++) node$1 = node$1.getChildByName(path[index]);
			return node$1;
		}
		getById(id$1) {
			return this.entries[id$1];
		}
		getChildByName(name) {
			return this.root.getChildByName(name);
		}
		addDirectory(name, options) {
			return this.root.addDirectory(name, options);
		}
		addText(name, text$3, options) {
			return this.root.addText(name, text$3, options);
		}
		addBlob(name, blob, options) {
			return this.root.addBlob(name, blob, options);
		}
		addData64URI(name, dataURI, options) {
			return this.root.addData64URI(name, dataURI, options);
		}
		addUint8Array(name, array, options) {
			return this.root.addUint8Array(name, array, options);
		}
		addHttpContent(name, url, options) {
			return this.root.addHttpContent(name, url, options);
		}
		addReadable(name, readable, options) {
			return this.root.addReadable(name, readable, options);
		}
		addFileSystemEntry(fileSystemEntry, options) {
			return this.root.addFileSystemEntry(fileSystemEntry, options);
		}
		addFileSystemHandle(handle$2, options) {
			return this.root.addFileSystemHandle(handle$2, options);
		}
		addFile(file, options) {
			return this.root.addFile(file, options);
		}
		addData(name, params) {
			return this.root.addData(name, params);
		}
		importBlob(blob, options) {
			resetFS(this);
			return this.root.importBlob(blob, options);
		}
		importData64URI(dataURI, options) {
			resetFS(this);
			return this.root.importData64URI(dataURI, options);
		}
		importUint8Array(array, options) {
			resetFS(this);
			return this.root.importUint8Array(array, options);
		}
		importHttpContent(url, options) {
			resetFS(this);
			return this.root.importHttpContent(url, options);
		}
		importReadable(readable, options) {
			resetFS(this);
			return this.root.importReadable(readable, options);
		}
		importZip(reader, options) {
			return this.root.importZip(reader, options);
		}
		exportBlob(options) {
			return this.root.exportBlob(options);
		}
		exportData64URI(options) {
			return this.root.exportData64URI(options);
		}
		exportUint8Array(options) {
			return this.root.exportUint8Array(options);
		}
		exportWritable(writable, options) {
			return this.root.exportWritable(writable, options);
		}
		isPasswordProtected() {
			return this.root.isPasswordProtected();
		}
		checkPassword(password, options) {
			return this.root.checkPassword(password, options);
		}
	};
	const fs = {
		FS,
		ZipDirectoryEntry,
		ZipFileEntry
	};
	function getTotalSize(entries, propertyName) {
		let size = 0;
		entries.forEach(process);
		return size;
		function process(entry) {
			size += entry[propertyName];
			if (entry.children) entry.children.forEach(process);
		}
	}
	function getZipBlobReader(options) {
		return class extends Reader {
			constructor(entry, options$1 = {}) {
				super();
				this.entry = entry;
				this.options = options$1;
			}
			async init() {
				const zipBlobReader = this;
				zipBlobReader.size = zipBlobReader.entry.uncompressedSize;
				const data = await zipBlobReader.entry.getData(new BlobWriter(), Object.assign({}, zipBlobReader.options, options));
				zipBlobReader.data = data;
				zipBlobReader.blobReader = new BlobReader(data);
				super.init();
			}
			readUint8Array(index, length) {
				return this.blobReader.readUint8Array(index, length);
			}
		};
	}
	async function initReaders(entry, options) {
		if (entry.children.length) await Promise.all(entry.children.map(async (child) => {
			if (child.directory) await initReaders(child, options);
			else {
				const reader = child.reader = new child.Reader(child.data, options);
				try {
					await initStream(reader);
				} catch (error) {
					try {
						error.entryId = child.id;
						error.cause = { entry: child };
					} catch {}
					throw error;
				}
				child.uncompressedSize = reader.size;
			}
		}));
	}
	function detach(entry) {
		if (entry.parent) {
			const children = entry.parent.children;
			children.forEach((child, index) => {
				if (child.id == entry.id) children.splice(index, 1);
			});
		}
	}
	async function exportZip(zipWriter, entry, totalSize, options) {
		const selectedEntry = entry;
		const entryOffsets = /* @__PURE__ */ new Map();
		await process(zipWriter, entry);
		async function process(zipWriter$1, entry$1) {
			await exportChild();
			async function exportChild() {
				if (options.bufferedWrite) await Promise.allSettled(entry$1.children.map(processChild));
				else for (const child of entry$1.children) await processChild(child);
			}
			async function processChild(child) {
				const name = options.relativePath ? child.getRelativeName(selectedEntry) : child.getFullname();
				const childOptions = child.options || {};
				let zipEntryOptions = {};
				if (child.data instanceof Entry) {
					const { externalFileAttributes, versionMadeBy, comment: comment$1, lastModDate, creationDate, lastAccessDate, uncompressedSize, encrypted, zipCrypto, signature, compressionMethod, extraFieldAES } = child.data;
					zipEntryOptions = {
						externalFileAttributes,
						versionMadeBy,
						comment: comment$1,
						lastModDate,
						creationDate,
						lastAccessDate
					};
					if (child.passThrough) {
						let level, encryptionStrength;
						if (compressionMethod === 0) level = 0;
						if (extraFieldAES) encryptionStrength = extraFieldAES.strength;
						zipEntryOptions = Object.assign(zipEntryOptions, {
							passThrough: true,
							encrypted,
							zipCrypto,
							signature,
							uncompressedSize,
							level,
							encryptionStrength,
							compressionMethod
						});
					}
				}
				await zipWriter$1.add(name, child.reader, Object.assign({}, options, zipEntryOptions, childOptions, {
					directory: child.directory,
					onprogress: async (indexProgress) => {
						if (options.onprogress) {
							entryOffsets.set(name, indexProgress);
							try {
								await options.onprogress(Array.from(entryOffsets.values()).reduce((previousValue, currentValue) => previousValue + currentValue), totalSize);
							} catch {}
						}
					}
				}));
				await process(zipWriter$1, child);
			}
		}
	}
	function addFileSystemHandle(zipEntry, handle$2, options) {
		return addFile$1(zipEntry, handle$2, []);
		async function addFile$1(parentEntry, handle$3, addedEntries) {
			if (handle$3) try {
				if (handle$3.isFile || handle$3.isDirectory) handle$3 = await transformToFileSystemhandle(handle$3);
				if (handle$3.kind == "file") {
					const file = await handle$3.getFile();
					addedEntries.push(parentEntry.addData(file.name, {
						Reader: function() {
							return {
								readable: file.stream(),
								size: file.size
							};
						},
						options: Object.assign({}, { lastModDate: new Date(file.lastModified) }, options),
						uncompressedSize: file.size
					}));
				} else if (handle$3.kind == "directory") {
					const directoryEntry = parentEntry.addDirectory(handle$3.name);
					addedEntries.push(directoryEntry);
					for await (const childHandle of handle$3.values()) await addFile$1(directoryEntry, childHandle, addedEntries);
				}
			} catch (error) {
				const message = error.message + (handle$3 ? " (" + handle$3.name + ")" : "");
				throw new Error(message);
			}
			return addedEntries;
		}
	}
	async function transformToFileSystemhandle(entry) {
		const handle$2 = { name: entry.name };
		if (entry.isFile) {
			handle$2.kind = "file";
			handle$2.getFile = () => new Promise((resolve, reject) => entry.file(resolve, reject));
		}
		if (entry.isDirectory) {
			handle$2.kind = "directory";
			const handles = await transformToFileSystemhandles(entry);
			handle$2.values = () => handles;
		}
		return handle$2;
	}
	async function transformToFileSystemhandles(entry) {
		const entries = [];
		function readEntries(directoryReader, resolve, reject) {
			directoryReader.readEntries(async (entriesPart) => {
				if (!entriesPart.length) resolve(entries);
				else {
					for (const entry$1 of entriesPart) entries.push(await transformToFileSystemhandle(entry$1));
					readEntries(directoryReader, resolve, reject);
				}
			}, reject);
		}
		await new Promise((resolve, reject) => readEntries(entry.createReader(), resolve, reject));
		return { [Symbol.iterator]() {
			let entryIndex = 0;
			return { next() {
				const result = {
					value: entries[entryIndex],
					done: entryIndex == entries.length
				};
				entryIndex++;
				return result;
			} };
		} };
	}
	function resetFS(fs$1) {
		fs$1.entries = [];
		fs$1.root = new ZipDirectoryEntry(fs$1);
	}
	function addChild(parent, name, params, directory) {
		if (parent.directory) return directory ? new ZipDirectoryEntry(parent.fs, name, params, parent) : new ZipFileEntry(parent.fs, name, params, parent);
		else throw new Error("Parent entry is not a directory");
	}

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/core/util/mime-type.js
	const table$1 = {
		"application": {
			"andrew-inset": "ez",
			"annodex": "anx",
			"atom+xml": "atom",
			"atomcat+xml": "atomcat",
			"atomserv+xml": "atomsrv",
			"bbolin": "lin",
			"cu-seeme": "cu",
			"davmount+xml": "davmount",
			"dsptype": "tsp",
			"ecmascript": ["es", "ecma"],
			"futuresplash": "spl",
			"hta": "hta",
			"java-archive": "jar",
			"java-serialized-object": "ser",
			"java-vm": "class",
			"m3g": "m3g",
			"mac-binhex40": "hqx",
			"mathematica": [
				"nb",
				"ma",
				"mb"
			],
			"msaccess": "mdb",
			"msword": [
				"doc",
				"dot",
				"wiz"
			],
			"mxf": "mxf",
			"oda": "oda",
			"ogg": "ogx",
			"pdf": "pdf",
			"pgp-keys": "key",
			"pgp-signature": ["asc", "sig"],
			"pics-rules": "prf",
			"postscript": [
				"ps",
				"ai",
				"eps",
				"epsi",
				"epsf",
				"eps2",
				"eps3"
			],
			"rar": "rar",
			"rdf+xml": "rdf",
			"rss+xml": "rss",
			"rtf": "rtf",
			"xhtml+xml": ["xhtml", "xht"],
			"xml": [
				"xml",
				"xsl",
				"xsd",
				"xpdl"
			],
			"xspf+xml": "xspf",
			"zip": "zip",
			"vnd.android.package-archive": "apk",
			"vnd.cinderella": "cdy",
			"vnd.google-earth.kml+xml": "kml",
			"vnd.google-earth.kmz": "kmz",
			"vnd.mozilla.xul+xml": "xul",
			"vnd.ms-excel": [
				"xls",
				"xlb",
				"xlt",
				"xlm",
				"xla",
				"xlc",
				"xlw"
			],
			"vnd.ms-pki.seccat": "cat",
			"vnd.ms-pki.stl": "stl",
			"vnd.ms-powerpoint": [
				"ppt",
				"pps",
				"pot",
				"ppa",
				"pwz"
			],
			"vnd.oasis.opendocument.chart": "odc",
			"vnd.oasis.opendocument.database": "odb",
			"vnd.oasis.opendocument.formula": "odf",
			"vnd.oasis.opendocument.graphics": "odg",
			"vnd.oasis.opendocument.graphics-template": "otg",
			"vnd.oasis.opendocument.image": "odi",
			"vnd.oasis.opendocument.presentation": "odp",
			"vnd.oasis.opendocument.presentation-template": "otp",
			"vnd.oasis.opendocument.spreadsheet": "ods",
			"vnd.oasis.opendocument.spreadsheet-template": "ots",
			"vnd.oasis.opendocument.text": "odt",
			"vnd.oasis.opendocument.text-master": ["odm", "otm"],
			"vnd.oasis.opendocument.text-template": "ott",
			"vnd.oasis.opendocument.text-web": "oth",
			"vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
			"vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
			"vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
			"vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
			"vnd.openxmlformats-officedocument.presentationml.template": "potx",
			"vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
			"vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx",
			"vnd.smaf": "mmf",
			"vnd.stardivision.calc": "sdc",
			"vnd.stardivision.chart": "sds",
			"vnd.stardivision.draw": "sda",
			"vnd.stardivision.impress": "sdd",
			"vnd.stardivision.math": ["sdf", "smf"],
			"vnd.stardivision.writer": ["sdw", "vor"],
			"vnd.stardivision.writer-global": "sgl",
			"vnd.sun.xml.calc": "sxc",
			"vnd.sun.xml.calc.template": "stc",
			"vnd.sun.xml.draw": "sxd",
			"vnd.sun.xml.draw.template": "std",
			"vnd.sun.xml.impress": "sxi",
			"vnd.sun.xml.impress.template": "sti",
			"vnd.sun.xml.math": "sxm",
			"vnd.sun.xml.writer": "sxw",
			"vnd.sun.xml.writer.global": "sxg",
			"vnd.sun.xml.writer.template": "stw",
			"vnd.symbian.install": ["sis", "sisx"],
			"vnd.visio": [
				"vsd",
				"vst",
				"vss",
				"vsw",
				"vsdx",
				"vssx",
				"vstx",
				"vssm",
				"vstm"
			],
			"vnd.wap.wbxml": "wbxml",
			"vnd.wap.wmlc": "wmlc",
			"vnd.wap.wmlscriptc": "wmlsc",
			"vnd.wordperfect": "wpd",
			"vnd.wordperfect5.1": "wp5",
			"x-123": "wk",
			"x-7z-compressed": "7z",
			"x-abiword": "abw",
			"x-apple-diskimage": "dmg",
			"x-bcpio": "bcpio",
			"x-bittorrent": "torrent",
			"x-cbr": [
				"cbr",
				"cba",
				"cbt",
				"cb7"
			],
			"x-cbz": "cbz",
			"x-cdf": ["cdf", "cda"],
			"x-cdlink": "vcd",
			"x-chess-pgn": "pgn",
			"x-cpio": "cpio",
			"x-csh": "csh",
			"x-director": [
				"dir",
				"dxr",
				"cst",
				"cct",
				"cxt",
				"w3d",
				"fgd",
				"swa"
			],
			"x-dms": "dms",
			"x-doom": "wad",
			"x-dvi": "dvi",
			"x-httpd-eruby": "rhtml",
			"x-font": "pcf.Z",
			"x-freemind": "mm",
			"x-gnumeric": "gnumeric",
			"x-go-sgf": "sgf",
			"x-graphing-calculator": "gcf",
			"x-gtar": ["gtar", "taz"],
			"x-hdf": "hdf",
			"x-httpd-php": [
				"phtml",
				"pht",
				"php"
			],
			"x-httpd-php-source": "phps",
			"x-httpd-php3": "php3",
			"x-httpd-php3-preprocessed": "php3p",
			"x-httpd-php4": "php4",
			"x-httpd-php5": "php5",
			"x-ica": "ica",
			"x-info": "info",
			"x-internet-signup": ["ins", "isp"],
			"x-iphone": "iii",
			"x-iso9660-image": "iso",
			"x-java-jnlp-file": "jnlp",
			"x-jmol": "jmz",
			"x-killustrator": "kil",
			"x-latex": "latex",
			"x-lyx": "lyx",
			"x-lzx": "lzx",
			"x-maker": [
				"frm",
				"fb",
				"fbdoc"
			],
			"x-ms-wmd": "wmd",
			"x-msdos-program": [
				"com",
				"exe",
				"bat",
				"dll"
			],
			"x-netcdf": ["nc"],
			"x-ns-proxy-autoconfig": ["pac", "dat"],
			"x-nwc": "nwc",
			"x-object": "o",
			"x-oz-application": "oza",
			"x-pkcs7-certreqresp": "p7r",
			"x-python-code": ["pyc", "pyo"],
			"x-qgis": [
				"qgs",
				"shp",
				"shx"
			],
			"x-quicktimeplayer": "qtl",
			"x-redhat-package-manager": ["rpm", "rpa"],
			"x-ruby": "rb",
			"x-sh": "sh",
			"x-shar": "shar",
			"x-shockwave-flash": ["swf", "swfl"],
			"x-silverlight": "scr",
			"x-stuffit": "sit",
			"x-sv4cpio": "sv4cpio",
			"x-sv4crc": "sv4crc",
			"x-tar": "tar",
			"x-tex-gf": "gf",
			"x-tex-pk": "pk",
			"x-texinfo": ["texinfo", "texi"],
			"x-trash": [
				"~",
				"%",
				"bak",
				"old",
				"sik"
			],
			"x-ustar": "ustar",
			"x-wais-source": "src",
			"x-wingz": "wz",
			"x-x509-ca-cert": [
				"crt",
				"der",
				"cer"
			],
			"x-xcf": "xcf",
			"x-xfig": "fig",
			"x-xpinstall": "xpi",
			"applixware": "aw",
			"atomsvc+xml": "atomsvc",
			"ccxml+xml": "ccxml",
			"cdmi-capability": "cdmia",
			"cdmi-container": "cdmic",
			"cdmi-domain": "cdmid",
			"cdmi-object": "cdmio",
			"cdmi-queue": "cdmiq",
			"docbook+xml": "dbk",
			"dssc+der": "dssc",
			"dssc+xml": "xdssc",
			"emma+xml": "emma",
			"epub+zip": "epub",
			"exi": "exi",
			"font-tdpfr": "pfr",
			"gml+xml": "gml",
			"gpx+xml": "gpx",
			"gxf": "gxf",
			"hyperstudio": "stk",
			"inkml+xml": ["ink", "inkml"],
			"ipfix": "ipfix",
			"jsonml+json": "jsonml",
			"lost+xml": "lostxml",
			"mads+xml": "mads",
			"marc": "mrc",
			"marcxml+xml": "mrcx",
			"mathml+xml": ["mathml", "mml"],
			"mbox": "mbox",
			"mediaservercontrol+xml": "mscml",
			"metalink+xml": "metalink",
			"metalink4+xml": "meta4",
			"mets+xml": "mets",
			"mods+xml": "mods",
			"mp21": ["m21", "mp21"],
			"mp4": "mp4s",
			"oebps-package+xml": "opf",
			"omdoc+xml": "omdoc",
			"onenote": [
				"onetoc",
				"onetoc2",
				"onetmp",
				"onepkg"
			],
			"oxps": "oxps",
			"patch-ops-error+xml": "xer",
			"pgp-encrypted": "pgp",
			"pkcs10": "p10",
			"pkcs7-mime": ["p7m", "p7c"],
			"pkcs7-signature": "p7s",
			"pkcs8": "p8",
			"pkix-attr-cert": "ac",
			"pkix-crl": "crl",
			"pkix-pkipath": "pkipath",
			"pkixcmp": "pki",
			"pls+xml": "pls",
			"prs.cww": "cww",
			"pskc+xml": "pskcxml",
			"reginfo+xml": "rif",
			"relax-ng-compact-syntax": "rnc",
			"resource-lists+xml": "rl",
			"resource-lists-diff+xml": "rld",
			"rls-services+xml": "rs",
			"rpki-ghostbusters": "gbr",
			"rpki-manifest": "mft",
			"rpki-roa": "roa",
			"rsd+xml": "rsd",
			"sbml+xml": "sbml",
			"scvp-cv-request": "scq",
			"scvp-cv-response": "scs",
			"scvp-vp-request": "spq",
			"scvp-vp-response": "spp",
			"sdp": "sdp",
			"set-payment-initiation": "setpay",
			"set-registration-initiation": "setreg",
			"shf+xml": "shf",
			"sparql-query": "rq",
			"sparql-results+xml": "srx",
			"srgs": "gram",
			"srgs+xml": "grxml",
			"sru+xml": "sru",
			"ssdl+xml": "ssdl",
			"ssml+xml": "ssml",
			"tei+xml": ["tei", "teicorpus"],
			"thraud+xml": "tfi",
			"timestamped-data": "tsd",
			"vnd.3gpp.pic-bw-large": "plb",
			"vnd.3gpp.pic-bw-small": "psb",
			"vnd.3gpp.pic-bw-var": "pvb",
			"vnd.3gpp2.tcap": "tcap",
			"vnd.3m.post-it-notes": "pwn",
			"vnd.accpac.simply.aso": "aso",
			"vnd.accpac.simply.imp": "imp",
			"vnd.acucobol": "acu",
			"vnd.acucorp": ["atc", "acutc"],
			"vnd.adobe.air-application-installer-package+zip": "air",
			"vnd.adobe.formscentral.fcdt": "fcdt",
			"vnd.adobe.fxp": ["fxp", "fxpl"],
			"vnd.adobe.xdp+xml": "xdp",
			"vnd.adobe.xfdf": "xfdf",
			"vnd.ahead.space": "ahead",
			"vnd.airzip.filesecure.azf": "azf",
			"vnd.airzip.filesecure.azs": "azs",
			"vnd.amazon.ebook": "azw",
			"vnd.americandynamics.acc": "acc",
			"vnd.amiga.ami": "ami",
			"vnd.anser-web-certificate-issue-initiation": "cii",
			"vnd.anser-web-funds-transfer-initiation": "fti",
			"vnd.antix.game-component": "atx",
			"vnd.apple.installer+xml": "mpkg",
			"vnd.apple.mpegurl": "m3u8",
			"vnd.aristanetworks.swi": "swi",
			"vnd.astraea-software.iota": "iota",
			"vnd.audiograph": "aep",
			"vnd.blueice.multipass": "mpm",
			"vnd.bmi": "bmi",
			"vnd.businessobjects": "rep",
			"vnd.chemdraw+xml": "cdxml",
			"vnd.chipnuts.karaoke-mmd": "mmd",
			"vnd.claymore": "cla",
			"vnd.cloanto.rp9": "rp9",
			"vnd.clonk.c4group": [
				"c4g",
				"c4d",
				"c4f",
				"c4p",
				"c4u"
			],
			"vnd.cluetrust.cartomobile-config": "c11amc",
			"vnd.cluetrust.cartomobile-config-pkg": "c11amz",
			"vnd.commonspace": "csp",
			"vnd.contact.cmsg": "cdbcmsg",
			"vnd.cosmocaller": "cmc",
			"vnd.crick.clicker": "clkx",
			"vnd.crick.clicker.keyboard": "clkk",
			"vnd.crick.clicker.palette": "clkp",
			"vnd.crick.clicker.template": "clkt",
			"vnd.crick.clicker.wordbank": "clkw",
			"vnd.criticaltools.wbs+xml": "wbs",
			"vnd.ctc-posml": "pml",
			"vnd.cups-ppd": "ppd",
			"vnd.curl.car": "car",
			"vnd.curl.pcurl": "pcurl",
			"vnd.dart": "dart",
			"vnd.data-vision.rdz": "rdz",
			"vnd.dece.data": [
				"uvf",
				"uvvf",
				"uvd",
				"uvvd"
			],
			"vnd.dece.ttml+xml": ["uvt", "uvvt"],
			"vnd.dece.unspecified": ["uvx", "uvvx"],
			"vnd.dece.zip": ["uvz", "uvvz"],
			"vnd.denovo.fcselayout-link": "fe_launch",
			"vnd.dna": "dna",
			"vnd.dolby.mlp": "mlp",
			"vnd.dpgraph": "dpg",
			"vnd.dreamfactory": "dfac",
			"vnd.ds-keypoint": "kpxx",
			"vnd.dvb.ait": "ait",
			"vnd.dvb.service": "svc",
			"vnd.dynageo": "geo",
			"vnd.ecowin.chart": "mag",
			"vnd.enliven": "nml",
			"vnd.epson.esf": "esf",
			"vnd.epson.msf": "msf",
			"vnd.epson.quickanime": "qam",
			"vnd.epson.salt": "slt",
			"vnd.epson.ssf": "ssf",
			"vnd.eszigno3+xml": ["es3", "et3"],
			"vnd.ezpix-album": "ez2",
			"vnd.ezpix-package": "ez3",
			"vnd.fdf": "fdf",
			"vnd.fdsn.mseed": "mseed",
			"vnd.fdsn.seed": ["seed", "dataless"],
			"vnd.flographit": "gph",
			"vnd.fluxtime.clip": "ftc",
			"vnd.framemaker": [
				"fm",
				"frame",
				"maker",
				"book"
			],
			"vnd.frogans.fnc": "fnc",
			"vnd.frogans.ltf": "ltf",
			"vnd.fsc.weblaunch": "fsc",
			"vnd.fujitsu.oasys": "oas",
			"vnd.fujitsu.oasys2": "oa2",
			"vnd.fujitsu.oasys3": "oa3",
			"vnd.fujitsu.oasysgp": "fg5",
			"vnd.fujitsu.oasysprs": "bh2",
			"vnd.fujixerox.ddd": "ddd",
			"vnd.fujixerox.docuworks": "xdw",
			"vnd.fujixerox.docuworks.binder": "xbd",
			"vnd.fuzzysheet": "fzs",
			"vnd.genomatix.tuxedo": "txd",
			"vnd.geogebra.file": "ggb",
			"vnd.geogebra.tool": "ggt",
			"vnd.geometry-explorer": ["gex", "gre"],
			"vnd.geonext": "gxt",
			"vnd.geoplan": "g2w",
			"vnd.geospace": "g3w",
			"vnd.gmx": "gmx",
			"vnd.grafeq": ["gqf", "gqs"],
			"vnd.groove-account": "gac",
			"vnd.groove-help": "ghf",
			"vnd.groove-identity-message": "gim",
			"vnd.groove-injector": "grv",
			"vnd.groove-tool-message": "gtm",
			"vnd.groove-tool-template": "tpl",
			"vnd.groove-vcard": "vcg",
			"vnd.hal+xml": "hal",
			"vnd.handheld-entertainment+xml": "zmm",
			"vnd.hbci": "hbci",
			"vnd.hhe.lesson-player": "les",
			"vnd.hp-hpgl": "hpgl",
			"vnd.hp-hpid": "hpid",
			"vnd.hp-hps": "hps",
			"vnd.hp-jlyt": "jlt",
			"vnd.hp-pcl": "pcl",
			"vnd.hp-pclxl": "pclxl",
			"vnd.hydrostatix.sof-data": "sfd-hdstx",
			"vnd.ibm.minipay": "mpy",
			"vnd.ibm.modcap": [
				"afp",
				"listafp",
				"list3820"
			],
			"vnd.ibm.rights-management": "irm",
			"vnd.ibm.secure-container": "sc",
			"vnd.iccprofile": ["icc", "icm"],
			"vnd.igloader": "igl",
			"vnd.immervision-ivp": "ivp",
			"vnd.immervision-ivu": "ivu",
			"vnd.insors.igm": "igm",
			"vnd.intercon.formnet": ["xpw", "xpx"],
			"vnd.intergeo": "i2g",
			"vnd.intu.qbo": "qbo",
			"vnd.intu.qfx": "qfx",
			"vnd.ipunplugged.rcprofile": "rcprofile",
			"vnd.irepository.package+xml": "irp",
			"vnd.is-xpr": "xpr",
			"vnd.isac.fcs": "fcs",
			"vnd.jam": "jam",
			"vnd.jcp.javame.midlet-rms": "rms",
			"vnd.jisp": "jisp",
			"vnd.joost.joda-archive": "joda",
			"vnd.kahootz": ["ktz", "ktr"],
			"vnd.kde.karbon": "karbon",
			"vnd.kde.kchart": "chrt",
			"vnd.kde.kformula": "kfo",
			"vnd.kde.kivio": "flw",
			"vnd.kde.kontour": "kon",
			"vnd.kde.kpresenter": ["kpr", "kpt"],
			"vnd.kde.kspread": "ksp",
			"vnd.kde.kword": ["kwd", "kwt"],
			"vnd.kenameaapp": "htke",
			"vnd.kidspiration": "kia",
			"vnd.kinar": ["kne", "knp"],
			"vnd.koan": [
				"skp",
				"skd",
				"skt",
				"skm"
			],
			"vnd.kodak-descriptor": "sse",
			"vnd.las.las+xml": "lasxml",
			"vnd.llamagraphics.life-balance.desktop": "lbd",
			"vnd.llamagraphics.life-balance.exchange+xml": "lbe",
			"vnd.lotus-1-2-3": "123",
			"vnd.lotus-approach": "apr",
			"vnd.lotus-freelance": "pre",
			"vnd.lotus-notes": "nsf",
			"vnd.lotus-organizer": "org",
			"vnd.lotus-screencam": "scm",
			"vnd.lotus-wordpro": "lwp",
			"vnd.macports.portpkg": "portpkg",
			"vnd.mcd": "mcd",
			"vnd.medcalcdata": "mc1",
			"vnd.mediastation.cdkey": "cdkey",
			"vnd.mfer": "mwf",
			"vnd.mfmp": "mfm",
			"vnd.micrografx.flo": "flo",
			"vnd.micrografx.igx": "igx",
			"vnd.mif": "mif",
			"vnd.mobius.daf": "daf",
			"vnd.mobius.dis": "dis",
			"vnd.mobius.mbk": "mbk",
			"vnd.mobius.mqy": "mqy",
			"vnd.mobius.msl": "msl",
			"vnd.mobius.plc": "plc",
			"vnd.mobius.txf": "txf",
			"vnd.mophun.application": "mpn",
			"vnd.mophun.certificate": "mpc",
			"vnd.ms-artgalry": "cil",
			"vnd.ms-cab-compressed": "cab",
			"vnd.ms-excel.addin.macroenabled.12": "xlam",
			"vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
			"vnd.ms-excel.sheet.macroenabled.12": "xlsm",
			"vnd.ms-excel.template.macroenabled.12": "xltm",
			"vnd.ms-fontobject": "eot",
			"vnd.ms-htmlhelp": "chm",
			"vnd.ms-ims": "ims",
			"vnd.ms-lrm": "lrm",
			"vnd.ms-officetheme": "thmx",
			"vnd.ms-powerpoint.addin.macroenabled.12": "ppam",
			"vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
			"vnd.ms-powerpoint.slide.macroenabled.12": "sldm",
			"vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm",
			"vnd.ms-powerpoint.template.macroenabled.12": "potm",
			"vnd.ms-project": ["mpp", "mpt"],
			"vnd.ms-word.document.macroenabled.12": "docm",
			"vnd.ms-word.template.macroenabled.12": "dotm",
			"vnd.ms-works": [
				"wps",
				"wks",
				"wcm",
				"wdb"
			],
			"vnd.ms-wpl": "wpl",
			"vnd.ms-xpsdocument": "xps",
			"vnd.mseq": "mseq",
			"vnd.musician": "mus",
			"vnd.muvee.style": "msty",
			"vnd.mynfc": "taglet",
			"vnd.neurolanguage.nlu": "nlu",
			"vnd.nitf": ["ntf", "nitf"],
			"vnd.noblenet-directory": "nnd",
			"vnd.noblenet-sealer": "nns",
			"vnd.noblenet-web": "nnw",
			"vnd.nokia.n-gage.data": "ngdat",
			"vnd.nokia.n-gage.symbian.install": "n-gage",
			"vnd.nokia.radio-preset": "rpst",
			"vnd.nokia.radio-presets": "rpss",
			"vnd.novadigm.edm": "edm",
			"vnd.novadigm.edx": "edx",
			"vnd.novadigm.ext": "ext",
			"vnd.oasis.opendocument.chart-template": "otc",
			"vnd.oasis.opendocument.formula-template": "odft",
			"vnd.oasis.opendocument.image-template": "oti",
			"vnd.olpc-sugar": "xo",
			"vnd.oma.dd2+xml": "dd2",
			"vnd.openofficeorg.extension": "oxt",
			"vnd.openxmlformats-officedocument.presentationml.slide": "sldx",
			"vnd.osgeo.mapguide.package": "mgp",
			"vnd.osgi.dp": "dp",
			"vnd.osgi.subsystem": "esa",
			"vnd.palm": [
				"pdb",
				"pqa",
				"oprc"
			],
			"vnd.pawaafile": "paw",
			"vnd.pg.format": "str",
			"vnd.pg.osasli": "ei6",
			"vnd.picsel": "efif",
			"vnd.pmi.widget": "wg",
			"vnd.pocketlearn": "plf",
			"vnd.powerbuilder6": "pbd",
			"vnd.previewsystems.box": "box",
			"vnd.proteus.magazine": "mgz",
			"vnd.publishare-delta-tree": "qps",
			"vnd.pvi.ptid1": "ptid",
			"vnd.quark.quarkxpress": [
				"qxd",
				"qxt",
				"qwd",
				"qwt",
				"qxl",
				"qxb"
			],
			"vnd.realvnc.bed": "bed",
			"vnd.recordare.musicxml": "mxl",
			"vnd.recordare.musicxml+xml": "musicxml",
			"vnd.rig.cryptonote": "cryptonote",
			"vnd.rn-realmedia": "rm",
			"vnd.rn-realmedia-vbr": "rmvb",
			"vnd.route66.link66+xml": "link66",
			"vnd.sailingtracker.track": "st",
			"vnd.seemail": "see",
			"vnd.sema": "sema",
			"vnd.semd": "semd",
			"vnd.semf": "semf",
			"vnd.shana.informed.formdata": "ifm",
			"vnd.shana.informed.formtemplate": "itp",
			"vnd.shana.informed.interchange": "iif",
			"vnd.shana.informed.package": "ipk",
			"vnd.simtech-mindmapper": ["twd", "twds"],
			"vnd.smart.teacher": "teacher",
			"vnd.solent.sdkm+xml": ["sdkm", "sdkd"],
			"vnd.spotfire.dxp": "dxp",
			"vnd.spotfire.sfs": "sfs",
			"vnd.stepmania.package": "smzip",
			"vnd.stepmania.stepchart": "sm",
			"vnd.sus-calendar": ["sus", "susp"],
			"vnd.svd": "svd",
			"vnd.syncml+xml": "xsm",
			"vnd.syncml.dm+wbxml": "bdm",
			"vnd.syncml.dm+xml": "xdm",
			"vnd.tao.intent-module-archive": "tao",
			"vnd.tcpdump.pcap": [
				"pcap",
				"cap",
				"dmp"
			],
			"vnd.tmobile-livetv": "tmo",
			"vnd.trid.tpt": "tpt",
			"vnd.triscape.mxs": "mxs",
			"vnd.trueapp": "tra",
			"vnd.ufdl": ["ufd", "ufdl"],
			"vnd.uiq.theme": "utz",
			"vnd.umajin": "umj",
			"vnd.unity": "unityweb",
			"vnd.uoml+xml": "uoml",
			"vnd.vcx": "vcx",
			"vnd.visionary": "vis",
			"vnd.vsf": "vsf",
			"vnd.webturbo": "wtb",
			"vnd.wolfram.player": "nbp",
			"vnd.wqd": "wqd",
			"vnd.wt.stf": "stf",
			"vnd.xara": "xar",
			"vnd.xfdl": "xfdl",
			"vnd.yamaha.hv-dic": "hvd",
			"vnd.yamaha.hv-script": "hvs",
			"vnd.yamaha.hv-voice": "hvp",
			"vnd.yamaha.openscoreformat": "osf",
			"vnd.yamaha.openscoreformat.osfpvg+xml": "osfpvg",
			"vnd.yamaha.smaf-audio": "saf",
			"vnd.yamaha.smaf-phrase": "spf",
			"vnd.yellowriver-custom-menu": "cmp",
			"vnd.zul": ["zir", "zirz"],
			"vnd.zzazz.deck+xml": "zaz",
			"voicexml+xml": "vxml",
			"widget": "wgt",
			"winhlp": "hlp",
			"wsdl+xml": "wsdl",
			"wspolicy+xml": "wspolicy",
			"x-ace-compressed": "ace",
			"x-authorware-bin": [
				"aab",
				"x32",
				"u32",
				"vox"
			],
			"x-authorware-map": "aam",
			"x-authorware-seg": "aas",
			"x-blorb": ["blb", "blorb"],
			"x-bzip": "bz",
			"x-bzip2": ["bz2", "boz"],
			"x-cfs-compressed": "cfs",
			"x-chat": "chat",
			"x-conference": "nsc",
			"x-dgc-compressed": "dgc",
			"x-dtbncx+xml": "ncx",
			"x-dtbook+xml": "dtb",
			"x-dtbresource+xml": "res",
			"x-eva": "eva",
			"x-font-bdf": "bdf",
			"x-font-ghostscript": "gsf",
			"x-font-linux-psf": "psf",
			"x-font-pcf": "pcf",
			"x-font-snf": "snf",
			"x-font-ttf": ["ttf", "ttc"],
			"x-font-type1": [
				"pfa",
				"pfb",
				"pfm",
				"afm"
			],
			"x-freearc": "arc",
			"x-gca-compressed": "gca",
			"x-glulx": "ulx",
			"x-gramps-xml": "gramps",
			"x-install-instructions": "install",
			"x-lzh-compressed": ["lzh", "lha"],
			"x-mie": "mie",
			"x-mobipocket-ebook": ["prc", "mobi"],
			"x-ms-application": "application",
			"x-ms-shortcut": "lnk",
			"x-ms-xbap": "xbap",
			"x-msbinder": "obd",
			"x-mscardfile": "crd",
			"x-msclip": "clp",
			"application/x-ms-installer": "msi",
			"x-msmediaview": [
				"mvb",
				"m13",
				"m14"
			],
			"x-msmetafile": [
				"wmf",
				"wmz",
				"emf",
				"emz"
			],
			"x-msmoney": "mny",
			"x-mspublisher": "pub",
			"x-msschedule": "scd",
			"x-msterminal": "trm",
			"x-mswrite": "wri",
			"x-nzb": "nzb",
			"x-pkcs12": ["p12", "pfx"],
			"x-pkcs7-certificates": ["p7b", "spc"],
			"x-research-info-systems": "ris",
			"x-silverlight-app": "xap",
			"x-sql": "sql",
			"x-stuffitx": "sitx",
			"x-subrip": "srt",
			"x-t3vm-image": "t3",
			"x-tex-tfm": "tfm",
			"x-tgif": "obj",
			"x-xliff+xml": "xlf",
			"x-xz": "xz",
			"x-zmachine": [
				"z1",
				"z2",
				"z3",
				"z4",
				"z5",
				"z6",
				"z7",
				"z8"
			],
			"xaml+xml": "xaml",
			"xcap-diff+xml": "xdf",
			"xenc+xml": "xenc",
			"xml-dtd": "dtd",
			"xop+xml": "xop",
			"xproc+xml": "xpl",
			"xslt+xml": "xslt",
			"xv+xml": [
				"mxml",
				"xhvml",
				"xvml",
				"xvm"
			],
			"yang": "yang",
			"yin+xml": "yin",
			"envoy": "evy",
			"fractals": "fif",
			"internet-property-stream": "acx",
			"olescript": "axs",
			"vnd.ms-outlook": "msg",
			"vnd.ms-pkicertstore": "sst",
			"x-compress": "z",
			"x-perfmon": [
				"pma",
				"pmc",
				"pmr",
				"pmw"
			],
			"ynd.ms-pkipko": "pko",
			"gzip": ["gz", "tgz"],
			"smil+xml": ["smi", "smil"],
			"vnd.debian.binary-package": ["deb", "udeb"],
			"vnd.hzn-3d-crossword": "x3d",
			"vnd.sqlite3": [
				"db",
				"sqlite",
				"sqlite3",
				"db-wal",
				"sqlite-wal",
				"db-shm",
				"sqlite-shm"
			],
			"vnd.wap.sic": "sic",
			"vnd.wap.slc": "slc",
			"x-krita": ["kra", "krz"],
			"x-perl": ["pm", "pl"],
			"yaml": ["yaml", "yml"]
		},
		"audio": {
			"amr": "amr",
			"amr-wb": "awb",
			"annodex": "axa",
			"basic": ["au", "snd"],
			"flac": "flac",
			"midi": [
				"mid",
				"midi",
				"kar",
				"rmi"
			],
			"mpeg": [
				"mpga",
				"mpega",
				"mp3",
				"m4a",
				"mp2a",
				"m2a",
				"m3a"
			],
			"mpegurl": "m3u",
			"ogg": [
				"oga",
				"ogg",
				"spx"
			],
			"prs.sid": "sid",
			"x-aiff": "aifc",
			"x-gsm": "gsm",
			"x-ms-wma": "wma",
			"x-ms-wax": "wax",
			"x-pn-realaudio": "ram",
			"x-realaudio": "ra",
			"x-sd2": "sd2",
			"adpcm": "adp",
			"mp4": "mp4a",
			"s3m": "s3m",
			"silk": "sil",
			"vnd.dece.audio": ["uva", "uvva"],
			"vnd.digital-winds": "eol",
			"vnd.dra": "dra",
			"vnd.dts": "dts",
			"vnd.dts.hd": "dtshd",
			"vnd.lucent.voice": "lvp",
			"vnd.ms-playready.media.pya": "pya",
			"vnd.nuera.ecelp4800": "ecelp4800",
			"vnd.nuera.ecelp7470": "ecelp7470",
			"vnd.nuera.ecelp9600": "ecelp9600",
			"vnd.rip": "rip",
			"webm": "weba",
			"x-caf": "caf",
			"x-matroska": "mka",
			"x-pn-realaudio-plugin": "rmp",
			"xm": "xm",
			"aac": "aac",
			"aiff": [
				"aiff",
				"aif",
				"aff"
			],
			"opus": "opus",
			"wav": "wav"
		},
		"chemical": {
			"x-alchemy": "alc",
			"x-cache": ["cac", "cache"],
			"x-cache-csf": "csf",
			"x-cactvs-binary": [
				"cbin",
				"cascii",
				"ctab"
			],
			"x-cdx": "cdx",
			"x-chem3d": "c3d",
			"x-cif": "cif",
			"x-cmdf": "cmdf",
			"x-cml": "cml",
			"x-compass": "cpa",
			"x-crossfire": "bsd",
			"x-csml": ["csml", "csm"],
			"x-ctx": "ctx",
			"x-cxf": ["cxf", "cef"],
			"x-embl-dl-nucleotide": ["emb", "embl"],
			"x-gamess-input": [
				"inp",
				"gam",
				"gamin"
			],
			"x-gaussian-checkpoint": ["fch", "fchk"],
			"x-gaussian-cube": "cub",
			"x-gaussian-input": [
				"gau",
				"gjc",
				"gjf"
			],
			"x-gaussian-log": "gal",
			"x-gcg8-sequence": "gcg",
			"x-genbank": "gen",
			"x-hin": "hin",
			"x-isostar": ["istr", "ist"],
			"x-jcamp-dx": ["jdx", "dx"],
			"x-kinemage": "kin",
			"x-macmolecule": "mcm",
			"x-macromodel-input": "mmod",
			"x-mdl-molfile": "mol",
			"x-mdl-rdfile": "rd",
			"x-mdl-rxnfile": "rxn",
			"x-mdl-sdfile": "sd",
			"x-mdl-tgf": "tgf",
			"x-mmcif": "mcif",
			"x-mol2": "mol2",
			"x-molconn-Z": "b",
			"x-mopac-graph": "gpt",
			"x-mopac-input": [
				"mop",
				"mopcrt",
				"zmt"
			],
			"x-mopac-out": "moo",
			"x-ncbi-asn1": "asn",
			"x-ncbi-asn1-ascii": ["prt", "ent"],
			"x-ncbi-asn1-binary": "val",
			"x-rosdal": "ros",
			"x-swissprot": "sw",
			"x-vamas-iso14976": "vms",
			"x-vmd": "vmd",
			"x-xtel": "xtel",
			"x-xyz": "xyz"
		},
		"font": {
			"otf": "otf",
			"woff": "woff",
			"woff2": "woff2"
		},
		"image": {
			"gif": "gif",
			"ief": "ief",
			"jpeg": [
				"jpeg",
				"jpg",
				"jpe",
				"jfif",
				"jfif-tbnl",
				"jif"
			],
			"pcx": "pcx",
			"png": "png",
			"svg+xml": ["svg", "svgz"],
			"tiff": ["tiff", "tif"],
			"vnd.djvu": ["djvu", "djv"],
			"vnd.wap.wbmp": "wbmp",
			"x-canon-cr2": "cr2",
			"x-canon-crw": "crw",
			"x-cmu-raster": "ras",
			"x-coreldraw": "cdr",
			"x-coreldrawpattern": "pat",
			"x-coreldrawtemplate": "cdt",
			"x-corelphotopaint": "cpt",
			"x-epson-erf": "erf",
			"x-icon": "ico",
			"x-jg": "art",
			"x-jng": "jng",
			"x-nikon-nef": "nef",
			"x-olympus-orf": "orf",
			"x-portable-anymap": "pnm",
			"x-portable-bitmap": "pbm",
			"x-portable-graymap": "pgm",
			"x-portable-pixmap": "ppm",
			"x-rgb": "rgb",
			"x-xbitmap": "xbm",
			"x-xpixmap": "xpm",
			"x-xwindowdump": "xwd",
			"bmp": "bmp",
			"cgm": "cgm",
			"g3fax": "g3",
			"ktx": "ktx",
			"prs.btif": "btif",
			"sgi": "sgi",
			"vnd.dece.graphic": [
				"uvi",
				"uvvi",
				"uvg",
				"uvvg"
			],
			"vnd.dwg": "dwg",
			"vnd.dxf": "dxf",
			"vnd.fastbidsheet": "fbs",
			"vnd.fpx": "fpx",
			"vnd.fst": "fst",
			"vnd.fujixerox.edmics-mmr": "mmr",
			"vnd.fujixerox.edmics-rlc": "rlc",
			"vnd.ms-modi": "mdi",
			"vnd.ms-photo": "wdp",
			"vnd.net-fpx": "npx",
			"vnd.xiff": "xif",
			"webp": "webp",
			"x-3ds": "3ds",
			"x-cmx": "cmx",
			"x-freehand": [
				"fh",
				"fhc",
				"fh4",
				"fh5",
				"fh7"
			],
			"x-pict": ["pic", "pct"],
			"x-tga": "tga",
			"cis-cod": "cod",
			"avif": "avifs",
			"heic": ["heif", "heic"],
			"pjpeg": ["pjpg"],
			"vnd.adobe.photoshop": "psd",
			"x-adobe-dng": "dng",
			"x-fuji-raf": "raf",
			"x-icns": "icns",
			"x-kodak-dcr": "dcr",
			"x-kodak-k25": "k25",
			"x-kodak-kdc": "kdc",
			"x-minolta-mrw": "mrw",
			"x-panasonic-raw": [
				"raw",
				"rw2",
				"rwl"
			],
			"x-pentax-pef": ["pef", "ptx"],
			"x-sigma-x3f": "x3f",
			"x-sony-arw": "arw",
			"x-sony-sr2": "sr2",
			"x-sony-srf": "srf"
		},
		"message": { "rfc822": [
			"eml",
			"mime",
			"mht",
			"mhtml",
			"nws"
		] },
		"model": {
			"iges": ["igs", "iges"],
			"mesh": [
				"msh",
				"mesh",
				"silo"
			],
			"vrml": ["wrl", "vrml"],
			"x3d+vrml": ["x3dv", "x3dvz"],
			"x3d+xml": "x3dz",
			"x3d+binary": ["x3db", "x3dbz"],
			"vnd.collada+xml": "dae",
			"vnd.dwf": "dwf",
			"vnd.gdl": "gdl",
			"vnd.gtw": "gtw",
			"vnd.mts": "mts",
			"vnd.usdz+zip": "usdz",
			"vnd.vtu": "vtu"
		},
		"text": {
			"cache-manifest": ["manifest", "appcache"],
			"calendar": [
				"ics",
				"icz",
				"ifb"
			],
			"css": "css",
			"csv": "csv",
			"h323": "323",
			"html": [
				"html",
				"htm",
				"shtml",
				"stm"
			],
			"iuls": "uls",
			"plain": [
				"txt",
				"text",
				"brf",
				"conf",
				"def",
				"list",
				"log",
				"in",
				"bas",
				"diff",
				"ksh"
			],
			"richtext": "rtx",
			"scriptlet": ["sct", "wsc"],
			"texmacs": "tm",
			"tab-separated-values": "tsv",
			"vnd.sun.j2me.app-descriptor": "jad",
			"vnd.wap.wml": "wml",
			"vnd.wap.wmlscript": "wmls",
			"x-bibtex": "bib",
			"x-boo": "boo",
			"x-c++hdr": [
				"h++",
				"hpp",
				"hxx",
				"hh"
			],
			"x-c++src": [
				"c++",
				"cpp",
				"cxx",
				"cc"
			],
			"x-component": "htc",
			"x-dsrc": "d",
			"x-diff": "patch",
			"x-haskell": "hs",
			"x-java": "java",
			"x-literate-haskell": "lhs",
			"x-moc": "moc",
			"x-pascal": [
				"p",
				"pas",
				"pp",
				"inc"
			],
			"x-pcs-gcd": "gcd",
			"x-python": "py",
			"x-scala": "scala",
			"x-setext": "etx",
			"x-tcl": ["tcl", "tk"],
			"x-tex": [
				"tex",
				"ltx",
				"sty",
				"cls"
			],
			"x-vcalendar": "vcs",
			"x-vcard": "vcf",
			"n3": "n3",
			"prs.lines.tag": "dsc",
			"sgml": ["sgml", "sgm"],
			"troff": [
				"t",
				"tr",
				"roff",
				"man",
				"me",
				"ms"
			],
			"turtle": "ttl",
			"uri-list": [
				"uri",
				"uris",
				"urls"
			],
			"vcard": "vcard",
			"vnd.curl": "curl",
			"vnd.curl.dcurl": "dcurl",
			"vnd.curl.scurl": "scurl",
			"vnd.curl.mcurl": "mcurl",
			"vnd.dvb.subtitle": "sub",
			"vnd.fly": "fly",
			"vnd.fmi.flexstor": "flx",
			"vnd.graphviz": "gv",
			"vnd.in3d.3dml": "3dml",
			"vnd.in3d.spot": "spot",
			"x-asm": ["s", "asm"],
			"x-c": [
				"c",
				"h",
				"dic"
			],
			"x-fortran": [
				"f",
				"for",
				"f77",
				"f90"
			],
			"x-opml": "opml",
			"x-nfo": "nfo",
			"x-sfv": "sfv",
			"x-uuencode": "uu",
			"webviewhtml": "htt",
			"javascript": "js",
			"json": "json",
			"markdown": [
				"md",
				"markdown",
				"mdown",
				"markdn"
			],
			"vnd.wap.si": "si",
			"vnd.wap.sl": "sl"
		},
		"video": {
			"avif": "avif",
			"3gpp": "3gp",
			"annodex": "axv",
			"dl": "dl",
			"dv": ["dif", "dv"],
			"fli": "fli",
			"gl": "gl",
			"mpeg": [
				"mpeg",
				"mpg",
				"mpe",
				"m1v",
				"m2v",
				"mp2",
				"mpa",
				"mpv2"
			],
			"mp4": [
				"mp4",
				"mp4v",
				"mpg4"
			],
			"quicktime": ["qt", "mov"],
			"ogg": "ogv",
			"vnd.mpegurl": ["mxu", "m4u"],
			"x-flv": "flv",
			"x-la-asf": ["lsf", "lsx"],
			"x-mng": "mng",
			"x-ms-asf": [
				"asf",
				"asx",
				"asr"
			],
			"x-ms-wm": "wm",
			"x-ms-wmv": "wmv",
			"x-ms-wmx": "wmx",
			"x-ms-wvx": "wvx",
			"x-msvideo": "avi",
			"x-sgi-movie": "movie",
			"x-matroska": [
				"mpv",
				"mkv",
				"mk3d",
				"mks"
			],
			"3gpp2": "3g2",
			"h261": "h261",
			"h263": "h263",
			"h264": "h264",
			"jpeg": "jpgv",
			"jpm": ["jpm", "jpgm"],
			"mj2": ["mj2", "mjp2"],
			"vnd.dece.hd": ["uvh", "uvvh"],
			"vnd.dece.mobile": ["uvm", "uvvm"],
			"vnd.dece.pd": ["uvp", "uvvp"],
			"vnd.dece.sd": ["uvs", "uvvs"],
			"vnd.dece.video": ["uvv", "uvvv"],
			"vnd.dvb.file": "dvb",
			"vnd.fvt": "fvt",
			"vnd.ms-playready.media.pyv": "pyv",
			"vnd.uvvu.mp4": ["uvu", "uvvu"],
			"vnd.vivo": "viv",
			"webm": "webm",
			"x-f4v": "f4v",
			"x-m4v": "m4v",
			"x-ms-vob": "vob",
			"x-smv": "smv",
			"mp2t": "ts"
		},
		"x-conference": { "x-cooltalk": "ice" },
		"x-world": { "x-vrml": [
			"vrm",
			"flr",
			"wrz",
			"xaf",
			"xof"
		] }
	};
	const mimeTypes = (() => {
		const mimeTypes$1 = {};
		for (const type of Object.keys(table$1)) for (const subtype of Object.keys(table$1[type])) {
			const value = table$1[type][subtype];
			if (typeof value == "string") mimeTypes$1[value] = type + "/" + subtype;
			else for (let indexMimeType = 0; indexMimeType < value.length; indexMimeType++) mimeTypes$1[value[indexMimeType]] = type + "/" + subtype;
		}
		return mimeTypes$1;
	})();

//#endregion
//#region ../../node_modules/.pnpm/@zip.js+zip.js@2.8.7/node_modules/@zip.js/zip.js/lib/zip-fs-wasm.js
	t(configure);

//#endregion
//#region ../../node_modules/.pnpm/filename-reserved-regex@3.0.0/node_modules/filename-reserved-regex/index.js
	function filenameReservedRegex() {
		return /[<>:"/\\|?*\u0000-\u001F]/g;
	}
	function windowsReservedNameRegex() {
		return /^(con|prn|aux|nul|com\d|lpt\d)$/i;
	}

//#endregion
//#region ../../node_modules/.pnpm/filenamify@6.0.0/node_modules/filenamify/filenamify.js
	const MAX_FILENAME_LENGTH = 100;
	const reRelativePath = /^\.+(\\|\/)|^\.+$/;
	const reTrailingPeriods = /\.+$/;
	function filenamify(string, options = {}) {
		const reControlChars = /[\u0000-\u001F\u0080-\u009F]/g;
		const reRepeatedReservedCharacters = /([<>:"/\\|?*\u0000-\u001F]){2,}/g;
		if (typeof string !== "string") throw new TypeError("Expected a string");
		const replacement = options.replacement === void 0 ? "!" : options.replacement;
		if (filenameReservedRegex().test(replacement) && reControlChars.test(replacement)) throw new Error("Replacement string cannot contain reserved filename characters");
		if (replacement.length > 0) string = string.replace(reRepeatedReservedCharacters, "$1");
		string = string.normalize("NFD");
		string = string.replace(reRelativePath, replacement);
		string = string.replace(filenameReservedRegex(), replacement);
		string = string.replace(reControlChars, replacement);
		string = string.replace(reTrailingPeriods, "");
		if (replacement.length > 0) {
			if (!(string[0] === ".") && string[0] === ".") string = replacement + string;
			if (string[string.length - 1] === ".") string += replacement;
		}
		string = windowsReservedNameRegex().test(string) ? string + replacement : string;
		const allowedLength = typeof options.maxLength === "number" ? options.maxLength : MAX_FILENAME_LENGTH;
		if (string.length > allowedLength) {
			const extensionIndex = string.lastIndexOf(".");
			if (extensionIndex === -1) string = string.slice(0, allowedLength);
			else {
				const filename = string.slice(0, extensionIndex);
				const extension = string.slice(extensionIndex);
				string = filename.slice(0, Math.max(1, allowedLength - extension.length)) + extension;
			}
		}
		return string;
	}

//#endregion
//#region src/lib/utils.ts
/**
	* Normalizes a filename by:
	* 1. Removing invisible Unicode characters (like zero-width joiners) which can bloat the byte length
	* 2. Using filenamify to strip illegal OS characters
	* 3. Truncating the UTF-8 byte length to a safe limit (e.g. 200 bytes for ext4/windows limits), preserving extension
	*/
	function safeNormalizeFileName(filename, maxBytes = 200) {
		let cleaned = filename.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, "");
		cleaned = filenamify(cleaned, { maxLength: 255 });
		const encoder = new TextEncoder();
		const bytes = encoder.encode(cleaned);
		if (bytes.length <= maxBytes) return cleaned;
		const lastDotIdx = cleaned.lastIndexOf(".");
		let ext = "";
		let name = cleaned;
		if (lastDotIdx > 0) {
			ext = cleaned.substring(lastDotIdx);
			name = cleaned.substring(0, lastDotIdx);
		}
		const extBytes = encoder.encode(ext).length;
		if (extBytes >= maxBytes) return new TextDecoder().decode(bytes.slice(0, maxBytes)).replace(/\uFFFD$/, "");
		const maxNameBytes = maxBytes - extBytes;
		const truncatedNameBytes = encoder.encode(name).slice(0, maxNameBytes);
		let truncatedName = new TextDecoder().decode(truncatedNameBytes);
		truncatedName = truncatedName.replace(/\uFFFD$/, "");
		return truncatedName + ext;
	}

//#endregion
//#region ../../node_modules/.pnpm/radash@12.1.1/node_modules/radash/dist/esm/array.mjs
	const cluster = (list2, size = 2) => {
		const clusterCount = Math.ceil(list2.length / size);
		return new Array(clusterCount).fill(null).map((_c, i) => {
			return list2.slice(i * size, i * size + size);
		});
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
//#region src/common/legacy.ts
	const legacyFileSave = (blob, options = {}) => {
		const { fileName = "Untitled" } = options;
		const a$1 = document.createElement("a");
		a$1.download = fileName;
		a$1.href = URL.createObjectURL(blob);
		a$1.addEventListener("click", (event) => {
			event.stopPropagation();
			setTimeout(() => {
				URL.revokeObjectURL(a$1.href);
			}, 30 * Second);
		}, true);
		a$1.click();
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
	const deserializer = ($, _) => {
		const as = (out, index) => {
			$.set(index, out);
			return out;
		};
		const unpair = (index) => {
			if ($.has(index)) return $.get(index);
			const [type, value] = _[index];
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
	const serializer = (strict, json, $, _) => {
		const as = (out, value) => {
			const index = _.push(out) - 1;
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
		const _ = [];
		return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
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
	function defaultFootnoteBackContent(_, rereferenceIndex) {
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
		transform(_, property) {
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
		transform(_, property) {
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
		transform(_, property) {
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
		return state.settings.bogusComments ? "<?" + stringifyEntities(node$1.value, Object.assign({}, state.settings.characterReferences, { subset: bogusCommentEntitySubset })) + ">" : "<!--" + node$1.value.replace(htmlCommentRegex, encode) + "-->";
		/**
		* @param {string} $0
		*/
		function encode($0) {
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
		p,
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
	function headOrColgroupOrCaption(_, index, parent) {
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
	function html$2(_, index, parent) {
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
	function body$1(_, index, parent) {
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
	function p(_, index, parent) {
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
	function li(_, index, parent) {
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
	function dt(_, index, parent) {
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
	function dd(_, index, parent) {
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
	function rubyElement(_, index, parent) {
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
	function optgroup(_, index, parent) {
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
	function option(_, index, parent) {
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
	function thead(_, index, parent) {
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
	function tbody$1(_, index, parent) {
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
	function tfoot(_, index, parent) {
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
	function tr(_, index, parent) {
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
	function cells(_, index, parent) {
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
	function text(node$1, _, parent, state) {
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
//#region ../../node_modules/.pnpm/uuid@13.0.0/node_modules/uuid/dist/stringify.js
	const byteToHex = [];
	for (let i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).slice(1));
	function unsafeStringify(arr, offset = 0) {
		return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
	}

//#endregion
//#region ../../node_modules/.pnpm/uuid@13.0.0/node_modules/uuid/dist/rng.js
	let getRandomValues;
	const rnds8 = new Uint8Array(16);
	function rng() {
		if (!getRandomValues) {
			if (typeof crypto === "undefined" || !crypto.getRandomValues) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
			getRandomValues = crypto.getRandomValues.bind(crypto);
		}
		return getRandomValues(rnds8);
	}

//#endregion
//#region ../../node_modules/.pnpm/uuid@13.0.0/node_modules/uuid/dist/native.js
	const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
	var native_default = { randomUUID };

//#endregion
//#region ../../node_modules/.pnpm/uuid@13.0.0/node_modules/uuid/dist/v4.js
	function _v4(options, buf, offset) {
		options = options || {};
		const rnds = options.random ?? options.rng?.() ?? rng();
		if (rnds.length < 16) throw new Error("Random bytes length must be >= 16");
		rnds[6] = rnds[6] & 15 | 64;
		rnds[8] = rnds[8] & 63 | 128;
		if (buf) {
			offset = offset || 0;
			if (offset < 0 || offset + 16 > buf.length) throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
			for (let i = 0; i < 16; ++i) buf[offset + i] = rnds[i];
			return buf;
		}
		return unsafeStringify(rnds);
	}
	function v4(options, buf, offset) {
		if (native_default.randomUUID && !buf && !options) return native_default.randomUUID();
		return _v4(options, buf, offset);
	}
	var v4_default = v4;

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
	const withSignal = async (inner, options = {}) => {
		const { signal, onAbort } = options;
		let ref = { current: false };
		const handler = () => {
			ref.current = true;
			signal?.removeEventListener("abort", handler);
			onAbort?.();
		};
		signal?.addEventListener("abort", handler);
		let result = null;
		try {
			result = await inner(() => ref.current);
		} catch (error) {
			console.error(error);
		}
		signal?.removeEventListener("abort", handler);
		ref = null;
		return result;
	};
	var UniqueFileName = class {
		usedNames = /* @__PURE__ */ new Set();
		fileNameToPreId = /* @__PURE__ */ new Map();
		generate(originFileName) {
			let newFileName = originFileName;
			while (this.usedNames.has(newFileName)) {
				const startDotIndex = originFileName.lastIndexOf(".");
				const id$1 = (this.fileNameToPreId.get(originFileName) ?? 0) + 1;
				this.fileNameToPreId.set(originFileName, id$1);
				newFileName = startDotIndex === -1 ? originFileName.concat(`-${id$1.toFixed()}`) : originFileName.slice(0, startDotIndex).concat(`-${id$1.toFixed()}`).concat(originFileName.slice(startDotIndex));
			}
			this.usedNames.add(newFileName);
			return newFileName;
		}
		generateWithUUID(originFileName) {
			const startDotIndex = originFileName.lastIndexOf(".");
			const extension = startDotIndex === -1 ? "" : originFileName.slice(startDotIndex);
			const uuid$1 = v4_default();
			let finalFileName = `${uuid$1}${extension}`;
			let counter = 1;
			while (this.usedNames.has(finalFileName)) {
				finalFileName = `${uuid$1}-${counter.toFixed()}${extension}`;
				counter++;
			}
			this.usedNames.add(finalFileName);
			return finalFileName;
		}
	};
	const mapTableBySettings = (tables, settings) => {
		if (settings[SettingKey.Table] === Table.Filtered) return [];
		return tables.map((table$3) => {
			if (!table$3.inner.data?.invalid) return table$3;
			const tableIndex = table$3.parent?.children.findIndex((child) => child === table$3.inner);
			if (tableIndex !== void 0 && tableIndex !== -1) {
				const inner = {
					...table$3.inner,
					children: table$3.inner.children.map((row) => ({
						...row,
						children: row.children.map((cell) => ({
							...cell,
							children: cell.data?.invalidChildren ?? cell.children
						}))
					}))
				};
				table$3.parent?.children.splice(tableIndex, 1, inner);
				return {
					...table$3,
					inner
				};
			}
			return table$3;
		}).filter((table$3) => settings[SettingKey.Table] === Table.NonPhrasingContentToHTML ? table$3.inner.data?.invalid : true);
	};
	/**
	* Filters out redundant cells that are covered by rowSpan/colSpan
	* and adds appropriate HTML properties to the spanning cells.
	*
	* @param table The Markdown AST table to process
	*/
	const processTableSpans = (table$3) => {
		const occupied = [];
		for (let rowIndex = 0; rowIndex < table$3.children.length; rowIndex++) {
			const row = table$3.children[rowIndex];
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
					for (let i = 0; i < rowSpan; i++) for (let j = 0; j < colSpan; j++) {
						if (i === 0 && j === 0) continue;
						const targetRow = rowIndex + i;
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
		tables.forEach((table$3) => {
			const tableIndex = table$3.parent?.children.findIndex((child) => child === table$3.inner);
			if (tableIndex !== void 0 && tableIndex !== -1) {
				processTableSpans(table$3.inner);
				const hastTable = toHast(table$3.inner, { allowDangerousHtml: options.allowDangerousHtml });
				if (hastTable.type === "element") hastTable.children = [{
					type: "element",
					tagName: "colgroup",
					properties: {},
					children: table$3.inner.data?.colWidths?.map((width) => ({
						type: "element",
						tagName: "col",
						properties: { width: table$3.inner.data?.type === BlockType.GRID ? `${width.toFixed(2)}%` : width },
						children: []
					})) ?? []
				}].concat(hastTable.children);
				table$3.parent?.children.splice(tableIndex, 1, {
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
		const extractColumnWidths = (table$3) => {
			const colWidths = table$3.data?.colWidths;
			if (!colWidths || colWidths.length === 0) return null;
			if (table$3.children.length === 0) return null;
			const columnCount = table$3.children[0].children.length;
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
//#region src/scripts/download-lark-docx-as-markdown.ts
	configure({ useWebWorkers: false });
	const uniqueFileName = new UniqueFileName();
	const DOWNLOAD_ABORTED = "Download aborted";
	var TranslationKey = /* @__PURE__ */ function(TranslationKey$1) {
		TranslationKey$1["CONTENT_LOADING"] = "content_loading";
		TranslationKey$1["UNKNOWN_ERROR"] = "unknown_error";
		TranslationKey$1["NOT_SUPPORT"] = "not_support";
		TranslationKey$1["NOT_SUPPORT_DOC_1_0"] = "not_support_doc_1_0";
		TranslationKey$1["DOWNLOADING_FILE"] = "downloading_file";
		TranslationKey$1["FAILED_TO_DOWNLOAD"] = "failed_to_download";
		TranslationKey$1["DOWNLOAD_PROGRESS"] = "download_progress";
		TranslationKey$1["DOWNLOAD_COMPLETE"] = "download_complete";
		TranslationKey$1["STILL_SAVING"] = "still_saving";
		TranslationKey$1["IMAGE"] = "image";
		TranslationKey$1["FILE"] = "file";
		TranslationKey$1["CANCEL"] = "cancel";
		TranslationKey$1["SCROLL_DOCUMENT"] = "scroll_document";
		return TranslationKey$1;
	}(TranslationKey || {});
	var ToastKey = /* @__PURE__ */ function(ToastKey$1) {
		ToastKey$1["DOWNLOADING"] = "downloading";
		ToastKey$1["REPORT_BUG"] = "report_bug";
		return ToastKey$1;
	}(ToastKey || {});
	instance.init({
		lng: docx.language,
		resources: {
			en: {
				translation: {
					[TranslationKey.CONTENT_LOADING]: "Part of the content is still loading and cannot be downloaded at the moment. Please wait for loading to complete and retry",
					[TranslationKey.UNKNOWN_ERROR]: "Unknown error during download",
					[TranslationKey.NOT_SUPPORT]: "This is not a lark document page and cannot be downloaded as Markdown",
					[TranslationKey.NOT_SUPPORT_DOC_1_0]: "This is a old version lark document page and cannot be downloaded as Markdown",
					[TranslationKey.DOWNLOADING_FILE]: "Download {{name}} in: {{progress}}% (please do not refresh or close the page)",
					[TranslationKey.FAILED_TO_DOWNLOAD]: "Failed to download {{name}}",
					[TranslationKey.STILL_SAVING]: "Still saving (please do not refresh or close the page)",
					[TranslationKey.DOWNLOAD_PROGRESS]: "{{name}} download progress: {{progress}} %",
					[TranslationKey.DOWNLOAD_COMPLETE]: "Download complete",
					[TranslationKey.IMAGE]: "Image",
					[TranslationKey.FILE]: "File",
					[TranslationKey.CANCEL]: "Cancel",
					[TranslationKey.SCROLL_DOCUMENT]: "Scrolling to load document"
				},
				...en
			},
			zh: {
				translation: {
					[TranslationKey.CONTENT_LOADING]: "部分内容仍在加载中，暂时无法下载。请等待加载完成后重试",
					[TranslationKey.UNKNOWN_ERROR]: "下载过程中出现未知错误",
					[TranslationKey.NOT_SUPPORT]: "这不是一个飞书文档页面，无法下载为 Markdown",
					[TranslationKey.NOT_SUPPORT_DOC_1_0]: "这是一个旧版飞书文档页面，无法下载为 Markdown",
					[TranslationKey.DOWNLOADING_FILE]: "下载 {{name}} 中：{{progress}}%（请不要刷新或关闭页面）",
					[TranslationKey.FAILED_TO_DOWNLOAD]: "下载 {{name}} 失败",
					[TranslationKey.STILL_SAVING]: "仍在保存中（请不要刷新或关闭页面）",
					[TranslationKey.DOWNLOAD_PROGRESS]: "{{name}}下载进度：{{progress}}%",
					[TranslationKey.DOWNLOAD_COMPLETE]: "下载完成",
					[TranslationKey.IMAGE]: "图片",
					[TranslationKey.FILE]: "文件",
					[TranslationKey.CANCEL]: "取消",
					[TranslationKey.SCROLL_DOCUMENT]: "滚动中，以便加载文档"
				},
				...zh
			}
		}
	}).catch(console.error);
	async function toBlob(response, options = {}) {
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status.toFixed()}`);
		if (!response.body) throw new Error("This request has no response body.");
		const { onProgress, onComplete } = options;
		const reader = response.body.getReader();
		const contentLength = parseInt(response.headers.get("Content-Length") ?? "0", 10);
		let receivedLength = 0;
		const chunks = [];
		let _done = false;
		while (!_done) {
			const { done, value } = await reader.read();
			_done = done;
			if (done) {
				onComplete?.();
				break;
			}
			chunks.push(value);
			receivedLength += value.length;
			onProgress?.(receivedLength / contentLength);
		}
		return new Blob(chunks);
	}
	const downloadImage = async (image$2, options = {}) => {
		if (!image$2.data) return null;
		const { signal, useUUID = false, markdownFileName = "" } = options;
		const { name: originName, fetchSources, fetchBlob } = image$2.data;
		return await withSignal(async (isAborted) => {
			try {
				if (fetchBlob) {
					if (isAborted()) return null;
					const content = await fetchBlob();
					if (!content) return null;
					const baseName = markdownFileName ? `${markdownFileName}-diagram.png` : "diagram.png";
					const filename = `images/${useUUID ? uniqueFileName.generateWithUUID(baseName) : uniqueFileName.generate(baseName)}`;
					image$2.url = filename;
					return {
						filename,
						content
					};
				}
				if (originName && fetchSources) {
					if (isAborted()) return null;
					const sources = await fetchSources();
					if (!sources) return null;
					const baseName = markdownFileName ? `${markdownFileName}-${originName}` : originName;
					const name = useUUID ? uniqueFileName.generateWithUUID(baseName) : uniqueFileName.generate(baseName);
					const filename = `images/${name}`;
					const { src } = sources;
					if (isAborted()) return null;
					const response = await fetch(src, { signal });
					try {
						if (isAborted()) return null;
						const blob = await toBlob(response, { onProgress: (progress) => {
							if (isAborted()) {
								Toast.remove(filename);
								return;
							}
							Toast.loading({
								content: instance.t(TranslationKey.DOWNLOADING_FILE, {
									name,
									progress: Math.floor(progress * OneHundred)
								}),
								keepAlive: true,
								key: filename
							});
						} });
						image$2.url = filename;
						return {
							filename,
							content: blob
						};
					} finally {
						Toast.remove(filename);
					}
				}
				return null;
			} catch (error) {
				if (!(isAborted() || error instanceof DOMException && error.name === "AbortError")) Toast.error({
					content: instance.t(TranslationKey.FAILED_TO_DOWNLOAD, { name: originName }),
					actionText: instance.t(CommonTranslationKey.CONFIRM_REPORT_BUG, { ns: Namespace.COMMON }),
					onActionClick: () => {
						reportBug(error);
					}
				});
				return null;
			}
		}, { signal });
	};
	const downloadFile = async (file, options = {}) => {
		if (!file.data?.name || !file.data.fetchFile) return null;
		const { signal, useUUID = false, markdownFileName = "" } = options;
		const { name, fetchFile } = file.data;
		let controller$1 = new AbortController();
		const cancel = () => {
			controller$1.abort();
		};
		const result = await withSignal(async () => {
			try {
				const baseName = markdownFileName ? `${markdownFileName}-${name}` : name;
				const filename = `files/${useUUID ? uniqueFileName.generateWithUUID(baseName) : uniqueFileName.generate(baseName)}`;
				const response = await fetchFile({ signal: controller$1.signal });
				try {
					const blob = await toBlob(response, { onProgress: (progress) => {
						Toast.loading({
							content: instance.t(TranslationKey.DOWNLOADING_FILE, {
								name,
								progress: Math.floor(progress * OneHundred)
							}),
							keepAlive: true,
							key: filename,
							actionText: instance.t(TranslationKey.CANCEL),
							onActionClick: cancel
						});
					} });
					file.url = filename;
					return {
						filename,
						content: blob
					};
				} finally {
					Toast.remove(filename);
				}
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") return null;
				Toast.error({
					content: instance.t(TranslationKey.FAILED_TO_DOWNLOAD, { name }),
					actionText: instance.t(CommonTranslationKey.CONFIRM_REPORT_BUG, { ns: Namespace.COMMON }),
					onActionClick: () => {
						reportBug(error);
					}
				});
				return null;
			}
		}, {
			signal,
			onAbort: cancel
		});
		controller$1 = null;
		return result;
	};
	const downloadFiles = async (files, options = {}) => {
		const { onProgress, onComplete, batchSize = 3, signal, useUUID = false, markdownFileName = "" } = options;
		let completeEventCalled = false;
		const onCompleteOnce = () => {
			if (!completeEventCalled) {
				completeEventCalled = true;
				onComplete?.();
			}
		};
		return await withSignal(async (isAborted) => {
			const _results = [];
			const totalSize = files.length;
			let downloadedSize = 0;
			for (const batch of cluster(files, batchSize)) {
				if (isAborted()) break;
				await Promise.allSettled(batch.map(async (file) => {
					if (isAborted()) return;
					try {
						const result = file.type === "image" ? await downloadImage(file, {
							signal,
							useUUID,
							markdownFileName
						}) : await downloadFile(file, {
							signal,
							useUUID,
							markdownFileName
						});
						if (result) _results.push(result);
					} finally {
						downloadedSize++;
						if (!isAborted()) onProgress?.(downloadedSize / totalSize);
					}
				}));
			}
			onCompleteOnce();
			return _results;
		}, {
			signal,
			onAbort: onCompleteOnce
		}) ?? [];
	};
	const prepare = async () => {
		const checkIsReady = () => docx.isReady({ checkWhiteboard: true });
		let recoverScrollTop;
		if (!checkIsReady()) {
			const initialScrollTop = docx.container?.scrollTop ?? 0;
			recoverScrollTop = () => {
				docx.scrollTo({
					top: initialScrollTop,
					behavior: "instant"
				});
			};
			let top$1 = 0;
			docx.scrollTo({
				top: top$1,
				behavior: "instant"
			});
			const maxTryTimes = OneHundred;
			let tryTimes = 0;
			Toast.loading({
				content: instance.t(TranslationKey.SCROLL_DOCUMENT),
				keepAlive: true,
				key: TranslationKey.SCROLL_DOCUMENT,
				actionText: instance.t(TranslationKey.CANCEL),
				onActionClick: () => {
					tryTimes = maxTryTimes;
				}
			});
			while (!checkIsReady() && tryTimes <= maxTryTimes) {
				docx.scrollTo({
					top: top$1,
					behavior: "smooth"
				});
				await waitFor(.4 * Second);
				tryTimes++;
				top$1 = docx.container?.scrollHeight ?? 0;
			}
			Toast.remove(TranslationKey.SCROLL_DOCUMENT);
		}
		return {
			isReady: checkIsReady(),
			recoverScrollTop
		};
	};
	const main = async (options = {}) => {
		const { signal } = options;
		if (docx.isDoc) {
			Toast.warning({ content: instance.t(TranslationKey.NOT_SUPPORT_DOC_1_0) });
			throw new Error(DOWNLOAD_ABORTED);
		}
		if (!docx.isDocx) {
			Toast.warning({ content: instance.t(TranslationKey.NOT_SUPPORT) });
			throw new Error(DOWNLOAD_ABORTED);
		}
		const { isReady, recoverScrollTop } = await prepare();
		if (!isReady) {
			Toast.warning({ content: instance.t(TranslationKey.CONTENT_LOADING) });
			throw new Error(DOWNLOAD_ABORTED);
		}
		const settings = await getSettings([
			SettingKey.DownloadMethod,
			SettingKey.Table,
			SettingKey.Grid,
			SettingKey.TextHighlight,
			SettingKey.DownloadFileWithUniqueName
		]);
		const { root: root$3, images, files, tableWithParents, mentionUsers } = docx.intoMarkdownAST({
			whiteboard: true,
			diagram: true,
			file: true,
			highlight: settings[SettingKey.TextHighlight],
			flatGrid: settings[SettingKey.Grid] === Grid.Flatten
		});
		await transformMentionUsers(mentionUsers);
		const recommendName = docx.pageTitle ? safeNormalizeFileName(docx.pageTitle.slice(0, OneHundred)) : "doc";
		const isZip = images.length > 0 || files.length > 0;
		const ext = isZip ? ".zip" : ".md";
		const filename = `${recommendName}${ext}`;
		const toBlob$2 = async () => {
			Toast.loading({
				content: instance.t(TranslationKey.STILL_SAVING),
				keepAlive: true,
				key: ToastKey.DOWNLOADING
			});
			const singleFileContent = () => {
				transformTableBySettings(tableWithParents, settings);
				const markdown = Docx.stringify(root$3);
				return new Blob([markdown]);
			};
			const zipFileContent = async () => {
				const zipFs = new fs.FS();
				const imgs = images.filter((image$2) => image$2.data?.fetchSources);
				const diagrams = images.filter((image$2) => image$2.data?.fetchBlob);
				(await Promise.all([
					downloadFiles(imgs, {
						batchSize: 15,
						onProgress: (progress) => {
							Toast.loading({
								content: instance.t(TranslationKey.DOWNLOAD_PROGRESS, {
									name: instance.t(TranslationKey.IMAGE),
									progress: Math.floor(progress * OneHundred)
								}),
								keepAlive: true,
								key: TranslationKey.IMAGE
							});
						},
						onComplete: () => {
							Toast.remove(TranslationKey.IMAGE);
						},
						signal,
						useUUID: settings[SettingKey.DownloadFileWithUniqueName],
						markdownFileName: recommendName
					}),
					downloadFiles(diagrams, {
						batchSize: 1,
						signal,
						useUUID: settings[SettingKey.DownloadFileWithUniqueName],
						markdownFileName: recommendName
					}),
					downloadFiles(files, {
						onProgress: (progress) => {
							Toast.loading({
								content: instance.t(TranslationKey.DOWNLOAD_PROGRESS, {
									name: instance.t(TranslationKey.FILE),
									progress: Math.floor(progress * OneHundred)
								}),
								keepAlive: true,
								key: TranslationKey.FILE
							});
						},
						onComplete: () => {
							Toast.remove(TranslationKey.FILE);
						},
						signal,
						useUUID: settings[SettingKey.DownloadFileWithUniqueName],
						markdownFileName: recommendName
					})
				])).flat(1).forEach(({ filename: filename$1, content: content$1 }) => {
					zipFs.addBlob(filename$1, content$1);
				});
				transformTableBySettings(tableWithParents, settings);
				const markdown = Docx.stringify(root$3);
				zipFs.addText(`${recommendName}.md`, markdown);
				return await zipFs.exportBlob();
			};
			const content = isZip ? await zipFileContent() : singleFileContent();
			recoverScrollTop?.();
			return content;
		};
		if (settings[SettingKey.DownloadMethod] === DownloadMethod.ShowSaveFilePicker && e) {
			if (!navigator.userActivation.isActive) {
				if (!await confirm()) throw new Error(DOWNLOAD_ABORTED);
			}
			await o(toBlob$2(), {
				fileName: filename,
				extensions: [ext]
			});
		} else legacyFileSave(await toBlob$2(), { fileName: filename });
	};
	let controller = new AbortController();
	main({ signal: controller.signal }).then(() => {
		Toast.success({ content: instance.t(TranslationKey.DOWNLOAD_COMPLETE) });
	}).catch((error) => {
		if (error instanceof Error && (error.name === "AbortError" || error.message === DOWNLOAD_ABORTED)) controller.abort();
		else Toast.error({
			key: ToastKey.REPORT_BUG,
			content: String(error),
			actionText: instance.t(CommonTranslationKey.CONFIRM_REPORT_BUG, { ns: Namespace.COMMON }),
			duration: Minute,
			onActionClick: () => {
				reportBug(error);
				Toast.remove(ToastKey.REPORT_BUG);
			}
		});
	}).finally(() => {
		Toast.remove(ToastKey.DOWNLOADING);
		controller = null;
	});

//#endregion
})();