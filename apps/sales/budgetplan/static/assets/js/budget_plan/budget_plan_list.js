$(document).ready(function () {
    const budgetPlanTitleEle = $('#budget-plan-title')
    const budgetPlanPeriodEle = $('#budget-plan-period')
    function LoadPeriod(data) {
        budgetPlanPeriodEle.initSelect2({
            ajax: {
                url: budgetPlanPeriodEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    LoadPeriod()

    function combinesDataCreate(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = budgetPlanTitleEle.val()
        frm.dataForm['period_mapped'] = budgetPlanPeriodEle.val()
        frm.dataForm['monthly'] = true
        frm.dataForm['quarterly'] = false
        frm.dataForm['auto_sum_target'] = true

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-create-budget-plan').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataCreate($(this));
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    function loadBudgetPlanList() {
        if (!$.fn.DataTable.isDataTable('#budget-plan-list-table')) {
            let dtb = $('#budget-plan-list-table');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: 1
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            console.log(resp.data['budget_plan_list'])
                            return resp.data['budget_plan_list'] ? resp.data['budget_plan_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-5',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-35',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<span>${row?.['period_mapped']?.['title']}</span>`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return `<span>${row?.['employee_created']?.['full_name']}</span>`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return `<span class="${row?.['is_lock'] ? 'text-danger' : 'text-success'}">${row?.['is_lock'] ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>'}</span>`
                        }
                    }
                ],
            });
        }
    }
    loadBudgetPlanList();
})
