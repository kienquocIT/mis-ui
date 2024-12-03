$(document).ready(function () {
    const frm$ = $('#form-create-delivery');
    const so$ = frm$.find('#inp-so');
    const tableSO$ = frm$.find('#table-list-saleorder');

    let processData = [];
    let processStageApp = [];

    const {
        process_id,
        process_title,
        process_stage_app_id,
        process_stage_app_title,
    } = $x.fn.getManyUrlParameters(['process_id', 'process_title', 'process_stage_app_id', 'process_stage_app_title']);

    if (process_id){
        processData.push({
            'id': process_id,
            'title': process_title,
            'selected': true,
        })
    }
    if (process_stage_app_id){
        processStageApp.push({
            'id': process_stage_app_id,
            'title': process_stage_app_title,
            'selected': true,
        })
    }

    const inpProcess$ = frm$.find(':input[name=process]');
    const inpStageApp$ = frm$.find(':input[name=process_stage_app]');

    function reinitProcessStageApp(data=[], process_id=null){
        inpStageApp$.destroySelect2();
        let dataParams = {"application_id": inpStageApp$.data('app-id')};
        if (process_id && $x.fn.checkUUID4(process_id)) dataParams['process_id'] = process_id;
        inpStageApp$.initSelect2({
            allowClear: true,
            dataParams: dataParams,
            data: data
        })
    }

    function reinitProcess(data=[], opp_id=null){
        inpProcess$.destroySelect2();
        let dataParams = {};
        if (opp_id && $x.fn.checkUUID4(opp_id)) dataParams['opp_id'] = opp_id;
        inpProcess$.initSelect2({
            allowClear: true,
            dataParams: dataParams,
            data: data
        }).on('change', function(){
            const selectedVal = $(this).val();
            reinitProcessStageApp([], selectedVal ? selectedVal : null);
        })
    }

    reinitProcess(processData);
    reinitProcessStageApp(processStageApp);

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