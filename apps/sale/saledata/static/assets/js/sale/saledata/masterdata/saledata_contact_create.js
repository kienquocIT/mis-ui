$(document).ready(function () {
    // load Data

    let ele_salutation = $('#section-salutation').html()
    let ele_interest = $('#section-interests').html()
    "use strict";
    let config_interest = {
        dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        ordering: false,
        columnDefs: [{
            "searchable": false, "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
        }],
        order: [2, 'asc'],
        language: {
            search: "",
            searchPlaceholder: "Search",
            info: "_START_ - _END_ of _TOTAL_",
            sLengthMenu: "View  _MENU_",
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '←'
            }
        },
        drawCallback: function () {
            $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
            feather.replace();
        },
        data: [],
        columns: [{
            'render': (data, type, row, meta) => {
                let currentId = "chk_sel_" + String(meta.row + 1)
                return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
            }
        }, {
            'data': 'code', render: (data, type, row, meta) => {
                return `<a href="#"><span><b>` + row.code + `</b></span></a>`
            }
        }, {
            'data': 'title', render: (data, type, row, meta) => {
                return `<span><b>` + row.title + `</b></span>`
            }
        }, {
            'data': 'description', 'render': (data, type, row, meta) => {
                return `<span><b>` + row.description + `</b></span>`
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="interest" data-id="` + row.id + `" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return bt2 + bt3;
            }
        },]
    }
    let config_salutation = {
        dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        ordering: false,
        columnDefs: [{
            "searchable": false, "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
        }],
        order: [2, 'asc'],
        language: {
            search: "",
            searchPlaceholder: "Search",
            info: "_START_ - _END_ of _TOTAL_",
            sLengthMenu: "View  _MENU_",
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '←'
            }
        },
        drawCallback: function () {
            $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
            feather.replace();
        },
        data: [],
        columns: [{
            'render': (data, type, row, meta) => {
                let currentId = "chk_sel_" + String(meta.row + 1)
                return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
            }
        }, {
            'data': 'code', render: (data, type, row, meta) => {
                return `<a href="#"><span><b>` + row.code + `</b></span></a>`
            }
        }, {
            'data': 'title', render: (data, type, row, meta) => {
                return `<span><b>` + row.title + `</b></span>`
            }
        }, {
            'data': 'description', 'render': (data, type, row, meta) => {
                return `<span><b>` + row.description + `</b></span>`
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="salutation" data-id="` + row.id + `" data-bs-placement="top" title="" data-bs-original-title="Edit" data-bs-toggle="modal" data-bs-target="#modal-update-data"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return bt2;
            }
        },]
    }

    function initDataTable(config, id_table) {
        /*DataTable Init*/
        let dtb = $(id_table);
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            /*Checkbox Add*/
            $(document).on('click', '.del-button', function () {
                targetDt.rows('.selected').remove().draw(false);
                return false;
            });
            $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div> <select class="d-flex align-items-center w-130p form-select form-select-sm"><option selected>Export to CSV</option><option value="2">Export to PDF</option><option value="3">Send Message</option><option value="4">Delegate Access</option> </select>');
            dtb.parent().addClass('table-responsive');
        }
    }

    let tb_salutation = $('#datatable_salutation_list');
    $.fn.callAjax(tb_salutation.attr('data-url'), tb_salutation.attr('data-method')).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('salutation_list')) {
                config_salutation['data'] = resp.data.salutation_list;
            }
            initDataTable(config_salutation, '#datatable_salutation_list');
        }
    }, (errs) => {
        initDataTable(config_salutation, '#datatable_salutation_list');
    },)


    let tb_interests = $('#datatable_interests_list');
    $.fn.callAjax(tb_interests.attr('data-url'), tb_interests.attr('data-method')).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('interests_list')) {
                config_interest['data'] = resp.data.interests_list;
            }
            initDataTable(config_interest, '#datatable_interests_list');
        }
    }, (errs) => {
        initDataTable(config_interest, '#datatable_interests_list');
    },)


    //Switch view table
    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
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
        let csr = $("input[name=csrfmiddlewaretoken]").val();
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
                        $.fn.notifyPopup({description: "Tạo mới"}, 'success')
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
                    let tb_salutation = $('#datatable_salutation_list');
                    $.fn.callAjax(tb_salutation.attr('data-url'), tb_salutation.attr('data-method')).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('salutation_list')) {
                                config_salutation['data'] = resp.data.salutation_list;
                            }
                            initDataTable(config_salutation, '#datatable_salutation_list');
                        }
                    }, (errs) => {
                        initDataTable(config_salutation, '#datatable_salutation_list');
                    },)
                } else {
                    $('#section-interests').empty();
                    $('#section-interests').append(ele_interest);
                    let tb_interests = $('#datatable_interests_list');
                    $.fn.callAjax(tb_interests.attr('data-url'), tb_interests.attr('data-method')).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('interests_list')) {
                                config_interest['data'] = resp.data.interests_list;
                            }
                            initDataTable(config_interest, '#datatable_interests_list');
                        }
                    }, (errs) => {
                        initDataTable(config_interest, '#datatable_interests_list');
                    },)
                }
            }
        )
    })

    // Select checkbox in table
    function selectAllCheckBox(id_table) {
        $(document).on('click', id_table + ` .check-select`, function () {
            if ($(this).is(":checked")) {
                $(this).closest('tr').addClass('selected');
            } else {
                $(this).closest('tr').removeClass('selected');
                $(id_table + ` .check-select-all`).prop('checked', false);
            }
        });

        $(document).on('click', id_table + ` .check-select-all`, function () {
            $(id_table + ` .check-select`).attr('checked', true);
            let table = $(id_table).DataTable();
            let indexList = table.rows().indexes();
            if ($(this).is(":checked")) {
                for (let idx = 0; idx < indexList.length; idx++) {
                    let rowNode = table.rows(indexList[idx]).nodes()[0];
                    rowNode.classList.add('selected');
                    rowNode.firstElementChild.children[0].firstElementChild.checked = true;
                }
                $(id_table + ` .check-select`).prop('checked', true);
            } else {
                for (let idx = 0; idx < indexList.length; idx++) {
                    let rowNode = table.rows(indexList[idx]).nodes()[0];
                    rowNode.classList.remove("selected");
                    rowNode.firstElementChild.children[0].firstElementChild.checked = false;
                }
                $(id_table + ` .check-select`).prop('checked', false);
            }
        });
    }

    selectAllCheckBox('#datatable_salutation_list');
    selectAllCheckBox('#datatable_interests_list');

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
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let inp_name = $('#name-update');
            let inp_code = $('#code-update');
            let inp_des = $('#description-update');
            let data_form = {
                'code': inp_code.val(),
                'title': inp_name.val(),
                'description': inp_des.val(),
            }

            if (data_form['code'] === '') {
                data_form['code'] = null;
            }

            if (data_form['title'] === '') {
                data_form['title'] = null;
            }

            $.fn.callAjax(data_url, 'PUT', data_form, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Cập nhập"}, 'success')
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
                        let tb_salutation = $('#datatable_salutation_list');
                        $.fn.callAjax(tb_salutation.attr('data-url'), tb_salutation.attr('data-method')).then((resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('salutation_list')) {
                                    config_salutation['data'] = resp.data.salutation_list;
                                }
                                initDataTable(config_salutation, '#datatable_salutation_list');
                            }
                        }, (errs) => {
                            initDataTable(config_salutation, '#datatable_salutation_list');
                        },)
                    } else {
                        $('#section-interests').empty();
                        $('#section-interests').append(ele_interest);
                        let tb_interests = $('#datatable_interests_list');
                        $.fn.callAjax(tb_interests.attr('data-url'), tb_interests.attr('data-method')).then((resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('interests_list')) {
                                    config_interest['data'] = resp.data.interests_list;
                                }
                                initDataTable(config_interest, '#datatable_interests_list');
                            }
                        }, (errs) => {
                            initDataTable(config_interest, '#datatable_interests_list');
                        },)
                    }
                },
            )
        });
    })
});





