function InitAdvancePaymentTable(data_param={}) {
    let dtb = $('#datatable_advance_list')
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        reloadCurrency: true,
        scrollX: true,
        scrollY: '70vh',
        scrollCollapse: true,
        fixedColumns: {
            leftColumns: 2,
            rightColumns: window.innerWidth <= 768 ? 0 : 1
        },
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
                className: 'w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'ellipsis-cell-xs w-10',
                render: (data, type, row) => {
                    const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                    return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                }
            },
            {
                className: 'ellipsis-cell-lg w-15',
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
                    return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>${return_btn}`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    let to_employee_trans = dtb.attr('data-type-translate-employee')
                    let to_supplier_trans = dtb.attr('data-type-translate-supplier')
                    if (row?.['advance_payment_type'] === 0) {
                        return `<span>${to_employee_trans}</span>`
                    } else if (row?.['advance_payment_type'] === 1) {
                        return `<span>${to_supplier_trans}</span>`
                    }
                    return '--'
                }
            },
            {
                className: 'ellipsis-cell-xs w-5',
                render: (data, type, row) => {
                    return `<span title="${row?.['sale_code'] || '--'}">${row?.['sale_code'] || '--'}</span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `
                        <span class="mask-money text-primary" data-init-money="${row?.['advance_value']}"></span><br>
                        <span class="text-decoration-underline">${dtb.attr('data-type-translate-to-payment')}:</span> <span class="mask-money" data-init-money="${row?.['to_payment']}"></span>
                    `
                }
            },
            {
                targets: 7,
                className: 'w-10',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['return_date'], {'outputFormat': 'DD/MM/YYYY'});
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `
                        <span class="mask-money text-primary" data-init-money="${row?.['return_value']}"></span><br>
                        <span class="text-decoration-underline">${dtb.attr('data-type-translate-remain-ap')}:</span> <span class="mask-money" data-init-money="${row?.['remain_value']}"></span>
                    `
                }
            },
            {
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    return WFRTControl.displayEmployeeWithGroup(row?.['employee_inherit']);
                }
            },
            {
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                }
            },
            {
                className: 'text-center status-col bg-white w-5',
                render: (data, type, row) => {
                    return WFRTControl.displayRuntimeStatus(row?.['system_status']);
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
