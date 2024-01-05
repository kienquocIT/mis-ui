from ._common import FieldMapCommon

QUOTATION_DATA_MAP = {
    'title': FieldMapCommon(
        name_mapping=['title'],
    ).data,
    'opportunity_id': FieldMapCommon(
        name_mapping=['opportunity_id'],
    ).data,
    'customer': FieldMapCommon(
        name_mapping=['customer'],
    ).data,
    'contact': FieldMapCommon(
        name_mapping=['contact'],
    ).data,
    'employee_inherit_id': FieldMapCommon(
        name_mapping=['employee_inherit_id'],
    ).data,
    'payment_term': FieldMapCommon(
        name_mapping=['payment_term'],
    ).data,
    'quotation_products_data': FieldMapCommon(
        name_mapping=['quotation_products_data'],
    ).data,
    'quotation_logistic_data': FieldMapCommon(
        name_mapping=['quotation_logistic_data', 'quotation_logistic_data_readonly'],
        readonly_not_disable=['quotation_logistic_data_readonly'],
    ).data,
    'quotation_costs_data': FieldMapCommon(
        name_mapping=['quotation_costs_data', 'quotation_costs_data_readonly'],
        readonly_not_disable=['quotation_costs_data_readonly'],
    ).data,
    'quotation_expenses_data': FieldMapCommon(
        name_mapping=['quotation_expenses_data'],
    ).data,
    'quotation_indicators_data': FieldMapCommon(
        name_mapping=['quotation_indicators_data'],
    ).data,
    'is_customer_confirm': FieldMapCommon(
        name_mapping=['is_customer_confirm'],
    ).data,
    'print_document': FieldMapCommon(
        id_mapping=['print_document'],
    ).data,
}
