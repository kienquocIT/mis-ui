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
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<h6><a href="#">{0}</a></h6>`.format_by_idx(
                                    data,
                                )
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        }, {
                            render: (data, type, row, meta) => {
                                let url = $('#url-factory').data('salutation-detail').format_url_with_uuid(row.id)
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="salutation" data-id="{0}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
                                    row.id
                                )
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
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<h6><a href="#">{0}</a> <span class="{1}"></span></h6>`.format_by_idx(
                                    data
                                )
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        }, {
                            render: (data, type, row, meta) => {
                                let url = $('#url-factory').data('interest-detail').format_url_with_uuid(row.id)
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="interest" data-id="{0}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
                                    row.id
                                )
                            }
                        }
                    ],
                },
            );
        }
    }

    loadSalutation();


    $('#btn-show-modal-create').on('click', function () {
        $('.modal-body input').val('');
    })

    //Switch view table
    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        if (section === 'section-salutation') {
            loadSalutation();
        } else {
            loadInterest();
        }
        $(".lookup-data").hide()
        let id_tag = `#` + section

        let lookup = section.split('-').pop()
        $('#modal-lookup-data h5').text(lookup.charAt(0).toUpperCase() + lookup.slice(1));
        $('#form-create-lookup').attr('data-lookup', lookup)
        $(id_tag).show();
    })

    // submit form create lookup data
    let frm = $('#form-create-lookup');
    frm.submit(function (event) {
        event.preventDefault();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        let lookup = $(this).attr('data-lookup');
        let data_url = ''
        if (lookup === 'salutation') {
            data_url = $('#form-create-lookup').attr('data-url-salutation');
        } else if (lookup === 'interests') {
            data_url = $('#form-create-lookup').attr('data-url-interests');
        }

        if (frm_data['code'] === '') {
            frm_data['code'] = null;
        }

        if (frm_data['title'] === '') {
            frm_data['title'] = null;
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
                    if (lookup === 'salutation') {
                        let table = $('#datatable_salutation_list').DataTable();
                        setTimeout(function () {
                            table.ajax.reload();
                            $('#modal-lookup-data').modal('hide');
                        })

                    } else {
                        let table = $('#datatable_interests_list').DataTable();
                        setTimeout(function () {
                            table.ajax.reload();
                            $('#modal-lookup-data').modal('hide');
                        })
                    }
                }
            },
            (errs) => {
            })
    })

    $(document).on('click', '.edit-button', function () {
        if ($(this).attr('data-type') === 'salutation') {
            $('#modal-update-data h5').text('Edit Salutation');
        } else {
            $('#modal-update-data h5').text('Edit Interest');
        }
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
                            $('#name-update').val(data.salutation.title);
                            $('#code-update').val(data.salutation.code);
                            $('#description-update').val(data.salutation.description);
                        } else if (resp.data.hasOwnProperty('interest')) {
                            $('#name-update').val(data.interest.title);
                            $('#code-update').val(data.interest.code);
                            $('#description-update').val(data.interest.description);
                        }
                    }
                }
            }, (errs) => {
            },)
    })

    const frm_update = $('#form-update-masterdata');
    frm_update.submit(function (event) {
        let frm = new SetupFormSubmit($(this));
        event.preventDefault();
        let inp_name = $('#name-update');
        let inp_code = $('#code-update');
        let inp_des = $('#description-update');
        let data_form = {
            'code': inp_code.val(),
            'title': inp_name.val(),
            'description': inp_des.val(),
        }

        if (data_form['title'] === '') {
            data_form['title'] = null;
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
                    if ($('#int-type').val() === 'salutation') {
                        $('#datatable_salutation_list').DataTable().ajax.reload();
                    } else {
                        $('#datatable_interests_list').DataTable().ajax.reload();
                    }
                }
            },
            (errs) => {
            }
        )
    });
});
