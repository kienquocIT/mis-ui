$(document).ready(function () {
    // INIT DATA

    ExpenseLoadPage.loadExpenseType();
    ExpenseLoadPage.loadUoM();
    ExpenseLoadPage.loadRole();

    let price_dict = {};
    let price_list = [];
    let currency_primary = {}

    async function loadDataPriceList() {
        let obj_price = {};
        let url = $('#url-factory').data('price_list');
        let method = 'GET';
        let result = await callData(url, method);
        obj_price['list'] = result.price_list;
        obj_price['dict'] = result.price_list.reduce((obj, item) => {
            obj[item.id] = item;
            return obj;
        }, {});

        return obj_price;
    }

    function loadCurrencyPrimary() {
        let url = $('#url-factory').data('currency_list');
        let method = 'GET';
        callData(url, method).then((result) => {
            currency_primary = result.currency_list.find(obj => obj.is_primary === true);
        });
    }

    loadCurrencyPrimary();

    function loadUoMGroup() {
        let chooseUoMGroup = $('#chooseUoMGroup');
        let url = chooseUoMGroup.data('url');
        let method = chooseUoMGroup.data('method');
        callData(url, method).then((result) => {
            result.unit_of_measure_group.map(function (item) {
                if (item.is_default) {
                    chooseUoMGroup.val(item.title);
                    chooseUoMGroup.attr('data-id', item.id);
                }
            })
        });
    }

    loadUoMGroup();

    function getDataFormPriceList(price_dict) {
        let price_list = []
        $('.ul-price-list .value-price-list').each(function () {
            let is_auto_update = '1';
            if (price_dict[$(this).attr('data-id')].auto_update === false) {
                is_auto_update = '0';
            }
            if ($(`input[type="checkbox"][data-id="` + $(this).attr('data-id') + `"]`).prop('checked') === true) {
                if ($(this).val() !== '') {
                    price_list.push(
                        {
                            'id': $(this).attr('data-id'),
                            'value': $(this).valCurrency(),
                            'is_auto_update': is_auto_update,
                        }
                    )
                } else {
                    price_list.push(
                        {
                            'id': $(this).attr('data-id'),
                            'value': 0,
                            'is_auto_update': is_auto_update,
                        }
                    )
                }
            }
        })
        return price_list
    }

    // submit form create expense
    let frmCreate = $('#frmCreateExpense')
    frmCreate.submit(function (event) {
        event.preventDefault();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['uom_group'] = $('#chooseUoMGroup').data('id');

        let price_list = getDataFormPriceList(price_dict);
        if (price_list.length > 0) {
            frm.dataForm['data_price_list'] = price_list;
            frm.dataForm['currency_using'] = currency_primary.id;
        }

        frm.dataForm['role'] = ExpenseLoadPage.roleSelectEle.val();

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
        let data_id = $(this).attr('data-id');
        if (price_dict[data_id].status === "Expired") {
            $(this).prop('checked', false);
        }
        autoSelectPriceListCopyFromSource(price_dict)
        if ($(this).prop('checked')) {
            $(`input[type="text"][data-id="` + data_id + `"]`).prop('disabled', false)
        } else {
            $(`input[type="text"][data-id="` + data_id + `"]`).prop('disabled', true)
            let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input:not(:checked)')
            for (let i = 0; i < element.length; i++) {
                document.querySelector(`input[type="text"][data-id="` + element[i].getAttribute('data-id') + `"]`).value = null;
            }
        }
    })

    // auto to input value for price list copy from source
    $(document).on('change', '.ul-price-list .value-price-list', function () {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.value-price-list[readonly]')
        for (let i = 0; i < element.length; i++) {
            let ele_id = element[i].getAttribute('data-id')
            if (price_dict[ele_id] !== undefined && price_dict[ele_id].price_list_mapped !== null) {
                if (document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).value !== '' && price_dict[ele_id].status !== 'Expired') {
                    element[i].setAttribute('value', document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).value * price_dict[ele_id].factor)
                }
            }
            $.fn.initMaskMoney2();
        }
    })
})