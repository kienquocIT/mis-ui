from ._common import FieldMapCommon

SERVICE_QUOTATION_DATA_MAP = {
    'opportunity': FieldMapCommon(
        name_mapping=['opportunity'],
    ).data,
    'employee_inherit_id': FieldMapCommon(
        name_mapping=['employee_inherit_id'],
    ).data,
    'title': FieldMapCommon(
        name_mapping=['title'],
    ).data,
    'customer' : FieldMapCommon(
        name_mapping=['customer'],
    ).data,
    'service_detail' : FieldMapCommon(
        name_mapping=['service_detail'],
    ).data,
    'work' : FieldMapCommon(
        name_mapping=['work'],
    ).data,
    'expense' : FieldMapCommon(
        name_mapping=['expense'],
    ).data,
    'payment' : FieldMapCommon(
        name_mapping=['payment'],
    ).data,
    'attachment' : FieldMapCommon(
        name_mapping=['attachment'],
    ).data,
    'task' : FieldMapCommon(
        name_mapping=['task'],
    ).data,
}
