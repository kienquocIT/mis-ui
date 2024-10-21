$(document).ready(function () {
    function addPkToTable(){
        let pk = $.fn.getPkDetail();
        $('#tab-item-list').attr('price_id', pk)
    }

    addPkToTable()
})