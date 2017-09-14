// Standard Google Universal Analytics code
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here

let gaID = "UA-45823005-2";
ga('create', gaID, 'auto');
ga('set', 'checkProtocolTask', function () {
});

const version = chrome.runtime.getManifest().version;
const browser = utils.getBrowser().name;

//Sampling:
const sampleGA = [ // 0 = never, 1 = always, others as the % for 1/X
    {category: 'general', action: 'crx_user', sample: 1}
];

const analyticsMainEventReport = function (category, action, label, value) {

    if (typeof ga !== "function")
        return;

    for (const event of sampleGA) {
        if (event.category == category.toLowerCase() && ((event.action && event.action == action.toLowerCase()) || !event.action)) {
            if (event.sample > 0 && (Math.floor(event.sample * Math.random()) + 1 ) == 1) {
                ga('send', 'event', category, action, label, value);
            }
            return;
        }
    }

    ga('send', 'event', category, action, label, value);

};

const analyticsReduce = function (category, action, label, value) {
    if (localStorage.hasOwnProperty("GA_send_events") && localStorage.GA_send_events == "true") {
        analyticsMainEventReport(category, action, label, value);
    }
};

//Retension:
class Retension {

    constructor(conf) {
        this.Storage = conf.Storage;
        this.TrackGAEvents = conf.TrackGAEvents;
        this.lastRetentionDay = 28;
        this.minHoursFromInstall = 8;

        this.Storage.requestGet().then(data => {
            this.data = this.initialize(data);

            this.report();
        });
    }

    initialize(data) {
        if (data && data.installDate && data.sentDays) {
            return data;
        } else {
            data = data || {};
            data.installDate = data.installDate ? data.installDate : Date.now();
            data.sentDays = data.sentDays || {};

            this.Storage.requestSet(data);

            return data;
        }
    }

    report() {
        if (!this.data.completed) {
            let now = new Date();
            let installDate = new Date(this.data.installDate);
            let installStart = this.getDateStart(installDate);
            let todayStart = this.getDateStart(now);
            let msStartDiff = Math.abs(todayStart - installStart);
            let hoursFromTrueInstall = Math.floor((now - installDate) / (1000 * 60 * 60));
            let daysDiff = Math.floor(msStartDiff / (1000 * 60 * 60 * 24));

            if (daysDiff > 0 && daysDiff <= this.lastRetentionDay) {
                if (!this.data.sentDays[daysDiff] && hoursFromTrueInstall > this.minHoursFromInstall) {
                    this.TrackGAEvents(daysDiff);

                    this.data.sentDays[daysDiff] = true;
                    this.Storage.requestSet(this.data);
                }

                setTimeout(this.report.bind(this), 1000 * 60 * 60);
            } else if (daysDiff > this.lastRetentionDay) {
                this.data.completed = true;

                this.Storage.requestSet(this.data);
            }
        }
    }

    getDateStart(date) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            (date.getHours() >= 0 && date.getHours() < 5) ? date.getDate() - 1 : date.getDate(),
            5, 0, 1
        ); //day starts at 5PM
    }

}

if (undefined === localStorage.GA_send_events) {
    if (1 === Math.floor(Math.random() * 1000)) {
        localStorage.GA_send_events = true;
        analyticsMainEventReport("general", "user_enabled", version + "#" + browser);
    } else {
        localStorage.GA_send_events = false;
    }
}

if (localStorage.hasOwnProperty("GA_send_events") && localStorage.GA_send_events == "true") {

    new Retension({
        Storage: {
            requestGet: function () {
                return new Promise(function (resolve) {
                    try {
                        resolve(localStorage.STDATA ? JSON.parse(localStorage.STDATA) : {});
                    } catch (e) {
                        resolve({});
                    }
                });
            },
            requestSet: function (data) {
                return new Promise(function (resolve) {
                    localStorage.STDATA = JSON.stringify(data);
                    resolve();
                });
            }
        },
        TrackGAEvents: function (xDay) {
            analyticsMainEventReport('General', 'Retained {0} day'.replace('{0}', xDay));
        }
    });

}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.gacategory)
        analyticsReduce(request.gacategory, request.gaaction || null, request.galabel || null, request.gavalue || null);
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        ga('send', 'event', 'general', 'install', version + '#' + browser);
    } else if (details.reason == "update") {
        ga('send', 'event', 'general', 'update', version + '#' + browser);
    }
});

//daily users:
setInterval(() => {
    analyticsReduce('general', 'daily_crx_user', version + '#' + browser);
}, 1000 * 60 * 60 * 24);
analyticsReduce('general', 'daily_crx_user', version + '#' + browser);