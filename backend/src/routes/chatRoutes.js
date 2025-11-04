import express from "express";
import { protect } from "../middleware/auth.js";
import { accessChat, fetchChats } from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);
router.post("/", accessChat);
router.get("/", fetchChats);

export default router;
