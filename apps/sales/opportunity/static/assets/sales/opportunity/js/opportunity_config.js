$(document).ready(function () {
    const frmDetail = $('#frm-detail-opportunity-config');

    function loadFactorTable() {
        if (!$.fn.DataTable.isDataTable('#table-opportunity-customer-decision-factor')) {
            let $table = $('#table-opportunity-customer-decision-factor')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);

                        if (data && resp.data.hasOwnProperty('opportunity_decision_factor')) {
                            return resp.data['opportunity_decision_factor'] ? resp.data['opportunity_decision_factor'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columnDefs: [],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        className: 'text-center',
                        render: (data, type, row) => {
                            return `<p>${row.title}</p>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<a class="btn btn-icon btn-del-factor" data-id="${row.id}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`
                        }
                    },
                ],
            });
        }
    }

    function loadDetail() {
        let url = frmDetail.data('url');
        let method = 'GET';
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#opportunity_config_id').attr('value', data.id);
                    $('#is-select-stage')[0].checked = data.is_select_stage;
                    $('#is-input-win-rate')[0].checked = data.is_input_win_rate;
                    loadFactorTable();
                }
            }
        )
    }

    loadDetail();

    // Update Opportunity config
    frmDetail.submit(function (event) {
        event.preventDefault();
        let frm = new SetupFormSubmit($(this));
        let csr = $("[name=csrfmiddlewaretoken]").val();
        $.fn.showLoading();
        frm.dataForm['is_select_stage'] = $('#is-select-stage')[0].checked;
        frm.dataForm['is_input_win_rate'] = $('#is-input-win-rate')[0].checked;
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: 'Successfully'}, 'success')
                        $.fn.redirectUrl(window.location, 1000);
                    }
                },
                (errs) => {
                    console.log(errs)
                }
            )
    })


    // Create + Delete Customer Decision Factor
    const frmCreateFactor = $('#frm-create-factor')
    frmCreateFactor.submit(function (event) {
        event.preventDefault();
        let csr = $("[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: 'Successfully'}, 'success')
                        $.fn.redirectUrl(window.location, 1000);
                    }
                },
                (errs) => {
                    console.log(errs)
                }
            )
    })

    $(document).on('click', '.btn-del-factor', function () {
        let rowData = $(this).getRowData();
        console.log(rowData)
        if (
            confirm(
                $('#msgConfirmDeleteFactor').text().format_by_idx(rowData?.['title'])
            )
        ) {
            let table = $('#table-opportunity-customer-decision-factor');
            let url = table.data('url-detail').format_url_with_uuid($(this).data('id'));
            let method = 'DELETE';
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(url, method, {}, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: 'Successfully'}, 'success')
                            $.fn.redirectUrl(window.location, 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        }
    })
})