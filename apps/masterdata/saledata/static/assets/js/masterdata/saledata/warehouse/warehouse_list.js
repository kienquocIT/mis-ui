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
                    className: 'w-5',
                    render: () => {
                        return ''
                    },
                }, {
                    data: 'code',
                    className: 'ellipsis-cell-xs w-10',
                    render: (data, type, row) => {
                        const link = urlEle.attr('data-url-detail').replace('0', row.id);
                        return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                    },
                }, {
                    data: 'title',
                    className: 'w-25',
                    render: (data, type, row) => {
                        const link = urlEle.attr('data-url-detail').replace('0', row.id);
                        return `<a href="${link}"><span class="text-primary"><b>${row.title}</b></span></a>`
                    },
                }, {
                    data: 'remarks',
                    className: 'w-25',
                    render: (data) => {
                        return `<p class="">${data}</p>`;
                    },
                }, {
                    data: 'is_dropship',
                    className: 'text-center w-10',
                    render: (data) => {
                        return data ? `<i class="fa-solid fa-check"></i>` : '';
                    },
                }, {
                    data: 'is_virtual',
                    className: 'text-center w-10',
                    render: (data) => {
                        return data ? `<i class="fa-solid fa-check"></i>` : '';
                    },
                }, {
                    data: 'is_active',
                    className: 'text-center w-10',
                    render: (data) => {
                        return `<div class="form-check form-switch mb-1"><input type="checkbox" class="form-check-input" ${(data === true ? "checked" : "")} disabled></div>`
                    },
                },
                // {
                //     data: 'id',
                //     className: 'text-right w-5',
                //     render: () => {
                //         return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-remove-row" ><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                //     }
                // }
            ]
        })
    }

    loadDbl();
});