import express from "express";
import {
  subscribe,
  sendNotification,
  unsubscribe,
} from "../controllers/webPushController.js";

const router = express.Router();

router.post("/subscribe", subscribe);

router.post("/sendNotification", sendNotification);

router.post("/unsubscribe", unsubscribe);

export default router;
