let empSelectEle = $('#box-select-employee');

class PurchaseRequestConfigLoadPage {
    static loadEmployeeSelectEle(data) {
        empSelectEle.initSelect2({
            data: data
        })
    }

    static loadDetail(frm_detail) {
        let frm = new SetupFormSubmit(frm_detail);
        $.fn.callAjax2({
            'url': frm.dataUrl,
            'method': frm.dataMethod,
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let detail = data?.['config'];
                let list_emp = [];
                detail?.['employee_reference'].map(function (item) {
                    list_emp.push(item.employee);
                })
                this.loadEmployeeSelectEle(list_emp);
            }
        })
    }
}


$(document).ready(function () {
    let frm_detail = $('#frm-config-detail');
    PurchaseRequestConfigLoadPage.loadDetail(frm_detail);

    new SetupFormSubmit(frm_detail).validate({
            rules: {
                employee_reference: {
                    required: true,
                },
            },
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                let list_data = [];
                empSelectEle.find('option:selected').each(function () {
                    list_data.push({
                        'employee': $(this).val(),
                    })
                })
                $.fn.callAjax2({
                    url: frm.dataUrl,
                    method: 'PUT',
                    data: {'employee_reference': list_data}
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);
                        }
                    }, (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            }
        })

})