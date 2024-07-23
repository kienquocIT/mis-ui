
$(function () {
    $(document).ready(function () {

        let transEle = $('#app-trans-factory');

        function loadDbl() {
            let $table = $('#table_quotation_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
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
                autoWidth: true,
                scrollX: true,
                pageLength:50,
                columns: [  // (1280p)
                    {
                        targets: 0,
                        width: '5%',
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-update').format_url_with_uuid(row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-primary">${row?.['code']}</span></a>`
                        }
                    },
                    {
                        targets: 1,
                        width: '20%',
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 2,
                        width: '20%',
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row?.['customer']).length !== 0) {
                                ele = `<p>${row?.['customer']?.['title']}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 3,
                        width: '15%',
                        render: (data, type, row) => {
                            if (Object.keys(row?.['sale_person']).length !== 0) {
                                return `<p>${row?.['sale_person']?.['full_name']}</p>`;
                            }
                            return `<p></p>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '10%',
                        data: "date_created",
                        render: (data) => {
                            return $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                            });
                        }
                    },
                    {
                        targets: 5,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['indicator_revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '10%',
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#stt_sys').text())
                            let sttData = [
                                "light",
                                "primary",
                                "info",
                                "success",
                                "danger",
                            ]
                            return `<span class="badge badge-soft-${sttData[row?.['system_status']]}">${sttTxt[row?.['system_status']][1]}</span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '5%',
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-update').format_url_with_uuid(row?.['id']);
                            let isEdit = ``;
                            if (![2, 3, 4].includes(row?.['system_status'])) {
                                isEdit = `<a class="dropdown-item" href="${link}"><i class="dropdown-icon far fa-edit text-primary"></i><span>${transEle.attr('data-change')}</span></a>`;
                            }
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        ${isEdit}
                                    </div>
                                </div>`;
                        },
                    }
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
        }

        loadDbl();

    });
});