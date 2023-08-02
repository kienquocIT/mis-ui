from ._common import FieldMapCommon

DELIVERY_DATA_MAP = {
    'estimated_delivery_date': FieldMapCommon(
        name_mapping=['estimated_delivery_date'],
    ).data,
    'actual_delivery_date': FieldMapCommon(
        name_mapping=['actual_delivery_date'],
    ).data,
    'remarks': FieldMapCommon(
        name_mapping=['remarks'],
    ).data,
}
