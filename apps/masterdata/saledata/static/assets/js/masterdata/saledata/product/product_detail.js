$(document).ready(async function () {
    await ProductPageFunction.LoadPageDataFirst()
    ProductEventHandler.InitPageEven()
    ProductHandler.LoadDetailProduct('detail');
})