# Form UI Functional Specification

## 1. Interface Components
### 1.1 Form Definition List View
- Displays all form definitions in a sortable MUI DataGrid
- Columns: 
  - Key (string)
  - Name (string)
  - Latest Version (string)
  - Status (Active/Deprecated)
  - Actions (Create New Version, View History)
- Features:
  - Client-side pagination
  - Search/filter by key or name
  - Status badge with color coding

### 1.2 Version Management Panel
- Version history timeline (MUI Timeline component)
- Version comparison view (split-screen diff)
- Deprecation status indicator (MUI Chip)
- Action buttons:
- View JSON (GET /forms/{key}/versions/{version})
- Deprecate (POST /forms/{key}/versions/{version}/deprecate)
- Clone as New Version (POST /forms/{key}/versions)

### 1.3 Form Editor
- Monaco Editor for JSON editing with validation
- Version metadata section:
  - Key (read-only)
  - Version ID (editable, regex validation)
  - Status toggle (Deprecated/Active)
- Action buttons:
  - Save Changes
  - Validate Structure
  - Discard Changes

### 1.4 Version Creation Flow
- Modal dialog with:
  - Base version selector (dropdown)
  - New version ID input 
  - Must match regex: [a-zA-Z0-9\-\\.]+
  - Real-time validation against regex pattern
  - Error display: ValidationException handling
  - JSON editor pre-filled with base version
- Two-step process:
  1. Select base version
  2. Modify and save

## 2. User Flows
### 2.1 Create New Form Version
1. From Form List → Click "Create Version" action
2. Select base version from modal
3. Edit form JSON in editor
4. Click "Create Version" → Calls POST /forms/{key}/versions

### 2.2 View Version History
1. From Form List → Click "View Versions" action
2. Version Management Panel opens
3. Click version to view details
4. Supports side-by-side comparison

### 2.3 Deprecate Version
1. From Version Management Panel → Click "Deprecate"
2. Confirmation dialog appears
3. Confirm → Calls POST /forms/{key}/versions/{version}/deprecate
4. On success:
      - Update version status in real-time
      - Remove deprecated version from active selection
5. Error handling:
      - ValidationException: Show "Version already deprecated"
      - NotFoundException: Show "Version not found"

## 3. Error Handling
- Toast notifications with exception-specific handling:
  - ValidationException (400): 
      * Red toast with input-specific errors
      * Auto-focus invalid fields
  - NotFoundException (404):
      * Yellow toast with resource locator
  - Number formatting
  - Right-to-left support

## 5. Component Integration
- Reuse existing components:
  - `FormEditor` (extended with version metadata)
  - `VersionInput` (for version selection)
- New components:
  - `VersionTimeline` (MUI Timeline-based)
  - `DeprecationBadge` (MUI Chip variant)
  - `JsonDiffViewer` (split-screen comparator)

## 6. Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- ARIA labels for all interactive elements
- High contrast mode support


