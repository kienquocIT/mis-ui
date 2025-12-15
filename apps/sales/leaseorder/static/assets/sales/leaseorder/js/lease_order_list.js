
$(function () {
    class AdvanceFilterLeaseOrderHandler extends AdvanceFilterCommonHandler{
        constructor() {
            super();
            this.$url = $('#app-url-factory')
            this.CONTENT_TYPE_MAPPING_URL = {
                "saledata.account": {
                    "url": $('#app-url-factory').data('account-list'),
                    "keyResp": "account_list",
                    "keyText": "name"
                },
                "saledata.contact": {
                    "url": $('#app-url-factory').data('contact-list'),
                    "keyResp": "contact_list",
                    "keyText": "fullname"
                },
            }
        }

        getPropUrl() {
            return this.$url.data('app-prop-list')
        }

        getContentTypeMappingUrl(contentType) {
            return this.CONTENT_TYPE_MAPPING_URL[contentType]
        }

        clearDataFormCreateFilter() {
            super.clearDataFormCreateFilter();
            this.init()
        }
    }


    $(document).ready(function () {

        let $table = $('#table_lease_order_list');
        let frm = new SetupFormSubmit($table);

        let $employeeEle = $('#employee_dd');
        let $customerEle = $('#customer_dd');
        let $operatorEle = $('#operator');
        let $totalEle = $('#total');
        let $fromEle = $('#date_from');
        let $toEle = $('#date_to');
        let transEle = $('#trans-factory');
        let urlsEle = $('#app-url-factory');
        let $modalDeliveryInfoEle = $('#deliveryInfoModalCenter');
        let $deliveryEstimatedDateEle = $('#estimated_delivery_date');
        let $deliveryRemarkEle = $('#remarks');
        let $btnDelivery = $('#btn-delivery');

        function loadDbl(dataParams) {
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    data: dataParams,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('lease_order_list')) {
                            return resp.data['lease_order_list'] ? resp.data['lease_order_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                autoWidth: true,
                scrollX: true,
                pageLength: 10,
                columns: [  // (1366p)
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
                        width: '15%',
                        orderable: true,
                        data: 'title',
                        render: (data, type, row) => {
                            const link = urlsEle.data('link-detail').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 3,
                        width: '15%',
                        render: (data, type, row) => {
                            if (Object.keys(row?.['customer']).length !== 0) {
                                return `<p>${row?.['customer']?.['title']}</p>`;
                            }
                            return `<p></p>`;
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
                            return $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                            });
                        }
                    },
                    {
                        targets: 6,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['indicator_revenue'])}"></span>`
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
                        width: '10%',
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#delivery_status').text())
                            let hidden = "hidden";
                            if (row?.['delivery_status'] === 3) {
                                hidden = "";
                            }
                            return `<div class="d-flex align-items-center justify-content-between"><span>${sttTxt[row?.['delivery_status']][1]}</span><i class="fas fa-check text-success fs-4" ${hidden}></i></div>`;
                        }
                    },
                    {
                        targets: 9,
                        width: '1%',
                        className: 'action-center',
                        render: (data, type, row) => {
                            let link = urlsEle.data('link-update').format_url_with_uuid(row?.['id']);
                            let disabledEdit = '';
                            let disabledDeli = '';
                            if ([2, 3, 4].includes(row?.['system_status'])) {
                                disabledEdit = 'disabled';
                            }
                            if (row?.['delivery_call'] === true || ![2, 3].includes(row?.['system_status']) || row?.['opportunity']?.['is_deal_closed'] === true) {
                                disabledDeli = 'disabled';
                            }
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item ${disabledEdit} border-bottom mb-2" href="${link}"><i class="dropdown-icon far fa-edit"></i><span>${transEle.attr('data-edit')}</span></a>
                                        <a class="dropdown-item delivery-info ${disabledDeli}" href="#"><i class="dropdown-icon fas fa-truck"></i><span>${transEle.attr('data-delivery')}</span></a>
                                    </div>
                                </div>`;
                        },
                    }
                ],
                rowCallback: (row, data) => {
                    $(row).on('click', '.delivery-info', function () {
                        checkOpenDeliveryInfo(data);
                    })
                    // append html & trigger popover
                    $(row).on('click', '.popover-cr', function () {
                        renderPopoverCR(this, data);
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
                            if (dataRoots.hasOwnProperty('lease_order_list') && Array.isArray(dataRoots.lease_order_list)) {
                                if (dataRoots?.['lease_order_list'].length === 1) {
                                    let dataRoot = dataRoots?.['lease_order_list'][0];
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

        function checkOpenDeliveryInfo(data) {
            // check CR all cancel then allow delivery
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': urlsEle.attr('data-link-list-api'),
                    'method': 'GET',
                    'data': {'document_root_id': data?.['document_root_id']},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let dataCR = $.fn.switcherResp(resp);
                    if (dataCR) {
                        if (dataCR.hasOwnProperty('lease_order_list') && Array.isArray(dataCR.lease_order_list)) {
                            let check = false;
                            if (dataCR?.['lease_order_list'].length > 0) {
                                let countCancel = 0;
                                for (let saleOrder of dataCR?.['lease_order_list']) {
                                    if (saleOrder?.['system_status'] === 4) {
                                        countCancel++;
                                    }
                                }
                                if (countCancel === (dataCR?.['lease_order_list'].length - 1)) {
                                    check = true;
                                }
                            }
                            if (check === true) {
                                // open modal
                                $btnDelivery.attr('data-id', data?.['id']);
                                let targetCodeEle = $modalDeliveryInfoEle[0].querySelector('.target-code');
                                if (targetCodeEle) {
                                    targetCodeEle.innerHTML = data?.['code'] ? data?.['code'] : '';
                                }
                                $modalDeliveryInfoEle.modal('show');
                            }
                            if (check === false) {
                                Swal.fire({
                                    title: "Oops...",
                                    text: $.fn.transEle.attr('data-check-cr'),
                                    icon: "error",
                                    allowOutsideClick: false,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                    }
                                })
                            }
                            WindowControl.hideLoading();
                        }
                    }
                }
            )
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
            $('.date-picker').each(function () {
                DateTimeControl.initFlatPickrDate(this);
            });

            loadDbl();
        }

        initPage();

        $btnDelivery.on('click', function () {
            if (!$deliveryEstimatedDateEle.val()) {
                $.fn.notifyB({description: transEle.attr('data-required-delivery-date')}, 'failure');
                return false;
            }

            let dataDelivery = {};
            dataDelivery['estimated_delivery_date'] = moment($deliveryEstimatedDateEle.val(), "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss");
            dataDelivery['remarks'] = $deliveryRemarkEle.val();

            WindowControl.showLoading();
            const url = urlsEle.attr('data-create-delivery').replace('1', $(this).attr('data-id'));
            $.fn.callAjax2({
                url: url,
                method: 'POST',
                data: dataDelivery,
                urlRedirect: null,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data?.['status'] === 200) {
                        const config = data?.config
                        let url_redirect = urlsEle.attr('data-delivery')
                        if (config?.is_picking && !data?.['is_not_picking'])
                            url_redirect = urlsEle.attr('data-picking')
                        setTimeout(() => {
                            window.location.href = url_redirect
                        }, 1000);
                    }
                },
                (errs) => {
                    WindowControl.hideLoading();
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        });

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
            const appliedAdvanceFilter = $('.filter-item').find('input[type="radio"]:checked')
            if(appliedAdvanceFilter.length > 0) {
                dataParams['advance_filter_id'] = $(appliedAdvanceFilter[0]).attr('id')
            }
            loadDbl(dataParams);
        });

        const advanceFilterLeaseOrder = new AdvanceFilterLeaseOrderHandler();
        advanceFilterLeaseOrder.getCurrPageAppID()
        advanceFilterLeaseOrder.addEventBinding()
        advanceFilterLeaseOrder.init()

        advanceFilterLeaseOrder.setUpFormCreateFilterSubmit()
        advanceFilterLeaseOrder.fetchDataFilterList()

        advanceFilterLeaseOrder.setUpFormUpdateFilterSubmit()

    });
});