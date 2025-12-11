class loadServiceOrderInfo {
    static transEle = $('#trans-factory');
    static urlsEle = $('#url-factory');
    static selectedWorkOrders = [];

    static $modalDeliveryInfoEle = $('#deliveryInfoModalCenter');
    static $btnDelivery = $('#btn-delivery');

    static loadServiceOrderList() {
        if (!$.fn.DataTable.isDataTable('#table-service-order')) {
            const $tb = $('#table-service-order');
            $tb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
                ajax: {
                    url: $tb.attr('data-url'),
                    type: 'GET',
                    data: {'document_root_id__isnull': true},
                    dataSrc: "data.service_order_list"
                },
                columns: [
                    {
                        className: "w-5",
                        render: () => {
                            return ""
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            const link = $tb.attr('data-url-detail').replace('0', row?.['id']);
                            let target = `.cl-${row?.['id'].replace(/-/g, "")}`;
                            let clBtn = ``;
                            if (!row?.['document_root_id']) {
                                clBtn = `<button
                                            type="button"
                                            class="btn btn-icon btn-view-baseline"
                                            data-bs-toggle="collapse"
                                            data-bs-target="${target}"
                                            data-bs-placement="top"
                                            aria-expanded="false"
                                            data-id="${row?.['id']}"
                                        >
                                        <span class="icon"><i class="fas fa-chevron-right"></i></span>
                                        </button>`;
                            }
                            return `<div class="d-flex justify-content-between align-items-center"><a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>
                                    ${clBtn}</div>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-20',
                        render: (data, type, row) => {
                            const link = $tb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-20',
                        render: (data, type, row) => {
                            return row?.['customer_data']?.['name'] || '';
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'w-10 text-center',
                        render: (data, type, row) => {
                            if (!row?.['document_root_id']) {
                                return `--`;
                            }
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                    {
                        className: 'w-5 text-center',
                        render: (data, type, row) => {
                            let dashboard_btn = ''
                            let delivery_btn = ''
                            if (!row?.['document_root_id']) {
                                dashboard_btn = `<a href="${$tb.attr('data-url-dashboard')}?service_order_id=${row?.['id']}" 
                                         class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-sm mr-1">
                                        <span class="icon"> <i class="bi bi-clipboard-data"></i></span>
                                      </a>`
                            }
                            if (row?.['is_latest_baseline'] === true) {
                                delivery_btn = `<a href="javascript:void(0);"  
                                        class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-sm delivery-info"
                                        data-id="${row?.['id']}">
                                        <span class="icon"><i class="fas fa-truck"></i></span>
                                      </a>`;
                            }
                            return `${dashboard_btn}${delivery_btn}`;
                        }
                    },
                ],
                rowCallback: (row, data) => {
                    $(row).on('click', '.delivery-info', function () {
                        loadServiceOrderInfo.checkOpenDeliveryInfo(data);
                    })
                },
            });
        }
    }

    static checkOpenDeliveryInfo(data) {
        // open modal
        loadServiceOrderInfo.$btnDelivery.attr('data-id', data?.['id']);
        let targetCodeEle = loadServiceOrderInfo.$modalDeliveryInfoEle[0].querySelector('.target-code');
        if (targetCodeEle) {
            targetCodeEle.innerHTML = data?.['code'] ? data?.['code'] : '';
        }
        //
        loadServiceOrderInfo.selectedWorkOrders = [];
        let service_order_row_id = data?.['id'];
        $('#delivery_work_order_list').find('.row-checkbox').prop('checked', false);
        loadServiceOrderInfo.loadDeliveryWorkOrderList(service_order_row_id);
        loadServiceOrderInfo.loadTotalDeliveryProduct();
        loadServiceOrderInfo.$modalDeliveryInfoEle.modal('show');
        return true;
    };

    static loadDeliveryWorkOrderList(service_order_id) {
        const $tb = $('#delivery_work_order_list');
        $tb.DataTable().clear().destroy();
        $tb.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            reloadCurrency: true,
            ajax: {
                url: $tb.attr('data-url') + `?service_order_id=${service_order_id}`,
                type: 'GET',
                dataSrc: 'data.svo_work_order_detail'
            },
            columns: [
                {
                    className: "w-10",
                    render: () => {
                        return "";
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        if (!loadServiceOrderInfo.selectedWorkOrders) {
                            loadServiceOrderInfo.selectedWorkOrders = [];
                        }
                        let checked = loadServiceOrderInfo.selectedWorkOrders.some(wo => wo.id === row?.id) ? 'checked' : '';
                        return `<div class="form-check form-check-lg">
                                    <input type="checkbox" id="checkbox_${row?.id}" class="form-check-input row-checkbox"
                                            value="${row?.id}" ${checked}>
                                </div>`;
                    }
                },
                {
                    className: "w-40",
                    render: (data, type, row) => {
                        return row?.['title'] || '--';
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        return DateTimeControl.formatDateType('YYYY-MM-DD', 'DD/MM/YYYY', row?.['start_date'] || '--');
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        return DateTimeControl.formatDateType('YYYY-MM-DD', 'DD/MM/YYYY', row?.['end_date'] || '--');
                    }
                },
            ],
            rowCallback: function (row, data) {
                const $checkbox = $(row).find('.row-checkbox');

                $checkbox.off("change").on("change", function () {
                    if ($(this).is(":checked")) {
                        if (!loadServiceOrderInfo.selectedWorkOrders.some(wo => wo.id === data.id)) {
                            loadServiceOrderInfo.selectedWorkOrders.push(data);
                        }
                    } else {
                        loadServiceOrderInfo.selectedWorkOrders = loadServiceOrderInfo.selectedWorkOrders.filter(wo => wo.id !== data.id);
                    }
                    WindowControl.showLoading();
                    $.fn.callAjax2({
                            'url': loadServiceOrderInfo.urlsEle.attr('data-delivery-log-url'),
                            'method': 'GET',
                            'data': {'service_order__document_root_id': data?.['service_order']?.['document_root_id']},
                            'isDropdown': true,
                        }
                    ).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                if (data.hasOwnProperty('delivery_work_log') && Array.isArray(data.delivery_work_log)) {
                                    let dataLogs = data.delivery_work_log;
                                    for (let workData of loadServiceOrderInfo.selectedWorkOrders) {
                                        if (!workData.hasOwnProperty('up_to_date')) {
                                            for (let workProduct of workData?.['product_list'] ? workData?.['product_list'] : []) {
                                                for (let dataLog of dataLogs) {
                                                    for (let dataProd of dataLog?.['products']) {
                                                        if (dataProd?.['product_data']?.['code'] === workProduct?.['code'] && dataProd?.['work_data']?.['order'] === workData?.['order']) {
                                                            workProduct['delivered_quantity'] = workProduct['delivered_quantity'] - dataProd?.['delivery_quantity'];
                                                            if (workProduct?.['delivered_quantity'] < 0) {
                                                                workProduct['delivered_quantity'] = 0;
                                                            }
                                                        }
                                                    }
                                                }

                                            }
                                        }
                                        workData['up_to_date'] = true;
                                    }
                                    loadServiceOrderInfo.loadTotalDeliveryProduct();
                                    WindowControl.hideLoading();
                                }
                            }
                        }
                    )
                });
            }
        });
    }

    static loadTotalDeliveryProduct() {
        // get all product list from selected work
        let data_list = loadServiceOrderInfo.buildDeliveryProductData();

        // init DataTable
        const $tb = $('#total_delivery_product');
        $tb.DataTable().clear().destroy();
        $tb.DataTableDefault({
            scrollY: '50vh',
            scrollX: true,
            scrollCollapse: true,
            rowIndex: true,
            data: data_list,
            columns: [
                {
                    className: "w-5",
                    render: (data, type, row, meta) => {
                        return meta.row + 1;
                    }
                },
                {
                    className: "w-70",
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-light">${row?.['code'] || ''}</span><br><span>${row?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: "w-25 text-center",
                    data: 'delivered_quantity',
                    render: (data) => {
                        return data || 0;
                    }
                }
            ]
        })
    }

    static buildDeliveryProductData() {
        let allProducts = [];
        loadServiceOrderInfo.selectedWorkOrders.forEach(workOrder => {
            if (workOrder.product_list && workOrder.product_list.length > 0) {
                allProducts = allProducts.concat(workOrder.product_list);
            }
        });

        // merge similar products (same code) and add the quantity
        const productMap = {};
        allProducts.forEach(product => {
            if (productMap[product.code]) {
                productMap[product.code].delivered_quantity += product?.delivered_quantity || 0;
            } else {
                productMap[product.code] = {
                    id: product.id,
                    code: product.code,
                    title: product.title,
                    delivered_quantity: product.delivered_quantity
                }
            }
        });
        return Object.values(productMap);   // convert to array
    }

    static combineDeliveryProductData() {
        let result = [];
        if (loadServiceOrderInfo.selectedWorkOrders.length > 0) {
            loadServiceOrderInfo.selectedWorkOrders.forEach(workOrder => {
                // store work info
                let work_order_data = {
                    'id': workOrder?.id || '',
                    'title': workOrder?.title || '',
                    'order': workOrder?.order || 1,
                };
                // store product list
                let allProducts = workOrder?.product_list || [];
                allProducts.forEach(product => {
                    let quantity = product?.['delivered_quantity'] ? product?.['delivered_quantity'] : 0;
                    if (quantity > 0) {
                        let productData = {
                            'product_data': product?.['product_data'] ? product?.['product_data'] : {},
                            'uom_data': product?.['uom'] || {},
                            'tax_data': product?.['tax'] || {},
                            'delivery_quantity': quantity,
                            'work_data': work_order_data,
                            'contribution_data': product?.['contribution_data'] ? product?.['contribution_data'] : {},
                        }
                        result.push(productData);
                    }
                });
            });
        }
        return result;
    }
}

$(document).ready(function () {
    loadServiceOrderInfo.loadServiceOrderList();

    // event when save delivery service button
    loadServiceOrderInfo.$btnDelivery.on("click", function (){
        let dataDelivery = loadServiceOrderInfo.combineDeliveryProductData();
        let count = 0;
        for (let dataDeli of dataDelivery) {
            count += dataDeli?.['delivery_quantity'] ? dataDeli?.['delivery_quantity'] : 0;
        }
        if (count === 0) {
            $.fn.notifyB({description: loadServiceOrderInfo.transEle.attr('data-required-delivery-quantity')}, 'failure');
            return false;
        }
        WindowControl.showLoading();
        const url = loadServiceOrderInfo.urlsEle.attr('data-create-delivery').replace('1', $(this).attr('data-id'));
        $.fn.callAjax2({
            url: url,
            method: 'POST',
            data: {'work_products': dataDelivery},
            urlRedirect: null,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data?.['status'] === 200) {
                    const config = data?.config
                    let url_redirect = loadServiceOrderInfo.urlsEle.attr('data-delivery')
                    if (config?.is_picking && !data?.['is_not_picking'])
                        url_redirect = loadServiceOrderInfo.urlsEle.attr('data-picking')
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

    // baseline events
    $('#table-service-order').on('click', '.btn-view-baseline', function () {
        let targetID = $(this).attr('data-id');
        let targetRow = this.closest('tr');
        let cls = `cl-${targetID.replace(/-/g, "")}`;
        let count = $('#table-service-order')[0].querySelectorAll(`.${cls}`).length;
        if (count > 0) {
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
            if ($(this).find('i').hasClass('fa-chevron-right')) {
                // remove show
                $('#table-service-order')[0].querySelectorAll(`.${cls}`).forEach(el => {
                    el.classList.remove('show');
                });
            }
            return true;
        }
        WindowControl.showLoading();
        $.fn.callAjax2({
                'url': $('#table-service-order').attr('data-url'),
                'method': 'GET',
                'data': {'document_root_id': targetID},
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('service_order_list') && Array.isArray(data.service_order_list)) {
                        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
                        // append new row
                        const filtered = data.service_order_list.filter(item => item.system_status === 3);
                        const latest = filtered.length
                            ? filtered.reduce((max, item) =>
                                item.document_change_order > max.document_change_order ? item : max
                            )
                            : null;
                        let renderData = data?.['service_order_list'].reverse();
                        for (let dataSO of renderData) {
                            let clsBg = 'bg-light';
                            if (dataSO?.['id'] === latest?.['id']) {
                                clsBg = 'bg-green-light-5';
                                dataSO['is_latest_baseline'] = true;
                            }
                            let newRow = $('#table-service-order').DataTable().row.add(dataSO).node();
                            $(newRow).addClass(`${cls} collapse show ${clsBg}`);
                            $(newRow).detach().insertAfter(targetRow);
                            $(newRow).on('click', '.delivery-info', function () {
                                loadServiceOrderInfo.checkOpenDeliveryInfo(dataSO);
                            })
                        }
                        WindowControl.hideLoading();
                    }
                }
            }
        )
    });
});
