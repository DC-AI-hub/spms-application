import api from '../apiConfig';

/**
 * Service for fetching form schemas by task ID
 */
const getFormSchemaByTaskId = async (taskId) => {
  try {
    const response = await api.get(`/api/user-process/tasks/${taskId}/form-schema`);
    return response.data;
  } catch (error) {
    console.error('Error fetching form schema:', error);
    return null;
  }
};

export default {
  getFormSchemaByTaskId
};
