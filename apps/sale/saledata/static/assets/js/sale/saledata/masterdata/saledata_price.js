$(document).ready(function () {

    let ele_tax_category = $('#section-tax-category').html();
    let ele_tax = $('#section-tax').html();
    let ele_currency = $('#section-currency').html();
    $('.select2-multiple').select2();

    //Switch view table
    $("#tab-select-table a").on("click", function () {
        let btn_create = $('#btn-show-modal-create')
        btn_create.show();
        $('#btn-save-payment').hide();
        $('#btn-back-payment').hide();
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $(id_tag).show();
        if (section === 'section-payment-terms') {
            btn_create.removeAttr('data-bs-target');
            btn_create.removeAttr('data-bs-toggle');
        } else {
            btn_create.attr('data-bs-toggle', 'modal');
            btn_create.attr('data-bs-target', '#modal-' + section);
        }
    })

    $('#btn-show-modal-create').on('click', function () {
        $('.modal-body .form-control').val('');
        $('.modal-body .form-select').prop("selectedIndex", -1);
        $('.modal-body .select2').val(null).trigger("change");
        if (!$(this).attr('data-bs-target')) {
            $(".lookup-data").hide();
            $('#section-create-payment-terms').show();
            $(this).hide();
            $('#btn-save-payment').show();
            $('#btn-back-payment').show();
        }
    })

    $('#btn-back-payment').on('click', function () {
        $('#btn-save-payment').hide();
        $(this).hide();
        $('#section-payment-terms').show();
        $('#section-create-payment-terms').hide();
        $('#btn-show-modal-create').show();
    })

    let config_tax_category = {
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
                next: '<i class="ri-arrow-right-s-line"></i>', // or '?'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '?'
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
            'data': 'title', render: (data, type, row, meta) => {
                if (row.is_default) {
                    if (row.is_default === false) {
                        return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                            data-bs-target="#modal-detail-tax-category" data-id="` + row.id + `">
                                    <span><b>` + row.title + `</b></span>
                                </a>`
                    } else {
                        return `<a>
                            <span><b>` + row.title + `</b></span>
                        </a>`
                    }
                } else {
                    return `<a class="btn-detail" href="#" data-id="` + row.id + `" data-bs-toggle="modal"
                            data-bs-target="#modal-detail-tax-category">
                                <span><b>` + row.title + `</b></span>
                            </a>`
                }
            }
        }, {
            'data': 'description', 'render': (data, type, row, meta) => {
                return `<span>` + row.description + `</span>`
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="` + row.id + `" data-bs-placement="top" title="" data-bs-original-title="Edit" data-bs-toggle="modal" data-bs-target="#modal-update-data"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                if (row.is_default) {
                    if (row.is_default === false) {
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="` + row.id + `" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        return bt3;
                    } else {
                        let bt3 = `<a class="btn btn-icon"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        return bt3;
                    }
                } else {
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="` + row.id + `" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    return bt3;
                }
            }
        },]
    }

    let config_tax = {
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
                next: '<i class="ri-arrow-right-s-line"></i>', // or '?'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '?'
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
                return `<a class="badge badge-outline badge-soft-success btn-detail" data-id="` + row.id + `" data-bs-toggle="modal"
                            data-bs-target="#modal-detail-tax" style="min-width: max-content; width: 100%" href="#"><center><span><b>` + row.code + `</b></span></center></a>`
            }
        }, {
            'data': 'title', render: (data, type, row, meta) => {
                return `<a class="btn-detail" href="#" data-id="` + row.id + `" data-bs-toggle="modal"data-bs-target="#modal-detail-tax"><span><b>` + row.title + `</b></span></a>`
            }
        }, {
            'data': 'type', 'render': (data, type, row, meta) => {
                if (row.type === 0) {
                    return `<div class="row">
                            <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-danger badge-pill" style="min-width: max-content; width: 100%">Sale</span></div>
                            </div>`
                } else if (row.type === 1) {
                    return `<div class="row">
                            <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-blue badge-pill" style="min-width: max-content; width: 100%">Purchase</span></div>
                            </div>`
                } else if (row.type === 2) {
                    return `<div class="row">
                            <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-danger badge-pill" style="min-width: max-content; width: 100%">Sale</span></div>
                            <div class="col-6" style="padding-left: 5px"><span class="badge badge-soft-blue badge-pill" style="min-width: max-content; width: 100%">Purchase</span></div>
                            </div>`
                } else {
                    return ``;
                }
            }
        }, {
            'data': 'category', 'render': (data, type, row, meta) => {
                if (row.category) {
                    return `<center>
                            <span class="badge badge-soft-primary badge-pill" style="min-width: max-content; width: 100%">` + row.category.title + `</span>
                            </center>`
                } else {
                    return `<span></span>`
                }
            }
        }, {
            'data': 'rate', 'render': (data, type, row, meta) => {
                if (row.rate) {
                    return `<center>
                            <span class="badge badge-soft-pink badge-pill" style="min-width: max-content; width: 100%">` + row.rate + `%</span>
                            </center>`
                } else {
                    return `<span></span>`
                }
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="` + row.id + `" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return bt3;
            }
        },]
    }

    let config_currency = {
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
                next: '<i class="ri-arrow-right-s-line"></i>', // or '?'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '?'
            }
        },
        drawCallback: function () {
            $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
            feather.replace();
        },
        data: [],
        round_number: null,
        columns: [{
            'render': (data, type, row, meta) => {
                let currentId = "chk_sel_" + String(meta.row + 1)
                return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
            }
        }, {
            'data': 'title', render: (data, type, row, meta) => {
                if (row.is_primary === false) {
                    if (row.is_default === true) {
                        return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                        data-bs-target="#modal-detail-currency" data-id="` + row.id + `" data-default="1">
                                <span><b>` + row.title + `</b></span>
                            </a>`
                    } else {
                        return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                        data-bs-target="#modal-detail-currency" data-id="` + row.id + `">
                                <span><b>` + row.title + `</b></span>
                            </a>`
                    }
                } else {
                    return `<a>
                        <span><b>` + row.title + `</b></span>
                    </a>`
                }
            }
        }, {
            'data': 'abbreviation', render: (data, type, row, meta) => {
                if (row.is_default === false) {
                    return `<span style="width: 50%;" class="badge badge-soft-primary badge-pill"><b>` + row.abbreviation + `</b></span></a>`
                } else {
                    return `<span style="width: 50%;" class="badge badge-soft-red badge-pill"><b>` + row.abbreviation + `</b></span></a>`
                }
            }
        }, {
            'data': 'rate', 'render': (data, type, row, meta) => {
                if (row.rate) {
                    if (row.is_primary === true) {
                        return `<span class="badge badge-success badge-indicator badge-indicator-xl"></span>`
                    } else {
                        return `<span>` + row.rate.toLocaleString('en-US', {minimumFractionDigits: row.round_number}) + `</span>`
                    }
                } else {
                    return ``;
                }
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="` + row.id + `" data-bs-placement="top" title="" data-bs-original-title="Edit" data-bs-toggle="modal" data-bs-target="#modal-update-data"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                if (row.is_default) {
                    if (row.is_default === false) {
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="` + row.id + `" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        return bt3;
                    } else {
                        let bt3 = `<a class="btn btn-icon"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        return bt3;
                    }
                } else {
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="` + row.id + `" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    return bt3;
                }
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

    function loadTaxCategory() {
        let tb_tax_category = $('#datatable-tax-category');
        let select_box = $('.select-box-category');
        select_box.html('')
        $.fn.callAjax(tb_tax_category.attr('data-url'), tb_tax_category.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_category_list')) {
                    select_box.append(`<option></option>`)
                    config_tax_category['data'] = resp.data.tax_category_list;
                    data.tax_category_list.map(function (item) {
                        select_box.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                    })
                }
                initDataTable(config_tax_category, '#datatable-tax-category');
            }
        }, (errs) => {
            initDataTable(config_tax_category, '#datatable-tax-category');
        },)
    }

    function loadTax() {
        let tb_tax = $('#datatable-tax');
        $.fn.callAjax(tb_tax.attr('data-url'), tb_tax.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    config_tax['data'] = resp.data.tax_list;
                }
                initDataTable(config_tax, '#datatable-tax');
            }
        }, (errs) => {
            initDataTable(config_tax, '#datatable-tax');
        },)
    }

    function loadCurrency() {
        let tb_tax = $('#datatable-currency');
        $.fn.callAjax(tb_tax.attr('data-url'), tb_tax.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency_list')) {
                    config_currency['data'] = resp.data.currency_list;

                    let vndCurrency = $.grep(config_currency['data'], function(currency) {
                        return currency.abbreviation === "VND";
                    })[0];

                    if (vndCurrency.is_primary) {
                        for (let i = 0; i < config_currency['data'].length; i++) {
                            config_currency['data'][i]['round_number'] = 2;
                        }
                    } else {
                        for (let i = 0; i < config_currency['data'].length; i++) {
                            config_currency['data'][i]['round_number'] = 5;
                        }
                    }

                    data.currency_list.map(function (item) {
                        if (item.is_primary === true) {
                            $('.abbreviation-primary').text(item.abbreviation);
                        }
                    });
                }
                initDataTable(config_currency, '#datatable-currency');
            }
        }, (errs) => {
            initDataTable(config_currency, '#datatable-currency');
        },)
    }

    loadCurrency();
    loadTax();
    loadTaxCategory();

//submit form create tax category
    let form_create_tax_category = $('#form-create-tax-category')
    form_create_tax_category.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $('#modal-section-tax-category').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after create
                $('#section-tax-category').empty();
                $('#section-tax-category').append(ele_tax_category);
                loadTaxCategory();
            })
    })

//submit form create tax
    let form_create_tax = $('#form-create-tax')
    form_create_tax.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        if ($('#select-box-type').val().length > 1) {
            frm.dataForm['type'] = '2';
        } else {
            frm.dataForm['type'] = $('#select-box-type').val()[0];
        }
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $('#modal-section-tax').hide();
                    }
                },
                (errs) => {

                }
            ).then(
            (rep) => {// reload dataTable after create
                $('#section-tax').empty();
                $('#section-tax').append(ele_tax);
                loadTax();
            })
    })

    let url_detail = ''
// show detail tax
    $(document).on('click', '#datatable-tax .btn-detail', function () {
        url_detail = $('#form-update-tax').attr('data-url').replace(0, $(this).attr('data-id'))
        $.fn.callAjax(url_detail, 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax')) {
                            $('#tax-title').val(data.tax.title);
                            $('#tax-code').val(data.tax.code);
                            $('#tax-rate').val(data.tax.rate);
                            $('.select-box-category').val(data.tax.category);
                            if (data.tax.type === 0) {
                                $('#tax-type').val(['0']).trigger("change");
                            } else if (data.tax.type === 1) {
                                $('#tax-type').val(['1']).trigger("change");
                            } else {
                                $('#tax-type').val(['0', '1']).trigger("change");
                            }

                        }
                    }
                    $('.inp-can-edit select, #tax-type').mouseenter(function () {
                        $(this).css('cursor', 'text');
                    })
                    $('.inp-can-edit').focusin(function () {
                        $(this).find('input[class=form-control]').prop('readonly', false);
                        $(this).find('select').removeAttr('readonly');
                    });
                    $('.inp-can-edit').focusout(function () {
                        $(this).find('input[class=form-control]').attr('readonly', true);
                        $(this).find('select').attr('readonly', 'readonly');
                    });
                    $('.inp-can-edit').on('change', function () {
                        $(this).find('input[class=form-control]').css({
                            'border-color': '#00D67F',
                            'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                        })
                        $(this).find('select').css({
                            'border-color': '#00D67F',
                            'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                        })
                    })
                })
    })

// show detail tax category
    $(document).on('click', '#datatable-tax-category .btn-detail', function () {
        url_detail = $('#form-update-tax-category').attr('data-url').replace(0, $(this).attr('data-id'))
        $.fn.callAjax(url_detail, 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_category')) {
                            $('#tax-category-title').val(data.tax_category.title)
                            $('#tax-category-description').val(data.tax_category.description)
                        }
                    }

                    $('.inp-can-edit').focusin(function () {
                        $(this).find('input[class=form-control]').prop('readonly', false);
                        $(this).find('textarea').prop('readonly', false);
                    });
                    $('.inp-can-edit').focusout(function () {
                        $(this).find('input[class=form-control]').attr('readonly', true);
                        $(this).find('textarea').prop('readonly', true);
                    });
                    $('.inp-can-edit').on('change', function () {
                        $(this).find('input[class=form-control]').css({
                            'border-color': '#00D67F',
                            'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                        })
                        $(this).find('textarea').css({
                            'border-color': '#00D67F',
                            'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                        })
                    })
                })
    })

//form update tax
    let form_update_tax = $('#form-update-tax')
    form_update_tax.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        if ($('#tax-type').val().length > 1) {
            frm.dataForm['type'] = '2';
        } else {
            frm.dataForm['type'] = $('#tax-type').val()[0];
        }
        $.fn.callAjax(url_detail, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $('#modal-detail-tax').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after create
                $('#section-tax').empty();
                $('#section-tax').append(ele_tax);
                loadTax();
            })
    })

//form update tax category
    let form_update_tax_category = $('#form-update-tax-category')
    form_update_tax_category.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(url_detail, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $('#modal-detail-tax-category').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (resp) => {// reload dataTable after create
                $('#section-tax-category').empty();
                $('#section-tax-category').append(ele_tax_category);
                loadTaxCategory();
            })
    })

// form create currency
    let form_create_currency = $('#form-create-currency')
    form_create_currency.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        if (frm.dataForm['rate'] === '') {
            frm.dataForm['rate'] = null;
        }

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $('#modal-section-currency').hide();
                    }
                },
                (errs) => {

                }
            ).then(
            (rep) => {// reload dataTable after create
                $('#section-currency').empty();
                $('#section-currency').append(ele_currency);
                loadCurrency();
            })
    })


// show detail currency
    $(document).on('click', '#datatable-currency .btn-detail', function () {
        $('#currency-title').closest('div').find('span').text('*')
        $('#currency-abbreviation').closest('div').find('span').text('*')
        url_detail = $('#form-update-currency').attr('data-url').replace(0, $(this).attr('data-id'))
        $.fn.callAjax(url_detail, 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency')) {
                            $('#currency-title').val(data.currency.title);
                            $('#currency-abbreviation').val(data.currency.abbreviation);
                            $('#currency-rate').val(data.currency.rate);
                        }
                    }

                    if ($(this).attr('data-default') !== '1') {
                        $('.inp-can-edit').focusin(function () {
                            $(this).find('input[class=form-control]').prop('readonly', false);
                        });
                        $('.inp-can-edit').focusout(function () {
                            $(this).find('input[class=form-control]').attr('readonly', true);
                        });
                        $('.inp-can-edit').on('change', function () {
                            $(this).find('input[class=form-control]').css({
                                'border-color': '#00D67F',
                                'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                            })
                        })
                    } else {
                        $(".inp-can-edit").off("focusin");
                        $('#currency-title').closest('div').find('input').css({'border': 'None'})
                        $('#currency-abbreviation').closest('div').find('input').css({'border': 'None'})

                        $('.default-can-edit').focusin(function () {
                            $(this).find('input[class=form-control]').prop('readonly', false);
                        });
                        $('.default-can-edit').focusout(function () {
                            $(this).find('input[class=form-control]').attr('readonly', true);
                        });
                        $('.default-can-edit').on('change', function () {
                            $(this).find('input[class=form-control]').css({
                                'border-color': '#00D67F',
                                'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                            })
                        })
                    }

                })
    })

//form update currency
    let form_update_currency = $('#form-update-currency')
    form_update_currency.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        if (frm.dataForm['rate'] === '') {
            frm.dataForm['rate'] = null;
        }

        $.fn.callAjax(url_detail, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $('#modal-detail-currency').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (resp) => {// reload dataTable after create
                $('#section-currency').empty();
                $('#section-currency').append(ele_currency);
                loadCurrency();
            })
    })

    // sync selling rate from VietComBank
    $(document).on("click", '#sync-from-VCB-button', function () {
        // $('#sync-status').html('<div class="spinner-border text-primary" role="status" style="height: 15px; width: 15px;"></div>');
        $('#sync-from-VCB-button').html('In Sync... &nbsp;<i class="bi bi-arrow-repeat"></i>')
        $('#datatable-currency tbody tr td:nth-child(4)').each(function() {
            if ($(this).find('span').hasClass('badge') === false) {
                $(this).html('<div class="spinner-border text-primary" role="status" style="height: 15px; width: 15px;"></div>');
            }
        });
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        $.fn.callAjax($(this).attr('data-url'), 'PUT', {'name': '1'}, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        setTimeout(function () {
                            $('#sync-from-VCB-button').text('Sync with VCB &nbsp;')
                            // $('#sync-status').html('');
                            $('#section-currency').empty();
                            $('#section-currency').append(ele_currency);
                            loadCurrency();
                        }, 1500);
                    }
                },
                (errs) => {
                }
            )
    });
})
