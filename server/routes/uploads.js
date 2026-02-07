import express from "express";
import { getUploadSignature } from "../controllers/uploads.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/signature", auth, getUploadSignature);

export default router;
