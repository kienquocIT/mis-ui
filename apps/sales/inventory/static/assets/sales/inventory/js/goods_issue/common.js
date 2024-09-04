const script_url = $('#script-url')
const script_trans = $('#script-trans')
const IAEle = $('#box-select-ia')
const IAItemTable = $('#dtbProductIA')
const SNTable = $('#select-detail-table-sn')
const LOTTable = $('#select-detail-table-lot')

class GISLoadPage {
    static LoadDateCreated() {
        $("#date_issue").daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            // drops: 'up',
            autoApply: true,
        })
    }
    static LoadIA(data) {
        IAEle.initSelect2({
            data: data,
            ajax: {
                url: IAEle.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let result = [];
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    result.push(resp.data[keyResp][i])
                }
                return result;
            },
            keyResp: 'inventory_adjustment_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            if (IAEle.val()) {
                let dataParam = {}
                let ia_list_ajax = $.fn.callAjax2({
                    url: `${script_url.attr('data-url-ia').replace('/0', `/${IAEle.val()}`)}`,
                    data: dataParam,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('inventory_adjustment_detail')) {
                            return data?.['inventory_adjustment_detail'];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([ia_list_ajax]).then(
                    (results) => {
                        let decrease_list = []
                        for (let i = 0; i < results[0]?.['inventory_adjustment_item_mapped'].length; i++) {
                            let ia_item = results[0]?.['inventory_adjustment_item_mapped'][i]
                            if (ia_item?.['action_type'] === 1) {
                                decrease_list.push(ia_item)
                            }
                        }
                        if (decrease_list.length === 0) {
                            $.fn.notifyB({description: 'Can not get Decrease items in this IA.'}, 'warning')
                        }
                        else {
                            GISLoadTab.DrawTableIAItems(decrease_list)
                        }
                    })
            }
        })
    }
}

class GISLoadTab {
    static DrawTableIAItems(data_list=[]) {
        IAItemTable.DataTable().clear().destroy()
        IAItemTable.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            data: data_list,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-light w-30">${row?.['product_mapped']?.['code']}</span> ${row?.['product_mapped']?.['title']}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<textarea disabled readonly class="form-control small" rows="2" cols="8">${row?.['product_mapped']?.['description']}</textarea>`;
                    }
                },
                {
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `${row?.['uom_mapped']?.['title']}`;
                    }
                },
                {
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `${row?.['book_quantity'] - row?.['count']}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-primary">${row?.['warehouse_mapped']?.['code']}</span> ${row?.['warehouse_mapped']?.['title']}`;
                    }
                },
                {
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `<button data-type="${row?.['product_mapped']?.['general_traceability_method']}" data-prd-wh-id="${row?.['product_warehouse_mapped_id']}" data-bs-toggle="modal" data-bs-target="#select-detail-modal" type="button" class="btn btn-sm btn-outline-primary select-detail"><i class="bi bi-list-check"></i></button>`;
                    }
                },
            ],
        })
    }
    static DrawTableIAItemsSN(data_list=[]) {
        SNTable.DataTable().clear().destroy()
        SNTable.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            data: data_list,
            columns: [

            ],
        })
    }
}

class GISHandle {
    static LoadPage() {
        GISLoadPage.LoadDateCreated()
        GISLoadPage.LoadIA()
    }
}

$('input[name="issue-type"]').on('change', function () {
    if ($('#for-ia').prop('checked')) {
        $('#inventory-adjustment-select-space').prop('hidden', false)
        $('#production-order-select-space').prop('hidden', true)
    }
    else if ($('#for-production').prop('checked')) {
        $('#inventory-adjustment-select-space').prop('hidden', true)
        $('#production-order-select-space').prop('hidden', false)
    }
})

$(document).on("click", '.select-detail', function () {
    let dataParam = {'product_warehouse_id': $(this).attr('data-prd-wh-id')}
    if ($(this).attr('data-type') === '1') {
        let prd_wh_lot = $.fn.callAjax2({
            url: LOTTable.attr('data-lot-url'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_lot_list')) {
                    return data?.['warehouse_lot_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([prd_wh_lot]).then(
            (results) => {
                console.log(results[0])
            })
    }
    else if ($(this).attr('data-type') === '2') {
        let prd_wh_serial = $.fn.callAjax2({
            url: SNTable.attr('data-sn-url'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_serial_list')) {
                    return data?.['warehouse_serial_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([prd_wh_serial]).then(
            (results) => {
                console.log(results[0])
            })
    }
})
