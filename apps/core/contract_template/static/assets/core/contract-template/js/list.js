$(document).ready(function () {
    const $EmTable = $('#dtb_contract_template_list')
    var _table = $EmTable.DataTableDefault({
        ajax: {
            url: $EmTable.attr('data-url'),
            type: "GET",
            dataSrc: 'data.contract_template_list',
        },
        useDataServer: true,
        info: true,
        pageLength: 50,
        autoWidth: false,
        scrollX: true,
        rowIdx: true,
        columns: [
            {
                targets: 0,
                orderable: false,
                width: '5%',
                defaultContent: ''
            },
            {
                data: 'title',
                width: '30%',
                class: 'text-center',
                render: (row, type, data) => {
                    let badge = '--';
                    if (data?.id)
                        badge = `<a href="${$EmTable.attr('data-detail').format_url_with_uuid(data.id)
                    }" title="${row}" class="txt-link">${row}</a>`
                    return badge
                }
            },
            {
                data: 'application',
                class: 'text-center',
                width: '25%',
                render: (row) =>{
                    return `<span class="badge badge-soft-primary">${row?.title ? row.title : '--'}</span>`
                }
            },
            {
                data: 'employee_created',
                width: '30%',
                class: 'text-center',
                render: (row) => {
                    let badge = '--';
                    if (row?.id) badge = `<span class="text-blue">${row?.full_name}</span>`
                    return badge
                }
            },
            {
                data: 'date_created',
                width: '10%',
                class: 'text-center',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = moment(row).format('DD/MM/YYYY')
                    return txt
                }
            },
            {
                data: 'id',
                width: '10%',
                class: 'text-center',
                render: (row) => {
                    return `<div class="actions-btn text-center">
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                   title="Delete"
                                   href="#"
                                   data-id="${row}"
                                   data-action="delete">
                                    <span class="btn-icon-wrap">
                                        <i class="fa-regular fa-trash-can"></i>
                                    </span>
                                </a>
                            </div>`;
                }
            }
        ],
        rowCallback: function (row, data, index) {
            $('td:eq(0)', row).html(index + 1)
            $('.actions-btn a', row).on('click', function (e) {
                e.stopPropagation();
                let crf = $('[name="csrfmiddlewaretoken"]').val()
                let url = $EmTable.attr('data-detail-api').format_url_with_uuid(data.id)
                DataTableAction.delete(url, crf, row)
            })
        },
    })
});