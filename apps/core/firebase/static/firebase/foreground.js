import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {
    getMessaging,
    getToken,
    onMessage,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging.js";

$(document).ready(async function () {
    const ele$ = $('#fcm');
    const config = JSON.parse(ele$.text());
    ele$.remove();

    const vApiKey = config?.['key_pair'];
    const configStr = config?.['config'];

    if (typeof vApiKey === 'string' && vApiKey.length > 0 && typeof configStr === 'string' && configStr.length > 0){
        const firebaseConfig = JSON.parse(configStr);
        const keyCleanFromLogin = "fcmClean";
        const keySaved = "fcmToken";
        const keyIDSaved = "fcmTokenID";
        const keyLatestFetch = "fcmTokenLatestFetch";

        function saveTokenToStorage(token, tokenID) {
            localStorage.setItem(keySaved, token);
            localStorage.setItem(keyIDSaved, tokenID);
            localStorage.setItem(keyLatestFetch, Date.now());
            localStorage.setItem(keyCleanFromLogin, "0");
        }

        function fcmGetNewToken(currentToken) {
            const savedToken = localStorage.getItem(keySaved);
            const savedIDToken = localStorage.getItem(keyIDSaved);
            if (savedToken !== currentToken){
                $.fn.callAjax2({
                    url: '/firebase/main/api',
                    method: 'POST',
                    data: {
                        'old_id': savedIDToken ?? null,
                        'token': currentToken,
                    }
                }).then(
                    resp => {
                        const data = $.fn.switcherResp(resp);
                        if (data && data.hasOwnProperty('firebase')) {
                            saveTokenToStorage(currentToken, data['firebase']['id']);
                        }
                    },
                    errs => console.log('errs:', errs),
                );
            }
        }

        if (vApiKey) {
            function initFCM(){
                const app = initializeApp(firebaseConfig);
                const messaging = getMessaging(app);
                getAnalytics(app);

                onMessage(messaging, (payload) => {
                    fcm_handle_message(payload, 'foreground');
                });

                const now = Date.now();
                const latestFetch = localStorage.getItem(keyLatestFetch);
                const flagCleanFromLogin = localStorage.getItem(keyCleanFromLogin);
                if (!latestFetch || (now - latestFetch) > 60 * 60 * 1000 || flagCleanFromLogin === null) {  // 1 hours
                    getToken(messaging, {vapidKey: vApiKey})
                        .then((currentToken) => {
                            if (currentToken) {
                                fcmGetNewToken(currentToken);
                            } else {
                                console.log('No registration token available. Request permission to generate one.');
                            }
                        })
                        .catch((err) => {
                            console.log('An error occurred while retrieving token. ', err);
                        });
                }
            }

            if (!('Notification' in window)) {
                return;
            }

            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    initFCM();
                } else if (permission === 'denied') {
                    console.warn('Notification permit was denied.');
                } else {
                    console.warn('Notification permit was skipped.');
                }
            }).catch((error) => {
            });

        }
    }
});