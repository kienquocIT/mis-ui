$(document).ready(function () {
    function htmlMailList(data, className) {
        if (data) {
            const baseItemHTML = `<span class="no-transform badge ${className}"></span>`;
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    const html = data.map(
                        email => $(baseItemHTML).text(email)
                    )
                    return $(...html).prop('outerHTML');
                }
                return '';
            }
            return $(baseItemHTML).text(data).prop('outerHTML');
        }
        return '';
    }

    const tbl$ = $('#form-auth-logs');
    const selStatusCode$ = $(`<select class="form-select form-select-sm" id="form-log-status-code"></select>`);
    const selSystemCode$ = $(`<select class="form-select form-select-sm" id="form-log-system-code"></select>`);
    const selFormID$ = $(`<select class="form-select form-select-sm" id="form-log-by-form-id"></select>`);
    const dtbt = tbl$.DataTableDefault({
        useDataServer: true,
        scrollX: true,
        autoWidth: false,
        ajax: {
            url: tbl$.attr('data-url'),
            type: 'GET',
            data: function (d){
                let ctx = {};
                if (selFormID$ && selFormID$.length > 0){
                    let filterFormId = selFormID$.val();
                    if (filterFormId) ctx['doc_id'] = filterFormId;
                }
                if (selStatusCode$ && selStatusCode$.length > 0){
                    let statusCodeSelected = selStatusCode$.val();
                    if (statusCodeSelected) ctx['status_code'] = statusCodeSelected;
                }
                if (selSystemCode$ && selSystemCode$.length > 0){
                    let systemCodeSelected = selSystemCode$.val();
                    if (systemCodeSelected) ctx['system_code'] = selSystemCode$.val();
                }
                return $.extend({}, d, ctx);
            },
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('mail_log')) {
                    return resp.data['mail_log'] ? resp.data['mail_log'] : [];
                }
                throw Error('Call data raise errors.')
            },
        },
        initComplete: function (settings, json) {
            let wrapper$ = tbl$.closest('.dataTables_wrapper');
            let textFilter$ = wrapper$.find('.textFilter');
            if (textFilter$.length > 0) {
                textFilter$.css('display', 'flex');

                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append(selStatusCode$)
                ).append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append(selSystemCode$)
                ).append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append(selFormID$)
                );

                const statusCodeInit = $x.fn.getUrlParameter('status', '')
                selStatusCode$.initSelect2({
                    placeholder: $.fn.gettext('Status'),
                    allowClear: true,
                    keyId: 'id',
                    keyText: 'title',
                    data: [
                        {'id': '', 'title': '', "selected": statusCodeInit === ''},
                        {'id': '0', 'title': $.fn.gettext('In progress'), 'selected': statusCodeInit === '0'},
                        {'id': '1', 'title': $.fn.gettext('Sent'), 'selected': statusCodeInit === '1'},
                        {'id': '2', 'title': $.fn.gettext('Error'), 'selected': statusCodeInit === '2'},
                    ],
                }).on('change', function (){
                    dtbt.ajax.reload();
                });

                selFormID$.initSelect2({
                    placeholder: $.fn.gettext('Form'),
                    ajax: {
                        url: tbl$.attr('data-url-form-list'),
                        method: 'GET',
                    },
                    allowClear: true,
                    keyResp: 'form_list',
                    keyId: 'id',
                    keyText: 'title',
                }).on('change', function (){
                    dtbt.ajax.reload();
                });

                const systemCodeInit = $x.fn.getUrlParameter('type', '')
                selSystemCode$.initSelect2({
                    placeholder: $.fn.gettext('System code'),
                    allowClear: true,
                    keyId: 'id',
                    keyText: 'title',
                    data: [
                        {'id': '', 'title': '', "selected": statusCodeInit === ''},
                        {'id': '0', 'title': $.fn.gettext('Another'), 'selected': systemCodeInit === '0'},
                        {'id': '1', 'title': $.fn.gettext('Welcome'), 'selected': systemCodeInit === '1'},
                        {'id': '2', 'title': $.fn.gettext('Calendar'), 'selected': systemCodeInit === '2'},
                        {'id': '3', 'title': $.fn.gettext('OTP validation'), 'selected': systemCodeInit === '3'},
                        {'id': '4', 'title': $.fn.gettext('Form: Record'), 'selected': systemCodeInit === '4'},
                        {'id': '5', 'title': $.fn.gettext('Form: OTP validation'), 'selected': systemCodeInit === '5'},
                    ]
                }).on('change', function (){
                    $(this).val() === '4' || $(this).val() === '5' ? selFormID$.toggleSelect2(1) : selFormID$.toggleSelect2(0);
                    dtbt.ajax.reload();
                });
                systemCodeInit === '4' || systemCodeInit === '5' ? selFormID$.toggleSelect2(1) : selFormID$.toggleSelect2(0);
            }
        },
        rowIdx: true,
        columns: [
            {
                className: 'min-w-50p',
                render: () => '',
            },
            {
                data: 'system_code',
                className: 'min-w-100p',
                render: (data) => {
                    switch (data) {
                        case 4:
                        case '4':
                            return `<span class="badge badge-soft-secondary">Form Record</span>`
                        case 5:
                        case '5':
                            return `<span class="badge badge-soft-brown">Form OTP Validation</span>`
                        default:
                            return '-'
                    }
                }
            },
            {
                data: 'date_created',
                className: 'min-w-150p',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data);
                }
            },
            {
                data: 'subject',
                className: 'min-w-150p',
                render: data => data,
            },
            {
                visible: false,
                data: 'address_sender',
                className: 'min-w-100p',
                render: (data, type, row) => {
                    return data ? data : '-';
                }
            },
            {
                data: 'address_to',
                className: 'min-w-200p',
                render: (data, type, row) => {
                    return htmlMailList(data, 'badge-primary');
                }
            },
            {
                data: 'address_cc',
                className: 'min-w-200p',
                render: (data, type, row) => {
                    return htmlMailList(data, 'badge-warning');
                }
            },
            {
                data: 'address_bcc',
                visible: false,
                className: 'min-w-200p',
                render: (data, type, row) => {
                    return htmlMailList(data, 'badge-danger');
                }
            },
            {
                data: 'status_code',
                className: 'min-w-100p',
                render: data => {
                    switch (data) {
                        case 0:
                        case '2':
                            return `<span 
                                class="badge badge-light badge-indicator badge-indicator-xl"
                                data-bs-toggle="tooltip"
                                title="${$.fn.gettext('In progress')}"
                            ></span>`;
                        case 1:
                        case '1':
                            return `<span 
                                class="badge badge-success badge-indicator badge-indicator-xl"
                                data-bs-toggle="tooltip"
                                title="${$.fn.gettext('Sent')}"
                            ></span>`;
                        case 2:
                        case '2':
                            return `<span 
                                class="badge badge-danger badge-indicator badge-indicator-xl"
                                data-bs-toggle="tooltip"
                                title="${$.fn.gettext('Error')}"
                            ></span>`;
                        default:
                            return '-';
                    }
                },
            },
            {
                data: 'status_remark',
                className: 'min-w-200p',
                visible: false,
                render: data => data,
            },
        ]
    })
})