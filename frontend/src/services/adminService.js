import api from "./api";

// Student Services
export const createStudent = async (studentData) => {
    const response = await api.post("/students", studentData);
    return response.data;
};

export const searchStudents = async (term) => {
    const response = await api.get(`/students/search?term=${term}`);
    return response.data;
};

export const updateStudent = async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
};

// Teacher Services
export const createTeacher = async (teacherData) => {
    const response = await api.post("/teachers", teacherData);
    return response.data;
};

export const searchTeachers = async (term) => {
    const response = await api.get(`/teachers/search?term=${term}`);
    return response.data;
};

export const updateTeacher = async (id, teacherData) => {
    const response = await api.put(`/teachers/${id}`, teacherData);
    return response.data;
};

export const logout = async () => {
    // We might not need to send a body, but sending a post request.
    // Auth header is handled by interceptor if we have one, or we rely on token in storage.
    // Let's assume we need to attach token if not using cookies.
    // Assuming simple axios for now, let's just hit the endpoint.
    // If we need to send token, we should have an interceptor setup in api.js or manually add it.
    // For now assuming api.js might not have interceptor, let's check api.js again? 
    // Wait, let's just clear local storage and return if backend call fails or succeeds.
    try {
        await api.post("/admin/logout");
    } catch (e) {
        console.error("Logout failed", e);
    }
};

// Attendance Services
export const markAttendance = async (data) => {
    const response = await api.post("/attendance", data);
    return response.data;
};

export const getAttendanceHistory = async (userId) => {
    const response = await api.get(`/attendance/history?userId=${userId}`);
    return response.data;
};

export const getTodayAttendance = async (userType) => {
    const response = await api.get(`/attendance/today?userType=${userType}`);
    return response.data;
};

// Payment Services
export const addPayment = async (data) => {
    const response = await api.post("/payments", data);
    return response.data;
};

export const getPaymentHistory = async (userId) => {
    const response = await api.get(`/payments/history?userId=${userId}`);
    return response.data;
};

export const getPaymentSummary = async (userType) => {
    const response = await api.get(`/payments/summary?userType=${userType}`);
    return response.data;
};

// Class Services
// Batch
export const createBatch = async (data) => api.post("/class/batches", data).then(r => r.data);
export const getAllBatches = async () => api.get("/class/batches").then(r => r.data);
export const getBatchById = async (id) => api.get(`/class/batches/${id}`).then(r => r.data);
export const deleteBatch = async (id) => api.delete(`/class/batches/${id}`).then(r => r.data);
export const addStudentsToBatch = async (batchId, studentIds) =>
    api.post(`/class/batches/${batchId}/students`, { studentIds }).then(r => r.data);

// Course
export const createCourse = async (data) => api.post("/class/courses", data).then(r => r.data);
export const getCoursesByBatch = async (batchId) => api.get(`/class/courses/batch/${batchId}`).then(r => r.data);
export const getCoursesByTeacher = async (teacherId) => api.get(`/class/courses/teacher/${teacherId}`).then(r => r.data);
export const getCourseById = async (id) => api.get(`/class/courses/${id}`).then(r => r.data);
export const updateCourse = async (id, data) => api.put(`/class/courses/${id}`, data).then(r => r.data);
export const deleteCourse = async (id) => api.delete(`/class/courses/${id}`).then(r => r.data);

// Test
export const createTest = async (data) => api.post("/class/tests", data).then(r => r.data);
export const getTestsByCourse = async (courseId) => api.get(`/class/tests/course/${courseId}`).then(r => r.data);
export const getTestById = async (id) => api.get(`/class/tests/${id}`).then(r => r.data);
export const updateTest = async (id, data) => api.put(`/class/tests/${id}`, data).then(r => r.data);
export const deleteTest = async (id) => api.delete(`/class/tests/${id}`).then(r => r.data);

// Marks
export const updateMarks = async (testId, marksData) =>
    api.post("/class/marks", { testId, marksData }).then(r => r.data);
export const getResultsByStudentId = async (studentId) => api.get(`/class/results/student/${studentId}`).then(r => r.data);

// Notices
export const createNotice = async (data) => api.post("/class/notices", data).then(r => r.data);
export const getNoticesByBatch = async (batchId) => api.get(`/class/notices/batch/${batchId}`).then(r => r.data);
export const updateNotice = async (id, data) => api.put(`/class/notices/${id}`, data).then(r => r.data);
export const deleteNotice = async (id) => api.delete(`/class/notices/${id}`).then(r => r.data);
export const getNoticesByStudentId = async (studentId) => api.get(`/class/notices/student/${studentId}`).then(r => r.data);

// Teacher Class Management Services
export const addTeacherClassRecord = async (data) =>
    api.post("/class/teacher-class", data).then(r => r.data);

export const getTeacherClassHistory = async (teacherId) =>
    api.get(`/class/teacher-class/history?teacherId=${encodeURIComponent(teacherId)}`).then(r => r.data);

export const deleteTeacherClassRecord = async (id) =>
    api.delete(`/class/teacher-class/${id}`).then(r => r.data);
