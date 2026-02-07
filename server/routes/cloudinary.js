import express from "express";
import auth from "../middlewares/auth.js";
import { getCloudinarySignature } from "../controllers/cloudinary.js";

const router = express.Router();

router.get("/sign", auth, getCloudinarySignature);

export default router;
