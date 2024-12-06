import webPush from "web-push";


let subscriptions = [];

const VAPID_KEYS = {
  publicKey: process.env.VAPID_PUBLIC,
  privateKey: process.env.VAPID_PRIVATE,
};



webPush.setVapidDetails(
  "mailto:jeroratusny@gmail.com, mailto:m@g.com",
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);


// updateVapidDetails(); // Actualizar configuración de webPush






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

export const unsubscribe = async (req, res) => {
  try {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).send({ error: "Invalid subscription object" });
    }

    subscriptions = subscriptions.filter(
      (sub) => sub.endpoint !== subscription.endpoint
    );
    res.status(200).send("Unsubscribed successfully");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export const sendNotification = async () => {
  try {
    const myObject = {
      title: "Intento de acceso no autorizado detectado",
      body: "Intento de acceso no autorizado detectado en su sistema",
      icon: "path/to/icon.png",
      url: "https://yourwebsite.com",
    };

    const payload = JSON.stringify(myObject);
    const validSubscriptions = subscriptions.filter(
      (subscription) => subscription.endpoint
    );

    if (validSubscriptions.length === 0) {
      console.error("No valid subscriptions found");
      return { success: false, message: "No valid subscriptions found" };
    }

    for (const subscription of validSubscriptions) {
      try {
        await webPush.sendNotification(subscription, payload);
      } catch (error) {
        console.error(
          "Failed to send notification to subscription:",
          subscription,
          error
        );
      }
    }

    console.log("Notification sent:", myObject);
    return { success: true, message: "Notification sent" };
  } catch (err) {
    console.error("Error sending notification:", err);
    return { success: false, message: err.message };
  }
};
