$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-cashflow-group');
        let boxEmployee = $('#box-report-cashflow-employee');
        let boxSO = $('#box-report-cashflow-so');
        let boxYear = $('#box-report-cashflow-year');
        let boxMonth = $('#box-report-cashflow-month');
        let boxFrom = $('#report-cashflow-date-from');
        let boxTo = $('#report-cashflow-date-to');
        let eleAreaPeriodAll = $('#area-period-all');
        let eleFiscalYear = $('#data-fiscal-year');
        let btnView = $('#btn-view');
        let $table = $('#table_report_cashflow_list');
        let dataQuarter = JSON.parse($('#filter_quarter').text());
        let dataMonth = JSON.parse($('#filter_month').text());

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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 2,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 2;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 3,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 3;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 4,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 4;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 5,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 5;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 6,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 6;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 7,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 7;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 8,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 8;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 9,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 9;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 10,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 10;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 11,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 11;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //             {
        //                 targets: 12,
        //                 width: '8.06%',
        //                 render: (data, type, row) => {
        //                     let month = 12;
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
        //                                     <div class="col-4">Estimate</div>
        //                                     <div class="col-4">Actual</div>
        //                                     <div class="col-4">Variance</div>
        //                                 </div>`;
        //                     }
        //                 }
        //             },
        //         ],
        //         drawCallback: function () {
        //             // mask money
        //             $.fn.initMaskMoney2();
        //         },
        //     });
        // }

        // loadDbl();




        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                ordering: false,
                paging: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [  // 260, <7740> (2000p)
                    {
                        targets: 0,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<p class="table-row-type" data-type="${row?.['cashflow_type']}">${row?.['type_title'] ? row?.['type_title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 1;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 2,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 2;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 3,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 3;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 4,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 4;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 5,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 5;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 6,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 6;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 7,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 7;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 8,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 8;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 9,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 9;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 10,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 10;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 11,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 11;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                    {
                        targets: 12,
                        width: '7.5%',
                        render: (data, type, row) => {
                            let month = 12;
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
                                return `<div class="row">Estimate</div>`;
                            }
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
        }
        loadDbl();

        function setupDataLoadTable(dataList) {
            let result = [];
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
            let dataOperation = {
                'cashflow_type': 0,
                'type_title': 'Operation'
            }
            let dataBBalance = {
                'cashflow_type': 1,
                'type_title': 'Beginning balance'
            }
            let dataSale = {
                'cashflow_type': 2,
                'type_title': 'Cash sales',
                'data_by_month': dataByMonth,
            }
            let dataCost = {
                'cashflow_type': 3,
                'type_title': 'Product/ service costs',
                'data_by_month': dataByMonth,
            }
            let dataNet = {
                'cashflow_type': 4,
                'type_title': 'Net cash flow',
                'data_by_month': dataByMonth,
            }
            let dataEBalance = {
                'cashflow_type': 5,
                'type_title': 'Ending balance',
            }
            result = [dataOperation, dataBBalance, dataSale, dataCost, dataNet, dataEBalance];

            $table.DataTable().clear().draw();
            $table.DataTable().rows.add(result).draw();
            // custom total row
            if ($table.DataTable().data().count() !== 0) {
                let firstRow = $table.DataTable().row(0).node();
                $(firstRow).css('background-color', '#ebf5f5');
                $(firstRow).css('color', '#007D88');
                for (let eleType of $table[0].querySelectorAll('.table-row-type')) {
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

        function getQuarterRange(quarter) {
            if (eleFiscalYear.val()) {
                let dataFiscalYear = JSON.parse(eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    let startDateFY = dataFiscalYear[0]?.['start_date'];
                    let dateObject = new Date(startDateFY);
                    let year = dateObject.getFullYear();
                    let month = dateObject.getMonth() + 1;
                    // Ensure quarter is within valid range (1 to 4)
                    if (quarter < 1 || quarter > 4) {
                        throw new Error('Invalid quarter');
                    }
                    // Calculate the start and end months of the quarter
                    let startMonth = (quarter - 1) * 3 + month;
                    let endMonth = startMonth + 2;
                    // Create the first day of the quarter
                    let startDate = new Date(Date.UTC(year, startMonth - 1, 1, 0, 0, 0));
                    // Create the last day of the quarter, then subtract one millisecond to get the last millisecond of the last day
                    let endDate = new Date(Date.UTC(year, endMonth, 0, 23, 59, 59, 999));
                    // Format the dates
                    let formattedStartDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
                    let formattedEndDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
                    return {startDate: formattedStartDate, endDate: formattedEndDate};
                }
            }
        }

        function getDateFrom() {
            let formattedStartDate = boxFrom.val();
            formattedStartDate = convertDateFormat(formattedStartDate);
            return formattedStartDate;
        }

        function getDateTo() {
            let formattedEndDate = boxTo.val();
            formattedEndDate = convertDateFormat(formattedEndDate);
            return formattedEndDate;
        }

        function convertDateFormat(inputDate) {
            // Split the input date string into day, month, and year
            let parts = inputDate.split('/');
            // Create a new Date object using the parts (month is 0-based, so subtract 1)
            let dateObject = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
            // Format the date to 'YYYY-MM-DD HH:mm:ss'
            return dateObject.toISOString().slice(0, 19).replace('T', ' ');
        }

        function getMonthFromDateStr(dateString) {
            let dateObject = new Date(dateString);
            return dateObject.getMonth() + 1;
        }

        function loadBoxEmployee() {
            boxEmployee.empty();
            if (boxGroup.val()) {
                boxEmployee.initSelect2({
                    'dataParams': {'group_id__in': boxGroup.val().join(',')},
                    'allowClear': true,
                });
            } else {
                boxEmployee.initSelect2({
                    'allowClear': true,
                });
            }
        }

        function loadBoxSO() {
            boxSO.empty();
            if (boxGroup.val()) {
                boxSO.initSelect2({
                    'dataParams': {'employee_inherit__group_id__in': boxGroup.val().join(',')},
                    'allowClear': true,
                });
            } else {
                boxSO.initSelect2({
                    'allowClear': true,
                });
            }
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
                    'title': dataMonth[monthYear?.['month'] - 1][1],
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
        boxGroup.initSelect2({'allowClear': true,});
        loadBoxEmployee();
        loadBoxSO();
        storeDataFiscalYear();

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
            $table.DataTable().clear().draw();
        });

        boxEmployee.on('change', function () {
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
            calculateIfChangeBeginning(startValue, startMonth);

            for (let month = (startMonth + 1); month <= 12; month++) {
                let eleTypeBegin = $table[0].querySelector('.table-row-type[data-type="1"]');
                if (eleTypeBegin) {
                    let eleEstimateBegin = eleTypeBegin.closest('tr').querySelector(`.table-row-value-estimate[data-month="${month}"]`);
                    if (eleEstimateBegin.getAttribute('data-init-money')) {
                        let value = parseFloat(eleEstimateBegin.getAttribute('data-init-money'));
                        calculateIfChangeBeginning(value, month);
                    }
                }
            }
            return true;
        });

        function calculateIfChangeBeginning(value, month) {
            let eleTypeNet = $table[0].querySelector('.table-row-type[data-type="4"]');
            let eleTypeEnd = $table[0].querySelector('.table-row-type[data-type="5"]');
            if (eleTypeNet && eleTypeEnd) {
                let eleEstimateNet = eleTypeNet.closest('tr').querySelector(`.table-row-value-estimate[data-month="${month}"]`);
                let eleEstimateEnd = eleTypeEnd.closest('tr').querySelector(`.table-row-value-estimate[data-month="${month}"]`);
                if (eleEstimateNet && eleEstimateEnd) {
                    if (eleEstimateNet.getAttribute('data-init-money')) {
                        let endValue = parseFloat(value) + parseFloat(eleEstimateNet.getAttribute('data-init-money'));
                        $(eleEstimateEnd).attr('data-init-money', String(endValue));
                        // set next beginning value
                        let eleTypeBegin = $table[0].querySelector('.table-row-type[data-type="1"]');
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
                            let eleTypeBegin = $table[0].querySelector('.table-row-type[data-type="1"]');
                            if (eleTypeBegin) {
                                let eleEstimateBegin = eleTypeBegin.closest('tr').querySelector(`.table-row-value-estimate[data-month="1"]`);
                                $(eleEstimateBegin).change();
                            }
                        }
                    }
                }
            )
        });


    });
});