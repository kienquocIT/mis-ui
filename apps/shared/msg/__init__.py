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


class BaseMsg:
    NOT_FOUND = _('The record is not found')
    EXCEPTION = _('The process raise exception')
