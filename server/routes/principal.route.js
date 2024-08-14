import express from "express";
import { test, signIn, signUp, deleteTeacher, updateTeacher, updateStudent, deleteStudent } from "../controllers/principal.controller.js";

const router = express.Router();

router.get("/test", test);
router.post("/signIn", signIn);
router.post("/signUp", signUp);
router.delete("/teacher/:id", deleteTeacher); // Delete teacher
router.delete("/student/:id", deleteStudent); // Delete student
router.put("/teacher/:id", updateTeacher); // Update teacher
router.put("/student/:id", updateStudent); // Update student

export default router;