$(document).ready(function () {
    let zoomConfigEle = $('#zoom_config')
    const zoom_config = zoomConfigEle.text() ? JSON.parse(zoomConfigEle.text()) : {};

    if (Object.keys(zoom_config).length !== 0) {
        $('#1-existing-config').prop('hidden', false)
    }

    function loadMeetingRoomList() {
        let tbl = $('#table-meeting-room');
        tbl.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTableDefault(
            {
                useDataServer: true,
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('meeting_room_list')) {
                            return resp.data['meeting_room_list'] ? resp.data['meeting_room_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'wrap-text w-5',
                        render: () => {
                            return '';
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-10',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                        }
                    },
                    {
                        data: 'name',
                        className: 'wrap-text w-20',
                        render: (data, type, row, meta) => {
                            return `<span class="text-muted">${row?.['title']}</span>`
                        }
                    },
                    {
                        data: 'description',
                        className: 'wrap-text w-30',
                        render: (data, type, row, meta) => {
                            return `<span class="text-muted">${row?.['description']}</span>`
                        }
                    },
                    {
                        data: 'location',
                        className: 'wrap-text w-30',
                        render: (data, type, row, meta) => {
                            return `<span class="text-primary"><i class="bi bi-geo-alt-fill"></i> ${row?.['location']}</span>`
                        }
                    },
                    {
                        className: 'wrap-text w-5 text-center',
                        render: (data, type, row, meta) => {
                            return `<button data-id="${row?.['id']}" data-title="${row?.['title']}" data-code="${row?.['code']}" data-location="${row?.['location']}" data-des="${row?.['description']}"
                                            class="btn btn-icon btn-rounded btn-flush-primary edit-meeting-room" type="button" data-bs-toggle="modal" data-bs-target="#updateMeetingRoomModal">
                                        <span class="icon"><i class="bi bi-pencil-square"></i></span>
                                    </button>`
                        }
                    }
                ],
            },
        );
    }
    loadMeetingRoomList()

    function combinesDataCreateMeetingRoom(frmEle, for_update=false, pk) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = frmEle.find('#room-title').val();
        frm.dataForm['code'] = frmEle.find('#room-code').val();
        frm.dataForm['location'] = frmEle.find('#room-location').val();
        frm.dataForm['description'] = frmEle.find('#room-description').val();

        console.log(frm.dataForm)
        if (for_update) {
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    function combinesDataCreateMeetingZoomConfig(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['account_email'] = $('#zoom-account-email').val();
        frm.dataForm['account_id'] = $('#zoom-account-id').val();
        frm.dataForm['client_id'] = $('#zoom-client-id').val();
        frm.dataForm['client_secret'] = $('#zoom-client-secret').val();
        frm.dataForm['personal_meeting_id'] = $('#zoom-personal-meeting-id').val();

        console.log(frm.dataForm)
        if (for_update) {
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-create-meeting-room').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataCreateMeetingRoom($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    $('#form-update-meeting-room').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataCreateMeetingRoom($(this), true, $(this).attr('data-current-id'));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    $('#form-create-zoom-config').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataCreateMeetingZoomConfig($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    $('.nav-item').on('click', function () {
        $('#save-zoom-cfg-btn').prop('hidden', $(this).find('a').attr('href') !== '#tab_block_meeting_zoom_setting')
    })

    $(document).on("click", '.edit-meeting-room', function () {
        let update_frm = $('#form-update-meeting-room')
        update_frm.attr('data-current-id', $(this).attr('data-id'))
        update_frm.find('#room-title').val($(this).attr('data-title'))
        update_frm.find('#room-code').val($(this).attr('data-code'))
        update_frm.find('#room-location').val($(this).attr('data-location'))
        update_frm.find('#room-description').val($(this).attr('data-des'))
    })
});