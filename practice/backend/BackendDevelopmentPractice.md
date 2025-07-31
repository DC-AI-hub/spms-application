# Java POJO Modeling

## Principal 
### Clear Layering Responsibilities
The foundation of Java's three-tier architecture lies in strict separation of concerns. Each layer has distinct responsibilities with explicit boundaries:

<pre>
Controller
    • Handles HTTP request/response lifecycle
    • Performs basic input validation (e.g., @Valid)
    • Calls Service layer methods
    • Transforms business objects to DTOs	
    Prohibited Actions
        • Implement business logic
        • Direct database access
        • Manage transactions
</pre>
<pre>
Service	
    • Contains core business logic
    • Manages transactions (@Transactional)
    • Coordinates multiple Repositories
    • Integrates external services	• Use HTTP-specific objects (e.g., HttpServletRequest)
    Prohibited Actions
        • Expose database details
        • Return raw Entity objects
</pre> 
<pre>
Repository	
    • Performs database CRUD operations
    • Abstracts database access
    • Provides domain-specific query methods
    • Returns Entity objects	
    Prohibited Actions
        • Implement business rules
        • Handle transactions manually
        • Expose Entities directly to Controller
</pre> 




## Time Sequence Diagram
sequenceDiagram
    participant C as Controller
    participant S as Service
    participant R as Repository
    participant DB as Database
    
    C->>S: 传入 DTO 对象
    S->>S: 1. 转换 DTO->Model<br>2. 执行业务逻辑
    S->>R: 调用 Repository 方法 (传入 Entity)
    R->>DB: 执行 SQL 操作
    DB-->>R: 返回数据
    R-->>S: 返回 Entity
    S->>S: 转换 Entity->Model
    S-->>C: 返回 Model (转 DTO)
    C->>C: 构建 HTTP 响应





