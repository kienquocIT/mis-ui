$(document).ready(function () {
    let line_detail_records = 0;
    $(document).on("click", '#btn-add-row-line-detail', function () {
        line_detail_records = line_detail_records + 1;
        let table_body = $('#tab_line_detail tbody');
        table_body.append(`<tr>
            <td class="number">`+line_detail_records+`</td>
            <td><select class="form-select"><option>Chi phi di chuyen HN-SG, SG-HN</option></select></td>
            <td>Chi phi di chuyen</td>
            <td><select class="form-select"><option>chuyen</option></select></td>
            <td><input class="form-control" value="2"></td>
            <td><input class="form-control" value="2.500.000,00 VND"></td>
            <td><select class="form-select"><option>VAT-10</option></select></td>
            <td><input class="form-control" value="5.000.000,00 VND"></td>
            <td><input class="form-control" value="5.500.000,00 VND"></td>
            <td><a class="btn btn-soft-primary col-12 btn-del-line-detail" href="#"><i class="bi bi-trash"></i></a></td>
        </tr>`);
        count_row(table_body);

        $('.btn-del-line-detail').on('click', function () {
            $(this).closest('tr').remove();
            count_row(table_body);
        })
    });

    function count_row(table_body) {
        let count = 0;
        table_body.find('tr td.number').each(function() {
            count = count + 1;
            $(this).text(count);
        });
    }

    function loadSaleCode() {
        let ele = $('#sale-code-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_list')) {
                    ele.append(`<option></option>`);
                    resp.data.opportunity_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.code + ` - ` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadCreator() {
        let ele = $('#creator-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    ele.append(`<option></option>`);
                    resp.data.employee_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadBeneficiary() {
        let ele = $('#beneficiary-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    ele.append(`<option></option>`);
                    resp.data.employee_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadSupplier() {
        let ele = $('#supplier-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('account_list')) {
                    ele.append(`<option></option>`);
                    resp.data.account_list.map(function (item) {
                        ele.append(`<option data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    loadCreator();
    $('#creator-select-box').select2();
    loadBeneficiary();
    $('#beneficiary-select-box').select2();
    loadSupplier();


    $('#return-date-id').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'YYYY-MM-DD HH:mm'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'),10)
    });

    $('.sale_code_type').on('change', function () {
        $('#btn-change-sale-code-type').text($('input[name="sale_code_type"]:checked').val())
        if ($(this).val() === 'sale') {
            $('#sale-code-select-box').prop('disabled', false);
            loadSaleCode();
        }
        if ($(this).val() === 'non-sale') {
            $('#sale-code-select-box').prop('disabled', true);
            $('#sale-code-select-box').val('');
        }
    })

    $('#supplier-select-box').on('change', function () {
        if ($(this).val() !== '') {
            $('#supplier-detail-span').prop('hidden', false);
            $('#supplier-name').text($('#supplier-select-box option:selected').attr('data-name'));
            $('#supplier-code').text($('#supplier-select-box option:selected').attr('data-code'));
            $('#supplier-owner').text($('#supplier-select-box option:selected').attr('data-owner'));
            $('#supplier-industry').text($('#supplier-select-box option:selected').attr('data-industry'));
        }
        else {
            $('#supplier-detail-span').prop('hidden', true);
        }
    })

    $('#beneficiary-select-box').on('change', function () {
        if ($(this).val() !== '') {
            $('#beneficiary-detail-span').prop('hidden', false);
            // $('#supplier-name').text($('#supplier-select-box option:selected').attr('data-name'));
            // $('#supplier-code').text($('#supplier-select-box option:selected').attr('data-code'));
            // $('#supplier-owner').text($('#supplier-select-box option:selected').attr('data-owner'));
            // $('#supplier-industry').text($('#supplier-select-box option:selected').attr('data-industry'));
        }
        else {
            $('#beneficiary-detail-span').prop('hidden', true);
        }
    })

    $('#type-select-box').on('change', function () {
        if ($(this).val() === '1') {
            $('#supplier-select-box').prop('disabled', false);
            $('#supplier-label').addClass('required');
        }
        else {
            $('#supplier-select-box').prop('disabled', true);
            $('#supplier-label').removeClass('required');
        }
    })

    $('#form-create-advance').submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        if ($('input[name="sale_code_type"]:checked').val() === 'non-sale') {
            frm.dataForm['sale_code_type'] = 2;
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'sale') {
            frm.dataForm['sale_code_type'] = 0;
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'purchase') {
            frm.dataForm['sale_code_type'] = 1;
        }
        else {
            frm.dataForm['sale_code_type'] = 3;
        }

        if (frm.dataForm['method'] === '0') {
            frm.dataForm['method'] = 0;
        }
        else if (frm.dataForm['method'] === '1') {
            frm.dataForm['method'] = 1;
        }
        else {
            frm.dataForm['method'] = 2;
        }

        if (frm.dataForm['type'] === '0') {
            frm.dataForm['type'] = 0;
        }
        else if (frm.dataForm['type'] === '1') {
            frm.dataForm['type'] = 1;
        }
        else {
            frm.dataForm['type'] = 2;
        }

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    })
})
