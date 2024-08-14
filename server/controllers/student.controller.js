import Student from "../models/student.model.js";

export const test = async (req, res) => {
    // res.json({ message: "API is Working" });
    try {
        const users = await Student.find().populate('classroom').populate('teacher').exec();

        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error during test:", error);
        return res.status(500).json({ message: "Internal server error." });
        
    }
};

export const signIn = async(req, res) => {
    const { email, password } = req.body;

    try {
        const validUser = await Student.findOne({ email: email });

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

export const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await Student.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const newUser = new Student({
            name : name,
            email: email,
            password: password,
        });

        await newUser.save();

        return res
            .status(201)
            .json({ user: newUser });
    } catch (error) {
        console.error("Error during sign-up:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const getStudentsByClassroom = async (req, res) => {
    const { classroom } = req.params;
    try {
        const students = await Student.find({ classroom });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
};


export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const {name, teacher} = req.body;

    try {
        const student = await Student.findByIdAndUpdate(id, {name, teacher}, { new: true });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error });
    }
};



export const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Student.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
};



export const getStudentsByClassroomId = async (req, res) => {
    const { classroomId } = req.params; // Extract classroomId from the URL parameter
  
    try {
      // Fetch students where classroomId matches the provided value
      const students = await Student.find({ classroomId });
  
      // Check if any students are found
      if (!students.length) {
        return res.status(404).json({ message: 'No students found for this classroom' });
      }
  
      // Respond with the found students
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };