from apps.core.account.models import User, Company, Tenant


def clean_user_company_tenant():
    # python manage.py shell --command "from apps.shared.scripts import *; clean_user_company_tenant();"
    user_objs = User.objects.all()
    if user_objs.count() > 0:
        user_objs.delete()

    company_objs = Company.objects.all()
    if company_objs.count() > 0:
        company_objs.delete()

    tenant_objs = Tenant.objects.all()
    if tenant_objs.count() > 0:
        tenant_objs.delete()
