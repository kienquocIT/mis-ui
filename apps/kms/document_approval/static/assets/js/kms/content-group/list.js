$(document).ready(function(){
    const $tb = $('#tbl_content_group')
    $tb.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: $tb.attr('data-url'),
            type: 'GET',
            dataSrc: "data.content_group_list"
        },
        columns: [
            {
                data: 'code',
                render: (row) => {
                    return row
                }
            },
            {
                data: 'title',
                render: (row, index, data) => {
                    const url = $tb.attr('data-url-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}" target="blank">${row}</a>` : '--'
                }
            },
            {
                data: 'id',
                render: (row) => {
                    return `<div class="actions-btn text-center">` +
                        `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn" title="Delete"`+
                        `href="#" data-id="${row}" data-action="delete">`+
                        `<span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span></a></div>`;
                }
            }
        ],
        rowCallback: function(row, data){
            $('.actions-btn a', row).off().on('click', function (e) {
                e.stopPropagation();
                let crf = $('[name="csrfmiddlewaretoken"]').val()
                let url = $('#url-factory').attr('data-delete').format_url_with_uuid(data.id)
                DataTableAction.delete(url, crf, row)
            })
        },
    })
});