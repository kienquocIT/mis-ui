$(document).ready(function () {
    ExpenseItemLoadPage.loadMainDtbList();
    ExpenseItemLoadPage.loadParentSelectEle($('#select-box-expense-parent'));
    const frm_create = $('#frm-create');
    SetupFormSubmit.validate(
        frm_create,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                $.fn.callAjax2({
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success');
                            setTimeout(function () {
                                window.location.reload()
                            }, 1500)
                        }
                    }, (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            }
        })

    $(document).on('click', '.btn-collapse-expense-child', function () {
        let trEle = $(this).closest('tr');
        let iconEle = $(this).find('.icon-collapse-expense-child');
        iconEle.toggleClass('fa-caret-right').toggleClass('fa-caret-down');

        if (iconEle.hasClass('fa-caret-right')) {
            ExpenseItemLoadPage.hiddenColChild(trEle, iconEle);
        }

        if (iconEle.hasClass('fa-caret-down')) {
            ExpenseItemLoadPage.showColChild($(this), trEle, iconEle)
        }
    })


    $(document).on('click', '.btn-detail', function () {
        ExpenseItemLoadPage.loadDetail($(this).data('id'));
    })

    const frm_detail = $('#frm-detail');
    SetupFormSubmit.validate(
        frm_detail,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                let frm_data = ExpenseItemLoadPage.getDataUpdate();
                $.fn.callAjax2({
                    url: frm.dataUrl.format_url_with_uuid(colId.val()),
                    method: frm.dataMethod,
                    data: frm_data
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success');
                            setTimeout(function () {
                                window.location.reload()
                            }, 1500)
                        }
                    }, (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            }
        })

    $('#modalDetail input, #modalDetail select, #modalDetail textarea').on('change', function () {
        $(this).addClass('tag-changed');
    })
})