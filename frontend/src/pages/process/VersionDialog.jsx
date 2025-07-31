import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StatusChip from '../../components/common/StatusChip';

const VersionDialog = ({ open, versions, onClose, onActivate }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('process:versionDialog.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {versions?.map(version => (
            <Grid item xs={12} sm={6} md={4} key={version.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: version.status === 'DRAFT' ? 'pointer' : 'default',
                  opacity: version.status === 'INACTIVE' ? 0.6 : 1,
                  border: version.status === 'ACTIVE' ? '2px solid #4caf50' : '1px solid #e0e0e0',
                  '&:hover': {
                    boxShadow: version.status === 'DRAFT' ? 3 : 0
                  }
                }}
                onClick={() => version.status === 'DRAFT' && onActivate(version)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">v{version.version}</Typography>
                    {version.status === 'ACTIVE' && <CheckCircleIcon color="success" />}
                  </Box>
                  
                  <Box mb={1.5}>
                    <StatusChip status={version.status}  value={version.status}/>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={1.5}>
                    {t('process:versionDialog.createdAt')}: {new Date(version.createdAt).toLocaleDateString()}
                  </Typography>
                  
                  {version.status === 'DRAFT' && (
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<CheckCircleIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivate(version);
                      }}
                    >
                      {t('process:versionDialog.activate')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VersionDialog;
