$(function(){

    let $table = $('#promotion-list'),
        url = $table.attr('data-url');
    $table.DataTableDefault({
        ajax: {
            url: url,
            type: "GET",
            dataSrc: 'data.promotion_list',
        },
        columns: [
            {
                targets: 0,
                render: (row, type, data) => {
                    return ``
                }
            },
            {
                targets: 1,
                render: (row, type, data) => {
                    return `<p>${data.title}</p>`;
                }
            },
            {
                targets: 2,
                class: 'text-center',
                render: (row, type, data) => {
                    let code = data.is_active, $trans = $('#trans-factory');
                    let text = code ? $trans.attr('data-valid') : $trans.attr('data-expired')
                    return `<p>${text}</p>`;
                }
            },
            {
                targets: 3,
                className: 'action-center',
                render: (row, type, data) => {
                    return `<div class="actions-btn text-center">
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                   title="Delete"
                                   href="#"
                                   data-id="${data.id}"
                                   data-action="delete">
                                    <span class="btn-icon-wrap">
                                        <i class="bi bi-trash"></i>
                                    </span>
                                </a>
                            </div>`;
                },
            },
        ],
        rowCallback(row, data){
            $('.actions-btn a', row).off().on('click', function (e) {
                e.stopPropagation();
                let crf = $('[name=csrfmiddlewaretoken]', '#form-create-payment-term').val()
                let url = $('#url-factory').data('detail').format_url_with_uuid(data.id)
                DataTableAction.delete(url, data, crf, row)
            })
        }
    }, true);
});