$(document).ready(function () {
    const pk = window.location.pathname.split('/').pop();
    const frmUpdate = $('#frmUpdateExpense');

    let currency_primary = {}

    loadCurrencyPrimary().then(result => {
        currency_primary = result;
    });

    loadUoMGroup();

    let price_dict = {};
    let price_list = [];
    loadPriceList(price_list, price_dict)

    let expense_price = [];
    let obj_price = {};

    async function loadDetailExpense() {
        let frm = new SetupFormSubmit(frmUpdate);
        obj_price = await loadDataPriceList();
        $.fn.callAjax2({
            'url': frm.dataUrl.format_url_with_uuid(pk),
            'method': 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                expense_price = renderDetailData(resp);
            }
        })
    }

    let loaded_price_list = false;
    $(document).on('click', '#dropdown-price-list', async function () {
        if (!loaded_price_list) {
            loadDetailPriceList(price_list, price_dict, obj_price, expense_price, currency_primary);
            loaded_price_list = true;
        }
    })
    loadDetailExpense().then(null);

    // auto checked checkbox for price list copy from source
    $(document).on('click', '.ul-price-list .form-check-input', function () {
        price_dict = obj_price.dict;
        controlSelectPriceList($(this), price_dict)
    })

    // auto to input value for price list copy from source
    $(document).on('change', '.ul-price-list .value-price-list', function () {
        price_dict = obj_price.dict;
        autoInputValuePriceList(price_dict)
    })

    frmUpdate.submit(function (event) {
        event.preventDefault();
        let frm = submitForm($(this), obj_price.dict, currency_primary);
        $.fn.callAjax2({
            'url': frm.dataUrl.format_url_with_uuid(pk),
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
})