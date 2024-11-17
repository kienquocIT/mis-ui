let urlEle = $('#url-factory');
$(document).ready(function () {
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
                    render: () => {
                        return ''
                    },
                }, {
                    data: 'code',
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        const link = urlEle.attr('data-url-detail').replace('0', row.id);
                        return `<a href="${link}"><span class="badge badge-primary w-70">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                    },
                }, {
                    data: 'title',
                    className: 'wrap-text w-25',
                    render: (data, type, row) => {
                        const link = urlEle.attr('data-url-detail').replace('0', row.id);
                        return `<a href="${link}"><span class="text-primary"><b>${row.title}</b></span></a>`
                    },
                }, {
                    data: 'remarks',
                    className: 'wrap-text w-30',
                    render: (data) => {
                        return `<p class="wrap-text">${data}</p>`;
                    },
                }, {
                    data: 'is_dropship',
                    className: 'text-center wrap-text w-10',
                    render: (data) => {
                        return data ? `<i class="text-primary bi bi-check-square-fill"></i>` : '';
                    },
                }, {
                    data: 'is_active',
                    className: 'text-center wrap-text w-10',
                    render: (data) => {
                        return `<div class="form-check form-switch mb-1"><input type="checkbox" class="form-check-input" ${(data === true ? "checked" : "")} disabled></div>`
                    },
                }, {
                    data: 'id',
                    className: 'text-right wrap-text w-5',
                    render: () => {
                        return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-remove-row" ><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    }
                }
            ]
        })
    }

    loadDbl();
});