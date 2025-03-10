const API_URL = 'http://localhost:8080/eduhub/api/courses';

export const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
  return response;
};

export const getCourses = async () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al obtener cursos");

  return response.json();
};

export const getCourseById = async (courseId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getStudentsByCourse = async (courseId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${courseId}/students`, {
      headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getCoursesByInstructor = async (instructorId) => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(`${API_URL}/instructor/${instructorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) throw new Error("Error al obtener cursos del instructor");
  
    return response.json();
  };
  