// Student schema with reference to the Teacher
import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
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
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: false,
        default: null,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: false,
        default: null,
    }
});

const Student = mongoose.model('Student', StudentSchema);

export default Student;
