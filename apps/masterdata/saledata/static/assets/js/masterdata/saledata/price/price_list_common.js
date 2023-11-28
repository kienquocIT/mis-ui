let script_url = $('#script-url')
let title_ele = $('#title')
let checkbox_copy_source_ele = $('#checkbox-copy-source')
let price_list_mapped_ele = $('#price_list_mapped')
let checkbox_update_auto_ele = $('#checkbox-update-auto')
let checkbox_can_delete_ele = $('#checkbox-can-delete')
let select_box_currency_ele = $('#select-box-currency')
let input_factor_ele = $('#input-factor')
let select_box_type_ele = $('#select-box-type')
let valid_time_ele = $('#valid_time')
let btn_add_new_item = $('#btn-add-new-item')
let tbl = $('#datatable-item-list');

btn_add_new_item.om('click', function () {
    tbl.find('tbody').append(`
        <tr class="even">
            <td class="wrap-text"></td>
            <td class="wrap-text"><span class="badge badge-soft-primary w-100 code_span"></span></td>
            <td class="wrap-text"></td>
            <td class="wrap-text"></td>
            <td class="wrap-text"></td>
        </tr>
    `)
})

function loadDtbPriceList() {
    if (!$.fn.DataTable.isDataTable('#datatable-price-list')) {
        let $table = $('#datatable-price-list')
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            rowIdx: true,
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('price_list')) {
                        return resp.data['price_list'] ? resp.data['price_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    render: () => {
                        return ``;
                    }
                }, {
                    data: 'title',
                    render: (data, type, row) => {
                        return `<a class="btn-detail" href="${script_url.attr('data-url-price-list-detail').format_url_with_uuid(row.id)}">
                                    <span><b>${data}</b></span>
                                </a>${$x.fn.buttonLinkBlank(script_url.attr('data-url-price-list-detail').format_url_with_uuid(row.id))}`
                    }
                }, {
                    data: 'price_list_type',
                    className: 'text-center',
                    render: (data) => {
                        if (data.value === 0) {
                            return `<span style="width: 20%; min-width: max-content" class="badge badge-soft-danger badge-pill">${data.name}</span>`
                        } else if (data.value === 1) {
                            return `<span style="width: 20%; min-width: max-content" class="badge badge-soft-indigo badge-pill">${data.name}</span>`
                        } else if (data.value === 2) {
                            return `<span style="width: 20%; min-width: max-content" class="badge badge-soft-green badge-pill">${data.name}</span>`
                        } else {
                            return ''
                        }
                    }
                }, {
                    data: 'status',
                    render: (data) => {
                        let badge_type;
                        if (data === 'Valid') {
                            badge_type = 'text-success'
                        } else if (data === 'Invalid') {
                            badge_type = 'text-orange'
                        } else if (data === 'Expired') {
                            badge_type = 'text-danger'
                        } else {
                            badge_type = 'text-gray'
                        }

                        return `<span class="${badge_type}">${data}</span>`;
                    }
                }, {
                    className: 'action-center',
                    render: (data, type, row) => {
                        if (row.is_default === false) {
                            return `<a data-method="DELETE" data-id="${row.id}" class="btn btn-icon btn-del btn btn-icon btn-flush-danger flush-soft-hover btn-rounded del-button delete-price-list-btn">
                                <span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span>
                                </a>`;
                        } else {
                            return ``
                        }
                    }
                }
            ],
        });
    }
}

loadDtbPriceList();

valid_time_ele.daterangepicker({
    timePicker: true,
    startDate: moment().startOf('millisecond'),
    endDate: moment().startOf('millisecond'),
    "cancelClass": "btn-secondary",
    locale: {
        format: 'YYYY-MM-DD HH:mm'
    },
    drops: 'up'
});
valid_time_ele.val('')

checkbox_copy_source_ele.on('change', function () {
    if ($(this).prop("checked")) {
        checkbox_update_auto_ele.prop('disabled', false);
        select_box_currency_ele.prop('disabled', true);
        input_factor_ele.prop('readonly', false);
    } else {
        checkbox_update_auto_ele.prop('disabled', true);
        select_box_currency_ele.prop('disabled', false);
        input_factor_ele.prop('readonly', true).val(1);
    }
})

checkbox_update_auto_ele.on('change', function () {
    if ($(this).prop("checked")) {
        checkbox_can_delete_ele.prop('disabled', false);
    } else {
        checkbox_can_delete_ele.prop('checked', false);
        checkbox_can_delete_ele.prop('disabled', true);
    }
})

function loadPriceList(ele, data) {
    ele.initSelect2({
        ajax: {
            url: script_url.attr('data-url-price-list'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'price_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let obj_selected = SelectDDControl.get_data_from_idx(ele, ele.val());
        let currency_mapped = $.fn.callAjax2({
            url: script_url.attr('data-url-currency-list'),
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                let result = []
                if (data && typeof data === 'object' && data.hasOwnProperty('currency_list')) {
                    for (let i = 0; i < data?.['currency_list'].length; i++) {
                        if (obj_selected?.['currency'].includes(data?.['currency_list'][i]?.['id'])) {
                            result.push(data?.['currency_list'][i])
                        }
                    }
                }
                return result;
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([currency_mapped]).then(
            (results) => {
                loadCurrencyList(select_box_currency_ele, results[0])
            })
    })
}

function loadCurrencyList(ele, data) {
    ele.initSelect2({
        ajax: {
            url: script_url.attr('data-url-currency-list'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'currency_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function getDataForm() {
    let data = {
        'title': title_ele.val(),
        'price_list_type': select_box_type_ele.val(),
        'valid_time_start': valid_time_ele.val().split(' - ')[0],
        'valid_time_end': valid_time_ele.val().split(' - ')[1]
    }
    if (checkbox_copy_source_ele.prop('checked', true)) {
        data['auto_update'] = checkbox_update_auto_ele.prop('checked')
        data['can_delete'] = checkbox_can_delete_ele.prop('checked')
        data['factor'] = input_factor_ele.val()
        data['price_list_mapped'] = price_list_mapped_ele.val()
    }
    data['currency'] = select_box_currency_ele.val()

    // valid data UI
    let fields = ['title', 'price_list_type', 'valid_time_start', 'valid_time_end', 'factor']
    let fields_sub = ['Title', 'Price list type', 'Time start', 'Time end', 'Factor']
    for (let i = 0; i < fields.length; i++) {
        if (!data[fields[i]]) {
            $.fn.notifyB({description: `${fields_sub[i]} must not missing`}, 'failure');
            return false
        }
    }
    return data
}

class PriceListHandle {
    load() {
        loadPriceList(price_list_mapped_ele)
        loadCurrencyList(select_box_currency_ele)
    }

    combinesData(frmEle) {
        let dataForm = getDataForm();
        if (dataForm) {
            let frm = new SetupFormSubmit($(frmEle));

            return {
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: dataForm,
                urlRedirect: frm?.['urlRedirect'],
            };
        }
        return false;
    }
}

function LoadDetailPriceList(option) {
    let pk = $.fn.getPkDetail()
    $.fn.callAjax($('#form-update-item-price').attr('data-url-detail').format_url_with_uuid(pk), 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['price']?.['workflow_runtime_id']);
                let price_list_detail = data['price'];
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(price_list_detail);
                console.log(price_list_detail)

                $('#price_list_name').text(price_list_detail['title']);
                let timeValidEle = $('#time-valid');

                if (price_list_detail?.['valid_time_start'] && price_list_detail?.['valid_time_start']) {
                    let text_class = ''
                    if (price_list_detail?.['status'] === 'Valid') {text_class = 'text-success'}
                    if (price_list_detail?.['status'] === 'Invalid') {text_class = 'text-warning'}
                    if (price_list_detail?.['status'] === 'Expired') {text_class = 'text-danger'}

                    if (price_list_detail.is_default) {
                        timeValidEle.html(`<span class="${text_class}">${price_list_detail.valid_time_start} - Now</span>`)
                    } else {
                        timeValidEle.html(`<span class="${text_class}">${price_list_detail.valid_time_start} - ${price_list_detail.valid_time_end}</span>`)
                    }
                }

                tbl.DataTableDefault({
                    paging: false,
                    reloadCurrency: true,
                    rowIdx: true,
                    data: price_list_detail?.['products_mapped'],
                    columns: [
                        {
                            'render': () => {
                                return ``;
                            }
                        },
                        {
                            'data': 'code',
                            render: (data, type, row) => {
                                return `<span class="badge badge-soft-primary w-100 code_span">${row?.['code']}</span>`
                            }
                        },
                        {
                            'data': 'title',
                            render: (data, type, row) => {
                                return `<span><b>${row.title}</b></span>`
                            }
                        },
                        {
                            'data': 'uom_group',
                            render: (data, type, row) => {
                                return `<span>${row.uom_group.title}</span>`
                            }
                        },
                        {
                            'data': 'uom',
                            render: (data, type, row) => {
                                return `<span>${row.uom.title}</span>`
                            }
                        }],
                })

                $.fn.initMaskMoney2();
            }
        })
}
