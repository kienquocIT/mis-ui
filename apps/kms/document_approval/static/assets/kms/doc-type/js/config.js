$(document).ready(function(){
    const $tb = $('#tbl_document_type')
    $tb.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: $tb.attr('data-url'),
            type: 'GET',
            dataSrc: "data.document_type_list"
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
                render: (row) => {
                    return row
                }
            },
            {
                data: 'numbering',
                render: (row) => {
                    return row
                }
            },
            {
                data: 'folder',
                render: (row) => {
                    return row
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
                let url = $tb.attr('data-url-detail').format_url_with_uuid(data.id)
                DataTableAction.delete(url, crf, row)
            })
        },
    })
});