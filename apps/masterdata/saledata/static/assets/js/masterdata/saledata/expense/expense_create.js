$(document).ready(function () {
    // INIT DATA

    ExpenseLoadPage.loadExpenseType();
    ExpenseLoadPage.loadUoM();
    ExpenseLoadPage.loadRole();

    let price_dict = {};
    let price_list = [];
    let currency_primary = {}

    loadCurrencyPrimary().then(result => {
        currency_primary = result;
    });
    loadUoMGroup();

    // submit form create expense
    let frmCreate = $('#frmCreateExpense')
    frmCreate.submit(function (event) {
        event.preventDefault();
        let frm = submitForm($(this), price_dict, currency_primary)

        $.fn.callAjax2({
            'url': frm.dataUrl,
            'method': frm.dataMethod,
            'data': frm.dataForm
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            })
    })

    $(document).on('click', '#dropdown-price-list', async function () {
        if (price_list.length === 0 || Object.keys(price_dict).length === 0) {
            let obj_price_list = await loadDataPriceList();
            price_dict = obj_price_list.dict;
            price_list = obj_price_list.list;
            loadPriceList(price_list, price_dict);
        }
    })

    // auto checked checkbox for price list copy from source
    $(document).on('click', '.ul-price-list .form-check-input', function () {
        controlSelectPriceList($(this), price_dict)
    })

    // auto to input value for price list copy from source
    $(document).on('change', '.ul-price-list .value-price-list', function () {
        autoInputValuePriceList(price_dict)
    })
})