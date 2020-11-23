var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BCxGdewIa7dQn9igVdoSASl5aPnkNtkoVEhIroN1qrDdvnjXDeJ9ma_Xi88U9xnuHZzhYpS6k7Hid4QgNdkwJXs",
    "privateKey": "gifEhwjU8tafPw0lvdZVjYPvKukyzS9dg421jhUNu4k"
};

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/d-HQkdG30xM:APA91bH7QXHvemgVJtUHK7c0uMPIaCO3FYplDpFlR_VjgxDlHoQDSez_8VfRG0UZpmQLNG6tBD1RaNWkiBQ058KXpy_QzyxJH0ZkmJpBs5xc4wfB54gx07MNBZJrLJp4O-nTorGzBtWa",
    "keys": {
        "p256dh": "BJngVCjABMLdxnoqudsbMMfFYRCBLNn6tOth+Fle9oB4VdIkCi5nLzuCaLUkuKUEAiTElEFAgfEKWq/NJN9pmAw=",
        "auth": "JFc2z/AUcLN5V5x3ADXYZA=="
    }
};
var payload = 'Welcome To Football MPWA - Submission 2';

var options = {
    gcmAPIKey: '1005271808584',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);