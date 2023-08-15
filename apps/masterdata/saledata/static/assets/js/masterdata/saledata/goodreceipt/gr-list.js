$(function(){
    let $table = $('#good-receipt-list')
    $table.DataTableDefault({
        ajax: {
            url: $table.attr('data-url'),
            type: "GET",
            dataSrc: 'data.good_receipt_list',
        },
        useDataServer: true,
        columns: [
            {
                targets: 0,
                defaultContent: ''
            },
            {
                targets: 1,
                render: (row, type, data) => {
                    let url = $('#url-factory').attr('data-detail').format_url_with_uuid(data.id)
                    return `<p><a href="${url}" target="_blank" class="text-decoration-underline">${data.title}</a></p>`;
                }
            },
            {
                targets: 2,
                class: 'text-center',
                data: 'supplier',
                render: (row, type, data) => {
                    let txt = '--'
                    if (Object.keys(row).length){
                        let url = $('#url-factory').attr('data-account-detail').format_url_with_uuid(row.id)
                        txt = `<a href="${url}" target="_blank" className="text-decoration-underline">${
                            row.title}</a>`
                    }
                    return `<p>${txt}</p>`
                }
            },
            {
                targets: 3,
                render: (row, type, data) => {
                    let postingDate = moment(data.posting_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
                    return `<p>${postingDate}</p>`;
                },
            },
            {
                targets: 4,
                render: (row, type, data) => {
                    const status =  data?.system_status ? data.system_status : 1
                    let postingDate = DataTableAction.status(status)
                    return `<p>${postingDate}</p>`;
                },
            },
            {
                targets: 5,
                render: (row, type, data) => {
                    let html = `<div class="actions-btn text-center">
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                   title="Delete"
                                   href="#"
                                   data-id="${data?.id ? data.id : ''}"
                                   data-action="delete">
                                    <span class="btn-icon-wrap">
                                        <i class="fa-regular fa-trash-can"></i>
                                    </span>
                                </a>
                            </div>`;
                    return ''
                },
            },
        ],
        rowCallback: function (row, data, index) {
            $('td:eq(0)', row).html(index + 1)
            $('.actions-btn a', row).off().on('click', function (e) {
                e.stopPropagation();
                let crf = $('[name="csrfmiddlewaretoken"]').val()
                let url = $('#url-factory').attr('data-detail-api').format_url_with_uuid(data.id)
                DataTableAction.delete(url, data, crf, row)
            })
        }
    }, false)
}, jQuery);