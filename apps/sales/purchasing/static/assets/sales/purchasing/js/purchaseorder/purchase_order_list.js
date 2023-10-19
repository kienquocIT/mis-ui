
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
                            return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-soft-primary">${row?.['code']}</span></a>`
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
                            let date_delivered = moment(row?.['date_delivered']).format('YYYY-MM-DD');
                            return `<p>${date_delivered}</p>`
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            let status_data = {
                                "Draft": "badge badge-soft-light",
                                "Created": "badge badge-soft-primary",
                                "Added": "badge badge-soft-info",
                                "Finish": "badge badge-soft-success",
                                "Cancel": "badge badge-soft-danger",
                            }
                            return `<span class="${status_data[row?.['system_status']]}">${row?.['system_status']}</span>`;
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            let status_data = {
                                "None": "badge badge-soft-light",
                                "Wait": "badge badge-soft-light",
                                "Partially received": "badge badge-soft-warning",
                                "Received": "badge badge-soft-success",
                            }
                            return `<span class="${status_data[row?.['receipt_status']]}">${row?.['receipt_status']}</span>`;
                        }
                    },
                    {
                        targets: 6,
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#purchase-order-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<div class="dropdown">
                                    <i class="far fa-window-maximize" aria-expanded="false" data-bs-toggle="dropdown"></i>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item" href="${link}">${transEle.attr('data-change')}</a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="#">${transEle.attr('data-cancel')}</a>
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