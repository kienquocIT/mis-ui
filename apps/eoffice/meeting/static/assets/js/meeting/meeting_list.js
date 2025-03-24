$(document).ready(function () {
    const trans_script = $('#translate-script')

    function loadMeetingScheduleList() {
        if (!$.fn.DataTable.isDataTable('#meeting-schedule-list')) {
            let dtb = $('#meeting-schedule-list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['meeting_schedule_list'] ? resp.data['meeting_schedule_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'wrap-text w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-35',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary"><b>${row?.['title']}</b></span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'meeting_type',
                        className: 'wrap-text w-10 text-center',
                        render: (data, type, row) => {
                            if (!row?.['meeting_type']) {
                                return `<span class="text-muted"><i class="fas fa-video"></i></span>`
                            }
                            else {
                                return `<span class="text-muted"><i class="fas fa-users"></i></span>`
                            }
                        }
                    },
                    {
                        data: 'room_info',
                        className: 'wrap-text w-20 text-center',
                        render: (data, type, row) => {
                            return `${row?.['room_info']?.['title'] || '--'}`
                        }
                    },
                    {
                        data: 'date_occur',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return moment(row?.['date_occur'], 'YYYY-MM-DD hh:mm A').format('DD/MM/YYYY hh:mm A')
                        }
                    },
                    {
                        data: 'meeting_duration',
                        className: 'wrap-text w-15 text-right',
                        render: (data, type, row) => {
                            let hour = parseInt(row?.['meeting_duration']/60)
                            let min = parseInt(row?.['meeting_duration']%60)
                            if (hour === 0) {
                                return `<i class="bi bi-clock-history"></i> ${min} ${trans_script.attr('data-minute')}`
                            }
                            else {
                                if (min === 0) {
                                    return `<i class="bi bi-clock-history"></i> ${hour} ${trans_script.attr('data-hour')}`
                                }
                                else {
                                    return `<i class="bi bi-clock-history"></i> ${hour} ${trans_script.attr('data-hour')} ${min} ${trans_script.attr('data-minute')}`
                                }
                            }
                        }
                    },
                    // {
                    //     data: 'system_status',
                    //     className: 'wrap-text w-10 text-center',
                    //     render: (row) => {
                    //         const status_data = [
                    //             {txt: "Draft", cls: "soft-light"},
                    //             {txt: "Created", cls: "soft-primary"},
                    //             {txt: "Added", cls: "soft-info"},
                    //             {txt: "Finish", cls: "soft-success"},
                    //             {txt: "Cancel", cls: "soft-danger"},
                    //         ]
                    //         return `<span class="badge badge-${status_data[row]['cls']}">${status_data[row]['txt']}</span>`;
                    //     }
                    // },
                ],
            });
        }
    }

    loadMeetingScheduleList();
})
