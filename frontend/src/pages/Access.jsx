import React, { useState, useEffect } from 'react';
import { 
  Tabs, Tab, Alert, Button,
  Box
} from '@mui/material';
import RoleDialog from './access/components/RoleDialog';
import roleService from '../api/idm/roleService';
import userService from '../api/idm/userService';
import { useTranslation } from 'react-i18next';
import RolesTab from './access/RolesTab';
import PermissionsTab from './access/PermissionsTab';
import HierarchyTab from './access/HierarchyTab';
import UserMappingTab from './access/UserMappingTab';

/**
 * Access management page with role-focused tabs
 * @returns {JSX.Element} Access content
 */
const Access = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [users, setUsers] = useState([]);
  // Removed unused state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    total: 0
  });

  // Fetch roles from API
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const params = { 
        page: pagination.page,
        size: pagination.pageSize,
        ...(searchQuery && { name: searchQuery, description: searchQuery })
      };
      
      const response = await roleService.search(params);
      setRoles(response.data.content);
      setPagination(prev => ({ ...prev, total: response.data.totalElements }));
    } catch (err) {
      setError(t('access:errors.fetchRoles'));
    } finally {
      setLoading(false);
    }
  };

  // Parent-related functions removed (now in HierarchyTab)

  const fetchUsers = async () => {
    try {
      const response = await userService.search({query:""});
      setUsers(response.data);
    } catch (err) {
      setError(t('access:errors.fetchUsers'));
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [pagination.page, pagination.pageSize, searchQuery]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCreateRole = () => {
    setCurrentRole(null);
    setOpenDialog(true);
  };

  const handleEditRole = (role) => {
    setCurrentRole(role);
    setOpenDialog(true);
  };

  const handleDeleteRole = async (id) => {
    try {
      await roleService.delete(id);
      fetchRoles();
    } catch (err) {
      setError(t('access:errors.deleteRole'));
    }
  };

  const handleSubmitRole = async (roleData) => {
    try {
      if (currentRole) {
        await roleService.update(currentRole.id, roleData);
      } else {
        await roleService.create(roleData);
      }
      setOpenDialog(false);
      fetchRoles();
    } catch (err) {
      setError(currentRole 
        ? t('access:errors.updateRole') 
        : t('access:errors.createRole'));
    }
  };

  // Permission-related functions removed (now in PermissionsTab)

  // roleColumns removed (now in RolesTab)

  return (
    <Box className='p-8'>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="access management tabs">
        <Tab label={t('access:tabs.roles')} />
        <Tab label={t('access:tabs.permissions')} />
        <Tab label={t('access:tabs.hierarchy')} />
        <Tab label={t('access:tabs.userMapping')} />
      </Tabs>
      
      <div className="mt-4">
        {activeTab === 0 && (
          <RolesTab 
            t={t}
            roles={roles}
            loading={loading}
            error={error}
            pagination={pagination}
            setPagination={setPagination}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleCreateRole={handleCreateRole}
            handleEditRole={handleEditRole}
            handleDeleteRole={handleDeleteRole}
          />
        )}
        
        {activeTab === 1 && (
          <PermissionsTab 
            t={t}
            roles={roles}
            error={error}
            setError={setError}
          />
        )}
        
        {activeTab === 2 && (
          <HierarchyTab 
            t={t}
            roles={roles}
            error={error}
            setError={setError}
          />
        )}
        
        {activeTab === 3 && (
          <UserMappingTab 
            t={t}
            users={users}
            error={error}
            setError={setError}
          />
        )}
      </div>
      
      {/* Role Create/Edit Dialog */}
      <RoleDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        currentRole={currentRole}
        onSubmit={handleSubmitRole}
        t={t}
      />
    </Box>
  );
};

export default Access;
