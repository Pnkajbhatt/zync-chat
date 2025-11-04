import express from "express";
import { protect } from "../middleware/auth.js";
import { searchUsers, getMe } from "../controllers/userController.js";

const router = express.Router();

router.use(protect);
router.get("/", searchUsers);
router.get("/me", getMe);

export default router;
