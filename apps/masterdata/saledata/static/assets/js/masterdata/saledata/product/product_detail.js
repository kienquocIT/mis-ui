$(document).ready(async function () {
    await loadPriceList();
    await loadWareHouseListAjax();

    await LoadDetailProduct('detail');
})