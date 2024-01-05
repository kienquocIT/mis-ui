from ._common import FieldMapCommon

SALE_DATA_ACCOUNT_MAP = {
    'name': FieldMapCommon(
        name_mapping=['name'],
    ).data,
    'website': FieldMapCommon(
        name_mapping=['website'],
    ).data,
    'account_type': FieldMapCommon(
        name_mapping=['account_type'],
    ).data,
    'owner': FieldMapCommon(
        name_mapping=['account-owner'],
    ).data,
    'manager': FieldMapCommon(
        name_mapping=['account-manager'],
    ).data,
    'account_group': FieldMapCommon(
        name_mapping=['account_group'],
    ).data,
    'industry': FieldMapCommon(
        name_mapping=['industry'],
    ).data,
    'annual_revenue': FieldMapCommon(
        name_mapping=['annual_revenue'],
    ).data,
    'total_employees': FieldMapCommon(
        name_mapping=['total_employees'],
    ).data,
    'phone': FieldMapCommon(
        name_mapping=['phone'],
    ).data,
    'email': FieldMapCommon(
        name_mapping=['email'],
    ).data,
    'currency': FieldMapCommon(
        name_mapping=['currency'],
    ).data,
    'shipping_address': FieldMapCommon(
        id_mapping=[
            'detail-modal-shipping-address',
            'shipping-city',
            'shipping-district',
            'shipping-ward',
            'make-default-shipping-address',
            'shipping-address-btn',
        ],
    ).data,
    'billing_address': FieldMapCommon(
        id_mapping=[
            'select-box-account-name',
            'inp-email-address',
            'inp-tax-code-address',
            'select-box-address',
            'make-default-billing-address',
            'billing-address-btn',
        ],
    ).data,
    'tax_code': FieldMapCommon(
        name_mapping=['tax_code'],
    ).data,
    'payment_term_mapped': FieldMapCommon(
        name_mapping=['payment_term_mapped'],
    ).data,
    'credit_limit': FieldMapCommon(
        name_mapping=['credit_limit'],
    ).data,
    'price_list_mapped': FieldMapCommon(
        name_mapping=['price_list_mapped'],
    ).data,
    'account_type_selection': FieldMapCommon(
        id_mapping=['inp-individual', 'inp-organization'],
    ).data,
    'bank_accounts_information': FieldMapCommon(
        id_mapping=[
            'country-select-box-id',
            'bank-name-id',
            'bank-code-id',
            'bank-account-name-id',
            'bank-account-number-id',
            'bank-account-number-id',
            'bic-swift-code-id',
            'make-default-bank-account',
            'bank-account-information-btn',
        ],
    ).data,
    'credit_cards_information': FieldMapCommon(
        id_mapping=[
            'credit-card-type-select-box-id',
            'credit-card-number-id',
            'credit-card-exp-date',
            'credit-card-name-id',
            'make-default-credit-card',
            'credit-card-information-btn',
        ],
    ).data,
}
