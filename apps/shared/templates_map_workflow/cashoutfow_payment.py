from ._common import FieldMapCommon

PAYMENT_DATA_MAP = {
    'title': FieldMapCommon(
        name_mapping=['title'],
    ).data,
    'supplier': FieldMapCommon(
        name_mapping=['supplier'],
    ).data,
    'is_internal_payment': FieldMapCommon(
        name_mapping=['is_internal_payment'],
    ).data,
    'employee_payment': FieldMapCommon(
        name_mapping=['employee_payment'],
    ).data,
    'method': FieldMapCommon(
        name_mapping=['method'],
    ).data,
    'payment_expense_valid_list': FieldMapCommon(
        name_mapping=['payment_expense_valid_list'],
    ).data,
}
