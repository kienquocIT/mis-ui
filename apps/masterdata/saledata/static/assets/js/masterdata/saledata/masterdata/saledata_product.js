$(document).ready(function () {

    let ele_product_type = $('#section-product-type').html()
    let ele_product_category = $('#section-product-category').html()
    let ele_expense_type = $('#section-expense-type').html()
    let ele_unit_of_measure = $('#section-unit-measure').html()
    let ele_unit_of_measure_group = $('#section-unit-measure-group').html()
    let url_update;

    const column_product_expense = [
        {
            render: (data, type, row, meta) => {
                return '';
            }
        },
        {
            data: 'title',
            className: 'wrap-text',
            render: (data, type, row, meta) => {
                if (row.is_default) {
                    if (row.is_default === false) {
                        return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                                data-bs-target="#modal-detail-product-and-expense" data-id="{0}">
                                    <span><b>{1}</b></span>
                                </a>`.format_by_idx(
                            row.id, data
                        )
                    } else {
                        return `<a>
                                    <span><b>{0}</b></span>
                                </a>`.format_by_idx(data)
                    }
                } else {
                    return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                            data-bs-target="#modal-detail-product-and-expense" data-id="{0}">
                                <span><b>{1}</b></span>
                            </a>`.format_by_idx(
                        row.id, data
                    )
                }
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
                if (row.is_default === false) {
                    return `<a class="btn btn-icon btn-flush-dark btn-rounded del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="{0}" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`.format_by_idx(
                        row.id
                    );
                } else {
                    return `<a class="btn btn-icon"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                }
            }
        }
    ]

    //Switch view table
    $("#tab-select-table a.product-and-expense").on("click", function () {
        $('.btn-show-modal').attr('data-bs-target', '#modal-product-and-expense')
        let section = $(this).attr('data-collapse');
        switch (section) {
            case 'section-product-type':
                loadProductType()
                break;
            case 'section-product-category':
                loadProDuctCategory()
                break;
            case 'section-expense-type':
                loadExpenseType()
                break;
        }
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $('#modal-product-and-expense h5').text($(this).text());
        $(id_tag).show();
        $('#form-create-product-and-expense').attr('data-lookup', $(this).attr('data-collapse'));
    })

    $("#tab-select-table a.unit-measure").on("click", function () {
        $('.btn-show-modal').attr('data-bs-target', '#modal-unit-measure')
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $('#modal-unit-measure h5').text($(this).text());
        $(id_tag).show();
        loadUnitOfMeasure();
    })

    $("#tab-select-table a.unit-measure-group").on("click", function () {
        $('.btn-show-modal').attr('data-bs-target', '#modal-unit-measure-group')
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $('#modal-unit-measure-group h5').text($(this).text());
        $(id_tag).show();
        loadUnitOfMeasureGroup();
    })

    function loadProductType() {
        if (!$.fn.DataTable.isDataTable('#datatable-product-type-list')) {
            let tbl = $('#datatable-product-type-list');
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
                    rowIdx: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('product_type_list')) {
                                return resp.data['product_type_list'] ? resp.data['product_type_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: column_product_expense,
                },
            );
        }
    }

    function loadProDuctCategory() {
        if (!$.fn.DataTable.isDataTable('#datatable-product-category-list')) {
            let tbl = $('#datatable-product-category-list');
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
                    rowIdx: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('product_category_list')) {
                                return resp.data['product_category_list'] ? resp.data['product_category_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: column_product_expense,
                },
            );
        }
    }

    function loadExpenseType() {
        if (!$.fn.DataTable.isDataTable('#datatable-expense-type-list')) {
            let tbl = $('#datatable-expense-type-list');
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
                    rowIdx: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('expense_type_list')) {
                                return resp.data['expense_type_list'] ? resp.data['expense_type_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: column_product_expense,
                },
            );
        }
    }

    function loadUnitOfMeasureGroup() {
        if (!$.fn.DataTable.isDataTable('#datatable-unit-measure-group-list')) {
            let tbl = $('#datatable-unit-measure-group-list');
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
                    rowIdx: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('unit_of_measure_group')) {
                                return resp.data['unit_of_measure_group'] ? resp.data['unit_of_measure_group'] : []
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
                            data: 'title',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                if (row.is_default) {
                                    return `<span><b>` + row.title + `</b></span>`
                                }
                                else {
                                    return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                                        data-bs-target="#modal-detail-unit-measure-group" data-id="{0}">
                                            <span><b>{1}</b></span>
                                        </a>`.format_by_idx(row.id, data)
                                }
                            }
                        }, {
                            render: (data, type, row, meta) => {
                                if (row.is_default) {
                                    return `<a class="btn btn-icon"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                                }
                                else {
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="{0}" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`.format_by_idx(row.id);
                                }
                            }
                        }
                    ],
                },
            );
        }
    }

    function loadUnitOfMeasure() {
        if (!$.fn.DataTable.isDataTable('#datatable-unit-measure-list')) {
            let tbl = $('#datatable-unit-measure-list');
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
                    columnDefs: [{
                        "searchable": false,
                        "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
                    }],
                    rowIdx: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('unit_of_measure')) {
                                return resp.data['unit_of_measure'] ? resp.data['unit_of_measure'] : []
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
                                return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                                        data-bs-target="#modal-detail-unit-measure" data-id="{0}">
                                            <span><b>{1}</b></span>
                                        </a>`.format_by_idx(row.id, data)
                            }
                        }, {
                            data: 'title',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        }, {
                            data: 'group',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data.title
                                )
                            }
                        }, {
                            data: 'is_referenced_unit',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                if (row.group.hasOwnProperty('is_referenced_unit')) {
                                    if (row.group.is_referenced_unit === true) {
                                        return `<span class="badge badge-success badge-indicator badge-indicator-xl"></span>`;
                                    } else {
                                        return ``;
                                    }
                                }
                                return '';
                            }
                        }, {
                            render: (data, type, row, meta) => {
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="{0}" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`.format_by_idx(
                                    row.id
                                );

                            }
                        }
                    ],
                },
            );
        }
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
                            ele.append(`<option value="` + item.id + `" data-referenced="` + item.referenced_unit.title + `" group-name="` + item.title + `">` + item.title + `</option>`)
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }
    loadProductType();

    // change select box unit measure group
    $('#select-box-unit-measure-group').on('change', function () {
        let data_referenced = $(this).find('option:selected').attr('data-referenced');
        let group_name = $(this).find('option:selected').attr('group-name');
        let name = $('#name-unit').val()
        $('#inp-rounding').val('5');
        if (data_referenced) {
            if (data_referenced === 'undefined') {
                $('#inp-code').prop('readonly', false);
                $('#name-unit').prop('readonly', false);

                $('#ratio-unit').val(1);
                $('#ratio-unit').prop('readonly', true);
                $('#ratio-area').prop('hidden', true);
                $('#inp-rounding').prop('readonly', false);

                if (name) {
                    $('#label-referenced-unit').text('* ' + name);
                    $('#label-referenced-unit').prop('hidden', false);
                } else {
                    $('#label-referenced-unit').text('');
                    $('#label-referenced-unit').prop('hidden', true);
                }

                $('#check-referenced-unit').prop('checked', true);
                $('#check-referenced-unit').prop('disabled', true);
                $('#notify-area-label').text('');
                $('#notify-area').prop('hidden', true);
            } else {
                $('#inp-code').prop('readonly', false);
                $('#name-unit').prop('readonly', false);

                $('#ratio-unit').val('');
                $('#ratio-unit').prop('readonly', false);
                $('#ratio-area').prop('hidden', false);

                $('#inp-rounding').prop('readonly', false);
                $('#label-referenced-unit').text(`* ` + data_referenced);
                $('#label-referenced-unit').prop('hidden', false);
                $('#check-referenced-unit').prop('checked', false);
                $('#check-referenced-unit').prop('disabled', true);
                $('#notify-area-label').text('* Group ' + group_name + ' had referenced unit.');
                $('#notify-area').prop('hidden', false);
            }
        } else {
            $('#inp-code').prop('readonly', true);
            $('#name-unit').prop('readonly', true);

            $('#ratio-unit').val('');
            $('#ratio-unit').prop('readonly', true);
            $('#ratio-area').prop('hidden', false);

            $('#inp-rounding').prop('readonly', true);
            $('#label-referenced-unit').text('');
            $('#label-referenced-unit').prop('hidden', true);
            $('#check-referenced-unit').prop('checked', false);
            $('#check-referenced-unit').prop('disabled', true);
            $('#notify-area-label').text('');
            $('#notify-area').prop('hidden', true);
        }
    })

    $('#check-referenced-unit').on('change', function () {
        let data_referenced = $('#select-box-unit-measure-group').find('option:selected').attr('data-referenced');
        $('#label-referenced-unit').text(`* ` + data_referenced);
        if (this.checked) {
            $('#ratio-unit').val('1');
            $('#ratio-unit').prop('readonly', true);
        } else {
            $('#ratio-unit').val('');
            $('#ratio-unit').prop('readonly', false);
        }
    })

// Submit form product and expense
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

// submit form create unit measure group
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
            }
        )
    })

// submit form unit measure
    let frm_unit_measure = $('#form-create-unit-measure');
    frm_unit_measure.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        let data_url = frm.dataUrl;

        if ($('#check-referenced-unit').is(':checked')) {
            frm_data['is_referenced_unit'] = true;
        } else {
            frm_data['is_referenced_unit'] = false;
        }

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
        let url = $('#form-edit-unit-measure').attr('data-url')
        url_update = url.replace(0, $(this).attr('data-id'))
        let url_detail = $(this).closest('table').attr('data-url-detail').replace(0, $(this).attr('data-id'))
        $.fn.callAjax(url_detail, 'GET')
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
                            $('#group-referenced-unit-name').val(data.unit_of_measure.ratio);
                            $('#group-id').val(data.unit_of_measure.group.id);
                            $('#inp-edit-uom-group').val(data.unit_of_measure.group.title);

                            if (data.unit_of_measure.group.is_referenced_unit === true) {
                                $('#check-edit-unit').prop('checked', true);
                                $('#select-box-edit-uom-group-div').prop('hidden', true);

                                $('#ratio-edit-area').prop('hidden', true);


                                $('#inp-edit-uom-group-div').prop('hidden', false);
                                $('#check-edit-unit').prop('disabled', true);
                            } else {
                                $('#check-edit-unit').prop('checked', false);
                                $('#select-box-edit-uom-group-div').prop('hidden', false);


                                $('#ratio-edit-area').prop('hidden', false);


                                $('#inp-edit-uom-group-div').prop('hidden', true);
                                $('#check-edit-unit').prop('disabled', false);
                            }
                        }
                    }
                },
                (errs) => {
                }
            )
    })

// change select UoM Group in modal detail
    $('#select-box-edit-uom-group').on('change', function () {
        $('#ratio-edit-area').prop('hidden', false);
        $('#inp-ratio-unit').val('');
        if ($(this).find('option:selected').val() === $('#group-id').val()) {
            $('#inp-ratio-unit').val($('#group-referenced-unit-name').val());
        }

        let data_referenced = $(this).find('option:selected').attr('data-referenced');

        if (data_referenced) {
            if (data_referenced === 'undefined') {
                $('#label-edit-referenced-unit').text('')
                $('#check-edit-unit').prop('checked', true);
                $('#check-edit-unit').prop('disabled', true);
                $('#notify-area-edit-label').text('');
                $('#notify-area-edit').prop('hidden', true);
            } else {
                if ($(this).find('option:selected').val() !== $('#group-id').val()) {
                    $('#label-edit-referenced-unit').text(`* ` + data_referenced)
                    $('#check-edit-unit').prop('checked', false);
                    $('#check-edit-unit').prop('disabled', true);
                    $('#notify-area-edit-label').text('* Can not set referenced unit from another group.');
                    $('#notify-area-edit').prop('hidden', false);
                } else {
                    $('#label-edit-referenced-unit').text(`* ` + data_referenced)
                    $('#check-edit-unit').prop('checked', false);
                    $('#check-edit-unit').prop('disabled', false);
                    $('#notify-area-edit-label').text('');
                    $('#notify-area-edit').prop('hidden', true);
                }
            }
        } else {
            $('#label-edit-referenced-unit').text('')
            $('#check-edit-unit').prop('checked', false);
            $('#check-edit-unit').prop('disabled', true);
        }
    })

// checkbox in Modal edit UOM
    $('#check-edit-unit').on('click', function () {
        if (this.checked) {
            $('#inp-ratio-unit').val('1');
            $('#ratio-edit-area').prop('hidden', true);
        } else {
            $('#inp-ratio-unit').val($('#group-referenced-unit-name').val());
            $('#ratio-edit-area').prop('hidden', false);
        }
    })

//submit form edit uom
    let frm_edit_uom = $('#form-edit-unit-measure')
    frm_edit_uom.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        if ($('#check-edit-unit').prop('checked') === true) {
            frm_data['is_referenced_unit'] = 'on';
        }
        frm_data['group'] = $('#select-box-edit-uom-group').find('option:selected').val();
        $.fn.callAjax(url_update, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Cập nhật"}, 'success')
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

// load detail Product Type
    let url_detail_product_expense
    $(document).on('click', '#datatable-product-type-list .btn-detail', function () {
        let url = $('#form-edit-product-and-expense').attr('data-url-product-type')
        url_update = url.replace(0, $(this).attr('data-id'));

        $('#modal-detail-product-and-expense h5').text('Edit Product Type');
        let url_detail = $(this).closest('table').attr('data-url-detail').replace(0, $(this).attr('data-id'))
        $.fn.callAjax(url_detail, 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_type')) {
                            $('#inp-edit-name').val(data.product_type.title);
                            $('#inp-edit-description').val(data.product_type.description);
                        }
                    }
                },
                (errs) => {
                }
            )
    })

// load detail Product Category
    $(document).on('click', '#datatable-product-category-list .btn-detail', function () {
        let url = $('#form-edit-product-and-expense').attr('data-url-product-category')
        url_update = url.replace(0, $(this).attr('data-id'));
        $('#modal-detail-product-and-expense h5').text('Edit Product Category')
        let url_detail = $(this).closest('table').attr('data-url-detail').replace(0, $(this).attr('data-id'))
        $.fn.callAjax(url_detail, 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_category')) {
                            $('#inp-edit-name').val(data.product_category.title);
                            $('#inp-edit-description').val(data.product_category.description);
                        }
                    }
                },
                (errs) => {
                }
            )
    })

// load detail Expense Type
    $(document).on('click', '#datatable-expense-type-list .btn-detail', function () {
        let url = $('#form-edit-product-and-expense').attr('data-url-expense-type')
        url_update = url.replace(0, $(this).attr('data-id'));
        $('#modal-detail-product-and-expense h5').text('Edit Expense Type');
        let url_detail = $(this).closest('table').attr('data-url-detail').replace(0, $(this).attr('data-id'))
        $.fn.callAjax(url_detail, 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense_type')) {
                            $('#inp-edit-name').val(data.expense_type.title);
                            $('#inp-edit-description').val(data.expense_type.description);
                        }
                    }
                },
                (errs) => {
                }
            )
    })

// load detail UoM Group
    $(document).on('click', '#datatable-unit-measure-group-list .btn-detail', function () {
        let url = $('#form-edit-unit-measure-group').attr('data-url')
        url_update = url.replace(0, $(this).attr('data-id'));
        let url_detail = $(this).closest('table').attr('data-url-detail').replace(0, $(this).attr('data-id'))
        $.fn.callAjax(url_detail, 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('uom_group')) {
                            $('#inp-edit-name-uom-group').val(data.uom_group.title);
                        }
                    }
                },
                (errs) => {
                }
            )
    })

    // submit form update product and expense
    let frm_edit_product_expense = $('#form-edit-product-and-expense')
    frm_edit_product_expense.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        $.fn.callAjax(url_update, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Cập nhật"}, 'success')
                        $('#modal-detail-product-and-expense').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after edit
                if ($('#tab-select-table li a.active').attr('data-collapse') === 'section-product-type') {
                    $('#section-product-type').empty();
                    $('#section-product-type').append(ele_product_type);
                    loadProductType();
                } else if ($('#tab-select-table li a.active').attr('data-collapse') === 'section-product-category') {
                    $('#section-product-category').empty();
                    $('#section-product-category').append(ele_product_category);
                    loadProDuctCategory();
                } else {
                    $('#section-expense-type').empty();
                    $('#section-expense-type').append(ele_expense_type);
                    loadExpenseType();
                }
            }
        )
    })

    // submit form update uom group
    let frm_edit_uom_group = $('#form-edit-unit-measure-group')
    frm_edit_uom_group.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        $.fn.callAjax(url_update, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Cập nhật"}, 'success')
                        $('#modal-detail-unit-measure-group').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after edit
                $('#section-unit-measure-group').empty();
                $('#section-unit-measure-group').append(ele_unit_of_measure_group);
                loadUnitOfMeasureGroup();
            }
        )
    })


    $('.btn-show-modal').on('click', function () {
        $('#modal-product-and-expense .form-control').val('');
        $('#modal-unit-measure-group .form-control').val('');

        if ($(this).attr('data-bs-target') === '#modal-unit-measure') {
            loadSelectBoxUnitMeasureGroup($('#select-box-unit-measure-group'), -1);
            $('#modal-unit-measure .form-control').val('');
            $('#modal-unit-measure .form-select').val('');
            $('#label-referenced-unit').text('');
            $('#notify-area').prop('hidden', true);
            $('#check-referenced-unit').prop('checked', false);
        }

    })
})
