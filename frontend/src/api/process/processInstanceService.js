import apiConfig from "../apiConfig";

const api = apiConfig();

const processInstanceService = {
  /**
   * Starts a new process instance
   * 
   * @param {Object} data Process instance request data
   * @param {string} data.definitionId Process definition ID
   * @param {string} [data.formId] Optional form ID
   * @param {Object} [data.formVariable] Form variables
   * @param {Object} [data.variable] Additional process variables
   * @returns {Promise<Object>} Process instance details
   * @property {string} instanceId Process instance ID
   * @property {string} definitionId Process definition ID
   * @property {string} status Process status
   * @property {string} startTime Start timestamp
   */
  async startProcessInstance(data) {
    try {
      const response = await api.post('/process-instances', data);
      return response.data;
    } catch (error) {
      const { response } = error;
      if (response?.data) throw response.data;
      throw error;
    }
  },

  /**
   * Gets status of a process instance
   * 
   * @param {string} instanceId ID of the process instance
   * @returns {Promise<Object>} Process instance details
   * @property {string} instanceId Process instance ID
   * @property {string} definitionId Process definition ID
   * @property {string} status Process status
   * @property {string} startTime Start timestamp
   * @property {string} [endTime] End timestamp (if completed)
   * @property {Array<Object>} [activeTasks] Active tasks
   * @property {string} activeTasks[].taskId Task ID
   * @property {string} activeTasks[].name Task name
   * @property {string} activeTasks[].assignee Assignee ID
   */
  async getProcessInstance(instanceId) {
    try {
      const response = await api.get(`/process-instances/${instanceId}`);
      return response.data;
    } catch (error) {
      const { response } = error;
      if (response?.data) throw response.data;
      throw error;
    }
  },

  /**
   * Retrieves all tasks for a process instance
   * 
   * @param {string} instanceId ID of the process instance
   * @returns {Promise<Array<Object>>} List of tasks
   * @property {string} taskId Task ID
   * @property {string} name Task name
   * @property {string} assignee Assignee ID
   */
  async getInstanceTasks(instanceId) {
    try {
      const response = await api.get(`/process-instances/${instanceId}/tasks`);
      return response.data;
    } catch (error) {
      const { response } = error;
      if (response?.data) throw response.data;
      throw error;
    }
  },

  /**
   * Completes a task in a process instance
   * 
   * @param {string} instanceId ID of the process instance
   * @param {string} taskId ID of the task to complete
   * @param {Object} data Task completion data
   * @returns {Promise<void>}
   */
  async completeTask(instanceId, taskId, data) {
    try {
      await api.post(`/process-instances/${instanceId}/tasks/${taskId}/complete`, data);
    } catch (error) {
      const { response } = error;
      if (response?.data) throw response.data;
      throw error;
    }
  },

  /**
   * Rejects a task in a process instance
   * 
   * @param {string} instanceId ID of the process instance
   * @param {string} taskId ID of the task to reject
   * @param {Object} data Rejection data containing variables
   * @returns {Promise<void>}
   */
  async rejectTask(instanceId, taskId, data) {
    try {
      await api.post(`/process-instances/${instanceId}/tasks/${taskId}/reject`, data);
    } catch (error) {
      const { response } = error;
      if (response?.data) throw response.data;
      throw error;
    }
  },

  /**
   * Retrieves all process instances
   * 
   * @param {Object} pageable Pagination configuration
   * @param {number} pageable.page Page number (0-indexed)
   * @param {number} pageable.size Number of items per page
   * @param {string} pageable.sort Sort criteria (format: "property,direction")
   * @returns {Promise<Array<Object>>} List of process instances
   * @property {string} instanceId Process instance ID
   * @property {string} definitionId Process definition ID
   * @property {string} status Process status
   * @property {string} startTime Start timestamp
   * @property {string} [endTime] End timestamp (if completed)
   * @property {Array<Object>} [activeTasks] Active tasks
   * @property {string} activeTasks[].taskId Task ID
   * @property {string} activeTasks[].name Task name
   * @property {string} activeTasks[].assignee Assignee ID
   */
  async getAllProcessInstances(pageable) {
    try {
      const response = await api.get('/process-instances', {
        params: pageable
      });
      return response.data;
    } catch (error) {
      const { response } = error;
      if (response?.data) throw response.data;
      throw error;
    }
  },

  /**
   * Retrieves process instances related to the current user
   * 
   * @param {Object} pageable Pagination configuration
   * @param {number} pageable.page Page number (0-indexed)
   * @param {number} pageable.size Number of items per page
   * @param {string} pageable.sort Sort criteria (format: "property,direction")
   * @returns {Promise<Array<Object>>} List of process instances
   * @property {string} instanceId Process instance ID
   * @property {string} definitionId Process definition ID
   * @property {string} status Process status
   * @property {string} startTime Start timestamp
   * @property {string} [endTime] End timestamp (if completed)
   * @property {Array<Object>} [activeTasks] Active tasks
   * @property {string} activeTasks[].taskId Task ID
   * @property {string} activeTasks[].name Task name
   * @property {string} activeTasks[].assignee Assignee ID
   */
  async getUserRelatedProcessInstances(pageable) {
    try {
      const response = await api.get('/process-instances/user', {
        params: pageable
      });
      return response.data;
    } catch (error) {
      const { response } = error;
      if (response?.data) throw response.data;
      throw error;
    }
  }
};

export default processInstanceService;
