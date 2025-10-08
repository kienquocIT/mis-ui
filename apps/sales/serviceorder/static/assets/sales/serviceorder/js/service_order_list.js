class loadServiceOrderInfo {
    static selectedWorkOrders = [];

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
                        className: "ellipsis-cell-lg w-5",
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
                        className: 'ellipsis-cell-lg w-25', render: (data, type, row) => {
                            const link = $tb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: "ellipsis-cell-lg w-25",
                        render: (data, type, row) => {
                            return row?.['customer_data']?.['name'] || '';
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            if (!row?.['document_root_id']) {
                                return ``;
                            }
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                    {
                        className: 'text-center w-5',
                        render: (data, type, row) => {
                            return `<a href="${$tb.attr('data-url-dashboard')}?service_order_id=${row?.['id']}" 
                                         class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-sm">
                                        <span class="icon"> <i class="bi bi-clipboard-data"></i></span>
                                      </a>`;
                        }
                    },
                    {
                        className: 'text-center w-5',
                        render: (data, type, row) => {
                            return `<a href="javascript:void(0);"  
                                        class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-sm open-delivery-modal"
                                        data-id="${row?.['id']}" data-bs-toggle="modal" data-bs-target="#delivery_work_order_modal">
                                        <span class="icon"><i class="fas fa-truck"></i></span>
                                      </a>`;
                        }
                    }
                ],
            });
        }
    }

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
            rowCallback: function(row, data) {
                const $checkbox = $(row).find('.row-checkbox');

                $checkbox.off("change").on("change", function () {
                    if ($(this).is(":checked")) {
                        if (!loadServiceOrderInfo.selectedWorkOrders.some(wo => wo.id === data.id)) {
                            loadServiceOrderInfo.selectedWorkOrders.push(data);
                        }
                    } else {
                        loadServiceOrderInfo.selectedWorkOrders = loadServiceOrderInfo.selectedWorkOrders.filter(wo => wo.id !== data.id);
                    }
                    loadServiceOrderInfo.loadTotalDeliveryProduct();
                });
            }
        });
    }

    static loadTotalDeliveryProduct() {
        // get all product list from selected work order
        let data_list = loadServiceOrderInfo.combineDeliveryProductData();

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

    static combineDeliveryProductData() {
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
}

$('document').ready(function () {
    loadServiceOrderInfo.loadServiceOrderList();

    // event when click delivery service button
    $(document).on("click", '.open-delivery-modal', function () {
        loadServiceOrderInfo.selectedWorkOrders = [];
        $('#delivery_work_order_list').find('.row-checkbox').prop('checked', false);
        let service_order_row_id = $(this).attr('data-id');
        loadServiceOrderInfo.loadDeliveryWorkOrderList(service_order_row_id);
        loadServiceOrderInfo.loadTotalDeliveryProduct();
    });

    // event when save delivery service button
    $(document).on("click", "#btn_apply_delivery", function (){
        loadServiceOrderInfo.combineDeliveryProductData();
    })

    // baseline events
    $('#table-service-order').on('click', '.btn-view-baseline', function () {
        let targetID = $(this).attr('data-id');
        let targetRow = this.closest('tr');
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

                        let cls = `cl-${targetID.replace(/-/g, "")}`;
                        let count = $('#table-service-order')[0].querySelectorAll(`.${cls}`).length;
                        if (count !== data.service_order_list.length) {
                            // append new row
                            for (let dataSO of data?.['service_order_list']) {
                                let newRow = $('#table-service-order').DataTable().row.add(dataSO).node();
                                $(newRow).addClass(`${cls} collapse show bg-light`);
                                $(newRow).detach().insertAfter(targetRow);
                            }
                        } else {
                            if ($(this).find('i').hasClass('fa-chevron-right')) {
                                // remove show
                                $('#table-service-order')[0].querySelectorAll(`.${cls}`).forEach(el => {
                                    el.classList.remove('show');
                                });
                            }
                        }
                        WindowControl.hideLoading();
                    }
                }
            }
        )
    });
});
