import Classroom from '../models/classroom.model.js';

export const createClassroom = async (req, res) => {

    const { name, startTime, endTime, days } = req.body;

    if (!name || !startTime || !endTime || !days) {
        return res.status(400).json({ message: 'Name, startTime, days, and endTime are required.' });
    }
    try {
        const classroom = new Classroom({
            name,
            startTime,
            endTime,
            days,
        });
      await classroom.save();
      res.status(201).json(classroom);
    } catch (error) {
      res.status(500).json({ message: 'Error creating classroom', error });
    }
  };


  export const test = async (req, res) => {
    try {
        
        const classrooms = await Classroom.find({});
        
        res.status(200).json(classrooms);
    } catch (error) {
        console.error("Error during fetching classrooms:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
