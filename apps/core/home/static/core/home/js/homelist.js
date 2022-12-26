let homelistDT;


$(document).ready(function () {
    loadDataHome();
});


function loadDataHome() {
    let mis_home_list = $('#mis-home-list')
    let data = JSON.parse($('script[id="' + mis_home_list.attr('data-of-table') + '"]').html());
    homelistDT = mis_home_list.DataTable({
        processing: true,
        data: data,
        language: {
            searchPlaceholder: "Search...",
        },
        dom: "<'row'<'col-6'i><'col-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-6'l><'col-sm-6'p>>",
        sort: false,
        scrollX: true,
        columns: [
            {
                'data': 'code',
                'className': 'user-code-col',
                'render': function (data, type, row) {
                    let id = row.id
                    return `<a href="/tenant-detail/` + row.id + `" target="_blank">` + data + `</a>`;
                }
            },
            {'data': 'full_name', 'className': 'user-full-name-col'},
            {'data': 'username', 'className': 'user-username-col'},
            {'data': 'email', 'className': 'user-email-col'},
            {'data': 'phone', 'className': 'user-phone-col'},
            {
                'render': function (data, type, row) {
                    let htmlRow = ``;
                    htmlRow += `<a href="/tenant-space/public/` + row.id + `"><i class="fas fa-edit btn-action"></i></a>`;
                    htmlRow += `<i class="far fa-trash-alt btn-action" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Delete"></i>`;
                    return htmlRow;
                },
            },
        ]
    });
    let x = $('.dataTables_filter > label')[0];
    x.removeChild(x.firstChild);
}