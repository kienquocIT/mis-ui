$(document).ready(async function () {
    await ProductPageFunction.LoadPageDataFirst()
    ProductHandler.LoadDetailProduct('detail');
})