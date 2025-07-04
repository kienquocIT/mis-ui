$(document).ready(function () {
    function loadShiftList() {
        let tbl = $('#tbl_shift');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy();
        tbl.DataTableDefault({
            userDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('shift_list')) {
                        return resp.data['shift_list'] ?? [];
                    }
                    throw Error('Call data raise errors.');
                }
            },
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return ""
                    }
                },
                {
                    data: 'code',
                    className: 'w-20',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                    }
                },
                {
                    data: 'name',
                    className: 'w-20',
                    render: (data, type, row, meta) => {
                        return `<span class="text-muted">${row?.['title']}</span>`
                    }
                },
                {
                    data: 'description',
                    className: 'w-40',
                    render: (data, type, row, meta) => {
                        return `<span class="text-muted">${row?.['description']}</span>`
                    }
                },
                {
                    className: 'w-15 text-center',
                    render: (data, type, row, meta) => {
                        return `<a 
                                   data-id="${row?.['id']}" 
                                   data-title="${row?.['title']}" 
                                   data-checkin-time="${row?.['checkin_time']?.slice(0, 5)}" 
                                   data-checkin-gr-start="${row?.['checkin_gr_start'].slice(0, 5)}"
                                   data-checkin-gr-end="${row?.['checkin_gr_end'].slice(0, 5)}" 
                                   data-checkin-threshold="${row?.['checkin_threshold']}" 
                                   data-breakin-time="${row?.['break_in_time'].slice(0, 5)}" 
                                   data-breakin-gr-start="${row?.['break_in_gr_start'].slice(0, 5)}"
                                   data-breakin-gr-end="${row?.['break_in_gr_end'].slice(0, 5)}" 
                                   data-breakin-threshold="${row?.['break_in_threshold']}"
                                   data-breakout-time="${row?.['break_out_time'].slice(0, 5)}" 
                                   data-breakout-gr-start="${row?.['break_out_gr_start'].slice(0, 5)}"
                                   data-breakout-gr-end="${row?.['break_out_gr_end'].slice(0, 5)}" 
                                   data-breakout-threshold="${row?.['break_out_threshold']}"
                                   data-checkout-time="${row?.['checkout_time'].slice(0, 5)}" 
                                   data-checkout-gr-start="${row?.['checkout_gr_start'].slice(0, 5)}"
                                   data-checkout-gr-end="${row?.['checkout_gr_end'].slice(0, 5)}" 
                                   data-checkout-threshold="${row?.['checkout_threshold']}"
                                   data-working-day-list="${JSON.stringify(row?.['working_day_list'] || [])}"
                                   data-bs-toggle="modal" data-bs-target="#ShiftModal"
                                   class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-shift">
                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                               </a>`
                    }
                }
            ]
        });
    }

    loadShiftList();
})