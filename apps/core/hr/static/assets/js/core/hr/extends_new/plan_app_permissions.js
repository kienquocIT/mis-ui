function getAllAppOfTenant() {
    let dtbPlanAppNew = elePermit.tblPlanApp;
    if (dtbPlanAppNew.length > 0) {
        let frm = new SetupFormSubmit(dtbPlanAppNew);
        return $.fn.callAjax2({
            'url': frm.dataUrl,
            'method': frm.dataMethod,
            'isDropdown': true,
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('tenant_plan_list')) {
                return data.tenant_plan_list;
            }
            return [];
        });
    }
    return new Promise(function (resolve, reject) {
        resolve();
    }).then(() => {
        return [];
    });
}

let elePermit = {
    tabsGroupAppPermit: $('#group-tab-app-permit'),
    tblPlanApp: $('#dtb-plan-app-new'),
    tblPermission: $('#permissions_list_new'),
    newRowAppEle: $('#new-row-app'),
    newRowAllEle: $('#new-row-all'),
    newRowViewEle: $('#new-row-view'),
    newRowCreateEle: $('#new-row-create'),
    newRowEditEle: $('#new-row-edit'),
    newRowDeleteEle: $('#new-row-delete'),
    newRowRangeEle: $('#new-row-range'),
    newRowSpaceEle: $('#new-row-space'),
    btnAddNewPermit: $('#new-row-add'),
    btnResetAll: $('#btnResetAll'),
    btnResetApp: $('#btnResetApp'),
    btnResetPermit: $('#btnResetPermit'),
    inputSearchApp: $('#searching-highlight-plan-app'),
    tabSummaryInfo: $("#tab-summary-info"),
    permissionIndex: {},

    resetNewRow: function (resetApp = false) {
        this.btnAddNewPermit.prop('disabled', true);
        this.newRowAllEle.prop('checked', false).prop('disabled', true);
        this.newRowViewEle.prop('checked', false).prop('disabled', true);
        this.newRowCreateEle.prop('checked', false).prop('disabled', true);
        this.newRowEditEle.prop('checked', false).prop('disabled', true);
        this.newRowDeleteEle.prop('checked', false).prop('disabled', true);
        this.newRowRangeEle.val("").prop('disabled', true).find('option').prop('disabled', true);
        this.newRowSpaceEle.val("").prop('disabled', true).find('option').prop('disabled', true);
        if (resetApp === true) this.newRowAppEle.val("").prop('disabled', true);
    },

    resetRange: function () {
        let allow_view_arr = this.newRowViewEle.prop('checked') && this.newRowRangeEle.attr('data-allow-view') ? this.newRowRangeEle.attr('data-range-view').split(",") : null;
        let allow_create_arr = this.newRowCreateEle.prop('checked') && this.newRowRangeEle.attr('data-allow-create') ? this.newRowRangeEle.attr('data-range-create').split(",") : null;
        let allow_edit_arr = this.newRowEditEle.prop('checked') && this.newRowRangeEle.attr('data-allow-edit') ? this.newRowRangeEle.attr('data-range-edit').split(",") : null;
        let allow_delete_arr = this.newRowDeleteEle.prop('checked') && this.newRowRangeEle.attr('data-allow-delete') ? this.newRowRangeEle.attr('data-range-delete').split(",") : null;

        HandlePlanAppNew.rangeMultiMerge(
            allow_view_arr, allow_create_arr, allow_edit_arr, allow_delete_arr
        ).map(
            item => this.newRowRangeEle.find('option[value="' + item + '"').prop('disabled', false)
        )
    },

    setAll: function () {
        let stateAll = !!(this.newRowViewEle.prop('checked') === true && this.newRowCreateEle.prop('checked') === true && this.newRowEditEle.prop('checked') === true && this.newRowDeleteEle.prop('checked') === true);
        this.newRowAllEle.prop('checked', stateAll);
    },

    setButtonAdd: function () {
        let state = (
            this.newRowAppEle.val() && $x.fn.checkUUID4(this.newRowAppEle.val())
            && (
                (this.newRowViewEle.attr('data-allow') === 'true' ? this.newRowViewEle.prop('checked') : false)
                || (this.newRowCreateEle.attr('data-allow') === 'true' ? this.newRowCreateEle.prop('checked') : false)
                || (this.newRowEditEle.attr('data-allow') === 'true' ? this.newRowEditEle.prop('checked') : false)
                || (this.newRowDeleteEle.attr('data-allow') === 'true' ? this.newRowDeleteEle.prop('checked') : false)
            )
            && this.newRowRangeEle.val() && this.newRowRangeEle.val() !== ""
            && (!HandlePlanAppNew.hasSpaceChoice
                || (
                    HandlePlanAppNew.hasSpaceChoice && this.newRowSpaceEle.val() && this.newRowSpaceEle.val() !== ""
                )
            )
        );

        this.btnAddNewPermit.prop('disabled', !state);
    },

    listener: function () {
        let clsThis = this;

        //
        // Reset Data
        this.btnResetAll.on('click', function () {
            clsThis.btnResetApp.trigger('click');
            clsThis.btnResetPermit.trigger('click');
        })
        this.btnResetApp.on('click', function () {
            HandlePlanAppNew.app_by_id = {};
            HandlePlanAppNew.plan_app = [];
            elePermit.tblPlanApp.find('input.plan-app-checkbox').prop('checked', false);
        });
        this.btnResetPermit.on('click', function () {
            elePermit.tblPermission.DataTable().clear().draw();
        });
        // -- Reset Data
        //

        //
        // Add new row
        this.btnAddNewPermit.on('click', function () {
            let data = {
                'app_id': clsThis.newRowAppEle.val(),
                'range': clsThis.newRowRangeEle.val(),
                'space': clsThis.newRowSpaceEle.val(),
                'view': clsThis.newRowViewEle.prop('checked'),
                'create': clsThis.newRowCreateEle.prop('checked'),
                'edit': clsThis.newRowEditEle.prop('checked'),
                'delete': clsThis.newRowDeleteEle.prop('checked'),
            }
            let dtb_tmp = clsThis.tblPermission.DataTable();
            dtb_tmp.row.add(data).draw(false);

            // switch to end page.
            let totalPages = dtb_tmp.page.info().pages;
            let currentPages = dtb_tmp.page.info().page;
            if (totalPages - 1 > currentPages) {
                $.fn.notifyB({
                    'description': $.fn.gettext("Current page automatically goes to end page after the new row was added"),
                }, 'info')
            }
            dtb_tmp.page(totalPages - 1).draw('page');
        });
        // -- Add new row
        //


        //
        // On change
        this.newRowAppEle.on('change', function () {
            clsThis.resetNewRow();
            let appData = HandlePlanAppNew.getAppDetail($(this).val());
            if (appData && typeof appData === 'object') {
                clsThis.newRowSpaceEle.prop('disabled', false).find('option[value=""]').prop('disabled', false);
                let spacing_allow = $x.fn.hasOwnProperties(appData, ['spacing_allow']) ? appData['spacing_allow'] : [];
                clsThis.newRowSpaceEle.find('option').each(function (){
                    $(this).prop('disabled', (spacing_allow.indexOf($(this).val()) === -1));
                });

                let [isView, viewRange] = HandlePlanAppNew.isAppAllowPermit(appData, 'view');
                clsThis.newRowViewEle
                    .attr('data-allow', isView)
                    .attr('data-range', viewRange.join(","))
                    .prop('disabled', !isView);

                let [isCreate, createRange] = HandlePlanAppNew.isAppAllowPermit(appData, 'create');
                clsThis.newRowCreateEle
                    .attr('data-allow', isCreate)
                    .attr('data-range', createRange)
                    .prop('disabled', !isCreate);

                let [isEdit, editRange] = HandlePlanAppNew.isAppAllowPermit(appData, 'edit');
                clsThis.newRowEditEle
                    .attr('data-allow', isEdit)
                    .attr('data-range', editRange)
                    .prop('disabled', !isEdit);

                let [isDelete, deleteRange] = HandlePlanAppNew.isAppAllowPermit(appData, 'delete');
                clsThis.newRowDeleteEle
                    .attr('data-allow', isDelete)
                    .attr('data-range', deleteRange)
                    .prop('disabled', !isDelete);

                clsThis.newRowAllEle.prop('disabled', !(isView && isCreate && isEdit && isDelete));
                clsThis.newRowRangeEle.prop('disabled', false)
                    .attr('data-allow-view', isView)
                    .attr('data-range-view', isView ? viewRange.join(",") : "")
                    .attr('data-allow-create', isCreate)
                    .attr('data-range-create', isCreate ? createRange.join(",") : "")
                    .attr('data-allow-edit', isEdit)
                    .attr('data-range-edit', isEdit ? editRange.join(",") : "")
                    .attr('data-allow-delete', isDelete)
                    .attr('data-range-delete', isDelete ? deleteRange.join(",") : "")
            } else {
                $.fn.notifyB({
                    'description': 'Get data of app is not found!',
                }, 'failure');
            }
        });

        this.newRowViewEle.on('change', function () {
            clsThis.resetRange();
            clsThis.setAll();
            clsThis.setButtonAdd();
        });

        this.newRowCreateEle.on('change', function () {
            clsThis.resetRange();
            clsThis.setAll();
            clsThis.setButtonAdd();
        });

        this.newRowEditEle.on('change', function () {
            clsThis.resetRange();
            clsThis.setAll();
            clsThis.setButtonAdd();
        });

        this.newRowDeleteEle.on('change', function () {
            clsThis.resetRange();
            clsThis.setAll();
            clsThis.setButtonAdd();
        });

        this.newRowAllEle.on('change', function () {
            let state = !!$(this).prop('checked');

            if (clsThis.newRowViewEle.attr('data-allow') === 'true') clsThis.newRowViewEle.prop('checked', state);
            if (clsThis.newRowViewEle.attr('data-allow') === 'true') clsThis.newRowCreateEle.prop('checked', state);
            if (clsThis.newRowEditEle.attr('data-allow') === 'true') clsThis.newRowEditEle.prop('checked', state);
            if (clsThis.newRowDeleteEle.attr('data-allow') === 'true') clsThis.newRowDeleteEle.prop('checked', state);

            clsThis.resetRange();
            clsThis.setButtonAdd();
        });

        this.newRowRangeEle.on('change', function () {
            clsThis.setButtonAdd();
        });

        this.newRowSpaceEle.on('change', function () {
            clsThis.setButtonAdd();
        });
        // On change
        //

        // Utility
        this.inputSearchApp.on('input', function () {
            if ($(this).val()) {
                let searchRg = new RegExp(`(.*)${$(this).val().trim().toLowerCase()}(.*)`);
                clsThis.tblPlanApp.find('label.form-check-label').each(function () {
                    let resultRg = $(this).text().trim().toLowerCase().match(searchRg) || [];
                    resultRg.length > 0 ? $(this).addClass('bg-warning') : $(this).removeClass('bg-warning');
                })
            } else {
                clsThis.tblPlanApp.find('label.form-check-label').removeClass('bg-warning');
            }
        })
        // -- Utility

        // tab summary
        this.tabsGroupAppPermit.on('shown.bs.tab', function (event) {
            let target = event.target;
            if ($(target).attr('href') === '#tab-summary-permissions' && !$(target).attr('data-loaded')) {
                $(target).attr('data-loaded', true);

                let urlApp = clsThis.tabSummaryInfo.attr('data-url-app');
                let appAPI = $.fn.callAjax2({
                    url: urlApp,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('app_list')) {
                            return data.app_list
                        }
                        return {};
                    }
                );

                let urlPlan = clsThis.tabSummaryInfo.attr('data-url-plan');
                let planAPI = $.fn.callAjax2({
                    url: urlPlan,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('plan_list')) {
                            return data.plan_list
                        }
                        return {}
                    }
                );

                let urlPermit = clsThis.tabSummaryInfo.attr('data-url-permission');
                let permitAPI = $.fn.callAjax2({
                    url: urlPermit,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('permissions_list')) {
                            return data.permissions_list;
                        }
                        return {}
                    }
                )

                $x.fn.showLoadingPage();
                Promise.all([planAPI, appAPI, permitAPI]).then(
                    (results) => {
                        SummaryPlanAppNew.planData = results[0];
                        new SummaryPlanAppNew().renderPlan();
                        return results;
                    }
                ).then(
                    (results) => {
                        SummaryPlanAppNew.appData = results[1];
                        new SummaryPlanAppNew().renderApp();
                        return results;
                    }
                ).then(
                    (results) => {
                        SummaryPlanAppNew.permitData = results[2];
                        new SummaryPlanAppNew().renderPermission();
                        return results;
                    }
                ).then(
                    (results) => {
                        new SummaryPlanAppNew().renderRoleTable();
                        $x.fn.hideLoadingPage();
                    }
                )
            }
        });
    },
}

elePermit.listener();


class SummaryPlanAppNew {
    static appData = {};
    static planData = {};
    static permitData = {};

    itemAppHTML(data) {
        return data && typeof data === 'object' ? `<span class="badge badge-soft-primary badge-outline badge-pill mr-1 mb-1">${data?.['title'] || ''}</span>` : '';
    }

    itemPlanHTML(data) {
        if (data && typeof data === 'object') {
            let clsExtend = 'badge-primary';
            if (data.code === 'base') clsExtend = 'badge-indigo';
            if (data.code === 'sale') clsExtend = 'badge-danger';
            if (data.code === 'e-office') clsExtend = 'badge-warning';
            return data && typeof data === 'object' ? `<span class="badge ${clsExtend} mr-1 mb-1">${data?.['title'] || ''}</span>` : '';
        }
        return '';
    }

    renderApp() {
        let data = SummaryPlanAppNew.appData;
        let groupSummaryApp = $('#idx-summary-app');
        groupSummaryApp.html("");
        let summaryApp = data?.['summary'];
        (summaryApp && Array.isArray(summaryApp) ? summaryApp : []).map(
            (item) => groupSummaryApp.append(this.itemAppHTML(item))
        )

        let groupEmployeeApp = $('#idx-employee-app-group');
        groupEmployeeApp.html("");
        let employeeApp = data?.['employee'];
        (employeeApp && Array.isArray(employeeApp) ? employeeApp : []).map(
            (item) => {
                groupEmployeeApp.append(
                    this.itemAppHTML(item)
                )
            }
        )
    }

    renderPlan() {
        let data = SummaryPlanAppNew.planData;
        let groupSummaryPlan = $('#idx-summary-plan');
        groupSummaryPlan.html("");
        let summaryPlan = data?.['summary'];
        (summaryPlan && Array.isArray(summaryPlan) ? summaryPlan : []).map(
            (item) => {
                let tenantPlanData = item['tenant_plan'] || {};

                let quantityUsed = tenantPlanData?.['license_used'] || '';

                let quantityLimit = '';
                if (typeof tenantPlanData?.['is_limited'] === 'boolean') {
                    if (tenantPlanData?.['is_limited'] === true) {
                        quantityLimit = tenantPlanData?.['license_quantity'] || '_';
                    } else if (tenantPlanData?.['is_limited'] === false) {
                        quantityLimit = '<i class="fa-solid fa-infinity"></i>';
                    }
                } else {
                    quantityLimit = '_';
                }

                let expiredHtml = '';
                if (tenantPlanData?.['is_expired'] === true) {
                    expiredHtml = `
                        <i 
                            class="fa-solid fa-heart-crack text-danger"
                            data-bs-toggle="tooltip" data-bs-placement="top" 
                            title="${groupSummaryPlan.attr('data-msg-state-broken')}"
                        ></i>
                    `;
                } else {
                    expiredHtml = `
                        <div class="heart-beat-container">
                        <i 
                            class="fa-solid fa-heart text-success heart-beat-icon"
                            data-bs-toggle="tooltip" data-bs-placement="top" 
                            title="${groupSummaryPlan.attr('data-msg-state-maintaining')}"
                        ></i>
                        </div>
                    `;
                }

                let html = `
                    <tr>
                        <td>${this.itemPlanHTML(item['plan'])}</td>
                        <td>${tenantPlanData?.['date_active'] || '_'}</td>
                        <td>${tenantPlanData?.['date_end'] || '_'}</td>
                        <td>${quantityUsed + " / " + quantityLimit}</td>
                        <td>${expiredHtml}</td>
                    </tr>
                `;
                groupSummaryPlan.append(html);
            }
        )

        let groupEmployeePlan = $('#idx-employee-plan-group');
        groupEmployeePlan.html("");
        let employeePlan = data?.['employee'];
        (employeePlan && Array.isArray(employeePlan) ? employeePlan : []).map(
            (item) => {
                groupEmployeePlan.append(
                    this.itemPlanHTML(item)
                )
            }
        )
    }

    renderRoleTable() {
        let clsThis = this;
        let result = {};
        let planOfRole = SummaryPlanAppNew.planData['roles'];
        if (planOfRole && Array.isArray(planOfRole)) {
            planOfRole.map(
                (item) => {
                    if (!result.hasOwnProperty(item.id)) {
                        result[item.id] = {
                            'id': item.id,
                            'title': item.title,
                            'code': item.code,
                            'plan': [],
                            'application': []
                        }
                    }
                    result[item.id]['plan'] = result[item.id]['plan'].concat(item['plan'] || []);
                }
            )
        }
        let appOfRole = SummaryPlanAppNew.appData['roles'];
        if (appOfRole && Array.isArray(appOfRole)) {
            appOfRole.map(
                (item) => {
                    if (!result.hasOwnProperty(item.id)) {
                        result[item.id] = {
                            'id': item.id,
                            'title': item.title,
                            'code': item.code,
                            'plan': [],
                            'application': []
                        }
                    }
                    result[item.id]['application'] = result[item.id]['application'].concat(item['application'] || []);
                }
            )
        }

        let newResult = Object.keys(result).map(
            (key) => {
                return result[key];
            }
        )
        $('#dtb-plan-app-group-of-employee').DataTableDefault({
            data: newResult,
            rowIdx: true,
            columns: [
                {
                    render: (data, type, row) => {
                        return '';
                    },
                },
                {
                    render: (data, type, row) => {
                        return row.title;
                    },
                },
                {
                    render: (data, type, row) => {
                        return row.plan.map(
                            (item) => {
                                return clsThis.itemPlanHTML(item)
                            }
                        ).join("")
                    },
                },
                {
                    render: (data, type, row) => {
                        return row.application.map(
                            (item) => {
                                return clsThis.itemAppHTML(item)
                            }
                        ).join("");
                    },
                },
            ]
        })
    }

    renderPermission() {
        let clsThis = this;

        // application by id (fast find detail app);
        let appByID = {};
        let appSummary = SummaryPlanAppNew.appData['summary'];
        if (appSummary && Array.isArray(appSummary)) {
            appSummary.map(
                (item) => {
                    appByID[item.id] = item;
                }
            )
        }

        //
        let result = [];
        let data = SummaryPlanAppNew.permitData;
        let permitEmployee = data?.['employee'];
        if (permitEmployee && Array.isArray(permitEmployee)) {
            result = permitEmployee.map(
                (item) => {
                    return {
                        ...item,
                        'app_data': appByID[item.app_id] || {},
                    }
                }
            );
        }
        let roleAllData = [];
        let permitRoles = data?.['roles'];
        (permitRoles && Array.isArray(permitRoles) ? permitRoles : []).map(
            (item) => {
                let role_data = {
                    'id': item.id,
                    'title': item.title,
                    'code': item.code,
                }
                roleAllData.push(role_data);
                let permission_by_configured = item?.['permission_by_configured'] || [];
                if (permission_by_configured && Array.isArray(permission_by_configured)) {
                    permission_by_configured.map(
                        (item2) => {
                            result.push({
                                'role_data': role_data,
                                ...item2,
                                'app_data': appByID[item2.app_id] || {},
                            })
                        }
                    )
                }
            }
        )
        let tblSummaryPermission = $('#tbl-summary-permissions');
        tblSummaryPermission.DataTableDefault({
            rowIdx: true,
            data: result.sort(
                function (a, b) {
                    let aTitle = a?.['app_data']?.['title'];
                    let bTitle = b?.['app_data']?.['title'];

                    if (aTitle && bTitle && typeof aTitle === 'string' && typeof bTitle === 'string') {
                        return aTitle.localeCompare(bTitle);
                    }
                    return !!aTitle;
                }
            ),
            columns: [
                {
                    render: (data, type, row) => {
                        return '';
                    }
                },
                {
                    data: 'role_data',
                    render: (data, type, row) => {
                        if (data && typeof data === 'object') {
                            if (data.hasOwnProperty('title')) return data['title'];
                            return '_';
                        }
                        return '';
                    }
                },
                {
                    data: "app_data",
                    render: (data, type, row) => {
                        if (data) return clsThis.itemAppHTML(data);
                        return '_';
                    }
                },
                {
                    data: "view",
                    render: (data, type, row) => {
                        if (data && typeof data === 'boolean') {
                            return `<i class="fa-solid fa-check text-success"></i>`
                        }
                        return `<i class="fa-solid fa-xmark text-danger"></i>`;
                    }
                },
                {
                    data: "create",
                    render: (data, type, row) => {
                        if (data && typeof data === 'boolean') {
                            return `<i class="fa-solid fa-check text-success"></i>`
                        }
                        return `<i class="fa-solid fa-xmark text-danger"></i>`;
                    }
                },
                {
                    data: "edit",
                    render: (data, type, row) => {
                        if (data && typeof data === 'boolean') {
                            return `<i class="fa-solid fa-check text-success"></i>`
                        }
                        return `<i class="fa-solid fa-xmark text-danger"></i>`;
                    }
                },
                {
                    data: "delete",
                    render: (data, type, row) => {
                        if (data && typeof data === 'boolean') {
                            return `<i class="fa-solid fa-check text-success"></i>`
                        }
                        return `<i class="fa-solid fa-xmark text-danger"></i>`;
                    }
                },
                {
                    data: "range",
                    render: (data, type, row) => {
                        return HandlePlanAppNew.getHtmlRange(null, data, "*", true);
                    }
                },
            ],
            initComplete: function (settings, json) {
                let optHTML = roleAllData.map(
                    (item) => {
                        return `<option value="${item.id}">${item.title}</option>`
                    }
                ).join("");

                let roleSelect = $(`
                        <select class="form-select form-select-sm w-200p">
                            <option value="all" selected>${tblSummaryPermission.attr('data-msg-all-roles')}</option>
                            ${optHTML}
                        </select> 
                `);

                $(tblSummaryPermission).closest('.dataTables_wrapper ').find('.dtb-header-toolbar').prepend(roleSelect);
                roleSelect.on('change', function () {
                    let dtb_tmp = tblSummaryPermission.DataTable();
                    if ($(this).val() === 'all'){
                        dtb_tmp.search("").draw();
                    } else {
                        dtb_tmp.search(
                            roleSelect.find('option[value="' + $(this).val() + '"]').text(),
                        ).draw();
                    }
                })
            },
        })
    }
}

class HandlePlanAppNew {
    static editEnabled = true; // flag enable edit
    static hasSpaceChoice = true; // flag visible columns space
    static rangeAllowOfApp = ['1', '2', '3', '4']; // flag include/exclude range when render
    static rangeText = {
        '1': elePermit.tblPermission.attr('data-msg-of-me'),
        '2': elePermit.tblPermission.attr('data-msg-staff'),
        '3': elePermit.tblPermission.attr('data-msg-same-group'),
        '4': elePermit.tblPermission.attr('data-msg-all-employee'),
    }; // map text for range when render
    static spaceAllowOfApp = ["0", "1"]; // flag include/exclude space when render
    static spaceText = {
        "0": elePermit.tblPermission.attr('data-msg-general'),
        "1": elePermit.tblPermission.attr('data-msg-all'),
    }
    static dtb = elePermit.tblPermission; // table render permit
    static app_by_id = {}; // convert plan_app to dict by app_id (for search app data)
    static app_has_perm_already = {};
    static plan_app = []; // init plan_app fill to it
    static permission_by_configured = []; // init permit fill to it
    static tenant_plan_app = []; // plan_app was bought by tenant
    static manual_app_list_and_not_plan_app = false; // for case permission not has tab app!

    static rangeMultiMerge(allow_view_arr, allow_create_arr, allow_edit_arr, allow_delete_arr) {
        let allow_arr = (Array.isArray(allow_view_arr) ? allow_view_arr : []).concat(Array.isArray(allow_create_arr) ? allow_create_arr : []).concat(Array.isArray(allow_edit_arr) ? allow_edit_arr : []).concat(Array.isArray(allow_delete_arr) ? allow_delete_arr : []);
        return Array.from(new Set(allow_arr)).filter(
            value =>
                (Array.isArray(allow_view_arr) ? allow_view_arr.indexOf(value) !== -1 : true)
                && (Array.isArray(allow_create_arr) ? allow_create_arr.indexOf(value) !== -1 : true)
                && (Array.isArray(allow_edit_arr) ? allow_edit_arr.indexOf(value) !== -1 : true) && (Array.isArray(allow_delete_arr) ? allow_delete_arr.indexOf(value) !== -1 : true)
        );
    }

    static pushPlanApp(plan_id, app_data, selected = true) {
        HandlePlanAppNew.app_by_id[app_data.id] = {
            ...app_data,
            'selected': selected, // AUTO true because load from detail of instance!
            'plan_id': plan_id,
        }
        HandlePlanAppNew.app_has_perm_already[app_data.id] = false
    }

    static setPlanApp(plan_app, reset_before_add = false) {
        if (reset_before_add === true) {
            HandlePlanAppNew.plan_app = [];
            HandlePlanAppNew.app_by_id = {};
        }
        HandlePlanAppNew.plan_app = plan_app;
        HandlePlanAppNew.plan_app.map((planData) => {
            let appData = planData?.['application'] || [];
            if (appData && Array.isArray(appData)) {
                appData.map((appDataForPlan) => {
                    let idx = appDataForPlan?.['id'] || null;
                    if (idx && $x.fn.checkUUID4(idx)) {
                        // AUTO true because load from detail of instance!
                        HandlePlanAppNew.pushPlanApp(planData['id'], appDataForPlan, true);
                    }
                })
            }
        })
    }

    static setPlanAppByAppList(app_list, render_opt_app = false) {
        if (render_opt_app === true) elePermit.newRowAppEle.find('option').remove();
        elePermit.newRowAppEle.append(`<option value="">--</option>`)
        if (app_list && Array.isArray(app_list))
            app_list.map((item) => {
                HandlePlanAppNew.pushPlanApp(null, item, true);
                if (render_opt_app === true)
                    elePermit.newRowAppEle.append(`<option value="${item.id}">${item.title}</option>`)
            })
    }

    static setPermissionByConfigured(permission_by_configured) {
        HandlePlanAppNew.permission_by_configured = permission_by_configured;
    }

    static hasTabPlanApp() {
        return !(elePermit.tblPlanApp.length === 0);
    }

    static hasTabPermission() {
        return !(elePermit.tblPermission.length === 0);
    }

    static getHtmlRange(app_id, data, allow_range, simplyDisplay = false) {
        if (!allow_range || allow_range === '*') allow_range = ['1', '2', '3', '4'];
        allow_range = $x.fn.keepExistInOther(allow_range, HandlePlanAppNew.rangeAllowOfApp);

        if (simplyDisplay === true) {
            if (data === "1") {
                return `<span class="badge badge-soft-light">${HandlePlanAppNew.rangeText["1"]}</span>`
            }
            if (data === "2") {
                return `<span class="badge badge-soft-warning">${HandlePlanAppNew.rangeText["2"]}</span>`
            }
            if (data === "3") {
                return `<span class="badge badge-soft-danger">${HandlePlanAppNew.rangeText["3"]}</span>`
            }
            if (data === "4") {
                return `<span class="badge badge-soft-indigo">${HandlePlanAppNew.rangeText["4"]}</span>`
            }
        }

        let opt_of_1 = HandlePlanAppNew.rangeAllowOfApp.indexOf("1") === -1 ? "" : `<option value="1" ${data === "1" ? "selected" : ""} ${allow_range.indexOf("1") === -1 ? "disabled" : ""}>${HandlePlanAppNew.rangeText["1"]}</option>`;
        let opt_of_2 = HandlePlanAppNew.rangeAllowOfApp.indexOf("2") === -1 ? "" : `<option value="2" ${data === "2" ? "selected" : ""} ${allow_range.indexOf("2") === -1 ? "disabled" : ""}>${HandlePlanAppNew.rangeText["2"]}</option>`;
        let opt_of_3 = HandlePlanAppNew.rangeAllowOfApp.indexOf("3") === -1 ? "" : `<option value="3" ${data === "3" ? "selected" : ""} ${allow_range.indexOf("3") === -1 ? "disabled" : ""}>${HandlePlanAppNew.rangeText["3"]}</option>`;
        let opt_of_4 = HandlePlanAppNew.rangeAllowOfApp.indexOf("4") === -1 ? "" : `<option value="4" ${data === "4" ? "selected" : ""} ${allow_range.indexOf("4") === -1 ? "disabled" : ""}>${HandlePlanAppNew.rangeText["4"]}</option>`;

        return `<select class="form-select range-permit-select" id="range-${app_id}" ${HandlePlanAppNew.editEnabled !== true ? "disabled" : ""}>${opt_of_1} ${opt_of_2} ${opt_of_3} ${opt_of_4}</select>`;
    }

    static getHtmlSpace(app_id, data, allow_space) {
        if (!allow_space || allow_space === '*') allow_space = ['0', '1'];
        allow_space = $x.fn.keepExistInOther(allow_space, HandlePlanAppNew.spaceAllowOfApp);
        let opt_of_0 = HandlePlanAppNew.spaceAllowOfApp.indexOf("0") ? "" : `<option value="0" ${data === "0" ? "selected" : ""} ${allow_space.indexOf("0") === -1 ? "disabled" : ""}>${HandlePlanAppNew.spaceText["0"]}</option>`;
        let opt_of_1 = `<option value="1" ${data === "1" ? "selected" : ""} ${allow_space.indexOf("1") === -1 ? "disabled" : ""}>${HandlePlanAppNew.spaceText["1"]}</option>`;

        return `<select class="form-select space-permit-select" id="space-${app_id}" ${
            HandlePlanAppNew.editEnabled !== true ? "disabled" : ""}>
            ${opt_of_0} ${opt_of_1}
        </select>`;
    }

    static getAppDetail(app_id) {
        if (app_id) {
            let app_data = {};
            if (typeof HandlePlanAppNew.app_by_id === 'object' && Object.keys(HandlePlanAppNew.app_by_id).length > 0) {
                app_data = HandlePlanAppNew.app_by_id?.[app_id];
            } else if (HandlePlanAppNew.plan_app && Array.isArray(HandlePlanAppNew.plan_app)) {
                let app_by_id = {};
                HandlePlanAppNew.plan_app.map((item) => {
                    let appData = item?.['application'] || [];
                    if (appData && Array.isArray(appData)) {
                        appData.map((item2) => {
                            let idx = item2?.['id'] || null;
                            if (idx && $x.fn.checkUUID4(idx)) {
                                app_by_id[idx] = item2;
                                if (idx === app_id) app_data = item2;
                            }
                        })
                    }
                })
            }
            if (
                typeof app_data !== 'object' ||
                (
                    typeof app_data === 'object'
                    && Object.keys(app_data).length === 0
                )
            ) {
                app_data = SelectDDControl.get_data_from_idx(elePermit.newRowAppEle, app_id);
            }
            return app_data;
        }
        return {};
    }

    static isAppAllowPermit(appData, key) {
        if (appData && typeof appData === 'object') {
            let permit_mapping = appData['permit_mapping'] || {};
            if (permit_mapping) {
                if (permit_mapping.hasOwnProperty(key)) {
                    return [true, permit_mapping[key]?.['range'] || []];
                }
            }
        }
        return [false, []];
    }

    static getRangeAppAllowPermit(appData, key) {
        if (appData && typeof appData === 'object' && appData.hasOwnProperty('permit_mapping')) {
            let permitMapping = appData['permit_mapping'];
            if (permitMapping && typeof permitMapping === 'object' && permitMapping.hasOwnProperty(key)) {
                let keyData = permitMapping[key];
                if (keyData && typeof keyData === 'object' && keyData.hasOwnProperty('range')) {
                    let rangeData = keyData['range'];
                    if (rangeData && Array.isArray(rangeData)) {
                        return [true, rangeData]
                    }
                }
            }
        }
        return [false, null]
    }

    renderAppSelected(app_selected) {
        // use for import app
        let allAppID = [];
        (
            app_selected && Array.isArray(app_selected) ? app_selected : []
        ).map(
            (item) => {
                let appData = item?.['application'] || [];
                if (appData && Array.isArray(appData)) {
                    allAppID = allAppID.concat(appData);
                }
            }
        )
        return this.renderDTBApp(
            elePermit.tblPlanApp.DataTable().rows().data().toArray(),
            allAppID,
        )
    }

    renderDTBApp(allData, allAppID) {
        if ($.fn.DataTable.isDataTable( '#' + elePermit.tblPlanApp.attr('id') )){
            elePermit.tblPlanApp.DataTable().destroy();
        }

        const getFirstLetter = (str) => {
            if (!str || typeof str !== 'string') return '#';
            return str.trim().charAt(0).toUpperCase();
        };

        return elePermit.tblPlanApp.DataTableDefault({
            dom: 't',
            useDataServer: false,
            rowIdx: false,
            paging: false,
            scrollX: true,
            scrollY: '68vh',
            scrollCollapse: true,
            data: allData,
            columns: [
                {
                    className: 'w-10',
                    data: 'id',
                    render: function (data, type, row, meta) {
                        if (data && row.hasOwnProperty('title') && row.hasOwnProperty('code')) {
                            return `<h5 class="text-primary" data-id="${row?.['id']}">${row?.['title']}</h5>`;
                        }
                        return '';
                    }
                }, {
                    className: 'w-90',
                    data: 'application',
                    render: (data, type, row) => {
                        if (!Array.isArray(data) || !data.length) return $.fn.gettext('No application');

                        // 1. Sort A → Z theo title_i18n
                        const sortedData = [...data].sort((a, b) => {
                            const aTitle = a?.['title_i18n'] || '';
                            const bTitle = b?.['title_i18n'] || '';
                            return aTitle.localeCompare(bTitle, 'vi', { sensitivity: 'base' });
                        });

                        // 2. Group theo chữ cái đầu
                        const grouped = {};
                        sortedData.forEach(item => {
                            const letter = getFirstLetter(item?.['title_i18n']);
                            if (!grouped[letter]) grouped[letter] = [];
                            grouped[letter].push(item);
                        });

                        // 3. Render HTML
                        let html = '';

                        const letters = Object.keys(grouped || {}).sort();

                        letters.forEach((letter, index) => {

                            const isLastLetter = index === letters.length - 1;
                            const borderClass = !isLastLetter ? 'border-bottom' : '';

                            const apps = grouped?.[letter] || [];

                            const app_html = apps.map(item => `
                                <div class="col-lg-2 col-md-4 col-12">
                                    <div class="form-check">
                                        <input 
                                            type="checkbox"
                                            class="form-check-input plan-app-checkbox"
                                            id="app-${item?.['id']}"
                                            data-id="${item?.['id']}"
                                            ${allAppID?.includes(item?.['id']) ? "checked" : ""}
                                            ${HandlePlanAppNew?.editEnabled !== true ? "disabled" : ""}
                                        >
                                        <label class="form-check-label" for="app-${item?.['id']}">
                                            ${item?.['title_i18n'] || ''}
                                        </label>
                                    </div>
                                </div>
                            `).join('');

                            html += `
                                <div class="col-2 col-md-1 col-lg-1 ${borderClass}">
                                    <h6 class="text-primary my-3">${letter}</h6>
                                </div>
                                <div class="col-10 col-md-11 col-lg-11 ${borderClass}">
                                    <div class="row my-3">
                                        ${app_html}
                                    </div>
                                </div>
                            `;
                        });

                        return `<div class="row">${html}</div>`;
                    }
                }, {
                    visible: false,
                    render: (data, type, row) => {
                        return ''
                    }
                },
            ],
            rowGroup: {
                dataSrc: 'title',
                startRender: function (rows, title) {
                    return $('<tr class="group-header">').append(`<td colspan="100%"><span class="text-primary fw-bold h5">${title}</span></td>`);
                }
            },
            columnDefs: [
                {
                    "visible": false,
                    "targets": [0]
                }
            ],
            rowCallback: function (row, data) {
                $(row).find('input.plan-app-checkbox').on('change', function () {
                    let state = $(this).prop('checked');

                    let appID = $(this).attr('data-id');
                    if (appID && $x.fn.checkUUID4(appID)) {
                        let appData = data?.['application'] || [];
                        for (let i = 0; i < appData.length; i++) {
                            if (appData[i].id === appID) {
                                if (!HandlePlanAppNew.app_by_id.hasOwnProperty(appID)) {
                                    // add app to storage when not found!
                                    HandlePlanAppNew.pushPlanApp(data['id'], appData[i], false);
                                }
                                HandlePlanAppNew.app_by_id[appID]['selected'] = state;

                                break;
                            }
                        }
                    }
                }).trigger('change');
            },
        })
    }

    renderTenantApp(tenant_plan_list) {
        HandlePlanAppNew.tenant_plan_app = tenant_plan_list; // backup tenant_plan_app for showing app disabled in permit
        if (HandlePlanAppNew.hasTabPlanApp() === true) {
            let allData = [];
            let allAppID = [];
            if (tenant_plan_list && Array.isArray(tenant_plan_list)) {
                allData = tenant_plan_list.map((item) => {
                    return item.plan || {};
                })
            }
            if (HandlePlanAppNew.plan_app && Array.isArray(HandlePlanAppNew.plan_app)) {
                HandlePlanAppNew.plan_app.map((item1) => {
                    let appData = item1?.['application'] || [];
                    if (appData && Array.isArray(appData)) {
                        appData.map((item2) => {
                            let idx = item2?.['id'] || null;
                            if (idx && $x.fn.checkUUID4(idx)) {
                                allAppID.push(item2.id);
                            }
                        })
                    }
                })
            }
            return this.renderDTBApp(allData, allAppID);
        }
    }

    renderPermissionSelected(instance_id = null, app_list_params = {}) {
        let clsThis = this;
        if (instance_id) {
            if (elePermit.newRowAppEle.hasClass("select2-hidden-accessible")) {
                elePermit.newRowAppEle.select2('destroy');
                elePermit.newRowAppEle.find('option').remove();
            }
            let urlBase = elePermit.newRowAppEle.attr('data-base-url');
            elePermit.newRowAppEle.attr('data-url', urlBase.replaceAll('__pk__', instance_id));
        }
        if (HandlePlanAppNew.editEnabled === true) {
            if (HandlePlanAppNew.manual_app_list_and_not_plan_app === true) {
                // $x.fn.showLoadingPage();
                $.fn.callAjax2({
                    url: elePermit.newRowAppEle.attr('data-url'),
                    type: 'GET',
                    isDropdown: true,
                    isNotify: false,
                    data: {
                        ...app_list_params,
                        pageSize: -1,
                    }
                }).then(
                    (resp) => {
                        // $x.fn.hideLoadingPage();
                        let data = $.fn.switcherResp(resp);
                        let keyResp = elePermit.newRowAppEle.attr('data-keyResp');
                        if (data && typeof data === 'object' && data.hasOwnProperty(keyResp)) {
                            HandlePlanAppNew.setPlanAppByAppList(data[keyResp], true);
                            clsThis.renderTablePermissionSelected(true, instance_id);
                            elePermit.newRowAppEle.trigger('change');
                            return data[keyResp];
                        }
                        return [];
                    },
                    (errs) => {
                        clsThis.renderTablePermissionSelected(instance_id);
                        // $x.fn.hideLoadingPage();
                    }
                )
            }
            else {
                $.fn.callAjax2({
                    url: elePermit.newRowAppEle.data('url'),
                    method: 'GET',
                    data: {
                        'pageSize': -1,
                    },
                }).then(
                    resp => {
                        const data = $.fn.switcherResp(resp);
                        if (data && data.hasOwnProperty('app_list')){
                            const app_list = data['app_list'].sort(function (a, b) {
                                return a.title_i18n.localeCompare(b.title_i18n)
                            });
                            elePermit.newRowAppEle.initSelect2({
                                ajax: null,
                                data: [{}].concat(app_list),
                                keyId: 'id',
                                keyText: 'title_i18n',
                            }).val("");
                        }
                    },
                );
                clsThis.renderTablePermissionSelected(instance_id);
            }
        } else {
            clsThis.renderTablePermissionSelected(instance_id);
        }
    }

    renderTablePermissionSelected(clearOldData=true, permission_selected=null) {
        function initCompleteFunc() {
            if (HandlePlanAppNew.editEnabled !== true) {
                $('#idx-new-row-add').addClass('d-none');
                HandlePlanAppNew.dtb.DataTable().column(-1).visible(false).draw();
            }

            if (!HandlePlanAppNew.hasSpaceChoice) {
                HandlePlanAppNew.dtb.DataTable().column(-2).visible(false).draw();
            }

            Object.entries(HandlePlanAppNew.app_has_perm_already).forEach(([appId, hasPerm]) => {
                if (!hasPerm) {
                    if ($(`#app-${appId}`).prop('checked')) {
                        $(`#app-${appId}`).closest('.form-check').find('label').addClass('text-warning');
                    }
                }
            });
        }

        if (HandlePlanAppNew.hasTabPermission() === true) {
            let dtb = HandlePlanAppNew.dtb;
            if ($.fn.DataTable.isDataTable('#' + dtb.attr('id'))) {
                clearOldData === true ? dtb.DataTable().clear().draw() : null;
                // dtb.DataTable().rows.add(permission_selected ? permission_selected : HandlePlanAppNew.permission_by_configured).draw();
                // a.Dell đã thay thế dòng này :D vì khi click member lần 2 thì object của permission_selected ko
                // chính xác nữa
                let newData = HandlePlanAppNew.permission_by_configured
                if (permission_selected && typeof permission_selected === 'object') newData = permission_selected
                dtb.DataTable().rows.add(newData).draw();
                initCompleteFunc();
            } else {
                let dataList = HandlePlanAppNew.permission_by_configured.map(
                    (item) => {
                        let appID = item?.['app_id'] || null;
                        HandlePlanAppNew.app_has_perm_already[appID] = true
                        let appData = appID ? HandlePlanAppNew.getAppDetail(appID) : {};
                        return {
                            ...item,
                            'appData': appData,
                        }
                    }
                ).sort(
                    (a, b) => {
                        let aAppDataTitle = a?.['appData']?.['title_i18n'] || null;
                        let bAppDataTitle = b?.['appData']?.['title_i18n'] || null;
                        if (aAppDataTitle && bAppDataTitle && typeof aAppDataTitle === 'string' && typeof bAppDataTitle === 'string') {
                            return aAppDataTitle.localeCompare(bAppDataTitle);
                        } else if (aAppDataTitle) return true;
                        else if (bAppDataTitle) return false;
                        return true;
                    }
                )
                dtb.DataTableDefault({
                    data: dataList,
                    useDataServer: false,
                    paging: false,
                    rowIdx: false,
                    scrollX: true,
                    scrollY: '52vh',
                    scrollCollapse: true,
                    columns: [
                        {
                            className: 'w-15',
                            render: (data, type, row) => {
                                if (!row.hasOwnProperty('appData') && row?.app_id) {
                                    row.appData = HandlePlanAppNew.getAppDetail?.(row.app_id) || {};
                                }

                                if (!row?.['id']) {
                                    return `<span hidden>${row?.['appData']?.['title_i18n']}</span><span class="text-success">${$.fn.gettext('New permission')}</span>`;
                                }

                                if (row?.['appData']?.['title_i18n']) {
                                    const group = row?.['appData']?.['title_i18n'];
                                    if (!group) return '_';

                                    if (!elePermit.permissionIndex[group]) {
                                        elePermit.permissionIndex[group] = 0;
                                    }

                                    elePermit.permissionIndex[group]++;

                                    return `<span hidden>${row?.['appData']?.['title_i18n']}</span><span class="text-muted">${$.fn.gettext('Permission')} ${elePermit.permissionIndex[group]}</span>`;
                                }

                                row.app_data_not_found = true;
                                return `<span class="text-secondary app-title">_</span>`;
                            },
                        }, {
                            className: 'w-10',
                            render: (data, type, row) => {
                                let state = !!(row['create'] === true && row['view'] === true && row['edit'] === true && row['delete'] === true);
                                let app_id = row['app_id'];
                                if (app_id) {
                                    return `
                                    <div class="form-check form-switch">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input " 
                                            id="all-${app_id}"
                                            ${state === true ? "checked" : ""}
                                            ${HandlePlanAppNew.editEnabled !== true ? "disabled" : ""}
                                        >
                                    </div>
                                `;
                                }
                                return ``;
                            },
                        }, {
                            className: 'w-10',
                            data: "view",
                            render: (data, type, row) => {
                                let app_id = row['app_id'];
                                if (app_id) {
                                    let [state, _range] = HandlePlanAppNew.isAppAllowPermit(row.appData, "view");
                                    return `
                                    <div class="form-check form-switch">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input permit-checkbox" 
                                            id="view-${app_id}"
                                            ${data === true ? "checked" : ""}
                                            ${HandlePlanAppNew.editEnabled !== true || !state ? "disabled" : ""}
                                        >
                                    </div>
                                `;
                                }
                                return ``;
                            },
                        }, {
                            className: 'w-10',
                            data: "create",
                            render: (data, type, row) => {
                                let [state, _range] = HandlePlanAppNew.isAppAllowPermit(row.appData, "create");
                                let app_id = row['app_id'];
                                if (app_id) {
                                    return `
                                    <div class="form-check form-switch">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input permit-checkbox" 
                                            id="create-${app_id}"
                                            ${data === true ? "checked" : ""}
                                            ${HandlePlanAppNew.editEnabled !== true || !state ? "disabled" : ""}
                                        >
                                    </div>
                                `;
                                }
                                return ``;
                            },
                        }, {
                            className: 'w-10',
                            data: "edit",
                            render: (data, type, row) => {
                                let [state, _range] = HandlePlanAppNew.isAppAllowPermit(row.appData, "edit");
                                let app_id = row['app_id'];
                                if (app_id) {
                                    return `
                                    <div class="form-check form-switch">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input permit-checkbox" 
                                            id="edit-${app_id}"
                                            ${data === true ? "checked" : ""}
                                            ${HandlePlanAppNew.editEnabled !== true || !state ? "disabled" : ""}
                                        >
                                    </div>
                                `;
                                }
                                return ``;
                            },
                        }, {
                            className: 'w-10',
                            data: "delete",
                            render: (data, type, row) => {
                                let [state, _range] = HandlePlanAppNew.isAppAllowPermit(row.appData, "delete");
                                let app_id = row['app_id'];
                                if (app_id) {
                                    return `
                                    <div class="form-check form-switch">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input permit-checkbox" 
                                            id="delete-${app_id}"
                                            ${data === true ? "checked" : ""}
                                            ${HandlePlanAppNew.editEnabled !== true || !state ? "disabled" : ""}
                                        >
                                    </div>
                                `;
                                }
                                return ``;
                            },
                        }, {
                            className: 'w-15',
                            data: "range",
                            render: (data, type, row) => {
                                let [_state_view, range_view] = HandlePlanAppNew.getRangeAppAllowPermit(row.appData, 'view');
                                let [_state_create, range_create] = HandlePlanAppNew.getRangeAppAllowPermit(row.appData, 'create');
                                let [_state_edit, range_edit] = HandlePlanAppNew.getRangeAppAllowPermit(row.appData, 'edit');
                                let [_state_delete, range_delete] = HandlePlanAppNew.getRangeAppAllowPermit(row.appData, 'delete');
                                let allow_range = HandlePlanAppNew.rangeMultiMerge(range_view, range_create, range_edit, range_delete);
                                return HandlePlanAppNew.getHtmlRange(row['app_id'], data, allow_range);
                            },
                        }, {
                            className: 'w-15',
                            data: "space",
                            render: (data, type, row) => {
                                if (data === null) {
                                    row.space = "0"
                                    data = "0";
                                }
                                if ($x.fn.hasOwnProperties(row.appData, ['spacing_allow'])){
                                    return HandlePlanAppNew.getHtmlSpace(row['app_id'], data, row.appData['spacing_allow']);
                                }
                                return HandlePlanAppNew.getHtmlSpace(row['app_id'], data, [data]);
                            },
                        }, {
                            className: 'w-5',
                            render: (data, type, row) => {
                                return `
                                <div class="d-flex justify-content-end">
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-md btnRemoveRowPermit"
                                    >
                                        <span class="icon"><i class="fa-solid fa-xmark"></i></span>
                                    </button>
                                </div>
                            `;
                            },
                        },
                    ],
                    rowGroup: {
                        dataSrc: 'appData.title_i18n',
                        startRender: function (rows, title_i18n) {
                            return $('<tr class="group-header">').append(`<td colspan="100%"><span class="text-primary fw-bold h5">${title_i18n}</span></td>`);
                        }
                    },
                    columnDefs: [
                        {
                            "visible": true,
                            "targets": [0]
                        }
                    ],
                    preDrawCallback: function () {
                        elePermit.permissionIndex = {};
                    },
                    rowCallback: function (row, data) {
                        let cls_err = 'bg-secondary bg-opacity-25 row-error-disabled';
                        let cls_pass = '';
                        if (data.app_data_not_found === true) {
                            $(row).removeClass(cls_pass).addClass(cls_err);
                            $(row).find('input, select').prop('disabled', true);
                            if (data.app_id) {
                                let url_app_detail = elePermit.tblPermission.attr('data-url-app-detail').replaceAll('__pk__', data.app_id)
                                $.fn.callAjax2({
                                    url: url_app_detail,
                                    type: 'GET',
                                    cache: true,
                                }).then(
                                    (resp) => {
                                        let data = $.fn.switcherResp(resp);
                                        if (data && typeof data === 'object' && data.hasOwnProperty('application_detail')) {
                                            let application_detail = data['application_detail'];
                                            if (application_detail?.['title']) {
                                                $(row).find('.app-title').text(application_detail?.['title']);
                                            }
                                        }
                                    }
                                )
                            }
                        }
                        else {
                            $(row).removeClass(cls_err).addClass(cls_pass);
                        }

                        $(row).find('input.permit-checkbox').on('change', function () {
                            let idx = $(this).attr('id');
                            let state = $(this).prop('checked');
                            $x.fn.updateDataRow($(this), function (clsThat, rowIdx, rowData) {
                                if (idx.startsWith('view-')) {
                                    rowData['view'] = state;
                                } else if (idx.startsWith('create-')) {
                                    rowData['create'] = state;
                                } else if (idx.startsWith('edit-')) {
                                    rowData['edit'] = state;
                                } else if (idx.startsWith('delete-')) {
                                    rowData['delete'] = state;
                                }
                                return rowData;
                            }, true);
                        });

                        $(row).find('select.range-permit-select').on('change', function () {
                            let value = $(this).val();
                            $x.fn.updateDataRow($(this), function (clsThat, rowIdx, rowData) {
                                rowData['range'] = value;
                                return rowData;
                            }, true);
                        });

                        $(row).find('select.space-permit-select').on('change', function () {
                            let value = $(this).val();
                            $x.fn.updateDataRow($(this), function (clsThat, rowIdx, rowData) {
                                rowData['space'] = value;
                                return rowData;
                            }, true);
                        })

                        $(row).find('button.btnRemoveRowPermit').on('click', function () {
                            let msgPerm = $('#plan_app_permission_msg');
                            Swal.fire({
                                title: msgPerm.attr('data-msg-are-u-sure'),
                                text: msgPerm.attr('data-msg-not-revert'),
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: msgPerm.attr('data-msg-yes-delete-it'),
                                cancelButtonText: msgPerm.attr('data-msg-cancel'),
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    DTBControl.deleteRow($(this));
                                }
                            })
                        })
                    },
                    initComplete: function () {
                        initCompleteFunc();
                    }
                })
            }
        }
    }

    combinesPlanApp() {
        let app_selected = {};
        Object.keys(HandlePlanAppNew.app_by_id).map((key) => {
            if (HandlePlanAppNew.app_by_id[key].selected === true) {
                if (!app_selected.hasOwnProperty(HandlePlanAppNew.app_by_id[key].plan_id)) {
                    app_selected[HandlePlanAppNew.app_by_id[key].plan_id] = {
                        'plan': HandlePlanAppNew.app_by_id[key].plan_id,
                        'application': []
                    };
                }
                app_selected[HandlePlanAppNew.app_by_id[key].plan_id]['application'].push(key);
            }
        })

        let result = [];
        Object.keys(app_selected).map((key) => {
            if (app_selected[key].application.length > 0) result.push(app_selected[key]);
        });
        return result;
    }

    combinesPermissions() {
        return HandlePlanAppNew.dtb.DataTable().rows().data().toArray();
    }
}
