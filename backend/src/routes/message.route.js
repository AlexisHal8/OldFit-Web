import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getContacts, getMessages, sendMessage } from "../controllers/message.controller.js";



const router = express.Router();

router.get("/contacts", protectRoute, getContacts);
router.get("/:id_conversacion", protectRoute, getMessages);
router.post("/send", protectRoute, sendMessage);

export default router;