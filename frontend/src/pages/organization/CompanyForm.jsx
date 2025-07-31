import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import organizationService from '../../api/idm/organizationService';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { CompanyType } from './constants';

export default function CompanyForm({ company, onSubmit, onCancel, isEditMode }) {
  const { control, handleSubmit, reset, watch } = useForm();
  const { t } = useTranslation();
  const [profileFields, setProfileFields] = useState([{ key: '', value: '' }]);
  const [validParents, setValidParents] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [parentError, setParentError] = useState(null);

  const handleAddProfileField = () => {
    setProfileFields([...profileFields, { key: '', value: '' }]);
  };

  const handleRemoveProfileField = (index) => {
    const newFields = [...profileFields];
    newFields.splice(index, 1);
    setProfileFields(newFields);
  };

  useEffect(() => {
    if (company) {
      reset(company);
      if (company.companyProfiles) {
        const profiles = Object.entries(company.companyProfiles).map(([key, value]) => ({ key, value }));
        setProfileFields(profiles);
      }
    }
  }, [company, reset]);

  return (
    <form onSubmit={handleSubmit((data) => {
      const profiles = profileFields.reduce((acc, field) => {
        if (field.key && field.value) {
          acc[field.key] = field.value;
        }
        return acc;
      }, {});
      const payload = {
        ...data,
        companyType: data.companyType,
        companyProfiles: profiles
      };
      onSubmit(payload);
    })}>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('organization:company.form.name')}
            fullWidth
            margin="normal"
            required
            disabled={isEditMode}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label={t('organization:company.form.description')}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        )}
      />

      <Controller
        name="active"
        control={control}
        defaultValue={true}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label={t('organization:company.form.active')}
          />
        )}
      />

      <Controller
        name="companyType"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('organization:company.form.type')}</InputLabel>
            <Select
              {...field}
              label={t('organization:company.form.type')}
              required
              onChange={async (e) => {
                field.onChange(e);
                if (e.target.value !== 'GROUP') {
                  try {
                    setLoadingParents(true);
                    setParentError(null);
                    const response = await organizationService.getValidParentCompany(e.target.value);
                    setValidParents(response.data);
                  } catch (error) {
                    setParentError(t('organization:company.form.parentError'));
                    setValidParents([]);
                    console.error('Error fetching valid parents:', error);
                  } finally {
                    setLoadingParents(false);
                  }
                } else {
                  setValidParents([]);
                }
              }}
            >
              {Object.entries(CompanyType).map(([key, value]) => {
                console.log(key, value);
                return (
                  <MenuItem key={key} value={key}>
                    {t(`companyTypes.${value}`)}
                  </MenuItem>
                )
              })

              }
            </Select>
          </FormControl>
        )}
      />

      {watch('companyType') && watch('companyType') !== 'GROUP' && (
        <Controller
          name="parentId"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('organization:company.form.parent')}</InputLabel>
              <Select
                {...field}
                label={t('organization:company.form.parent')}
                required
                disabled={loadingParents}
              >
                <MenuItem value="" disabled>
                  {loadingParents ? t('common:loading') : t('common:select')}
                </MenuItem>
                {validParents?.map(parent => (
                  <MenuItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </MenuItem>
                ))}
              </Select>
              {parentError && (
                <Box sx={{ color: 'error.main', mt: 1 }}>{parentError}</Box>
              )}
            </FormControl>
          )}
        />
      )}

      {/* Language Tags Section */}
      <Box sx={{ mt: 2 }}>
        <Controller
          name="languageTags.en"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label={t('organization:company.form.language.en')}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="languageTags.zh"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label={t('organization:company.form.language.zh')}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="languageTags.zh-TR"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label={t('organization:company.form.language.zh-TR')}
              fullWidth
              margin="normal"
            />
          )}
        />
      </Box>

      {/* Company Profiles Section */}
      <Box sx={{ mt: 2 }}>
        {profileFields.map((field, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              value={field.key}
              onChange={(e) => {
                const newFields = [...profileFields];
                newFields[index].key = e.target.value;
                setProfileFields(newFields);
              }}
              label={t('organization:company.form.profile.key')}
              fullWidth
            />
            <TextField
              value={field.value}
              onChange={(e) => {
                const newFields = [...profileFields];
                newFields[index].value = e.target.value;
                setProfileFields(newFields);
              }}
              label={t('organization:company.form.profile.value')}
              fullWidth
            />
            <IconButton
              onClick={() => handleRemoveProfileField(index)}
              disabled={profileFields.length === 1}
            >
              <Remove />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAddProfileField}
        >
          {t('organization:company.form.addProfile')}
        </Button>
      </Box>

      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <Button variant="contained" color="primary" type="submit">
          {t('common:save')}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          {t('common:cancel')}
        </Button>
      </div>
    </form>
  );
};
