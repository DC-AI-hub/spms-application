import apiConfig from "../apiConfig";

const api = apiConfig();

/**
 * System Service - Handles system-level API calls
 */
export default {
  /**
   * Get menu structure based on user roles
   * @returns {Promise} Resolves with menu structure
   */
  getMenu: () => api.get('/system/menu'),

  /**
   * Get login information
   * @returns {Promise} Resolves with login status and username
   */
  getLoginInfo: () => api.get('/system/login-info'),

  /**
   * Get frontend configuration
   * @returns {Promise} Resolves with frontend configuration
   */
  getConfig: () => api.get('/system/config'),

  /**
   * Health check endpoint
   * @returns {Promise} Resolves with system status
   */
  healthCheck: () => api.get('/system/health'),

  /**
   * Logout user
   * @returns {Promise} Resolves when logout is successful
   */
  logout: () => api.post('/system/logout')
};
