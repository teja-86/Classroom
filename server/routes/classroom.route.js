import express from "express";
import { createClassroom, test } from "../controllers/classroom.controller.js";


const router = express.Router();

router.post("/create", createClassroom);
router.get("/test", test)

export default router;