$(document).ready(function () {
    const searchParams = new URLSearchParams(window.location.search);
    const opportunityParam = JSON.parse(decodeURIComponent(searchParams.get('opportunity')));

    if (opportunityParam !== null) {
        DocumentLoadPage.loadOpportunity(opportunityParam);
        DocumentLoadPage.opportunitySelectEle.attr('disabled', true);
    } else {
        DocumentLoadPage.loadOpportunity();
    }

    DocumentLoadPage.loadPersonInCharge();


    $('#input-request-completed-date').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'auto',
        minYear: 2000,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY-MM-DD'), 10) + 100
    });


    $(document).on('click', '#btn-add-document', function () {
        appendFileEle(null, null, 'create');
    })

    let frmCreate = $('#frm-create-opportunity-document')
    new SetupFormSubmit(frmCreate).validate({
        rules: {
            opportunity: {
                required: true,
            },
            subject: {
                required: true,
            },
            kind_of_product: {
                required: true,
            },
            request_completed_date: {
                required: true,
            },
            person_in_charge: {
                required: true,
            }
        },
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                frm.dataForm['opportunity'] = $('#box-select-opportunity').val();
                frm.dataForm['person_in_charge'] = $('#box-select-person-in-charge').val();
                let list_doc = [];
                let cnt = 1;
                $('.document-content .sub-document').each(function () {
                    list_doc.push(
                        {
                            'attachment': $(this).find(`[name="attachments${cnt}"]`).val(),
                            'description': $(this).find('textarea').val(),
                        }
                    )
                    cnt += 1;
                })
                frm.dataForm['data_documents'] = list_doc;

                $.fn.callAjax2({
                    'url': frm.dataUrl,
                    'method': frm.dataMethod,
                    'data': frm.dataForm,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000)
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            }
        })

    $(document).on('click', '.btn-del-doc', function () {
        $(this).closest('.sub-document').remove();
    })

})