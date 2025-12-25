class AccountBalanceReportElements {
    constructor() {
        this.$tableReport = $('#ab_table_report');
        this.$accountTypeEle = $('#account_group_filter');
        this.$accountLevelEle = $('#account_level');
        this.$displayEle = $('#display_element');
        // this.$dateFilterEle = $('#at_date_filter');
        this.$applyFilterBtn = $('#apply_filter');
        this.$resetFilterBtn = $('#reset_filter');
    }
}
const pageElements = new AccountBalanceReportElements();

/**
 * Khai bao cac ham load data
 */
class AccountBalanceReportFunction {
    static calculateGroupBalance(rows) {
        let totalDebit = 0;
        let totalCredit = 0;
        rows.data().each(function (row) {
            totalDebit += parseFloat(row?.total_debit || 0);
            totalCredit += parseFloat(row?.total_credit || 0);
        });
        return {
            totalDebit: totalDebit,
            totalCredit: totalCredit,
            balance:  totalCredit - totalDebit
        };
    }

    static loadAccountBalanceList(account_type_list=[], levels=[], displayZeroValue='0') {
        if ($.fn.DataTable.isDataTable(pageElements.$tableReport)) {
            pageElements.$tableReport.DataTable().destroy();
        }
        let frm = new SetupFormSubmit(pageElements.$tableReport);
        pageElements.$tableReport.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '56vh',
            scrollCollapse: true,
            reloadCurrency: true,
            paging: false,
            ajax: {
                url: frm.dataUrl,
                type: 'GET',
                data: {
                    'acc_type__in': account_type_list.join(','),
                    'level__in': levels.join(',')
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let resultData = resp.data['chart_of_account_type_list'] ? resp.data['chart_of_account_type_list'] : [];

                        if (displayZeroValue === '1') {
                            resultData = resultData.filter(row => {
                                let balance = (row?.total_debit || 0) - (row?.total_credit || 0);
                                return balance !== 0;
                            });
                        }
                        return resultData;
                    }
                    return data;
                }
            },
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return "";
                    }
                },
                {
                    className: "w-15",
                    data: 'acc_code',
                    render: (data, type, row) => {
                        return `<span class="ml-${row?.['level'] * 3} fs-5 fw-bold">${data || ''}</span>`;
                    }
                },
                {
                    className: 'w-25',
                    data: 'acc_name',
                    render: (data, type, row) => {
                        let foreignName = row?.foreign_acc_name ? `<small class="text-muted d-block">${row?.foreign_acc_name}</small>` : '';
                        return `<div>${data || ''}${foreignName}</div>`;
                    }
                },
                {
                    className: 'w-10',
                    data: 'acc_type_name',
                    render: (data, type, row) => {
                        return `<span class="text-muted">${data || 'N/A'}</span>`;
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-15 text-right',
                    data: 'total_debit',
                    render: (data, type, row) => {
                        return `<span class="text-danger mask-money" data-init-money="${data || 0}"></span>`;
                    }
                },
                {
                    className: "w-15 text-right",
                    data: 'total_credit',
                    render: (data, type, row) => {
                        return `<span class="text-primary mask-money" data-init-money="${data || 0}"></span>`;
                    }
                },
                {
                    className: "w-15 text-right",
                    render: (data, type, row) => {
                        let balance = (row?.total_credit || 0) - (row?.total_debit || 0);
                        return `<strong><span class="mask-money" data-init-money="${balance}"></span></strong>`;
                    }
                }
            ],
            columnDefs: [{
                targets: [3],
                visible: false
            }],
            rowGroup: {
                dataSrc: 'acc_type_name',
                startRender: function (rows, group) {
                    let groupBalance = AccountBalanceReportFunction.calculateGroupBalance(rows);
                    return $(`
                        <tr class="group-header bg-primary-light-5">
                            <td colspan="7">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold fs-5">${group}</span>
                                    <span>
                                        <span class="mask-money fw-bold" data-init-money="${groupBalance?.balance || 0}"></span>
                                    </span>
                                </div>
                            </td>
                        </tr>`);
                }
            },
        });
    }

    static loadAccountType(element) {
        element.initSelect2({
            allowClear: true,
            placeholder: $.fn.gettext('Select account groups...'),
            ajax: {
                url: element.attr('data-url'),
                method: 'GET'
            },
            templateResult: function (state) {
                return $(`<span>${state.text || ''}</span>`);
            },
            keyResp: 'chart_of_account_group_list',
            keyId: 'acc_type',
            keyText: 'acc_type_name'
        });
    }
}

/**
 * Khai bao cac ham su kien
 */
class AccountBalanceReportEventHandler {
    static initPageEvent() {
        // event for button apply
        pageElements.$applyFilterBtn.on('click', function () {
            let selectedAccountGroupList = [];
            for (let i = 0; i < pageElements.$accountTypeEle.val().length; i++) {
                let selectedAccountType = SelectDDControl.get_data_from_idx(pageElements.$accountTypeEle, pageElements.$accountTypeEle.val()[i]);
                selectedAccountGroupList.push(selectedAccountType?.acc_type);
            }
            let levelValue = pageElements.$accountLevelEle.val();
            let displayZeroValue = pageElements.$displayEle.val();
            AccountBalanceReportFunction.loadAccountBalanceList(selectedAccountGroupList, levelValue, displayZeroValue);
        });

        // apply for button reset
        pageElements.$resetFilterBtn.on('click', function() {
            pageElements.$accountTypeEle.val(null).trigger('change');
            pageElements.$accountLevelEle.val(null).trigger('change');
            pageElements.$displayEle.val(null).trigger('change');

            // reload table
            AccountBalanceReportFunction.loadAccountBalanceList();
        });
    }
}

$(document).ready(function () {
    // initialize date
    $('.flat-picker').each(function () {
        DateTimeControl.initFlatPickrDate(this);
    });
    AccountBalanceReportFunction.loadAccountBalanceList();
    AccountBalanceReportFunction.loadAccountType(pageElements.$accountTypeEle);
    AccountBalanceReportEventHandler.initPageEvent();
});
