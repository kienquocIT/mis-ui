"use strict";
$(function () {
    $(document).ready(function () {

        function loadDbl() {
            let $table = $('#table_quotation_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('quotation_list')) {
                            return resp.data['quotation_list'] ? resp.data['quotation_list'] : []
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
                        targets: 0,
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-update').format_url_with_uuid(row.id)
                            return `<a href="${link}" target="_blank" class="link-primary underline_hover">${row.code}</a>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-update').format_url_with_uuid(row.id)
                            return `<a href="${link}" target="_blank" class="link-primary underline_hover">${row.title}</a>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<p>${row.customer.title}</p>`
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            return `<p>${row.sale_person.full_name}</p>`
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            let date_created = moment(row.date_created).format('YYYY-MM-DD');
                            return `<p>${date_created}</p>`
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row.total_product)}"></span>`
                        }
                    },
                    {
                        targets: 6,
                        render: (data, type, row) => {
                            return `<p>${row.system_status}</p>`
                        }
                    },
                    {
                        targets: 7,
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-update').format_url_with_uuid(row.id)
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
                drawCallback: function (row, data) {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
        }

        loadDbl();

        $('#search_input').on('keyup', function (evt) {
            const keycode = evt.which;
            if (keycode === 13) //enter to search
                _dataTable.ajax.reload()
        });

    });
});