/*Blog Init*/
$(function () {
    let tb = $('#datable_group_list');
    tb.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: tb.attr('data-url'),
            type: tb.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('group_list')) return data.group_list;
                return [];
            },
        },
        columns: [
            {
                render: (data, type, row, meta) => {
                    return `<span>${(meta.row + 1)}</span>`
                }
            }, {
                'data': 'group_level',
                render: (data, type, row) => {
                    if (data.level) {
                        let urlGroupDetail = "/hr/group/detail/" + row.id
                        let level = ("level " + data.level);
                        return `<a href="${urlGroupDetail}">
                    <span><b>${level}</b></span>
                </a>`
                    } else {
                        return ""
                    }
                }
            }, {
                'data': 'group_level',
                render: (data, type, row, meta) => {
                    if (data.description) {
                        return String.format(data.description);
                    } else {
                        return ""
                    }
                }
            }, {
                'data': 'title',
                render: (data, type, row, meta) => {
                    return String.format(data);
                }
            }, {
                'data': 'code',
                render: (data, type, row, meta) => {
                    return String.format(data);
                }
            }, {
                'data': 'parent_n',
                render: (data, type, row, meta) => {
                    if (data.title) {
                        return String.format(data.title);
                    } else {
                        return ""
                    }
                }
            }, {
                'data': 'first_manager',
                render: (data, type, row, meta) => {
                    if (data.full_name) {
                        return String.format(data.full_name);
                    } else {
                        return ""
                    }
                }
            }, {
                'className': 'action-center',
                'render': (data, type, row) => {
                    let urlDetail = "/hr/group/" + row.id
                    let urlList = "/hr/group"
                    let urlUpdate = "/hr/group/update/" + row.id
                    let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="${urlUpdate}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="" id="btn-delete-group-data" data-url="${urlDetail}" data-method="DELETE" data-url-redirect="${urlList}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    return bt2 + bt3;
                }
            },
        ],
    });

    $(document).on('click', '#btn-delete-group-data', function (e) {
        let url = $(this).attr('data-url');
        let urlMethod = $(this).attr('data-method');
        let urlRedirect = $(this).attr('data-url-redirect');
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        $.fn.callAjax(url, urlMethod, {}, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.redirectUrl(urlRedirect, 1000);
                    }
                },
                (errs) => {
                    console.log(errs)
                }
            )
    });
});

