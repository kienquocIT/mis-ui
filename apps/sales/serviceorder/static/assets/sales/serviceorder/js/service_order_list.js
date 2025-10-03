class loadServiceOrderInfo {
    static selectedWorkOrderIds = [];

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
                        let checked = loadServiceOrderInfo.selectedWorkOrderIds.includes(row?.id) ? 'checked' : '';
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
                    let work_order_id = parseInt($(this).val());
                    if ($(this).is(":checked")) {
                        if (!loadServiceOrderInfo.selectedWorkOrderIds.includes(work_order_id)) {
                            loadServiceOrderInfo.selectedWorkOrderIds.push(work_order_id);
                        } else {
                            loadServiceOrderInfo.selectedWorkOrderIds = loadServiceOrderInfo.selectedWorkOrderIds.filter(x => x !== work_order_id);
                        }
                    }
                });
            }
        });
    }

    static loadTotalDeliveryProduct(service_order_id) {
        const $tb = $('#total_delivery_product');
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
                        let checked = loadServiceOrderInfo.selectedWorkOrderIds.includes(row?.id) ? 'checked' : '';
                        return `<div class="form-check form-check-lg">
                                    <input type="checkbox" id="checkbox_${row?.id}" class="form-check-input row-checkbox"
                                            value="${row?.id}" ${checked}>
                                </div>`;
                    }
                },
                {
                    className: "w-50",
                    render: (data, type, row) => {
                        return row?.['title'] || '--';
                    }
                },
                {
                    className: "w-30",
                    render: (data, type, row) => {
                        let startDate = DateTimeControl.formatDateType('YYYY-MM-DD','DD/MM/YYYY', row?.['start_date'] || '--');
                        return startDate;
                    }
                },
            ],
        });
    }
}

$('document').ready(function () {
    loadServiceOrderInfo.loadServiceOrderList();
    $(document).on("click", '.open-delivery-modal', function () {
        let service_order_row_id = $(this).attr('data-id');
        loadServiceOrderInfo.loadDeliveryWorkOrderList(service_order_row_id);
        loadServiceOrderInfo.loadTotalDeliveryProduct(service_order_row_id);
    })
});
