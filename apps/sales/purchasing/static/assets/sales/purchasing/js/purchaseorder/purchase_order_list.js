
$(function () {
    $(document).ready(function () {
        function loadDbl() {
            let $table = $('#table_purchase_order_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 2
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('purchase_order_list')) {
                            return resp.data['purchase_order_list'] ? resp.data['purchase_order_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-5',
                        render: (data, type, row) => {
                            let link = $('#purchase-order-link').data('link-update').format_url_with_uuid(row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-25',
                        render: (data, type, row) => {
                            const link = $('#purchase-order-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-25',
                        render: (data, type, row) => {
                            return `<span>${(row?.['supplier'] || {})?.['name'] || ''}</span>`;
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['delivered_date'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'w-10 text-center',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                    {
                        className: 'w-15 text-center',
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#gr_status').text())
                            let hidden = row?.['receipt_status'] === 3 ? '' : 'hidden';
                            return `<span>${sttTxt[row?.['receipt_status']][1]}</span><i class="far fa-check-circle text-success ml-2" ${hidden}></i>`;
                        }
                    },
                    {
                        targets: 7,
                        className: 'action-center',
                        width: '5%',
                        render: (data, type, row) => {
                            let link = $('#purchase-order-link').data('link-update').format_url_with_uuid(row?.['id']);
                            let disabled = '';
                            if ([2, 3, 4].includes(row?.['system_status'])) {
                                disabled = 'disabled';
                            }
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item ${disabled}" href="${link}"><i class="dropdown-icon far fa-edit"></i><span>${transEle.attr('data-edit')}</span></a>
                                    </div>
                                </div>`;
                        },
                    }
                ],
                drawCallback: function () {},
            });
        }

        loadDbl();

    });
});