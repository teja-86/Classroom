import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [classrooms, setClassrooms] = useState([]); // To store classrooms for selection
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editedStudentData, setEditedStudentData] = useState({ name: '', email: '' });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/classroom/test`)
      .then(response => response.json())
      .then(data => setClassrooms(data))
      .catch(error => console.error('Error fetching classrooms:', error));
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetch(`${apiBaseUrl}/api/student/classroom/${selectedClassroom}`)
        .then(response => response.json())
        .then(data => setStudents(data))
        .catch(error => console.error('Error fetching students:', error));
    }
  }, [selectedClassroom]);

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setEditedStudentData({ name: student.name, email: student.email });
  };

  const handleSaveClick = async (studentId) => {
    await handleUpdate(studentId, editedStudentData);
    setEditingStudentId(null); // Stop editing after saving
  };

  const handleUpdate = async (studentId, updatedData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/student/update/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast.success('Student updated successfully');
        setStudents(students.map(student =>
          student._id === studentId ? { ...student, ...updatedData } : student
        ));
      } else {
        toast.error('Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('An error occurred while updating the student.');
    }
  };

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/student/delete/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Student deleted successfully');
        setStudents(students.filter(student => student._id !== studentId));
      } else {
        toast.error('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('An error occurred while deleting the student.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">Classroom Dashboard</h1>
    
      <div className="mb-6">
        <label htmlFor="classroomSelect" className="block text-xl font-medium text-gray-700 mb-2">Select Classroom:</label>
        <select
          id="classroomSelect"
          value={selectedClassroom}
          onChange={(e) => setSelectedClassroom(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        >
          <option value="">Select your classroom</option>
          {classrooms.map(classroom => (
            <option key={classroom._id} value={classroom._id}>
              {classroom.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="py-4 px-6 text-left text-md font-semibold">Student Name</th>
              <th className="py-4 px-6 text-left text-md font-semibold">Email</th>
              <th className="py-4 px-6 text-left text-md font-semibold">Actions</th>
            </tr>
          </thead>
          {Array.isArray(students) && students.length === 0 && (
            <tr>
              <td colSpan="3" className="py-4 px-6 text-center text-md text-gray-600">No students found</td>
            </tr>
          )}
          <tbody className="divide-y divide-gray-200">
            {students.map(student => (
              <tr key={student._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="py-3 px-6 text-md text-gray-800">
                  {editingStudentId === student._id ? (
                    <input
                      type="text"
                      value={editedStudentData.name}
                      onChange={(e) => setEditedStudentData({ ...editedStudentData, name: e.target.value })}
                      className="p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.name
                  )}
                </td>
                <td className="py-3 px-6 text-md text-gray-600">
                  {editingStudentId === student._id ? (
                    <input
                      type="email"
                      value={editedStudentData.email}
                      onChange={(e) => setEditedStudentData({ ...editedStudentData, email: e.target.value })}
                      className="p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    student.email
                  )}
                </td>
                <td className="py-3 px-6 text-md">
                  <div className="flex space-x-3">
                    {editingStudentId === student._id ? (
                      <button
                        onClick={() => handleSaveClick(student._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-500 transition duration-150 ease-in-out"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(student)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-500 transition duration-150 ease-in-out"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-500 transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
