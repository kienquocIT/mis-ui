let urlEle = $('#url-factory');
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
                        return `<a href="{0}"><span class="badge badge-soft-primary">{1}</span></a>`.format_by_idx(
                            urlEle.data('url-detail').format_url_with_uuid(row.id),data
                        );
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
                    data: 'id',
                    // orderable: false,
                    className: 'action-center',
                    render: (data, type, row, meta) => {
                        let btnEdit = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" href="${urlEle.data('url-update').format_url_with_uuid(data)}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                        let btnRemove = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-remove-row" ><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        return `<div>` + btnEdit + btnRemove + `</div>`;
                    }
                }
            ]
        })
    }

    loadDbl();
});