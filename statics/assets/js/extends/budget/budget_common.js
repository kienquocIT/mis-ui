/*
This file is about to handle all logics about budget
Can be used for applications in Sale, Finance,...
Include classes:
BudgetControl{}
*/

class BudgetControl {
    static $tbl = $('#tbl_budget_extend');
    static $urlEle = $('#budget_url_factory');

    static dtbBudget(data) {
        if ($.fn.dataTable.isDataTable(BudgetControl.$tbl)) {
            BudgetControl.$tbl.DataTable().destroy();
        }
        BudgetControl.$tbl.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            // buttons: DTBControl.customExportExel(),
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<select 
                                    class="form-select table-row-dimension-1"
                                    data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension')}"
                                    data-method="GET"
                                    data-keyResp="dimension_list"
                                 >
                                </select>`;
                    }
                },
                {
                    targets: 2,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<select 
                                    class="form-select table-row-dimension-2"
                                    data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension-value')}"
                                    data-method="GET"
                                    data-keyResp="dimension_value_list"
                                 >
                                </select>`;
                    }
                },
                {
                    targets: 3,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<select 
                                    class="form-select table-row-dimension-1"
                                    data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension')}"
                                    data-method="GET"
                                    data-keyResp="dimension_list"
                                 >
                                </select>`;
                    }
                },
                {
                    targets: 4,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<select 
                                    class="form-select table-row-dimension-2"
                                    data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension-value')}"
                                    data-method="GET"
                                    data-keyResp="dimension_value_list"
                                 >
                                </select>`;
                    }
                },
                {
                    targets: 5,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<span class="mask-money badge text-dark-10 fs-8 bg-grey-light-4" data-init-money="${parseFloat(row?.['value_planned'] ? row?.['value_planned'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 6,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<span class="mask-money badge text-dark-10 fs-8 bg-yellow-light-4" data-init-money="${parseFloat(row?.['value_consumed'] ? row?.['value_consumed'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 7,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<span class="mask-money badge text-dark-10 fs-8 bg-red-light-4" data-init-money="${parseFloat(row?.['value_available'] ? row?.['value_available'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 8,
                    width: '14%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-advance valid-num" 
                                    value="${row?.['value_advance'] ? row?.['value_advance'] : '0'}"
                                    data-return-type="number"
                                >`;
                    }
                },
                {
                    targets: 9,
                    width: '1%',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let dimension1Ele$ = $(row).find('.table-row-dimension-1');
                let dimensionValue1Ele$ = $(row).find('.table-row-dimension-value-1');
                let dimension2Ele$ = $(row).find('.table-row-dimension-2');
                let dimensionValue2Ele$ = $(row).find('.table-row-dimension-value-2');
                if (dimension1Ele$.length > 0) {
                    let dataS2 = [];
                    if (data?.['dimension_first_data']) {
                        dataS2 = [data?.['dimension_first_data']];
                    }
                    FormElementControl.loadInitS2($(dimension1Ele$), dataS2);
                }
                if (dimensionValue1Ele$.length > 0) {
                    let dataS2 = [];
                    if (data?.['dimension_value_first_data']) {
                        dataS2 = [data?.['dimension_value_first_data']];
                    }
                    FormElementControl.loadInitS2($(dimensionValue1Ele$), dataS2);
                }
                if (dimension2Ele$.length > 0) {
                    let dataS2 = [];
                    if (data?.['dimension_second_data']) {
                        dataS2 = [data?.['dimension_second_data']];
                    }
                    FormElementControl.loadInitS2($(dimension2Ele$), dataS2);
                }
                if (dimensionValue2Ele$.length > 0) {
                    let dataS2 = [];
                    if (data?.['dimension_value_second_data']) {
                        dataS2 = [data?.['dimension_value_second_data']];
                    }
                    FormElementControl.loadInitS2($(dimensionValue2Ele$), dataS2);
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                BudgetControl.dtbBudgetHeaderCustom();
            },
            initComplete: function () {
                // add buttons
                // DTBControl.pushButtonsToDtb("datable-quotation-create-product");
            },
        });
    };

    static dtbBudgetHeaderCustom() {
        let $table = BudgetControl.$tbl;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        if (headerToolbar$.length > 0) {
            headerToolbar$.prepend(textFilter$);
            if (!$('#tbl_budget_extend_add').length) {
                let $group = $(`<button type="button" class="btn btn-primary" id="tbl_budget_extend_add">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>Add</span></span>
                                </button>`);
                headerToolbar$.append($group);
                $('#tbl_budget_extend_add').css('margin-left', 'auto');
                // Select the appended button from the DOM and attach the event listener
                $('#tbl_budget_extend_add').on('click', function () {
                    BudgetControl.storeDtbData(1);
                    BudgetControl.loadAddBudget();
                });
            }

            let util$ = headerToolbar$.find('.util-btn');
            if (util$.length > 0) {
                util$.attr('hidden', 'true');
            }

        }

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#tbl_budget_extend_label').length) {
                let $group = $(`<div class="d-flex align-items-center" id="tbl_budget_extend_label">
                                        <h5><i class="fa-regular fa-calendar-check text-blue mr-2"></i> Budget Plan Detail</h5>
                                    </div>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

    static dtbDeleteRow(currentRow) {
        let rowIndex = BudgetControl.$tbl.DataTable().row(currentRow).index();
        let row = BudgetControl.$tbl.DataTable().row(rowIndex);
        row.remove().draw();
    };

    static dtbReOrderSTT() {
        let order = 1;
        let itemCount = BudgetControl.$tbl[0].querySelectorAll('.table-row-order').length;
        if (itemCount === 0) {
            BudgetControl.$tbl.DataTable().clear().draw();
        } else {
            for (let eleOrder of BudgetControl.$tbl[0].querySelectorAll('.table-row-order')) {
                eleOrder.innerHTML = order;
                order++
                if (order > itemCount) {
                    break;
                }
            }
        }
    };

    static loadAddBudget() {
        let orderEleList = BudgetControl.$tbl[0].querySelectorAll('.table-row-order');
        BudgetControl.$tbl.DataTable().row.add({"order": (orderEleList.length + 1)}).draw();
        return true;
    };

    static loadReInitDtbBudget() {
        let tableData = [];
        let dataDetail = {};
        // if page detail use data products of detail else use realtime data products in dtb
        if (window.location.href.includes('/detail/')) {
            tableData = dataDetail;
        }
        if (window.location.href.includes('/create') || window.location.href.includes('/update/')) {
            BudgetControl.$tbl.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = BudgetControl.$tbl.DataTable().row(row).index();
                let $row = BudgetControl.$tbl.DataTable().row(rowIndex);
                let dataRow = $row.data();
                tableData.push(dataRow);
            });

            if (tableData.length === 0 && window.location.href.includes('/update/')) {
                tableData = dataDetail;
            }
        }
        BudgetControl.dtbBudget(tableData);
        return true;
    };

    static storeDtbData(type) {
        let dataJSON = {};
        let datas = [];
        let $table = null;
        if (type === 1) {
            datas = BudgetControl.setupSubmitTblBudget();
            $table = BudgetControl.$tbl;
        }
        if (datas.length > 0 && $table) {
            for (let data of datas) {
                if (!dataJSON.hasOwnProperty(String(data?.['order']))) {
                    dataJSON[String(data?.['order'])] = data;
                }
            }
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = $table.DataTable().row(row).index();
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    let key = eleOrder.innerHTML;
                    $table.DataTable().row(rowIndex).data(dataJSON?.[key]);
                }
            });
            if (type === 1) {
                BudgetControl.loadReInitDtbBudget();
            }
        }
        return true;
    };

    static setupSubmitTblBudget() {
        if (BudgetControl.$tbl.DataTable().data().count() === 0) {
            return [];
        }
        let result = [];
        BudgetControl.$tbl.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let orderEle$ = $(row).find('.table-row-order');
            let dimension1Ele$ = $(row).find('.table-row-dimension-1');
            let dimensionValue1Ele$ = $(row).find('.table-row-dimension-value-1');
            let dimension2Ele$ = $(row).find('.table-row-dimension-2');
            let dimensionValue2Ele$ = $(row).find('.table-row-dimension-value-2');
            let valueAdvanceEle$ = $(row).find('.table-row-value-advance');
            if (orderEle$.length > 0) {
                rowData['order'] = parseInt(orderEle$.text());
            }
            if (dimension1Ele$.length > 0) {
                if (dimension1Ele$.val()) {
                    rowData['dimension_first_id'] = dimension1Ele$.val();
                    rowData['dimension_first_data'] = SelectDDControl.get_data_from_idx(dimension1Ele$, dimension1Ele$.val());
                }
            }
            if (dimensionValue1Ele$.length > 0) {
                if (dimensionValue1Ele$.val()) {
                    rowData['dimension_value_first_id'] = dimensionValue1Ele$.val();
                    rowData['dimension_value_first_data'] = SelectDDControl.get_data_from_idx(dimensionValue1Ele$, dimensionValue1Ele$.val());
                }
            }
            if (dimension2Ele$.length > 0) {
                if (dimension2Ele$.val()) {
                    rowData['dimension_second_id'] = dimension2Ele$.val();
                    rowData['dimension_second_data'] = SelectDDControl.get_data_from_idx(dimension2Ele$, dimension2Ele$.val());
                }
            }
            if (dimensionValue2Ele$.length > 0) {
                if (dimensionValue2Ele$.val()) {
                    rowData['dimension_value_second_id'] = dimensionValue2Ele$.val();
                    rowData['dimension_value_second_data'] = SelectDDControl.get_data_from_idx(dimensionValue2Ele$, dimensionValue2Ele$.val());
                }
            }
            if (valueAdvanceEle$.length > 0) {
                rowData['value_advance'] = 0;
                if (valueAdvanceEle$.valCurrency()) {
                    rowData['value_advance'] = valueAdvanceEle$.valCurrency();
                }
            }
            result.push(rowData);
        });
        return result;
    };

}

$(function () {

    $(document).ready(function () {
        // init
        BudgetControl.dtbBudget();

        // events
        BudgetControl.$tbl.on('click', '.del-row', function (e) {
            BudgetControl.dtbDeleteRow(this.closest('tr'));
            BudgetControl.dtbReOrderSTT();
            BudgetControl.storeDtbData(1);
        });
    });

});