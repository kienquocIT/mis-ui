$(document).ready(function () {
    function loadOpportunity(id) {
        let ele = $('#box-select-opportunity');
        $.fn.callAjax({
            'url': ele.data('select2-url'),
            'method': ele.data('method')
        }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_list')) {
                        data.opportunity_list.map(function (item) {
                            if (item.id === id) {
                                ele.append(`<option value="${item.id}" selected>${item.title}</option>`);
                            } else {
                                ele.append(`<option value="${item.id}">${item.title}</option>`);
                            }
                        })
                    }
                },
            )
    }

    $('#input-request-completed-date').daterangepicker({
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: false,
        drops: 'auto',
        minYear: 2000,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY-MM-DD'), 10) + 100
    });

    function loadPersonInCharge(list_id) {
        let ele = $('#box-select-person-in-charge');
        $.fn.callAjax2({
            'url': ele.data('select2-url'),
            'method': ele.data('method')
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    data.employee_list.map(function (item) {
                        if (list_id.includes(item.id)) {
                            ele.append(`<option value="${item.id}" selected>${item.full_name}</option>`);
                        } else {
                            ele.append(`<option value="${item.id}">${item.full_name}</option>`);
                        }
                    })
                }
            },
        )
    }

    const frmDetail = $('#frm-detail-opportunity-document');
    const pk = $.fn.getPkDetail();

    function loadDetail() {
        let url = frmDetail.data('url').format_url_with_uuid(pk);
        let method = 'GET';
        $.fn.callAjax2({
            'url': url,
            'method': method
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    loadOpportunity(data.opportunity_doc.opportunity);
                    loadPersonInCharge(data.opportunity_doc.person_in_charge);
                    $('#input-request-completed-date').val(data.opportunity_doc.request_completed_date.split(' ')[0]);
                    $('[name="subject"]').val(data.opportunity_doc.subject);
                    $('[name="kind_of_product"]').val(data.opportunity_doc.kind_of_product);
                    data.opportunity_doc.files.map(function (item) {
                        loadFile(item, data.opportunity_doc.data_documents);

                    })
                    // FileUtils.init($(`[name="attachments1"]`).siblings('button'), data.opportunity_doc.files[0]);
                }
            }
        )
    }

    loadDetail();

    function loadFile(file, data_documents) {
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
        FileUtils.init(ele_button, file);

        let doc_detail = data_documents.find(item => item.attachment === file.media_file_id);
        ele_last_doc.find('textarea').val(doc_detail.description);
    }

    // })
})