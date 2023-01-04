class ApiURL(object):
    login = 'auth/sign-in'
    logout = 'auth/logout'
    my_profile = 'auth/profile'
    refresh_token = 'auth/token-refresh'
    tenants = 'provisioning/tenants'
    user_list = 'account/users'
    EMPLOYEE_LIST = 'hr/employees'
    GROUP_LEVEL_LIST = 'organization/levels'

    # organization/group
    GROUP_LIST = 'organization/groups'
    GROUP_DETAIL = 'organization/group'

    # home/company
    COMPANY_LIST = 'tenant/company'

    #organization/role
    ROLE_LIST = 'organization/roles'
    ROLE_DETAIL = 'organization/role'
