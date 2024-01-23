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
                    setTimeout(()=>{
                        window.location.reload();
                    }, 1000);
                },
                (errs)=> {
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
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: 'data.warehouse_list',
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: (data, type, row, meta) => {
                        return ''
                    },
                }, {
                    data: 'code',
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        const link = urlEle.attr('data-url-detail').replace('0', row.id);
                        return `<a href="${link}"><span class="text-primary">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                    },
                }, {
                    data: 'title',
                    className: 'wrap-text w-30',
                    render: (data, type, row) => {
                        const link = urlEle.attr('data-url-detail').replace('0', row.id);
                        return `<a href="${link}"><span class="text-primary"><b>${row.title}</b></span></a>`
                    },
                }, {
                    data: 'remarks',
                    className: 'wrap-text w-20',
                    render: (data, type, row) => {
                        return `<p class="wrap-text">${data}</p>`;
                    },
                }, {
                    data: 'is_active',
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch mb-1"><input type="checkbox" class="form-check-input" ${(data === true ? "checked" : "")} disabled></div>`
                    },
                }, {
                    data: 'id',
                    className: 'action-center wrap-text w-15',
                    render: (data, type, row, meta) => {
                        return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-remove-row" ><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    }
                }
            ]
        })
    }

    loadDbl();
});