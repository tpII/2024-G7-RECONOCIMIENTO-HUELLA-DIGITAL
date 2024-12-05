import webPush from "web-push";


let subscriptions = [];

const VAPID_KEYS = {
  publicKey: process.env.VAPID_PUBLIC,
  privateKey: process.env.VAPID_PRIVATE,
};

webPush.setVapidDetails(
  "mailto:jeroratusny@gmail.com",
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);


export const subscribe = async (req, res) => {
  try {
    const subscription = req.body;

    // Validate the subscription object
    if (
      !subscription ||
      !subscription.endpoint ||
      !subscription.keys ||
      !subscription.keys.p256dh ||
      !subscription.keys.auth
    ) {
      return res.status(400).send({ error: "Invalid subscription object" });
    }

    subscriptions.push(subscription);
    res.status(201).send("Subscribed successfully");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const payload = req.body;
    const validSubscriptions = subscriptions.filter(
      (subscription) => subscription.endpoint
    );

    if (validSubscriptions.length === 0) {
      return res.status(400).send({ error: "No valid subscriptions found" });
    }

    validSubscriptions.forEach(async (subscription) => {
      try {
        await webPush.sendNotification(subscription, JSON.stringify(payload));
      } catch (error) {
        console.error(
          "Failed to send notification to subscription:",
          subscription,
          error
        );
      }
    });

    res.status(200).send("Notification sent");

    console.log("Notification sent:", req.body);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};