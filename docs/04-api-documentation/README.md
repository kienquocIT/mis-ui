# API Documentation

## 🔌 Tổng quan

Thư mục này chứa tài liệu chi tiết về tất cả API endpoints, authentication, và integration guidelines cho Bflow ERP Platform.

## 📁 Danh sách Tài liệu

### 🔄 Đang phát triển
- **API Reference Guide**
  - Complete endpoint documentation
  - Request/Response examples
  - Error codes
  - Dự kiến: Q1 2024

- **Authentication Guide**
  - JWT implementation
  - OAuth2 flow
  - API key management
  - Dự kiến: Q1 2024

- **Webhook Documentation**
  - Available webhooks
  - Payload formats
  - Retry mechanism
  - Dự kiến: Q2 2024

### 📋 Kế hoạch phát triển
- **GraphQL Documentation** - Q3 2024
- **WebSocket API Guide** - Q3 2024
- **API Migration Guide** - Q4 2024
- **SDK Documentation** - Q4 2024

## 🎯 API Design Principles

1. **RESTful**: Follow REST conventions
2. **Consistent**: Uniform response format
3. **Versioned**: Support multiple versions
4. **Documented**: OpenAPI/Swagger specs
5. **Secure**: Authentication required

## 📊 API Overview

### Base URL
```
Development: http://localhost:8000/api/v1/
Production: https://api.bflow.com/v1/
```

### Authentication
```http
Authorization: Bearer {jwt_token}
X-Tenant-ID: {tenant_id}
```

### Response Format
```json
{
    "status": true,
    "message": "Success",
    "data": {},
    "errors": null,
    "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🔧 API Modules

### Core APIs
| Module | Endpoints | Status |
|--------|-----------|---------|
| Authentication | `/auth/*` | ✅ Stable |
| Users | `/users/*` | ✅ Stable |
| Permissions | `/permissions/*` | ✅ Stable |
| Workflow | `/workflow/*` | 🔄 Beta |

### Business APIs
| Module | Endpoints | Status |
|--------|-----------|---------|
| Sales | `/sales/*` | 🔄 Beta |
| HRM | `/hrm/*` | 🔄 Beta |
| Inventory | `/inventory/*` | 🟡 Alpha |
| Accounting | `/accounting/*` | 🔴 Planned |

## 📝 API Standards

### HTTP Methods
- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT` - Full update
- `PATCH` - Partial update
- `DELETE` - Remove resources

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

### Pagination
```
GET /api/v1/users?page=1&per_page=20
```

### Filtering
```
GET /api/v1/users?role=admin&status=active
```

### Sorting
```
GET /api/v1/users?sort=created_at&order=desc
```

## 🔐 Security Guidelines

1. **Always use HTTPS** in production
2. **Validate all inputs**
3. **Rate limiting** implemented
4. **API versioning** for backward compatibility
5. **Audit logging** for all operations

## 📊 API Metrics

### Performance Targets
- Response Time: < 100ms (p50)
- Throughput: > 5000 req/min
- Success Rate: > 99.9%

### Rate Limits
- Standard: 1000 requests/hour
- Premium: 5000 requests/hour
- Enterprise: Unlimited

## 🧪 Testing APIs

### Tools
- Postman Collection (Coming soon)
- Swagger UI: `/api/docs/`
- cURL examples in documentation

### Test Environment
```
Base URL: https://api-test.bflow.com/v1/
Test API Key: Contact DevOps team
```

## 👥 API Support

- **API Team Lead**: api-lead@bflow.com
- **Developer Forum**: forum.bflow.com/api
- **API Status**: status.bflow.com
- **Slack Channel**: #api-support

## 📝 Templates

- [API Endpoint Template](../99-templates/api-endpoint-template.md)
- [API Error Template](../99-templates/api-error-template.md)
- [Webhook Template](../99-templates/webhook-template.md)

## 🔄 Changelog

### Upcoming Changes
- v2 API design in progress
- GraphQL endpoint planning
- WebSocket support

### Recent Changes
- 2024-01: Added pagination to all list endpoints
- 2024-01: Implemented rate limiting
- 2023-12: JWT authentication added

---

**Maintained by**: API Team  
**Last Updated**: 2025-07-25  
**API Version**: v1