import express from "express";
import { login, logout, me, signup } from "../controllers/auth.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, me);
router.post("/logout", logout);

export default router;
