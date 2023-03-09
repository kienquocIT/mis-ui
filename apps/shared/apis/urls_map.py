"""not need import module"""
class StringUrl(str):  # pylint: disable=too-few-public-methods
    """convert str url"""
    def push_id(self, _id):
        return f'{self}/{_id}'

    def fill_key(self, **kwargs):
        # 'abc/{a1}/{b1}/{c1}' + kwargs={"a1": "1", "b1": 2, "c1": 3}
        # Return ==> 'abc/1/2/3'
        return self.format(**kwargs)

    def fill_idx(self, *args):
        # 'abc/{}/{}/{}' + args=[1, 2, 3]
        # Return ==> 'abc/1/2/3'
        return self.format(*args)


class ApiURL:
    """API link BE"""
    @staticmethod
    def push_id(url, _id):
        return f'{url}/{_id}'

    login = StringUrl('auth/sign-in')
    logout = StringUrl('auth/logout')
    my_profile = StringUrl('auth/profile')
    refresh_token = StringUrl('auth/token-refresh')
    tenants = StringUrl('provisioning/tenants')
    user_list = StringUrl('account/users')
    user_detail = StringUrl('account/user')

    # tenant
    TENANT_PLAN_LIST = StringUrl('tenant/tenant-plans')

    # account
    ACCOUNT_USER_COMPANY = StringUrl('account/user-company')

    # employee
    EMPLOYEE_LIST = StringUrl('hr/employees')
    EMPLOYEE_DETAIL = StringUrl('hr/employee')

    # organization/group
    GROUP_LEVEL_LIST = StringUrl('hr/levels')
    GROUP_LIST = StringUrl('hr/groups')
    GROUP_DETAIL = StringUrl('hr/group')
    GROUP_PARENT = 'hr/group/parent'

    # home/company
    COMPANY_LIST = StringUrl('company/list')
    COMPANY_DETAIL = 'company/list'
    COMPANY_OVERVIEW = StringUrl('company/overview')
    COMPANY_USER_NOT_MAP_EMPLOYEE = StringUrl('company/user-available')
    COMPANY_USER_COMPANY = StringUrl('company/user-company')

    # organization/role
    ROLE_LIST = StringUrl('hr/roles')
    ROLE_DETAIL = StringUrl('hr/role')

    # base
    PLAN_LIST = StringUrl('base/plans')

    TENANT = StringUrl('tenant/userlist')
    # HR
    EMPLOYEE_BY_COMPANY_OVERVIEW = StringUrl('company/overview/employee/{company_id}')
    USER_BY_COMPANY_OVERVIEW = StringUrl('company/overview/user/{company_id}')
    COMPANY_OF_USER_OVERVIEW = StringUrl('company/overview/company-of-user/{company_id}')
