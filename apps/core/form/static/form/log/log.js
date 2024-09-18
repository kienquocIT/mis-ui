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
    const sel$ = $(`<select class="min-w-100p form-select form-select-sm" style="min-width: 100px;" id="form-log-by-form-id"></select>`);
    tbl$.DataTableDefault({
        useDataServer: true,
        scrollX: true,
        autoWidth: false,
        ajax: {
            url: tbl$.attr('data-url'),
            type: 'GET',
            data: function (d){
                let filterFormId = $('#form-log-by-form-id').val();
                if (filterFormId) d.doc_id = filterFormId;
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

                const formGroup$ = $(`<div class=""></div>`);
                formGroup$.append(sel$);
                textFilter$.append(formGroup$);
                sel$.initSelect2({
                    ajax: {
                        url: tbl$.attr('data-url-form-list'),
                        method: 'GET',
                    },
                    allowClear: true,
                    keyResp: 'form_list',
                    keyId: 'id',
                    keyText: 'title',
                }).on('change', function (){
                    tbl$.DataTable().ajax.reload();
                })
            }
        },
        rowIdx: true,
        columns: [
            {
                render: () => '',
            },
            {
                data: 'system_code',
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
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data);
                }
            },
            {
                visible: false,
                data: 'address_sender',
                render: (data, type, row) => {
                    return data ? data : '-';
                }
            },
            {
                data: 'address_to',
                render: (data, type, row) => {
                    return htmlMailList(data, 'badge-primary');
                }
            },
            {
                data: 'address_cc',
                render: (data, type, row) => {
                    return htmlMailList(data, 'badge-warning');
                }
            },
            {
                visible: false,
                data: 'address_bcc',
                render: (data, type, row) => {
                    return htmlMailList(data, 'badge-danger');
                }
            },
            {
                data: 'subject',
                render: data => data,
            },
            {
                data: 'status_code',
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
                visible: false,
                render: data => data,
            },
        ]
    })
})