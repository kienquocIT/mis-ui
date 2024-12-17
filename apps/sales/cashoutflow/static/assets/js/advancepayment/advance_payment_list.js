function InitAdvancePaymentTable(data_param={}) {
    let dtb = $('#datatable_advance_list')
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        reloadCurrency: true,
        scrollX: '100vw',
        scrollY: '75vh',
        scrollCollapse: true,
        ajax: {
            data: data_param,
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (Object.keys(data_param).length > 0) {
                        let result = []
                        for (let i = 0; i < resp.data['advance_payment_list'].length; i++) {
                            if (parseFloat(resp.data['advance_payment_list'][i]?.['remain_value']) > 0) {
                                result.push(resp.data['advance_payment_list'][i])
                            }
                        }
                        return result
                    }
                    return resp.data['advance_payment_list'] ? resp.data['advance_payment_list'] : [];
                }
                return [];
            },
        },
        columns: [
            {
                className: 'wrap-text w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                data: 'code',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                    return `<a href="${link}"><span class="badge badge-primary">${row?.['code']}</span></a>`;
                }
            },
            {
                data: 'title',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    let return_btn = ''
                    if (row?.['system_status'] === 3 && !row?.['opportunity']?.['is_closed'] && parseFloat(row?.['remain_value'] ? row?.['remain_value'] : 0) !== 0) {
                        let advance_payment_obj= encodeURIComponent(
                            JSON.stringify({
                                'id': row?.['id'],
                                'code': row?.['code'],
                                'title': row?.['title'],
                                'sale_code': row?.['sale_code'] ? row?.['sale_code'] : ''
                            })
                        )

                        return_btn = `<a class="return-btn hidden" target="_blank" href="${dtb.attr('data-return')}?advance_payment=${advance_payment_obj}">
                                       <button class="btn btn-soft-primary btn-rounded btn-xs" 
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="bottom" 
                                            title="${dtb.attr('data-type-translate-return')}"
                                        ><i class="fas fa-hand-holding-usd fa-flip-horizontal"></i></button>
                                    </a>`;
                    }
                    const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                    return `<a class="text-primary fw-bold" href="${link}">${row?.['title']}</a>${return_btn}`
                }
            },
            {
                data: 'advance_payment_type',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    let to_employee_trans = dtb.attr('data-type-translate-employee')
                    let to_supplier_trans = dtb.attr('data-type-translate-supplier')
                    if (row?.['advance_payment_type'] === 0) {
                        return `<span class="small text-muted">${to_employee_trans}</span>`
                    } else if (row?.['advance_payment_type'] === 1) {
                        return `<span class="small text-muted">${to_supplier_trans}</span>`
                    }
                }
            },
            {
                data: 'sale_code',
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    if (row?.['opportunity']?.['id']) {
                        return `${row?.['sale_code'] ? row?.['sale_code'] : ''}`
                    }
                    else if (row?.['quotation_mapped']?.['id']) {
                        return `${row?.['sale_code'] ? row?.['sale_code'] : ''}`
                    }
                    else if (row?.['sale_order_mapped']?.['id']) {
                        return `${row?.['sale_code'] ? row?.['sale_code'] : ''}`
                    }
                    return ''
                }
            },
            {
                data: 'employee_inherit',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<span class="text-blue">${row?.['employee_inherit']?.['full_name']}</span>`
                }
            },
            {
                data: 'date_created',
                className: 'wrap-text w-10',
                render: (data) => {
                    return $x.fn.displayRelativeTime(data, {'outputFormat': 'DD/MM/YYYY',});
                }
            },
            {
                data: 'advance_value',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `
                        <span class="mask-money text-primary" data-init-money="${row?.['advance_value']}"></span>
                        <br>
                        <span class="small text-decoration-underline">${dtb.attr('data-type-translate-to-payment')}:</span> <span class="mask-money small" data-init-money="${row?.['to_payment']}"></span>
                    `
                }
            },
            {
                targets: 7,
                data: 'return_date',
                className: 'wrap-text w-10',
                render: (data) => {
                    return $x.fn.displayRelativeTime(data, {'outputFormat': 'DD/MM/YYYY'});
                }
            },
            {
                data: 'return_value',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `
                        <span class="mask-money text-primary" data-init-money="${row?.['return_value']}"></span>
                        <br>
                        <span class="small text-decoration-underline">${dtb.attr('data-type-translate-remain-ap')}:</span> <span class="mask-money small" data-init-money="${row?.['remain_value']}"></span>
                    `
                }
            },
            {
                data: 'ap_status',
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    if (row?.['money_gave']) {
                        return `<span class="text-muted small">${dtb.attr('data-type-translate-gave')}</span>`
                    }
                    else {
                        return `<span class="text-muted small">${dtb.attr('data-type-translate-waiting')}</span>`
                    }
                }
            },
            {
                data: 'status',
                className: 'wrap-text text-center status-col bg-white w-5',
                render: (data, type, row) => {
                    let approved_trans = ``
                    let text_color = ``
                    if (row?.['system_status'] === 0) {
                        approved_trans = 'Draft'
                        text_color = 'badge-soft-secondary'
                    }
                    else if (row?.['system_status'] === 1) {
                        approved_trans = 'Created'
                        text_color = 'badge-soft-primary'
                    }
                    else if (row?.['system_status'] === 2) {
                        approved_trans = 'Added'
                        text_color = 'badge-soft-blue'
                    }
                    else if (row?.['system_status'] === 3) {
                        approved_trans = 'Finish'
                        text_color = 'badge-soft-success'
                    }
                    else if (row?.['system_status'] === 4) {
                        approved_trans = 'Cancel'
                        text_color = 'badge-soft-danger'
                    }
                    return `<span class="w-100 badge ${text_color}">` + approved_trans + `</span>`
                }
            },
        ],
    });
}

$(document).ready(function () {
    function loadAdvancePaymentList() {
        if (!$.fn.DataTable.isDataTable('#datatable_advance_list')) {
            InitAdvancePaymentTable()
        }
    }

    loadAdvancePaymentList();
})

$(document).on("click", '#expiring-sort', function() {
    let dtb = $('#datatable_advance_list')
    dtb.DataTable().clear().destroy()
    InitAdvancePaymentTable({'return_date_expiring_sort': 1})
});

$(document).on("mouseenter", 'tbody tr', function() {
    $(this).find('.return-btn').removeClass('hidden')
});

$(document).on("mouseleave", 'tbody tr', function() {
    $(this).find('.return-btn').addClass('hidden')
});
