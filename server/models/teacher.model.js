import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        default: [],
    }],
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom", // Reference to the Classroom model
        required: false,
        default: null,
    }
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

export default Teacher;
