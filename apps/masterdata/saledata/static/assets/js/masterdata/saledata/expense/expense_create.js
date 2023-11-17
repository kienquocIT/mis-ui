$(document).ready(function () {
    // INIT DATA

    ExpenseLoadPage.loadExpenseItem();
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

    SetupFormSubmit.validate(
        $('#frm-create-expense'),
        {
            submitHandler: function (form) {
                let combinesData = submitForm($(form), price_dict, currency_primary)
                $.fn.callAjax2({
                    url: combinesData.url,
                    method: combinesData.method,
                    data: combinesData.data,
                    urlRedirect: combinesData.urlRedirect,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        setTimeout(() => {
                            window.location.href = $(form).data('url-redirect');
                        }, 1000)
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        }
    );

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
        let is_checked = this.checked;
        for (let eleCheck of this.closest('.ul-price-list').querySelectorAll('.form-check-input')) {
            eleCheck.checked = false;
            controlSelectPriceList($(eleCheck), price_dict);
        }
        this.checked = is_checked;
        controlSelectPriceList($(this), price_dict)
    })

    // auto to input value for price list copy from source
    $(document).on('change', '.ul-price-list .value-price-list', function () {
        autoInputValuePriceList(price_dict)
    })
})