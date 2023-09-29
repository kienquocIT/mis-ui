from django.utils.translation import gettext_lazy as _


class LeaveMsg:
    LEAVE_TYPE_CREATE = _('Leave type create successfully')
    LEAVE_TYPE_DELETE = _('Leave type delete successfully')
    LEAVE_TYPE_UPDATE = _('Leave type update successfully')
    PAID_BY_ONE = _('Company salary')
    PAID_BY_TWO = _('Social insurance')
    PAID_BY_THREE = _('Unpaid')
    WORKING_CALENDAR_UPDATE = _("Working calendar update successfully")
    WORKING_YEAR_CREATE = _("Working year create successfully")
    WORKING_YEAR_DELETE = _("Working year deleted")
    WORKING_HOLIDAY_CREATE = _("The holiday create successfully")
    WORKING_HOLIDAY_UPDATE = _("The holiday has been updated successfully")
    WORKING_HOLIDAY_DELETE = _("The holiday deleted")
