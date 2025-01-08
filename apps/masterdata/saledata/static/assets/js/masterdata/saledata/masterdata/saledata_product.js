$(document).ready(function () {
    const trans_script = $('#trans-script')

    function loadProductType() {
        let tbl = $('#datatable-product-type-list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
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
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text w-20',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-secondary w-70">${row?.['code']}</span>`
                        } else {
                            return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text w-30',
                    render: (data, type, row) => {
                        if (!row?.['is_default']) {
                            return `${data}`
                        }
                        return `<b>${data}</b>`
                    }
                },
                {
                    data: 'description',
                    className: 'wrap-text w-35',
                    render: (data) => {
                        return `<span class="initial-wrap">${data}</span>`
                    }
                },
                {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-product-type"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-description="${row?.['description']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-product-type"
                           data-bs-placement="top" title=""
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        if (!row?.['is_default']) {
                            return `${edit_btn}${delete_btn}`
                        }
                        return ``
                    }
                }
            ],
        });
    }
    function loadProductCategory() {
        let tbl = $('#datatable-product-category-list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
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
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text w-20',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-secondary w-70">${row?.['code']}</span>`
                        } else {
                            return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text w-30',
                    render: (data, type, row) => {
                        if (!row?.['is_default']) {
                            return `${data}`
                        }
                        return `<b>${data}</b>`
                    }
                },
                {
                    data: 'description',
                    className: 'wrap-text w-35',
                    render: (data) => {
                        return `<span class="initial-wrap">${data}</span>`
                    }
                },
                {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-product-category"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-description="${row?.['description']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-product-category"
                           data-bs-placement="top" title=""
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        if (!row?.['is_default']) {
                            return `${edit_btn}${delete_btn}`
                        }
                        return ``
                    }
                }
            ],
        });
    }
    function loadUnitOfMeasureGroup() {
        let tbl = $('#datatable-unit-measure-group-list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
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
                    className: 'wrap-text w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-secondary w-70">${row?.['code']}</span>`
                        } else {
                            return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text w-70',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<b>${data}</b>`
                        } else {
                            return `${data}`
                        }
                    }
                },
                {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-uom-group"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-uom-group"
                           data-bs-placement="top" title="" 
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        if (!row?.['is_default']) {
                            return `${edit_btn}${delete_btn}`
                        }
                        return ``
                    }
                }
            ],
        });
    }
    function loadSelectBoxUnitMeasureGroup(ele, data) {
        ele.empty()
        ele.initSelect2({data: data})
    }
    function loadUnitOfMeasure() {
        let tbl = $('#datatable-unit-measure-list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            paging: false,
            useDataServer: true,
            columnDefs: [
                {
                    "searchable": false,
                    "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
                },
                {
                    targets: [3],
                    visible: false
                }
            ],
            rowIdx: true,
            rowGroup: {
                dataSrc: 'group.title'
            },
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
                    className: 'wrap-text w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-secondary w-70">${data}</span>`
                        }
                        return `<span class="badge badge-primary w-70">${data}</span>`
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text w-30',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<b>${data}</b>`
                        }
                        return `${data}`
                    }
                },
                {
                    data: 'group',
                    className: 'wrap-text ',
                    render: (data) => {
                        return `${data?.['title']}`
                    }
                },
                {
                    data: 'is_referenced_unit',
                    className: 'wrap-text w-40 text-center',
                    render: (data, type, row) => {
                        if (row.group.hasOwnProperty('is_referenced_unit')) {
                            if (row.group.is_referenced_unit === true) {
                                return `<span class="badge badge-success badge-indicator badge-indicator-xl"></span>`;
                            } else {
                                return ``;
                            }
                        }
                        return '';
                    }
                },
                {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-uom"
                                data-id="${row?.['id']}"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-update-uom"
                                data-bs-placement="top" title="">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-primary">
                                    <i data-feather="edit"></i>
                                </span>
                            </span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        if (!row?.['is_default']) {
                            return `${edit_btn}${delete_btn}`
                        }
                        return ``
                    }
                }
            ],
        })
    }

    loadProductType()
    loadProductCategory()
    loadUnitOfMeasureGroup()
    loadUnitOfMeasure()

    $(document).on('click', '.btn-delete', function () {
        const tableCurrent = $(this).closest('table')
        Swal.fire({
            html:
            `<div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div><h5 class="text-danger">${trans_script.attr('data-trans-confirm-delete')}</h5><p>${trans_script.attr('data-trans-notify')}</p>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-danger',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container:'swal2-has-bg',
                actions:'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: trans_script.attr('data-trans-delete'),
            cancelButtonText: trans_script.attr('data-trans-cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let delete_url = tableCurrent.attr('data-url-detail').replace('/0', `/${$(this).attr('data-id')}`)
                $.fn.callAjax2({
                    url: delete_url,
                    data: {},
                    method: 'DELETE',
                }).then(
                    (resp) => {
                        $.fn.switcherResp(resp);
                        $.fn.notifyB({'description': 'Delete successfully!'}, 'success');
                        if (tableCurrent.attr('id') === 'datatable-product-type-list') {
                            loadProductType()
                        }
                        else if (tableCurrent.attr('id') === 'datatable-product-category-list') {
                            loadProductCategory()
                        }
                        else if (tableCurrent.attr('id') === 'datatable-unit-measure-group-list') {
                            loadUnitOfMeasureGroup()
                        }
                        else if (tableCurrent.attr('id') === 'datatable-unit-measure-list') {
                            loadUnitOfMeasure()
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({'description': errs.data.errors.detail}, 'failure');
                    }
                )
            }
        })
    })

    let frm_create_product_type = $('#form-create-product-type')
    let frm_update_product_type = $('#form-update-product-type')

    $(document).on("click", '.btn-update-product-type', function () {
        let modal = $('#modal-update-product-type')
        modal.find('#inp-edit-code-product-type').val($(this).attr('data-code'))
        modal.find('#inp-edit-name-product-type').val($(this).attr('data-title'))
        modal.find('#inp-edit-description-product-type').val($(this).attr('data-description'))
        let raw_url = frm_update_product_type.attr('data-url-raw')
        frm_update_product_type.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(frm_create_product_type).validate({
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
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-product-type').modal('hide')
                        $('#modal-new-product-type form')[0].reset()
                        loadProductType()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_product_type).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-product-type').modal('hide')
                        loadProductType()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    let frm_create_product_category = $('#form-create-product-category')
    let frm_update_product_category = $('#form-update-product-category')

    $(document).on("click", '.btn-update-product-category', function () {
        let modal = $('#modal-update-product-category')
        modal.find('#inp-edit-code-product-category').val($(this).attr('data-code'))
        modal.find('#inp-edit-name-product-category').val($(this).attr('data-title'))
        modal.find('#inp-edit-description-product-category').val($(this).attr('data-description'))
        let raw_url = frm_update_product_category.attr('data-url-raw')
        frm_update_product_category.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(frm_create_product_category).validate({
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
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-product-category').modal('hide')
                        $('#modal-new-product-category form')[0].reset()
                        loadProductCategory()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_product_category).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-product-category').modal('hide')
                        loadProductCategory()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    let frm_create_uom_group = $('#form-create-uom-group')
    let frm_update_uom_group = $('#form-update-uom-group')

    $(document).on("click", '.btn-update-uom-group', function () {
        let modal = $('#modal-update-uom-group')
        modal.find('#inp-edit-code-uom-group').val($(this).attr('data-code'))
        modal.find('#inp-edit-name-uom-group').val($(this).attr('data-title'))
        let raw_url = frm_update_uom_group.attr('data-url-raw')
        frm_update_uom_group.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(frm_create_uom_group).validate({
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
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-uom-group').modal('hide')
                        $('#modal-new-uom-group form')[0].reset()
                        loadUnitOfMeasureGroup()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_uom_group).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-uom-group').modal('hide')
                        loadUnitOfMeasureGroup()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    $('#select-box-uom-group').on('change', function () {
        let obj = SelectDDControl.get_data_from_idx($(this), $(this).val());
        let data_referenced = obj?.['referenced_unit']?.['title'];
        let group_name = $(this).find('option:selected').attr('group-name');

        let input_rounding_ele = $('#inp-rounding')
        input_rounding_ele.val('1');

        let name_unit_ele = $('#name-unit')
        let name = name_unit_ele.val();

        let ratio_ele = $('#ratio-unit');
        let label_ele = $('#label-referenced-unit');
        let checkbox_ele = $('#check-referenced-unit');
        if (!data_referenced) {
            $('#inp-code').prop('readonly', false);
            name_unit_ele.prop('readonly', false);

            ratio_ele.val(1);
            ratio_ele.prop('readonly', true);
            $('#ratio-area').prop('hidden', true);
            input_rounding_ele.prop('readonly', false);

            if (name) {
                label_ele.text('* ' + name);
                label_ele.prop('hidden', false);
            } else {
                label_ele.text('');
                label_ele.prop('hidden', true);
            }
            checkbox_ele.prop('checked', true);
            checkbox_ele.prop('disabled', true);
            $('#notify-area-label').text('');
            $('#notify-area').prop('hidden', true);
        } else {
            $('#inp-code').prop('readonly', false);
            name_unit_ele.prop('readonly', false);

            ratio_ele.val('');
            ratio_ele.prop('readonly', false);
            $('#ratio-area').prop('hidden', false);

            input_rounding_ele.prop('readonly', false);
            label_ele.text(`* ` + data_referenced);
            label_ele.prop('hidden', false);
            checkbox_ele.prop('checked', false);
            checkbox_ele.prop('disabled', true);
            $('#notify-area-label').text('* Group ' + group_name + ' had referenced unit.');
            $('#notify-area').prop('hidden', true);
        }
    })

    $('#select-box-edit-uom-group').on('change', function () {
        $('#ratio-edit-area').prop('hidden', false);
        let groupIdEle = $('#group-id');
        let ratioEle = $('#inp-ratio-unit');
        let checkReferenceUnit = $('#check-edit-unit');

        ratioEle.val('');
        if ($(this).val() === groupIdEle.val()) {
            ratioEle.val($('#group-referenced-unit-name').text());
        }

        let data_referenced = $(this).find('option:selected').attr('data-referenced');

        if (data_referenced) {
            if (data_referenced === 'undefined') {
                $('#label-edit-referenced-unit').text('')
                checkReferenceUnit.prop('checked', true);
                checkReferenceUnit.prop('disabled', true);
                $('#notify-area-edit-label').text('');
                $('#notify-area-edit').prop('hidden', true);
            } else {
                if ($(this).find('option:selected').val() !== groupIdEle.text()) {
                    $('#label-edit-referenced-unit').text(`* ` + data_referenced)
                    checkReferenceUnit.prop('checked', false);
                    checkReferenceUnit.prop('disabled', true);
                    $('#notify-area-edit-label').text('* Can not set referenced unit from another group.');
                    $('#notify-area-edit').prop('hidden', false);
                } else {
                    $('#label-edit-referenced-unit').text(`* ` + data_referenced)
                    checkReferenceUnit.prop('checked', false);
                    checkReferenceUnit.prop('disabled', false);
                    $('#notify-area-edit-label').text('');
                    $('#notify-area-edit').prop('hidden', true);
                }
            }
        } else {
            $('#label-edit-referenced-unit').text('')
            checkReferenceUnit.prop('checked', false);
            checkReferenceUnit.prop('disabled', true);
        }
    })

    $('#check-referenced-unit').on('change', function () {
        let data_referenced = $('#select-box-uom-group').find('option:selected').attr('data-referenced');
        $('#label-referenced-unit').text(`* ` + data_referenced);
        let ratioEle = $('#ratio-unit');
        if (this.checked) {
            ratioEle.val('1');
            ratioEle.prop('readonly', true);
        } else {
            ratioEle.val('');
            ratioEle.prop('readonly', false);
        }
    })

    $('#check-edit-unit').on('click', function () {
        if (this.checked) {
            $('#inp-ratio-unit').val('1');
            $('#ratio-edit-area').prop('hidden', true);
        } else {
            $('#inp-ratio-unit').val($('#group-referenced-unit-name').text());
            $('#ratio-edit-area').prop('hidden', false);
        }
    })

    let frm_create_uom = $('#form-create-uom');
    let frm_update_uom = $('#form-update-uom')

    new SetupFormSubmit(frm_create_uom).validate({
        rules: {
            title: {
                required: true,
            },
            group: {
                required: true,
            },
            code: {
                required: true,
            },
            ratio: {
                required: true,
                number: true,
                min: 0.000001,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm['is_referenced_unit'] = $('#check-referenced-unit').prop('checked');
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-uom').modal('hide');
                        $('#modal-new-uom form')[0].reset()
                        loadUnitOfMeasure()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_uom).validate({
        rules: {
            title: {
                required: true,
            },
            ratio: {
                required: true,
                number: true,
                min: 0.000001,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm['is_referenced_unit'] =$('#check-edit-unit').prop('checked');
            frm.dataForm['group'] = $('#select-box-edit-uom-group').find('option:selected').val();
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-uom').modal('hide');
                        loadUnitOfMeasure()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    $(document).on('click', '.btn-update-uom', function () {
        let raw_url = frm_update_uom.attr('data-url-raw')
        frm_update_uom.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))

        let ajax_uom_detail = $.fn.callAjax2({
            url: frm_update_uom.attr('data-url'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('unit_of_measure')) {
                    return data?.['unit_of_measure'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([ajax_uom_detail]).then(
            (results) => {
                let data = results[0];
                $('#inp-code-uom-update').val(data?.['code']);
                $('#inp-edit-name-unit').val(data?.['title']);
                $('#inp-rounding-edit').val(data?.['rounding']);
                $('#inp-ratio-unit').val(data?.['ratio']);
                $('#label-edit-referenced-unit').text(`* ` + data?.['group']?.['referenced_unit_title']);
                loadSelectBoxUnitMeasureGroup($('#select-box-edit-uom-group'), data?.['group']);
                $('#group-referenced-unit-name').text(data?.['ratio']);
                $('#group-id').val(data?.['group']?.['id']);

                let check_reference_unit = $('#check-edit-unit')
                let is_unit = data?.['group']?.['is_referenced_unit']
                $('#ratio-edit-area').prop('hidden', is_unit);
                check_reference_unit.prop('disabled', is_unit).prop('checked', is_unit)
            })
    })
})
