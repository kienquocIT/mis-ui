class StringUrl(str):
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


class ApiURL(object):
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

    # organization/role
    ROLE_LIST = StringUrl('hr/roles')
    ROLE_DETAIL = StringUrl('hr/role')

    # base
    PLAN_LIST = StringUrl('base/plans')

    TENANT = StringUrl('tenant/userlist')
    # HR
    EMPLOYEE_BY_COMPANY_OVERVIEW = StringUrl('hr/employee/company-overview')
