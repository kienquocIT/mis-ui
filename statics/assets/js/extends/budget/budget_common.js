/*
This file is about to handle all logics about budget
Can be used for applications in Sale, Finance,...
Include classes:
BudgetControl{}
*/

class BudgetControl {
    static appID = JSON.parse($('#app_id_current').text());
    static $tbl = $('#tbl_budget_extend');
    static $transEle = $('#budget_trans_factory');
    static $urlEle = $('#budget_url_factory');
    static appMapData = {
        "c51857ef-513f-4dbf-babd-26d68950ad6e": {
            "app_code": 'financialcashflow.cashoutflow',
            "dimension": [
                "a870e392-9ad2-4fe2-9baa-298a38691cf2",
                "245e9f47-df59-4d4a-b355-7eff2859247f",
            ],
            "trs": BudgetControl.tblRenderCOF(),
            "columns": BudgetControl.dtbRenderColumnsCOF(),
        },
        "fbff9b3f-f7c9-414f-9959-96d3ec2fb8bf": {
            "app_code": 'purchasing.purchaserequest',
            "dimension": [
                "a870e392-9ad2-4fe2-9baa-298a38691cf2",
                "a8badb2e-54ff-4654-b3fd-0d2d3c777538",
            ],
            "trs": BudgetControl.tblRenderPR(),
            "columns": BudgetControl.dtbRenderColumnsPR(),
        }
    }

    static tblRender() {
        let trCustomEle$ = BudgetControl.$tbl.find('thead tr');
        if (trCustomEle$.length > 0) {
            trCustomEle$.empty();
            trCustomEle$.html(BudgetControl.appMapData[BudgetControl.appID]['trs']);
        }
        return true;
    };

    static tblRenderCOF() {
        return `<th>#</th>
                <th>${BudgetControl.$transEle.attr('data-tr-1')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-3')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-5')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-6')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-7')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-8')}</th>
                <th></th>`;
    };

    static tblRenderPR() {
        return `<th>#</th>
                <th>${BudgetControl.$transEle.attr('data-tr-1')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-3')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-5')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-6')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-7')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-8')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-9')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-10')}</th>
                <th>${BudgetControl.$transEle.attr('data-tr-11')}</th>
                <th></th>`;
    };

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
            columns: BudgetControl.dtbRenderColumns(),
            rowCallback: function (row, data, index) {
                let dimension1Ele$ = $(row).find('.table-row-dimension-1');
                let dimensionValue1Ele$ = $(row).find('.table-row-dimension-value-1');
                let dimension2Ele$ = $(row).find('.table-row-dimension-2');
                let dimensionValue2Ele$ = $(row).find('.table-row-dimension-value-2');
                let budgetLineDataEle$ = $(row).find('.table-row-budget-line-data');
                if (dimension1Ele$.length > 0) {
                    let dataS2 = [];
                    if (data?.['dimension_first_data']) {
                        dataS2 = [data?.['dimension_first_data']];
                    }
                    FormElementControl.loadInitS2($(dimension1Ele$), dataS2, {'related_app_id__in': BudgetControl.appMapData[BudgetControl.appID]['dimension'].join(',')}, null, true);
                }
                if (dimensionValue1Ele$.length > 0) {
                    let dataS2 = [];
                    if (data?.['dimension_value_first_data']) {
                        dataS2 = [data?.['dimension_value_first_data']];
                    }
                    FormElementControl.loadInitS2($(dimensionValue1Ele$), dataS2, {}, null, true);
                }
                if (dimension2Ele$.length > 0) {
                    let dataS2 = [];
                    if (data?.['dimension_second_data']) {
                        dataS2 = [data?.['dimension_second_data']];
                    }
                    FormElementControl.loadInitS2($(dimension2Ele$), dataS2, {'related_app_id__in': BudgetControl.appMapData[BudgetControl.appID]['dimension'].join(',')}, null, true);
                }
                if (dimensionValue2Ele$.length > 0) {
                    let dataS2 = [];
                    if (data?.['dimension_value_second_data']) {
                        dataS2 = [data?.['dimension_value_second_data']];
                    }
                    FormElementControl.loadInitS2($(dimensionValue2Ele$), dataS2, {}, null, true);
                }
                if (budgetLineDataEle$.length > 0) {
                    budgetLineDataEle$.val(JSON.stringify(data?.['budget_line_data'] ? data?.['budget_line_data'] : {}));
                }
                BudgetControl.dtbSubtotal(row);
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

    static dtbRenderColumns() {
        let baseColumns = [
            {
                targets: 0,
                width: '1%',
                render: (data, type, row) => {
                    return `<span class="table-row-order">${row?.['order']}</span>`;
                }
            },
            {
                targets: 1,
                width: '14%',
                render: (data, type, row) => {
                    return `<div class="border border-green bg-green-light-5 p-2 rounded-2">
                            <div class="form-group">
                                <label class="form-label text-primary"><i>Dimension</i></label>
                                <select 
                                    class="form-select table-row-dimension-1"
                                    data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension')}"
                                    data-method="GET"
                                    data-keyResp="dimension_definition_list"
                                >
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label text-primary"><i>Value</i></label>
                                <select 
                                    class="form-select table-row-dimension-value-1"
                                    data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension-value')}"
                                    data-method="GET"
                                    data-keyResp="dimension_value_list"
                                 >
                                </select>
                            </div>
                            </div>`;
                }
            },
            {
                targets: 2,
                width: '14%',
                render: (data, type, row) => {
                    return `<div class="border border-green bg-green-light-5 p-2 rounded-2">
                            <div class="form-group">
                                <label class="form-label text-primary"><i>Dimension</i></label>
                                <select 
                                    class="form-select table-row-dimension-2"
                                    data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension')}"
                                    data-method="GET"
                                    data-keyResp="dimension_definition_list"
                                 >
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label text-primary"><i>Value</i></label>
                                <select 
                                    class="form-select table-row-dimension-value-2"
                                    data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension-value')}"
                                    data-method="GET"
                                    data-keyResp="dimension_value_list"
                                 >
                                </select>
                            </div>
                            </div>`;
                }
            },
            // {
            //     targets: 1,
            //     width: '12%',
            //     render: (data, type, row) => {
            //         return `<select
            //                         class="form-select table-row-dimension-1"
            //                         data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension')}"
            //                         data-method="GET"
            //                         data-keyResp="dimension_definition_list"
            //                      >
            //                     </select>`;
            //     }
            // },
            // {
            //     targets: 2,
            //     width: '12%',
            //     render: (data, type, row) => {
            //         return `<select
            //                         class="form-select table-row-dimension-value-1"
            //                         data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension-value')}"
            //                         data-method="GET"
            //                         data-keyResp="dimension_value_list"
            //                      >
            //                     </select>`;
            //     }
            // },
            // {
            //     targets: 3,
            //     width: '12%',
            //     render: (data, type, row) => {
            //         return `<select
            //                         class="form-select table-row-dimension-2"
            //                         data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension')}"
            //                         data-method="GET"
            //                         data-keyResp="dimension_definition_list"
            //                      >
            //                     </select>`;
            //     }
            // },
            // {
            //     targets: 4,
            //     width: '12%',
            //     render: (data, type, row) => {
            //         return `<select
            //                         class="form-select table-row-dimension-value-2"
            //                         data-url="${BudgetControl.$urlEle.attr('data-api-md-dimension-value')}"
            //                         data-method="GET"
            //                         data-keyResp="dimension_value_list"
            //                      >
            //                     </select>`;
            //     }
            // },
        ]
        baseColumns = baseColumns.concat(BudgetControl.appMapData[BudgetControl.appID]['columns']);
        return baseColumns;
    };

    static dtbRenderColumnsCOF() {
        return [
            {
                targets: 5,
                width: '12%',
                render: (data, type, row) => {
                    return `<span class="mask-money badge text-dark-10 fs-6 bg-grey-light-4 table-row-value-planned" data-init-money="${parseFloat(row?.['budget_line_data']?.['value_planned'] ? row?.['budget_line_data']?.['value_planned'] : '0')}"></span><input type="text" class="form-control table-row-budget-line-data hidden">`;
                }
            },
            {
                targets: 6,
                width: '12%',
                render: (data, type, row) => {
                    return `<span class="mask-money badge text-dark-10 fs-6 bg-yellow-light-4 table-row-value-consumed" data-init-money="${parseFloat(row?.['budget_line_data']?.['value_consumed'] ? row?.['budget_line_data']?.['value_consumed'] : '0')}"></span>`;
                }
            },
            {
                targets: 7,
                width: '12%',
                render: (data, type, row) => {
                    return `<span class="mask-money badge text-dark-10 fs-6 bg-red-light-4 table-row-value-available" data-init-money="${parseFloat(row?.['budget_line_data']?.['value_available'] ? row?.['budget_line_data']?.['value_available'] : '0')}"></span>`;
                }
            },
            {
                targets: 8,
                width: '14%',
                render: (data, type, row) => {
                    return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-consume valid-num" 
                                    value="${row?.['value_consume'] ? row?.['value_consume'] : '0'}"
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
        ]
    };

    static dtbRenderColumnsPR() {
        return [
            {
                targets: 3,
                width: '6%',
                render: (data, type, row) => {
                    return `<span class="badge text-dark-10 fs-6 bg-grey-light-4 table-row-value-planned">${parseFloat(row?.['budget_line_data']?.['quantity_planned'] ? row?.['budget_line_data']?.['quantity_planned'] : '0')}</span><input type="text" class="form-control table-row-budget-line-data hidden">`;
                }
            },
            {
                targets: 4,
                width: '6%',
                render: (data, type, row) => {
                    return `<span class="badge text-dark-10 fs-6 bg-yellow-light-4 table-row-value-consumed">${parseFloat(row?.['budget_line_data']?.['quantity_consumed'] ? row?.['budget_line_data']?.['quantity_consumed'] : '0')}</span>`;
                }
            },
            {
                targets: 5,
                width: '6%',
                render: (data, type, row) => {
                    return `<span class="badge text-dark-10 fs-6 bg-red-light-4 table-row-value-available">${parseFloat(row?.['budget_line_data']?.['quantity_available'] ? row?.['budget_line_data']?.['quantity_available'] : '0')}</span>`;
                }
            },
            {
                targets: 6,
                width: '6%',
                render: (data, type, row) => {
                    return `<input 
                                    type="text" 
                                    class="form-control table-row-value-consume valid-num" 
                                    value="${row?.['value_consume'] ? row?.['value_consume'] : '0'}"
                                >`;
                }
            },
            {
                targets: 7,
                width: '10%',
                render: (data, type, row) => {
                    return `<span class="mask-money text-dark-10 fs-6 table-row-unit-price" data-init-money="${parseFloat(row?.['budget_line_data']?.['unit_price'] ? row?.['budget_line_data']?.['unit_price'] : '0')}"></span>`;
                }
            },
            {
                targets: 8,
                width: '6%',
                render: (data, type, row) => {
                    return `<span class="text-dark-10 fs-6 table-row-tax">${parseFloat(row?.['budget_line_data']?.['tax_data']?.['rate'] ? row?.['budget_line_data']?.['tax_data']?.['rate'] : '0')}</span>%`;
                }
            },
            {
                targets: 9,
                width: '10%',
                render: (data, type, row) => {
                    return `<span class="mask-money text-dark-10 fs-6 table-row-subtotal" data-init-money="${parseFloat(row?.['budget_line_data']?.['subtotal'] ? row?.['budget_line_data']?.['subtotal'] : '0')}"></span>`;
                }
            },
            {
                targets: 10,
                width: '1%',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                }
            },
        ]
    };

    // static dtbRowCallBack(row, data) {
    //     let dimension1Ele$ = $(row).find('.table-row-dimension-1');
    //     let dimensionValue1Ele$ = $(row).find('.table-row-dimension-value-1');
    //     let dimension2Ele$ = $(row).find('.table-row-dimension-2');
    //     let dimensionValue2Ele$ = $(row).find('.table-row-dimension-value-2');
    //     let budgetLineDataEle$ = $(row).find('.table-row-budget-line-data');
    //     if (dimension1Ele$.length > 0) {
    //         let dataS2 = [];
    //         if (data?.['dimension_first_data']) {
    //             dataS2 = [data?.['dimension_first_data']];
    //         }
    //         FormElementControl.loadInitS2($(dimension1Ele$), dataS2, {'related_app_id__in': BudgetControl.appMapData[BudgetControl.appID]['dimension'].join(',')}, null, true);
    //     }
    //     if (dimensionValue1Ele$.length > 0) {
    //         let dataS2 = [];
    //         if (data?.['dimension_value_first_data']) {
    //             dataS2 = [data?.['dimension_value_first_data']];
    //         }
    //         FormElementControl.loadInitS2($(dimensionValue1Ele$), dataS2, {}, null, true);
    //     }
    //     if (dimension2Ele$.length > 0) {
    //         let dataS2 = [];
    //         if (data?.['dimension_second_data']) {
    //             dataS2 = [data?.['dimension_second_data']];
    //         }
    //         FormElementControl.loadInitS2($(dimension2Ele$), dataS2, {'related_app_id__in': BudgetControl.appMapData[BudgetControl.appID]['dimension'].join(',')}, null, true);
    //     }
    //     if (dimensionValue2Ele$.length > 0) {
    //         let dataS2 = [];
    //         if (data?.['dimension_value_second_data']) {
    //             dataS2 = [data?.['dimension_value_second_data']];
    //         }
    //         FormElementControl.loadInitS2($(dimensionValue2Ele$), dataS2, {}, null, true);
    //     }
    //     if (budgetLineDataEle$.length > 0) {
    //         budgetLineDataEle$.val(JSON.stringify(data?.['budget_line_data'] ? data?.['budget_line_data'] : {}));
    //     }
    // };

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
        if (window.location.href.includes('/create') || window.location.href.includes('/update/')) {
            if (headerToolbar$.length > 0) {
                headerToolbar$.prepend(textFilter$);
                if (!$('#tbl_budget_extend_add').length) {
                    let $group = $(`<button type="button" class="btn btn-primary" id="tbl_budget_extend_add">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${$.fn.transEle.attr('data-add')}</span></span>
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

    static dtbOnChangeDimension(ele) {
        let row = ele.closest('tr');
        let check = true;
        if ($(ele).val() && row) {
            let dimensionOtherEle$ = null;
            let dimensionValueOtherEle$ = null;
            let dimensionValueEle$ = null;
            if ($(ele).hasClass('table-row-dimension-1')) {
                dimensionOtherEle$ = $(row).find('.table-row-dimension-2');
                if (dimensionOtherEle$.length > 0) {
                    if (dimensionOtherEle$.val()) {
                        if (dimensionOtherEle$.val() === $(ele).val()) {
                            check = false;
                        }
                    }
                }
                dimensionValueEle$ = $(row).find('.table-row-dimension-value-1');
                dimensionValueOtherEle$ = $(row).find('.table-row-dimension-value-2');
            }
            if ($(ele).hasClass('table-row-dimension-2')) {
                dimensionOtherEle$ = $(row).find('.table-row-dimension-1');
                if (dimensionOtherEle$.length > 0) {
                    if (dimensionOtherEle$.val()) {
                        if (dimensionOtherEle$.val() === $(ele).val()) {
                            check = false;
                        }
                    }
                }
                dimensionValueEle$ = $(row).find('.table-row-dimension-value-2');
                dimensionValueOtherEle$ = $(row).find('.table-row-dimension-value-1');
            }
            if (check === false) {
                $.fn.notifyB({description: "Dimensions must be different"}, 'failure');
                FormElementControl.loadInitS2($(ele), [], {'related_app_id__in': BudgetControl.appMapData[BudgetControl.appID]['dimension'].join(',')}, null, true);
                return false;
            }
            FormElementControl.loadInitS2(dimensionValueEle$, [], {'dimension_id': $(ele).val()}, null, true);
            if (dimensionValueEle$ && dimensionValueOtherEle$) {
                if (dimensionValueEle$.length > 0 && dimensionValueOtherEle$.length > 0) {
                    if (dimensionValueOtherEle$.val()) {
                        let dataDimensionValue = SelectDDControl.get_data_from_idx($(dimensionValueOtherEle$), $(dimensionValueOtherEle$).val());
                        WindowControl.showLoading();
                        $.fn.callAjax2({
                                'url': BudgetControl.$urlEle.attr('data-api-budget'),
                                'method': "GET",
                                'data': {'doc_id': dataDimensionValue?.['related_doc_id'] ? dataDimensionValue?.['related_doc_id'] : null},
                                'isDropdown': true,
                            }
                        ).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    if (data.hasOwnProperty('budget_list') && Array.isArray(data.budget_list)) {
                                        let idsIn = [];
                                        for (let budget of data?.['budget_list']) {
                                            for (let budgetLine of budget?.['budget_line_data'] ? budget?.['budget_line_data'] : []) {
                                                idsIn = idsIn.concat(budgetLine?.['dimension_values_id']);
                                            }
                                        }
                                        FormElementControl.loadInitS2(dimensionValueEle$, [], {'id__in': idsIn.join(','), 'dimension_id': $(ele).val()}, null, true);
                                        WindowControl.hideLoading();
                                    }
                                }
                            }
                        )
                    }
                }
            }
        }
        return true;
    };

    static dtbOnChangeDimensionValue(ele) {
        let row = ele.closest('tr');
        let check = true;
        let orderEle$ = $(row).find('.table-row-order');
        let dimensionValue1Ele$ = $(row).find('.table-row-dimension-value-1');
        let dimensionValue2Ele$ = $(row).find('.table-row-dimension-value-2');
        if (orderEle$.length > 0 && dimensionValue1Ele$.length > 0 && dimensionValue2Ele$.length > 0) {
            let budgetLineDataEle$ = $(row).find('.table-row-budget-line-data');
            BudgetControl.dtbLoadBudgetLine(row, {});
            if (budgetLineDataEle$.length > 0) {
                budgetLineDataEle$.val(JSON.stringify({}));
            }
            $.fn.initMaskMoney2();
            if (dimensionValue1Ele$.val() && dimensionValue2Ele$.val()) {
                let dimensionValues = [dimensionValue1Ele$.val(), dimensionValue2Ele$.val()];
                BudgetControl.$tbl.DataTable().rows().every(function () {
                    let row = this.node();
                    let orderCheckEle$ = $(row).find('.table-row-order');
                    let dimensionValue1CheckEle$ = $(row).find('.table-row-dimension-value-1');
                    let dimensionValue2CheckEle$ = $(row).find('.table-row-dimension-value-2');
                    if (orderCheckEle$.length > 0 && dimensionValue1CheckEle$.length > 0 && dimensionValue2CheckEle$.length > 0) {
                        if (orderEle$.text() !== orderCheckEle$.text() && dimensionValue1CheckEle$.val() && dimensionValue2CheckEle$.val()) {
                            if (dimensionValues.includes(dimensionValue1CheckEle$.val()) && dimensionValues.includes(dimensionValue2CheckEle$.val())) {
                                check = false;
                            }
                        }
                    }
                });
                if (check === false) {
                    $.fn.notifyB({description: BudgetControl.$transEle.attr('data-valid-dimension-value')}, 'failure');
                    if ($(ele).hasClass('table-row-dimension-value-1')) {
                        let dimensionEle$ = $(row).find('.table-row-dimension-1');
                        if (dimensionEle$.length > 0) {
                            dimensionEle$.trigger('change');
                            // FormElementControl.loadInitS2($(ele), [], {'dimension_id': dimensionEle$.val()}, null, true);
                        }
                    }
                    if ($(ele).hasClass('table-row-dimension-value-2')) {
                        let dimensionEle$ = $(row).find('.table-row-dimension-2');
                        if (dimensionEle$.length > 0) {
                            dimensionEle$.trigger('change');
                            // FormElementControl.loadInitS2($(ele), [], {'dimension_id': dimensionEle$.val()}, null, true);
                        }
                    }
                    return false;
                }
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': BudgetControl.$urlEle.attr('data-api-budget-line'),
                        'method': "GET",
                        'data': {'dimension_values': dimensionValues.join(',')},
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('budget_line_list') && Array.isArray(data.budget_line_list)) {
                                for (let budgetLine of data?.['budget_line_list']) {
                                    let count = 0;
                                    for (let dimensionValue of dimensionValues) {
                                        if (budgetLine?.['dimension_values_id'].includes(dimensionValue)) {
                                            count++;
                                        }
                                        if (count === dimensionValues.length) {
                                            BudgetControl.dtbLoadBudgetLine(row, budgetLine);
                                            if (budgetLineDataEle$.length > 0) {
                                                budgetLineDataEle$.val(JSON.stringify(budgetLine));
                                            }
                                            $.fn.initMaskMoney2();
                                            break;
                                        }
                                    }
                                }
                                WindowControl.hideLoading();
                            }
                        }
                    }
                )
            }
        }
    };

    static dtbLoadBudgetLine(row, budgetLine) {
        if (BudgetControl.appMapData[BudgetControl.appID]["app_code"] === 'financialcashflow.cashoutflow') {
            BudgetControl.dtbLoadBudgetLineCOF(row, budgetLine);
        }
        if (BudgetControl.appMapData[BudgetControl.appID]["app_code"] === 'purchasing.purchaserequest') {
            BudgetControl.dtbLoadBudgetLinePR(row, budgetLine);
        }
    }

    static dtbLoadBudgetLineCOF(row, budgetLine) {
        let plannedEle$ = $(row).find('.table-row-value-planned');
        let consumedEle$ = $(row).find('.table-row-value-consumed');
        let availableEle$ = $(row).find('.table-row-value-available');
        if (plannedEle$.length > 0 && consumedEle$.length > 0 && availableEle$.length > 0) {
            if (Object.keys(budgetLine).length > 0) {
                plannedEle$.attr('data-init-money', parseFloat(budgetLine?.['value_planned'] ? budgetLine?.['value_planned'] : '0'));
                consumedEle$.attr('data-init-money', parseFloat(budgetLine?.['value_consumed'] ? budgetLine?.['value_consumed'] : '0'));
                availableEle$.attr('data-init-money', parseFloat(budgetLine?.['value_available'] ? budgetLine?.['value_available'] : '0'));
            }
            if (Object.keys(budgetLine).length === 0) {
                plannedEle$.attr('data-init-money', 0);
                consumedEle$.attr('data-init-money', 0);
                availableEle$.attr('data-init-money', 0);
            }
        }
    };

    static dtbLoadBudgetLinePR(row, budgetLine) {
        let plannedEle$ = $(row).find('.table-row-value-planned');
        let consumedEle$ = $(row).find('.table-row-value-consumed');
        let availableEle$ = $(row).find('.table-row-value-available');
        let unitPriceEle$ = $(row).find('.table-row-unit-price');
        let taxEle$ = $(row).find('.table-row-tax');
        if (plannedEle$.length > 0 && consumedEle$.length > 0 && availableEle$.length > 0 && unitPriceEle$.length > 0 && taxEle$.length >0) {
            if (Object.keys(budgetLine).length > 0) {
                plannedEle$.text(budgetLine?.['quantity_planned'] ? budgetLine?.['quantity_planned'] : '0');
                consumedEle$.text(budgetLine?.['quantity_consumed'] ? budgetLine?.['quantity_consumed'] : '0');
                availableEle$.text(budgetLine?.['quantity_available'] ? budgetLine?.['quantity_available'] : '0');
                unitPriceEle$.attr('data-init-money', parseFloat(budgetLine?.['unit_price'] ? budgetLine?.['unit_price'] : '0'));
                taxEle$.text(budgetLine?.['tax_data']?.['rate'] ? budgetLine?.['tax_data']?.['rate'] : '0');
            }
            if (Object.keys(budgetLine).length === 0) {
                plannedEle$.text('0');
                consumedEle$.text('0');
                availableEle$.text('0');
            }
        }
    };

    static dtbOnChangeValueConsume(ele) {
        let row = ele.closest('tr');
        if (row) {
            BudgetControl.dtbValidValueConsume($(ele), $(row).find('.table-row-value-available'));
            BudgetControl.dtbSubtotal(row);
        }
    };

    static dtbValidValueConsume(valueConsumeEle$, valueAvailableEle$) {
        if (valueConsumeEle$.length > 0 && valueAvailableEle$.length > 0) {
            if (BudgetControl.appMapData[BudgetControl.appID]["app_code"] === 'financialcashflow.cashoutflow') {
                if (valueConsumeEle$.valCurrency() && valueAvailableEle$.attr('data-init-money')) {
                    let consumeValue = valueConsumeEle$.valCurrency();
                    let availableValue = parseFloat(valueAvailableEle$.attr('data-init-money'));
                    if (consumeValue > availableValue) {
                        $.fn.notifyB({description: BudgetControl.$transEle.attr('data-valid-value-consume')}, 'failure');
                        valueConsumeEle$.attr('value', '0');
                        $.fn.initMaskMoney2();
                        return false;
                    }
                }
            }
            if (BudgetControl.appMapData[BudgetControl.appID]["app_code"] === 'purchasing.purchaserequest') {
                if (valueConsumeEle$.val() && valueAvailableEle$.text()) {
                    let consumeValue = valueConsumeEle$.val();
                    let availableValue = parseFloat(valueAvailableEle$.text());
                    if (consumeValue > availableValue) {
                        $.fn.notifyB({description: BudgetControl.$transEle.attr('data-valid-value-consume')}, 'failure');
                        valueConsumeEle$.val(0);
                        $.fn.initMaskMoney2();
                        return false;
                    }
                }
            }
        }
    }

    static dtbSubtotal(row) {
        if (BudgetControl.appMapData[BudgetControl.appID]["app_code"] === 'purchasing.purchaserequest') {
            let valueConsumeEle$ = $(row).find('.table-row-value-consume');
            let unitPriceEle$ = $(row).find('.table-row-unit-price');
            let taxEle$ = $(row).find('.table-row-tax');
            let subtotalEle$ = $(row).find('.table-row-subtotal');
            let subtotal = 0;
            let taxValue = 0;
            if (valueConsumeEle$.length > 0 && unitPriceEle$.length > 0) {
                if (valueConsumeEle$.val() && unitPriceEle$.attr('data-init-money')) {
                    subtotal = valueConsumeEle$.val() * parseFloat(unitPriceEle$.attr('data-init-money'));
                }
            }
            if (taxEle$.length > 0) {
                taxValue = parseFloat(taxEle$.text());
            }
            if (subtotalEle$.length > 0) {
                let subtotalWithTax = subtotal + (subtotal * taxValue / 100);
                subtotalEle$.attr('data-init-money', subtotalWithTax);
                $.fn.initMaskMoney2();
            }
        }
        return true;
    };

    static dtbTotalConsume() {
        let total = 0;
        BudgetControl.$tbl.DataTable().rows().every(function () {
            let row = this.node();
            let valueConsumeEle$ = $(row).find('.table-row-value-consume');
            if (valueConsumeEle$.length > 0) {
                if (valueConsumeEle$.valCurrency()) {
                    total += valueConsumeEle$.valCurrency();
                }
            }
        });
        return total;
    };

    static dtbDeleteRow(currentRow) {
        let rowIndex = BudgetControl.$tbl.DataTable().row(currentRow).index();
        let row = BudgetControl.$tbl.DataTable().row(rowIndex);
        row.remove();
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

    static dtbLoadTotal() {
        let tblWrapper = document.getElementById('tbl_budget_extend_wrapper');
        if (tblWrapper) {
            let tblFt = tblWrapper.querySelector('.dataTables_scrollFoot');
            if (tblFt) {
                let totalEle = tblFt.querySelector('.tbl-budget-total');
                if (totalEle) {
                    $(totalEle).attr('data-init-money', String(BudgetControl.dtbTotalConsume()));
                    $.fn.initMaskMoney2();
                }
            }
        }
        return true;
    };

    static dtbRenderDetail(data) {
        BudgetControl.dtbBudget(data);
        BudgetControl.dtbLoadTotal();
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
            let budgetLineDataEle$ = $(row).find('.table-row-budget-line-data');
            let valueConsumeEle$ = $(row).find('.table-row-value-consume');
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
            if (budgetLineDataEle$.length > 0) {
                if (budgetLineDataEle$.val()) {
                    let budget_line_data = JSON.parse(budgetLineDataEle$.val());
                    rowData['budget_line_id'] = budget_line_data?.['id'];
                    rowData['budget_line_data'] = budget_line_data;
                }
            }
            if (valueConsumeEle$.length > 0) {
                rowData['value_consume'] = 0;
                if (BudgetControl.appMapData[BudgetControl.appID]["app_code"] === 'financialcashflow.cashoutflow') {
                    if (valueConsumeEle$.valCurrency()) {
                        rowData['value_consume'] = valueConsumeEle$.valCurrency();
                    }
                }
                if (BudgetControl.appMapData[BudgetControl.appID]["app_code"] === 'purchasing.purchaserequest') {
                    if (valueConsumeEle$.val()) {
                        rowData['value_consume'] = parseFloat(valueConsumeEle$.val());
                    }
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
        BudgetControl.tblRender();
        BudgetControl.dtbBudget();

        // events
        BudgetControl.$tbl.on('click', '.del-row', function (e) {
            BudgetControl.dtbDeleteRow(this.closest('tr'));
            BudgetControl.dtbReOrderSTT();
            BudgetControl.storeDtbData(1);
            BudgetControl.dtbLoadTotal();
        });

        BudgetControl.$tbl.on('change', '.table-row-dimension-1, .table-row-dimension-2', function (e) {
            BudgetControl.dtbOnChangeDimension(this);
        });

        BudgetControl.$tbl.on('change', '.table-row-dimension-value-1, .table-row-dimension-value-2', function (e) {
            BudgetControl.dtbOnChangeDimensionValue(this);
        });

        BudgetControl.$tbl.on('change', '.table-row-value-consume', function (e) {
            BudgetControl.dtbOnChangeValueConsume(this);
            BudgetControl.dtbLoadTotal();
        });

    });

});