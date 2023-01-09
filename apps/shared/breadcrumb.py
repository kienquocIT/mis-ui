from django.urls import reverse, NoReverseMatch
from django.utils.translation import gettext_lazy


class BreadcrumbChildren(object):
    def __init__(self, title, url=None, arg_pattern=None, kw_pattern=None):
        self.title = title
        self.url = url if url else ''
        self.arg_pattern = arg_pattern if arg_pattern and isinstance(arg_pattern, list) else []
        self.kw_pattern = kw_pattern if kw_pattern and isinstance(kw_pattern, dict) else {}

    @property
    def data(self):
        return {
            'title': gettext_lazy(self.title) if self.title else '#',
            'url': reverse(self.url, kwargs=self.kw_pattern) if self.url else '#',
        }


class BreadcrumbItem(object):
    HOME_PAGE = BreadcrumbChildren('Home Page', 'HomeView')
    HR_PAGE = BreadcrumbChildren('HR')
    EMPLOYEE_LIST_PAGE = BreadcrumbChildren('Employee List', 'EmployeeList')
    HOME_VIEW_SPACE = BreadcrumbChildren('Employee List', 'HomeViewSpace', kw_pattern={'space_code': 'e-office'})
    EMPLOYEE_CREATE_PAGE = BreadcrumbChildren('Employee Create', 'EmployeeCreate')
    ORGANIZATION_PAGE = BreadcrumbChildren('Organization', 'GroupList')
    GROUP_LEVEL_LIST_PAGE = BreadcrumbChildren('Organization Level', 'GroupLevelList')
    GROUP_LEVEL_CREATE_PAGE = BreadcrumbChildren('Group Level Create', 'GroupLevelCreate')

    USER_LIST_PAGE = BreadcrumbChildren('User List', 'UserList')

    USER_CREATE_PAGE = BreadcrumbChildren('User Create', 'UserCreate')

    GROUP_LIST_PAGE = BreadcrumbChildren('Organization Group', 'GroupList')
    COMPANY_PAGE = BreadcrumbChildren('Company')

    ROLE_LIST_PAGE = BreadcrumbChildren('Role List', 'RoleList')
    ROLE_CREATE_PAGE = BreadcrumbChildren("Create Role", 'RoleCreate')

    TENANT_INFORMATION_PAGE = BreadcrumbChildren('Tenant Information', 'TenantInformation')


class BreadcrumbView:
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
            msg = f'''Some view was used in Breadcrumb does not exist. It is: \n'''
            msg += '************************************************************\n'
            for k, v in view_errs.items():
                msg += f'* {k}: {v}\n'
            msg += '************************************************************\n'
            raise NoReverseMatch(msg)
        return True

    @classmethod
    def parsed(cls, name: str) -> list:
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

    GROUP_LEVEL_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.ORGANIZATION_PAGE,
        BreadcrumbItem.GROUP_LEVEL_LIST_PAGE,
    ]

    GROUP_LEVEL_CREATE_PAGE = GROUP_LEVEL_LIST_PAGE + [BreadcrumbItem.GROUP_LEVEL_CREATE_PAGE]

    GROUP_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.ORGANIZATION_PAGE,
        BreadcrumbItem.GROUP_LIST_PAGE,
    ]

    COMPANY_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.COMPANY_PAGE,
    ]

    ROLE_LIST_PAGE = [
        BreadcrumbItem.HOME_PAGE,
        BreadcrumbItem.HR_PAGE,
        BreadcrumbItem.ROLE_LIST_PAGE,
    ]

    ROLE_CREATE_PAGE = ROLE_LIST_PAGE + [BreadcrumbItem.ROLE_CREATE_PAGE]

    TENANT_INFORMATION_PAGE = [BreadcrumbItem.HOME_PAGE, BreadcrumbItem.TENANT_INFORMATION_PAGE]

