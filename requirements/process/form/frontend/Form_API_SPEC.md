# Form Service Functional Specification

## 1. Introduction
Provides API services for managing form definitions and versions. Handles form versioning, retrieval, and lifecycle management.

## 2. API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/forms | Get all distinct form keys |
| POST | /api/v1/forms/{key}/versions | Create new form version |
| GET | /api/v1/forms/{key}/versions/latest | Get latest form version |
| GET | /api/v1/forms/{key}/versions/{version} | Get specific form version |
| GET | /api/v1/forms/{key}/versions | List all versions of a form |
| POST | /api/v1/forms/{key}/versions/{version}/deprecate | Deprecate form version |

## 3. Method Specifications

### 3.1 getAllFormKeys()
- **Description**: Retrieves all distinct form keys
- **Parameters**: None
- **Success Response**: Array of form keys (strings)
- **Errors**: 
  - Generic error for any HTTP error (4xx, 5xx)
- **Example**:
  ```javascript
  formService.getAllFormKeys()
    .then(keys => console.log(keys))
    .catch(error => console.error(error));
  ```

### 3.2 createNewVersion(key, data)
- **Description**: Creates new version for a form
- **Parameters**:
  - `key` (string, @NotBlank): Form definition key
  - `data` (object): Form definition data
- **Success Response**: Created form version object
- **Errors**:
  - `ValidationException` (400): Input validation failed
  - `NotFoundException` (404): Form definition not found
- **Example**:
  ```javascript
  formService.createNewVersion('employee-onboarding', { fields: [...] })
    .then(version => console.log(version))
    .catch(error => {
      if (error instanceof ValidationException) {
        console.error('Validation error:', error.message);
      } else if (error instanceof NotFoundException) {
        console.error('Form not found:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    });
  ```

### 3.3 getLatestVersion(key)
- **Description**: Gets latest version of a form
- **Parameters**:
  - `key` (string, @NotBlank): Form definition key
- **Success Response**: Latest form version object
- **Errors**:
  - `NotFoundException` (404): Form definition not found
- **Example**: 
  ```javascript
  formService.getLatestVersion('expense-report')
    .then(version => console.log(version))
    .catch(error => {
      if (error instanceof NotFoundException) {
        console.error('Form not found:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    });
  ```

### 3.4 getVersion(key, version)
- **Description**: Gets specific version of a form
- **Parameters**:
  - `key` (string, @NotBlank): Form definition key
  - `version` (string, @Pattern(regexp="[a-zA-Z0-9\\-\\.]+")): Version identifier
- **Success Response**: Requested form version
- **Errors**:
  - `NotFoundException` (404): Form or version not found
- **Example**:
  ```javascript
  formService.getVersion('leave-request', 'v1.2')
    .then(version => console.log(version))
    .catch(error => {
      if (error instanceof NotFoundException) {
        console.error('Version not found:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    });
  ```

### 3.5 listVersions(key)
- **Description**: Lists all versions of a form
- **Parameters**:
  - `key` (string, @NotBlank): Form definition key
- **Success Response**: Array of version objects
- **Errors**:
  - `NotFoundException` (404): Form definition not found
- **Example**:
  ```javascript
  formService.listVersions('incident-report')
    .then(versions => console.log(versions))
    .catch(error => {
      if (error instanceof NotFoundException) {
        console.error('Form not found:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    });
  ```

### 3.6 deprecateVersion(key, version)
- **Description**: Deprecates a form version
- **Parameters**:
  - `key` (string, @NotBlank): Form definition key
  - `version` (string, @Pattern(regexp="[a-zA-Z0-9\\-\\.]+")): Version identifier
- **Success Response**: Deprecation confirmation
- **Errors**:
  - `NotFoundException` (404): Form or version not found
  - `ValidationException` (400): Version already deprecated
- **Example**:
  ```javascript
  formService.deprecateVersion('feedback-form', 'v1.0')
    .then(confirmation => console.log(confirmation))
    .catch(error => {
      if (error instanceof NotFoundException) {
        console.error('Version not found:', error.message);
      } else if (error instanceof ValidationException) {
        console.error('Validation error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    });
  ```

## 4. Error Handling
- `ValidationException`: Invalid input parameters (HTTP 400)
- `NotFoundException`: Requested resource not found (HTTP 404)

## 5. Usage Notes
- All methods return Promises
- Always handle both success and error cases
- Version identifiers must match regex: `[a-zA-Z0-9\-\\.]+`
- Custom exceptions are available for import:
  ```javascript
  import { ValidationException, NotFoundException } from './formService';
  ```

## 6. Custom Exceptions
```javascript
export class ValidationException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundException';
  }
}
