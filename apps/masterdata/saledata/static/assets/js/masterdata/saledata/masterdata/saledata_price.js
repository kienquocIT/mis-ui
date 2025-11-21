let term_type_list = [];
let PercentCount = 0;
let $transElm = $('#trans-factory');
$(document).ready(function () {
    const trans_script = $('#trans-script')
    function loadBaseCurrency() {
        let ele = $('#currency_name');
        ele.initSelect2({
            data: {},
            templateResult: function (state) {
                return $(`<span>${state.data?.code} - ${state.text}</span>`);
            },
        }).on('change', function () {
            let currency = SelectDDControl.get_data_from_idx($(this), $(this).val());
            $('#abbreviation-id').val(currency.code);
        })
    }
    function loadCurrency() {
        let tbl = $('#datatable-currency');
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
                    if (data && resp.data.hasOwnProperty('currency_list')) {
                        let vndCurrency = $.grep(resp.data['currency_list'], function (currency) {
                            return currency.abbreviation === "VND";
                        })[0];
                        if (vndCurrency !== undefined && vndCurrency?.['is_primary']) {
                            for (let i = 0; i < resp.data['currency_list'].length; i++) {
                                resp.data['currency_list'][i]['round_number'] = 2;
                            }
                        } else {
                            for (let i = 0; i < resp.data['currency_list'].length; i++) {
                                resp.data['currency_list'][i]['round_number'] = 5;
                            }
                        }

                        resp.data['currency_list'].map(function (item) {
                            if (item?.['is_primary'] === true) {
                                $('.abbreviation-primary').text(item.abbreviation);
                            }
                        });
                        return resp.data['currency_list'] ? resp.data['currency_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'abbreviation',
                    className: 'w-25',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-70">${data}</span>`
                        } else {
                            return `<span class="badge badge-primary w-70">${data}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'w-30',
                    render: (data, type, row) => {
                        if (!row?.['is_default']) {
                            return `${data}`
                        }
                        return `<b>${data}</b>`
                    }
                },
                {
                    data: 'rate',
                    className: 'w-30',
                    render: (data, type, row) => {
                        if (data) {
                            if (row?.['is_primary']) {
                                return `<span class="badge badge-success badge-indicator badge-indicator-xl"></span>`
                            } else {
                                return `<span>${data.toLocaleString('en-US', {minimumFractionDigits: row.round_number})}</span>`
                            }
                        } else {
                            return ``;
                        }
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        if (row?.['is_primary']) {
                            return ""
                        }
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-currency"
                           data-id="${row?.['id']}"
                           data-code="${row?.['abbreviation']}"
                           data-title="${row?.['title']}"
                           data-rate="${row?.['rate']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-currency"
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

                        return `${edit_btn}`
                    }
                }
            ],
        });
    }
    function loadTaxCategory() {
        let tbl = $('#datatable-tax-category');
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
                    if (data && resp.data.hasOwnProperty('tax_category_list')) {
                        return resp.data['tax_category_list'] ? resp.data['tax_category_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'w-10',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-70">${row?.['code']}</span>`
                        } else {
                            return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'w-35',
                    render: (data, type, row, meta) => {
                        if (row?.['is_default']) {
                            return `<b>${data}</b>`
                        } else {
                            return `${data}`
                        }
                    }
                },
                {
                    data: 'description',
                    className: 'w-35',
                    render: (data) => {
                        return `${data}`
                    }
                },
                {
                    className: 'text-right w-15',
                    render: (data, type, row, meta) => {
                        let edit_btn =  `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-tax-category"
                                   data-id="${row?.['id']}"
                                   data-code="${row?.['code']}"
                                   data-title="${row?.['title']}"
                                   data-description="${row?.['description']}"
                                   data-bs-toggle="modal"
                                   data-bs-target="#modal-update-tax-category"
                                   data-bs-placement="top" title="" 
                                   data-bs-original-title="Edit">
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
                        return `${edit_btn}`
                    }
                }
            ],
        });
    }
    function loadTax() {
        let tbl = $('#datatable-tax');
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
                    if (data && resp.data.hasOwnProperty('tax_list')) {
                        return resp.data['tax_list'] ? resp.data['tax_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'w-10',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-80">${row?.['code']}</span>`
                        } else {
                            return `<span class="badge badge-primary w-80">${row?.['code']}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'w-25',
                    render: (data) => {
                        return `${data}`
                    }
                },
                {
                    data: 'tax_type',
                    className: 'w-15',
                    render: (data) => {
                        if (data === 0) {
                            return 'Sale'
                        }
                        if (data === 1) {
                            return 'Purchase'
                        }
                        return 'Sale, Purchase'
                    }
                },
                {
                    data: 'category',
                    className: 'w-15',
                    render: (data, type, row) => {
                        if (row.category) {
                            return `<span class="badge badge-soft-primary">${data?.['title']}</span>`
                        } else {
                            return ``
                        }
                    }
                },
                {
                    data: 'rate',
                    className: 'w-15',
                    render: (data) => {
                        if (data >= 0) {
                            return `<span class="badge badge-soft-pink" >${data}%</span>`
                        } else {
                            return ``
                        }
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-tax"
                           data-id="${row?.['id']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-tax"
                           data-bs-placement="top" title="" 
                           data-bs-original-title="Edit">
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

                        return `${edit_btn}`
                    }
                }
            ],
        });
    }
    function loadSelectBoxTaxCategory(ele, data) {
        ele.empty()
        ele.initSelect2({data: data})
    }

    loadBaseCurrency()
    loadCurrency()
    loadTax()
    loadTaxCategory()

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
                        if (tableCurrent.attr('id') === 'datatable-currency') {
                            loadCurrency()
                        }
                        else if (tableCurrent.attr('id') === 'datatable-tax-category') {
                            loadTaxCategory()
                        }
                        else if (tableCurrent.attr('id') === 'datatable-tax') {
                            loadTax()
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({'description': errs.data.errors.detail}, 'failure');
                    }
                )
            }
        })
    })

    let form_create_currency = $('#form-create-currency')
    let form_update_currency = $('#form-update-currency')

    $(document).on("click", '#sync-from-VCB-button', function () {
        $('#datatable-currency tbody tr td:nth-child(4)').each(function () {
            if ($(this).find('span').hasClass('badge') === false) {
                $(this).html('<div class="spinner-border text-primary" role="status" style="height: 15px; width: 15px;"></div>');
            }
        });
        $.fn.callAjax2({
            'url': $(this).attr('data-url'),
            'method': 'PUT',
            'data': {'name': '1'}
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    console.log(data)
                    $.fn.notifyB({description: 'Sync successfully!'}, 'success');
                    setTimeout(function () {
                        $('#datatable-currency').DataTable().ajax.reload();
                    }, 0);
                }
            },
            (errs) => {
                $.fn.notifyB({description: 'Sync Failed!'}, 'failure');
            }
        )
    });
    $(document).on('click', '.btn-update-currency', function () {
        let modal = $('#modal-update-currency')
        modal.find('#currency-code').val($(this).attr('data-code'))
        modal.find('#currency-title').val($(this).attr('data-title'))
        modal.find('#currency-selling-rate').val($(this).attr('data-rate'))
        let raw_url = form_update_currency.attr('data-url-raw')
        form_update_currency.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(form_create_currency).validate({
        rules: {
            currency: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            if (frm.dataForm['rate'] === '') {
                frm.dataForm['rate'] = null;
            }
            let currency_ele = $('#currency_name');
            let currency_obj = SelectDDControl.get_data_from_idx(currency_ele, currency_ele.val());
            frm.dataForm['abbreviation'] = currency_obj.code;
            frm.dataForm['title'] = currency_obj.title;
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-currency').modal('hide');
                        $('#modal-new-currency form')[0].reset()
                        loadCurrency()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
    new SetupFormSubmit(form_update_currency).validate({
        rules: {
            code:{
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
                        $('#modal-update-currency').modal('hide');
                        loadCurrency()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    let form_create_tax_category = $('#form-create-tax-category')
    let form_update_tax_category = $('#form-update-tax-category')

    $(document).on('click', '.btn-update-tax-category', function () {
        let modal = $('#modal-update-tax-category')
        modal.find('#tax-category-code').val($(this).attr('data-code'))
        modal.find('#tax-category-title').val($(this).attr('data-title'))
        modal.find('#tax-category-description').val($(this).attr('data-description'))
        let raw_url = form_update_tax_category.attr('data-url-raw')
        form_update_tax_category.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(form_create_tax_category).validate({
        rules: {
            code:{
                required: true
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
                'data': frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-tax-category').modal('hide');
                        $('#modal-new-tax-category form')[0].reset()
                        loadTaxCategory()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
    new SetupFormSubmit(form_update_tax_category).validate({
        rules: {
            code:{
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
                        $('#modal-update-tax-category').modal('hide');
                        loadTaxCategory()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    let form_create_tax = $('#form-create-tax')
    let form_update_tax = $('#form-update-tax')

    $('#select-box-type').initSelect2({
        data: [
            {
                'id': '0',
                'title': $transElm.data('trans-sale'),
            },
            {
                'id': '1',
                'title': $transElm.data('trans-purchase'),
            }
        ]
    })

    $(document).on('click', '.btn-update-tax', function () {
        let raw_url = form_update_tax.attr('data-url-raw')
        form_update_tax.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
        $.fn.callAjax2({
            'url': form_update_tax.attr('data-url'),
            'method': 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax')) {
                        $('#tax-title').val(data?.['tax']?.['title']);
                        $('#tax-code').val(data?.['tax']?.['code']);
                        $('#tax-rate').val(data?.['tax']?.['rate']);
                        loadSelectBoxTaxCategory($('#select-box-category-update'), data?.['tax']?.['category'])
                        let typeEle = $('#tax-type');
                        typeEle.empty()
                        typeEle.initSelect2({
                            data: [{
                                'id': '0',
                                'title': $transElm.data('trans-sale'),
                            },
                            {
                                'id': '1',
                                'title': $transElm.data('trans-purchase'),
                            }]
                        })
                        if (data?.['tax']?.['tax_type'] === 0) {
                            typeEle.val(['0']).trigger("change");
                        } else if (data?.['tax']?.['tax_type'] === 1) {
                            typeEle.val(['1']).trigger("change");
                        } else {
                            typeEle.val(['0', '1']).trigger("change");
                        }
                    }
                }
            })
    })

    new SetupFormSubmit(form_create_tax).validate({
        rules: {
            code: {
                required: true
            },
            title: {
                required: true,
            },
            category: {
                required: true,
            },
            rate: {
                required: true,
            },
            tax_type: {
                required: true
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let typeSelectEle = $('#select-box-type');
            if (typeSelectEle.val().length > 1) {
                frm.dataForm['tax_type'] = '2';
            } else {
                frm.dataForm['tax_type'] = typeSelectEle.val()[0];
            }
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-tax').hide();
                        $('#modal-new-tax form')[0].reset();
                        $('#select-box-type').val([0, 1])
                        loadTax()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(form_update_tax).validate({
        rules: {
            title: {
                required: true,
            },
            category: {
                required: true,
            },
            rate: {
                required: true,
            },
            tax_type: {
                required: true
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let tax_type_ele = $('#tax-type')
            if (tax_type_ele.val().length > 1) {
                frm.dataForm['tax_type'] = '2';
            } else {
                frm.dataForm['tax_type'] = tax_type_ele.val()[0];
            }
            frm.dataForm['category'] = $('#select-box-category-update').val();
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-tax').modal('hide');
                        $('#select-box-type').val([0, 1])
                        loadTax()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    // PAYMENTS TERMS handle
    const $termForm = $('#form-create-payment-term');
    const $ModalTermForm = $('#modal-add-table form');


    function PaymentTermsList(dataParams = {}) {
        // init dataTable
        let $tables = $('#datatable-payment-terms');
        $tables.DataTableDefault({
            styleDom: 'small',
            enableVisibleColumns: false,
            ajax: {
                url: $tables.attr('data-url'),
                data: dataParams,
                dataSrc: "data.payment_terms_list",
            },
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            rowCallback: function (row, data, index) {
                $('td:eq(0)', row).html(index + 1);
                // handle onclick btn
                $('.actions-btn a', row).off().on('click', function (e) {
                    e.stopPropagation();
                    let crf = $('[name=csrfmiddlewaretoken]', '#form-create-payment-term').val()
                    let url = $('#url-factory').data('detail').format_url_with_uuid(data.id)
                    DataTableAction.delete(url, crf, row)
                })
                $('.row-title', row).off().on('click', function () {
                    $('#btn-show-modal-create').trigger('click')
                    loadDetailPage($(this).attr('data-href'))
                })
            },
            autoWidth: false,
            columns: [
                {
                    render: (data, type, row) => {
                        return ``
                    },
                    width: '5%',
                },
                {
                    render: (data, type, row) => {
                        return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                    },
                    width: '15%',
                },
                {
                    render: (data, type, row) => {
                        let url = $('#url-factory').attr('data-detail').format_url_with_uuid(row?.['id']);
                        return `<a href="#" data-href="${url}" class="text-primary row-title">${row?.['title']}</a>`
                    },
                    width: '50%',
                },
                {
                    render: (data, type, row) => {
                        let DATA_APPLY_FOR = {
                            0: 'Sale',
                            1: 'Purchase'
                        }
                        return `<span class="badge badge-soft-blue">${DATA_APPLY_FOR[row?.['apply_for']]}</span>`
                    },
                    width: '20%',
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        // if (row?.['is_delete'] === true) {
                        //     return DTBControl.addCommonAction({}, row);
                        // }
                        return `<div class="actions-btn">
                                <a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover delete-btn" title="Delete" href="#" data-id="${row?.['id']}" data-action="delete">
                                   <span class="btn-icon-wrap">
                                        <span class="feather-icon text-danger">
                                            <i class="bi bi-trash"></i>
                                        </span>
                                    </span>
                                   </a>
                            </div>`;
                    },
                    width: '10%',
                }
            ],
            drawCallback: function () {
                // dtbHDCustom();
            },
        });
    }

    function dtbHDCustom() {
        let $table = $('#datatable-payment-terms');
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        if (headerToolbar$.length > 0) {
            if (!$('#btn-recycle-bin').length) {
                let $group = $(`<div class="btn-filter">
                                        <button type="button" class="btn btn-light btn-sm ml-1" id="btn-recycle-bin">
                                            <span><span class="icon"><i class="fas fa-recycle"></i></span><span>Recycle bin</span></span>
                                        </button>
                                    </div>`);
                headerToolbar$.append($group);
                // Select the appended button from the DOM and attach the event listener
                $('#btn-recycle-bin').on('click', function () {
                    if ($.fn.dataTable.isDataTable($table)) {
                        $table.DataTable().destroy();
                    }
                    PaymentTermsList({'is_delete': true});
                });
            }
        }
    }

    function UnitTypeChange() {
        // handle event unit type on change
        let $modalElm = $('#modal-add-table');
        $modalElm.find('[name="unit_type"]').off().on('change', function (e) {
            $(this).removeClass('is-invalid')
            e.stopPropagation();
            if (parseInt(this.value) === 2) {
                $('[name="value"]').removeClass('hidden');
                $('[name="value_amount"]').addClass('hidden');
                $modalElm.find('[name="value"]').prop('readonly', true).val(
                    $('[name="unit_type"] option:selected').text());
            } else if (parseInt(this.value) === 1) {
                $('[name="value"]').addClass('hidden');
                $('[name="value_amount"]').removeClass('hidden')
            } else {
                $('[name="value"]').removeClass('hidden');
                $('[name="value_amount"]').addClass('hidden');
                $modalElm.find('[name="value"]').prop('readonly', false).focus();
            }
        })
    }

    function tableActionRow(elm, data, iEvent) {
        let isAction = $(iEvent.currentTarget).attr('data-action');
        let table_elm = $(elm).parents('table.table');
        let rowIdx = $(table_elm).DataTable().row(elm).index()
        if (isAction === 'edit') {
            $('#modal-add-table form #is_edited').val('true')
            let unit = data.unit_type.hasOwnProperty('value') ? data.unit_type.value : data.unit_type,
                day = data.day_type.hasOwnProperty('value') ? data.day_type.value : data.day_type,
                after = data.after.hasOwnProperty('value') ? data.after.value : data.after;
            let $add_teams = $('#modal-add-table');
            $add_teams.attr('data-table-idx', rowIdx)
            $add_teams.find('[name="title"]').val(data?.['title'])
            if (parseInt(unit) === 0 || parseInt(unit) === 2) {
                $add_teams.find('[name="value"]').val(data.value)
                $add_teams.find('[name="value_amount"]').addClass('hidden')
            } else if (parseInt(unit) === 1) {
                $add_teams.find('[name="value_amount"]').val(data.value)
                $.fn.initMaskMoney2();
                $add_teams.find('[name="value"]').addClass('hidden')
            }
            $add_teams.find('[name="unit_type"]').val(unit).trigger('change')
            $add_teams.find('[name="day_type"]').val(day).trigger('change')
            $add_teams.find('[name="no_of_days"]').val(data.no_of_days)
            $add_teams.find('[name="after"]').val(after).trigger('change')
            $add_teams.modal('show')
        }
        else if (isAction === 'delete'){
            if (data?.unit_type?.value === '2') term_type_list.splice(term_type_list.indexOf(2),1)
            $(table_elm).DataTable().rows(elm).remove().draw();
            const dataList = $(table_elm).DataTable().data().toArray()
            if (dataList.length === 0)
                term_type_list = []
        }
    }

    function termsDataTable() {
        // init dataTable
        let $tables = $('#table_terms');
        $tables.DataTableDefault({
            styleDom: 'small',
            enableVisibleColumns: false,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (settings) { // two parameter is row, data is available
                // reload Init Mask Money
                $.fn.initMaskMoney2();

                // generator index of row
                let api = this.api();
                let rows = api.rows({page: 'current'}).nodes();
                let column = 0; // declare row index who want to auto generator index
                api.column(column, {page: 'current'}).data().each(function (group, i) {
                    // auto increase index row
                    $(rows).eq(i).find('td').eq(column).text(i + 1);
                    $(rows).eq(i).attr('data-order', i + 1)
                });
                let data = api.rows({page: 'current'}).data().toArray();

                let PercentCount = 0;
                if (data && data.length) {
                    let term_type_list = []
                    for (let val of data) {
                        let isValue = val['unit_type'].hasOwnProperty('value') ? val['unit_type'].value : val['unit_type']
                        if (parseInt(isValue) === 0)
                            PercentCount += parseInt(val['value'])
                        term_type_list.push(parseInt(isValue));
                    }
                    term_type_list = [...new Set(term_type_list)]
                }
                // check if update term list do not have balance option
                let $addBtn = $('[data-bs-target="#modal-add-table"]')
                $addBtn.prop('disabled', term_type_list.indexOf(2) !== -1)
                if (PercentCount === 100) $addBtn.prop('disabled', true)
                else if (PercentCount > 100)
                    $.fn.notifyB({
                        description: $('#trans-factory').attr('data-valid-percent')
                    }, 'failure');
            },
            rowCallback: function (row, data) {
                // handle onclick btn
                data['order'] = $(row).attr('data-order');
                $('.actions-btn a', row).off().on('click', function (e) {
                    e.stopPropagation();
                    tableActionRow(row, data, e)
                })
            },
            autoWidth: false,
            columns: [
                {
                    targets: 0,
                    defaultContent: '',
                    width: '5%',
                },
                {
                    targets: 1,
                    render: (row, type, data) => {
                        let textValue = data?.['title'] || '--'
                        return `<p><span>${textValue}</span></p>`
                    },
                    width: '20%',
                },
                {
                    targets: 2,
                    render: (row, type, data) => {
                        let textValue = data.value
                        return `<p><span class="mask-money">${textValue}</span></p>`
                    },
                    width: '15%',
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let txt;
                        if (row.unit_type.hasOwnProperty('text')) // if row data is object
                            txt = row.unit_type.text
                        else // else row data is number
                            txt = $('option[value="' + row.unit_type + '"]', '[name="unit_type"]').text()
                        return `<p>${txt}</p>`
                    },
                    width: '10%',
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<p>${row.no_of_days}</p>`
                    },
                    width: '10%',
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        let txt;
                        if (row.day_type.hasOwnProperty('text')) txt = row.day_type.text
                        else txt = $('option[value="' + row.day_type + '"]', '[name="day_type"]').text()
                        return `<p>${txt}</p>`
                    },
                    width: '15%',
                },
                {
                    targets: 6,
                    width: '15%',
                    render: (data, type, row) => {
                        let txt;
                        if (row.after.hasOwnProperty('text')) txt = row.after.text
                        else txt = $('option[value="' + row.after + '"]', '[name="after"]').text()
                        return `<p>${txt}</p>`
                    },
                },
                {
                    targets: 7,
                    width: '10%',
                    render: (data, type, row) => {
                        let _id = row.order
                        if (row.hasOwnProperty('id') && row.id)
                            _id = row.id
                        return `<div class="actions-btn">
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover"
                                   title="Edit"
                                   href="#"
                                   data-id="${_id}"
                                   data-action="edit">
                                    <span class="btn-icon-wrap"><i class="bi bi-pencil-square"></i></span>
                                </a>
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                   title="Delete"
                                   href="#"
                                   data-id="${_id}"
                                   data-action="delete">
                                    <span class="btn-icon-wrap">
                                        <i class="bi bi-trash"></i>
                                    </span>
                                </a>
                            </div>`;
                    },
                }
            ],
        });
    }

    function loadDetailPage(url) {
        $.fn.callAjax2({
            'url': url,
            'method': 'GET',
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('.btn-add-terms').trigger('click')
                    $('[name="title"]').val(data.title)
                    $('[name="code"]').val(data.code)
                    $('[name="apply_for"]').val(data.apply_for).trigger('change')
                    $('[name="remark"]').val(data.remark)
                    $('[name="payment_terms_id"]').val(data.id)
                    $('#table_terms').DataTable().clear().rows.add(data.term).draw();
                    let temp = []
                    let total_type_0 = 0
                    for (let item of data.term) {
                        temp.push(item.unit_type)
                        if (item.unit_type === 0)
                            total_type_0 += item.value
                    }
                    let term_type_list = []
                    if (temp.length) term_type_list = [...new Set(temp)]
                    // nếu type = balance thì khoá btn
                    // nếu type = 0 thì total value = 100 => khoá
                    if (total_type_0 >= 100 || term_type_list.indexOf(2) !== -1)
                        $('[data-bs-target="#modal-add-table"]').prop('disabled', true)
                }
            }
        )
    }

    // on Unit type changed
    UnitTypeChange()
    // init terms data table
    termsDataTable()
    // init config payment terms list
    PaymentTermsList()
    // create new terms action click
    $('.btn-add-terms').on('click', () => {
        $('.tab-content .tab-pane').removeClass('show active')
        $('#section-create-payment-terms').addClass('show active')
        $('.payment-terms-tabs').removeClass('hidden')
        // $('.btn_add_terms').prop('disabled', false)
        $termForm[0].reset();
        $('#table_terms').DataTable().clear().draw();
    });

    $('[data-bs-target="#modal-add-table"]').on('click', function(){
        $ModalTermForm[0].reset();
        $('#is_edited', $ModalTermForm).val(false);
        $('#modal-add-table').removeAttr('data-table-idx');
        let $modalForm = $('#modal-add-table form');
        $modalForm.find('[name="value"]').removeClass('hidden');
        $modalForm.removeClass('was-validate');
        $modalForm.find('.form-select').removeClass('is-invalid');
    })
    // close btn
    $('.btn-terms-close').click(() => {
        $('#section-create-payment-terms').removeClass('show active')
        $('#section-payment-terms').addClass('show active')
        $('.payment-terms-tabs').addClass('hidden')
        term_type_list = []
    });

    // hide btn when click another tab
    $('a[href="#section-payment-terms"]').on('hide.bs.tab', () => $('.payment-terms-tabs').addClass('hidden'))

    // button on add term
    $('#modal-add-table button[type=submit]').on('click', function () {
        let getIdx = $(this).closest('.modal').attr('data-table-idx');
        let $modalForm = $('form', $(this).closest('.modal-body'))
        let convertData = {}
        convertData['value'] = $('input[name="value"]', $modalForm).val();
        convertData['title'] = $('input[name="title"]', $modalForm).val();

        let value_amount = $('#modal-add-table [name="value_amount"]').valCurrency()
        convertData['unit_type'] = {
            text: $('[name="unit_type"] option:selected', $modalForm).text(),
            value: $('[name="unit_type"]', $modalForm).val()
        }
        convertData['day_type'] = {
            text: $('[name="day_type"] option:selected', $modalForm).text(),
            value: $('[name="day_type"]', $modalForm).val()
        }
        convertData['no_of_days'] = $('#modal-add-table [name="no_of_days"]').val()
        convertData['after'] = {
            text: $('[name="after"] option:selected', $modalForm).text(),
            value: $('[name="after"]', $modalForm).val()
        }
        // valid if user had wrong setup unit type
        let validate_unit_type = true;
        let temp_txt_invalid = {
            0: $transElm.attr('data-terms-mess-1'),
            1: $transElm.attr('data-terms-mess-2'),
            2: $transElm.attr('data-terms-mess-3'),
        }
        if (convertData['unit_type'].value === '0') {
            // loại đơn vị là: phần trăm
            if (term_type_list.indexOf(1) !== -1) {
                // kiềm tra xem có type là 1 hay ko => có type validated else ko valid
                validate_unit_type = false
                $modalForm.find('.invalid-feedback').html(temp_txt_invalid[0])
            }
        }
        else if (convertData['unit_type'].value === '1') {
            // loại đơn vị là: số lượng
            if (term_type_list.indexOf(0) !== -1) {
                // có 0
                validate_unit_type = false
                $modalForm.find('.invalid-feedback').html(temp_txt_invalid[1])
            }
            convertData['value'] = value_amount
        }
        else {
            // loại đơn vị là: cân bằng
            if (term_type_list.indexOf(2) !== -1 && $('#is_edited').val() !== 'true') {
                // có 2
                validate_unit_type = false
                $modalForm.find('.invalid-feedback').html(temp_txt_invalid[2])
            }
        }

        if (!validate_unit_type) {
            $('[name="unit_type"]', $modalForm).addClass('is-invalid')
            $modalForm.addClass('was-validate')
            return false
        }
        else {
            $modalForm.removeClass('was-validate');
            $('[name="unit_type"]', $modalForm).removeClass('is-invalid');
        }
        // end validate

        if (!convertData.unit_type.value || (!convertData.value && convertData.unit_type.value === '0')
            || (!value_amount && convertData.unit_type.value === '1')
            || !convertData.day_type.value || !convertData.after.value || !convertData.no_of_days) {
            let txtKey = !convertData.day_type.value ?
                'day_type' : !convertData.unit_type.value ? 'unit_type' : !convertData.no_of_days ?
                    'no_of_days' : 'after';
            if ((!convertData.value && convertData.unit_type.value === '0')
                || (!value_amount && convertData.unit_type.value === '1')) txtKey = 'value'
            let errorTxt = $transElm.data('terms-' + txtKey)
            $.fn.notifyB({description: errorTxt}, 'failure')
            return false
        }
        if (getIdx !== undefined && typeof parseInt(getIdx) === 'number')
            $('#table_terms').DataTable().row(getIdx).data(convertData).draw()
        else $('#table_terms').DataTable().row.add(convertData).draw()
        $('#modal-add-table').modal('hide');
    });

    // form create submit
    $termForm.on('submit', function (e) {
        e.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let formID = $('[name="payment_terms_id"]').val()
        let _form = new SetupFormSubmit($termForm);
        let tableTerms = $('#table_terms').DataTable().data().toArray();
        for (let idx in tableTerms) {
            let item = tableTerms[idx]
            item.unit_type = item.unit_type.hasOwnProperty('value') ? item.unit_type.value : item.unit_type
            item.day_type = item.day_type.hasOwnProperty('value') ? item.day_type.value : item.day_type
            item.after = item.after.hasOwnProperty('value') ? item.after.value : item.after
            item.order = parseInt(idx) + 1
        }
        if (!_form.dataForm['title']) {
            $.fn.notifyB({description: "Title is required"}, 'failure');
            return false
        }
        if (!tableTerms.length) {
            $.fn.notifyB({description: "Term must be at least one rows"}, 'failure');
            return false
        }
        _form.dataForm['term'] = tableTerms;
        if (formID) {
            _form.dataUrl = $('#url-factory').attr('data-detail').format_url_with_uuid(formID)
            _form.dataMethod = 'PUT'
        }
        $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_item = {
                            'id': data.id,
                            'title': data.title,
                            'code': data.code,
                            'apply_for': data.apply_for
                        }
                        if (formID) {
                            data_item = _form.dataForm
                        }
                        $.fn.notifyB({description: data.message}, 'success')
                        $('#btn-back-payment').trigger('click');
                        let $table = $('#datatable-payment-terms');
                        let defaultData = $table.DataTable().data().toArray();
                        if (!formID) defaultData.unshift(data_item);
                        else {
                            // is edit term
                            for (let [idx, term] of defaultData.entries()) {
                                if (formID === term.id) {
                                    defaultData[idx] = {
                                        apply_for: parseInt(data_item.apply_for),
                                        id: formID,
                                        title: data_item.title,
                                        code: data_item.code,
                                        remark: data_item.remark,
                                        term: data_item.term
                                    }
                                    break;
                                }
                            }
                        }
                        $table.DataTable().clear().draw()
                        $table.DataTable().rows.add(defaultData).draw();

                    }
                }
            )
    })

})
