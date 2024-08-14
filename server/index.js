import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import principalRoute from "./routes/principal.route.js";
import teacherRoute from "./routes/teacher.route.js";
import studentRoute from "./routes/student.route.js";
import classroomRoute from "./routes/classroom.route.js";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");    
        
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
    });

app.listen(PORT, () => {
    console.log(`Server is listening on port number ${PORT}`);
});

app.use("/api/principal", principalRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/student", studentRoute);
app.use("/api/classroom", classroomRoute);

app.use("/api", principalRoute);
app.use("/api", studentRoute);
app.use('/api', classroomRoute);

