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
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
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
                        let startDate = DateTimeControl.formatDateType('YYYY-MM-DD','DD/MM/YYYY', row?.['start_date'] || '--');
                        return startDate;
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        let endDate = DateTimeControl.formatDateType('YYYY-MM-DD','DD/MM/YYYY', row?.['end_date'] || '--');
                        return endDate;
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
        let data_list = loadServiceOrderInfo.combineDeliveryProductData()

        // init DataTable
        const $tb = $('#total_delivery_product');
        $tb.DataTable().clear().destroy();
        $tb.DataTableDefault({
            scrollY: '50vh',
            scrollX: true,
            scrollCollapse: true,
            rowIndex: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return "";
                    }
                },
                {
                    className: "w-30",
                    render: () => {
                        return "";
                    }
                },
                {
                    className: "w-45",
                    render: () => {
                        return "";
                    }
                },
                {
                    className: "w-20",
                    render: () => {
                        return "";
                    }
                }
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    $tb.find('tbody tr').each(function (index, ele) {
                        $(ele).find('td:eq(0)').html(index + 1);
                        $(ele).find('td:eq(1)').html(`${data_list[index]?.['code']}`);
                        $(ele).find('td:eq(2)').html(`${data_list[index]?.['title']}`);
                        $(ele).find('td:eq(3)').html(`${data_list[index]?.['delivered_quantity']}`);
                    })
                }
            }
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
        const consolidatedProducts = Object.values(productMap); // convert to array
        return consolidatedProducts
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
    });

    // event when save delivery service button
    $(document).on("click", "#btn_apply_delivery", function (){
        loadServiceOrderInfo.combineDeliveryProductData();
    })
});
