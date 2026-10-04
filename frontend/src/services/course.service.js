import { http } from './api';

export const courseService = {
  getAllCourses: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return http.get(`/api/courses${query ? `?${query}` : ''}`);
  },

  getCourseById: async (id) => {
    return http.get(`/api/courses/${id}`);
  },

  createCourse: async (courseData) => {
    return http.post('/api/courses', courseData);
  },

  updateCourse: async (id, courseData) => {
    return http.put(`/api/courses/${id}`, courseData);
  },

  deleteCourse: async (id) => {
    return http.delete(`/api/courses/${id}`);
  },

  togglePublish: async (id) => {
    return http.patch(`/api/courses/${id}/publish`);
  },

  saveCurriculum: async (courseId, curriculumData) => {
    return http.put(`/api/courses/${courseId}/curriculum`, curriculumData);
  },

  uploadScormPackage: async (formData) => {
    return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/scorm/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('lms_token') || ''}`
      }
    }).then(res => res.json());
  }
};

export default courseService;
