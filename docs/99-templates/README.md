# Documentation Templates

## 📝 Tổng quan

Thư mục này chứa các template chuẩn cho việc tạo tài liệu mới trong dự án Bflow ERP Platform. Sử dụng các template này để đảm bảo tính nhất quán trong toàn bộ documentation.

## 📁 Danh sách Templates

### Business & Product Templates
- [BRD-template.md](BRD-template.md) - Business Requirements Document
- [FRS-template.md](FRS-template.md) - Functional Requirements Specification
- [use-case-template.md](use-case-template.md) - Use Case Documentation
- [feature-spec-template.md](feature-spec-template.md) - Feature Specification
- [user-story-template.md](user-story-template.md) - User Story Format

### Technical Templates
- [adr-template.md](adr-template.md) - Architecture Decision Record
- [design-doc-template.md](design-doc-template.md) - Technical Design Document
- [api-endpoint-template.md](api-endpoint-template.md) - API Endpoint Documentation
- [database-design-template.md](database-design-template.md) - Database Design

### Testing Templates
- [test-plan-template.md](test-plan-template.md) - Test Plan
- [test-case-template.md](test-case-template.md) - Test Case
- [bug-report-template.md](bug-report-template.md) - Bug Report

### Operations Templates
- [runbook-template.md](runbook-template.md) - Operational Runbook
- [deployment-checklist.md](deployment-checklist.md) - Deployment Checklist
- [incident-template.md](incident-template.md) - Incident Report

### General Templates
- [meeting-notes-template.md](meeting-notes-template.md) - Meeting Notes
- [release-notes-template.md](release-notes-template.md) - Release Notes
- [review-template.md](review-template.md) - Document Review

## 🎯 Sử dụng Templates

### Cách sử dụng
1. Copy template phù hợp
2. Rename file theo convention
3. Fill in các sections
4. Remove các phần không cần thiết
5. Add vào đúng folder

### Naming Convention
```
{document-type}-{module}-{version}.md
Ví dụ: BRD-sales-v1.0.md
```

## 📋 Template Guidelines

### Required Sections
Mọi template đều phải có:
- Document header với metadata
- Table of contents (nếu > 3 sections)
- Version history
- Approval section

### Formatting Rules
- Use Markdown formatting
- Headers với #, ##, ###
- Tables cho structured data
- Code blocks với syntax highlighting
- Mermaid cho diagrams

## 🔧 Creating New Templates

### Process
1. Identify need cho template mới
2. Draft template structure
3. Review với team
4. Add to repository
5. Update README này

### Template Structure
```markdown
# [Template Title]

## Document Information
- **Type**: [Document Type]
- **Version**: [X.Y]
- **Date**: [YYYY-MM-DD]
- **Author**: [Name]
- **Status**: [Draft/Review/Approved]

## Table of Contents
1. [Section 1]
2. [Section 2]
3. [Section 3]

## 1. [Section 1]
[Content guidelines]

## 2. [Section 2]
[Content guidelines]

## Appendices
[Optional sections]

## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | Name | Initial version |
```

## 📝 Quick Reference

### Common Markdown Elements
```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`Code inline`

```code block```

- Bullet list
1. Numbered list

[Link text](URL)
![Image alt](image-url)

| Table | Header |
|-------|--------|
| Cell | Cell |
```

### Mermaid Diagrams
```mermaid
graph LR
    A[Start] --> B[Process]
    B --> C[End]
```

## 🚦 Template Status

| Template | Status | Last Updated |
|----------|--------|--------------|
| BRD Template | ✅ Ready | 2025-07-25 |
| FRS Template | 🔄 In Progress | - |
| ADR Template | ✅ Ready | 2025-07-25 |
| Test Plan Template | 🔄 In Progress | - |

## 👥 Template Maintenance

- **Owner**: Documentation Team
- **Review Cycle**: Quarterly
- **Feedback**: docs@bflow.com

---

**Note**: Always use the latest version of templates. Check for updates regularly.