$(document).ready(function () {
    let data_url_detail_uom = $('#datatable-unit-measure-list').attr('data-url-detail')
    let ele_product_type = $('#section-product-type').html()
    let ele_product_category = $('#section-product-category').html()
    let ele_expense_type = $('#section-expense-type').html()
    let ele_unit_of_measure = $('#section-unit-measure').html()
    let ele_unit_of_measure_group = $('#section-unit-measure-group').html()

    //Switch view table
    $("#tab-select-table a.product-and-expense").on("click", function () {
        $('.btn-show-modal').attr('data-bs-target', '#modal-product-and-expense')
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $('#modal-product-and-expense h5').text($(this).text());
        $(id_tag).show();
        $('#modal-product-and-expense .form-control').val('');
        $('#form-create-product-and-expense').attr('data-lookup', $(this).attr('data-collapse'))
    })

    $("#tab-select-table a.unit-measure").on("click", function () {
        $('.btn-show-modal').attr('data-bs-target', '#modal-unit-measure')
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $('#modal-unit-measure h5').text($(this).text());
        $(id_tag).show();
    })

    $("#tab-select-table a.unit-measure-group").on("click", function () {
        $('.btn-show-modal').attr('data-bs-target', '#modal-unit-measure-group')
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $('#modal-unit-measure-group h5').text($(this).text());
        $(id_tag).show();
        $('#modal-unit-measure-group .form-control').val('');
    })

    let config_product_expense = {
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
                return `<span><b>` + row.title + `</b></span>`
            }
        }, {
            'data': 'description', render: (data, type, row, meta) => {
                return `<span><b>` + row.description + `</b></span>`
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="` + row.id + `" data-bs-placement="top" title="" data-bs-original-title="Edit" data-bs-toggle="modal" data-bs-target="#modal-update-data"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="` + row.id + `" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return bt3;
            }
        },]
    }
    let config_unit_measure_group = {
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
                return `<span><b>` + row.title + `</b></span>`
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="` + row.id + `" data-bs-placement="top" title="" data-bs-original-title="Edit" data-bs-toggle="modal" data-bs-target="#modal-update-data"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="` + row.id + `" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return bt3;
            }
        },]
    }

    let groupColumn = 3;
    let config_unit_measure = {
        dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        ordering: false,
        columnDefs: [{
            "searchable": false, "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
        },
        { visible: false, targets: groupColumn }
        ],
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
        order: [[groupColumn, 'asc']],
        drawCallback: function (settings) {
            let api = this.api();
            let rows = api.rows({ page: 'current' }).nodes();
            let last = null;
            api
                .column(groupColumn, { page: 'current' })
                .data()
                .each(function (group, i) {
                    if (last !== group.title) {
                        $(rows)
                            .eq(i)
                            .before(
                                '<tr class="group">' +
                                '<td><span class="badge badge-outline badge-soft-primary w-100">' + group.title + '</span></td>' +
                                '</tr>'
                            );
                        last = group.title;
                    }
                });

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
                return `<a class="btn-detail" data-url="` + data_url_detail_uom.replace(0, row.id) + `" href="#" data-bs-toggle="modal"
            data-bs-target="#modal-detail-unit-measure" data-id="` + row.id + `">
                    <span><b>` + row.code + `</b></span>
                </a>`
            }
        }, {
            'data': 'title', render: (data, type, row, meta) => {
                return `<span><b>` + row.title + `</b></span>`
            }
        }, {
            'data': 'group', render: (data, type, row, meta) => {
                return `<span>` + row.group.title + `</span>`
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {

                if (row.group.hasOwnProperty('is_referenced_unit')) {
                    if (row.group.is_referenced_unit === 1) {
                        return `<span class="badge badge-success badge-indicator badge-indicator-xl"></span>`;
                    } else {
                        return ``;
                    }
                }
                return '';
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="` + row.id + `" data-bs-placement="top" title="" data-bs-original-title="Edit" data-bs-toggle="modal" data-bs-target="#modal-update-data"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="` + row.id + `" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return bt3;
            }
        },],
    }

    function initDataTable(config, id_table) {
        /*DataTable Init*/
        let dtb = $(id_table);
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            /*Checkbox Add*/
            // $(document).on('click', '.del-button', function () {
            //     targetDt.rows('.selected').remove().draw(false);
            //     return false;
            // });
            $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div> <select class="d-flex align-items-center w-130p form-select form-select-sm"><option selected>Export to CSV</option><option value="2">Export to PDF</option><option value="3">Send Message</option><option value="4">Delegate Access</option> </select>');
            dtb.parent().addClass('table-responsive');
        }
    }

    function loadProductType() {
        let tb_product_type = $('#datatable-product-type-list');
        $.fn.callAjax(tb_product_type.attr('data-url'), tb_product_type.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_type_list')) {
                    config_product_expense['data'] = resp.data.product_type_list;
                }
                initDataTable(config_product_expense, '#datatable-product-type-list');
            }
        }, (errs) => {
            initDataTable(config_product_expense, '#datatable-product-type-list');
        },)
    }

    function loadProDuctCategory() {
        let tb_product_category = $('#datatable-product-category-list');
        $.fn.callAjax(tb_product_category.attr('data-url'), tb_product_category.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_category_list')) {
                    config_product_expense['data'] = resp.data.product_category_list;
                }
                initDataTable(config_product_expense, '#datatable-product-category-list');
            }
        }, (errs) => {
            initDataTable(config_product_expense, '#datatable-product-category-list');
        },)
    }

    function loadExpenseType() {
        let tb_expense_type = $('#datatable-expense-type-list');
        $.fn.callAjax(tb_expense_type.attr('data-url'), tb_expense_type.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense_type_list')) {
                    config_product_expense['data'] = resp.data.expense_type_list;
                }
                initDataTable(config_product_expense, '#datatable-expense-type-list');
            }
        }, (errs) => {
            initDataTable(config_product_expense, '#datatable-expense-type-list');
        },)
    }

    function loadUnitOfMeasureGroup() {
        let tb_unit_measure_group = $('#datatable-unit-measure-group-list');
        $.fn.callAjax(tb_unit_measure_group.attr('data-url'), tb_unit_measure_group.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    config_unit_measure_group['data'] = resp.data.unit_of_measure_group;
                }
                initDataTable(config_unit_measure_group, '#datatable-unit-measure-group-list');
            }
        }, (errs) => {
            initDataTable(config_unit_measure_group, '#datatable-unit-measure-group-list');
        },)
    }

    function loadUnitOfMeasure() {
        let tb_unit_measure = $('#datatable-unit-measure-list');
        $.fn.callAjax(tb_unit_measure.attr('data-url'), tb_unit_measure.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                    config_unit_measure['data'] = resp.data.unit_of_measure;
                }
                initDataTable(config_unit_measure, '#datatable-unit-measure-list');
            }
        }, (errs) => {
            initDataTable(config_unit_measure, '#datatable-unit-measure-list');
        },)
    }

    function loadSelectBoxUnitMeasureGroup(ele, id) {
        ele.html('');
        ele.append(`<option></option>`)
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    data.unit_of_measure_group.map(function (item) {
                        if (item.id === id) {
                            ele.append(`<option selected value="` + item.id + `" data-referenced="` + item.referenced_unit.title + `">` + item.title + `</option>`)
                        } else {
                            ele.append(`<option value="` + item.id + `" data-referenced="` + item.referenced_unit.title + `">` + item.title + `</option>`)
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }

    loadExpenseType();
    loadProDuctCategory();
    loadProductType();
    loadUnitOfMeasureGroup();
    loadSelectBoxUnitMeasureGroup($('#select-box-unit-measure-group'), -1);
    loadUnitOfMeasure();

    // change select box unit measure group
    $('#select-box-unit-measure-group').on('change', function () {
        let data_referenced = $(this).find('option:selected').attr('data-referenced');
        if (data_referenced) {
            $('#inp-code').prop('disabled', false);
            $('#name-unit').prop('disabled', false);
            $('#inp-rounding').prop('disabled', false);
            $('#ratio-unit').prop('disabled', false);
            if (data_referenced === 'undefined') {
                $('#check-referenced-unit').prop('disabled', false);
                $('#label-referenced-unit').text('');
            } else {
                $('#ratio-unit').prop('disabled', false);
                $('#check-referenced-unit').prop('disabled', true);
                $('#label-referenced-unit').text(`* ` + data_referenced);
                $('#label-referenced-unit').prop('hidden', false);
            }
        }
        else {
            $('#check-referenced-unit').prop('disabled', true);
            $('#inp-code').prop('disabled', true);
            $('#name-unit').prop('disabled', true);
            $('#inp-rounding').prop('disabled', true);
            $('#ratio-unit').prop('disabled', true);
            $('#label-referenced-unit').text('');
        }
    })

    $('#check-referenced-unit').on('change', function () {
        if (this.checked) {
            $('#label-referenced-unit').text(`* ` + $('#name-unit').val());
            $('#label-referenced-unit').prop('hidden', false);
            $('#ratio-unit').val('1');
        } else {
            $('#label-referenced-unit').prop('hidden', true);
            $('#ratio-unit').prop('disabled', true);
            $('#ratio-unit').val('');
        }
    })

    // submit form product and expense
    let form_create = $('#form-create-product-and-expense');
    form_create.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        let lookup = $('#form-create-product-and-expense').attr('data-lookup');
        let data_url = ''
        if (lookup === 'section-product-type') {
            data_url = $('#form-create-product-and-expense').attr('data-url-product-type');
        } else if (lookup === 'section-product-category') {
            data_url = $('#form-create-product-and-expense').attr('data-url-product-category');
        } else if (lookup === 'section-expense-type') {
            data_url = $('#form-create-product-and-expense').attr('data-url-expense-type');
        }
        $.fn.callAjax(data_url, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Tạo mới"}, 'success')
                        $('#modal-product-and-expense').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after create
                if (lookup === 'section-product-type') {
                    $('#section-product-type').empty();
                    $('#section-product-type').append(ele_product_type);
                    loadProductType();
                } else if (lookup === 'section-product-category') {
                    $('#section-product-category').empty();
                    $('#section-product-category').append(ele_product_category);
                    loadProDuctCategory();
                } else if (lookup === 'section-expense-type') {
                    $('#section-expense-type').empty();
                    $('#section-expense-type').append(ele_expense_type);
                    loadExpenseType();
                }
            }
        )
    })

    // commit form create unit measure group
    let frm_unit_measure_group = $('#form-create-unit-measure-group');
    frm_unit_measure_group.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        let data_url = frm.dataUrl;
        $.fn.callAjax(data_url, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Tạo mới"}, 'success')
                        $('#modal-unit-measure-group').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after create
                $('#section-unit-measure-group').empty();
                $('#section-unit-measure-group').append(ele_unit_of_measure_group);
                loadUnitOfMeasureGroup();
                loadSelectBoxUnitMeasureGroup();
            }
        )
    })

    // commit form unit measure
    let frm_unit_measure = $('#form-create-unit-measure');
    frm_unit_measure.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        let data_url = frm.dataUrl;
        $.fn.callAjax(data_url, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Tạo mới"}, 'success')
                        $('#modal-unit-measure').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after create
                $('#section-unit-measure').empty();
                $('#section-unit-measure').append(ele_unit_of_measure);
                loadUnitOfMeasure();
            }
        )
    })

    // load detail uom
    $(document).on('click', '#datatable-unit-measure-list .btn-detail', function () {
        $('#modal-detail-unit-measure .inp-can-edit').tooltip();
        $('#form-edit-unit-measure').attr('data-url', $('#form-edit-unit-measure').attr('data-url').replace(0, $(this).attr('data-id')))
        $.fn.callAjax($(this).attr('data-url'), 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                            $('#inp-code-uom').val(data.unit_of_measure.code);
                            $('#inp-edit-name-unit').val(data.unit_of_measure.title);
                            $('#inp-rounding-edit').val(data.unit_of_measure.rounding);
                            $('#inp-ratio-unit').val(data.unit_of_measure.ratio);
                            $('#label-edit-referenced-unit').text(`* ` + data.unit_of_measure.group.referenced_unit_title);
                            loadSelectBoxUnitMeasureGroup($('#select-box-edit-uom-group'), data.unit_of_measure.group.id);
                            if (data.unit_of_measure.group.is_referenced_unit === 1) {
                                $('#check-edit-unit').prop('checked', true);
                                $('#check-edit-unit').prop('hidden', false);
                                $('#check-edit-unit-label').prop('hidden', false);
                            }
                            else {
                                $('#check-edit-unit').prop('checked', false);
                            }
                        }
                    }
                },
                (errs) => {
                }
            )
    })


    // $('#modal-detail-unit-measure .inp-can-edit').on('click', function () {
    //     if ($(this).is('input')) {
    //         $(this).removeAttr('readonly');
    //     } else if ($(this).is('div')) {
    //         $(this).find('select').removeAttr('disabled');
    //         $(this).find('input').removeAttr('disabled');
    //     }
    // })

    $('#modal-detail-unit-measure .inp-can-edit').mouseenter(function() {
        $(this).removeAttr("readonly");
        $(this).find('select').prop("disabled", false);
    });
    $('#modal-detail-unit-measure .inp-can-edit').mouseleave(function() {
        $(this).prop("readonly", true);
        $(this).find('select').prop("disabled", true);
    });

    //submit form edit uom
    let frm_edit_uom = $('#form-edit-unit-measure')
    frm_edit_uom.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        let data_url = frm.dataUrl;
        if ($('#check-edit-unit').prop('checked') === true) {
            frm_data['is_referenced_unit'] = 'on';
        }
        frm_data['group'] = $('#select-box-edit-uom-group').val();
        $.fn.callAjax(data_url, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Cập nhập."}, 'success')
                        $('#modal-detail-unit-measure').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after edit
                $('#section-unit-measure').empty();
                $('#section-unit-measure').append(ele_unit_of_measure);
                loadUnitOfMeasure();
            }
        )
    })
})


// $('.btn-save-product-and-expense').on('click', function () {
//     let frm = $('#form-create-product-and-expense');
//     let data_lookup = frm.attr('data-look');
//     if ((data_lookup) === 'product-type'){
//         let table = $('#datatable-product-type-list');
//     }
//     table.append(`<tr><td><span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select"><label class="form-check-label"></label></span></td><td><span><b>123</b></span></td><td><span><b></b></span></td><td><a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a></td></tr>`);
//     feather.replace();
// })


