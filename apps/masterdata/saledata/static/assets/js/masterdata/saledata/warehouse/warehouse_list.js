$(document).ready(function () {
    function validBodyDataNewOrUpdate(bodyData) {
        if (bodyData.hasOwnProperty('title') && !bodyData['title']) {
            $.fn.notifyB({
                'title': $('label[for=inputTextUpdateTitle]').text(),
                'description': $('#msgFieldRequired').text()
            }, 'failure');
            return false;
        }
        if (bodyData.hasOwnProperty('code') && !bodyData['code']) {
            $.fn.notifyB({
                'title': $('label[for=inputTextUpdateCode]').text(),
                'description': $('#msgFieldRequired').text()
            }, 'failure');
            return false;
        }
        return true;
    }

    $(document).on('click', '.btn-edit-row', function (event) {
        let rowData = $(this).getRowData();
        $('#idxObjectUpdateID').text(rowData?.['id']);
        $('#updateWareHouse').find('.title-warehouse-update').text(rowData?.['title']);
        $('#inputTextUpdateTitle').attr('value', rowData?.['title']).val(rowData?.['title']);
        $('#inputTextUpdateCode').val(rowData?.['code']);
        $('#inputTextUpdateRemarks').val(rowData?.['remarks']);
        $('#inputUpdateActive').prop('checked', rowData?.['is_active']);
        event.preventDefault();
    });

    $(document).on('click', '.btn-remove-row', function (event) {
        $.fn.showLoading();
        let rowData = $(this).getRowData();
        if (
            confirm(
                $('#msgConfirmDelete').text().format_by_idx(rowData?.['title'])
            )
        ) {
            let tbl = $('#dtbWareHouseList');
            $.fn.callAjax(
                SetupFormSubmit.getUrlDetailWithID(tbl.attr('data-url-remove'), rowData?.['id']),
                'DELETE',
                {},
                $("input[name=csrfmiddlewaretoken]").val(),
            ).then(
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
                    $.fn.hideLoading();
                }
            )
        } else $.fn.hideLoading();
        event.preventDefault();
    });

    $('#btnSubmitUpdateModal').click(function (event) {
        $.fn.showLoading();
        let frm = new SetupFormSubmit($('#updateWareHouse'));
        let bodyData = {
            'title': $('#inputTextUpdateTitle').val(),
            'code': $('#inputTextUpdateCode').val(),
            'remarks': $('#inputTextUpdateRemarks').val(),
            'is_active': $('#inputUpdateActive').prop('checked')
        }
        if (!validBodyDataNewOrUpdate(bodyData)) {
            $.fn.hideLoading();
            event.preventDefault();
            return;
        }
        $.fn.callAjax(frm.getUrlDetail($('#idxObjectUpdateID').text()), frm.dataMethod, bodyData, $("input[name=csrfmiddlewaretoken]").val(),).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data?.['status'] === 200) {
                $.fn.notifyB({
                    'description': $('#msgSuccess').text(),
                }, 'success')
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }, (errs) => {
            $.fn.hideLoading();
        })
    });

    $('#btnSubmitNewModal').click(function (event) {
        $.fn.showLoading();
        let frm = new SetupFormSubmit($('#addWareHouse'));
        let bodyData = {
            'title': $('#inputTextNewTitle').val(),
            'code': $('#inputTextNewCode').val(),
            'remarks': $('#inputTextNewRemarks').val(),
            'is_active': $('#inputNewActive').prop('checked')
        }
        if (!validBodyDataNewOrUpdate(bodyData)) {
            $.fn.hideLoading();
            event.preventDefault();
            return;
        }
        $.fn.callAjax(
            frm.dataUrl,
            frm.dataMethod,
            bodyData,
            $("input[name=csrfmiddlewaretoken]").val(),
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data?.['status'] === 201) {
                    $.fn.notifyB({
                        'description': $('#msgSuccess').text(),
                    }, 'success')
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            },
            (errs) => {
                $.fn.hideLoading();
            }
        )
    });

    function loadDbl() {
        let tbl = $('#dtbWareHouseList');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTableDefault({
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('warehouse_list')) {
                        return resp.data['warehouse_list'] ? resp.data['warehouse_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columnDefs: [
                {
                    "width": "5%",
                    "targets": 0
                }, {
                    "width": "10%",
                    "targets": 1
                }, {
                    "width": "25%",
                    "targets": 2
                }, {
                    "width": "35%",
                    "targets": 3
                }, {
                    "width": "10%",
                    "targets": 4
                }, {
                    "width": "10%",
                    "targets": 5,
                }
            ],
            columns: [
                {
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