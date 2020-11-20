var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BMN2o9ZLFFo1oFAan-4jEe1D_ldvcAsMd8ugjJkOXMEsrmGsZaNy9VM_wrVcJLofbA_zsL5A91PW2aiSBaUwdww",
    "privateKey": "-XLefmaFDTfyicni3l0j4TSgNPdrYOuK28cklnPgsOA"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/dSGbCGKJxNA:APA91bGbcdd6aEYfHmhGN4uPHaUD2LcyZe008eLGyy9XjYkUueXoSPWkHnJ17Dr8SM9y1iq6oU5UnKz1d6blTp8qI3YWpL28i4lNbIvygMyjIdoPvWhfQKXGguJol1mI7o8nBpg9BV9N",
    "keys": {
        "p256dh": "BNkZilG98qTj1NURrVHKPYO8BA/lyxJMV9YgtyMAeXnHwfdKD8Y83PipGCkMdq9TnpBshSxnICRZfY9e91KDsy8=",
        "auth": "9tkEAoFzY8GVSjckCZ8jmw=="
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