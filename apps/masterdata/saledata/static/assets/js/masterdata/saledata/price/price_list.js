$(document).ready(function () {
    let selectCurrencyEle = $('#select-box-currency');

    function loadCurrency() {
        selectCurrencyEle.select2();
        let url = selectCurrencyEle.attr('data-url');
        let method = selectCurrencyEle.attr('data-method');
        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                selectCurrencyEle.text("");
                if (data.hasOwnProperty('currency_list') && Array.isArray(data.currency_list)) {
                    data.currency_list.map(function (item) {
                        if (item?.['is_primary']) {
                            selectCurrencyEle.append(`<option disabled data-primary="1" value="${item.id}" selected>${item.title}</option>`);
                        } else selectCurrencyEle.append(`<option data-primary="0" value="${item.id}">${item.title}</option>`);
                    })
                }
            }
        })
    }

    loadCurrency();

    let tbl = $('#datatable-price-list');
    let url_detail = tbl.attr('data-url-detail');
    tbl.DataTableDefault({
        rowIdx: true,
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('price_list')) {
                    let ele = $('#select-box-price-list');
                    ele.html('');
                    ele.append(`<option></option>`)
                    data.price_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                    })

                    return data['price_list'];
                }
                return [];
            },
        },
        columns: [
            {
                'render': (data, type, row, meta) => {
                    return ``;
                }
            }, {
                'data': 'title',
                'className': 'action-center',
                render: (data, type, row, meta) => {
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
                'className': 'action-center',
                render: (data, type, row, meta) => {
                    return `<span class="text-secondary">` + row.price_list_type.name + `</span>`
                }
            }, {
                'data': 'status',
                'className': 'action-center',
                render: (data, type, row, meta) => {
                    let badge_type = '';
                    if (row.status === 'Valid') {
                        badge_type = 'text-success'
                    } else if (row.status === 'Invalid') {
                        badge_type = 'text-orange'
                    } else if (row.status === 'Expired') {
                        badge_type = 'text-danger'
                    } else {
                        badge_type = 'text-gray'
                    }

                    return `<span class="` + badge_type + `">&nbsp;` + row.status + `</span>`;
                }
            }, {
                'className': 'action-center',
                'render': (data, type, row, meta) => {
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

    $('#btn-show-modal-create').on('click', function () {
        let primaryOption = $('#select-box-currency').find('option[data-primary="1"]').text();
        $('ul').find(`li[title="` + primaryOption + `"]`).find('span').prop('hidden', true);
    })
    selectCurrencyEle.on('change', function () {
        let primaryOption = $('#select-box-currency').find('option[data-primary="1"]').text();
        $('ul').find(`li[title="` + primaryOption + `"]`).find('span').prop('hidden', true);
    })

    //logic checkbox
    $('#checkbox-copy-source').on('change', function () {
        if ($(this).prop("checked")) {
            $('#select-box-price-list').removeAttr('disabled');
            $('#checkbox-update-auto').removeAttr('disabled');
            $('#select-box-currency').prop('disabled', true);
            $('#factor-inp').prop('readonly', false);
        } else {
            $('#checkbox-update-auto').prop('checked', false);
            $('#checkbox-can-delete').prop('checked', false);
            $('#select-box-price-list').attr('disabled', 'disabled');
            $('#select-box-price-list').find('option').prop('selected', false);
            $('#checkbox-update-auto').attr('disabled', 'disabled');
            $('#checkbox-can-delete').attr('disabled', 'disabled');
            $('#select-box-currency').prop('disabled', false);
            $('#factor-inp').val(1);
            $('#factor-inp').prop('readonly', true);
        }
    })

    $('#checkbox-update-auto').on('change', function () {
        if ($(this).prop("checked")) {
            $('#checkbox-can-delete').removeAttr('disabled');
            $('#factor-inp').val('');
        } else {
            $('#checkbox-can-delete').prop('checked', false);
            $('#checkbox-can-delete').attr('disabled', 'disabled');
            $('#factor-inp').val(1);
        }
    })

    // submit form create price list
    let frm = $('#form-create-price')
    frm.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['currency'] = $('#select-box-currency').val();
        frm.dataForm['currency'].push($('#select-box-currency').find('option[data-primary="1"]').val())
        if (frm.dataForm['currency'].length === 0) {
            frm.dataForm['currency'] = null;
        }

        if ($('#valid_time').val()) {
            frm.dataForm['valid_time_start'] = $('#valid_time').val().split(' - ')[0];
            frm.dataForm['valid_time_end'] = $('#valid_time').val().split(' - ')[1]
        }

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                }
            }, (errs) => {
                // $.fn.notifyB({description: errs.data.errors}, 'failure');
            })
    });

    // onchange select box select-box-price-list
    $('#select-box-price-list').on('change', function () {
        let data_url = $(this).attr('data-url').replace(0, $(this).val())
        $.fn.callAjax(data_url, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('price')) {
                    $('#select-box-currency').val(data.price.currency).trigger('change');
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

    $(document).on("click", '.delete-price-list-btn', function (e) {
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
                    }, (errs) => {
                        // $.fn.notifyB({description: errs.data.errors}, 'failure');
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
