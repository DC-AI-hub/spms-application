import React from 'react';
import { 
  TextField, Button, Alert, IconButton, Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Roles management tab component
 * @param {Object} props - Component props
 * @param {Function} props.t - Translation function
 * @param {Array} props.roles - List of roles
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.error - Error object
 * @param {Object} props.pagination - Pagination state
 * @param {Function} props.setPagination - Set pagination function
 * @param {string} props.searchQuery - Search query
 * @param {Function} props.setSearchQuery - Set search query function
 * @param {Function} props.handleCreateRole - Create role handler
 * @param {Function} props.handleEditRole - Edit role handler
 * @param {Function} props.handleDeleteRole - Delete role handler
 * @returns {JSX.Element} Roles tab content
 */
const RolesTab = ({ 
  t, 
  roles, 
  loading, 
  error, 
  pagination, 
  setPagination, 
  searchQuery, 
  setSearchQuery,
  handleCreateRole,
  handleEditRole,
  handleDeleteRole
}) => {
  const roleColumns = [
    { field: 'id', headerName: t('access:columns.id'), width: 100 },
    { field: 'name', headerName: t('access:columns.name'), width: 200 },
    { field: 'description', headerName: t('access:columns.description'), width: 300 },
    {
      field: 'actions',
      headerName: t('access:columns.actions'),
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Tooltip title={t('common.edit')}>
            <IconButton onClick={() => handleEditRole(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <IconButton onClick={() => handleDeleteRole(params.row.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <TextField
            size="small"
            placeholder={t('access:searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search fontSize="small" />
            }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleCreateRole}
        >
          {t('access:createRoleButton')}
        </Button>
      </div>
      
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      <div className="h-[400px] w-full">
        <DataGrid
          rows={roles}
          columns={roleColumns}
          loading={loading}
          pagination
          paginationMode="server"
          rowCount={pagination.total}
          page={pagination.page}
          pageSize={pagination.pageSize}
          onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
          onPageSizeChange={(newSize) => setPagination(prev => ({ ...prev, pageSize: newSize }))}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </div>
    </div>
  );
};

export default RolesTab;
