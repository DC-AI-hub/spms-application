import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import DepartmentTable from './DepartmentTable';
import DepartmentDialog from './DepartmentDialog';
import TagsTable from './TagsTable';
import organizationService from '../../api/idm/organizationService';
import { useTranslation } from 'react-i18next';
import { Add } from '@mui/icons-material';

const Department = () => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null); // Added for edit functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Added for edit dialog
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await organizationService.getDepartments();
      setDepartments(response.content);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
      //TODO: implement the bulk Delete
      
  };

  const handleCreate = async (departmentData) => {
    try {
      await organizationService.createDepartment(departmentData);
      fetchDepartments();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  // Handle department edit
  const handleEdit = (department) => {
    setEditingDepartment(department);
    setIsEditDialogOpen(true);
  };

  // Handle department update
  const handleUpdate = async (departmentData) => {
    try {
      await organizationService.updateDepartment(editingDepartment.id, departmentData);
      fetchDepartments();
      setIsEditDialogOpen(false);
      setEditingDepartment(null);
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  return (
    <Box>
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
          {t('organization:department.create')}
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={!selectedIds.length}
          onClick={handleBulkDelete}
        >
          {t('common:delete')}
        </Button>
      </Stack>

      {/* Create Department Dialog */}
      <DepartmentDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        department={null}
        onSubmit={handleCreate}
      />

      {/* Edit Department Dialog */}
      <DepartmentDialog
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingDepartment(null);
        }}
        department={editingDepartment}
        onSubmit={handleUpdate}
      />

      <Dialog
        open={isTagsDialogOpen}
        onClose={() => setIsTagsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('organization:department.tagsDialog.title')}</DialogTitle>
        <DialogContent>
          <TagsTable tags={selectedTags} />
          <Button
            variant="contained"
            onClick={() => setIsTagsDialogOpen(false)}
            sx={{ mt: 2 }}
          >
            {t('common:close')}
          </Button>
        </DialogContent>
      </Dialog>

      <DepartmentTable 
        departments={departments}
        loading={loading}
        setSelectedTags={setSelectedTags}
        setIsTagsDialogOpen={setIsTagsDialogOpen}
        onEdit={handleEdit}  // Pass edit handler to table
      />
    </Box>
  );
};

export default Department;
