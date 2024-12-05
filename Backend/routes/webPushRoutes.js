import express from "express";
import {
  subscribe,
  sendNotification
} from "../controllers/webPushController.js";

const router = express.Router();

router.post("/subscribe", subscribe);

router.post("/sendNotification", sendNotification);

export default router;
