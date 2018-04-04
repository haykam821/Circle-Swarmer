const $ = require("jquery");
const rq = require("request-promise-native");
const circle = require("circle-of-trust");
const stringify = require("querystring").stringify;

const snoowrap = require("snoowrap");
let r; // Assign later.

function param(parameterName, toUse = location.search) {
    var result = null,
        tmp = [];
    toUse
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
if (param("access_token", location.hash) && param("state", location.hash) === localStorage.getItem("state")) {
    // We just got redirected from the Reddit auth.
    localStorage.setItem("redditKey", param("access_token", location.hash));
    alert("Authenticated with reddit!");
    window.location.replace("chrome-extension://mdkndjinhmnajdmkbbjokgilfnojoahk/popup.html");
} else if (localStorage.getItem("redditKey")) {
    r = new snoowrap({
        userAgent: `Circle Swarmer by u/haykam821 | v1.0.0`,
        accessToken: localStorage.getItem("redditKey"),
    });
} else {
    // We need to authenticate with Reddit.
    $("#authReddit").prop("disabled", false);
    $("#checkPage").prop("disabled", true);
}

$("#authReddit").click(() => {
    // Make ourselves a state
    const state = Math.random();
    localStorage.setItem("state", state);

    window.location = `https://www.reddit.com/api/v1/authorize?client_id=fQ1zEf_Qbepvcg&response_type=token&state=${state}&redirect_uri=chrome-extension://mdkndjinhmnajdmkbbjokgilfnojoahk/popup.html&scope=read%20vote`;
});

$("#icon").click(() => {
    chrome.tabs.create({
        url: "https://discord.gg/4mAMtsT",
    });
});

$("#swarmtool").submit(async event => {
    event.preventDefault();

    const values = {};
    $.each($('#swarmtool').serializeArray(), (i, field) => {
        values[field.name] = field.value;
    });

    const submission = await r.getSubmission(values.url.split("/")[6]).fetch().catch(() => {
        alert("Sorry, that might not be a valid circle URL though.");
    });
    if (submission.is_betrayed) {
        alert("Nice! That circle has already been betrayed.")
    } else {
        console.log(stringify({
            id: submission.id,
            vote_key: values.key,
        }))
        const keyGuess = await r.oauthRequest({
            url: `https://www.reddit.com/api/guess_voting_key`,
            method: "post",
            body: stringify({
                id: submission.id,
                vote_key: values.key,
            }),
        });
        console.log(keyGuess)
    }
});