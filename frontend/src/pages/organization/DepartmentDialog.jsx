import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DepartmentForm from './DepartmentForm';
import { useTranslation } from 'react-i18next';

const DepartmentDialog = ({ open, onClose, department, onSubmit }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {department ? t('organization:department.editDialog.title') : t('organization:department.createDialog.title')}
      </DialogTitle>
      <DialogContent>
        <DepartmentForm 
          department={department} 
          onSubmit={handleSubmit} 
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentDialog;
