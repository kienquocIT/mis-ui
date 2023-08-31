$(document).ready(function () {
    $('#select-box-type').initSelect2();

    function loadPriceList(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    let selectCurrencyEle = $('#select-box-currency');
    function loadCurrency(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }
    loadCurrency(selectCurrencyEle);

    $(document).on('click', '#btn-add-new', function () {
        loadPriceList(priceListSelectEle);
    })

    let tbl = $('#datatable-price-list');
    let url_detail = tbl.attr('data-url-detail');
    tbl.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        ajax: {
            useDataServer: true,
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('price_list')) {
                    return data['price_list'];
                }
                return [];
            },
        },
        columns: [
            {
                'render': () => {
                    return ``;
                }
            }, {
                'data': 'title',
                render: (data, type, row) => {
                    if (row.is_default) {
                        return `<a class="btn-detail" href="` + url_detail.replace(0, row.id) + `">
                            <span><b>` + row.title.toUpperCase() + `</b></span>
                        </a>`
                    } else {
                        return `<a class="btn-detail" href="` + url_detail.replace(0, row.id) + `">
                            <span><b>` + row.title + `</b></span>
                        </a>`
                    }
                }
            }, {
                'data': 'type',
                className: 'text-center',
                render: (data, type, row) => {
                    if (row?.['price_list_type'].value === 0) {
                        return `<span style="width: 50%" class="text-indigo">` + row?.['price_list_type'].name + `</span>`
                    } else if (row?.['price_list_type'].value === 1) {
                        return `<span style="width: 50%" class="text-yellow">` + row?.['price_list_type'].name + `</span>`
                    } else if (row?.['price_list_type'].value === 2) {
                        return `<span style="width: 50%" class="text-green">` + row?.['price_list_type'].name + `</span>`
                    } else {
                        return ''
                    }
                }
            }, {
                'data': 'status',
                render: (data, type, row) => {
                    let badge_type;
                    if (row.status === 'Valid') {
                        badge_type = 'badge-success'
                    } else if (row.status === 'Invalid') {
                        badge_type = 'badge-orange'
                    } else if (row.status === 'Expired') {
                        badge_type = 'badge-danger'
                    } else {
                        badge_type = 'badge-gray'
                    }
                    return `<span class="badge-status">
                                <span class="badge ${badge_type} badge-indicator"></span>
                                <span class="badge-label">${row.status}</span>
                            </span>`
                }
            }, {
                'className': 'action-center text-right',
                'render': (data, type, row) => {
                    if (row.is_default === false) {
                        return `<a data-method="DELETE" data-id="` + row.id + `" class="btn btn-icon btn-del btn btn-icon btn-flush-danger flush-soft-hover btn-rounded del-button delete-price-list-btn">
                                <span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span>
                                </a>`;
                    } else {
                        return ``
                    }
                }
            }
        ],
    })

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

    let priceListSelectEle = $('#select-box-price-list');
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
                let csr = $("input[name=csrfmiddlewaretoken]").val();
                $.fn.callAjax(data_url, 'PUT', {}, csr)
                    .then((resp) => {
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

    let frm = $('#form-create-price')
    frm.submit(function (event) {
        event.preventDefault();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['currency'] = selectCurrencyEle.val();
        if (frm.dataForm['currency'].length === 0) {
            frm.dataForm['currency'] = null;
        }
        console.log(frm.dataForm['currency']);

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
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                }
            })
    });
})
