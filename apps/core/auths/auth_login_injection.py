import os

__all__ = [
    'inject_override_tenant_code',
]


def inject_override_tenant_code(data: dict):
    tenant_code = os.getenv("FIXED_TENANT_CODE", None)
    if tenant_code:
        data['tenant_code'] = tenant_code
    return {
        **data,
    }
