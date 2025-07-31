import React, { useState, useEffect } from 'react';

import { 
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { useTheme } from '@mui/material';
import FormsTab from './process/FormsTab';
import { useTranslation } from 'react-i18next';
import ProcessTab from './process/ProcessTab';

/**
 * Process management page component
 * @returns {JSX.Element} Process content
 */
const Process = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ 
      p: theme.spacing(3),
      backgroundColor: theme.palette.background.default
    }}  className="flex flex-col h-full"
    >
      <Tabs 
        value={currentTab} 
        onChange={handleTabChange}
        sx={{ mb: 2 }}
      >
        <Tab label={t('process:tabs.management')} />
        <Tab label={t('process:tabs.forms')} />
      </Tabs>
      {currentTab === 0 && <ProcessTab/>}
      {currentTab === 1 && <FormsTab />}
  </Box> 
  );
};

export default Process;

