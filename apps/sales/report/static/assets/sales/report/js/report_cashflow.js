$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-cashflow-group');
        let boxEmployee = $('#box-report-cashflow-employee');
        let boxSO = $('#box-report-cashflow-so');
        let boxYear = $('#box-report-cashflow-year');
        let boxMonth = $('#box-report-cashflow-month');
        let eleFiscalYear = $('#data-fiscal-year');
        let btnView = $('#btn-view');
        let eleYearArea = $('#area-year');
        let eleMonthArea = $('#area-month');
        let $table = $('#table_report_cashflow_year_list');
        let $tableMonth = $('#table_report_cashflow_month_list');
        let initDataMonth = JSON.parse($('#filter_month').text());
        let eleTrans = $('#app-trans-factory');

        // year (by months)
        // function loadDbl(data) {
        //     $table.DataTableDefault({
        //         data: data ? data : [],
        //         ordering: false,
        //         paging: false,
        //         info: false,
        //         autoWidth: true,
        //         scrollX: true,
        //         columns: [  // 260, <7740> (8000p)
        //             {
        //                 targets: 0,
        //                 width: '3.25%',
        //                 render: (data, type, row) => {
        //                     return `<p class="table-row-type" data-type="${row?.['cashflow_type']}">${row?.['type_title'] ? row?.['type_title'] : ''}</p>`;
        //                 }
        //             },
        //             {
        //                 targets: 1,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 1;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(1).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><div class="row"><input type="text" class="form-control mask-money table-row-value-estimate" data-month="${month}" value="${0}" data-return-type="number"></div></div>
        //                                     <div class="col-4 mt-2"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4 mt-2"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 2,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 2;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(2).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 3,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 3;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(3).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 4,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 4;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(4).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 5,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 5;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(5).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 6,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 6;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(6).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 7,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 7;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(7).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 8,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 8;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(8).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 9,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 9;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(9).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 10,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 10;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(10).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 11,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 11;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(11).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 12,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 12;
        //                     // Get the TH element of column then set real month
        //                     let table = $table.DataTable();
        //                     let thElement = $(table.column(12).header());
        //                     if (thElement[0].getAttribute('data-month')) {
        //                         month = parseInt(thElement[0].getAttribute('data-month'));
        //                     }
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_month']) {
        //                         let dataMonth = row?.['data_by_month'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataMonth[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataMonth[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataMonth[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //         ],
        //         drawCallback: function () {
        //             // mask money
        //             $.fn.initMaskMoney2();
        //             // change TH by months
        //             changeTHTableYearByMonths();
        //         },
        //     });
        // }

        // loadDbl();

        // month (by weeks)
        // function loadDblMonth(data) {
        //     $tableMonth.DataTableDefault({
        //         data: data ? data : [],
        //         ordering: false,
        //         paging: false,
        //         info: false,
        //         autoWidth: true,
        //         scrollX: true,
        //         columns: [  // 260, <7740> (8000p)
        //             {
        //                 targets: 0,
        //                 width: '7.5%',
        //                 render: (data, type, row) => {
        //                     return `<p class="table-row-type" data-type="${row?.['cashflow_type']}">${row?.['type_title'] ? row?.['type_title'] : ''}</p>`;
        //                 }
        //             },
        //             {
        //                 targets: 1,
        //                 width: '18.5%',
        //                 render: (data, type, row) => {
        //                     let month = 1;
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_week']) {
        //                         let dataWeek = row?.['data_by_week'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataWeek[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataWeek[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataWeek[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><div class="row"><input type="text" class="form-control mask-money table-row-value-estimate" data-month="${month}" value="${0}" data-return-type="number"></div></div>
        //                                     <div class="col-4 mt-2"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4 mt-2"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 2,
        //                 width: '18.5%',
        //                 render: (data, type, row) => {
        //                     let month = 2;
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_week']) {
        //                         let dataWeek = row?.['data_by_week'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataWeek[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataWeek[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataWeek[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 3,
        //                 width: '18.5%',
        //                 render: (data, type, row) => {
        //                     let month = 3;
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_week']) {
        //                         let dataWeek = row?.['data_by_week'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataWeek[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataWeek[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataWeek[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 4,
        //                 width: '18.5%',
        //                 render: (data, type, row) => {
        //                     let month = 4;
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_week']) {
        //                         let dataWeek = row?.['data_by_week'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataWeek[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataWeek[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataWeek[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 5,
        //                 width: '18.5%',
        //                 render: (data, type, row) => {
        //                     let month = 5;
        //                     let valueEstimate = 0;
        //                     if (row?.['data_by_week']) {
        //                         let dataWeek = row?.['data_by_week'];
        //                         if (row?.['cashflow_type'] === 2) {
        //                             valueEstimate = dataWeek[month]['value_estimate_sale'];
        //                         }
        //                         if (row?.['cashflow_type'] === 3) {
        //                             valueEstimate = dataWeek[month]['value_estimate_cost'];
        //                         }
        //                         if (row?.['cashflow_type'] === 4) {
        //                             valueEstimate = dataWeek[month]['value_estimate_net'];
        //                         }
        //                     }
        //                     if (row?.['cashflow_type'] !== 0) {
        //                         if (row?.['cashflow_type'] !== 1) {
        //                            return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                     <div class="col-4"><span class="mask-money" data-init-money="${0}"></span></div>
        //                                 </div>`;
        //                         } else {
        //                             return `<div class="row">
        //                                     <div class="col-4"><span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-actual" data-init-money="${0}" data-month="${month}"></span></div>
        //                                     <div class="col-4"><span class="mask-money table-row-value-variance" data-init-money="${0}" data-month="${month}"></span></div>
        //                                 </div>`;
        //                         }
        //                     } else {
        //                         return `<div class="row">
        //                                     <div class="col-4">${eleTrans.attr('data-estimate')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-actual')}</div>
        //                                     <div class="col-4">${eleTrans.attr('data-variance')}</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //         ],
        //         drawCallback: function () {
        //             // mask money
        //             $.fn.initMaskMoney2();
        //             // change TH by weeks
        //             changeTHTableMonthByWeeks();
        //         },
        //     });
        // }

        // loadDblMonth();















        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                ordering: false,
                paging: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [  // 280, <310x12=3720> (4000p)
                    {
                        targets: 0,
                        width: '7%',
                        render: (data, type, row) => {
                            return `<p class="table-row-type" data-type="${row?.['cashflow_type']}">${row?.['type_title'] ? row?.['type_title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 1;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(1).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<div class="row"><input type="text" class="form-control mask-money table-row-value-estimate" data-month="${month}" value="${0}" data-return-type="number"></div>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 2,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 2;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(2).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 3,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 3;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(3).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 4,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 4;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(4).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 5,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 5;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(5).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 6,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 6;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(6).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 7,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 7;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(7).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 8,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 8;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(8).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 9,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 9;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(9).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 10,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 10;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(10).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 11,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 11;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(11).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 12,
                        width: '7.75%',
                        render: (data, type, row) => {
                            let month = 12;
                            // Get the TH element of column then set real month
                            let table = $table.DataTable();
                            let thElement = $(table.column(12).header());
                            if (thElement[0].getAttribute('data-month')) {
                                month = parseInt(thElement[0].getAttribute('data-month'));
                            }
                            let valueEstimate = 0;
                            if (row?.['data_by_month']) {
                                let dataMonth = row?.['data_by_month'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataMonth[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataMonth[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataMonth[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    // change TH by months
                    changeTHTableYearByMonths();
                },
            });
        }

        function loadDblMonth(data) {
            $tableMonth.DataTableDefault({
                data: data ? data : [],
                ordering: false,
                paging: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [  // 260, <7740> (2000p)
                    {
                        targets: 0,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<p class="table-row-type" data-type="${row?.['cashflow_type']}">${row?.['type_title'] ? row?.['type_title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '17%',
                        render: (data, type, row) => {
                            let month = 1;
                            let valueEstimate = 0;
                            if (row?.['data_by_week']) {
                                let dataWeek = row?.['data_by_week'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataWeek[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataWeek[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataWeek[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<div class="row"><input type="text" class="form-control mask-money table-row-value-estimate" data-month="${month}" value="${0}" data-return-type="number"></div>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 2,
                        width: '17%',
                        render: (data, type, row) => {
                            let month = 2;
                            let valueEstimate = 0;
                            if (row?.['data_by_week']) {
                                let dataWeek = row?.['data_by_week'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataWeek[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataWeek[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataWeek[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 3,
                        width: '17%',
                        render: (data, type, row) => {
                            let month = 3;
                            let valueEstimate = 0;
                            if (row?.['data_by_week']) {
                                let dataWeek = row?.['data_by_week'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataWeek[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataWeek[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataWeek[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 4,
                        width: '17%',
                        render: (data, type, row) => {
                            let month = 4;
                            let valueEstimate = 0;
                            if (row?.['data_by_week']) {
                                let dataWeek = row?.['data_by_week'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataWeek[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataWeek[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataWeek[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                    {
                        targets: 5,
                        width: '17%',
                        render: (data, type, row) => {
                            let month = 5;
                            let valueEstimate = 0;
                            if (row?.['data_by_week']) {
                                let dataWeek = row?.['data_by_week'];
                                if (row?.['cashflow_type'] === 2) {
                                    valueEstimate = dataWeek[month]['value_estimate_sale'];
                                }
                                if (row?.['cashflow_type'] === 3) {
                                    valueEstimate = dataWeek[month]['value_estimate_cost'];
                                }
                                if (row?.['cashflow_type'] === 4) {
                                    valueEstimate = dataWeek[month]['value_estimate_net'];
                                }
                            }
                            if (row?.['cashflow_type'] !== 0) {
                                if (row?.['cashflow_type'] !== 1) {
                                   return `<span class="mask-money table-row-value-estimate" data-init-money="${valueEstimate}" data-month="${month}"></span>`;
                                } else {
                                    return `<span class="mask-money table-row-value-estimate" data-init-money="${0}" data-month="${month}"></span>`;
                                }
                            } else {
                                return `<div class="row">${eleTrans.attr('data-estimate')}</div>`;
                            }
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    // change TH by weeks
                    changeTHTableMonthByWeeks();
                },
            });
        }

        loadDblMonth();

        function setupDataLoadTable(dataList) {
            let result = [];
            let $eleTable = $table;
            // year data (by month)
            let dataByMonth = {
                1: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                2: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                3: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                4: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                5: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                6: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                7: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                8: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                9: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                10: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                11: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                12: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
            };
            // month data (by week)
            let dataByWeek = {
                1: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                2: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                3: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                4: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
                5: {'value_estimate_sale': 0, 'value_estimate_cost': 0, 'value_estimate_net': 0},
            };

            let year = boxYear.val();
            let month = boxMonth.val();
            if (year) {
                if (month) {  // month by weeks
                    eleYearArea[0].setAttribute('hidden', 'true');
                    eleMonthArea[0].removeAttribute('hidden');
                    $eleTable = $tableMonth;
                    $eleTable.DataTable().destroy();
                    loadDblMonth();
                    let weeksOfMonth = getWeeksOfMonth(parseInt(month), parseInt(year));
                    for (let data of dataList) {
                        if (data?.['due_date']) {
                            let date = data?.['due_date'];
                            for (let key in weeksOfMonth) {
                                let startDate = weeksOfMonth[key]?.['start_date'];
                                let endDate = weeksOfMonth[key]?.['end_date'];
                                let isInRange = isDateInRange(date, startDate, endDate);
                                if (isInRange === true) {
                                    if (dataByWeek.hasOwnProperty(key)) {
                                        dataByWeek[key]['value_estimate_sale'] += data?.['value_estimate_sale'];
                                        dataByWeek[key]['value_estimate_cost'] += data?.['value_estimate_cost'];
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    for (let keyWeek in dataByWeek) {
                        dataByWeek[keyWeek]['value_estimate_net'] = parseFloat(dataByWeek[keyWeek]['value_estimate_sale']) - parseFloat(dataByWeek[keyWeek]['value_estimate_cost']);
                    }
                } else {  // year by months
                    eleMonthArea[0].setAttribute('hidden', 'true');
                    eleYearArea[0].removeAttribute('hidden');
                    $eleTable.DataTable().destroy();
                    loadDbl();
                    for (let data of dataList) {
                        if (data?.['due_date']) {
                            let monthDueDate = getMonthFromDateStr(data?.['due_date']);
                            if (dataByMonth.hasOwnProperty(monthDueDate)) {
                                dataByMonth[monthDueDate]['value_estimate_sale'] += data?.['value_estimate_sale'];
                                dataByMonth[monthDueDate]['value_estimate_cost'] += data?.['value_estimate_cost'];
                            }
                        }
                    }
                    for (let keyMonth in dataByMonth) {
                        dataByMonth[keyMonth]['value_estimate_net'] = parseFloat(dataByMonth[keyMonth]['value_estimate_sale']) - parseFloat(dataByMonth[keyMonth]['value_estimate_cost']);
                    }
                }

            }
            let dataOperation = {
                'cashflow_type': 0,
                'type_title': eleTrans.attr('data-operation'),
            }
            let dataBBalance = {
                'cashflow_type': 1,
                'type_title': eleTrans.attr('data-beginning-balance'),
            }
            let dataSale = {
                'cashflow_type': 2,
                'type_title': eleTrans.attr('data-cash-sales'),
                'data_by_month': dataByMonth,
                'data_by_week': dataByWeek,
            }
            let dataCost = {
                'cashflow_type': 3,
                'type_title': eleTrans.attr('data-product-service-costs'),
                'data_by_month': dataByMonth,
                'data_by_week': dataByWeek,
            }
            let dataNet = {
                'cashflow_type': 4,
                'type_title': eleTrans.attr('data-net-cash-flow'),
                'data_by_month': dataByMonth,
                'data_by_week': dataByWeek,
            }
            let dataEBalance = {
                'cashflow_type': 5,
                'type_title': eleTrans.attr('data-ending-balance'),
            }
            result = [dataOperation, dataBBalance, dataSale, dataCost, dataNet, dataEBalance];


            $eleTable.DataTable().clear().draw();
            $eleTable.DataTable().rows.add(result).draw();
            // custom total row
            if ($eleTable.DataTable().data().count() !== 0) {
                let firstRow = $eleTable.DataTable().row(0).node();
                $(firstRow).css('background-color', '#ebf5f5');
                $(firstRow).css('color', '#007D88');
                for (let eleType of $eleTable[0].querySelectorAll('.table-row-type')) {
                    let row = eleType.closest('td');
                    $(row).css('background-color', '#ebf5f5');
                    $(row).css('color', '#007D88');
                    if (eleType.getAttribute('data-type')) {
                        if ([4, 5].includes(parseInt(eleType.getAttribute('data-type')))) {
                            $(row).css('text-align', 'right');
                        }
                    }
                }
            }

            // init money
            $.fn.initMaskMoney2();

            let eleTypeBegin = $eleTable[0].querySelector('.table-row-type[data-type="1"]');
            if (eleTypeBegin) {
                let eleEstimateBegin = eleTypeBegin.closest('tr').querySelector(`.table-row-value-estimate[data-month="1"]`);
                $(eleEstimateBegin).change();
            }
            return true;
        }

        function storeDataFiscalYear() {
            $.fn.callAjax2({
                    'url': eleFiscalYear.attr('data-url'),
                    'method': eleFiscalYear.attr('data-method'),
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('periods_list') && Array.isArray(data.periods_list)) {
                            eleFiscalYear.val(JSON.stringify(data.periods_list));
                            loadBoxYear();
                            loadBoxMonth();
                            let currentYear = new Date().getFullYear();
                            boxYear.val(currentYear).trigger('change');
                            loadDbl();

                            btnView.click();
                        }
                    }
                }
            )
        }

        function getFiscalYearEndDate(startDate) {
            let endDateFY = '';
            if (startDate) {
                let startDateFY = new Date(startDate);
                endDateFY = new Date(startDateFY);
                // Add 12 months to the start date
                endDateFY.setMonth(startDateFY.getMonth() + 12);
                // Subtract 1 day to get the last day of the fiscal year
                endDateFY.setDate(endDateFY.getDate() - 1);
                // Format the end date as 'YYYY-MM-DD'
                endDateFY = endDateFY.toISOString().slice(0, 10);
                return endDateFY;
            }
            return endDateFY;
        }

        function getAllMonthsFiscalYear() {
            let months = [];
            if (boxYear.val() && eleFiscalYear.val()) {
                let year = boxYear.val();
                let dataFiscalYear = JSON.parse(eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    for (let dataFY of dataFiscalYear) {
                        if (dataFY?.['fiscal_year'] === parseInt(year)) {
                            let startDateFY = new Date(dataFY?.['start_date']);
                            let currentDate = new Date(startDateFY);
                            // Loop for 12 months
                            for (let i = 0; i < 12; i++) {
                                let formattedMonth = currentDate.toISOString().slice(0, 7);
                                months.push(formattedMonth);
                                // Move to the next month
                                currentDate.setMonth(currentDate.getMonth() + 1);
                            }
                            break;
                        }
                    }

                }
            }
            return months;
        }

        function parseMonthJSON() {
            let result = [];
            let dataMonths = getAllMonthsFiscalYear();
            for (let monthYear of dataMonths) {
                const [year, month] = monthYear.split('-').map(Number);
                result.push({
                    year,
                    month,
                });
            }
            return result;
        }

        function formatDateYYYYMMDD(date) {
            // Format the date as 'YYYY-MM-DD'
            let year = date.getFullYear();
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function formatDateDDMMYYYY(date) {
            // Format date as DD/MM/YYYY
            let day = date.getDate().toString().padStart(2, '0');
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        function formatStartEndDate(startDate, endDate) {
            if (startDate && endDate) {
                startDate = startDate + ' 00:00:00';
                endDate = endDate + ' 23:59:59';
                return {startDate, endDate};
            }
            return {startDate: '', endDate: ''};
        }

        function getYearRange() {
            if (boxYear.val()) {
                let dataYear = SelectDDControl.get_data_from_idx(boxYear, boxYear.val());
                if (dataYear) {
                    let startDate = dataYear?.['start_date'];
                    let endDate = getFiscalYearEndDate(startDate);
                    let datesFormat = formatStartEndDate(startDate, endDate);
                    return {startDate: datesFormat?.['startDate'], endDate: datesFormat?.['endDate']};
                } else {
                    // Handle invalid input
                    console.error('Invalid year input');
                    return null;
                }
            }
            return null;
        }

        function getMonthRange(month, year) {
            // Ensure month is within valid range (1 to 12)
            if (month < 1 || month > 12) {
                throw new Error('Invalid month');
            }
            // Create the first day of the month
            let startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
            // Create the last day of the next month, then subtract one millisecond to get the last millisecond of the current month
            let endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
            // Format the dates
            let formattedStartDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
            let formattedEndDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
            return {startDate: formattedStartDate, endDate: formattedEndDate};
        }

        function getMonthFromDateStr(dateString) {
            let dateObject = new Date(dateString);
            return dateObject.getMonth() + 1;
        }

        function getWeeksOfMonth(month, year) {
            // Create a date object for the first day of the given month and year
            let firstDay = new Date(year, month - 1, 1);
            // Find the last day of the month
            let lastDay = new Date(year, month, 0);
            // Initialize the result object
            let weeks = {};
            // Loop through the days of the month
            let currentDay = firstDay;
            let weekIndex = 1;
            while (currentDay <= lastDay) {
                // Determine the start and end dates of the current week
                let startDate = new Date(currentDay);
                let endDate = new Date(currentDay);
                endDate.setDate(currentDay.getDate() + 6);
                // Format the dates as 'YYYY-MM-DD'
                let formattedStartDate = formatDateYYYYMMDD(startDate);
                let formattedEndDate = formatDateYYYYMMDD(endDate);
                let datesFormat = formatStartEndDate(formattedStartDate, formattedEndDate);
                // Add the week to the result object
                // weeks[`week${weekIndex}`] = {startDate: datesFormat?.['startDate'], endDate: datesFormat?.['endDate']};
                weeks[`${weekIndex}`] = {start_date: datesFormat?.['startDate'], end_date: datesFormat?.['endDate']};
                // Move to the next week
                currentDay.setDate(currentDay.getDate() + 7);
                weekIndex++;
            }
            return weeks;
        }

        function getWeeksOfMonthShow(month, year) {
            // Create a date object for the first day of the given month and year
            let firstDay = new Date(year, month - 1, 1);
            // Find the last day of the month
            let lastDay = new Date(year, month, 0);
            // Initialize the result object
            let weeks = {};
            // Loop through the days of the month
            let currentDay = firstDay;
            let weekIndex = 1;
            while (currentDay <= lastDay) {
                // Determine the start and end dates of the current week
                let startDate = new Date(currentDay);
                let endDate = new Date(currentDay);
                endDate.setDate(currentDay.getDate() + 6);
                // Format the dates as 'YYYY-MM-DD'
                let formattedStartDate = formatDateDDMMYYYY(startDate);
                let formattedEndDate = formatDateDDMMYYYY(endDate);
                // Add the week to the result object
                weeks[`${weekIndex}`] = {start_date: formattedStartDate, end_date: formattedEndDate};
                // Move to the next week
                currentDay.setDate(currentDay.getDate() + 7);
                weekIndex++;
            }
            return weeks;
        }

        function isDateInRange(date, startDate, endDate) {
            // Convert date strings to Date objects
            date = new Date(date);
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            // Check if the date is within the range
            return date >= startDate && date <= endDate;
        }

        function getAllMonthsOfFiscalYear(year) {
            let {startDate, endDate} = getYearRange(year);
            let startDateFM = new Date(startDate);
            let endDateFM = new Date(endDate);
            let result = [];
            let currentDate = new Date(startDateFM);
            // Loop until currentDate is less than or equal to endDate
            while (currentDate <= endDateFM) {
                result.push({
                    month: currentDate.getMonth() + 1, // Adding 1 because getMonth() returns zero-based month index
                    year: currentDate.getFullYear()
                });
                // Move currentDate to the next month
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            return result;
        }

        // LOAD BOXS DROPDOWN
        function loadBoxEmployee() {
            boxEmployee.empty();
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['group_id__in'] = boxGroup.val().join(',');
            }
            boxEmployee.initSelect2({
                'dataParams': dataParams,
                'allowClear': true,
            });
        }

        function loadBoxSO() {
            boxSO.empty();
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['employee_inherit__group_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            boxSO.initSelect2({
                'dataParams': dataParams,
                'allowClear': true,

            });
        }

        function loadBoxYear() {
            if (eleFiscalYear.val()) {
                let data = [];
                let dataFiscalYear = JSON.parse(eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    for (let fiscalYear of dataFiscalYear) {
                        data.push({
                            'id': String(fiscalYear?.['fiscal_year']),
                            'title': String(fiscalYear?.['fiscal_year']),
                            'start_date': String(fiscalYear?.['start_date']),
                        })
                    }
                    boxYear.empty();
                    boxYear.initSelect2({
                        data: data,
                        'allowClear': true,
                    });
                }
            }
        }

        function loadBoxMonth() {
            let data = [];
            let dataMonths = parseMonthJSON();
            for (let monthYear of dataMonths) {
                data.push({
                    'id': monthYear?.['month'],
                    'title': initDataMonth[monthYear?.['month'] - 1][1],
                    'month': monthYear?.['month'],
                    'year': monthYear?.['year'],
                })
            }
            data.push({
                'id': '',
                'title': 'Select...',
                'month': 0,
                'year': 0,
            })
            boxMonth.empty();
            boxMonth.initSelect2({
                data: data,
                'allowClear': true,
                templateResult: function (state) {
                    let groupHTML = `<span class="badge badge-soft-success ml-2">${state?.['data']?.['year'] ? state?.['data']?.['year'] : "_"}</span>`
                    return $(`<span>${state.text} ${groupHTML}</span>`);
                },
            });
        }

        // load init
        function initData() {
            boxGroup.initSelect2({'allowClear': true,});
            loadBoxEmployee();
            loadBoxSO();
            storeDataFiscalYear();
        }

        initData();


        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            }
        });
        $('input[type=text].date-picker').val(null).trigger('change');

        // mask money
        $.fn.initMaskMoney2();

        // Events
        boxGroup.on('change', function () {
            loadBoxEmployee();
            loadBoxSO();
            $table.DataTable().clear().draw();
        });

        boxEmployee.on('change', function () {
            loadBoxSO();
            $table.DataTable().clear().draw();
        });

        boxSO.on('change', function () {
            $table.DataTable().clear().draw();
        });

        boxYear.on('change', function () {
            loadBoxMonth();
        });

        $('input[type=radio].check-period').on('click', function () {
            for (let ele of this.closest('.area-period-all').querySelectorAll('.area-period-element')) {
                ele.setAttribute('disabled', 'true');
            }
            for (let ele of this.closest('.area-period').querySelectorAll('.area-period-element')) {
                ele.removeAttribute('disabled');
            }
        });

        $table.on('change', '.table-row-value-estimate', function () {
            let startValue = $(this).valCurrency();
            let startMonth = parseInt(this.getAttribute('data-month'));
            calculateIfChangeBeginning($table, startValue, startMonth);

            for (let month = (startMonth + 1); month <= 12; month++) {
                let eleTypeBegin = $table[0].querySelector('.table-row-type[data-type="1"]');
                if (eleTypeBegin) {
                    let eleEstimateBegin = eleTypeBegin.closest('tr').querySelector(`.table-row-value-estimate[data-month="${month}"]`);
                    if (eleEstimateBegin.getAttribute('data-init-money')) {
                        let value = parseFloat(eleEstimateBegin.getAttribute('data-init-money'));
                        calculateIfChangeBeginning($table, value, month);
                    }
                }
            }
            return true;
        });

        $tableMonth.on('change', '.table-row-value-estimate', function () {
            let startValue = $(this).valCurrency();
            let startMonth = parseInt(this.getAttribute('data-month'));
            calculateIfChangeBeginning($tableMonth, startValue, startMonth);

            for (let month = (startMonth + 1); month <= 5; month++) {
                let eleTypeBegin = $tableMonth[0].querySelector('.table-row-type[data-type="1"]');
                if (eleTypeBegin) {
                    let eleEstimateBegin = eleTypeBegin.closest('tr').querySelector(`.table-row-value-estimate[data-month="${month}"]`);
                    if (eleEstimateBegin.getAttribute('data-init-money')) {
                        let value = parseFloat(eleEstimateBegin.getAttribute('data-init-money'));
                        calculateIfChangeBeginning($tableMonth, value, month);
                    }
                }
            }
            return true;
        });

        function calculateIfChangeBeginning($eleTable, value, month) {
            let eleTypeNet = $eleTable[0].querySelector('.table-row-type[data-type="4"]');
            let eleTypeEnd = $eleTable[0].querySelector('.table-row-type[data-type="5"]');
            if (eleTypeNet && eleTypeEnd) {
                let eleEstimateNet = eleTypeNet.closest('tr').querySelector(`.table-row-value-estimate[data-month="${month}"]`);
                let eleEstimateEnd = eleTypeEnd.closest('tr').querySelector(`.table-row-value-estimate[data-month="${month}"]`);
                if (eleEstimateNet && eleEstimateEnd) {
                    if (eleEstimateNet.getAttribute('data-init-money')) {
                        let endValue = parseFloat(value) + parseFloat(eleEstimateNet.getAttribute('data-init-money'));
                        $(eleEstimateEnd).attr('data-init-money', String(endValue));
                        // set next beginning value
                        let eleTypeBegin = $eleTable[0].querySelector('.table-row-type[data-type="1"]');
                        if (eleTypeBegin) {
                            let eleEstimateBeginNext = eleTypeBegin.closest('tr').querySelector(`.table-row-value-estimate[data-month="${month + 1}"]`);
                            if (eleEstimateBeginNext) {
                                $(eleEstimateBeginNext).attr('data-init-money', String(endValue));
                            }
                        }
                    }
                }
            }
            // init money
            $.fn.initMaskMoney2();
            return true;
        }

        function changeTHTableMonthByWeeks() {
            let year = boxYear.val();
            let month = boxMonth.val();
            if (year && month) {
                if ($tableMonth[0].closest('.dataTables_scroll')) {
                    let tableMonthHd = $tableMonth[0].closest('.dataTables_scroll').querySelector('.dataTables_scrollHead');
                    if (tableMonthHd) {
                        let weeksOfMonthShow = getWeeksOfMonthShow(parseInt(month), parseInt(year));
                        for (let keyShow in weeksOfMonthShow) {
                            let classMap = '.week-' + keyShow;
                            if (tableMonthHd.querySelector(classMap)) {
                                tableMonthHd.querySelector(classMap).innerHTML = eleTrans.attr('data-week') + ' ' + keyShow + ' (' + String(weeksOfMonthShow[keyShow]?.['start_date']) + '-' + String(weeksOfMonthShow[keyShow]?.['end_date']) + ')';
                            }
                        }
                    }
                }
            }
            return true
        }

        function changeTHTableYearByMonths() {
            let year = boxYear.val();
            if (year) {
                let listMonths = getAllMonthsOfFiscalYear(parseInt(year));
                if ($table[0].closest('.dataTables_scroll')) {
                    let tableMonthHd = $table[0].closest('.dataTables_scroll').querySelector('.dataTables_scrollHead');
                    if (tableMonthHd) {
                        let listHead = tableMonthHd?.querySelectorAll('.header-custom');
                        if (listMonths.length === 12 && listHead.length === 12) {
                            for (let i = 0; i < listHead.length; i++) {
                                listHead[i].innerHTML = '';
                                listHead[i].innerHTML = initDataMonth[listMonths[i]?.['month'] - 1][1] + ' (' + String(listMonths[i]?.['year']) + ')';
                                listHead[i].setAttribute('data-month', listMonths[i]?.['month']);
                            }
                        }

                    }
                }
            }
            return true
        }

        btnView.on('click', function () {
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['group_inherit_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            if (boxSO.val()) {
                dataParams['sale_order_id'] = boxSO.val();
            }
            if (boxYear.val()) {
                let {startDate, endDate} = getYearRange(parseInt(boxYear.val()));
                dataParams['due_date__gte'] = startDate;
                dataParams['due_date__lte'] = endDate;
                if (boxMonth.val()) {
                    let {startDate, endDate} = getMonthRange(parseInt(boxMonth.val()), parseInt(boxYear.val()));
                    dataParams['due_date__gte'] = startDate;
                    dataParams['due_date__lte'] = endDate;
                }
            }
            $.fn.callAjax2({
                    'url': $table.attr('data-url'),
                    'method': $table.attr('data-method'),
                    'data': dataParams,
                    isLoading: true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('report_cashflow_list') && Array.isArray(data.report_cashflow_list)) {
                            setupDataLoadTable(data.report_cashflow_list);
                        }
                    }
                }
            )
        });


    });
});