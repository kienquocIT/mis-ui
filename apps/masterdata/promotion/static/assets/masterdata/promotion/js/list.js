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
                    let url = $('#url-factory').attr('data-detail').format_url_with_uuid(data.id)
                    return `<p><a href="${url}" target="_blank" class="text-decoration-underline">${data.title}</a></p>`;
                }
            },
            {
                targets: 2,
                class: 'text-center',
                render: (row, type, data) => {
                    let isValid = '<span class="badge badge-indicator badge-indicator-xl badge-green"></span>'
                    const currentTime = new Date().getTime(),
                    promoDateEnd = new Date(moment(data.valid_date_end).format('YYYY-MM-DD')).getTime(),
                    promoDateStart = new Date(moment(data.valid_date_start).format('YYYY-MM-DD')).getTime(),
                    $trans = $('#trans-factory');
                    let text = $trans.attr('data-valid'), color = 'text-green'
                    if (promoDateEnd < currentTime){
                        // expired time
                        isValid = '<span class="badge badge-indicator badge-indicator-xl badge-danger"></span>'
                        text = $trans.attr('data-expired')
                        color = 'text-danger'
                    }
                    else if (promoDateStart > currentTime){
                        isValid = '<span class="badge badge-indicator badge-indicator-xl badge-orange"></span>'
                        text = $trans.attr('data-invalid')
                        color = 'text-orange'
                    }

                    let stt = `<span class="${color}">${text}</span>`
                    return isValid + stt;
                }
            },
            {
                targets: 3,
                render: (row, type, data) => {
                    return `<div class="actions-btn text-center">
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                   title="Delete"
                                   href="#"
                                   data-id="${data?.id ? data.id : ''}"
                                   data-action="delete">
                                    <span class="btn-icon-wrap">
                                        <i class="bi bi-trash"></i>
                                    </span>
                                </a>
                            </div>`;
                },
            },
        ],
        rowCallback: function(row, data, index){
            $('td:eq(0)', row).html(index + 1)
            $('.actions-btn a', row).off().on('click', function (e) {
                e.stopPropagation();
                let crf = $('[name="csrfmiddlewaretoken"]').val()
                let url = $('#url-factory').attr('data-detail-api').format_url_with_uuid(data.id)
                DataTableAction.delete(url, data, crf, row)
            })
        },
        rowIdx: false,
    });
});