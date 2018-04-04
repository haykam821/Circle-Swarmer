const $ = require("jquery");
const rq = require("request-promise-native");

$("#icon").click(() => {
    chrome.tabs.create({
        url: "https://discord.gg/4mAMtsT",
    });
});