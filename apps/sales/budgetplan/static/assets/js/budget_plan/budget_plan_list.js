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
            WindowControl.showLoading();
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
                reloadCurrency: true,
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
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="badge badge-soft-primary w-70">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-45',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary" data-id="${row.id}" data-title="${row.title}" data-code="${row.code}"><b>${row.title}</b></span></a>`
                        }
                    },
                    {
                        data: 'period',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<span>${row.period_mapped.title}</span>`
                        }
                    },
                                        {
                        data: 'employee_created',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<span class="text-blue">${row.employee_created.full_name}</span>`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let parsedDate = new Date(row.date_created.split(' ')[0]);
                            let formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getFullYear()}`;
                            return `<span>${formattedDate}</span>`
                        }
                    },
                    {
                        data: 'is_lock',
                        className: 'wrap-text text-center w-10',
                        render: (data, type, row) => {
                            return `<span class="w-100 badge badge-soft-${row?.['is_lock'] ? 'danger' : 'success'}">${row?.['is_lock'] ? 'Lock' : 'Open'}</span>`
                        }
                    }
                ],
            });
        }
    }
    loadBudgetPlanList();
})
