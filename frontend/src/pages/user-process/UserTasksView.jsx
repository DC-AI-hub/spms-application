import React, { useState } from 'react';
import { 
  Box, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, 
  TableRow, Paper, Chip, Dialog, 
  DialogTitle, DialogContent, DialogContentText, 
  DialogActions, Button, TextField, IconButton,
  Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';

/**
 * User Tasks View - Displays tasks assigned to the user
 */
const UserTasksView = () => {
  const { t } = useTranslation('userProcess');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  
  // Mock data - will be replaced with API data in next phase
  const userTasks = [
    { 
      id: 'T-1001', 
      title: 'Approve Vacation Request', 
      processName: 'Leave Request', 
      dueDate: '2025-07-15', 
      priority: 'High',
      status: 'Pending',
      formData: {
        employee: 'John Smith',
        startDate: '2025-08-01',
        endDate: '2025-08-07',
        reason: 'Family vacation'
      }
    },
    { 
      id: 'T-1002', 
      title: 'Review Expense Report', 
      processName: 'Expense Approval', 
      dueDate: '2025-07-14', 
      priority: 'Medium',
      status: 'Pending',
      formData: {
        employee: 'Jane Doe',
        totalAmount: 245.75,
        items: ['Meals: $85', 'Transportation: $160.75']
      }
    },
    { 
      id: 'T-1003', 
      title: 'Complete Onboarding Documents', 
      processName: 'Employee Onboarding', 
      dueDate: '2025-07-20', 
      priority: 'Low',
      status: 'Pending',
      formData: {
        newHire: 'Robert Chen',
        documents: ['NDA', 'Tax Forms', 'Benefits Enrollment']
      }
    }
  ];

  const handleDetailsClick = (task) => {
    setSelectedTask(task);
    setIsDetailsDialogOpen(true);
  };

  const handleDeclineClick = (task) => {
    setSelectedTask(task);
    setIsDeclineDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleCloseDeclineDialog = () => {
    setIsDeclineDialogOpen(false);
    setSelectedTask(null);
    setDeclineReason('');
  };

  const handleCompleteTask = () => {
    console.log(`Completing task: ${selectedTask.title}`);
    setIsDetailsDialogOpen(false);
    // TODO: Update task status to 'Completed' via API
  };

  const handleConfirmDecline = () => {
    console.log(`Declining task: ${selectedTask.title} with reason: ${declineReason}`);
    // TODO: Update task status to 'Declined' via API
    handleCloseDeclineDialog();
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const renderFormData = (formData) => {
    return Object.entries(formData).map(([key, value], index) => (
      <Box key={index} mb={1}>
        <Typography>
          <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
        </Typography>
      </Box>
    ));
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom mb={3}>
        {t('userTasks.title')}
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user tasks table">
          <TableHead>
            <TableRow>
              <TableCell>{t('userTasks.table.taskTitle')}</TableCell>
              <TableCell>{t('userTasks.table.processName')}</TableCell>
              <TableCell>{t('userTasks.table.dueDate')}</TableCell>
              <TableCell>{t('userTasks.table.priority')}</TableCell>
              <TableCell>{t('userTasks.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userTasks.map((task) => (
              <TableRow 
                key={task.id}
                hover
                sx={{ 
                  backgroundColor: isOverdue(task.dueDate) ? '#fff8e1' : 'inherit',
                  '&:hover': { backgroundColor: isOverdue(task.dueDate) ? '#fff5cc' : '#f5f5f5' }
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {task.title}
                    {isOverdue(task.dueDate) && (
                      <Chip 
                        label={t('userTasks.overdue')} 
                        color="error" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{task.processName}</TableCell>
                <TableCell>
                  {new Date(task.dueDate).toLocaleDateString()}
                  {isOverdue(task.dueDate) && (
                    <Tooltip title={t('userTasks.overdueTooltip')}>
                      <InfoIcon color="error" sx={{ ml: 1, fontSize: '1rem' }} />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={task.priority} 
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title={t('userTasks.detailsTooltip')}>
                      <IconButton 
                        color="primary"
                        onClick={() => handleDetailsClick(task)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('userTasks.completeTooltip')}>
                      <IconButton 
                        color="success"
                        onClick={() => handleDetailsClick(task)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('userTasks.declineTooltip')}>
                      <IconButton 
                        color="error"
                        onClick={() => handleDeclineClick(task)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Task Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {t('userTasks.dialog.title', { title: selectedTask?.title })}
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {t('userTasks.dialog.processName')}: {selectedTask.processName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {t('userTasks.dialog.dueDate')}: {new Date(selectedTask.dueDate).toLocaleDateString()}
                {isOverdue(selectedTask.dueDate) && (
                  <Chip 
                    label={t('userTasks.overdue')} 
                    color="error" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {t('userTasks.dialog.priority')}: 
                <Chip 
                  label={selectedTask.priority} 
                  color={getPriorityColor(selectedTask.priority)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              <Typography variant="h6" mt={3} mb={2}>
                {t('userTasks.dialog.taskDetails')}
              </Typography>
              {renderFormData(selectedTask.formData)}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>
            {t('userTasks.dialog.cancelButton')}
          </Button>
          <Button 
            onClick={handleCompleteTask}
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
          >
            {t('userTasks.dialog.completeButton')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Task Dialog */}
      <Dialog open={isDeclineDialogOpen} onClose={handleCloseDeclineDialog}>
        <DialogTitle>
          {t('userTasks.declineDialog.title', { title: selectedTask?.title })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            {t('userTasks.declineDialog.description')}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={t('userTasks.declineDialog.reasonLabel')}
            type="text"
            fullWidth
            variant="outlined"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeclineDialog}>
            {t('userTasks.declineDialog.cancelButton')}
          </Button>
          <Button 
            onClick={handleConfirmDecline}
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            disabled={!declineReason.trim()}
          >
            {t('userTasks.declineDialog.confirmButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTasksView;
