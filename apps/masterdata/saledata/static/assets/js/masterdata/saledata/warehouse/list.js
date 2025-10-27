let urlEle = $('#url-factory');
$(document).ready(function () {
    function loadDbl() {
        let tbl = $('#dtbWareHouseList');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '64vh',
            scrollCollapse: true,
            fixedColumns: {
                leftColumns: 2
            },
            ajax: {
                url: frm.dataUrl + '?get_all=1',
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
                        const link = urlEle.attr('data-url-detail').replace('0', row?.['id']);
                        return `<a href="${link}" class="link-primary underline_hover fw-bold" title="${row?.['code']}">${row?.['code'] || '--'}</a>`;
                    },
                }, {
                    className: 'ellipsis-cell-lg w-40',
                    render: (data, type, row) => {
                        const link = urlEle.attr('data-url-detail').replace('0', row?.['id']);
                        return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a><br><p>${row?.['detail_address'] || ''}</p>`
                    },
                }, {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<p>${row?.['remarks'] || ''}</p>`;
                    },
                }, {
                    className: 'w-20',
                    render: (data, type, row) => {
                        let type_html = ''
                        if (row?.['is_dropship']) {
                            type_html += `<span>${$.fn.gettext('Dropship warehouse')}</span><br>`;
                        }
                        if (row?.['is_virtual']) {
                            type_html += `<span>${$.fn.gettext('Virtual warehouse')}</span>` + (row?.['use_for'] === 1 ? `<span class="ml-1">(${$.fn.gettext('Use for Equipment Loan')})</span>` : '') + `<br>`;
                        }
                        return type_html;
                    },
                }, {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return row?.['is_active'] ? `<span class="badge-indicator badge badge-indicator-xl bg-success"></span>` : `<span class="badge-indicator badge badge-indicator-xl bg-danger"></span>`
                    },
                },
            ]
        })
    }

    loadDbl();
});