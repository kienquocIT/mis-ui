let term_type_list = [];
let PercentCount = 0;
let $transElm = $('#trans-factory');
$(document).ready(function () {

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

        switch (section) {
            case 'section-currency':
                loadCurrency();
                break;
            case 'section-tax':
                loadTax();
                loadTaxCategory();
                break;
            case 'section-tax-category':
                loadTaxCategory();
                break;
        }
    })

    $('#btn-show-modal-create').on('click', function () {
        $('.modal-body .form-control').val('');
        $('.modal-body .form-select').prop("selectedIndex", -1);
        $('.modal-body .select2').val(null).trigger("change");
        $('#form-create-payment-term')[0].reset();
        $('#table_terms').DataTable().clear().draw();
        $('[data-bs-target="#modal-add-table"]').prop('disabled', false)
        if (!$(this).attr('data-bs-target')) {
            $(".lookup-data").hide();
            $('#section-create-payment-terms').show();
            $(this).hide();
            $('#btn-save-payment').show();
            $('#btn-back-payment').show();
            $('[name="payment_terms_id"]').val('')
        }
    })

    $('#btn-back-payment').on('click', function () {
        $('#btn-save-payment').hide();
        $(this).hide();
        $('#section-payment-terms').show();
        $('#section-create-payment-terms').hide();
        $('#btn-show-modal-create').show();
    })

    function loadCurrency() {
        if (!$.fn.DataTable.isDataTable('#datatable-currency')) {
            let tbl = $('#datatable-currency');
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
                            if (data && resp.data.hasOwnProperty('currency_list')) {
                                let vndCurrency = $.grep(resp.data['currency_list'], function (currency) {
                                    return currency.abbreviation === "VND";
                                })[0];
                                if (vndCurrency !== undefined && vndCurrency.is_primary) {
                                    for (let i = 0; i < resp.data['currency_list'].length; i++) {
                                        resp.data['currency_list'][i]['round_number'] = 2;
                                    }
                                } else {
                                    for (let i = 0; i < resp.data['currency_list'].length; i++) {
                                        resp.data['currency_list'][i]['round_number'] = 5;
                                    }
                                }

                                resp.data['currency_list'].map(function (item) {
                                    if (item.is_primary === true) {
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
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<a><span><b>{0}</b></span></a>`.format_by_idx(
                                    data,
                                )
                            }
                        },
                        {
                            data: 'abbreviation',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                if (row.is_default === false) {
                                    return `<span style="width: 50%;" class="badge badge-soft-primary badge-pill"><b>{0}</b></span></a>`.format_by_idx(
                                        data
                                    )
                                } else {
                                    return `<span style="width: 50%;" class="badge badge-soft-red badge-pill"><b></b>{0}</span></a>`.format_by_idx(
                                        data
                                    )
                                }
                            }
                        },
                        {
                            data: 'rate',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                if (data !== null) {
                                    if (row.is_primary === true) {
                                        return `<span class="badge badge-success badge-indicator badge-indicator-xl"></span>`
                                    } else {
                                        return `<span>{0}</span>`.format_by_idx(
                                            data.toLocaleString('en-US', {minimumFractionDigits: row.round_number})
                                        )
                                    }
                                } else {
                                    return ``;
                                }
                            }
                        }, {
                            render: (data, type, row, meta) => {
                                if (row.is_default === false) {
                                    return `<a data-id="` + row.id + `" class="btn btn-icon btn-flush-dark btn-rounded del-button del-btn-currency" data-bs-toggle="tooltip" data-bs-placement="top" data-id="` + row.id + `" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`.format_by_idx(
                                        row.id
                                    );
                                } else {
                                    return `<a class="btn btn-icon"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                                }
                            }
                        }
                    ],
                },
            );
        }
    }

    function loadTax() {
        if (!$.fn.DataTable.isDataTable('#datatable-tax')) {
            let tbl = $('#datatable-tax');
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
                            if (data && resp.data.hasOwnProperty('tax_list')) {
                                return resp.data['tax_list'] ? resp.data['tax_list'] : []
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
                                return `<a class="badge badge-outline badge-soft-success btn-detail" data-id="{0}" data-bs-toggle="modal"
                                        data-bs-target="#modal-detail-tax" style="min-width: max-content; width: 100%" href="#"><span><b>{1}</b></span></a>`.format_by_idx(
                                    row.id, data
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
                            data: 'type',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                if (data === 0) {
                                    return `<div class="row">
                                            <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-danger badge-pill" style="min-width: max-content; width: 100%">Sale</span></div>
                                            </div>`
                                } else if (data === 1) {
                                    return `<div class="row">
                                            <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-blue badge-pill" style="min-width: max-content; width: 100%">Purchase</span></div>
                                            </div>`
                                } else if (data === 2) {
                                    return `<div class="row">
                                            <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-danger badge-pill" style="min-width: max-content; width: 100%">Sale</span></div>
                                            <div class="col-6" style="padding-left: 5px"><span class="badge badge-soft-blue badge-pill" style="min-width: max-content; width: 100%">Purchase</span></div>
                                            </div>`
                                } else {
                                    return ``;
                                }
                            }
                        }, {
                            data: 'category',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                if (row.category) {
                                    return `<span class="badge badge-soft-primary badge-pill" style="min-width: max-content; width: 100%">{0}</span>`.format_by_idx(data.title)
                                } else {
                                    return `<span></span>`
                                }
                            }
                        }, {
                            data: 'rate',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                if (data >= 0) {
                                    return `<span class="badge badge-soft-pink badge-pill" style="min-width: max-content; width: 100%">{0}%</span>`.format_by_idx(data)
                                } else {
                                    return `<span></span>`
                                }
                            }
                        }, {
                            render: (data, type, row, meta) => {
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded del-button" data-bs-toggle="tooltip" data-bs-placement="top" data-id="{0}" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`.format_by_idx(
                                    row.id
                                );

                            }
                        }
                    ],
                },
            );
        }
    }

    $('#select-box-category-create').initSelect2();

    function loadTaxCategory() {
        if (!$.fn.DataTable.isDataTable('#datatable-tax-category')) {
            let tbl = $('#datatable-tax-category');
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
                            if (data && resp.data.hasOwnProperty('tax_category_list')) {
                                return resp.data['tax_category_list'] ? resp.data['tax_category_list'] : []
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
                                if (row.is_default === false) {
                                    return `<a class="btn-detail" href="#" data-bs-toggle="modal"
                                            data-bs-target="#modal-detail-tax-category" data-id="{0}">
                                            <span><b>{1}</b></span>
                                            </a>`.format_by_idx(row.id, data)
                                } else {
                                    return `<a>
                                            <span><b>{0}</b></span>
                                            </a>`.format_by_idx(data)
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
                    ],
                },
            );
        }
    }

    // load Base Currency (Master data)
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

    loadBaseCurrency();
    loadCurrency();

//submit form create tax category
    let form_create_tax_category = $('#form-create-tax-category')
    SetupFormSubmit.validate(
        form_create_tax_category,
        {
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
                            $('#modal-section-tax-category').modal('hide');
                            $('#datatable-tax-category').DataTable().ajax.reload();
                        }
                    },
                    (errs) => {
                    }
                )
            }
        })

//submit form create tax
    let form_create_tax = $('#form-create-tax')
    SetupFormSubmit.validate(
        form_create_tax,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                if ($('#select-box-type').val().length > 1) {
                    frm.dataForm['type'] = '2';
                } else {
                    frm.dataForm['type'] = $('#select-box-type').val()[0];
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
                            $('#modal-section-tax').hide();
                            $('#datatable-tax').DataTable().ajax.reload();
                        }
                    },
                    (errs) => {

                    }
                )
            }
        })

    let url_detail = ''
// show detail tax
    $(document).on('click', '#datatable-tax .btn-detail', function () {
        url_detail = $('#form-update-tax').attr('data-url').format_url_with_uuid($(this).attr('data-id'));
        $.fn.callAjax2({
            'url': url_detail,
            'method': 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax')) {
                        $('#tax-title').val(data.tax.title);
                        $('#tax-code').val(data.tax.code);
                        $('#tax-rate').val(data.tax.rate);
                        $('#select-box-category-update').initSelect2({
                            'data': data.tax.category
                        })
                        if (data.tax.type === 0) {
                            $('#tax-type').val(['0']).trigger("change");
                        } else if (data.tax.type === 1) {
                            $('#tax-type').val(['1']).trigger("change");
                        } else {
                            $('#tax-type').val(['0', '1']).trigger("change");
                        }
                    }
                }
            })
    })

// show detail tax category
    $(document).on('click', '#datatable-tax-category .btn-detail', function () {
        url_detail = $('#form-update-tax-category').attr('data-url').format_url_with_uuid($(this).attr('data-id'));
        $.fn.callAjax2({
            'url': url_detail,
            'method': 'GET',
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_category')) {
                        $('#tax-category-title').val(data?.['tax_category'].title)
                        $('#tax-category-description').val(data?.['tax_category'].description)
                    }
                }
            })
    })

//form update tax
    let form_update_tax = $('#form-update-tax')
    SetupFormSubmit.validate(
        form_update_tax,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                let tax_type_ele = $('#tax-type')
                if (tax_type_ele.val().length > 1) {
                    frm.dataForm['type'] = '2';
                } else {
                    frm.dataForm['type'] = tax_type_ele.val()[0];
                }
                frm.dataForm['category'] = $('#select-box-category-update').val();
                $.fn.callAjax2({
                    'url': url_detail,
                    'method': frm.dataMethod,
                    'data': frm.dataForm
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $('#modal-detail-tax').modal('hide');
                            $('#datatable-tax').DataTable().ajax.reload();
                        }
                    },
                    (errs) => {
                    }
                )
            }
        })

//form update tax category
    let form_update_tax_category = $('#form-update-tax-category')
    SetupFormSubmit.validate(
        form_update_tax_category,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
        $.fn.callAjax2({
            'url': url_detail,
            'method': frm.dataMethod,
            'data': frm.dataForm,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $('#modal-detail-tax-category').modal('hide');
                    $('#datatable-tax-category').DataTable().ajax.reload();
                }
            },
            (errs) => {
            }
        )
    }})

// form create currency
    let form_create_currency = $('#form-create-currency')
    SetupFormSubmit.validate(
        form_create_currency,
        {
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
                    $('#modal-section-currency').modal('hide');
                    $('#datatable-currency').DataTable().ajax.reload();
                }
            },
            (errs) => {

            }
        )
    }})


// show detail currency
    $(document).on('click', '#datatable-currency .btn-detail', function () {
        $('#currency-title').closest('div').find('span').text('*')
        $('#currency-abbreviation').closest('div').find('span').text('*')
        url_detail = $('#form-update-currency').attr('data-url').replace(0, $(this).attr('data-id'))
        $.fn.callAjax2({
            'url': url_detail,
            'method': 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency')) {
                        $('#currency-title').val(data.currency.title);
                        $('#currency-abbreviation').val(data.currency.abbreviation);
                        $('#currency-rate').val(data.currency.rate);
                    }
                }
            })
    })

// delete currency
    $(document).on("click", '.del-btn-currency', function () {
        Swal.fire({
            html:
                '<div><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>' +
                '<h6 class="text-danger">Delete currency ?</h6>',
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-danger',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container: 'swal2-has-bg'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                let data_url = $('#form-create-currency').attr('data-url-delete').replace(0, $(this).attr('data-id'))
                $.fn.callAjax2({
                    'url': data_url,
                    'method': 'PUT',
                    'data': {}
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(function () {
                                location.reload()
                            }, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyB({description: errs.data.errors}, 'failure');
                        Swal.fire({
                            html:
                                '<div><h6 class="text-danger mb-0">Source Price List can not be deleted!</h6></div>',
                            customClass: {
                                content: 'text-center',
                                confirmButton: 'btn btn-primary',
                            },
                            buttonsStyling: false,
                        })
                    })
            }
        })
    });

    // sync selling rate from VietComBank
    $(document).on("click", '#sync-from-VCB-button', function () {
        $('#sync-from-VCB-button').html('In Sync... &nbsp;<i class="bi bi-arrow-repeat"></i>')
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
                    setTimeout(function () {
                        $('#sync-from-VCB-button').text('Sync with VCB &nbsp;')
                        $('#datatable-currency').DataTable().ajax.reload();
                    }, 0);
                }
            },
            (errs) => {
            }
        )
    });

// PAYMENTS TERMS handle

    function PaymentTermsList() {
        // init dataTable
        let $tables = $('#datatable-payment-terms');
        $tables.DataTableDefault({
            ajax: {
                url: $tables.attr('data-url'),
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
                    DataTableAction.delete(url, data, crf, row)
                })
                $('.row-title', row).off().on('click', function () {
                    $('#btn-show-modal-create').trigger('click')
                    loadDetailPage($(this).attr('data-href'))
                })
            },
            columns: [
                {
                    targets: 0,
                    defaultContent: ''
                },
                {
                    targets: 1,
                    render: (row, type, data) => {
                        let url = $('#url-factory').data('detail').format_url_with_uuid(data.id);
                        return `<p><a href="#" data-href="${url}" 
                            class="text-primary text-decoration-underline row-title">${data.title}</a></p>`
                    }
                },
                {
                    targets: 2,
                    render: (row, type, data) => {
                        let DATA_APPLY_FOR = {
                            0: 'Sale',
                            1: 'Purchase'
                        }
                        return `<p>${DATA_APPLY_FOR[data.apply_for]}</p>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<div class="actions-btn">
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                   title="Delete"
                                   href="#"
                                   data-id="${row.id}"
                                   data-action="delete">
                                   <span class="icon-wrap">
                                   <i class="fa-regular fa-trash-can"></i></span></a>
                            </div>`;
                    },
                }
            ],
        });
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

    /**
     * declare action delete/edit button of terms DataTable
     * @param elm element of button
     * @param data data of row had object format
     * @param iEvent event object of element on click
     */

    function tableActionRow(elm, data, iEvent) {
        let isAction = $(iEvent.currentTarget).attr('data-action');
        let table_elm = $(elm).parents('table.table');
        let rowIdx = $(table_elm).DataTable().row(elm).index()
        if (isAction === 'edit') {
            let unit = data.unit_type.hasOwnProperty('value') ? data.unit_type.value : data.unit_type,
                day = data.day_type.hasOwnProperty('value') ? data.day_type.value : data.day_type,
                after = data.after.hasOwnProperty('value') ? data.after.value : data.after;
            let $add_teams = $('#modal-add-table');
            $add_teams.attr('data-table-idx', rowIdx)
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
        } else if (isAction === 'delete') $(table_elm).DataTable().rows(elm).remove().draw();
    }

    function termsDataTable() {
        // init dataTable
        let $tables = $('#table_terms');
        $tables.DataTable({
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (settings) { // two parameter is row, data is available
                // reload Init Mask Money
                $.fn.initMaskMoney2();

                // render icon after table callback
                feather.replace();
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

                if (data && data.length) {
                    term_type_list = []
                    PercentCount = 0;
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
            columns: [
                {
                    targets: 0,
                    defaultContent: ''
                },
                {
                    targets: 1,
                    render: (row, type, data) => {
                        let textValue = data.value
                        let UnitType = parseInt(data.unit_type.value ? data.unit_type.value : data.unit_type)
                        return `<p><span class="mask-money">${textValue}</span></p>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let txt;
                        if (row.unit_type.hasOwnProperty('text')) // if row data is object
                            txt = row.unit_type.text
                        else // else row data is number
                            txt = $('option[value="' + row.unit_type + '"]', '[name="unit_type"]').text()
                        return `<p>${txt}</p>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<p>${row.no_of_days}</p>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let txt;
                        if (row.day_type.hasOwnProperty('text')) txt = row.day_type.text
                        else txt = $('option[value="' + row.day_type + '"]', '[name="day_type"]').text()
                        return `<p>${txt}</p>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        let txt;
                        if (row.after.hasOwnProperty('text')) txt = row.after.text
                        else txt = $('option[value="' + row.after + '"]', '[name="after"]').text()
                        return `<p>${txt}</p>`
                    }
                },
                {
                    targets: 6,
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
                                    <span class="feather-icon">
                                        <i data-feather="edit"></i>
                                    </span>
                                </a>
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                   title="Delete"
                                   href="#"
                                   data-id="${_id}"
                                   data-action="delete">
                                    <span class="btn-icon-wrap">
                                        <span class="feather-icon">
                                            <i data-feather="trash-2"></i>
                                        </span>
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
                    $('#modal-add-table form #is_edited').val('true')
                    $('[name="title"]').val(data.title)
                    $('[name="apply_for"]').val(data.apply_for).trigger('change')
                    $('[name="remark"]').val(data.remark)
                    $('[name="payment_terms_id"]').val(data.id)
                    $('#table_terms').DataTable().clear().draw();
                    $('#table_terms').DataTable().rows.add(data.term).draw();
                    let temp = []
                    let total_type_0 = 0
                    for (let item of data.term) {
                        temp.push(item.unit_type)
                        if (item.unit_type === 0)
                            total_type_0 += item.value
                    }
                    term_type_list = [...new Set(temp)]
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
    // button on add term
    $('#modal-add-table button[type=submit]').off().on('click', function () {
        let getIdx = $(this).closest('.modal').attr('data-table-idx');
        let $modalForm = $('form', $(this).closest('.modal-body'))
        let convertData = {}
        convertData['value'] = $('#modal-add-table [name="value"]').val()
        let value_amount = $('#modal-add-table [name="value_amount"]').valCurrency()
        convertData['unit_type'] = {
            text: $('#modal-add-table [name="unit_type"] option:selected').text(),
            value: $('#modal-add-table [name="unit_type"]').val()
        }
        convertData['day_type'] = {
            text: $('#modal-add-table [name="day_type"] option:selected').text(),
            value: $('#modal-add-table [name="day_type"]').val()
        }
        convertData['no_of_days'] = $('#modal-add-table [name="no_of_days"]').val();
        convertData['after'] = {
            text: $('#modal-add-table [name="after"] option:selected').text(),
            value: $('#modal-add-table [name="after"]').val()
        }
        // valid if user had wrong setup unit type
        let validate_unit_type = true;
        let temp_txt_invalid = {
            0: $transElm.attr('data-terms-mess-1'),
            1: $transElm.attr('data-terms-mess-2'),
            2: $transElm.attr('data-terms-mess-3'),
        }
        if (convertData['unit_type'].value === '0') {
            if (term_type_list.indexOf(1) !== -1) {
                // có 1
                validate_unit_type = false
                $modalForm.find('.invalid-feedback').html(temp_txt_invalid[0])
            }
        } else if (convertData['unit_type'].value === '1') {
            if (term_type_list.indexOf(0) !== -1) {
                // có 0
                validate_unit_type = false
                $modalForm.find('.invalid-feedback').html(temp_txt_invalid[1])
            }
            convertData['value'] = value_amount
        } else {
            if (term_type_list.indexOf(2) !== -1 && $('#is_edited').val() !== 'true') {
                // có 2
                validate_unit_type = false
                $modalForm.find('.invalid-feedback').html(temp_txt_invalid[2])
            }
        }

        if (!validate_unit_type) {
            $('#modal-add-table [name="unit_type"]').addClass('is-invalid')
            $modalForm.addClass('was-validate')
            return false
        } else {
            $modalForm.removeClass('was-validate');
            $('#modal-add-table [name="unit_type"]').removeClass('is-invalid');
        }
        // end validate

        if (!convertData.unit_type.value
            || (!convertData.value && convertData.unit_type.value === '0')
            || (!value_amount && convertData.unit_type.value === '1')
            || !convertData.day_type.value
            || !convertData.after.value
            || !convertData.no_of_days) {
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
    // create new terms
    $('[data-bs-target="#modal-add-table"]').off().on('click', () => {
        $('#modal-add-table').removeAttr('data-table-idx');
        let $modalForm = $('#modal-add-table form');
        $modalForm[0].reset();
        $modalForm.find('[name="value"]').removeClass('hidden')
        $modalForm.find('[name="value_amount"]').addClass('hidden')
        $modalForm.removeClass('was-validate');
        $modalForm.find('.form-select').removeClass('is-invalid')
    })

    // form create submit
    $('#btn-save-payment').off().on('click', function () {
        let $form = $('#form-create-payment-term')
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let formID = $('[name="payment_terms_id"]').val()
        let _form = new SetupFormSubmit($form);
        let tableTerms = $('#table_terms').DataTable().data().toArray();
        for (let item of tableTerms) {
            item.unit_type = item.unit_type.hasOwnProperty('value') ? item.unit_type.value : item.unit_type
            item.day_type = item.day_type.hasOwnProperty('value') ? item.day_type.value : item.day_type
            item.after = item.after.hasOwnProperty('value') ? item.after.value : item.after
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
