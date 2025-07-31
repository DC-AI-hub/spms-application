import React, { useState } from 'react';
import { Tab, Tabs, Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Company from './organization/Company';
import Division from './organization/Division';
import Department from './organization/Department';
import OrganizationChart from './organization/OrganizationChart';
import Users from './organization/Users';

/**
 * Organization page with tabbed interface for managing different organization-related features
 */
const Organization = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ 
      width: '100%',
      p: theme.spacing(3),
      backgroundColor: theme.palette.background.default
    }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="organization tabs"
        sx={{ 
          mb: 3,
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main
          }
        }}
      >
        <Tab 
          label={t('organization:tabs.companyManagement')} 
          sx={{
            color: theme.palette.text.primary,
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          }}
        />
        <Tab 
          label={t('organization:tabs.divisions')} 
          sx={{
            color: theme.palette.text.primary,
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          }}
        />
        <Tab 
          label={t('organization:department.title')} 
          sx={{
            color: theme.palette.text.primary,
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          }}
        />
        <Tab 
          label={t('organization:tabs.organizationChart')} 
          sx={{
            color: theme.palette.text.primary,
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          }}
        />
        <Tab 
          label={t('organization:tabs.userManagement')} 
          sx={{
            color: theme.palette.text.primary,
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          }}
        />
      </Tabs>

      <Box sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        p: theme.spacing(3)
      }}>
        {currentTab === 0 && <Company />}
        {currentTab === 1 && <Division />}
        {currentTab === 2 && <Department />}
        {currentTab === 3 && <OrganizationChart />}
        {currentTab === 4 && <Users />}
      </Box>
    </Box>
  );
};

export default Organization;
