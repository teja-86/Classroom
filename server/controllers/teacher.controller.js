import Classroom from "../models/classroom.model.js";
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";

export const test = async (req, res) => {
    // res.json({ message: "API is Working" });
    try {
        const users = await Teacher.find().populate('classroom').exec();;

        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error during test:", error);
        return res.status(500).json({ message: "Internal server error." });
        
    }
};

export const signIn = async(req, res) => {
    const { email, password } = req.body;

    try {
        const validUser = await Teacher.findOne({ email: email });

        if (!validUser) {
            console.log("User not found!");
            return res.status(404).json({ message: "User not found!" });
        }

        if (password !== validUser.password) {
            console.log("Invalid credentials!");
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        return res
            .status(200)
            .json({ message: "Sign in successful!", user: validUser });
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const signUp = async(req, res) => {
    const { email, password, name, classroomId  } = req.body;

    try {
        
        const existingUser = await Teacher.findOne({ email });
        const validClassroomId = classroomId && mongoose.Types.ObjectId.isValid(classroomId) ? classroomId : null;

        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const newUser = new Teacher({
            email: email,
            password: password,
            name : name,
            classroomId: validClassroomId
        });

        await newUser.save();

        return res
            .status(201)
            .json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        console.error("Error during sign-up:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const updateTeacher = async (req, res) => {
    const { id } = req.params; 
    const { name, classroom, email } = req.body; // Extract the classroom from the request body

    try {
        const classroomExists = await Classroom.findOne({ name: classroom });
        if (!classroomExists) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        // find by id and update the teacher
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id, // Find teacher by ID
            {name, classroom: classroom._id , email}, // Update with the classroom's ID
            { new: true } // Return the updated document
        );

        // Check if the teacher was found and updated
        if (!updatedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Respond with the updated teacher data
        res.status(200).json(updatedTeacher);
    } catch (error) {
        console.error("Error updating teacher:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateTeacherName = async (req, res) => {
    const { id } = req.params;  // Get the ID from the route parameters
    const { name } = req.body;  // Get the new name from the request body

    if (!name) {
        return res.status(400).json({ message: 'Name is required.' });
    }

    try {
        // Find the teacher by ID and update the name
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            { name },
            { new: true }  // Return the updated document
        );

        // Check if the teacher was found and updated
        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        // Send the updated teacher data as a response
        res.status(200).json(updatedTeacher);
    } catch (error) {
        res.status(500).json({ message: 'Error updating teacher name', error });
    }
};

export const deleteTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found.' });
        }

        res.status(200).json({ message: 'Teacher deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting teacher', error });
    }
};


export const updateClassroomAndStudentToTeacher = async (req, res) => {

    const { id } = req.params; // Extract teacher ID from the URL parameter
    const { classroom , student} = req.body; // Extract classroom ID from the request body

    try {
        // Check if the teacher exists
        const teacher = await Teacher.findById(id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        // Check if the classroom exists
        const classroomExists = await Classroom.findById(classroom);
        if (!classroomExists) return res.status(404).json({ message: 'Classroom not found' });

        // Update the teacher's classroom field
        teacher.classroom = classroom;
        teacher.students = student;
        await teacher.save(); // Save the updated teacher

        await Student.updateMany(
            { _id: { $in: student } },
            { $set: { classroom: classroom, teacher: id } }
        );

        // Respond with the updated teacher data
        res.status(200).json(teacher);
    } catch (error) {
        console.error('Error assigning classroom to teacher:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};