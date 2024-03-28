$(document).ready(function () {
    let tab$ = $('#tabFeature');

    let groupSample$ = $('#group-feature-sample');

    function active_events(){
        tab$.find('.btnShowInfo').off('click').on('click', function () {
            $(this).closest('.parentGroupInfo').find('.groupInfo').animate({
                height: "toggle",
                opacity: "toggle",
            })
        })
        tab$.find('.btnCollapseGroup').off('click').on('click', function () {
            $(this).find('i').toggleClass('rotate-90deg');
            $(this).siblings('button[type=submit]').prop('disabled', (i, v) => !v);
            let groupCollapse$ = $(this).closest('.parentGroupInfo').find('.groupCollapseData');
            groupCollapse$.animate({
                height: "toggle",
                opacity: "toggle"
            });
            groupCollapse$.find('table').each(function () {
                if (!$(this).attr('id')) $(this).attr('id', $x.fn.randomStr(32, true));
                if (!$.fn.DataTable.isDataTable('#' + $(this).attr('id'))) {
                    let tblEle = $(this);
                    $(this).DataTableDefault({
                        ajax: {
                            url: tblEle.attr('data-url'),
                            type: 'GET',
                            dataSrc: function (resp) {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    return resp.data['mailer'] ? resp.data['mailer'] : [];
                                }
                                return [];
                            },
                        },
                        autoWidth: false,
                        rowIdx: true,
                        callbackGetLinkBlank: (row) => tblEle.attr('data-url-detail').replaceAll('__pk__', row.id),
                        columns: [
                            {
                                width: '10%',
                                render: () => ''
                            }, {
                                data: 'title',
                                width: '30%',
                                render: (data, type, row) => {
                                    return `<a href="${tblEle.attr('data-url-detail').replaceAll('__pk__', row.id)}">${data}</a>`
                                },
                            }, {
                                data: 'remarks',
                                width: '20%',
                                render: (data) => data,
                            }, {
                                data: 'is_active',
                                width: '15%',
                                render: (data) => {
                                    let idx = $x.fn.randomStr(32, true);
                                    return `<div class="form-check form-switch">
                                            <input type="checkbox" class="form-check-input" id="${idx}" ${data ? "checked" : ""} disabled>
                                            <label class="form-check-label d-none" for="${idx}"></label>
                                        </div>`;
                                },
                            }, {
                                data: 'is_default',
                                width: '15%',
                                render: (data) => {
                                    let idx = $x.fn.randomStr(32, true);
                                    return `<div class="form-check form-switch">
                                            <input type="checkbox" class="form-check-input" id="${idx}" ${data ? "checked" : ""} disabled>
                                            <label class="form-check-label d-none" for="${idx}"></label>
                                        </div>`;
                                },
                            }, {
                                width: '10%',
                                className: 'action-center',
                                render: (data, type, row) => {
                                    let btnEdit = `
                                            <a
                                                class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top" title="" data-bs-original-title="Edit"
                                                href="${tblEle.attr('data-url-update').replaceAll('__pk__', row.id)}"
                                            >
                                                <span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span>
                                            </a>
                                        `;
                                    let btnDelete = `
                                            <button
                                                type="button"
                                                class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button"
                                                data-bs-toggle="tooltip" data-bs-placement="top" title=""
                                                data-bs-original-title="Delete" href="#"
                                                data-url="${tblEle.attr('data-url-delete').replaceAll('__pk__', row.id)}}"
                                                data-method="DELETE"
                                                data-url-redirect="${window.location.href}"
                                            >
                                                <span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span>
                                            </button>
                                        `;
                                    return btnEdit + btnDelete;
                                },
                            },
                        ]
                    });
                }
            });
        });
    }

    $('#link-tab-feature').on('shown.bs.tab', function () {
        if (!$(this).attr('data-loaded')) {
            $(this).attr('data-loaded', 'true');
            $.fn.callAjax2({
                url: $(this).attr('data-url-app-list'),
                method: 'GET',
                isLoading: true,
                sweetAlertOpts: {'allowOutsideClick': true},
            }).then(
                resp => {
                    let data = $.fn.switcherResp(resp);

                    if (typeof data === 'object' && data.hasOwnProperty('feature_app_list')){
                        let appData = data['feature_app_list'];
                        if (Array.isArray(appData)){
                            appData.map(
                                (item) => {
                                    let ele$ = $(
                                        groupSample$.children().prop('outerHTML')
                                            .replaceAll('__feature_title__', item.title)
                                            .replaceAll('__application_id__', item.id)
                                    );
                                    groupSample$.parent().append(ele$);
                                }
                            )
                            active_events();
                        }

                    }
                },
                errs => console.log(errs),
            )
        }
    })
})