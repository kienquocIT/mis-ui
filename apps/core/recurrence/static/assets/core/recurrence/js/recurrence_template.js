$(document).ready(function () {
    // declare main variable
    let $table = $('#table_template_list');
    let $transFact = $('#app-trans-factory');
    let $urls = $('#app-urls-factory');
    let appMapUrlRecurrence = {
        "saleorder.saleorder": {
            'url': $urls.attr('data-so-recurrence'),
            'keyResp': "sale_order_recurrence",
        },
        "leaseorder.leaseorder": {
            'url': $urls.attr('data-lo-recurrence'),
            'keyResp': "lease_order_recurrence",
        },
        "arinvoice.arinvoice": {
            'url': $urls.attr('data-ar-recurrence'),
            'keyResp': "ar_invoice_recurrence",
        }
    }
    let appMapUrl = {
        'saleorder.saleorder': {
            "detail": $urls.attr('data-so-detail'),
        },
    }

    // INIT DATATABLE APP LIST
    let LIST_APP_URL = $table.attr('data-app-list');
    $table.DataTableDefault({
        ajax: {
            url: LIST_APP_URL,
            type: "GET",
            data: function (params) {
                params['allow_recurrence'] = true;
                return params
            },
            dataSrc: function (resp){
              let data = $.fn.switcherResp(resp);
              if (data && data.hasOwnProperty('tenant_application_list')) return data['tenant_application_list'];
              return [];
            },
        },
        pageLength:50,
        columns: [
            {
                data: 'title_i18n',
                targets: 0,
                width: "20%",
                render: (data, type, row) => {
                    return `<button class="btn-collapse-app-wf btn btn-icon btn-rounded mr-1"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${data}</b>`;
                }
            },
        ]
    }, false);

    // EVENT CHANGE IN LINE APP LIST
    $(document).on('change', '.mode-workflow', function (event) {
        event.preventDefault();
        let valId = $(this).val();
        let state = confirm($('#idxSpanMsgGroup').attr('data-make-sure') + ' "' + $(this).find('option[value="' + valId + '"]').text() + '"');
        let previousValue = $(this).data("previousValue");
        if (!state) {
            $(this).prop("selectedIndex", -1);
            if (previousValue) $(this).val(previousValue);
        } else {
            let rowData = DTBControl.getRowData($(this));
            if (rowData.id) {
                WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
                let urlBase = $('#url-factory').attr('data-url-app-workflow-detail');
                let urlData = SetupFormSubmit.getUrlDetailWithID(urlBase, rowData.id);
                $.fn.callAjax(urlData, 'PUT', {'mode': valId}, $("input[name=csrfmiddlewaretoken]").val(),).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data?.status === 200) {
                        $.fn.notifyB({
                            'description': $('#base-trans-factory').attr('data-success')
                        }, 'success');
                    }
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000,)
                }, (errs) => {
                    if (previousValue) $(this).val(previousValue);
                    WindowControl.hideLoading();
                })

            }
        }
    });
    $(document).on('change', '.select-workflow-current', function (event) {
        event.preventDefault();
        let valId = $(this).val();
        let state = confirm($('#idxSpanMsgGroup').attr('data-make-sure') + ' "' + $(this).find('option[value="' + valId + '"]').text() + '"');
        if (!state) {
            let previousValue = $(this).data("previousValue");
            $(this).prop("selectedIndex", -1);
            if (previousValue) $(this).val(previousValue);
        } else {
            let rowData = DTBControl.getRowData($(this));
            if (rowData.id) {
                WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
                let urlBase = $('#url-factory').attr('data-url-app-workflow-detail');
                let urlData = SetupFormSubmit.getUrlDetailWithID(urlBase, rowData.id);
                $.fn.callAjax(urlData, 'PUT', {'workflow_currently': valId}, $("input[name=csrfmiddlewaretoken]").val(),).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data?.status === 200) {
                        $.fn.notifyB({
                            'description': $('#base-trans-factory').attr('data-success')
                        }, 'success');
                    }
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000,)
                }, (errs) => {
                    WindowControl.hideLoading();
                })

            }
        }
    });

    // EVENT CLICK TO COLLAPSE IN LINE APP LIST
    //      ACTION: INSERT TABLE WORKFLOW LIST TO NEXT ROW (OF APP LIST)
    $(document).on('click', '.btn-collapse-app-wf', function (event) {
        event.preventDefault();

        let idTbl = UtilControl.generateRandomString(12);
        let trEle = $(this).closest('tr');
        let iconEle = $(this).find('.icon-collapse-app-wf');

        iconEle.toggleClass('fa-caret-right').toggleClass('fa-caret-down');

        if (iconEle.hasClass('fa-caret-right')) {
            trEle.removeClass('bg-grey-light-5');
            iconEle.removeClass('text-dark').addClass('text-secondary');
            trEle.next().find('.child-workflow-group').slideToggle({
                complete: function () {
                    trEle.next().addClass('hidden');
                }
            });
        }

        if (iconEle.hasClass('fa-caret-down')) {
            trEle.addClass('bg-grey-light-5');
            iconEle.removeClass('text-secondary').addClass('text-dark');

            if (!trEle.next().hasClass('child-workflow-list')) {
                let dtlSub = `<table id="${idTbl}" class="table nowrap w-100 mb-5"><thead></thead><tbody></tbody></table>`
                $(this).closest('tr').after(
                    `<tr class="child-workflow-list"><td colspan="4"><div class="child-workflow-group pt-3 pb-3 ml-3 pl-5 pr-5 hidden-simple">${dtlSub}</div></td></tr>`
                );

                let rowData = DTBControl.getRowData($(this));
                let urlData = {};
                if (rowData?.['app_label'] && rowData?.['model_code']) {
                    let contentType = rowData?.['app_label'] + "." + rowData?.['model_code'];
                    urlData = appMapUrlRecurrence[contentType];
                }

                let placeGetData = $('#url-factory');
                let urlWorkflowDetail = placeGetData.attr('data-url-workflow-detail');
                $('#' + idTbl).DataTableDefault({
                    "url-detail": urlWorkflowDetail,
                    ajax: {
                        url: urlData?.['url'],
                        type: 'GET',
                        data: {'is_recurrence_template': true, 'employee_inherit_id': $x.fn.getEmployeeCurrentID()},
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data) return resp.data[urlData?.['keyResp']] ? resp.data[urlData?.['keyResp']] : [];
                            return [];
                        },
                    },
                    columns: [
                        {
                            title: '#',
                            render: (data, type, row, meta) => {
                                return `<span class="table-row-order">${(meta.row + 1)}</span>`
                            }
                        },
                        {
                            title: $transFact.attr('data-title'),
                            render: (data, type, row) => {
                                let link = "";
                                let contentType = rowData?.['app_label'] + "." + rowData?.['model_code'];
                                if (appMapUrl[contentType]?.['detail']) {
                                    link = appMapUrl[contentType]?.['detail'].format_url_with_uuid(row?.['id']);
                                }
                                return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`;
                            }
                        },
                        {
                            title: $transFact.attr('data-transaction-type'),
                            render: () => {
                                return rowData?.['title'];
                            }
                        },
                        {
                            title: $transFact.attr('data-beneficiary'),
                            render: (data, type, row) => {
                                return `${row?.['employee_inherit']?.['full_name']}`;
                            }
                        },
                        {
                            title: $transFact.attr('data-date'),
                            render: (data, type, row) => {
                                if (row?.['date_created']) {
                                    return moment(row?.['date_created'],
                                        'YYYY-MM-DD').format('DD/MM/YYYY');
                                }
                                return ``;
                            }
                        },
                        {
                            title: $transFact.attr('data-status'),
                            render: (data, type, row) => {
                                if (row?.['status'] === true) {
                                    return $transFact.attr('data-linked');
                                }
                                return $transFact.attr('data-not-linked');
                            }
                        },
                        {
                            title: $transFact.attr('data-action'),
                            render: (data, type, row) => {
                                let body = `${$transFact.attr('data-no-data')}`;
                                if (row?.['recurrence_list'].length > 0) {
                                    body = ``;
                                    for (let recurrence of row?.['recurrence_list']) {
                                        let link = $urls.attr('data-recurrence-detail').format_url_with_uuid(recurrence?.['id']);
                                        body += `<a class="dropdown-item" href="${link}">${recurrence?.['title']}</a><div class="dropdown-divider"></div>`;
                                    }
                                }
                                return `<div class="dropdown">
                                            <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-edit"></i></span></button>
                                            <div role="menu" class="dropdown-menu dropdown-bordered">${body}</div>
                                        </div>`;
                            }
                        },
                    ],
                });
            }
            trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
        }
    });
});
