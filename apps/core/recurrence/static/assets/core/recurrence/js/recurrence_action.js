$(function () {
    $(document).ready(function () {
        let $table = $('#table_recurrence_action')
        let frm = new SetupFormSubmit($table);

        let $trans = $('#app-trans-factory');
        let $urls = $('#app-urls-factory');

        let dataStatus = {
            0: $trans.attr('data-wait'),
            1: $trans.attr('data-done'),
            2: $trans.attr('data-skip'),
        };
        let dataPeriod = {
            1: $trans.attr('data-daily'),
            2: $trans.attr('data-weekly'),
            3: $trans.attr('data-monthly'),
            4: $trans.attr('data-yearly'),
        };

        function getCurrentDate() {
            let currentDate = new Date();
            let day = String(currentDate.getDate()).padStart(2, '0');
            let month = String(currentDate.getMonth() + 1).padStart(2, '0');
            let year = currentDate.getFullYear();
            return `${year}-${month}-${day}`;
        }

        function loadDbl() {
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    data: {'date_next': getCurrentDate()},
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('recurrence_action')) {
                            return resp.data['recurrence_action'] ? resp.data['recurrence_action'] : []
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
                        width: '5%',
                        render: (data, type, row) => {
                            return `<span class="badge badge-primary">${row?.['recurrence']?.['code'] ? row?.['recurrence']?.['code'] : ""}</span>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '15%',
                        render: (data, type, row) => {
                            return `${row?.['recurrence']?.['title'] ? row?.['recurrence']?.['title'] : ""}`;
                        }
                    },
                    {
                        targets: 3,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="badge badge-light badge-outline mr-2">${row?.['recurrence']?.['application_data']?.['title_i18n']}</span><span>${row?.['recurrence']?.['doc_template_data']?.['title']}</span>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '10%',
                        render: (data, type, row) => {
                            return `${row?.['employee_inherit']?.['full_name'] ? row?.['employee_inherit']?.['full_name'] : ""}`;
                        }
                    },
                    {
                        targets: 5,
                        className: 'action-center',
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['date_next']) {
                                return `<span>${moment(data?.['date_next']).format('DD/MM/YYYY')}</span>`;
                            }
                            return ``;
                        },
                    },
                    {
                        targets: 6,
                        className: 'action-center',
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['date_next'] && row?.['recurrence']?.['next_recurrences']) {
                                let target = row?.['date_next'];
                                let isCurrent = false;
                                for (let date of row?.['recurrence']?.['next_recurrences']) {
                                    if (isCurrent === true) {
                                        target = date;
                                        break;
                                    }
                                    if (date === row?.['date_next']) {
                                        isCurrent = true;
                                    }
                                }
                                return `<span>${moment(target).format('DD/MM/YYYY')}</span>`;
                            }
                            return ``;
                        },
                    },
                    {
                        targets: 7,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span>${dataPeriod[row?.['recurrence']?.['period']]}</span>`;
                        }
                    },
                    {
                        targets: 8,
                        className: 'action-center',
                        width: '10%',
                        render: (data, type, row) => {
                            let badge = {0: 'light', 1: 'success', 2: 'warning'};
                            return `<span class="badge badge-${badge[row?.['recurrence_action']]} badge-outline">${dataStatus[row?.['recurrence_action']]}</span>`;
                        },
                    },
                    {
                        targets: 9,
                        className: 'action-center',
                        width: '5%',
                        render: (data, type, row) => {
                            if ([1, 2].includes(row?.['recurrence_action'])) {
                                return ``;
                            }
                            return `<div class="d-flex justify-content-center">
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-action" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${$trans.attr('data-done')}" data-id="${row?.['id']}" data-action="1"><span class="icon"><i class="fas fa-check"></i></span></button>
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-action" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${$trans.attr('data-skip')}" data-id="${row?.['id']}" data-action="2"><span class="icon"><i class="fas fa-step-forward"></i></span></button>
                                    </div>`;
                        },
                    }
                ],
                drawCallback: function () {},
            });
        }

        function actionHandler(ele) {
            if ($(ele).attr('data-id') && $(ele).attr('data-action')) {
                WindowControl.showLoading();
                $.fn.callAjax2(
                    {
                        'url': $urls.attr('data-link-detail').format_url_with_uuid($(ele).attr('data-id')),
                        'method': "PUT",
                        'data': {'recurrence_action': parseInt($(ele).attr('data-action'))},
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && (data['status'] === 201 || data['status'] === 200)) {
                            $.fn.notifyB({description: data.message}, 'success');
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        }
                    }, (err) => {
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000)
                        $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                    }
                )
            }
            return true;
        }

        $table.on('click', '.btn-action', function () {
            actionHandler(this);
        });

        loadDbl();

    });
});