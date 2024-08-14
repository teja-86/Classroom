import mongoose from "mongoose";

const ClassroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    days: {
        type: String,
        required: true,
    },
});

const Classroom = mongoose.model("Classroom", ClassroomSchema);

export default Classroom;
