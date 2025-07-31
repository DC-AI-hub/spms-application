import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography,
  Grid, Box, CircularProgress
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent
} from '@mui/lab';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormComponent from '../form/FormComponent';
import StatusChip from '../common/StatusChip';
import processInstanceService from '../../api/process/processInstanceService';
import processService from '../../api/process/processService';

/**
 * Standalone Task Details Dialog Component
 * 
 * Displays detailed information about a task and provides completion functionality.
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.open - Controls dialog visibility
 * @param {Object} props.task - Selected task data
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onComplete - Task completion handler
 */
const TaskDetailsDialog = ({ open, task, onClose, onComplete }) => {
  const { t } = useTranslation(['userProcess', 'common']);
  const [formData, setFormData] = useState({});
  const [processInstance, setProcessInstance] = useState(null);
  const [activities, setActivities] = useState([]);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [metadataError, setMetadataError] = useState(null);
  const [activitiesError, setActivitiesError] = useState(null);
  const [processDef ,setProcessDef] = useState(null);
  const [formVersion , setFormVersion] = useState(null);

  // Fetch process instance when task changes
  useEffect(() => {
    if (!task?.processInstanceId) {
      setProcessInstance(null);
      return;
    }

    const fetchProcessInstance = async () => {
      setMetadataLoading(true);
      setMetadataError(null);
      try {
        const instanceData = await processInstanceService.getProcessInstance(task.processInstanceId);
        const processDef = await processService.getProcessVersionByDeploymentId(instanceData.deploymentId);
        var contextData = instanceData.contextValue;
        if(contextData.rejectionReason){
          setFormData({
            ...contextData.formData,
            submited: "false",
          })
        } else {
          setFormData({
            ...contextData.formData,
          });
        }
        setProcessDef(processDef);
        setProcessInstance(instanceData);
        setFormVersion(processDef.formVersion);
        console.log(processDef.formVersion)
      } catch (err) {
        setMetadataError(t('errors.fetchMetadataFailed'));
      } finally {
        setMetadataLoading(false);
      }
    };

    fetchProcessInstance();
  }, [task, t]);

  // Fetch activities when process instance is available
  useEffect(() => {
    if (!processInstance?.instanceId) {
      setActivities([]);
      return;
    }

    const fetchActivities = async () => {
      setActivitiesLoading(true);
      setActivitiesError(null);
      try {
        const activitiesData = await processInstanceService.getProcessActivities(
          processInstance.instanceId,
          { page: 0, size: 10, sort: 'startTime,desc' }
        );
        setActivities(activitiesData.content);
      } catch (err) {
        setActivitiesError(t('errors.fetchActivitiesFailed'));
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, [processInstance, t]);

  // Calculate activity duration
  const calculateDuration = (activity) => {
    if (!activity.endTime) return t('common:activity.ongoing');
    const diff = new Date(activity.endTime) - new Date(activity.startTime);
    const mins = Math.floor(diff / 60000);
    return `${mins} ${t('common:minutes')}`;
  };

  const handleFormSubmit = (data) => {
    console.log(data);
    var submitData = {
      ...data, 
      submited: "true"
    }
    setFormData(submitData);
    console.log(submitData)
  };

  const handleComplete = () => {
    onComplete({ ...task, formData });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen > 
      <DialogTitle>
        {t('userTasks.dialog.title', { title: task?.name })}
      </DialogTitle>
      <DialogContent>
        {task && (
          <div className="flex-row w-full h-full flex justify-between">
  
              {formVersion?.schema && (
                <FormComponent
                  schema={JSON.parse(formVersion.schema)}
                  data= {formData}
                  onSubmit={handleFormSubmit}
                />
              )}
  
            {/* Process Instance Section */}
            <div className='flex-col flex justify-between h-full'>

                {/* Metadata column */}
                <Grid item xs={12} md={5} >
                  {metadataLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress />
                    </Box>
                  ) : metadataError ? (
                    <Typography color="error">{metadataError}</Typography>
                  ) : processInstance ? (
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {t('userTasks.dialog.taskId')}: {task.taskId}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        {t('userTasks.dialog.assignee')}: {task.assignee || t('userTasks.unassigned')}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        {t('userTasks.dialog.instanceId')}: {processInstance.instanceId}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        {t('userTasks.dialog.status')}: <StatusChip status={task.status} value={task.status} />
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        {t('userTasks.dialog.startTime')}: {new Date(processInstance.startTime).toLocaleString()}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography>{t('userTasks.dialog.noInstance')}</Typography>
                  )}
                </Grid>
                {/* Activities column */}
                <Grid item xs={12} md={7} className="h-full overflow-scroll">
                  {activitiesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress />
                    </Box>
                  ) : activitiesError ? (
                    <Typography color="error">{activitiesError}</Typography>
                  ) : activities.length > 0 ? (
                    <Box sx={{ overflow: 'auto', pr: 1 }}>
                      <Timeline position="right">
                        {activities.filter(activity => {
                          return activity.activityType !== "sequenceFlow";
                        })
                          .map((activity, index) => (
                            <TimelineItem key={activity.id}>
                              <TimelineOppositeContent color="textSecondary" sx={{ flex: 0.3 }}>
                                {activity.endTime && (
                                  <div> {new Date(activity.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                )}
                              </TimelineOppositeContent>
                              <TimelineSeparator>
                                <TimelineDot color={activity.endTime ? "success" : "primary"} />
                                <TimelineConnector />
                              </TimelineSeparator>
                              <TimelineContent>
                                <Typography variant="subtitle2">{activity.activityName}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {t('common:activity.duration')}: {calculateDuration(activity)}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {activity.activityType}
                                </Typography>
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                      </Timeline>
                    </Box>
                  ) : (
                    <Typography>{t('common:noActivities')}</Typography>
                  )}
                </Grid>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t('userTasks.dialog.cancelButton')}
        </Button>
        <Button
          onClick={handleComplete}
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
        >
          {t('userTasks.dialog.completeButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsDialog;
