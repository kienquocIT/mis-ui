$(document).ready(function () {
    function loadMeetingScheduleList() {
        if (!$.fn.DataTable.isDataTable('#meeting-schedule-list')) {
            let dtb = $('#meeting-schedule-list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            console.log(resp.data['meeting_schedule_list'])
                            return resp.data['meeting_schedule_list'] ? resp.data['meeting_schedule_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary"><b>${row?.['title']}</b></span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'meeting_type',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (!row?.['meeting_type']) {
                                return 'Online meeting'
                            }
                            else {
                                return 'Offline meeting'
                            }
                        }
                    },
                    {
                        data: 'date_occur',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<i class="bi bi-calendar2"></i> ${row?.['date_occur']}`
                        }
                    },
                    {
                        data: 'meeting_duration',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const trans_script = $('#translate-script')
                            let hour = parseInt(row?.['meeting_duration']/60)
                            let min = parseInt(row?.['meeting_duration']%60)
                            if (hour === 0) {
                                return `<i class="bi bi-clock-history"></i> ${min}${trans_script.attr('data-m')}`
                            }
                            else {
                                if (min === 0) {
                                    return `<i class="bi bi-clock-history"></i> ${hour}${trans_script.attr('data-h')}`
                                }
                                else {
                                    return `<i class="bi bi-clock-history"></i> ${hour}${trans_script.attr('data-h')} ${min}${trans_script.attr('data-m')}`
                                }
                            }
                        }
                    },
                ],
            });
        }
    }

    loadMeetingScheduleList();
})
