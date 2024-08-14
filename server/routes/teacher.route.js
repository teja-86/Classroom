import express from "express";
import { test, signIn, signUp, updateTeacherName, deleteTeacher, updateClassroomAndStudentToTeacher } from "../controllers/teacher.controller.js";
import { updateTeacher } from "../controllers/teacher.controller.js";

const router = express.Router();

router.get("/test", test);
router.put('/:id', updateTeacherName);
router.post("/signIn", signIn);
router.post("/signUp", signUp);
router.put("/update/classroomAndStudent/:id", updateClassroomAndStudentToTeacher);
router.put("/update/:id", updateTeacher);
router.delete("/test/:id", deleteTeacher);


export default router;