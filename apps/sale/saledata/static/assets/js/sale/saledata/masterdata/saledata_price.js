$(document).ready(function () {
    let ele_tax_category = $('#section-tax-category').html();
    let ele_tax = $('#section-tax').html();

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
            'data': 'title', render: (data, type, row, meta) => {
                if (row.is_default) {
                    if (row.is_default === false) {
                        return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                            data-bs-target="#modal-detail-product-and-expense" data-id="` + row.id + `">
                                    <span><b>` + row.title + `</b></span>
                                </a>`
                    } else {
                        return `<a>
                            <span><b>` + row.title + `</b></span>
                        </a>`
                    }
                } else {
                    return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                        data-bs-target="#modal-detail-product-and-expense" data-id="` + row.id + `">
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
                return `<a href="#"><span><b>` + row.title + `</b></span></a>`
            }
        }, {
            'data': 'type', 'render': (data, type, row, meta) => {
                return `<span>` + row.type + `</span>`
            }
        }, {
            'data': 'category', 'render': (data, type, row, meta) => {
                return `<span>` + row.category.title + `</span>`
            }
        }, {
            'data': 'rate', 'render': (data, type, row, meta) => {
                return `<span>` + row.rate + `%</span>`
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                return ''
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
        let select_box = $('#select-box-category');
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

    function loadTax(){
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
})
