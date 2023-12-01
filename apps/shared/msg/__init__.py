"""init folder"""
from django.utils.translation import gettext_lazy as _

from .auth import AuthMsg
from .server import ServerMsg
from .hr import HRMsg
from .workflow import WorkflowMsg
from .permissions import PermsMsg
from .sale import MDConfigMsg
from .sales import SaleMsg
from .promotion import PromotionMsg
from .eoffice import LeaveMsg


class BaseMsg:
    NOT_FOUND = _('The record is not found')
    EXCEPTION = _('The process raise exception')
    SUCCESS = _('Successful')
    CREATE = _('create')
    UPDATE = _('update')
    DELETE = _('delete')
    SUCCESSFULLY = _('successfully')
    DRAFT = _('Draft')
    CREATED = _('Created')
    ADDED = _('Added')
    FINISH = _('Finish')
    CANCEL = _('Cancel')
