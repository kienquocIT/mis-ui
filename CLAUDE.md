# CLAUDE.md - Bflow ERP Platform

## Project Overview
- **Project Name**: Bflow ERP Platform
- **Description**: Comprehensive Enterprise Resource Planning system for Vietnamese businesses, providing integrated modules for sales, HRM, accounting, and office management.
- **Current Version**: 0.0.1 (Development)
- **Environment**: SIT (System Integration Testing)

## Directory Structure
```
D:\workspace\mis_site\UI\sit\
├── apps/                   # Django applications
│   ├── core/              # Core modules (auth, workflow, forms)
│   ├── sales/             # Sales management modules
│   ├── hrm/               # Human resource modules
│   ├── eoffice/           # Office management modules
│   ├── kms/               # Knowledge management modules
│   ├── masterdata/        # Master data modules
│   └── shared/            # Shared utilities and components
├── misui/                 # Django project settings
├── templates/             # HTML templates
├── statics/              # Static files (CSS, JS, images)
├── locale/               # Internationalization files
├── builder/              # Docker and deployment configs
├── docs/                 # Project documentation
└── manage.py             # Django management script
```

## Tech Stack

### Backend
- **Framework**: Django 4.1.3 with Python 3.11
- **API Framework**: Django REST Framework 3.14.0
- **Database**: MySQL 8.0 / PostgreSQL 14
- **Cache**: Redis (latest)
- **Message Queue**: Celery 5.2.7 with RabbitMQ
- **Task Scheduler**: Django Celery Beat

### Frontend
- **Template Engine**: Django Templates
- **JavaScript**: jQuery, Vanilla JavaScript
- **CSS Framework**: Bootstrap 5
- **UI Components**: DataTables, Select2, Chart.js, ApexCharts
- **Build Tools**: Django Compressor

### Infrastructure
- **Container**: Docker
- **Web Server**: Nginx (reverse proxy)
- **Application Server**: Gunicorn
- **Monitoring**: OpenTelemetry with Jaeger
- **CI/CD**: Jenkins

## Development Guidelines

### Code Organization
1. **Apps Structure**: Each app follows Django best practices with models, views, serializers, urls, and templates
2. **Separation of Concerns**: 
   - Views for rendering (inherit from `View`)
   - API views for data handling (inherit from `APIView`)
3. **URL Patterns**: 
   - Regular views: `/module/feature`
   - API endpoints: `/module/feature/api`

### Coding Standards
- **C-1**: Use type hints for all functions
- **C-2**: Follow existing naming conventions (snake_case for functions/variables, CamelCase for classes)
- **C-3**: Prefer functions over classes when simple
- **C-4**: Use environment variables for configuration
- **C-5**: No hardcoded secrets or credentials

### Django Specific
- **Template Inheritance**: All templates extend from `base.html` or `base_v2.html`
- **Static Files**: Use Django's static file handling with `{% static %}` tag
- **Internationalization**: Use `{% trans %}` for all user-facing text
- **Forms**: Use Django Forms with proper validation
- **Authentication**: Use `@mask_view` decorator for access control

### API Design
- **RESTful Principles**: Follow REST conventions
- **Response Format**: Consistent JSON structure with status, message, data, errors
- **Authentication**: JWT token-based with Bearer scheme
- **Versioning**: URL-based versioning (e.g., `/api/v1/`)

## Key Features & Modules

### Core Modules
- **Authentication & Authorization**: 2FA support, role-based access control
- **Workflow Engine**: Dynamic workflow creation and management
- **Form Builder**: Dynamic form generation with validation
- **Attachment System**: File upload and management
- **Notification System**: Email, SMS, and in-app notifications

### Business Modules
- **Sales**: Lead → Opportunity → Quotation → Order → Delivery → Invoice
- **HRM**: Employee management, attendance, leave management
- **eOffice**: Asset management, business trips, meetings
- **KMS**: Document approval, incoming document management

## Testing Strategy
- **T-1**: Write tests before implementation (TDD)
- **T-2**: Separate unit tests from integration tests
- **T-3**: Use pytest fixtures for test data
- **T-4**: Include security test cases
- **Coverage Target**: ≥ 70%

## Security Guidelines
- **S-1**: Run Bandit scanner regularly: `bandit -r apps/`
- **S-2**: Validate all user inputs
- **S-3**: Use encryption service for sensitive data
- **S-4**: Implement proper authentication and authorization
- **S-5**: Never commit `.env` files or secrets

## Git Workflow
- **Branching Strategy**: GitFlow
- **Branch Naming**: 
  - Feature: `feature/ms-{ticket-number}`
  - Bugfix: `bugfix/ms-{ticket-number}`
  - Hotfix: `hotfix/ms-{ticket-number}`
- **Commit Format**: Conventional Commits
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - Example: `feat(auth): add OAuth2 support`

## Environment Configuration
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bflow_db
DB_USER=root
DB_PASSWORD=secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Media Cloud
MEDIA_DOMAIN=http://127.0.0.1:8881/api
MEDIA_SECRET_TOKEN_UI={KEY}

# Security
SECRET_KEY=django-insecure-...
DEBUG=True
ALLOWED_HOSTS=[]

# Google Services
GG_RECAPTCHA_ENABLED=1
GG_RECAPTCHA_SERVER_KEY=...
GG_RECAPTCHA_CLIENT_KEY=...
```

## Common Commands
```bash
# Development
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Testing
pytest
bandit -r apps/
black apps/
flake8 apps/

# Docker
docker-compose up -d
docker-compose down
docker-compose logs -f

# Celery
celery -A misui worker -l info
celery -A misui beat -l info
```

## API Endpoints Pattern
```
# List/Create
GET  /api/v1/{module}/{resource}/
POST /api/v1/{module}/{resource}/

# Retrieve/Update/Delete
GET    /api/v1/{module}/{resource}/{id}/
PUT    /api/v1/{module}/{resource}/{id}/
PATCH  /api/v1/{module}/{resource}/{id}/
DELETE /api/v1/{module}/{resource}/{id}/

# Custom Actions
POST /api/v1/{module}/{resource}/{id}/{action}/
```

## Performance Considerations
- **Database**: Use select_related() and prefetch_related() to avoid N+1 queries
- **Caching**: Implement Redis caching for frequently accessed data
- **Pagination**: Always paginate list responses
- **Background Tasks**: Use Celery for long-running operations
- **Static Files**: Serve through CDN in production

## Deployment
- **Environments**: Development → SIT → UAT → Production
- **Container**: Docker with docker-compose
- **Database Migrations**: Run migrations as part of deployment
- **Static Files**: Collect static files before deployment
- **Health Checks**: Implement health check endpoints

## Monitoring & Logging
- **Application Monitoring**: OpenTelemetry integration
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time, throughput, error rate
- **Business Metrics**: User activity, feature usage

## Project Documentation Structure
```
docs/
├── 01-business-analysis/       # Business requirements and analysis
│   ├── BRD.md                 # Business Requirements Document
│   └── SWOT-ANALYSIS.md       # SWOT Analysis
├── 02-product-management/      # Product planning and tracking
│   ├── PRODUCT_ROADMAP.md     # Product roadmap with MoSCoW
│   ├── USER-STORIES.md        # Complete user stories
│   └── SPRINT-PLANNING-REPORT.md # Sprint planning and progress
├── 03-technical-architecture/  # Technical design and architecture
│   ├── ARCHITECTURE-REVIEW.md # Architecture assessment
│   └── TECHNICAL-DESIGN.md    # Technical specifications
├── 04-development/            # Development guidelines
│   └── DEVELOPMENT-GUIDE.md   # Coding standards and practices
├── 05-testing/                # Testing documentation
│   └── TEST-PLAN.md          # Comprehensive test plan
├── 06-deployment/             # Deployment and operations
│   └── DEPLOYMENT-GUIDE.md    # Deployment procedures
├── 08-development-guides/     # Development references
│   └── UI-UX-DOCUMENTATION.md # UI/UX guidelines
└── 99-templates/              # Document templates
```

## Recent Updates
- **2025-07-25**: Comprehensive documentation suite created
- **2025-07-25**: Security vulnerabilities identified and documented
- **2025-07-25**: Performance optimization guidelines established
- **2025-07-25**: Microservices migration strategy defined
- **2025-07-25**: Complete test plan with all test types
- **2025-07-25**: UI/UX documentation and component library
- **2025-07-25**: Deployment guide with CI/CD pipeline
- **2025-07-25**: Quotation module documented
- **2025-07-25**: Sprint planning and progress tracking implemented

## Critical Security Issues (Immediate Action Required)
1. **Hardcoded SECRET_KEY** in settings - Move to environment variable
2. **DEBUG=True** in production - Set to False
3. **Missing rate limiting** - Implement Django-ratelimit
4. **SQL injection vulnerabilities** - Use parameterized queries
5. **No HTTPS enforcement** - Configure SSL/TLS

## Performance Optimization Priorities
1. **Database**: Add missing indexes, implement query optimization
2. **Caching**: Implement Redis caching strategy
3. **Frontend**: Enable compression, lazy loading, CDN
4. **API**: Implement pagination, response compression
5. **Background Jobs**: Move heavy operations to Celery

## Architecture Migration Path
- **Current**: Monolithic Django application
- **Target**: Microservices architecture
- **Timeline**: 6-9 months
- **First Services**: Authentication, Notification, Reporting
- **Strategy**: Strangler Fig pattern

## Testing Coverage Status
- **Current Coverage**: ~50%
- **Target Coverage**: 80%
- **Unit Tests**: Need expansion
- **Integration Tests**: Basic coverage
- **E2E Tests**: Not yet implemented
- **Performance Tests**: Not yet implemented

## Known Issues & TODOs
- ✅ Documentation improved significantly
- ⚠️ Test coverage is below target (current: ~50%, target: 80%)
- ⚠️ Performance optimization needed for large datasets
- ⚠️ Some modules lack proper error handling
- ✅ API documentation created for key modules
- ⚠️ Security vulnerabilities need immediate attention
- ⚠️ Need to implement monitoring and alerting
- ⚠️ Database migrations need review

## Team Responsibilities
- **Product Manager**: Product strategy and roadmap
- **CTO/Enterprise Architect**: Technical leadership
- **BA Lead**: Requirements and documentation
- **Technical Lead**: Development standards
- **QA/QC Lead**: Quality assurance
- **DevOps**: Infrastructure and deployment
- **Security Team**: Security implementation

## Quick Links
- **BRD**: [Business Requirements](docs/01-business-analysis/BRD.md)
- **Architecture**: [Architecture Review](docs/03-technical-architecture/ARCHITECTURE-REVIEW.md)
- **User Stories**: [User Stories](docs/02-product-management/USER-STORIES.md)
- **Test Plan**: [Test Plan](docs/05-testing/TEST-PLAN.md)
- **Deployment**: [Deployment Guide](docs/06-deployment/DEPLOYMENT-GUIDE.md)
- **Sprint Status**: [Sprint Report](docs/02-product-management/SPRINT-PLANNING-REPORT.md)

## Contact & Support
- **Product Manager**: Product Management Team
- **Tech Lead**: Development Team
- **Repository**: D:\workspace\mis_site\UI\sit
- **Documentation**: /docs directory
- **Support Email**: support@bflow-erp.com

---
**Last Updated**: 2025-07-25
**Version**: 2.0
**Next Review**: Weekly