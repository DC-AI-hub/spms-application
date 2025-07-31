import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { TextField, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '../theme/ThemeContext';

/**
 * Sidebar component with navigation links
 * @returns {JSX.Element} Sidebar structure
 */
const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const navigationItems = [
    {
      path: '/dashboard',
      label: t('sidebar:dashboard'),
      icon: <DashboardIcon className="mr-3 h-6 w-6" />
    },
    {
      path: '/organization',
      label: t('sidebar:organization'),
      icon: <PeopleIcon className="mr-3 h-6 w-6" />
    },
    {
      path: '/access',
      label: t('sidebar:access'),
      icon: <LockIcon className="mr-3 h-6 w-6" />
    },
    {
      path: '/process',
      label: t('sidebar:process'),
      icon: <TimelineIcon className="mr-3 h-6 w-6" />
    },
    {
      path: '/user-process',
      label: t('sidebar:userProcess'),
      icon: <AssignmentIcon className="mr-3 h-6 w-6" />
    }
  ];

  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="flex flex-col h-full border-r" style={{ 
      backgroundColor: theme.palette.background.default,
      overflow: 'hidden'
    }}>
      {!isSmallScreen && (
        <div className="px-4 pt-4 overflow-hidden">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder={t('sidebar:search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" className="mr-2" style={{ color: theme.palette.text.secondary }} />,
              endAdornment: searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ color: theme.palette.text.secondary }}
                >
                  ✕
                </button>
              ),
              style: {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary
              }
            }}
            className="mb-4"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden" style={{ backgroundColor: theme.palette.background.default }}>
        <nav className={`flex-1 ${isSmallScreen ? 'px-1' : 'px-2'} py-4 space-y-1`} style={{ backgroundColor: theme.palette.background.default }}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center ${isSmallScreen ? 'px-1 justify-center' : 'px-2'} py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:text-gray-700 dark:bg-gray-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100'
                  }`
                }
              >
                {React.cloneElement(item.icon, { className: isSmallScreen ? 'h-6 w-6' : 'mr-3 h-6 w-6' })}
                {!isSmallScreen && (
                  <span className="transition-all duration-200 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))
          ) : (
            <div className="px-2 py-2 text-sm" style={{ color: theme.palette.text.secondary }}>
              {t('sidebar:noItems')}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
