$(document).ready(function () {
    const frm$ = $('#form-create-delivery');
    const process$ = frm$.find('#inp-process');
    const so$ = frm$.find('#inp-so');
    const tableSO$ = frm$.find('#table-list-saleorder');

    const {
        process_id,
        process_title,
    } = $x.fn.getManyUrlParameters(['process_id', 'process_title']);

    process$.initSelect2({
        data: process_id && $x.fn.checkUUID4(process_id) ? [
            {
                'id': process_id,
                'title': process_title,
                'selected': true,
            }
        ] : [],
    });

    const dtb = tableSO$.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: tableSO$.data('url'),
            method: 'GET',
            dataSrc: function (resp) {
                const data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('sale_order_list')) {
                    return data['sale_order_list'] || [];
                }
                return [];
            }
        },
        data: [
            {
                'id': '1',
                'title': 'xxx',
                'code': 'Code',
            },
            {
                'id': '2',
                'title': 'yyy',
                'code': 'Code 2',
            },
            {
                'id': '2',
                'title': 'yyy',
                'code': 'Code 3',
            },
            {
                'id': '2',
                'title': 'yyy',
                'code': 'Code 4',
            },
            {
                'id': '2',
                'title': 'yyy',
                'code': 'Code 5',
            },
            {
                'id': '2',
                'title': 'yyy',
                'code': 'Code 6',
            },
            {
                'id': '2',
                'title': 'yyy',
                'code': 'Code 7',
            },
            {
                'id': '2',
                'title': 'yyy',
                'code': 'Code 8',
            },
            {
                'id': '2',
                'title': 'yyy',
                'code': 'Code 9',
            },
        ],
        autWidth: false,
        rowIdx: true,
        pageLength: 5,
        columns: [
            {
                width: '10%',
                render: () => ''
            },
            {
                data: 'title',
                width: '40%',
                orderable: true,
                render: (data) => data ? `<span class="text-primary">${data}</span>` : '-',
            },
            {
                data: 'code',
                width: '30%',
                orderable: true,
                render: (data) => data ? `<span class="text-dark">${data}</span>` : '-',
            },
            {
                data: 'date_created',
                width: '20%',
                orderable: true,
                render: (data) => $x.fn.displayRelativeTime(data),
            }
        ],
        rowCallback: function (row, data) {
            if (data.id === so$.val()) {
                $(row).addClass('selected');
            } else {
                $(row).removeClass('selected');
            }

            $(row).off('click').on('click', function () {
                so$.empty();
                so$.append(`<option value="${data.id}" selected>${data.title} - ${data.code}</option>`);

                if (data.id === so$.val()) {
                    $(row).addClass('selected');
                } else {
                    $(row).removeClass('selected');
                }

                tableSO$.DataTable().rows().every(function () {
                    let currentRow = this.node();
                    if (currentRow !== row) {
                        $(currentRow).removeClass('selected');
                    }
                });
            });
        },
        initComplete: function (settings, json) {
            let wrapper$ = tableSO$.closest('.dataTables_wrapper');
            const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            headerToolbar$.prepend($(`
                        <span class="text-primary">${$.fn.gettext("Click on the row in the table to select the Sale Order.")}</span>
                    `));
        },
    })
    SetupFormSubmit.validate(
        frm$,
        {
            submitHandler: function (form, event) {
                event.preventDefault();
                const bodyData = $(form).serializeObject();
                $.fn.callAjax2({
                    url: frm$.data('url').replaceAll('__pk__', bodyData['saleorder']),
                    method: 'POST',
                    data: bodyData,
                    isLoading: true,
                    isNotify: true,
                    areaControl: frm$,
                }).then(
                    resp => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                            const urlRedirect = data?.['is_picking'] ? frm$.data('url-picking') : frm$.data('url-redirect');
                            setTimeout(() => window.location.href = urlRedirect, 1000)
                        }
                    }
                )
            }
        }
    )
})