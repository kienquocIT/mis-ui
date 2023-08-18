$(document).ready(function () {
    function validBodyDataNewOrUpdate(bodyData) {
        if (bodyData.hasOwnProperty('title') && !bodyData['title']) {
            $.fn.notifyB({
                'title': $('label[for=inputTextUpdateTitle]').text(),
                'description': $.fn.transEle.attr('data-msgFieldRequired'),
            }, 'failure');
            return false;
        }
        if (bodyData.hasOwnProperty('code') && !bodyData['code']) {
            $.fn.notifyB({
                'title': $('label[for=inputTextUpdateCode]').text(),
                'description': $.fn.transEle.attr('data-msgFieldRequired'),
            }, 'failure');
            return false;
        }
        return true;
    }

    $(document).on('click', '.btn-edit-row', function (event) {
        let rowData = DTBControl.getRowData($(this));
        $('#idxObjectUpdateID').text(rowData?.['id']);
        $('#updateWareHouse').find('.title-warehouse-update').text(rowData?.['title']);
        $('#inputTextUpdateTitle').attr('value', rowData?.['title']).val(rowData?.['title']);
        $('#inputTextUpdateCode').val(rowData?.['code']);
        $('#inputTextUpdateRemarks').val(rowData?.['remarks']);
        $('#inputUpdateActive').prop('checked', rowData?.['is_active']);
        event.preventDefault();
    });

    $(document).on('click', '.btn-remove-row', function (event) {
        WindowControl.showLoading();
        let rowData = DTBControl.getRowData($(this));
        if (
            confirm(
                $('#msgConfirmDelete').text().format_by_idx(rowData?.['title'])
            )
        ) {
            let tbl = $('#dtbWareHouseList');
            $.fn.callAjax2({
                'url': SetupFormSubmit.getUrlDetailWithID(tbl.attr('data-url-remove'), rowData?.['id']),
                'method': 'DELETE',
            })
                .then(
                (resp)=>{
                    console.log(resp);
                    $.fn.switcherResp(resp);
                    if (resp.status === 204){
                        setTimeout(()=>{
                            window.location.reload();
                        }, 1000);
                    }
                },
                (errs)=>{
                    console.log(errs);
                    WindowControl.hideLoading();
                }
            )
        } else WindowControl.hideLoading();
        event.preventDefault();
    });

    $('#btnSubmitUpdateModal').click(function (event) {
        WindowControl.showLoading();
        let frm = new SetupFormSubmit($('#updateWareHouse'));
        let bodyData = {
            'title': $('#inputTextUpdateTitle').val(),
            'code': $('#inputTextUpdateCode').val(),
            'remarks': $('#inputTextUpdateRemarks').val(),
            'is_active': $('#inputUpdateActive').prop('checked')
        }
        if (!validBodyDataNewOrUpdate(bodyData)) {
            WindowControl.hideLoading();
            event.preventDefault();
            return;
        }
        $.fn.callAjax2({
            'url': frm.getUrlDetail($('#idxObjectUpdateID').text()),
            'method': frm.dataMethod,
            'data': bodyData,
        })
            .then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data?.['status'] === 200) {
                $.fn.notifyB({
                    'description': $.fn.transEle.attr('data-success'),
                }, 'success')
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }, (errs) => {
            WindowControl.hideLoading();
        })
    });

    $('#btnSubmitNewModal').click(function (event) {
        WindowControl.showLoading();
        let frm = new SetupFormSubmit($('#addWareHouse'));
        let bodyData = {
            'title': $('#inputTextNewTitle').val(),
            'code': $('#inputTextNewCode').val(),
            'remarks': $('#inputTextNewRemarks').val(),
            'is_active': $('#inputNewActive').prop('checked')
        }
        if (!validBodyDataNewOrUpdate(bodyData)) {
            WindowControl.hideLoading();
            event.preventDefault();
            return;
        }
        $.fn.callAjax2(
            {
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': bodyData,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data?.['status'] === 201) {
                    $.fn.notifyB({
                        'description': $.fn.transEle.attr('data-success'),
                    }, 'success')
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            },
            (errs) => {
                WindowControl.hideLoading();
            }
        )
    });

    function loadDbl() {
        let tbl = $('#dtbWareHouseList');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: 'data.warehouse_list',
            },
            columns: [
                {
                    orderable: false,
                    render: (data, type, row, meta) => {
                        return ''
                    },
                }, {
                    data: 'code',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary">{0}</span>`.format_by_idx(data);
                    },
                }, {
                    data: 'title',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return data;
                    },
                }, {
                    data: 'remarks',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<p class="wrap-text">{0}</p>`.format_by_idx(data);
                    },
                }, {
                    data: 'is_active',
                    render: (data, type, row) => {
                        return (`<div class="form-check form-switch mb-1"><input type="checkbox" class="form-check-input" {0} disabled></div>`).format_by_idx((data === true ? "checked" : ""))
                    },
                }, {
                    orderable: false,
                    className: 'action-center',
                    render: (data, type, row, meta) => {
                        let btnEdit = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-edit-row" data-bs-toggle="modal" data-bs-target="#updateWareHouse"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                        let btnRemove = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-remove-row" ><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        return `<div>` + btnEdit + btnRemove + `</div>`;
                    }
                }
            ]
        })
    }

    loadDbl();
});