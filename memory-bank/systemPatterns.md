# System Architecture Patterns

## Process Management

### State Management
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Active: Activate
    Active --> Inactive: Deactivate
    Inactive --> Active: Reactivate
    Active --> Archived: Deprecate
```

### Version Control Flow
```mermaid
sequenceDiagram
    User->>+API: Create New Version (v1.0.0)
    API->>+DB: Store as Draft
    User->>+API: Activate Version
    API->>+Flowable: Deploy BPMN
    Flowable-->>-API: Deployment ID
    API->>+DB: Mark as Active
```

### Process-Form Relationship
```mermaid
erDiagram
    PROCESS_VERSION ||--o{ FORM_VERSION : "uses"
    PROCESS_VERSION {
        string definitionId
        string version
        string status
        string bpmnXml
    }
    FORM_VERSION {
        string key
        string version
        json schema
        boolean deprecated
    }
```

## Security Integration
- Process APIs require `process:read` or `process:write` scopes
- Form management requires `form:manage` scope
- Version activation requires `process:deploy` scope
