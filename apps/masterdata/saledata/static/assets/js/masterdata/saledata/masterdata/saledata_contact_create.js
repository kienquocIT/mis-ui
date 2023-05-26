$(document).ready(function () {

    let ele_salutation = $('#section-salutation').html()
    let ele_interest = $('#section-interests').html()
    // load Data
    function loadSalutation() {
        if (!$.fn.DataTable.isDataTable('#datatable_salutation_list')) {
            let tbl = $('#datatable_salutation_list');
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
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
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="salutation" data-id="{0}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
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
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="interest" data-id="{0}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
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
        if(section === 'section-salutation'){
            loadSalutation();
        }
        else{
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
        let csr = $("input[name=csrfmiddlewaretoken]").last().val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        let lookup = $('#form-create-lookup').attr('data-lookup');
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

        $.fn.callAjax(data_url, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $('#modal-lookup-data').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after create
                if (lookup === 'salutation') {
                    $('#section-salutation').empty();
                    $('#section-salutation').append(ele_salutation);
                    loadSalutation();
                } else {
                    $('#section-interests').empty();
                    $('#section-interests').append(ele_interest);
                    loadInterest();
                }
            }
        )
    })

    //show modal edit
    $(document).on('click', '#datatable_salutation_list .edit-button, #datatable_interests_list .edit-button', function () {
        let frm_update = $('#form-update-masterdata')
        let check_type = false;
        let data_url;
        if ($(this).attr('data-type') === 'salutation') {
            $('#modal-update-data h5').text('Edit Salutation');
            data_url = frm_update.attr('data-url-salutation').replace(0, $(this).attr('data-id'))
            check_type = true;
        } else {
            $('#modal-update-data h5').text('Edit Interest');
            data_url = frm_update.attr('data-url-interests').replace(0, $(this).attr('data-id'))
        }
        $.fn.callAjax(data_url, 'GET').then(
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

        // save edit
        $('#modal-update-data .edit-button').off().on('click', function () {
            let csr = $("input[name=csrfmiddlewaretoken]").last().val();
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

            $.fn.callAjax(data_url, 'PUT', data_form, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            $('#modal-update-data').hide();
                        }
                    },
                    (errs) => {
                    }
                ).then(
                (resp) => { // reload table after save edit
                    if (check_type) {
                        $('#section-salutation').empty();
                        $('#section-salutation').append(ele_salutation);
                        loadSalutation();
                    } else {
                        $('#section-interests').empty();
                        $('#section-interests').append(ele_interest);
                        loadInterest();
                    }
                },
            )
        });
    })
});
