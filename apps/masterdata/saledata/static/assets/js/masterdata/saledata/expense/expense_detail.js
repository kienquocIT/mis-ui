function renderDetailData(resp) {
    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense')) {
        let expense_detail = resp.data?.['expense'];
        $.fn.compareStatusShowPageAction(expense_detail);
        // $('#expenseCode').text(expense_detail.code);
        $('#expenseTitle').val(expense_detail.title);

        ExpenseLoadPage.loadExpenseType(expense_detail.expense_type);
        ExpenseLoadPage.loadRole(expense_detail.role);
        ExpenseLoadPage.loadUoM(expense_detail.uom);

        return expense_detail.price_list;
    }
}

$(document).ready(function () {
    // $x.fn.showLoadingPage();
    const pk = window.location.pathname.split('/').pop();
    const frmDetail = $('#frmUpdateExpense');

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


    let price_dict = {};
    let price_list = [];
    loadPriceList(price_list, price_dict)

    let expense_price = [];
    let obj_price = {};

    async function loadDetailExpense() {
        let frm = new SetupFormSubmit(frmDetail);
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

    $(document).on('click', '#dropdown-price-list', async function () {
        if (price_list.length === 0 || Object.keys(price_dict).length === 0) {
            price_dict = obj_price.dict;
            price_list = obj_price.list;
            loadPriceList(price_list, price_dict);
        }
        expense_price.map(function (item) {
            if (price_dict[item.id].auto_update === false) {
                document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).disabled = false;
            }
            document.querySelector(`input[type="checkbox"][data-id="` + item.id + `"]`).checked = true;
            if (item.currency === currency_primary.id)
                document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).setAttribute('value', item.price_value);

        })
        $.fn.initMaskMoney2();
        autoSelectPriceListCopyFromSource(price_dict)

        let ele_in_dropdown = $('.ul-price-list').find('input');
        ele_in_dropdown.attr('readonly', false);
        ele_in_dropdown.attr('disabled', true);

    })
    loadDetailExpense().then(r => null);
})


