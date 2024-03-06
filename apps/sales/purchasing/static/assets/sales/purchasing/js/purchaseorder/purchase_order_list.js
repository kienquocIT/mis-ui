
$(function () {
    $(document).ready(function () {

        let transEle = $('#app-trans-factory');

        function loadDbl() {
            let $table = $('#table_purchase_order_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
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
                columnDefs: [],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            let link = $('#purchase-order-link').data('link-update').format_url_with_uuid(row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-primary">${row?.['code']}</span></a>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            const link = $('#purchase-order-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row?.['supplier']).length !== 0) {
                                ele = `<p>${row?.['supplier']?.['name']}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            if (row?.['delivered_date']) {
                                return `<p>${moment(row?.['delivered_date']).format('DD/MM/YYYY')}</p>`;
                            }
                            return `<p></p>`;
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#stt_sys').text())
                            let sttData = [
                                "soft-light",
                                "soft-primary",
                                "soft-info",
                                "soft-success",
                                "soft-danger",
                            ]
                            return `<span class="badge badge-${sttData[row?.['system_status']]}">${sttTxt[row?.['system_status']][1]}</span>`;
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#gr_status').text())
                            let sttData = [
                                "soft-light",
                                "soft-warning",
                                "soft-info text-sky",
                                "soft-success",
                            ]
                            return `<span class="badge badge-${sttData[row?.['receipt_status']]}">${sttTxt[row?.['receipt_status']][1]}</span>`;
                        }
                    },
                    {
                        targets: 6,
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#purchase-order-link').data('link-update').format_url_with_uuid(row?.['id']);
                            let isChange = ``;
                            if (![2, 3].includes(row?.['system_status'])) {
                                isChange = `<a class="dropdown-item" href="${link}">${transEle.attr('data-change')}</a><div class="dropdown-divider"></div>`;
                            }
                            return `<div class="dropdown">
                                    <i class="far fa-window-maximize" aria-expanded="false" data-bs-toggle="dropdown"></i>
                                    <div role="menu" class="dropdown-menu">
                                        ${isChange}
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