$(document).ready(function () {
    const searchParams = new URLSearchParams(window.location.search);
    const opportunityParam = searchParams.get("opportunity");

    function loadOpportunity(opportunityParam) {
        let ele = $('#box-select-opportunity');
        $.fn.callAjax(ele.data('url'), ele.data('method'))
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_list')) {
                        data.opportunity_list.map(function (item) {
                            if (item.id === opportunityParam) {
                                ele.append(`<option value="${item.id}" selected>${item.title}</option>`);
                                ele.prop('disabled', true);
                            } else {
                                ele.append(`<option value="${item.id}">${item.title}</option>`);
                            }
                        })
                    }
                },
            )
    }

    loadOpportunity(opportunityParam);

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

    function loadPersonInCharge() {
        let ele = $('#box-select-person-in-charge');
        $.fn.callAjax(ele.data('url'), ele.data('method'))
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                        data.employee_list.map(function (item) {
                            ele.append(`<option value="${item.id}">${item.full_name}</option>`);
                        })
                    }
                },
            )
    }

    loadPersonInCharge();

    $(document).on('click', '#btn-add-document', function () {
        let html = $('.document-hidden').html();
        let ele_doc = $('.document-content');
        ele_doc.append(html);
        let ele_sub_doc = ele_doc.find('.sub-document');
        let ele_last_doc = ele_sub_doc.last();
        let ele_button = ele_last_doc.find('button')
        ele_button.addClass('btn-file-upload');
        ele_button.attr('data-f-input-name', 'attachments' + ele_sub_doc.length.toString())
        ele_button.attr('data-f-name-ele-id', '#documentDisplay' + ele_sub_doc.length.toString());
        ele_last_doc.find('p').attr('id', 'documentDisplay' + ele_sub_doc.length.toString());
        FileUtils.init(ele_button);
    })

    let frmCreate = $('#frm-create-opportunity-document')
    frmCreate.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['person_in_charge'] = $('#box-select-person-in-charge').val();
        let list_doc = []
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

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                    }
                },
                (errs) => {
                    $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    })

    $(document).on('click', '.btn-del-doc', function () {
        $(this).closest('.sub-document').remove();
    })

})