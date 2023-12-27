$(document).ready(function () {
    let zoomConfigEle = $('#zoom_config')
    const zoom_config = zoomConfigEle.text() ? JSON.parse(zoomConfigEle.text()) : {};

    function loadZoomConfigData() {
        if (Object.keys(zoom_config).length !== 0) {
            $('#zoom-account-email').val(zoom_config?.['account_email']);
            $('#zoom-account-id').val(zoom_config?.['account_id']);
            $('#zoom-client-id').val(zoom_config?.['client_id']);
            $('#zoom-client-secret').val(zoom_config?.['client_secret']);
            $('#zoom-personal-meeting-id').val(zoom_config?.['personal_meeting_id'])
        }
    }
    loadZoomConfigData()

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
                        data: 'name',
                        className: 'wrap-text w-20',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-primary">${row.title}</span>`
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-15',
                        render: (data, type, row, meta) => {
                            return `<b class="text-primary">${row.code}</b>`
                        }
                    },
                    {
                        data: 'location',
                        className: 'wrap-text w-25',
                        render: (data, type, row, meta) => {
                            return `<span class="initial-wrap">${row.location}</span>`
                        }
                    },
                    {
                        data: 'description',
                        className: 'wrap-text w-25',
                        render: (data, type, row, meta) => {
                            return `<span class="initial-wrap">${row.description}</span>`
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row, meta) => {
                            return ``
                        }
                    }
                ],
            },
        );
    }
    loadMeetingRoomList()

    function combinesDataCreateMeetingRoom(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#room-title').val();
        frm.dataForm['code'] = $('#room-code').val();
        frm.dataForm['location'] = $('#room-location').val();
        frm.dataForm['description'] = $('#room-description').val();

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
                                WindowControl.hideLoading();
                                loadMeetingRoomList()
                                $('input').val('');
                                $('textarea').val('');
                                // window.location.replace($(this).attr('data-url-redirect'));
                                // location.reload.bind(location);
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
                                WindowControl.hideLoading();
                                loadMeetingRoomList()
                                // window.location.replace($(this).attr('data-url-redirect'));
                                // location.reload.bind(location);
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

    $('#zoom-app-instruction-hidden-btn').on('click', function () {
        let zoom_app_instruction = $('#zoom-app-instruction')
        zoom_app_instruction.prop('hidden', !zoom_app_instruction.prop('hidden'))
    })
});