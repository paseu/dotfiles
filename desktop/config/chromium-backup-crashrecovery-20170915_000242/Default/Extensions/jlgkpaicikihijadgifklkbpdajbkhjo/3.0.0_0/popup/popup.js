const gesturesLookup = [
    {
        direct: "L",
        action: "G_back",
       imgPath: "left"
    },
    {
        direct: "R",
        action: "G_go",
       imgPath: "right"
    },
    {
        direct: "U",
        action: "G_up",
       imgPath: "up"
    },
    {
        direct: "D",
        action: "G_down",
       imgPath: "down"
    },
    {
        direct: "DR",
        action: "G_close",
       imgPath: "down-right"
    },
    {
        direct: "LU",
        action: "G_reclosedtab",
        moreTarget: "newfront",
        morePosition: "chrome",
        morePinned: "unpinned",
        moreDes: chrome.i18n.getMessage("G_reclosedtab"),
        imgPath: "left-up"
    },
    {
        direct: "RD",
        action: "G_bottom",
       imgPath: "right-down"
    },
    {
        direct: "RU",
        action: "G_top",
       imgPath: "right-up"
    },
    {
        direct: "UD",
        action: "G_reload",
       imgPath: "up-down"
    },
    {
        direct: "UDU",
        action: "G_reloadclear",
       imgPath: "up-down-up"
    },
    {
        direct: "UL",
        action: "G_lefttab",
       imgPath: "up-left"
    },
    {
        direct: "UR",
        action: "G_righttab",
       imgPath: "up-right"
    },
    {
        direct: "DRU",
        action: "G_newwindow",
       imgPath: "down-right-up"
    },
    {
        direct: "URD",
        action: "G_closewindow",
       imgPath: "up-right-down"
    },
    {
        direct: "RDLU",
        action: "G_crxsettings",
        moreDes: chrome.i18n.getMessage("G_crxsettings"),
        morePinned: "unpinned",
        morePosition: "chrome",
        moreTarget: "newfront",
       imgPath: "right-down-left-up"
    }];

const appendTopGestures = function (gestures) {
    if (!gestures)
        $("#topGesturesContainer").html("<div class='msg'>No popular gestures for this page. Be the first to use gestures and contribute to our hub.</div>");
    else {
        gestures.forEach((e, i) => {
            let arrowHolder = "";
            gesturesLookup.every((g) => {
                if (g.action == e) {
                    const imgPath = g.imgPath;
                    arrowHolder = "<img class='arrow' src='" + chrome.extension.getURL("") + "image/popupGestures/" + imgPath + ".svg'>";
                    return false;
                } else {
                    return true;
                }
            });
            $("#topGesturesContainer").append("<div class='gestureContainer'><div class='arrows'>" + arrowHolder + "</div><div class='name'>" +  chrome.i18n.getMessage(e) || e + "</div></div>");
        });
    }
};

chrome.storage.sync.get("optedout", function (obj) {
    if (obj["optedout"] && obj["optedout"] == true) {
        $("#title").html("Opted Out");
        $("#title").show();
        $("#topGesturesContainer").html("<div class='msg'>You're opted out, so we can't show you popular gestures for this page. Go to <a href='/options.html' target='_blank'>Settings</a> to opt back in.</div>").css('display', 'block');
        return;
    }

    chrome.tabs.getSelected(null, function (tab) {
        let a = document.createElement('a');
        a.href = tab.url;
        $("#title").html("Top gestures for&nbsp;<span class='sitename'>" + (a.hostname.length > 25 ? (a.hostname.substring(0,25) + '...') : a.hostname) +"</span>");
        $("#title").show();
        chrome.runtime.sendMessage({type: 'getTabData', tabid: tab.id}, (response) => {
            appendTopGestures(response);
        });
    });
});