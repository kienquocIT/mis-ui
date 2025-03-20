$(document).ready(async function () {
    await ProductLoadPage.LoadPageDataFirst()
    ProductEventHandler.InitPageEven()
    ProductLoadPage.LoadGeneralProductType()
    ProductLoadPage.LoadGeneralProductCategory()
    ProductLoadPage.LoadGeneralUoMGroup()
    ProductLoadPage.LoadSaleTax()
    ProductLoadPage.LoadSaleUom()
    ProductLoadPage.LoadSalePriceListForSaleOnline(null, [])
    ProductLoadPage.LoadInventoryUom()
    ProductLoadPage.LoadPriceListTable([])
    ProductLoadPage.LoadWareHouseListDetail()
    ProductLoadPage.LoadWareHouseOverViewDetail()
    ProductLoadPage.LoadPurchaseUom()
    ProductLoadPage.LoadPurchaseTax()

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