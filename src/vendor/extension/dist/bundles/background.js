//#region src/background.ts
const sharedDocumentUrlPatterns = [
	"https://*.feishu.cn/*",
	"https://*.feishu.net/*",
	"https://*.larksuite.com/*",
	"https://*.feishu-pre.net/*",
	"https://*.larkoffice.com/*",
	"https://*.larkenterprise.com/*",
	"https://*.aipoju.com/*"
];
var MenuItemId = /* @__PURE__ */ function(MenuItemId$1) {
	MenuItemId$1["DOWNLOAD_DOCX_AS_MARKDOWN"] = "download_docx_as_markdown";
	MenuItemId$1["COPY_DOCX_AS_MARKDOWN"] = "copy_docx_as_markdown";
	MenuItemId$1["VIEW_DOCX_AS_MARKDOWN"] = "view_docx_as_markdown";
	return MenuItemId$1;
}(MenuItemId || {});
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.removeAll(() => {
		chrome.contextMenus.create({
			id: MenuItemId.DOWNLOAD_DOCX_AS_MARKDOWN,
			title: chrome.i18n.getMessage("download_docx_as_markdown"),
			documentUrlPatterns: sharedDocumentUrlPatterns,
			contexts: ["page", "editable"]
		});
		chrome.contextMenus.create({
			id: MenuItemId.COPY_DOCX_AS_MARKDOWN,
			title: chrome.i18n.getMessage("copy_docx_as_markdown"),
			documentUrlPatterns: sharedDocumentUrlPatterns,
			contexts: ["page", "editable"]
		});
		chrome.contextMenus.create({
			id: MenuItemId.VIEW_DOCX_AS_MARKDOWN,
			title: chrome.i18n.getMessage("view_docx_as_markdown"),
			documentUrlPatterns: sharedDocumentUrlPatterns,
			contexts: ["page", "editable"]
		});
	});
});
const getScriptFile = (flag) => {
	switch (flag) {
		case MenuItemId.DOWNLOAD_DOCX_AS_MARKDOWN: return "bundles/scripts/download-lark-docx-as-markdown.js";
		case MenuItemId.COPY_DOCX_AS_MARKDOWN: return "bundles/scripts/copy-lark-docx-as-markdown.js";
		case MenuItemId.VIEW_DOCX_AS_MARKDOWN: return "bundles/scripts/view-lark-docx-as-markdown.js";
		default: return null;
	}
};
const executeScriptByFlag = async (flag, tabId) => {
	const scriptFile = getScriptFile(flag);
	if (!scriptFile) return;
	if ((await chrome.tabs.get(tabId)).url?.includes("aipoju.com")) {
		const feishuFrame = (await chrome.webNavigation.getAllFrames({ tabId }))?.find((f) => f.url.includes("feishu.cn") && f.parentFrameId !== -1);
		if (!feishuFrame) return;
		await chrome.scripting.executeScript({
			files: [scriptFile],
			target: {
				tabId,
				frameIds: [feishuFrame.frameId]
			},
			world: "MAIN"
		});
	} else await chrome.scripting.executeScript({
		files: [scriptFile],
		target: { tabId },
		world: "MAIN"
	});
};
chrome.contextMenus.onClicked.addListener(({ menuItemId }, tab) => {
	if (tab?.id !== void 0) executeScriptByFlag(menuItemId, tab.id).catch(console.error);
});
chrome.runtime.onMessage.addListener((_message, sender, sendResponse) => {
	const message = _message;
	const executeScript = async () => {
		const activeTabs = await chrome.tabs.query({
			currentWindow: true,
			active: true
		});
		const activeTabId = activeTabs.at(0)?.id;
		if (activeTabs.length === 1 && activeTabId !== void 0) await executeScriptByFlag(message.flag, activeTabId);
	};
	executeScript().then(sendResponse).catch(console.error);
	return true;
});

//#endregion