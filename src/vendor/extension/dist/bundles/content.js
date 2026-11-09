(function() {


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
			const handlers = this.eventNameToHandlers.get(name);
			if (handlers) handlers.push(handler);
			else this.eventNameToHandlers.set(name, [handler]);
		}
		off(name, handler) {
			const handlers = this.eventNameToHandlers.get(name);
			if (handlers) if (handler) handlers.splice(handlers.indexOf(handler) >>> 0, 1);
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
//#region src/content.ts
	const COMMENT_BUTTON_CLASS = ".docx-comment__first-comment-btn";
	const HELP_BLOCK_CLASS = ".help-block";
	let disposables = [];
	const dispose = () => {
		disposables.forEach((disposable) => {
			disposable();
		});
		disposables = [];
	};
	const initButtons = () => {
		const root = document.body;
		const isReady = () => {
			for (const selector of [HELP_BLOCK_CLASS]) if (!root.querySelector(selector)) return false;
			return true;
		};
		const render = () => {
			const style = document.createElement("style");
			style.innerHTML = `
  [data-CDC-button-type] {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--line-border-card);
    border-radius: 50%;
    background-color: var(--bg-body);
    box-shadow: var(--shadow-s4-down);
    cursor: pointer;
    text-align: center;
    color: var(--text-title);
    z-index: 3;
  }

  [data-CDC-button-type]:hover {
    color: var(--colorful-blue);
  }
  `;
			const buttons = [
				{
					type: "copy",
					innerHtml: `<svg aria-hidden="true" focusable="false" role="img" class="octicon octicon-copy" viewBox="0 0 16 16" width="16"
          height="16" fill="currentColor">
          <path
              d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z">
          </path>
          <path
              d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z">
          </path>
          </svg>`,
					action: () => {
						chrome.runtime.sendMessage({ flag: "copy_docx_as_markdown" }).catch(console.error);
					}
				},
				{
					type: "view",
					innerHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
        class="octicon octicon-view" fill="currentColor">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        `,
					action: () => {
						chrome.runtime.sendMessage({ flag: "view_docx_as_markdown" }).catch(console.error);
					}
				},
				{
					type: "download",
					innerHtml: `<svg aria-hidden="true" focusable="false" role="img" class="octicon octicon-download" viewBox="0 0 16 16"
        width="16" height="16" fill="currentColor">
        <path
          d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z">
        </path>
        <path
          d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z">
        </path>
      </svg>`,
					action: () => {
						chrome.runtime.sendMessage({ flag: "download_docx_as_markdown" }).catch(console.error);
					}
				}
			].map(({ type, innerHtml, action }) => {
				const btn = document.createElement("button");
				btn.type = "button";
				btn.setAttribute("data-CDC-button-type", type);
				btn.innerHTML = innerHtml;
				btn.style.width = "36px";
				btn.style.height = "36px";
				btn.addEventListener("click", action);
				return {
					element: btn,
					width: 36,
					height: 36
				};
			});
			const getOriginalBtnPos = (buttons$1) => {
				const helpBlock = root.querySelector(HELP_BLOCK_CLASS);
				if (!helpBlock) return;
				const windowWidth = window.innerWidth;
				const windowHeight = window.innerHeight;
				const helpBlockRect = helpBlock.getBoundingClientRect();
				const commentButton = root.querySelector(COMMENT_BUTTON_CLASS);
				const defaultBtnHeight = 36;
				const defaultGap = 14;
				if (!commentButton) {
					const startBottom = windowHeight - helpBlockRect.bottom;
					const right = windowWidth - helpBlockRect.right;
					return buttons$1.map((_, index) => ({
						right,
						bottom: startBottom + (index + 1) * (defaultGap + defaultBtnHeight)
					}));
				}
				const commentButtonRect = commentButton.getBoundingClientRect();
				if (commentButtonRect.right === helpBlockRect.right) {
					const btnHeight = commentButtonRect.height;
					const gap = Math.abs(helpBlockRect.bottom - commentButtonRect.bottom) - btnHeight;
					const initialBottom = Math.max(windowHeight - commentButtonRect.bottom, windowHeight - helpBlockRect.bottom);
					return buttons$1.map((_, index) => ({
						right: windowWidth - commentButtonRect.right,
						bottom: initialBottom + (index + 1) * (gap + btnHeight)
					}));
				} else if (commentButtonRect.bottom === helpBlockRect.bottom) {
					let bottom = windowHeight - commentButtonRect.bottom;
					return chunk(buttons$1, 2).map((items) => {
						bottom += defaultGap + defaultBtnHeight;
						if (items.length === 2) return [{
							right: windowWidth - commentButtonRect.right,
							bottom
						}, {
							right: windowWidth - helpBlockRect.right,
							bottom
						}];
						return [{
							right: windowWidth - Math.max(commentButtonRect.right, helpBlockRect.right),
							bottom
						}];
					}).flat(1);
				}
			};
			const layout = (buttons$1) => {
				const pos = getOriginalBtnPos(buttons$1);
				if (!pos) return;
				buttons$1.forEach((button, index) => {
					button.element.style.right = pos[index].right.toFixed() + "px";
					button.element.style.bottom = pos[index].bottom.toFixed() + "px";
				});
			};
			const autoLayoutObserver = new MutationObserver((mutations) => {
				for (const mutation of mutations) if (mutation.type === "attributes" && mutation.attributeName === "class") layout(buttons);
			});
			const autoLayout = () => {
				const commentButton = root.querySelector(COMMENT_BUTTON_CLASS);
				if (!commentButton) return;
				autoLayoutObserver.observe(commentButton, {
					attributes: true,
					attributeFilter: ["class"]
				});
			};
			layout(buttons);
			autoLayout();
			root.appendChild(style);
			buttons.forEach((button) => {
				root.appendChild(button.element);
			});
			const unmount$1 = () => {
				autoLayoutObserver.disconnect();
				buttons.forEach((button) => {
					if (root.contains(button.element)) root.removeChild(button.element);
				});
				if (root.contains(style)) root.removeChild(style);
			};
			disposables.push(unmount$1);
			return unmount$1;
		};
		const checkCapture = async () => {
			try {
				const { manualCaptureActive } = await chrome.storage.local.get("manualCaptureActive");
				if (manualCaptureActive) chrome.runtime.sendMessage({
					type: "CDC_CAPTURED_DOCUMENT",
					url: window.location.href,
					title: document.title || "Untitled Document"
				}).catch(console.error);
			} catch (e) {
				console.error("Failed to report capture state:", e);
			}
		};
		let unmount = null;
		const init = () => {
			if (unmount) {
				unmount();
				unmount = null;
			}
			unmount = render();
			checkCapture();
		};
		const initObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) if (mutation.type === "childList") {
				for (const node of mutation.addedNodes) if (node instanceof HTMLElement && (node.matches(COMMENT_BUTTON_CLASS) || node.matches(HELP_BLOCK_CLASS)) && isReady()) init();
			}
		});
		if (isReady()) init();
		initObserver.observe(root, {
			childList: true,
			subtree: true
		});
		disposables.push(() => {
			initObserver.disconnect();
		});
	};
	const AIPOJU_HOST = "aipoju.com";
	const FEISHU_IFRAME_SELECTOR = "iframe[src*=\"feishu\"]";
	const initAipojuButtons = () => {
		const root = document.body;
		let buttonContainer = null;
		let style = null;
		let iframeObserver = null;
		const render = () => {
			if (buttonContainer) return;
			style = document.createElement("style");
			style.innerHTML = `
      [data-CDC-aipoju-container] {
        position: fixed;
        right: 24px;
        bottom: 80px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 9999;
      }
      [data-CDC-aipoju-container] button {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #e0e0e0;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        color: #333;
        transition: color 0.2s, box-shadow 0.2s;
      }
      [data-CDC-aipoju-container] button:hover {
        color: #3370ff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    `;
			const operates = [
				{
					type: "copy",
					innerHtml: `<svg aria-hidden="true" focusable="false" role="img" class="octicon octicon-copy" viewBox="0 0 16 16" width="16"
          height="16" fill="currentColor">
          <path
              d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z">
          </path>
          <path
              d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z">
          </path>
          </svg>`,
					flag: "copy_docx_as_markdown"
				},
				{
					type: "view",
					innerHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="octicon octicon-view" fill="currentColor">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>`,
					flag: "view_docx_as_markdown"
				},
				{
					type: "download",
					innerHtml: `<svg aria-hidden="true" focusable="false" role="img" class="octicon octicon-download" viewBox="0 0 16 16"
        width="16" height="16" fill="currentColor">
        <path
            d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z">
        </path>
        <path
            d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z">
        </path>
      </svg>`,
					flag: "download_docx_as_markdown"
				}
			];
			buttonContainer = document.createElement("div");
			buttonContainer.setAttribute("data-CDC-aipoju-container", "");
			for (const { type, innerHtml, flag } of operates) {
				const btn = document.createElement("button");
				btn.type = "button";
				btn.setAttribute("data-CDC-button-type", type);
				btn.innerHTML = innerHtml;
				btn.addEventListener("click", () => {
					chrome.runtime.sendMessage({
						flag,
						from: "aipoju"
					}).catch(console.error);
				});
				buttonContainer.appendChild(btn);
			}
			root.appendChild(style);
			root.appendChild(buttonContainer);
			disposables.push(() => {
				if (buttonContainer && root.contains(buttonContainer)) {
					root.removeChild(buttonContainer);
					buttonContainer = null;
				}
				if (style && root.contains(style)) {
					root.removeChild(style);
					style = null;
				}
			});
		};
		const unrender = () => {
			if (buttonContainer && root.contains(buttonContainer)) {
				root.removeChild(buttonContainer);
				buttonContainer = null;
			}
			if (style && root.contains(style)) {
				root.removeChild(style);
				style = null;
			}
		};
		const checkIframe = () => {
			if (root.querySelector(FEISHU_IFRAME_SELECTOR)) render();
			else unrender();
		};
		iframeObserver = new MutationObserver(checkIframe);
		iframeObserver.observe(root, {
			childList: true,
			subtree: true
		});
		disposables.push(() => {
			iframeObserver?.disconnect();
			unrender();
		});
		checkIframe();
	};
	function initContent() {
		if (location.hostname.endsWith(AIPOJU_HOST)) initAipojuButtons();
		else initButtons();
	}
	window.addEventListener("load", initContent, false);
	let lastPathname = location.pathname;
	new MutationObserver(() => {
		const pathname = location.pathname;
		if (pathname !== lastPathname) {
			lastPathname = pathname;
			dispose();
			initContent();
		}
	}).observe(document.body, { childList: true });
	portImpl.receiver.on(EventName.GetSettings, async (keys) => {
		return await chrome.storage.sync.get(keys);
	});
	portImpl.receiver.on(EventName.Console, (data) => {
		console.log("MAIN World Console:", ...data);
	});
	const isFeishuDocUrl = (urlStr) => {
		try {
			const url = new URL(urlStr);
			const hostname = url.hostname;
			const pathname = url.pathname;
			if (!(hostname.endsWith(".feishu.cn") || hostname.endsWith(".feishu.net") || hostname.endsWith(".larksuite.com") || hostname.endsWith(".feishu-pre.net") || hostname.endsWith(".larkoffice.com") || hostname.endsWith(".larkenterprise.com"))) return false;
			return pathname.includes("/docx/") || pathname.includes("/wiki/") || pathname.includes("/doc/");
		} catch {
			return false;
		}
	};
	document.addEventListener("click", (e) => {
		const handle = async () => {
			try {
				const { manualCaptureActive } = await chrome.storage.local.get("manualCaptureActive");
				if (!manualCaptureActive) return;
				const anchor = e.target.closest("a");
				if (anchor?.href) {
					const url = anchor.href;
					if (isFeishuDocUrl(url)) {
						if (anchor.target !== "_blank") {
							window.open(url, "_blank");
							e.preventDefault();
							e.stopPropagation();
						}
					}
				}
			} catch (err) {
				console.error("Error in manual capture click handler:", err);
			}
		};
		handle();
	}, { capture: true });
	window.addEventListener("message", (event) => {
		if (event.source !== window) return;
		const data = event.data;
		if (data && data["type"] === "CDC_EXTRACTED_DATA_INTERNAL") chrome.runtime.sendMessage({
			type: data["success"] ? "CDC_EXTRACTION_SUCCESS" : "CDC_EXTRACTION_ERROR",
			data: data["data"],
			error: data["error"]
		});
	});

//#endregion
})();