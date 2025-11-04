import express from "express";
import { protect } from "../middleware/auth.js";
import { sendMessage, allMessages } from "../controllers/messageController.js";

const router = express.Router();

router.use(protect);
router.post("/", sendMessage);
router.get("/:chatId", allMessages);

export default router;
