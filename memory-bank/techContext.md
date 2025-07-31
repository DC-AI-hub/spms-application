# Technical Context

## Database Schema
- **PostgreSQL 15** with `spms_` prefix tables
- **Process Version Table** (`spms_process_version`):
  ```sql
  CREATE TABLE spms_process_version (
    id BIGSERIAL PRIMARY KEY,
    definition_id VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL, -- Semantic versioning
    status VARCHAR(20) NOT NULL, -- DRAFT/ACTIVE/INACTIVE/ARCHIVED
    bpmn_xml TEXT,
    flowable_definition_id VARCHAR(255),
    created_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- **Form Version Table** (`spms_form_version`):
  ```sql
  CREATE TABLE spms_form_version (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    schema JSONB NOT NULL,
    deprecated BOOLEAN DEFAULT FALSE,
    published_date TIMESTAMP
  );
  ```

## API Specifications
### Process API (`/api/v1/process`)
```
POST   /definitions               Create new process version
GET    /definitions/{id}          Get process definition
GET    /definitions/{id}/versions List versions
POST   /definitions/{id}/versions/{vid}/active Activate version
DELETE /definitions/{id}/versions/{vid}/active Deactivate version
```

### Form API (`/api/v1/forms`)
```
POST   /{key}/versions            Create form version
GET    /{key}/versions/latest     Get latest version
GET    /{key}/versions/{version}  Get specific version
POST   /{key}/versions/{version}/deprecate Deprecate version
```

## Flowable Configuration
- BPMN 2.0 process definitions
- Deployment through REST API
- Version activation triggers new deployment
- Process instances run against active version
