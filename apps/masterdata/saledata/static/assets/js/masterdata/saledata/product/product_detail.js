$(document).ready(async function () {
    await ProductLoadPage.LoadPageDataFirst()
    ProductHandler.LoadDetailProduct('detail');
})