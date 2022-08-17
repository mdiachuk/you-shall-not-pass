const blockedDomainsElement = document.getElementById("blocked-domains");

blockedDomainsElement.addEventListener("input", event => {
    const blockedDomains = event.target.value
        .split("\n")
        .filter(s => s.trim())
        .filter(Boolean);
    chrome.storage.local.set({ blockedDomains });
});

window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["blockedDomains"], local =>  {
        const { blockedDomains } = local;
        if (!Array.isArray(blockedDomains)) {
            return;
        }
        blockedDomainsElement.value = blockedDomains.join("\n");
    });
});