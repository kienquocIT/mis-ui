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
    COMPANY_LIST = 'company/list'


    #organization/role
    ROLE_LIST = 'hr/roles'
    ROLE_DETAIL = 'hr/role'
