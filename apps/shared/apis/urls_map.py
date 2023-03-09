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

    # tenant
    TENANT_PLAN_LIST = StringUrl('tenant/tenant-plans')

    # account
    ACCOUNT_USER_COMPANY = StringUrl('account/user-company')

    # employee
    EMPLOYEE_LIST = StringUrl('hr/employees')
    EMPLOYEE_DETAIL = StringUrl('hr/employee')
    EMPLOYEE_COMPANY = StringUrl('hr/employee/company')

    # organization/group
    GROUP_LEVEL_LIST = StringUrl('hr/levels')
    GROUP_LIST = StringUrl('hr/groups')
    GROUP_DETAIL = StringUrl('hr/group')
    GROUP_PARENT = StringUrl('hr/group/parent')

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
    TENANT_APPLICATION_LIST = StringUrl('base/tenant-applications')
    APPLICATION_PROPERTY_LIST = StringUrl('base/tenant-applications-property')
    APPLICATION_PROPERTY_EMPLOYEE_LIST = StringUrl('base/applications-property-employee')

    TENANT = StringUrl('tenant/userlist')
    # HR
    EMPLOYEE_BY_COMPANY_OVERVIEW = StringUrl('company/overview/employee/{company_id}')
    USER_BY_COMPANY_OVERVIEW = StringUrl('company/overview/user/{company_id}')
    COMPANY_OF_USER_OVERVIEW = StringUrl('company/overview/company-of-user/{company_id}')

    # WORKFLOW
    WORKFLOW_LIST = StringUrl('workflow/lists')
    WORKFLOW_CREATE = StringUrl('workflow/create')
    WORKFLOW_NODE_SYSTEM_LIST = StringUrl('workflow/nodes-system')

    # crm/contact
    CONTACT_LIST = StringUrl('saledata/contacts')
    CONTACT_DETAIL = StringUrl('saledata/contact')
    CONTACT_LIST_NOT_MAP_ACCOUNT = StringUrl('saledata/listnotmapaccount')


    # masterdata/lookup/contact
    SALUTATION_LIST = StringUrl('saledata/salutations')
    INTERESTS_LIST = StringUrl('saledata/interests')
    SALUTATION_DETAIL = StringUrl('saledata/salutation/')
    INTEREST_DETAIL = StringUrl('saledata/interest/')

    # masterdata/lookup/account
    INDUSTRY_LIST = StringUrl('saledata/industries')
    ACCOUNT_TYPE_LIST = StringUrl('saledata/accounttypes')
    ACCOUNT_TYPE_DETAIL = StringUrl('saledata/accounttype/')
    INDUSTRY_DETAIL = StringUrl('saledata/industry/')

    # crm/account
    ACCOUNT_LIST = StringUrl('saledata/accounts')
    ACCOUNT_DETAIL = StringUrl('saledata/account')
    ACCOUNTNAME_LIST = StringUrl('saledata/employee_map_account_list')

