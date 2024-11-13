$(function () {
    $(document).ready(function () {

        let $trans = $('#app-trans-factory');
        let $urls = $('#app-urls-factory');

        let dataStatus = {
            0: $trans.attr('data-active'),
            1: $trans.attr('data-expired')
        };
        let dataPeriod = {
            1: $trans.attr('data-daily'),
            2: $trans.attr('data-weekly'),
            3: $trans.attr('data-monthly'),
            4: $trans.attr('data-yearly'),
        };
        let dataRepeat = {
            1: {},
            2: {},
            3: {},
            4: {},
        };
        let dataDateRecurrenceWeekly = {
            0: $trans.attr('data-sunday'),
            1: $trans.attr('data-monday'),
            2: $trans.attr('data-tuesday'),
            3: $trans.attr('data-wednesday'),
            4: $trans.attr('data-thursday'),
            5: $trans.attr('data-friday'),
            6: $trans.attr('data-saturday'),
        };
        let dataDateRecurrenceMonthly = {};

        function loadInitData() {
            for (let i = 1; i <= 6; i++) {
                dataRepeat[1][i] = `${i} ${$trans.attr('data-day')}`;
            }
            for (let i = 1; i <= 3; i++) {
                dataRepeat[2][i] = `${i} ${$trans.attr('data-week')}`;
            }
            for (let i = 1; i <= 11; i++) {
                dataRepeat[3][i] = `${i} ${$trans.attr('data-month')}`;
            }
            for (let i = 1; i <= 4; i++) {
                dataRepeat[4][i] = `${i} ${$trans.attr('data-year')}`;
            }



            for (let i = 1; i <= 31; i++) {
                dataDateRecurrenceMonthly[i] = `${$trans.attr('data-day')} ${i}`;
            }
            return dataDateRecurrenceMonthly;
        }

        function loadDbl() {
            let $table = $('#table_recurrence_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('recurrence_list')) {
                            return resp.data['recurrence_list'] ? resp.data['recurrence_list'] : []
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
                            let link = $urls.data('link-detail').format_url_with_uuid(row?.['id']);
                            if (row?.['code']) {
                                return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-primary">${row?.['code']}</span></a>`;
                            }
                            return `<a href="${link}" class="link-primary underline_hover">--</a>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '15%',
                        render: (data, type, row) => {
                            const link = $urls.data('link-detail').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 3,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="badge badge-light badge-outline mr-2">${row?.['application_data']?.['title_i18n']}</span><span>${row?.['doc_template_data']?.['title']}</span>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span>${dataPeriod[row?.['period']]}</span>`;
                        }
                    },
                    {
                        targets: 5,
                        className: 'action-center',
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span>${dataRepeat[row?.['period']][row?.['repeat']]}</span>`;
                        },
                    },
                    {
                        targets: 6,
                        className: 'action-center',
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['period'] === 1) {
                                if (row?.['date_daily']) {
                                    return `<span>${moment(data?.['date_daily']).format('DD/MM/YYYY')}</span>`;
                                }
                                return ``;
                            }
                            if (row?.['period'] === 2) {
                                return `<span>${dataDateRecurrenceWeekly[row?.['weekday']]}</span>`;
                            }
                            if (row?.['period'] === 3) {
                                return `<span>${dataDateRecurrenceMonthly[row?.['monthday']]}</span>`;
                            }
                            if (row?.['period'] === 4) {
                                if (row?.['date_yearly']) {
                                    return `<span>${moment(data?.['date_yearly']).format('DD/MM/YYYY')}</span>`;
                                }
                                return ``;
                            }
                        },
                    },
                    {
                        targets: 7,
                        className: 'action-center',
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['date_start']) {
                                return `<span>${moment(data?.['date_start']).format('DD/MM/YYYY')}</span>`;
                            }
                            return ``;
                        },
                    },
                    {
                        targets: 8,
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
                        targets: 9,
                        className: 'action-center',
                        width: '10%',
                        render: (data, type, row) => {
                            let badge = {0: 'success', 1: 'danger'};
                            return `<span class="badge badge-soft-${badge[row?.['recurrence_status']]}">${dataStatus[row?.['recurrence_status']]}</span>`;
                        },
                    },
                    {
                        targets: 10,
                        className: 'action-center',
                        width: '1%',
                        render: (data, type, row) => {
                            let link = $urls.data('link-update').format_url_with_uuid(row?.['id']);
                            let disabled = '';
                            if (row?.['recurrence_status'] === 1) {
                                disabled = 'disabled';
                            }
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item ${disabled}" href="${link}"><i class="dropdown-icon far fa-edit text-primary"></i><span>${$trans.attr('data-edit')}</span></a>
                                    </div>
                                </div>`;
                        },
                    }
                ],
                drawCallback: function () {},
            });
        }

        loadInitData();
        loadDbl();

    });
});