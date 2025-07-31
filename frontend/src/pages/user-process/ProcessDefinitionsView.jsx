import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, CardActions, 
  Button, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  CircularProgress,Typography,
  Box
} from '@mui/material';
import TruncatedText from '../../components/common/TruncatedText';
import InlineTruncatedText from '../../components/common/InlineTruncatedText';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import processService from '../../api/process/processService';
import processInstanceService from "../../api/process/processInstanceService"
import { useError } from '../../contexts/ErrorContext';

/**
 * Process Definitions View - Displays active process definitions as cards
 */
const ProcessDefinitionsView = () => {
  const { t } = useTranslation('userProcess');
  const { showError } = useError();
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processDefinitions, setProcessDefinitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const size = 10; // Items per page

  // Fetch process definitions with infinite scroll
  const fetchProcessDefinitions = async () => {
    
    try {
      const response = await processService.getProcessDefinitions({
        page,
        size
      });

      // Get latest versions for each process
      const processesWithVersions = await Promise.all(
        response.content.map(async (process) => {
          try {
            const versionsResponse = await processService.getDefinitionVersions(
              process.id,
              { page: 0, size: 100, "include-bpmn":"false" }
            );
            const latestVersion = versionsResponse.content?.filter(x=>x.status ==="DEPLOYED")[0]?.version || t('userProcess:no-version-defined') ;
            const hasValidVersion = latestVersion && 
              latestVersion !== t('userProcess:no-version-defined') && 
              !latestVersion.includes('?');
            
            return {
              id: process.id,
              name: process.processName,
              version: latestVersion,
              description: process.processDescription,
              hasValidVersion,
              processOwner:process?.business?.username
            };
          } catch (error) {
            showError(t('userProcess:errors.versionFetchFailed', { process: process.name }));
            return {
              id: process.id,
              name: process.name,
              version: '?.?',
              description: process.description,
              hasValidVersion: false
            };
          }
        })
      );

      setProcessDefinitions(prev => [ ...processesWithVersions]);
      setHasMore(!response.last);
      setPage(prev => prev + 1);
    } catch (error) {
      showError(t('userProcess:errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    //console.log(isMounted)
    
    const fetchData = async () => {
      setLoading(true);
      await fetchProcessDefinitions();
    };

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProcess(null);
  };

  const handleStartProcess = async (process) => {
    setSelectedProcess(process);
    setIsDialogOpen(true);
  };

  const handleConfirmStart = async () => {
    try {
      console.log("start process")
      await processInstanceService.startProcessInstance({
        definitionId: selectedProcess.id,
        formId: null,
        variable : null,
        formVariable: null
        
      });
      setIsDialogOpen(false);
      setSelectedProcess(null);
      // TODO: Redirect to process instances view
    } catch (error) {
      showError(t('userProcess:errors.startProcessFailed'));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <div>
      {processDefinitions.length === 0 && !loading ? (
        <Box textAlign="center" py={10}>
          <Typography variant="h6" color="textSecondary">
            {t('processDefinitions.noProcesses')}
          </Typography>
        </Box>
      ) : (
        <InfiniteScroll
          dataLength={processDefinitions.length}
          next={fetchProcessDefinitions}
          hasMore={hasMore}
          loader={
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          }
        >
          <Grid container spacing={3} flex={1}>
            {processDefinitions.map((process) => (
              <Grid item xs={12} sm={6} md={3} key={process.id} >
                <Card variant="outlined" sx={{ width: 320, height:200, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <InlineTruncatedText 
                      text={process.name} 
                      maxChars={30}
                      variant="h6"
                      component="div"
                    />
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {t('processDefinitions.version')}: {process.version}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('processDefinitions.owner')}: {process.processOwner}
                    </Typography>
                    <InlineTruncatedText text={process.description} maxChars={20} />
                  </CardContent>
                  <CardActions className='flex-row-reverse mb-4 mr-4'>
                    {process.hasValidVersion && (
                      <Button 
                        size="small"
                        variant="contained"
                        onClick={() => handleStartProcess(process)}>
                        {t('processDefinitions.startButton')}
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}

      {/* Start Process Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {t('processDefinitions.startDialog.title', { process: selectedProcess?.name })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('processDefinitions.startDialog.description')}
          </DialogContentText>
          {/* Form for process variables would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t('processDefinitions.startDialog.cancelButton')}
          </Button>
          <Button 
            onClick={handleConfirmStart} 
            variant="contained"
            color="primary"
          >
            {t('processDefinitions.startDialog.confirmButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProcessDefinitionsView;
