$(document).ready(function () {
    LoadDetailPR('detail');

    const urlParams = new URLSearchParams(window.location.search);
    const type= urlParams.get('type');
    $('#btn-edit').on('click', function () {
        let this_href = $(this).attr('href')
        $(this).attr('href', this_href+`?type=${type}`)
    })
})