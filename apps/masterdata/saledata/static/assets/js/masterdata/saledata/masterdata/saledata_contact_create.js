$(document).ready(function () {
    // load Data
    function loadSalutation() {
        if (!$.fn.DataTable.isDataTable('#datatable_salutation_list')) {
            let tbl = $('#datatable_salutation_list');
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
                            if (data && resp.data.hasOwnProperty('salutation_list')) {
                                return resp.data['salutation_list'] ? resp.data['salutation_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                return `<span class="badge badge-primary">${data}</span>`
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-40',
                            render: (data, type, row, meta) => {
                                return `<b class="text-primary">${data}</b>`
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap">${data}</span>`
                            }
                        }, {
                            className: 'wrap-text w-10',
                            render: (data, type, row, meta) => {
                                let url = $('#url-factory').data('salutation-detail').format_url_with_uuid(row.id)
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="salutation" data-id="${row.id}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span></a>`
                            }
                        }
                    ],
                },
            );
        }
    }

    function loadInterest() {
        if (!$.fn.DataTable.isDataTable('#datatable_interests_list')) {
            let tbl = $('#datatable_interests_list');
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
                            if (data && resp.data.hasOwnProperty('interests_list')) {
                                return resp.data['interests_list'] ? resp.data['interests_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                return `<span class="badge badge-primary">${data}</span>`
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-40',
                            render: (data, type, row, meta) => {
                                return `<b class="text-primary">${data}</b>`
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap">${data}</span>`
                            }
                        }, {
                            className: 'wrap-text w-10',
                            render: (data, type, row, meta) => {
                                let url = $('#url-factory').data('interest-detail').format_url_with_uuid(row.id)
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="salutation" data-id="${row.id}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span></a>`
                            }
                        }
                    ],
                },
            );
        }
    }

    loadSalutation();
    loadInterest();

    $('#btn-show-modal-create').on('click', function () {
        $('.modal-body input').val('');
    })

    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        if (section === 'section-salutation') {
            loadSalutation();
        } else {
            loadInterest();
        }
        $(".lookup-data").hide()
        let id_tag = `#` + section

        let lookup = $(this).text()
        $('#modal-lookup-data .modal-title').text(lookup.charAt(0).toUpperCase() + lookup.slice(1));
        $('#form-create-lookup').attr('data-lookup', lookup)
        $(id_tag).show();
    })

    $(document).on('click', '.edit-button', function () {
        let data_url = $(this).data('url');
        $('[name="url_detail"]').val(data_url);
        $('#inp-type').val($(this).attr('data-type'));
        $.fn.callAjax2(
            {
                'url': data_url,
                'method': 'GET'
            }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data')) {
                        if (resp.data.hasOwnProperty('salutation')) {
                            $('#name-update').val(data?.['salutation'].title);
                            $('#code-update').val(data?.['salutation'].code);
                            $('#description-update').val(data?.['salutation'].description);
                        } else if (resp.data.hasOwnProperty('interest')) {
                            $('#name-update').val(data.interest.title);
                            $('#code-update').val(data.interest.code);
                            $('#description-update').val(data.interest.description);
                        }
                    }
                }
            }, (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            },)
    })

    const frm = $('#form-create-lookup');
    new SetupFormSubmit(frm).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let frm_data = frm.dataForm;
            let lookup = $(form).attr('data-lookup');
            let data_url = ''
            if (lookup === 'salutation') {
                data_url = $('#form-create-lookup').attr('data-url-salutation');
            } else {
                data_url = $('#form-create-lookup').attr('data-url-interests');
            }

            $.fn.callAjax2({
                'url': data_url,
                'method': frm.dataMethod,
                'data': frm_data
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-lookup-data').modal('hide');
                        $('#datatable_salutation_list').DataTable().ajax.reload();
                        $('#datatable_interests_list').DataTable().ajax.reload();
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                })
        }
    })

    const frm_update = $('#form-update-masterdata');
    new SetupFormSubmit(frm_update).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let inp_name = $('#name-update');
            let inp_code = $('#code-update');
            let inp_des = $('#description-update');
            let data_form = {
                'code': inp_code.val(),
                'title': inp_name.val(),
                'description': inp_des.val(),
            }

            $.fn.callAjax2({
                'url': frm.dataForm['url_detail'],
                'method': frm.dataMethod,
                'data': data_form
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-data').modal('hide');
                        $('#datatable_salutation_list').DataTable().ajax.reload();
                        $('#datatable_interests_list').DataTable().ajax.reload();
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    });
});
