$(document).ready(function () {
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
                    let detail = data?.['opportunity_doc'];
                    DocumentLoadPage.loadOpportunity(detail.opportunity);
                    DocumentLoadPage.loadPersonInCharge(detail.person_in_charge)
                    $('#input-request-completed-date').val(detail?.['request_completed_date'].split(' ')[0]);
                    $('[name="title"]').val(detail.title);
                    $('[name="description"]').val(detail?.['description']);
                    detail.files.map(function (item) {
                        loadFile(item, detail.data_documents);
                    })
                }
            }
        )
    }

    loadDetail();

    function loadFile(file, data_documents) {
        appendFileEle(file, data_documents, 'detail');
    }

    // })
})