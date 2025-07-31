import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import staticsService from '../api/system/staticsService';
import { useTranslation } from 'react-i18next';

/**
 * Dashboard page component
 * @returns {JSX.Element} Dashboard content
 */
const Dashboard = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {t} = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch available data points
        const availableRes = await staticsService.getAvailableDataPoints();
        const points = availableRes.data;
        
        // Then fetch latest values for all points
        const statsPromises = points.map(point => 
          staticsService.getLatestStatistic(point.name)
            .then(res => ({ 
              ...point, 
              value: res.data.value,
              asOfDate: res.data.asOfDate  // Capture timestamp
            }))
            .catch(() => ({ ...point, value: null, asOfDate: null })) // Handle individual errors
        );
        
        const statsData = await Promise.all(statsPromises);
        setDataPoints(statsData);
      } catch (err) {
        setError('Failed to load statistics');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-8'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataPoints.map(point => (
          <StatCard 
            key={point.name}
            title={t(point.name)}
            description={t(point.description)}
            value={point.value}
            asOfDate={point.asOfDate}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
