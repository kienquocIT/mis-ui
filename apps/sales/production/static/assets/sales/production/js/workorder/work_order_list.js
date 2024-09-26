$(function () {
    $(document).ready(function () {

        let transEle = $('#app-trans-factory');
        let urlsEle = $('#app-urls-factory');

        function loadDbl() {
            let $table = $('#table_work_order_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('work_order_list')) {
                            return resp.data['work_order_list'] ? resp.data['work_order_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                pageLength:50,
                columns: [
                    {
                        targets: 0,
                        width: '1%',
                        render: (data, type, row, meta) => {
                            return `<span class="table-row-order">${(meta.row + 1)}</span>`
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            let link = urlsEle.data('link-detail').format_url_with_uuid(row?.['id']);
                            if (row?.['code']) {
                                return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-primary">${row?.['code']}</span></a>`;
                            }
                            return `<a href="${link}" class="link-primary underline_hover">--</a>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '25%',
                        render: (data, type, row) => {
                            const link = urlsEle.data('link-detail').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 3,
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
                        targets: 4,
                        className: 'action-center',
                        width: '5%',
                        render: (data, type, row) => {
                            let link = urlsEle.data('link-update').format_url_with_uuid(row?.['id']);
                            let disabled = '';
                            if ([2, 3, 4].includes(row?.['system_status'])) {
                                disabled = 'disabled';
                            }
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item ${disabled}" href="${link}"><i class="dropdown-icon far fa-edit text-primary"></i><span>${transEle.attr('data-edit')}</span></a>
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