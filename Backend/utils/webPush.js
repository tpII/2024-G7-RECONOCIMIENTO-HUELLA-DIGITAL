import webPush from 'web-push';



const VAPID_KEYS = {
  publicKey: env.VAPID_PUBLIC,
  privateKey: env.VAPID_PRIVATE,
};

webPush.setVapidDetails(
    'mailto:jeroratusny@gmail.com',
    VAPID_KEYS.publicKey,
    VAPID_KEYS.privateKey
);

