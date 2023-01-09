class ApiURL(object):
    login = 'auth/sign-in'
    logout = 'auth/logout'
    my_profile = 'auth/profile'
    refresh_token = 'auth/token-refresh'
    tenants = 'provisioning/tenants'
    user_list = 'account/users'
    user_detail = 'account/user'
    EMPLOYEE_LIST = 'hr/employees'
    GROUP_LEVEL_LIST = 'hr/levels'

    # organization/group
    GROUP_LIST = 'hr/groups'
    GROUP_DETAIL = 'hr/group'

    # home/company
    COMPANY_LIST = 'company/list'
    COMPANY_DETAIL = 'company/list'


    #organization/role
    ROLE_LIST = 'hr/roles'
    ROLE_DETAIL = 'hr/role'

    #tenant
    TENANT = 'tenant/userlist'
