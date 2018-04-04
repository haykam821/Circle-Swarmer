chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({
        "url": "chrome-extension://mdkndjinhmnajdmkbbjokgilfnojoahk/popup.html"
    });
});