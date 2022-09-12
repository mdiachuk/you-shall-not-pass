const OFF_BADGE_COLOR = "#fc8c77";
const OFF_BADGE_TEXT = "off";
const EMPTY_BADGE_TEXT = "";

const handleStartup = () => {
    chrome.storage.local.get(["blockedDomains", "enabled"], local => {
        let enabled = local.enabled;
        if (typeof enabled === 'undefined') {
            chrome.storage.local.set({ enabled: true });
        } else if (!enabled) {
            chrome.action.setBadgeBackgroundColor({ color: OFF_BADGE_COLOR });
            chrome.action.setBadgeText({ text: OFF_BADGE_TEXT });
        }
    });
}

chrome.runtime.onInstalled.addListener(handleStartup);

chrome.runtime.onStartup.addListener(handleStartup);

chrome.action.onClicked.addListener(() => {
    chrome.storage.local.get(["enabled"], local => {
        let { enabled } = local;
        enabled = !enabled;
        chrome.storage.local.set({ enabled });
        chrome.action.setBadgeBackgroundColor({ color: OFF_BADGE_COLOR });
        chrome.action.setBadgeText({ text: enabled ? EMPTY_BADGE_TEXT : OFF_BADGE_TEXT });
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
        if (blockedDomains && blockedDomains.includes(domain)) {
            chrome.tabs.remove(tabId);
        }
    });
});
