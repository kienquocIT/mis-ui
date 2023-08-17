function initUserPage() {
    $.fn.callAjax2({
        url: $('#pageDataHide').attr('data-url'),
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let userData = data?.user || {};
                if (userData) {
                    $x.fn.renderCodeBreadcrumb(userData, 'username');
                    $('#inp-first_name').val(userData.first_name);
                    $('#inp-last_name').val(userData.last_name);
                    $('#inp-full_name').val(data.user.full_name);
                    $('#inp-email').val(userData.email);
                    $('#inp-username').val(userData.username);

                    let dtb = $('#datable_company_list');
                    dtb.DataTableDefault({
                        rowIdx: true,
                        stateDefaultPageControl: false,
                        data: userData.company || [],
                        columns: [
                            {
                                render: function () {
                                    return '';
                                }
                            },
                            {
                                'data': 'code',
                                'render': (data, type, row, meta) => {
                                    return `<span class="badge badge-soft-primary">` + row.code + `</span>`
                                }
                            }, {
                                'data': 'title',
                                'render': (data, type, row, meta) => {
                                    return `<div class="media align-items-center">
                                <div class="media-head me-2">
                                    <div class="avatar avatar-xs avatar-success avatar-rounded">
                                        <span class="initial-wrap">` + row.title.charAt(0).toUpperCase() + `</span>
                                    </div>
                                </div>
                                <div class="media-body">
                                        <span class="d-block">` + row.title + `</span>
                                </div>
                            </div>`;
                                }
                            }, {
                                'data': 'representative',
                                render: (data, type, row, meta) => {
                                    return `<span class="badge badge-primary">${data || ''}</span>`;
                                }
                            }, {
                                'data': 'license',
                                render: (data, type, row, meta) => {
                                    return `<span>${data || ''}</span>`;
                                }
                            }
                        ]
                    });

                    $('#select-box-company').initSelect2({
                        keyResp: 'company_list',
                        data: (userData.company || []).map(
                            (item) => {
                                return {
                                    ...item,
                                    select: (item.id === userData?.['company_current_id']),
                                }
                            }
                        ),
                    })
                }
            }
        },
        (errs) => {
        }
    )
}