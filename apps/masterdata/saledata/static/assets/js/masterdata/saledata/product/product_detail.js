$(document).ready(async function () {
    await loadWareHouseListAjax();

    dataTableLot();
    dataTableSerial();
    LoadDetailProduct('detail');
})