
$(function () {
    $(document).ready(function () {

        function loadDbl() {
            let $table = $('#datable_goods_receipt_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('goods_receipt_list')) {
                            return resp.data['goods_receipt_list'] ? resp.data['goods_receipt_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columnDefs: [],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            let link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id']);
                            return `<a href="${link}" target="_blank" class="link-primary underline_hover"><span class="badge badge-soft-primary">${row?.['code']}</span></a>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            const link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" target="_blank" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            let status_data = {
                                "For purchase order": "badge badge-soft-warning",
                                "For inventory adjustment": "badge badge-soft-primary",
                                "For production": "badge badge-soft-info",
                            }
                            return `<span class="${status_data[row?.['goods_receipt_type']]}">${row?.['goods_receipt_type']}</span>`;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row?.['purchase_order']).length !== 0) {
                                ele = `<p>${row?.['purchase_order']?.['title']}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            let date_created = moment(row?.['date_created']).format('YYYY-MM-DD');
                            return `<p>${date_created}</p>`
                        }
                    },
                    {
                        targets: 5,
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
                        targets: 6,
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<div class="dropdown">
                                    <i class="far fa-window-maximize" aria-expanded="false" data-bs-toggle="dropdown"></i>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item" href="${link}">${$.fn.transEle.attr('data-change')}</a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="#">${$.fn.transEle.attr('data-cancel')}</a>
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