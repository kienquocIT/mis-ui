$(document).ready(function () {
    // declare main variable
    let $table = $('#table_workflow_list');
    let txt_mode = {
        0: $('.wf-mode a:nth-child(1)').text(),
        1: $('.wf-mode a:nth-child(2)').text(),
        // 2: $('.wf-mode a:nth-child(3)').text(),
    }
    let error_map = {
        0: 'danger',
        1: 'success',
    };
    let txt_state_wf_doc = {
        0: ["Created", "badge-soft-secondary"],
        1: ["In Progress", "badge-soft-warning"],
        2: ["Finish", "badge-soft-success"],
        3: ["Finish with flow non-apply", "badge-soft-info"],
    }
    let txt_status_wf_doc = {
        0: "Waiting",
        1: "Success",
        2: "Fail",
        3: "Pending",
    }
    let $transFact = $('#app-trans-factory');

    // INIT DATATABLE APP LIST
    let LIST_APP_URL = $table.attr('data-app-list');
    $table.DataTableDefault({
        ajax: {
            url: LIST_APP_URL,
            type: "GET",
            data: function (params) {
                params['is_ajax'] = true;
                return params
            },
            dataSrc: function (resp){
              let data = $.fn.switcherResp(resp);
              // if (data && data.hasOwnProperty('app_list')) return data['app_list'];
              if (data && data.hasOwnProperty('app_list')) {
                  return DataProcessorControl.sortArrayByObjectKey(data['app_list'], "title_i18n");
              }
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
            }, {
                data: 'mode',
                targets: 1,
                width: "25%",
                render: (data, type, row) => {
                    let htmlDropdown = '';
                    Object.keys(txt_mode).map((key) => {
                        htmlDropdown += `<option value="${key}" ${key?.toString() === data?.toString() ? "selected" : ""}>${txt_mode[key]}</option>`;
                    })
                    return `<select class="form-select mode-workflow">${htmlDropdown}</select>`;
                }
            }, {
                data: 'error_total',
                targets: 2,
                width: "10%",
                class: 'text-center',
                render: (data, type, row) => {
                    return `<span>${data}</span>`;
                }
            }, {
                data: 'workflow_currently',
                targets: 3,
                width: "25%",
                render: (data, type, row) => {
                    if (data) {
                        return UtilControl.initElementInitSelect({
                            'onload': {
                                'id': data.id,
                                'title': data.title
                            },
                            'dummy-data': {
                                id: data.id,
                                'title': data.title,
                            },
                            'url': $('#url-factory').attr('data-child'),
                            'params': {
                                'application': row?.['application_id'],
                                'is_active': true,
                            },
                            'result-key': 'workflow_list',
                            'class-name': 'select-workflow-current'
                        }, 'html');
                    }
                    return '';
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
                let placeGetData = $('#url-factory');
                let urlData = placeGetData.attr('data-url-workflow-list');
                let urlWorkflowDetail = placeGetData.attr('data-url-workflow-detail');
                let urlWorkflowUpdate = placeGetData.attr('data-url-workflow-update');
                $('#' + idTbl).DataTableDefault({
                    "url-detail": urlWorkflowDetail,
                    ajax: {
                        url: urlData + '?' + $.param({'application': rowData?.['application_id']}),
                        type: 'GET',
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data) return resp.data['workflow_list'] ? resp.data['workflow_list'] : [];
                            return [];
                        },
                    },
                    columns: [
                        {
                            title: '#',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        }, {
                            title: $transFact.attr('data-title'),
                            data: 'title',
                            render: (data, type, row, meta) => {
                                return `<button class="btn-collapse-doc-wf btn btn-icon btn-rounded mr-1"><span class="icon"><i class="icon-collapse-doc-wf fas fa-caret-right text-secondary"></i></span></button> ${data}`;
                            }
                        }, {
                            title: $transFact.attr('data-date-applied'),
                            data: 'date_applied',
                            render: (data, type, row, meta) => {
                                let dateApplied = '--';
                                if (data) {
                                    dateApplied = moment(data).format('DD/MM/YYYY');
                                }
                                return dateApplied;
                            }
                        }, {
                            title: $transFact.attr('data-wait-complete'), // data: 'is_active',
                            class: 'text-center',
                            render: (data, type, row, meta) => {
                                return `<span>0</span>`;
                            }
                        }, {
                            title: $transFact.attr('data-action'),
                            render: (data, type, row, meta) => {
                                let btnEdit = `<a href="${SetupFormSubmit.getUrlDetailWithID(urlWorkflowUpdate, row.id)}"><button class="btn btn-icon btn-rounded bg-dark-hover mr-1"><span class="icon"><i class="far fa-edit"></i></span></button></a>`
                                let btnDelete = `<button class="btn-delete-wf btn btn-icon btn-rounded bg-dark-hover mr-1"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`
                                let btnSend = `<button class="btn-change-wf-doc btn btn-icon btn-rounded bg-dark-hover mr-1"><span class="icon"><i class="far fa-paper-plane"></i></span></button>`
                                return btnEdit + btnDelete + btnSend;
                            }
                        },
                    ],
                });
            }
            trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
        }
    });

    // EVENT IN LINE WORKFLOW LIST
    $(document).on('click', '.btn-delete-wf', function (event) {
        event.preventDefault();
        let rowData = DTBControl.getRowData($(this));
        alert('Delete WF: ' + rowData?.['title']);
    });
    $(document).on('click', '.btn-change-wf-doc', function (event) {
        event.preventDefault();
        let rowData = DTBControl.getRowData($(this));
        alert('Change WF of doc: ' + rowData?.['title']);
    });

    // EVENT CLICK TO COLLAPSE IN LINE WORKFLOW LIST
    //      ACTION: INSERT RUNTIME OBJ LIST TO NEXT ROW (OF WORKFLOW LIST)
    $(document).on('click', '.btn-collapse-doc-wf', function (event) {
        event.preventDefault();
        let idTbl = UtilControl.generateRandomString(12);
        let trEle = $(this).closest('tr');
        let iconEle = $(this).find('.icon-collapse-doc-wf');
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
                    `<tr class="child-workflow-list"><td colspan="6"><div class="child-workflow-group pt-3 pb-3 ml-3 pl-5 pr-5 hidden-simple">${dtlSub}</div></td></tr>`
                )

                let rowData = DTBControl.getRowData($(this));
                let urlRuntimeList = $('#url-factory').attr('data-url-workflow-runtime-list');
                $('#' + idTbl).DataTableDefault({
                    ajax: {
                        url: SetupFormSubmit.getUrlDetailWithID(urlRuntimeList, rowData.id),
                        type: 'GET',
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                console.log(data)
                                return resp.data['runtime_list'] ? resp.data['runtime_list'] : [];
                            }
                            return [];
                        },
                    },
                    columns: [
                        {
                            title: "#",
                            render: () => {
                                return '';
                            }
                        },
                        {
                            data: 'doc_title',
                            title: "Title",
                            render: (data, type, row) => {
                                return data ? data : '';
                            }
                        },
                        {
                            data: 'doc_employee_created',
                            title: "Creator",
                            render: (data, type, row) => {
                                if (data && $.fn.hasOwnProperties(data, ['id', 'full_name', 'is_active'])) {
                                    if (data['is_active'] === true) return data['full_name'] + ` <span class="badge badge-success badge-indicator"></span>`;
                                    return data['full_name'] + `<span class="badge badge-secondary badge-indicator"></span>`;
                                }
                                return '_';
                            }
                        },
                        {
                            data: "date_created",
                            title: "Posting date",
                            render: (data, type, row) => {
                                return $x.fn.displayRelativeTime(data);
                            }
                        },
                        {
                            data: 'stage_currents',
                            title: "Node currently",
                            render: (data, type, row) => {
                                if (typeof data === 'object' && $.fn.hasOwnProperties(data, ['id', 'title', 'code'])) {
                                    if (data['code']) {
                                        return `<span class="badge badge-warning badge-outline">${data['code']}</span>`;
                                    } else {
                                        return `<span class="badge badge-success badge-outline">${data['title']}</span>`;
                                    }
                                }
                                return '_';
                            }
                        },
                        {
                            data: "state",
                            title: "Status",
                            render: (data, type, row, meta) => {
                                if (data && Number.isFinite(data)) {
                                    if (txt_state_wf_doc.hasOwnProperty(data)) {
                                        return `<span class="badge ${txt_state_wf_doc[data][1]}">${txt_state_wf_doc[data][0]}</span>`;
                                    }
                                }
                                return `<span class="badge badge-soft-success">OK</span>`;
                            }
                        },
                        {
                            title: "Action",
                            render: (data, type, row) => {
                                if (!(row.state === 2 || row.state === 3 || row.status === 1)) {
                                    return `<button class="btn btn-icon btn-rounded bg-dark-hover mr-1"><span class="icon"><i class="far fa-paper-plane"></i></span></button>`;
                                }
                                return '_';
                            }
                        },
                    ]
                });
            }
            trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
        }

        // if (iconEle.hasClass('fa-caret-right')) {
        //     trEle.addClass('bg-grey-light-5');
        //     iconEle.removeClass('text-secondary').addClass('text-dark');
        //     iconEle.removeClass('fa-caret-right').addClass('fa-caret-down');
        //     if (trEle.next().hasClass('child-workflow-list')) {
        //         trEle.next().removeClass('hidden');
        //     } else {
        //         let dtlSub = `<table id="${idTbl}" class="table nowrap w-100 mb-5"><thead></thead><tbody></tbody></table>`
        //         $(this).closest('tr').after(`<tr class="child-workflow-list"><td colspan="6"><div class="child-workflow-group pt-3 pb-3 ml-3 pl-5 pr-5">${dtlSub}</div></td></tr>`)
        //
        //         let rowData = DTBControl.getRowData($(this));
        //         let urlRuntimeList = $('#url-factory').attr('data-url-workflow-runtime-list');
        //         $('#' + idTbl).DataTableDefault({
        //             ajax: {
        //                 url: SetupFormSubmit.getUrlDetailWithID(urlRuntimeList, rowData.id),
        //                 type: 'GET',
        //                 dataSrc: function (resp) {
        //                     let data = $.fn.switcherResp(resp);
        //                     if (data) {
        //                         console.log(data)
        //                         return resp.data['runtime_list'] ? resp.data['runtime_list'] : [];
        //                     }
        //                     return [];
        //                 },
        //             },
        //             columns: [
        //                 {
        //                     title: "#",
        //                     render: () => {
        //                         return '';
        //                     }
        //                 },
        //                 {
        //                     data: 'doc_title',
        //                     title: "Title",
        //                     render: (data, type, row) => {
        //                         return data ? data : '';
        //                     }
        //                 },
        //                 {
        //                     data: 'doc_employee_created',
        //                     title: "Creator",
        //                     render: (data, type, row) => {
        //                         if (data && $.fn.hasOwnProperties(data, ['id', 'full_name', 'is_active'])) {
        //                             if (data['is_active'] === true) return data['full_name'] + ` <span class="badge badge-success badge-indicator"></span>`;
        //                             return data['full_name'] + `<span class="badge badge-secondary badge-indicator"></span>`;
        //                         }
        //                         return '_';
        //                     }
        //                 },
        //                 {
        //                     data: "date_created",
        //                     title: "Posting date",
        //                     render: (data, type, row) => {
        //                         if (data) {
        //                             return data;
        //                         }
        //                         return 'Ngày tạo nè';
        //                     }
        //                 },
        //                 {
        //                     data: 'stage_currents',
        //                     title: "Node currently",
        //                     render: (data, type, row) => {
        //                         if (typeof data === 'object' && $.fn.hasOwnProperties(data, ['id', 'title', 'code'])) {
        //                             if (data['code']) {
        //                                 return `<span class="badge badge-warning badge-outline">${data['code']}</span>`;
        //                             } else {
        //                                 return `<span class="badge badge-success badge-outline">${data['title']}</span>`;
        //                             }
        //                         }
        //                         return '_';
        //                     }
        //                 },
        //                 {
        //                     data: "state",
        //                     title: "Status",
        //                     render: (data, type, row, meta) => {
        //                         if (data && Number.isFinite(data)) {
        //                             if (txt_state_wf_doc.hasOwnProperty(data)) {
        //                                 return `<span class="badge ${txt_state_wf_doc[data][1]}">${txt_state_wf_doc[data][0]}</span>`;
        //                             }
        //                         }
        //                         return `<span class="badge badge-soft-success">OK</span>`;
        //                     }
        //                 },
        //                 {
        //                     title: "Action",
        //                     render: (data, type, row) => {
        //                         if (!(row.state === 2 || row.state === 3 || row.status === 1)) {
        //                             return `<button class="btn btn-icon btn-rounded bg-dark-hover mr-1"><span class="icon"><i class="far fa-paper-plane"></i></span></button>`;
        //                         }
        //                         return '_';
        //                     }
        //                 },
        //             ]
        //         });
        //     }
        // } else {
        //     trEle.removeClass('bg-grey-light-5');
        //     iconEle.removeClass('text-dark').addClass('text-secondary');
        //     iconEle.removeClass('fa-caret-down').addClass('fa-caret-right');
        //     if (trEle.next().hasClass('child-workflow-list')) {
        //         trEle.next().addClass('hidden');
        //     }
        // }
    });
});
