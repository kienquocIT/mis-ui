$(document).ready(function () {
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
            'url': frm.dataUrl,
            'method': 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                expense_price = renderDetailData(resp);
                loadDetailPriceList(price_list, price_dict, obj_price, expense_price, currency_primary);
            }
        })
    }

    loadDetailExpense().then(null);

    // auto checked checkbox for price list copy from source
    $(document).on('click', '.ul-price-list .form-check-input', function () {
        price_dict = obj_price.dict;
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
        price_dict = obj_price.dict;
        autoInputValuePriceList(price_dict)
    })

    SetupFormSubmit.validate(
        frmUpdate,
        {
            submitHandler: function (form) {
                price_dict = obj_price.dict;
                let combinesData = submitForm($(form), price_dict, currency_primary)
                $.fn.callAjax2({
                    'url': combinesData.url,
                    'method': combinesData.method,
                    'data': combinesData.data
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                            setTimeout(() => {
                                window.location.href = $(form).data('url-redirect');
                            }, 1000)
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    })
            }
        })
})