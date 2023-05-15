"""system module"""
from django.urls import reverse, NoReverseMatch
from django.utils.translation import gettext_lazy as _


class BreadcrumbChildren:  # pylint: disable=too-few-public-methods
    """prepare url breadcrumbs"""
    def __init__(self, title, url=None, arg_pattern=None, kw_pattern=None):
        self.title = title
        self.url = url if url else ''
        self.arg_pattern = arg_pattern if arg_pattern and isinstance(arg_pattern, list) else []
        self.kw_pattern = kw_pattern if kw_pattern and isinstance(kw_pattern, dict) else {}

    @property
    def data(self):
        """template data"""
        return {
            'title': self.title if self.title else '#',
            'url': reverse(self.url, kwargs=self.kw_pattern) if self.url else '#',
        }


class BreadcrumbItem:  # pylint: disable=too-few-public-methods
    """prepare text menu line"""
    # home
    HOME_PAGE = BreadcrumbChildren(
        _('Home Page'), 'HomeView'
    )
    HOME_VIEW_SPACE = BreadcrumbChildren(
        _('Employee List'),
        'HomeViewSpace',
        kw_pattern={'space_code': 'e-office'}
    )

    # hr
    HR_PAGE = BreadcrumbChildren(_('HR'))
    EMPLOYEE_LIST_PAGE = BreadcrumbChildren(_('Employee List'), 'EmployeeList')
    EMPLOYEE_CREATE_PAGE = BreadcrumbChildren(_('Employee Create'), 'EmployeeCreate')
    GROUP_LEVEL_LIST_PAGE = BreadcrumbChildren(_('Organization Level'), 'GroupLevelList')
    GROUP_LIST_PAGE = BreadcrumbChildren(_('Organization Group'), 'GroupList')
    ROLE_LIST_PAGE = BreadcrumbChildren(_('Role List'), 'RoleList')
    ROLE_CREATE_PAGE = BreadcrumbChildren(_("Create Role"), 'RoleCreate')

    # tenant
    ORGANIZATION_PAGE = BreadcrumbChildren(_('Organization'), 'GroupList')

    # user
    USER_LIST_PAGE = BreadcrumbChildren(_('User List'), 'UserList')
    USER_CREATE_PAGE = BreadcrumbChildren(_('User Create'), 'UserCreate')
    USER_DETAIL_PAGE = BreadcrumbChildren(_('User detail'))
    USER_EDIT_PAGE = BreadcrumbChildren(_('Edit user'))

    # company
    COMPANY_PAGE = BreadcrumbChildren(_('Company'), 'CompanyList')
    COMPANY_OVERVIEW_PAGE = BreadcrumbChildren(_('Company Overview'), 'CompanyListOverviewList')
    COMPANY_OVERVIEW_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # TENANT_INFORMATION_PAGE = BreadcrumbChildren('Tenant Information', 'TenantInformation')

    # components
    COMPONENTS_PAGE = BreadcrumbChildren(_('Component'), 'ComponentCollections')

    # Workflow
    WORKFLOW_LIST_PAGE = BreadcrumbChildren(_('Workflow list'), 'WorkflowList')
    WORKFLOW_CREATE_PAGE = BreadcrumbChildren(_('Workflow create'), 'WorkflowCreate')
    WORKFLOW_DETAIL_PAGE = BreadcrumbChildren(_('Workflow detail'))

    # Contact, Account
    CONTACT_LIST_PAGE = BreadcrumbChildren(_('Contact list'), 'ContactList')
    CONTACT_CREATE_PAGE = BreadcrumbChildren(_('Contact create'), 'ContactCreate')
    CONTACT_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    ACCOUNT_LIST_PAGE = BreadcrumbChildren(_('Account list'), 'AccountList')
    ACCOUNT_CREATE_PAGE = BreadcrumbChildren(_('Account create'), 'AccountCreate')
    ACCOUNT_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # Master Data
    CONTACT_MASTER_DATA_LIST_PAGE = BreadcrumbChildren(_('Master Data Contact'), 'ContactMasterDataList')
    ACCOUNT_MASTER_DATA_LIST_PAGE = BreadcrumbChildren(_('Master Data Account'), 'AccountMasterDataList')
    PRODUCT_MASTER_DATA_LIST_PAGE = BreadcrumbChildren(_('Master Data Product'), 'ProductMasterDataList')

    # Product
    PRODUCT_LIST_PAGE = BreadcrumbChildren(_('Product list'), 'ProductList')
    PRODUCT_CREATE_PAGE = BreadcrumbChildren(_('Product create'), 'ProductCreate')
    PRODUCT_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # Price
    PRICE_LIST_PAGE = BreadcrumbChildren(_('Price list'), 'PriceList')
    PRICE_LIST_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # Expense
    EXPENSE_LIST_PAGE = BreadcrumbChildren(_('Expense list'), 'ExpenseList')
    EXPENSE_CREATE_PAGE = BreadcrumbChildren(_('Expense create'), 'ExpenseCreate')
    EXPENSE_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))
    # Promotion
    PROMOTION_LIST_PAGE = BreadcrumbChildren(_('Promotion List'), 'PromotionList')
    PROMOTION_CREATE_PAGE = BreadcrumbChildren(_('Promotion create'), 'PromotionCreate')
    PROMOTION_DETAIL_PAGE = BreadcrumbChildren(_('Promotion detail'))

    # Opportunity
    OPPORTUNITY_LIST_PAGE = BreadcrumbChildren(_('Opportunity list'), 'OpportunityList')

    # Quotation
    QUOTATION_LIST_PAGE = BreadcrumbChildren(_('Quotation list'), 'QuotationList')
    QUOTATION_CREATE_PAGE = BreadcrumbChildren(_('Quotation create'), 'QuotationCreate')

    # Shipping
    SHIPPING_LIST_PAGE = BreadcrumbChildren(_('Shipping list'), 'ShippingList')
    SHIPPING_CREATE_PAGE = BreadcrumbChildren(_('Shipping create'), 'ShippingCreate')
    SHIPPING_DETAIL_PAGE = BreadcrumbChildren(_('Detail'))

    # WareHouse
    WAREHOUSE_LIST_PAGE = BreadcrumbChildren(_('WareHouse'), 'WareHouseList')


class BreadcrumbView:
    """menu vertical item view"""
    @staticmethod
    def check_view_name():
        """
        Check view was used in BreadcrumbItem that is exists
        Returns:
            True : Nothing happened
            or NoReverseMatch : raise Error and interrupt runtime process
        """
        view_errs = {}
        for att in dir(BreadcrumbItem()):
            if not att.startswith('__'):
                child = getattr(BreadcrumbItem, att)
                try:
                    if child.url:
                        if child.kw_pattern and child.arg_pattern:
                            reverse(child.url, args=child.arg_pattern, kwargs=child.kw_pattern)
                        elif child.arg_pattern:
                            reverse(child.url, args=child.arg_pattern)
                        elif child.kw_pattern:
                            reverse(child.url, kwargs=child.kw_pattern)
                        else:
                            reverse(child.url)

                except NoReverseMatch as err:
                    view_errs[att] = str(err)

        if view_errs:
            msg = 'Some view was used in Breadcrumb does not exist. It is: \n'
            msg += '************************************************************\n'
            for k, value in view_errs.items():
                msg += f'* {k}: {value}\n'
            msg += '************************************************************\n'
            raise NoReverseMatch(msg)
        return True

    @classmethod
    def parsed(cls, name: str) -> list:
        """method parsed data custom"""
        data = getattr(cls, name, [])
        if data and isinstance(data, list):
            return [item.data for item in data]
        return []

    HOME_PAGE = [
        BreadcrumbItem.HOME_PAGE,
    ]

    EMPLOYEE_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.HR_PAGE,
        BreadcrumbItem.EMPLOYEE_LIST_PAGE,
    ]

    EMPLOYEE_CREATE_PAGE = EMPLOYEE_LIST_PAGE + [BreadcrumbItem.EMPLOYEE_CREATE_PAGE]

    USER_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.USER_LIST_PAGE,
    ]

    USER_CREATE_PAGE = USER_LIST_PAGE + [BreadcrumbItem.USER_CREATE_PAGE]

    USER_DETAIL_PAGE = USER_LIST_PAGE + [BreadcrumbItem.USER_DETAIL_PAGE]

    USER_EDIT_PAGE = USER_LIST_PAGE + [BreadcrumbItem.USER_EDIT_PAGE]

    GROUP_LEVEL_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.ORGANIZATION_PAGE,
        BreadcrumbItem.GROUP_LEVEL_LIST_PAGE,
    ]

    GROUP_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.ORGANIZATION_PAGE,
        BreadcrumbItem.GROUP_LIST_PAGE,
    ]

    COMPANY_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.COMPANY_PAGE,
    ]

    COMPANY_OVERVIEW_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.COMPANY_PAGE,
        BreadcrumbItem.COMPANY_OVERVIEW_PAGE,
    ]

    COMPANY_OVERVIEW_DETAIL_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.COMPANY_PAGE,
        BreadcrumbItem.COMPANY_OVERVIEW_PAGE,
        BreadcrumbItem.COMPANY_OVERVIEW_DETAIL_PAGE,
    ]

    ROLE_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.HR_PAGE,
        BreadcrumbItem.ROLE_LIST_PAGE,
    ]

    ROLE_CREATE_PAGE = ROLE_LIST_PAGE + [BreadcrumbItem.ROLE_CREATE_PAGE]

    # TENANT_INFORMATION_PAGE = [BreadcrumbItem.HOME_PAGE, BreadcrumbItem.TENANT_INFORMATION_PAGE]
    WORKFLOW_LIST_PAGE = [
        BreadcrumbItem.WORKFLOW_LIST_PAGE
    ]

    WORKFLOW_CREATE_PAGE = WORKFLOW_LIST_PAGE + [BreadcrumbItem.WORKFLOW_CREATE_PAGE]
    WORKFLOW_DETAIL_PAGE = WORKFLOW_LIST_PAGE + [BreadcrumbItem.WORKFLOW_DETAIL_PAGE]

    CONTACT_LIST_PAGE = [
        BreadcrumbItem.CONTACT_LIST_PAGE
    ]
    CONTACT_CREATE_PAGE = CONTACT_LIST_PAGE + [BreadcrumbItem.CONTACT_CREATE_PAGE]
    CONTACT_DETAIL_PAGE = CONTACT_LIST_PAGE + [BreadcrumbItem.CONTACT_DETAIL_PAGE]

    ACCOUNT_LIST_PAGE = [
        BreadcrumbItem.ACCOUNT_LIST_PAGE
    ]
    ACCOUNT_CREATE_PAGE = ACCOUNT_LIST_PAGE + [BreadcrumbItem.ACCOUNT_CREATE_PAGE]
    ACCOUNT_DETAIL_PAGE = ACCOUNT_LIST_PAGE + [BreadcrumbItem.ACCOUNT_DETAIL_PAGE]

    CONTACT_MASTER_DATA_LIST_PAGE = [
        BreadcrumbItem.CONTACT_MASTER_DATA_LIST_PAGE
    ]
    ACCOUNT_MASTER_DATA_LIST_PAGE = [
        BreadcrumbItem.ACCOUNT_MASTER_DATA_LIST_PAGE
    ]
    PRODUCT_MASTER_DATA_LIST_PAGE = [
        BreadcrumbItem.PRODUCT_MASTER_DATA_LIST_PAGE
    ]

    PRODUCT_LIST_PAGE = [
        BreadcrumbItem.PRODUCT_LIST_PAGE
    ]
    PRODUCT_CREATE_PAGE = PRODUCT_LIST_PAGE + [BreadcrumbItem.PRODUCT_CREATE_PAGE]
    PRODUCT_DETAIL_PAGE = PRODUCT_LIST_PAGE + [BreadcrumbItem.PRODUCT_DETAIL_PAGE]

    PRICE_LIST_PAGE = [
        BreadcrumbItem.PRICE_LIST_PAGE
    ]
    PRICE_LIST_DETAIL_PAGE = PRICE_LIST_PAGE + [BreadcrumbItem.PRICE_LIST_DETAIL_PAGE]

    EXPENSE_LIST_PAGE = [BreadcrumbItem.EXPENSE_LIST_PAGE]
    EXPENSE_CREATE_PAGE = EXPENSE_LIST_PAGE + [BreadcrumbItem.EXPENSE_CREATE_PAGE]
    EXPENSE_DETAIL_PAGE = EXPENSE_LIST_PAGE + [BreadcrumbItem.EXPENSE_DETAIL_PAGE]

    PROMOTION_LIST_PAGE = [
        BreadcrumbItem.PROMOTION_LIST_PAGE
    ]

    PROMOTION_CREATE_PAGE = PROMOTION_LIST_PAGE + [BreadcrumbItem.PROMOTION_CREATE_PAGE]
    PROMOTION_DETAIL_PAGE = PROMOTION_LIST_PAGE + [BreadcrumbItem.PROMOTION_DETAIL_PAGE]

    # Opportunity
    OPPORTUNITY_LIST_PAGE = [
        BreadcrumbItem.OPPORTUNITY_LIST_PAGE
    ]

    # Quotation
    QUOTATION_LIST_PAGE = [
        BreadcrumbItem.QUOTATION_LIST_PAGE
    ]
    QUOTATION_CREATE_PAGE = QUOTATION_LIST_PAGE + [BreadcrumbItem.QUOTATION_CREATE_PAGE]

    # Shipping
    SHIPPING_LIST_PAGE = [
        BreadcrumbItem.SHIPPING_LIST_PAGE
    ]
    SHIPPING_CREATE_PAGE = SHIPPING_LIST_PAGE + [BreadcrumbItem.SHIPPING_CREATE_PAGE]
    SHIPPING_DETAIL_PAGE = SHIPPING_LIST_PAGE + [BreadcrumbItem.SHIPPING_DETAIL_PAGE]

    # Warehouse
    WAREHOUSE_LIST_PAGE = [
        BreadcrumbItem.WAREHOUSE_LIST_PAGE
    ]
