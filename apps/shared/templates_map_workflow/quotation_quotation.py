from ._common import FieldMapCommon

QUOTATION_DATA_MAP = {
    'title': FieldMapCommon(
        name_mapping=['title'],
    ).data,
    'opportunity': FieldMapCommon(
        name_mapping=['opportunity'],
    ).data,
    'customer': FieldMapCommon(
        name_mapping=['customer'],
    ).data,
    'contact': FieldMapCommon(
        name_mapping=['contact'],
    ).data,
    'sale_person': FieldMapCommon(
        name_mapping=['sale_person'],
    ).data,
    'payment_term': FieldMapCommon(
        name_mapping=['payment_term'],
    ).data,
    'quotation_products_data': FieldMapCommon(
        name_mapping=['quotation_products_data'],
    ).data,
    'quotation_logistic_data': FieldMapCommon(
        name_mapping=['quotation_logistic_data'],
    ).data,
    'quotation_costs_data': FieldMapCommon(
        name_mapping=['quotation_costs_data'],
    ).data,
    'quotation_expenses_data': FieldMapCommon(
        name_mapping=['quotation_expenses_data'],
    ).data,
    'is_customer_confirm': FieldMapCommon(
        name_mapping=['is_customer_confirm'],
    ).data,
    'print_document': FieldMapCommon(
        name_mapping=['print_document'],
    ).data,
}
