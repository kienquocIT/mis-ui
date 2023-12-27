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
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary">${row.title}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'meeting_type',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (!row.meeting_type) {
                                return 'Online meeting'
                            }
                            else {
                                return 'Offline meeting'
                            }
                        }
                    },
                ],
            });
        }
    }

    loadMeetingScheduleList();
})
