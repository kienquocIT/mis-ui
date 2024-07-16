const budgetPlanPeriodEle = $('#budget-plan-period')
const trans_script = $('#trans-url')

function getMonthOrder(space_month) {
    for (let i = 0; i < 12; i++) {
        let trans_order = i+1+space_month
        if (trans_order > 12) {
            trans_order -= 12
        }
        $(`#m${i+1}th`).text(trans_script.attr(`data-trans-m${trans_order}th`))
    }
}

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
    }).on('change', function () {
        let selected_option = SelectDDControl.get_data_from_idx(budgetPlanPeriodEle, budgetPlanPeriodEle.val())
        if (selected_option) {
            getMonthOrder(selected_option['space_month'])
        }
    })
}

class BudgetPlanHandle {
    load() {
        LoadPeriod()
    }

    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#budget-plan-name').val();

        // console.log(frm.dataForm)
        if (for_update) {
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail-api').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}
