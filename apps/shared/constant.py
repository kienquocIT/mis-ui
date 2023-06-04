from django.utils.translation import gettext_lazy as _
from .msg.workflow import WorkflowMsg

__all__ = [
    'COMPANY_SIZE',
    'CUSTOMER_REVENUE',
    'WORKFLOW_ACTION',
]

CUSTOMER_REVENUE = [
    {"value": 1, "name": _('1-10 billions')},
    {"value": 2, "name": _('10-20 billions')},
    {"value": 3, "name": _('20-50 billions')},
    {"value": 4, "name": _('50-200 billions')},
    {"value": 5, "name": _('200-1000 billions')},
    {"value": 6, "name": _('> 1000 billions')},
]

COMPANY_SIZE = [
    {"value": 1, "name": _('< 20 people')},
    {"value": 2, "name": _('20-50 people')},
    {"value": 3, "name": _('50-200 people')},
    {"value": 4, "name": _('200-500 people')},
    {"value": 5, "name": _('> 500 people')},
]

# Workflow
WORKFLOW_ACTION = {
    0: [WorkflowMsg.ACTION_CREATE, 'fas fa-plus'],
    1: [WorkflowMsg.ACTION_APPROVED, 'far fa-thumbs-up text-success'],
    2: [WorkflowMsg.ACTION_REJECT, 'fas fa-times'],
    3: [WorkflowMsg.ACTION_RETURN, 'fas fa-fast-backward'],
    4: [WorkflowMsg.ACTION_RECEIVE, 'fas fa-spell-check'],
    5: [WorkflowMsg.ACTION_TODO, 'far fa-list-alt'],
}
