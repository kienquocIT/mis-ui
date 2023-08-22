$(document).ready(function () {
    const pk = window.location.pathname.split('/').pop();
    const frmDetail = $('#frmDetailExpense');

    let btnEdit = $('#btn-edit')
    btnEdit.attr('href', btnEdit.attr('href').format_url_with_uuid(pk));


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

    let loaded_price_list = false;

    $(document).on('click', '#dropdown-price-list', async function () {
        if (!loaded_price_list) {
            let dropdown_ele = $('.ul-price-list');
            loadDetailPriceList(price_list, price_dict, obj_price, expense_price, currency_primary)
            let ele_in_dropdown = dropdown_ele.find('input');
            ele_in_dropdown.attr('readonly', false);
            ele_in_dropdown.attr('disabled', true);
            loaded_price_list = true;
        }


    })
    loadDetailExpense().then(null);
})


