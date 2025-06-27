/*Blog Init*/
$(function () {
    let tb = $('#datable_group_list');
    let $urlEle = $('#app-url-factory');
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
                className: 'action-center',
                render: (data, type, row) => {
                    return DTBControl.addCommonAction({"data-edit": $urlEle.attr('data-edit')}, row);
                },
            }
        ],
    });

    tb.on('click', '.action-delete', function (e) {
        WindowControl.showLoading();
        $.fn.callAjax2(
            {
                'url': $urlEle.attr('data-detail-api').format_url_with_uuid($(this).attr('data-id')),
                'method': 'DELETE',
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        WindowControl.hideLoading();
                        window.location.reload();
                    }, 2000);
                }
            }, (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
    });

});

