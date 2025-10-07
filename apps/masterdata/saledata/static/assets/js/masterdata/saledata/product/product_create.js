$(document).ready(async function () {
    $.fn.InitAutoGenerateCodeField({
        param_app_code: 'product',
        param_ele_code_id: 'code'
    })

    await ProductPageFunction.LoadPageDataFirst()
    ProductEventHandler.InitPageEven()
    ProductPageFunction.LoadGeneralProductType()
    ProductPageFunction.LoadGeneralProductCategory()
    ProductPageFunction.LoadGeneralUoMGroup()
    ProductPageFunction.LoadGeneralManufacturer()
    ProductPageFunction.LoadSaleTax()
    ProductPageFunction.LoadSaleUom()
    ProductPageFunction.LoadSalePriceListForSaleOnline(null, [])
    ProductPageFunction.LoadInventoryUom()
    ProductPageFunction.LoadPriceListTable()
    ProductPageFunction.LoadWareHouseListDetail()
    ProductPageFunction.LoadWareHouseOverViewDetail()
    ProductPageFunction.LoadSpecificSerialList()
    ProductPageFunction.LoadPurchaseUom()
    ProductPageFunction.LoadPurchaseTax()
    ProductPageFunction.LoadComponentTable()
    ProductPageFunction.LoadDurationUnit()
    ProductPageFunction.LoadSelectedAttributeTable()

    $('#form-create-product').submit(function (event) {
        event.preventDefault();
        let combinesData = ProductHandler.CombinesData($(this), false);
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })
})