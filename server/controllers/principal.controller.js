import Principal from "../models/principal.model.js";
import Student from "../models/student.model.js";

export const test = async (req, res) => {
    // res.json({ message: "API is Working" });
    try {
        const users = await Principal.find();

        return res.status(200).json({ users });
    } catch (error) {
        console.error("Error during test:", error);
        return res.status(500).json({ message: "Internal server error." });
        
    }
};

export const signIn = async(req, res) => {
    const { email, password } = req.body;

    try {
        const validUser = await Principal.findOne({ email: email });

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
    const { email, password } = req.body;

    try {
        const existingUser = await Principal.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const newUser = new Principal({
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



export const deleteTeacher = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Teacher.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ message: 'Teacher not found' });
      res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting teacher', error });
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


  export const updateTeacher = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const result = await Teacher.findByIdAndUpdate(id, updates, { new: true });
      if (!result) return res.status(404).json({ message: 'Teacher not found' });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating teacher', error });
    }
  };


  export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const result = await Student.findByIdAndUpdate(id, updates, { new: true });
      if (!result) return res.status(404).json({ message: 'Student not found' });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating student', error });
    }
  };




  export const assignClassroom = async (req, res) => {
    const { id } = req.params;
    const { classroomId } = req.body;
    try {
      const teacher = await Teacher.findById(id);
      if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
  
      // Ensure teacher is not already assigned to a classroom
      if (teacher.classroomId) return res.status(400).json({ message: 'Teacher is already assigned to a classroom' });
  
      teacher.classroomId = classroomId;
      await teacher.save();
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ message: 'Error assigning classroom', error });
    }
  };