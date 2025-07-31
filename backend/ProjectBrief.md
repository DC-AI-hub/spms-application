# Project Brief: Backend Structure

## Package Overview

### config
Contains configuration classes for the application, including:
- Security configurations
- Database configurations
- API settings
- Integration configurations

### controller
Handles HTTP requests and responses for the REST API. Contains:
- Endpoint definitions
- Request mapping
- Response formatting
- Input validation

### jobs
Manages scheduled and background tasks, including:
- Periodic data processing
- Batch operations
- System maintenance tasks
- Integration synchronization

### repository
Data access layer that interacts with the database:
- Database operations (CRUD)
- Query definitions
- Entity management
- Transaction handling

### service
Core business logic implementation:
- Process orchestration
- Business rule enforcement
- Service integrations
- Complex computations
- Workflow management

## Folder Structure

```
backend
└── src
    └── main
        └── java
            └── com
                └── spms
                    └── backend
                        ├── BackendApplication.java     # Application entry point
                        ├── config                      # Configuration classes configure the spring boot application
                        ├── controller                  # Controller classes handle HTTP requests and responses
                        │   ├── dto                     # Data transfer objects for responses and requests
                        │   ├── exception               # Exception classes for controller 
                        │   ├── idm                     # Identity management controller
                        │   ├── process                 # Process management controller
                        │   └── sys                     # System management controller
                        ├── jobs                        # Job classes manage scheduled and background tasks
                        ├── repository                  # Repository classes interact with the database
                        │   ├── entities                # Entity classes define database tables
                        │   │   ├── idm                 # Identity management entities
                        │   │   ├── process             # Process management entities
                        │   │   └── sys                 # System management entities
                        │   ├── idm                     # Identity management repository
                        │   └── process                 # Process management repository
                        └── service                     # Service classes implement core business logic
                            ├── exception               # Exception classes for service
                            ├── idm                     # Identity management service
                            │   └── impl                # Identity management business implementation 
                            ├── model                   # Model classes for services
                            ├── process                 # Process management service
                            │   ├── engine              # Process engine items which containing the extenation for engine
                            │   ├── impl                # Process management business implementation
                            │   ├── integration         # Integration classes for process management
                            │   ├── task                # Task classes for process management
                            │   │   ├── context         # Task context classes for process management
                            │   │   ├── event           # Task event classes for process management
                            │   │   ├── inspector       # Task inspector classes for process management    
                            │   └── sys                 # System management service    
```
