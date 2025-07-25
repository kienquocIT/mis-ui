# Technical Architecture Document - Bflow ERP Platform

## 1. Tổng quan Kiến trúc

### 1.1 Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser]
        MOBILE[Mobile App]
        API_CLIENT[API Clients]
    end
    
    subgraph "Presentation Layer"
        NGINX[Nginx/Load Balancer]
        STATIC[Static Files CDN]
    end
    
    subgraph "Application Layer"
        DJANGO[Django Application]
        CELERY[Celery Workers]
        WEBSOCKET[WebSocket Server]
    end
    
    subgraph "Data Layer"
        MYSQL[(MySQL/PostgreSQL)]
        REDIS[(Redis Cache)]
        RABBITMQ[RabbitMQ]
        MEDIA[Media Storage]
    end
    
    subgraph "External Services"
        EMAIL[Email Service]
        SMS[SMS Gateway]
        PAYMENT[Payment Gateway]
        CHAT[Chat Integration]
    end
    
    WEB --> NGINX
    MOBILE --> NGINX
    API_CLIENT --> NGINX
    
    NGINX --> DJANGO
    NGINX --> STATIC
    
    DJANGO --> MYSQL
    DJANGO --> REDIS
    DJANGO --> CELERY
    
    CELERY --> RABBITMQ
    CELERY --> MYSQL
    
    DJANGO --> EMAIL
    DJANGO --> SMS
    DJANGO --> PAYMENT
    DJANGO --> CHAT
```

### 1.2 Architecture Principles

1. **Modular Design**: Tách biệt các module độc lập
2. **Scalability**: Khả năng mở rộng theo chiều ngang
3. **Security First**: Bảo mật ở mọi tầng
4. **API-Driven**: RESTful API cho mọi tính năng
5. **Multi-tenant**: Hỗ trợ nhiều tenant độc lập

## 2. Technology Stack

### 2.1 Backend Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Django | 4.1.3 | Web framework chính |
| Language | Python | 3.11 | Ngôn ngữ lập trình |
| API Framework | Django REST Framework | 3.14.0 | RESTful API |
| Task Queue | Celery | 5.2.7 | Xử lý bất đồng bộ |
| Message Broker | RabbitMQ | Latest | Message queue |
| Cache | Redis | Latest | Caching & Session |
| Database | MySQL/PostgreSQL | 8.0/14.0 | Primary database |

### 2.2 Frontend Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Template Engine | Django Templates | Server-side rendering |
| JavaScript | jQuery, Vanilla JS | Client-side logic |
| CSS Framework | Bootstrap 5 | UI components |
| Charts | ApexCharts, Chart.js | Data visualization |
| Datatables | DataTables.net | Table management |
| Form Validation | jQuery Validation | Form handling |

### 2.3 Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| Container | Docker | Containerization |
| Orchestration | Docker Compose | Multi-container apps |
| Web Server | Nginx | Reverse proxy |
| Application Server | Gunicorn | WSGI server |
| Monitoring | OpenTelemetry | Application monitoring |
| CI/CD | Jenkins | Continuous integration |

## 3. System Architecture

### 3.1 Layered Architecture

```mermaid
graph LR
    subgraph "Presentation Layer"
        UI[User Interface]
        API[API Gateway]
    end
    
    subgraph "Business Logic Layer"
        AUTH[Authentication]
        WORKFLOW[Workflow Engine]
        BUSINESS[Business Rules]
    end
    
    subgraph "Data Access Layer"
        ORM[Django ORM]
        CACHE_LAYER[Cache Layer]
        FILE[File Storage]
    end
    
    subgraph "Data Storage"
        DB[(Database)]
        CACHE_STORE[(Cache)]
        STORAGE[(File Storage)]
    end
    
    UI --> AUTH
    API --> AUTH
    AUTH --> WORKFLOW
    WORKFLOW --> BUSINESS
    BUSINESS --> ORM
    ORM --> DB
    CACHE_LAYER --> CACHE_STORE
    FILE --> STORAGE
```

### 3.2 Component Architecture

#### 3.2.1 Django Application Structure

```
apps/
├── core/                    # Core modules
│   ├── account/            # User management
│   ├── auths/              # Authentication
│   ├── workflow/           # Workflow engine
│   ├── form/               # Dynamic forms
│   └── ...
├── sales/                  # Sales modules
│   ├── opportunity/        # Opportunity management
│   ├── quotation/          # Quotation
│   ├── saleorder/          # Sales orders
│   └── ...
├── hrm/                    # Human resource modules
│   ├── employee/           # Employee management
│   ├── attendance/         # Attendance tracking
│   └── ...
├── shared/                 # Shared utilities
│   ├── apis/              # API utilities
│   ├── utils/             # Common utilities
│   └── ...
└── sharedapp/             # Shared Django app
```

#### 3.2.2 Module Dependencies

```mermaid
graph TD
    CORE[Core Modules]
    SALES[Sales Modules]
    HRM[HRM Modules]
    EOFFICE[eOffice Modules]
    KMS[KMS Modules]
    SHARED[Shared Utilities]
    
    SALES --> CORE
    HRM --> CORE
    EOFFICE --> CORE
    KMS --> CORE
    
    SALES --> SHARED
    HRM --> SHARED
    EOFFICE --> SHARED
    KMS --> SHARED
```

## 4. Database Design

### 4.1 Database Schema Strategy

- **Multi-tenant Architecture**: Shared database with tenant isolation
- **Audit Trail**: Tất cả bảng có created_at, updated_at, created_by, updated_by
- **Soft Delete**: Sử dụng is_deleted flag thay vì xóa vật lý
- **UUID**: Sử dụng UUID cho external references

### 4.2 Key Database Tables

```mermaid
erDiagram
    User ||--o{ Company : belongs_to
    User ||--o{ UserRole : has
    Company ||--o{ Department : has
    Department ||--o{ Employee : has
    
    Employee ||--o{ LeaveRequest : creates
    Employee ||--o{ Attendance : has
    
    Customer ||--o{ Opportunity : has
    Opportunity ||--o{ Quotation : generates
    Quotation ||--o{ SalesOrder : converts_to
    SalesOrder ||--o{ Delivery : creates
    
    WorkflowTemplate ||--o{ WorkflowInstance : instantiates
    WorkflowInstance ||--o{ WorkflowStep : has
    WorkflowStep ||--o{ WorkflowAction : performs
```

### 4.3 Database Optimization

1. **Indexing Strategy**
   - Primary key indexes
   - Foreign key indexes
   - Composite indexes for queries
   - Full-text search indexes

2. **Partitioning**
   - Table partitioning by tenant
   - Time-based partitioning for logs

3. **Connection Pooling**
   - Database connection pooling
   - Read replica for reports

## 5. Security Architecture

### 5.1 Security Layers

```mermaid
graph TB
    subgraph "Security Layers"
        WAF[Web Application Firewall]
        SSL[SSL/TLS Encryption]
        AUTH[Authentication Layer]
        AUTHZ[Authorization Layer]
        AUDIT[Audit Trail]
        ENCRYPT[Data Encryption]
    end
    
    REQUEST[Client Request] --> WAF
    WAF --> SSL
    SSL --> AUTH
    AUTH --> AUTHZ
    AUTHZ --> APP[Application]
    APP --> AUDIT
    APP --> ENCRYPT
    ENCRYPT --> DB[(Database)]
```

### 5.2 Security Implementation

1. **Authentication**
   - JWT token-based authentication
   - Two-factor authentication (2FA)
   - Session management
   - Password policies

2. **Authorization**
   - Role-based access control (RBAC)
   - Permission-based access
   - API key management
   - OAuth 2.0 support

3. **Data Security**
   - Encryption at rest
   - Encryption in transit
   - Field-level encryption
   - PII data masking

4. **Application Security**
   - CSRF protection
   - XSS prevention
   - SQL injection prevention
   - Input validation

## 6. API Architecture

### 6.1 RESTful API Design

```
Base URL: https://api.bflow.com/v1

Endpoints:
GET    /api/v1/users           # List users
POST   /api/v1/users           # Create user
GET    /api/v1/users/{id}      # Get user details
PUT    /api/v1/users/{id}      # Update user
DELETE /api/v1/users/{id}      # Delete user

Headers:
Authorization: Bearer {token}
Content-Type: application/json
X-Tenant-ID: {tenant_id}
```

### 6.2 API Response Format

```json
{
    "status": true,
    "message": "Success",
    "data": {
        "items": [],
        "pagination": {
            "page": 1,
            "per_page": 20,
            "total": 100
        }
    },
    "errors": null,
    "timestamp": "2024-01-01T00:00:00Z"
}
```

### 6.3 API Versioning Strategy

- URL versioning: `/api/v1/`, `/api/v2/`
- Backward compatibility for 2 versions
- Deprecation notices in headers
- Migration guides for breaking changes

## 7. Integration Architecture

### 7.1 Integration Patterns

```mermaid
graph LR
    subgraph "Bflow Platform"
        API[API Gateway]
        WEBHOOK[Webhook Manager]
        QUEUE[Message Queue]
    end
    
    subgraph "External Systems"
        EMAIL_SVC[Email Service]
        SMS_SVC[SMS Service]
        PAYMENT_SVC[Payment Gateway]
        CHAT_SVC[Chat Platforms]
    end
    
    API --> EMAIL_SVC
    API --> SMS_SVC
    API --> PAYMENT_SVC
    
    CHAT_SVC --> WEBHOOK
    PAYMENT_SVC --> WEBHOOK
    
    WEBHOOK --> QUEUE
    QUEUE --> PROCESSOR[Event Processor]
```

### 7.2 Integration Technologies

1. **Synchronous Integration**
   - REST APIs
   - GraphQL (future)
   - SOAP (legacy support)

2. **Asynchronous Integration**
   - Webhooks
   - Message queues
   - Event streaming

3. **File-based Integration**
   - CSV/Excel import/export
   - PDF generation
   - Document processing

## 8. Performance Architecture

### 8.1 Caching Strategy

```mermaid
graph TD
    REQUEST[Client Request] --> CDN[CDN Cache]
    CDN --> NGINX[Nginx Cache]
    NGINX --> APP[Application]
    APP --> REDIS[Redis Cache]
    REDIS --> DB[(Database)]
    
    CDN -.->|Static Assets| RESPONSE[Response]
    NGINX -.->|Page Cache| RESPONSE
    REDIS -.->|Data Cache| RESPONSE
    DB --> RESPONSE
```

### 8.2 Performance Optimization

1. **Frontend Optimization**
   - Minification & bundling
   - Lazy loading
   - Image optimization
   - CDN for static assets

2. **Backend Optimization**
   - Database query optimization
   - N+1 query prevention
   - Bulk operations
   - Background job processing

3. **Caching Levels**
   - Browser cache
   - CDN cache
   - Application cache
   - Database cache

## 9. Deployment Architecture

### 9.1 Container Architecture

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
      
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      
  redis:
    image: redis:alpine
    
  celery:
    build: .
    command: celery worker
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
```

### 9.2 Deployment Environments

| Environment | Purpose | Configuration |
|------------|---------|---------------|
| Development | Local development | Docker Compose |
| Testing | QA testing | Kubernetes (staging) |
| UAT | User acceptance | Kubernetes (pre-prod) |
| Production | Live system | Kubernetes (prod) |

## 10. Monitoring & Logging

### 10.1 Monitoring Stack

```mermaid
graph LR
    APP[Application] --> OTEL[OpenTelemetry]
    OTEL --> PROMETHEUS[Prometheus]
    OTEL --> JAEGER[Jaeger]
    OTEL --> ELASTIC[Elasticsearch]
    
    PROMETHEUS --> GRAFANA[Grafana]
    JAEGER --> GRAFANA
    ELASTIC --> KIBANA[Kibana]
```

### 10.2 Monitoring Metrics

1. **Application Metrics**
   - Response time
   - Error rate
   - Throughput
   - Active users

2. **Infrastructure Metrics**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network traffic

3. **Business Metrics**
   - User activity
   - Transaction volume
   - Feature usage
   - Error patterns

## 11. Disaster Recovery

### 11.1 Backup Strategy

- **Database**: Daily automated backups, 30-day retention
- **Files**: Incremental backups, offsite storage
- **Configuration**: Version controlled
- **Recovery Time Objective (RTO)**: 4 hours
- **Recovery Point Objective (RPO)**: 24 hours

### 11.2 High Availability

```mermaid
graph TB
    subgraph "Primary Site"
        LB1[Load Balancer]
        APP1[App Server 1]
        APP2[App Server 2]
        DB1[(Primary DB)]
    end
    
    subgraph "Secondary Site"
        LB2[Load Balancer]
        APP3[App Server 3]
        DB2[(Replica DB)]
    end
    
    LB1 --> APP1
    LB1 --> APP2
    APP1 --> DB1
    APP2 --> DB1
    
    DB1 -.->|Replication| DB2
    LB1 -.->|Failover| LB2
```

## 12. Future Architecture Considerations

### 12.1 Microservices Migration

- Decompose monolith gradually
- Service mesh implementation
- Container orchestration with Kubernetes
- Event-driven architecture

### 12.2 Technology Upgrades

- GraphQL API support
- Real-time features with WebSockets
- AI/ML integration
- Blockchain for audit trail

---

**Document Version**: 1.0  
**Last Updated**: 2025-07-25  
**Architecture Review**: Quarterly  
**Owner**: Technical Architecture Team