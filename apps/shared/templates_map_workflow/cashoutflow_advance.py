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
    'expense_name': FieldMapCommon(
        name_mapping=['expense_name'],
    ).data,
    'expense_type': FieldMapCommon(
        name_mapping=['expense_type'],
    ).data,
    'expense_uom': FieldMapCommon(
        name_mapping=['expense_uom'],
    ).data,
    'expense_quantity': FieldMapCommon(
        name_mapping=['expense_quantity'],
    ).data,
    'expense_unit_price': FieldMapCommon(
        name_mapping=['expense_unit_price'],
    ).data,
    'expense_tax': FieldMapCommon(
        name_mapping=['expense_tax'],
    ).data,
    'money_gave': FieldMapCommon(
        name_mapping=['money_gave'],
    ).data,
}
