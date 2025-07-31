import React, { useState } from 'react';
import { Box, Tab, Tabs, useTheme } from '@mui/material';
import ProcessDefinitionsView from './user-process/ProcessDefinitionsView';
import ProcessInstancesView from './user-process/ProcessInstancesView';
import UserTasksView from './user-process/UserTasksView';
import ProcessHistoryView from './user-process/ProcessHistoryView';
import { useTranslation } from 'react-i18next';

/**
 * Main user process page with tab navigation for process definitions, instances, and user tasks
 */
const UserProcess = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%',     p: theme.spacing(3)}} >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
<Tabs value={tabValue} onChange={handleTabChange}>
  <Tab label={t('userProcess:tabs.processDefinitions')} />
  <Tab label={t('userProcess:tabs.processInstances')} />
  <Tab label={t('userProcess:tabs.userTasks')} />
  <Tab label={t('userProcess:tabs.processHistory')} />
</Tabs>
      </Box>
<Box sx={{ pt: 3 }}>
  {tabValue === 0 && <ProcessDefinitionsView />}
  {tabValue === 1 && <ProcessInstancesView />}
  {tabValue === 2 && <UserTasksView />}
  {tabValue === 3 && <ProcessHistoryView />}
</Box>
    </Box>
  );
};

export default UserProcess;
