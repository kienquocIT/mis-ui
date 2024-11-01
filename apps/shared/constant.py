from django.utils.translation import gettext_lazy as _

from .msg import LeaveMsg, BaseMsg
from .msg.workflow import WorkflowMsg

__all__ = [
    'LEAD_STATUS',
    'COMPANY_SIZE',
    'CUSTOMER_REVENUE',
    'PICKING_STATE',
    'WORKFLOW_ACTION',
    'DELIVERY_STATE',
    'TYPE_CUSTOMER',
    'ROLE_CUSTOMER',
    'PAID_BY',
    'SYSTEM_STATUS',
    'LEAVE_ACTION',
    'DEPENDENCIES_TYPE'
]

LEAD_STATUS = [
    {"value": 1, "name": _('Prospect')},
    {"value": 2, "name": _('Open - not contacted')},
    {"value": 3, "name": _('Working')},
    {"value": 4, "name": _('Opportunity created')},
    {"value": 5, "name": _('Disqualified')},
    {"value": 6, "name": _('Not a target')},
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

# Picking
PICKING_STATE = (
    (0, _('Ready')),
    (1, _('Done')),
)
# Delivery
DELIVERY_STATE = (
    (0, _('Wait')),
    (1, _('Ready')),
    (2, _('Done'))
)

# Workflow
WORKFLOW_ACTION = {
    0: [WorkflowMsg.ACTION_CREATE, 'fas fa-plus'],
    1: [WorkflowMsg.ACTION_APPROVED, 'fas fa-check text-success'],
    2: [WorkflowMsg.ACTION_REJECT, 'fas fa-times'],
    3: [WorkflowMsg.ACTION_RETURN, 'fas fa-fast-backward'],
    4: [WorkflowMsg.ACTION_RECEIVE, 'fas fa-check text-success'],
    5: [WorkflowMsg.ACTION_TODO, 'far fa-list-alt'],
}

SYSTEM_STATUS = (
    (0, BaseMsg.DRAFT),
    (1, BaseMsg.CREATED),
    (2, BaseMsg.ADDED),
    (3, BaseMsg.FINISH),
    (4, BaseMsg.CANCEL),
)

# Opportunity

TYPE_CUSTOMER = [
    {"value": 0, "name": _('Direct Customer')},
    {"value": 1, "name": _('End Customer')},
]

ROLE_CUSTOMER = [
    {"value": 0, "name": _('Decision Maker')},
    {"value": 1, "name": _('Influence')},
    {"value": 2, "name": _('Contact Involved')},
]

PAID_BY = {
    1: LeaveMsg.PAID_BY_ONE,
    2: LeaveMsg.PAID_BY_TWO,
    3: LeaveMsg.PAID_BY_THREE,
}

LEAVE_ACTION = {
    1: LeaveMsg.LEAVE_ACTION_INS,
    2: LeaveMsg.LEAVE_ACTION_DES,
}

DEPENDENCIES_TYPE = (
    (0, _("Start to start")),
    (1, _("Finish to start"))
)

CLOSE_OPEN_STATUS = (
    (0, _("Close")),
    (1, _("Open")),
)

LIST_BANK = (
    (0, 'VBSP', 'Vietnam Bank for Social Policies', 'Ngân hàng chính sách xã hội Việt Nam'),
    (1, 'VDP', 'Vietnam Development Bank', 'Ngân hàng phát triển Việt Nam'),
    (3, 'Agribank', 'Vietnam Bank for Agriculture and Rural Development',
     'Ngân hàng nông nghiệp và phát triển nông thôn Việt Nam'),
    (4, 'CB', 'Vietnam Construction Bank LLC', 'Ngân hàng thương mại TNHH MTV xây dựng Việt Nam'),
    (5, 'Oceanbank', 'Ocean Bank LLC', 'Ngân hàng thương mại TNHH MTV đại dương'),
    (6, 'GPBank', 'Global Petro Bank LLC', 'Ngân hàng thương mại TNHH MTV dầu khí toàn cầu'),
    (7, 'BIDV', 'Bank for Investment and Development of Vietnam',
     'Ngân hàng thương mại cổ phần đầu tư và phát triển Việt Nam'),
    (8, 'Vietcombank', 'Joint Stock Commercial Bank for Foreign Trade of Vietnam',
     'Ngân hàng thương mại cổ phần ngoại thương Việt Nam'),
    (9, 'Vietinbank', 'Vietnam Bank for Industry and Trade', 'Ngân hàng thương mại cổ phần công thương Việt Nam'),
    (10, 'VPBank', 'Vietnam Prosperity Bank JSC', 'Ngân hàng TMCP Việt Nam thịnh vượng'),
    (11, 'MB', 'Military Bank JSC', 'Ngân hàng TMCP quân đội'),
    (12, 'ACB', 'Asia Commercial Bank JSC', 'Ngân hàng TMCP Á Châu'),
    (13, 'SHB', 'Saigon - Hanoi Bank JSC', 'Ngân hàng TMCP Sài Gòn - Hà Nội'),
    (14, 'Techcombank', 'Vietnam Technological and Commercial Bank JSC', 'Ngân hàng TMCP kỹ thương Việt Nam'),
    (15, 'HDBank', 'Ho Chi Minh City Development Bank JSC', 'Ngân hàng TMCP phát triển TP.HCM'),
    (16, 'LPBank', 'Fortune Vietnam Commercial Bank JSC', 'Ngân hàng TMCP lộc phát Việt Nam'),
    (17, 'VIB', 'Vietnam International Bank JSC', 'Ngân hàng TMCP quốc tế Việt Nam'),
    (18, 'SeABank', 'Southeast Asia Bank JSC', 'Ngân hàng TMCP đông nam á'),
    (19, 'TPBank', 'Tien Phong Bank JSC', 'Ngân hàng TMCP tiên phong'),
    (20, 'OCB', 'Orient Commercial Bank JSC', 'Ngân hàng TMCP phương đông'),
    (21, 'SCB', 'Saigon Commercial Bank JSC', 'Ngân hàng TMCP Sài Gòn'),
    (22, 'MSB', 'Vietnam Maritime Bank JSC', 'Ngân hàng TMCP hàng hải Việt Nam'),
    (23, 'Sacombank', 'Saigon Thuong Tin Commercial Bank JSC', 'Ngân hàng TMCP Sài Gòn thương tín'),
    (24, 'Eximbank', 'Vietnam Export-Import Commercial Bank JSC', 'Ngân hàng TMCP xuất nhập khẩu Việt Nam'),
    (25, 'NCB', 'National Citizen Bank JSC', 'Ngân hàng TMCP quốc dân'),
    (26, 'NamABank', 'Nam A Bank JSC', 'Ngân hàng TMCP nam á'),
    (27, 'ABBank', 'An Binh Bank JSC', 'Ngân hàng TMCP an bình'),
    (28, 'PVComBank', 'Vietnam Public Commercial Bank JSC', 'Ngân hàng TMCP đại chúng Việt Nam'),
    (29, 'BacABank', 'Bac A Bank JSC', 'Ngân hàng TMCP bắc á'),
    (30, 'VietBank', 'Viet Nam Thuong Tin Bank JSC', 'Ngân hàng TMCP Việt Nam thương tín'),
)
