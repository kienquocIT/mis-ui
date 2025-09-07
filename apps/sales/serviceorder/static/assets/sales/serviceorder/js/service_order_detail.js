async function fetchDataDetail(){

}

function disableFields (){

}

$(document).ready(function () {
    fetchDataDetail().then(r => disableFields())
})