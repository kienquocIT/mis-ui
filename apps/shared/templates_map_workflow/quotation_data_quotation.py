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
    'quotation_logistic_data': FieldMapCommon(
        id_mapping=[
            'quotation-create-shipping-address',
            'quotation-create-billing-address',
        ],
    ).data,
}
