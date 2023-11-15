$(document).ready(async function () {
    await loadPriceList();
    await loadWareHouseListAjax();

    dataTableLot();
    dataTableSerial();
    await LoadDetailProduct('detail');
})