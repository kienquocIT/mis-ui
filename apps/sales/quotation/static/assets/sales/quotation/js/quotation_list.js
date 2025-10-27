$(function () {
    $(document).ready(function () {

        let $table = $('#table_quotation_list')
        let transEle = $('#app-trans-factory');
        let urlsEle = $('#app-url-factory');
        let $isDeleteEle = $('#is_delete');
        let $employeeEle = $('#employee_dd');
        let $customerEle = $('#customer_dd');
        let $operatorEle = $('#operator');
        let $totalEle = $('#total');
        let $fromEle = $('#date_from');
        let $toEle = $('#date_to');

        function loadDbl(dataParams) {
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    data: dataParams,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('quotation_list')) {
                            return resp.data['quotation_list'] ? resp.data['quotation_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                autoWidth: true,
                scrollX: true,
                pageLength: 10,
                columns: [  // (1280p)
                    {
                        targets: 0,
                        width: '1%',
                        render: (data, type, row, meta) => {
                            return `<span class="table-row-order">${(meta.row + 1)}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '5%',
                        orderable: true,
                        data: 'code',
                        render: (data, type, row) => {
                            let link = urlsEle.data('link-detail').format_url_with_uuid(row?.['id']);
                            if (row?.['code']) {
                                if (row?.['is_change'] === true && row?.['document_root_id'] !== row?.['id']) {
                                    return `<div class="row">
                                                <div class="d-flex justify-content-between align-items-center">
                                                <a href="${link}" class="link-primary underline_hover"><span class="badge-parent badge-parent-primary">${row?.['code']} <span class="badge-child badge-child-blue">CR</span></span></a>
                                                <button class="btn btn-icon btn-rounded popover-cr" 
                                                        data-bs-container="body" 
                                                        data-bs-toggle="popover" 
                                                        data-bs-placement="top"
                                                        data-bs-html="true"
                                                        data-bs-content=''
                                                ><span class="icon"><i class="fas fa-info-circle text-light"></i></span></button>
                                                </div>
                                            </div`;
                                }
                                return `<div class="row"><a href="${link}" class="link-primary underline_hover"><span class="badge-parent badge-parent-primary">${row?.['code']}</span></a></div>`;
                            }
                            return `<a href="${link}" class="link-primary underline_hover">--</a>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '17%',
                        orderable: true,
                        data: 'title',
                        render: (data, type, row) => {
                            const link = urlsEle.data('link-detail').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 3,
                        width: '17%',
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row?.['customer']).length !== 0) {
                                ele = `<p>${row?.['customer']?.['title']}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 4,
                        width: '15%',
                        render: (data, type, row) => {
                            if (Object.keys(row?.['sale_person']).length !== 0) {
                                return `<p>${row?.['sale_person']?.['full_name']}</p>`;
                            }
                            return `<p></p>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '12%',
                        data: "date_created",
                        render: (data) => {
                            return DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', data);
                        }
                    },
                    {
                        targets: 6,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['indicator_revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '10%',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                    {
                        targets: 8,
                        width: '5%',
                        className: 'action-center',
                        render: (data, type, row) => {
                            return DTBControl.addCommonAction({"data-edit": urlsEle.data('link-update')}, row);
                        },
                    }
                ],
                rowCallback: (row, data) => {
                    // append html & trigger popover
                    $(row).on('click', '.popover-cr', function () {
                        renderPopoverCR(this, data);
                    });
                    // add event to .action-delete
                    $(row).on('click', '.action-delete', function (e) {
                        WindowControl.showLoading();
                        $.fn.callAjax2(
                            {
                                'url': urlsEle.attr('data-link-detail-api').format_url_with_uuid(data?.['id']),
                                'method': 'DELETE',
                            }
                        ).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && (data['status'] === 201 || data['status'] === 200)) {
                                    $.fn.notifyB({description: data.message}, 'success');
                                    setTimeout(() => {
                                        WindowControl.hideLoading();
                                        window.location.reload();
                                    }, 2000);
                                }
                            }, (err) => {
                                setTimeout(() => {
                                    WindowControl.hideLoading();
                                }, 1000)
                                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                            }
                        )
                    });
                },
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    dtbHDCustom();
                },
            });
        }

        function dtbHDCustom() {
            let wrapper$ = $table.closest('.dataTables_wrapper');
            let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            if (headerToolbar$.length > 0) {
                if (!$('#btn-open-filter').length) {
                    let $group = $(`<div class="btn-filter">
                                        <button type="button" class="btn btn-light btn-sm ml-1" id="btn-open-filter" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
                                            <span><span class="icon"><i class="fas fa-filter"></i></span><span>${$.fn.transEle.attr('data-filter')}</span></span>
                                        </button>
                                    </div>`);
                    headerToolbar$.append($group);
                }
                // if (!$('#btn-recycle-bin').length) {
                //     let $group = $(`<div class="btn-filter">
                //                         <button type="button" class="btn btn-light btn-sm ml-1" id="btn-recycle-bin">
                //                             <span><span class="icon"><i class="fas fa-recycle"></i></span><span>Recycle bin</span></span>
                //                         </button>
                //                     </div>`);
                //     headerToolbar$.append($group);
                //     // Select the appended button from the DOM and attach the event listener
                //     $('#btn-recycle-bin').on('click', function () {
                //         if ($.fn.dataTable.isDataTable($table)) {
                //             $table.DataTable().destroy();
                //         }
                //         loadDbl({'is_delete': true});
                //     });
                // }
            }
        }

        function renderPopoverCR(ele, data) {
            if (!$(ele).hasClass('popover-rendered')) {
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': urlsEle.attr('data-link-list-api'),
                        'method': 'GET',
                        'data': {'id': data?.['document_root_id']},
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let dataRoots = $.fn.switcherResp(resp);
                        if (dataRoots) {
                            if (dataRoots.hasOwnProperty('quotation_list') && Array.isArray(dataRoots.quotation_list)) {
                                if (dataRoots?.['quotation_list'].length === 1) {
                                    let dataRoot = dataRoots?.['quotation_list'][0];
                                    let link = urlsEle.data('link-detail').format_url_with_uuid(dataRoot?.['id']);
                                    let html = `<b>${$.fn.transEle.attr('data-root-document')}</b>
                                                <div><span>${$.fn.transEle.attr('data-title')}: </span><a href="${link}" class="link-primary underline_hover"><span>${dataRoot?.['title']}</span></a></div>
                                                <div><span>${$.fn.transEle.attr('data-code')}: </span><a href="${link}" class="link-primary underline_hover"><span>${dataRoot?.['code']}</span></a></div>`;
                                    $(ele).addClass('popover-rendered');
                                    $(ele).attr('data-bs-content', html);
                                    let popover = new bootstrap.Popover(ele);
                                    popover.show();
                                }
                            }
                            WindowControl.hideLoading();
                        }
                    }
                )
            }
            return true;
        }

        function initPage() {
            FormElementControl.loadInitS2($employeeEle, [], {}, null, true);
            FormElementControl.loadInitS2($customerEle, [], {'account_types_mapped__account_type_order': 0}, null, true);
            FormElementControl.loadInitS2($operatorEle, [
                {'id': '', 'title': 'Select...',},
                {"id": "=", "title": "="},
                {"id": ">", "title": ">"},
                {"id": "<", "title": "<"},
                {"id": ">=", "title": "≥"},
                {"id": "<=", "title": "≤"},
            ], {}, null, true);
            // init date picker
            $('.flat-picker').each(function () {
                DateTimeControl.initFlatPickrDate(this);
            });

            loadDbl();
        }

        initPage();

        $('#btn-apply-filter').on('click', function () {
            let dataParams = {};
            if ($employeeEle.val() && $employeeEle.val().length > 0) {
                dataParams['employee_inherit_id__in'] = $employeeEle.val().join(',');
            }
            if ($customerEle.val() && $customerEle.val().length > 0) {
                dataParams['customer_id__in'] = $customerEle.val().join(',');
            }
            if ($operatorEle.val()) {
                if ($operatorEle.val() === "=") {
                    dataParams['customer_id__in'] = $customerEle.val().join(',');
                }
                if ($operatorEle.val() === ">") {
                    dataParams['indicator_revenue__gt'] = $totalEle.valCurrency();
                }
                if ($operatorEle.val() === "<") {
                    dataParams['indicator_revenue__lt'] = $totalEle.valCurrency();
                }
                if ($operatorEle.val() === ">=") {
                    dataParams['indicator_revenue__gte'] = $totalEle.valCurrency();
                }
                if ($operatorEle.val() === "<=") {
                    dataParams['indicator_revenue__lte'] = $totalEle.valCurrency();
                }
            }
            if ($fromEle.val()) {
                dataParams['date_approved__gte'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $fromEle.val());
            }
            if ($toEle.val()) {
                dataParams['date_approved__lte'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $toEle.val());
            }
            if ($.fn.dataTable.isDataTable($table)) {
                $table.DataTable().destroy();
            }
            loadDbl(dataParams);
        });


    });
});
