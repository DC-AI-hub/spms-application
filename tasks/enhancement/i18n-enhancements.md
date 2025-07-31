# i18n Enhancement Tasks

This document outlines the required i18n changes for the page components in `frontend/src/pages`. Each task includes:
- File location
- Current hardcoded string
- Proposed translation key
- Replacement instructions

## Access.jsx (frontend/src/pages/Access.jsx)

### Task 1: Main title
- **Location**: Line 10
- **Current string**: `"Access Management"`
- **Proposed key**: `access.title`
- **Replacement**:
  ```jsx
  // Replace
  <h1 className="text-2xl font-semibold text-gray-800 mb-4">Access Management</h1>
  
  // With
  <h1 className="text-2xl font-semibold text-gray-800 mb-4">{t('access.title')}</h1>
  ```

### Task 2: Section headers
- **Location**: Lines 16, 26, 36
- **Current strings**: `"Permissions"`, `"Role Permissions"`, `"User Permissions"`
- **Proposed keys**: 
  - `access.sections.permissions`
  - `access.sections.rolePermissions`
  - `access.sections.userPermissions`
- **Replacement**:
  ```jsx
  // Replace each occurrence with pattern:
  <h2 className="text-xl font-medium text-gray-700 mb-4">{t('access.sections.[key]')}</h2>
  ```

### Task 3: Permission items
- **Location**: Lines 18, 20, 28, 30, 38, 40
- **Current strings**: `"User Access"`, `"Admin Access"`, `"Admin Role"`, `"User Role"`, `"User 1"`, `"User 2"`
- **Proposed keys**:
  - `access.items.userAccess`
  - `access.items.adminAccess`
  - `access.items.adminRole`
  - `access.items.userRole`
  - `access.items.user1`
  - `access.items.user2`
- **Replacement**:
  ```jsx
  // Replace each occurrence with pattern:
  <span>{t('access.items.[key]')}</span>
  ```

### Task 4: Edit buttons
- **Location**: Multiple locations
- **Current string**: `"Edit"`
- **Proposed key**: `common.edit` (existing key)
- **Replacement**:
  ```jsx
  // Replace all occurrences with:
  <button className="text-sm text-blue-600 hover:text-blue-800">{t('common:edit')}</button>
  ```

## Dashboard.jsx (frontend/src/pages/Dashboard.jsx)

### Task 5: Main title
- **Location**: Line 10
- **Current string**: `"Dashboard"`
- **Proposed key**: `dashboard.title`
- **Replacement**:
  ```jsx
  // Replace
  <h1 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h1>
  
  // With
  <h1 className="text-2xl font-semibold text-gray-800 mb-4">{t('dashboard.title')}</h1>
  ```

### Task 6: Stat titles
- **Location**: Lines 15, 19, 23
- **Current strings**: `"Total Users"`, `"Active Projects"`, `"Pending Tasks"`
- **Proposed keys**:
  - `dashboard.stats.totalUsers`
  - `dashboard.stats.activeProjects`
  - `dashboard.stats.pendingTasks`
- **Replacement**:
  ```jsx
  // Replace each occurrence with pattern:
  <h3 className="text-gray-500 text-sm font-medium">{t('dashboard.stats.[key]')}</h3>
  ```

## Organization.jsx (frontend/src/pages/Organization.jsx)

### Task 7: Company Management tab
- **Location**: Line 29
- **Current string**: `"Company Management"`
- **Proposed key**: `organization.tabs.companyManagement` (existing key)
- **Note**: Already internationalized, no change needed

### Task 8: Other tabs
- **Location**: Lines 33, 37, 41, 45
- **Current strings**: `"Divisions"`, `"Departments"`, `"Organization Chart"`, `"User Management"`
- **Proposed keys**: 
  - `organization.tabs.divisions`
  - `organization.tabs.departments`
  - `organization.tabs.orgChart`
  - `organization.tabs.userManagement`
- **Replacement**:
  ```jsx
  // Replace each occurrence with pattern:
  <Tab label={t('organization:tabs.[key]')} />
  ```

## Process.jsx (frontend/src/pages/Process.jsx)

### Task 9: Tab labels
- **Location**: Lines 87-91
- **Current strings**: `"Management"`, `"Designer"`, `"Forms"`, `"Versions"`, `"Assignments"`
- **Proposed keys**:
  - `process.tabs.management`
  - `process.tabs.designer`
  - `process.tabs.forms`
  - `process.tabs.versions`
  - `process.tabs.assignments`
- **Replacement**:
  ```jsx
  // Replace each occurrence with pattern:
  <Tab label={t('process:tabs.[key]')} />
  ```

### Task 10: Search placeholder
- **Location**: Line 104
- **Current string**: `"Search processes"`
- **Proposed key**: `process.searchPlaceholder`
- **Replacement**:
  ```jsx
  // Replace
  placeholder="Search processes"
  
  // With
  placeholder={t('process:searchPlaceholder')}
  ```

### Task 11: Create button
- **Location**: Line 114
- **Current string**: `"Create"`
- **Proposed key**: `common.create`
- **Replacement**:
  ```jsx
  // Replace
  {t('common:create')}
  ```

## DepartmentForm.jsx (frontend/src/pages/organization/DepartmentForm.jsx)

### Task 12: Tag section title
- **Location**: Line 132
- **Current string**: `"Tags"`
- **Proposed key**: `organization.department.tags`
- **Replacement**:
  ```jsx
  // Replace
  <Typography variant="subtitle1" gutterBottom>Tags</Typography>
  
  // With
  <Typography variant="subtitle1" gutterBottom>{t('organization:department.tags')}</Typography>
  ```

### Task 13: Tag key placeholder
- **Location**: Line 141
- **Current string**: `"Key"`
- **Proposed key**: `organization.department.tagKey`
- **Replacement**:
  ```jsx
  // Replace
  label="Key"
  
  // With
  label={t('organization:department.tagKey')}
  ```

### Task 14: Tag value placeholder
- **Location**: Line 148
- **Current string**: `"Value"`
- **Proposed key**: `organization.department.tagValue`
- **Replacement**:
  ```jsx
  // Replace
  label="Value"
  
  // With
  label={t('organization:department.tagValue')}
  ```

### Task 15: Add tag button
- **Location**: Line 156
- **Current string**: `"Add Tag"`
- **Proposed key**: `organization.department.addTag`
- **Replacement**:
  ```jsx
  // Replace
  {t('organization:department.addTag')}
  ```

## Next Steps
1. Create new translation files for the "access" namespace:
   - `frontend/src/i18n/locales/en/access.json`
   - `frontend/src/i18n/locales/zh/access.json`
   - `frontend/src/i18n/locales/zh-TR/access.json`

2. Add the new namespace to `frontend/src/i18n/i18n.js`:
   ```js
   // Add to imports
   import enAccess from './locales/en/access.json';
   import zhAccess from './locales/zh/access.json';
   import zhTRAccess from './locales/zh-TR/access.json';
   
   // Add to resources
   resources: {
     en: {
       ...,
       access: enAccess
     },
     zh: {
       ...,
       access: zhAccess
     },
     'zh-TR': {
       ...,
       access: zhTRAccess
     }
   },
   ns: [... 'access'],
   ```

3. Implement the changes in each JSX file as specified above

4. Add translations for new keys in all language files
