import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box, Checkbox, FormControlLabel } from '@mui/material';
import organizationService from '../../api/idm/organizationService';
import { DivisionType } from './DivisionType';

export default function DivisionForm({ division, onSubmit, onCancel, isEditMode }) {
  const { control, handleSubmit, reset } = useForm();
  const { t } = useTranslation();
  const [companies, setCompanies] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    // Fetch only GROUP type companies
    organizationService.getCompanies( {type: "GROUP"} )
      .then(response =>{ 
        setCompanies(response.content || [])
        console.log(response)
      })
      .catch(error => console.error('Error fetching companies:', error));
      
    // Fetch users for Division Head selector
    organizationService.getUsers()
      .then(response => setUsers(response.content || []))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  /*
  React.useEffect(() => {
    if (division) {
      reset(division);
    }
  }, [division, reset]);*/

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('organization:division.name')}
            fullWidth
            margin="normal"
            required
            disabled={isEditMode}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        defaultValue="BUSINESS"
        rules={{ 
          required: true,
            validate: value => Object.values(DivisionType).includes(value)
        }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('organization:division.type')}</InputLabel>
            <Select 
              {...field} 
              label={t('organization:division.type')} 
              required
              error={!field.value || !Object.values(DivisionType).includes(field.value)}
            >
              <MenuItem value={DivisionType.CORE}>{t('organization:division.types.core')}</MenuItem>
              <MenuItem value={DivisionType.BUSINESS}>{t('organization:division.types.business')}</MenuItem>
              <MenuItem value={DivisionType.TECHNOLOGY}>{t('organization:division.types.technology')}</MenuItem>
              <MenuItem value={DivisionType.STRATEGY}>{t('organization:division.types.strategy')}</MenuItem>
              <MenuItem value={DivisionType.SUPPORT}>{t('organization:division.types.support')}</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="companyId"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('organization:company.select')}</InputLabel>
            <Select {...field} label={t('organization:company.select')} required>
              {companies.map(company => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="active"
        control={control}
        defaultValue={true}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label={t('organization:division.active')}
          />
        )}
      />

      <Controller
        name="divisionHeadId"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('organization:division.head')}</InputLabel>
            <Select {...field} label={t('organization:division.head')}>
              <MenuItem value="">{t('common:none')}</MenuItem>
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" type="submit">
          {t('common:save')}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          {t('common:cancel')}
        </Button>
      </Box>
    </form>
  );
}
