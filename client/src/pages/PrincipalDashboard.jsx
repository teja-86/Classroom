import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [newClassroomName, setNewClassroomName] = useState("");
  const [newClassroomStartTime, setNewClassroomStartTime] = useState("");
  const [newClassroomEndTime, setNewClassroomEndTime] = useState("");
  const [newClassroomDays, setNewClassroomDays] = useState("");
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editedTeacherData, setEditedTeacherData] = useState({});
  const [editedStudentData, setEditedStudentData] = useState({});

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchClassrooms();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/teacher/test`);
      const data = await response.json();
      if (data && data.users) {
        setTeachers(data.users);
      } else {
        console.error("Unexpected data format for teachers:", data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/student/test`);
      const data = await response.json();
      if (data && data.users) {
        setStudents(data.users);
      } else {
        console.error("Unexpected data format for students:", data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/classroom/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setClassrooms(data);
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
      setClassrooms([]);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/${type}/test/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
        type === 'teacher' ? fetchTeachers() : fetchStudents();
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error('Failed to delete');
    }
  };

  const handleUpdate = async (id, type, updates) => {
    console.log(updates);
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/${type}/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
        type === 'teacher' ? fetchTeachers() : fetchStudents();
      } else {
        toast.error('Failed to update');
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast.error('Failed to update');
    }
  };

  const handleCreateClassroom = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/classroom/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClassroomName, startTime: newClassroomStartTime, endTime: newClassroomEndTime, days: newClassroomDays }),
      });

      if (response.ok) {
        toast.success('Classroom created successfully!');
        setNewClassroomName('');
        setNewClassroomStartTime('');
        setNewClassroomEndTime('');
        setNewClassroomDays('');
        fetchClassrooms();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to create classroom: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleAssignClassroom = async () => {
    if (!selectedTeacher || !selectedClassroom) {
      toast.error('Teacher and Classroom must be selected.');
      return;
    }
    const response = await fetch(`${apiBaseUrl}/api/teacher/update/classroomAndStudent/${selectedTeacher}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classroom: selectedClassroom, student: selectedStudent }),
    });
    
    if (response.ok) {
      toast.success('Classroom assigned successfully!');
      fetchTeachers();
    } else {
      toast.error('Failed to assign classroom');
    }
  };

  const handleEditClick = (id, type) => {
    if (type === 'teacher') {
      setEditingTeacherId(id);
      const teacherData = teachers.find(teacher => teacher._id === id);
      setEditedTeacherData({
          name: teacherData.name,
          email: teacherData.email,
          classroom: teacherData.classroom.name // assuming classroom is populated
      });
  } else if (type === 'student') {
      setEditingStudentId(id);
      setEditedStudentData(students.find(student => student._id === id));
    }
  };

  
  const handleSaveClick = async (id, type) => {
    if (type === 'teacher') {
      await handleUpdate(id, 'teacher', editedTeacherData);
      setEditingTeacherId(null);
    } else if (type === 'student') {
      await handleUpdate(id, 'student', editedStudentData);
      setEditingStudentId(null);
    }
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'teacher') {
      setEditedTeacherData(prevData => ({ ...prevData, [name]: value }));
    } else if (type === 'student') {
      setEditedStudentData(prevData => ({ ...prevData, [name]: value }));
    }
  };
    
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-6">Principal Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Teachers</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className='bg-gray-200 text-gray-600 border-b border-gray-300'>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(teachers) && teachers.length > 0 ? (
    teachers.map((teacher) => (
        <tr key={teacher._id} className="hover:bg-gray-100">
            <td className="py-3 px-6 border-b">
                {editingTeacherId === teacher._id ? (
                    <input
                        type="text"
                        name="name"
                        value={editedTeacherData.name}
                        onChange={(e) => handleChange(e, 'teacher')}
                        className="border border-gray-300 p-2 rounded-md"
                    />  
                ) : (
                    teacher.name
                )}
            </td>
            
            <td className="py-3 px-6 border-b">
                {editingTeacherId === teacher._id ? (
                    <input
                        type="text"
                        name="email"
                        value={editedTeacherData.email}
                        onChange={(e) => handleChange(e, 'teacher')}
                        className="border border-gray-300 p-2 rounded-md"
                    />
                ) : (
                    teacher.email
                )}
            </td>
            <td className="py-3 px-6 border-b">
                {editingTeacherId === teacher._id ? (
                    <>
                        <button
                            onClick={() => handleSaveClick(teacher._id, 'teacher')}
                            className="bg-green-600 text-white px-4 py-2 rounded-md"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditingTeacherId(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => handleEditClick(teacher._id, 'teacher')}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(teacher._id, 'teacher')}
                            className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                        >
                            Delete
                        </button>
                    </>
                )}
            </td>
        </tr>
    ))
) : (
    <tr>
        <td colSpan="4" className="py-3 px-6 text-center">No teachers available</td>
    </tr>
)}

          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Students</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className='bg-gray-200 text-gray-600 border-b border-gray-300'>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(students) && students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-100">
                  <td className="py-3 px-6 border-b">
                    {editingStudentId === student._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editedStudentData.name}
                        onChange={(e) => handleChange(e, 'student')}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    ) : (
                      student.name
                    )}
                  </td>
                  
                  <td className="py-3 px-6 border-b">
                    {editingStudentId === student._id ? (
                      <input
                        type="text"
                        name="email"
                        value={editedStudentData.email}
                        onChange={(e) => handleChange(e, 'student')}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                    ) : (
                      student.email
                    )}
                  </td>
                  <td className="py-3 px-6 border-b">
                    {editingStudentId === student._id ? (
                      <>
                        <button
                          onClick={() => handleSaveClick(student._id, 'student')}
                          className="bg-green-600 text-white px-4 py-2 rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingStudentId(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(student._id, 'student')}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student._id, 'student')}
                          className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-6 text-center">No students available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Classroom</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Classroom Name:</label>
          <input
            type="text"
            value={newClassroomName}
            onChange={(e) => setNewClassroomName(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Time:</label>
          <input
            type="time"
            value={newClassroomStartTime}
            onChange={(e) => setNewClassroomStartTime(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Time:</label>
          <input
            type="time"
            value={newClassroomEndTime}
            onChange={(e) => setNewClassroomEndTime(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Days:</label>
          <input
            type="text"
            value={newClassroomDays}
            onChange={(e) => setNewClassroomDays(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>
        <button
          onClick={handleCreateClassroom}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Create Classroom
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assign Classroom</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Select Teacher:</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Select Classroom:</label>
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          >
            <option value="">Select Classroom</option>
            {classrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Select Student:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>{student.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAssignClassroom}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Assign Classroom
        </button>
      </div>
    </div>
  );
}
