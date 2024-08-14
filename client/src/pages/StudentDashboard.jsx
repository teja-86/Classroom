import { useEffect, useState } from "react";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [classrooms, setClassrooms] = useState([]); // To store classrooms for selection

  useEffect(() => {
    // Fetch classrooms to populate the dropdown
    fetch('http://localhost:3000/api/classroom/test')
      .then(response => response.json())
      .then(data => setClassrooms(data))
      .catch(error => console.error('Error fetching classrooms:', error));
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetch(`http://localhost:3000/api/student/classroom/${selectedClassroom}`)
        .then(response => response.json())
        .then(data => setStudents(data))
        .catch(error => console.error('Error fetching students:', error));
    } 
  }, [selectedClassroom]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
  <h1 className="text-4xl font-extrabold mb-8 text-blue-600">Students Dashboard</h1>

  <div className="mb-6">
    <label htmlFor="classroomSelect" className="block text-xl font-medium text-gray-800 mb-3">Select Classroom:</label>
    <select
      id="classroomSelect"
      value={selectedClassroom}
      onChange={(e) => setSelectedClassroom(e.target.value)}
      className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
    >
      <option value="">Select a classroom</option>
      {classrooms.map(classroom => (
        <option key={classroom._id} value={classroom._id}>
          {classroom.name}
        </option>
      ))}
    </select>
  </div>

  <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="py-4 px-6 text-left text-md font-semibold">Student Name</th>
          <th className="py-4 px-6 text-left text-md font-semibold">Email</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {students.map(student => (
          <tr key={student._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
            <td className="py-3 px-6 text-md text-gray-800">{student.name}</td>
            <td className="py-3 px-6 text-md text-gray-600">{student.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}
