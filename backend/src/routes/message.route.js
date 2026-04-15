// message.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getContacts, getMessages, sendMessage, getMyConversations } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/contacts", protectRoute, getContacts);
router.get("/conversations", protectRoute, getMyConversations);   // ← ruta añadida
router.get("/:targetId", protectRoute, getMessages);              // ← ahora recibe targetId
router.post("/send", protectRoute, sendMessage);

export default router;