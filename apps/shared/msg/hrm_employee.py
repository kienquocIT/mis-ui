"""system module"""
from django.utils.translation import gettext_lazy as _


class HRMMsg:  # pylint: disable=too-few-public-methods
    """HRM message translation"""
    HRM_EMPLOYEE_INFO_CREATE = _('Employee info create successfully')
    HRM_EMPLOYEE_INFO_UPDATE = _('Employee info update successfully')
