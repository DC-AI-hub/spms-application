import apiConfig from "../apiConfig";

const api = apiConfig();

export default {
  /**
   * Get available statistics data points
   * @returns {Promise} Resolves with available data points
   */
  getAvailableDataPoints: () => api.get('/statistics/available-data-points'),
  
  /**
   * Get the latest statistic by name
   * @param {string} name - The name of the statistic
   * @returns {Promise} Resolves with the statistic data
   */
  getLatestStatistic: (name) => api.get(`/statistics/latest/${name}`),
  
  /**
   * Get statistics by date range
   * @param {Date} start - Start date
   * @param {Date} end - End date
   * @returns {Promise} Resolves with statistics data
   */
  getStatisticsByDateRange: (start, end) => api.get('/statistics', {
    params: {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    }
  })
};
