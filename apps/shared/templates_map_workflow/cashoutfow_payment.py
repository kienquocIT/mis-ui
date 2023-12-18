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
    'expense_description': FieldMapCommon(
        name_mapping=['expense_description'],
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
    'document_number': FieldMapCommon(
        name_mapping=['document_number'],
    ).data,
}
