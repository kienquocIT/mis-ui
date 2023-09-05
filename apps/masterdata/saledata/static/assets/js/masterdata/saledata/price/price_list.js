let urlEle = $('#url-factory');
$(document).ready(function () {
    let selectCurrencyEle = $('#select-box-currency');
    let priceListSelectEle = $('#select-box-price-list');
    $('#select-box-type').initSelect2();

    function loadPriceList(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    function loadCurrency(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    loadCurrency(selectCurrencyEle);
    $(document).on('click', '#btn-add-new', function () {
        loadPriceList(priceListSelectEle);
    })

    function loadDtbPriceList() {
        if (!$.fn.DataTable.isDataTable('#datatable-price-list')) {
            let $table = $('#datatable-price-list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('price_list')) {
                            return resp.data['price_list'] ? resp.data['price_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },

                columns: [
                    {
                        render: () => {
                            return ``;
                        }
                    }, {
                        data: 'title',
                        render: (data, type, row) => {
                            return `<a class="btn-detail" href="${urlEle.data('url-detail').format_url_with_uuid(row.id)}">
                                        <span><b>${data}</b></span>
                                    </a>`

                        }
                    }, {
                        data: 'price_list_type',
                        className: 'text-center',
                        render: (data) => {
                            if (data.value === 0) {
                                return `<span style="width: 20%; min-width: max-content" class="badge badge-soft-danger badge-pill">${data.name}</span>`
                            } else if (data.value === 1) {
                                return `<span style="width: 20%; min-width: max-content" class="badge badge-soft-indigo badge-pill">${data.name}</span>`
                            } else if (data.value === 2) {
                                return `<span style="width: 20%; min-width: max-content" class="badge badge-soft-green badge-pill">${data.name}</span>`
                            } else {
                                return ''
                            }
                        }
                    }, {
                        data: 'status',
                        render: (data) => {
                            let badge_type;
                            if (data === 'Valid') {
                                badge_type = 'text-success'
                            } else if (data === 'Invalid') {
                                badge_type = 'text-orange'
                            } else if (data === 'Expired') {
                                badge_type = 'text-danger'
                            } else {
                                badge_type = 'text-gray'
                            }

                            return `<span class="${badge_type}">${data}</span>`;
                        }
                    }, {
                        className: 'action-center',
                        render: (data, type, row) => {
                            if (row.is_default === false) {
                                return `<a data-method="DELETE" data-id="${row.id}" class="btn btn-icon btn-del btn btn-icon btn-flush-danger flush-soft-hover btn-rounded del-button delete-price-list-btn">
                                    <span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span>
                                    </a>`;
                            } else {
                                return ``
                            }
                        }
                    }
                ],
            });
        }
    }

    loadDtbPriceList();

    //logic checkbox
    $('#checkbox-copy-source').on('change', function () {
        if ($(this).prop("checked")) {
            priceListSelectEle.removeAttr('disabled');
            $('#checkbox-update-auto').removeAttr('disabled');
            $('#select-box-currency').prop('disabled', true);
            $('#factor-inp').prop('readonly', false);
        } else {
            let check_auto_update_ele = $('#checkbox-update-auto');
            let check_can_del_ele = $('#checkbox-can-delete');
            let factor_ele = $('#factor-inp')
            check_auto_update_ele.prop('checked', false);
            check_can_del_ele.prop('checked', false);
            priceListSelectEle.attr('disabled', 'disabled');
            priceListSelectEle.find('option').prop('selected', false);
            check_auto_update_ele.attr('disabled', 'disabled');
            check_can_del_ele.attr('disabled', 'disabled');
            $('#select-box-currency').prop('disabled', false);
            factor_ele.val(1);
            factor_ele.prop('readonly', true);
        }
    })

    $('#checkbox-update-auto').on('change', function () {
        if ($(this).prop("checked")) {
            $('#checkbox-can-delete').removeAttr('disabled');
            $('#factor-inp').val('');
        } else {
            let check_can_del_ele = $('#checkbox-can-delete')
            check_can_del_ele.prop('checked', false);
            check_can_del_ele.attr('disabled', 'disabled');
            $('#factor-inp').val(1);
        }
    })

    // submit form create price list
    let frm = $('#form-create-price');
    SetupFormSubmit.validate(
        frm,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));

                frm.dataForm['currency'] = selectCurrencyEle.val();
                if (frm.dataForm['currency'].length === 0) {
                    frm.dataForm['currency'] = null;
                }

                let valid_time_ele = $('#valid_time')
                if (valid_time_ele.val()) {
                    frm.dataForm['valid_time_start'] = valid_time_ele.val().split(' - ')[0];
                    frm.dataForm['valid_time_end'] = valid_time_ele.val().split(' - ')[1]
                }

                frm.dataForm['auto_update'] = !!$('[name="auto_update"]').is(':checked');
                frm.dataForm['can_delete'] = !!$('[name="can_delete"]').is(':checked');

                $.fn.callAjax2({
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm
                }).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            }
        });

    // onchange select box select-box-price-list
    priceListSelectEle.on('change', function () {
        let data_url = $(this).data('url-detail').format_url_with_uuid($(this).val());
        $.fn.callAjax2({
            url: data_url,
            method: 'GET'
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('price')) {
                    loadCurrency(selectCurrencyEle, data.price.currency);
                }
            }
        })
    })

    // function load

    /* Date range picker with times*/
    $('#valid_time').daterangepicker({
        timePicker: true,
        startDate: moment().startOf('millisecond').add(5, 'minutes'),
        endDate: moment().startOf('millisecond').add(24, 'millisecond').add(5, 'minutes'),
        "cancelClass": "btn-secondary",
        locale: {
            format: 'YYYY-MM-DD HH:mm'
        },
        drops: 'up'
    });

    $(document).on("click", '.delete-price-list-btn', function () {

        Swal.fire({
            html: '<div><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>' + '<h6 class="text-danger">Delete Price List ?</h6>',
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
                let data_url = $(this).closest('table').attr('data-url-delete').replace(0, $(this).attr('data-id'))
                $.fn.callAjax2({
                    url: data_url,
                    method: 'PUT',
                    data: {},
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(function () {
                            location.reload()
                        }, 1000);
                    }
                }, () => {
                    Swal.fire({
                        html: '<div><h6 class="text-danger mb-0">Source/Non-empty Price List can not be deleted!</h6></div>',
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

})
