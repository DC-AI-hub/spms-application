import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, 
  TableRow, Paper, Chip, Dialog, 
  DialogTitle, DialogContent, DialogContentText, 
  DialogActions, Button 
} from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Process Instances View - Displays process instances in a table
 */
const ProcessInstancesView = () => {
  const { t } = useTranslation('userProcess');
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Mock data - will be replaced with API data in next phase
  const processInstances = [
    { 
      id: 'PI-1001', 
      processName: 'Employee Onboarding', 
      startTime: '2025-07-13T09:30:00Z', 
      currentStage: 'Document Submission', 
      status: 'Running',
      stages: [
        { name: 'Initiation', completed: '2025-07-13T09:32:00Z' },
        { name: 'Document Submission', completed: null },
        { name: 'Manager Approval', completed: null },
        { name: 'IT Setup', completed: null }
      ],
      assignees: ['John Smith', 'HR Department']
    },
    { 
      id: 'PI-1002', 
      processName: 'Expense Approval', 
      startTime: '2025-07-12T14:15:00Z', 
      currentStage: 'Manager Approval', 
      status: 'Running',
      stages: [
        { name: 'Submission', completed: '2025-07-12T14:20:00Z' },
        { name: 'Manager Approval', completed: null }
      ],
      assignees: ['Jane Doe']
    },
    { 
      id: 'PI-1003', 
      processName: 'Leave Request', 
      startTime: '2025-07-10T10:00:00Z', 
      currentStage: 'Completed', 
      status: 'Completed',
      stages: [
        { name: 'Submission', completed: '2025-07-10T10:05:00Z' },
        { name: 'Manager Approval', completed: '2025-07-11T09:30:00Z' },
        { name: 'HR Processing', completed: '2025-07-12T15:00:00Z' }
      ],
      assignees: []
    }
  ];

  const handleRowClick = (instance) => {
    setSelectedInstance(instance);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedInstance(null);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return t('processInstances.notCompleted');
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Running': return 'primary';
      case 'Completed': return 'success';
      case 'Canceled': return 'error';
      default: return 'default';
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom mb={3}>
        {t('processInstances.title')}
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="process instances table">
          <TableHead>
            <TableRow>
              <TableCell>{t('processInstances.table.instanceId')}</TableCell>
              <TableCell>{t('processInstances.table.processName')}</TableCell>
              <TableCell>{t('processInstances.table.startTime')}</TableCell>
              <TableCell>{t('processInstances.table.currentStage')}</TableCell>
              <TableCell>{t('processInstances.table.status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processInstances.map((instance) => (
              <TableRow 
                key={instance.id}
                hover
                onClick={() => handleRowClick(instance)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{instance.id}</TableCell>
                <TableCell>{instance.processName}</TableCell>
                <TableCell>{formatDateTime(instance.startTime)}</TableCell>
                <TableCell>{instance.currentStage}</TableCell>
                <TableCell>
                  <Chip 
                    label={instance.status} 
                    color={getStatusColor(instance.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Instance Details Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {t('processInstances.dialog.title', { id: selectedInstance?.id })}
        </DialogTitle>
        <DialogContent>
          {selectedInstance && (
            <>
              <Typography variant="h6" gutterBottom>
                {t('processInstances.dialog.stagesTitle')}
              </Typography>
              
              <Box mb={3}>
                {selectedInstance.stages.map((stage, index) => (
                  <Box key={index} mb={1}>
                    <Typography>
                      <strong>{stage.name}:</strong> {formatDateTime(stage.completed)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Typography variant="h6" gutterBottom>
                {t('processInstances.dialog.assigneesTitle')}
              </Typography>
              <Typography>
                {selectedInstance.assignees.length > 0 
                  ? selectedInstance.assignees.join(', ') 
                  : t('processInstances.dialog.noAssignees')}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t('processInstances.dialog.closeButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProcessInstancesView;
