from ._common import FieldMapCommon

ADVANCE_DATA_MAP = {
    'title': FieldMapCommon(
        name_mapping=['title'],
    ).data,
    'advance_payment_type': FieldMapCommon(
        name_mapping=['advance_payment_type'],
    ).data,
    'supplier': FieldMapCommon(
        name_mapping=['supplier'],
    ).data,
    'method': FieldMapCommon(
        name_mapping=['method'],
    ).data,
    'return_date': FieldMapCommon(
        name_mapping=['return_date'],
    ).data,
    'money_gave': FieldMapCommon(
        name_mapping=['money_gave'],
    ).data,
    'expense_valid_list': FieldMapCommon(
        name_mapping=['expense_valid_list'],
    ).data,
}
