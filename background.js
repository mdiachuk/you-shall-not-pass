chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["blockedDomains"], local => {
        if (!Array.isArray(local.blockedDomains)) {
            chrome.storage.local.set({ blockedDomains: [] });
        }
    });
    chrome.storage.local.set({ enabled: true });
    chrome.action.setTitle({ title: "Click to disable" });
    chrome.action.setBadgeBackgroundColor({ color: "#fc8c77" });
});

chrome.action.onClicked.addListener(() => {
    chrome.storage.local.get(["enabled"], local => {
        let { enabled } = local;
        enabled = !enabled;
        chrome.storage.local.set({ enabled });
        chrome.action.setTitle({ title: enabled ? "Click to disable" : "Click to enable" });
        chrome.action.setBadgeText({ text: enabled ? "" : "off" });
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    chrome.storage.local.get(["enabled", "blockedDomains"], local => {
        const { enabled, blockedDomains } = local;
        const url = changeInfo.pendingUrl || changeInfo.url;
        if (!enabled || !url) {
            return;
        }
        const domain = (new URL(url)).hostname.replace(/^www\./, "");
        if (blockedDomains.includes(domain)) {
            chrome.tabs.remove(tabId);
        }
    });
});
