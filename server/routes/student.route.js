import express from "express";
import { test, signIn, signUp, getStudentsByClassroom, updateStudent, deleteStudent, getStudentsByClassroomId } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/test", test);
router.delete('/test/:id', deleteStudent);
router.post("/signIn", signIn);
router.post("/signUp", signUp);
router.get('/classroom/:classroom', getStudentsByClassroom);
router.put('/update/:id', updateStudent);
router.delete('/delete/:id', deleteStudent);
router.get("/classroom/:id", getStudentsByClassroomId);

export default router;