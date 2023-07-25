$(document).ready(function () {
    function loadOpportunity() {
        let ele = $('#box-select-opportunity');
        $.fn.callAjax(ele.data('url'), ele.data('method'))
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_list')) {
                        data.opportunity_list.map(function (item) {
                            ele.append(`<option value="${item.id}">${item.title}</option>`);
                        })
                    }
                },
            )
    }

    loadOpportunity();

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

    let frmCreate = $('#frm-create-opportunity-document')
    frmCreate.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['person_in_charge'] = $('#box-select-person-in-charge').val();
        let list_doc = []
        $('.sub-document').each(function (){
            list_doc.push(
                {
                    'attachment': $(this).find('[name="attachments"]').val(),
                    'description': $(this).find('textarea').val(),
                }
            )
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
})