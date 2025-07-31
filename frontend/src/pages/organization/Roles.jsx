import React, { useState, useEffect } from 'react';
import {
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Box 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import roleService from '../../api/idm/roleService';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

/**
 * Role management component
 */
const Roles = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await roleService.getAll();
        setRoles(response.data.content);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const columns = [
    { 
      field: 'name', 
      headerName: t('common:name'),
      flex: 2 
    },
    {
      field: 'description',
      headerName: t('common:description'),
      flex: 3,
      valueGetter: (params) => params.value?.substring(0, 50) + (params.value?.length > 50 ? '...' : '')
    },
    {
      field: 'actions',
      headerName: t('common:actions'),
      sortable: false,
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ mr: 1 }}
          >
            {t('common:edit')}
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            {t('common:delete')}
          </Button>
        </Box>
      ),
    },
  ];

  const handleCreate = async (roleData) => {
    try {
      const createdRole = await roleService.create(roleData);
      setRoles([...roles, createdRole.data]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (roleData) => {
    try {
      const updatedRole = await roleService.update(roleData.id, roleData);
      setRoles(roles.map(role => 
        role.id === updatedRole.data.id ? updatedRole.data : role
      ));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDelete = (role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await roleService.delete(selectedRole.id);
      setRoles(roles.filter(role => role.id !== selectedRole.id));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder={t('common:search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          {t('common:create')}
        </Button>
      </Stack>

      <DataGrid
        rows={roles}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        loading={loading}
        slots={{ toolbar: GridToolbar }}
      />

      {/* Create Role Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('role.createDialog.title')}</DialogTitle>
        <DialogContent>
          <RoleForm 
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('role.editDialog.title')}</DialogTitle>
        <DialogContent>
          <RoleForm 
            role={selectedRole}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
            isEditMode={true}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('role.deleteDialog.title')}</DialogTitle>
        <DialogContent>
          <Box>
            {t('role.deleteDialog.confirm', { name: selectedRole?.name })}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
            >
              {t('common:confirm')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t('common:cancel')}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Roles;
