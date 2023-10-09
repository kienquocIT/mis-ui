let dtb = $('#dtb-plan-app');
let msgTransEle = $('#idBlockRangeMasterElement');

function callAppList() {
    let frm = new SetupFormSubmit(dtb);
    return $.fn.callAjax2({
        'url': frm.dataUrl,
        'method': frm.dataMethod,
        'isDropdown': true,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
}

function renderAppList(data) {
    if (data && data.hasOwnProperty('tenant_plan_list') && Array.isArray(data.tenant_plan_list)) {
        new HandlePlanApp().loadData(data.tenant_plan_list);
    }
}

class HandlePlanApp {
    static convertToIDPlan(planMapped) {
        let result = {};
        planMapped.map((item) => {
            let application_by_id = {};
            if (item?.['application']) {
                item?.['application'].map((item2) => {
                    application_by_id[item2.id] = item2;
                })
            }

            result[item.id] = {
                'application_by_id': application_by_id, ...item
            };
        })
        return result;
    }

    constructor(opts) {
        this.dtb = dtb;
        this.resetBtn = $('#btnResetApp');
        this.isEdit = dtb.attr('data-is-edit') === 'true';
        this.eleUserSelected = $('#select-box-user');
    }

    getFullData() {
        return this.dtb.DataTable().rows().data().toArray();
    }

    static resetPlanApp() {
        let clsThis = new HandlePlanApp();
        let fullDataPlanApp = clsThis.dtb.DataTable().rows().data().toArray().map(
                (item) => {
                    item['checked'] = false;
                    (item['plan']['application'] || []).map(
                        (item2) => {
                            item2['checked'] = false;
                            return item2;
                        }
                    )
                    return item;
                }
            )
            clsThis.dtb.DataTable().clear().rows.add(fullDataPlanApp).draw();
    }

    // load step 1
    loadData(tenant_plan_list) {
        let clsThis = this;
        this.dtb.DataTableDefault({
            stateDefaultPageControl: false,
            data: tenant_plan_list,
            autoWidth: false,
            columns: [
                {
                    "width": "15%",
                    className: "wrap-text",
                    render: function (data, type, row, meta) {
                        let planData = row?.['plan'];
                        if (planData && planData.hasOwnProperty('id') && planData.hasOwnProperty('title') && planData.hasOwnProperty('code')) {
                            return `<span class="badge badge-${$x.cls.doc.classOfPlan(planData.code)}" data-id="${planData.id}">${planData.title}</span>`;
                        }
                        return '';
                    }
                }, {
                    "width": "75%",
                    render: function (data, type, row, meta) {
                        let applicationData = row?.['plan']?.['application'];
                        if (applicationData && Array.isArray(applicationData)) {
                            let checkHtml = applicationData.map((item) => {
                                let idxRandom = $x.cls.util.generateRandomString(32);
                                let appDependOn = item?.['app_depend_on'] || [];
                                let htmlDependOn = appDependOn.length > 0 ? `
                                    <i 
                                            class="fa-solid fa-circle-info ml-1 show-depend-on"
                                    ></i>
                                ` : '';
                                return `
                                    <div class="col-md-3 col-sm-6 col-12"><div class="form-check">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input mr-1 app-my-checkbox"
                                            id="${idxRandom}"
                                            data-id="${item.id}"
                                            ${item?.['checked'] === true ? "checked" : ""}
                                            ${clsThis.isEdit ? "" : "disabled"}
                                            data-app-depend-on="${appDependOn.join(',')}"
                                        />
                                        <label class="form-check-label wrap-text" for="${idxRandom}">${item.title}</label>
                                        ${htmlDependOn}
                                    </div></div>`;
                            }).join("");
                            return `<div class="row">${checkHtml}</div>`;
                        }
                        return '';
                    }
                }, {
                    "width": "10%",
                    className: "wrap-text",
                    render: function (data, type, row, meta) {
                        let license_quantity = row?.['license_quantity'];
                        let license_used = row?.['license_used'];
                        if (clsThis.eleUserSelected.val()) {
                            license_used += (row?.['mathAdd'] || 0);
                        }
                        return `
                            <span class="badge badge-indigo">${license_used >= 0 ? license_used : 0} / ${typeof license_quantity == 'number' ? license_quantity : globeMsgUnlimited}</span>
                        `;
                    }
                }
            ],
            drawCallback: function (settings) {
                $(clsThis.dtb).find('.app-my-checkbox').each(function () {
                    let infoEle = $(this).parent().find('.show-depend-on');
                    if (infoEle.data('bs-content') === '...') {
                        let appDepend = $(this).attr('data-app-depend-on').split(",");
                        let msg = HandlePlanApp.getDependOnTitle(appDepend);
                        $(this).parent().find('.show-depend-on').attr('data-bs-content', msg.join(", ")).popover();
                    }
                })
            },
            rowCallback: function (row, data, index) {
                $(row).on('click', '.show-depend-on', function () {
                    if (!$(this).data("bs.popover")) {
                        let eleCheck = $(this).parent().find('.app-my-checkbox');
                        let appDepend = $(eleCheck).attr('data-app-depend-on').split(",");
                        let msg = HandlePlanApp.getDependOnTitle(appDepend);
                        $(this).popover({
                            content: msg.join(", "),
                            title: msgTransEle.attr('data-msg-depend-app-show'),
                            container: "#dtb-plan-app_wrapper",
                            placement: "right",
                        }).popover('show');
                    } else {
                        $(this).popover('toggle');
                    }
                })

                $(row).on('change', '.app-my-checkbox', function () {
                    $(row).find('.show-depend-on').popover('hide');
                    let checkEle$ = $(this);
                    let isChecked = checkEle$.prop('checked');

                    if (isChecked === true) {
                        checkEle$.attr('data-app-depend-on').split(",").map(
                            (app_id) => {
                                let eleTmp = $('.app-my-checkbox[data-id="' + app_id + '"]');
                                if (eleTmp.prop('checked') === false) eleTmp.prop('checked', true).trigger('change');
                            }
                        );
                    } else if (!HandlePlanApp.checkDependIsOn(checkEle$.data('id'))) {
                        $(this).prop('checked', true);
                        return false;
                    }

                    $x.fn.updateDataRow($(row), function (clsThat, rowIdx, rowData) {
                        let dataId = checkEle$.attr('data-id');
                        let stateCheck = checkEle$.prop('checked');
                        let appData = rowData?.['plan']?.['application'];

                        rowData['mathAdd'] = 0;
                        let existTrue = $(clsThat).find('.app-my-checkbox').map(function () {
                            return $(this).prop('checked');
                        }).get().includes(true);
                        if (rowData['hasCheckInit']) {
                            if (existTrue !== true) {
                                // remove all app after load init
                                rowData['mathAdd'] = -1;
                            }
                        } else {
                            if (existTrue === true) {
                                // exist one more than checked
                                rowData['mathAdd'] = 1;
                            }
                        }

                        if (appData && Array.isArray(appData)) {
                            for (let i = 0; i < appData.length; i++) {
                                if (appData[i].id === dataId) {
                                    appData[i].checked = stateCheck;
                                    break;
                                }
                            }
                        }
                        return rowData;
                    }, false);
                });
            }
        });

        HandlePlanApp.resetPlanApp();
        HandlePermissions.resetPermit();
    }

    static getDependOnTitle(app_id_arr) {
        let msg = [];
        $('.app-my-checkbox:checked').filter(function () {
            return app_id_arr.includes($(this).data('id'));
        }).each(function () {
            msg.push(
                $(this).next('label').text()
            )
        });
        return msg;
    }

    static checkDependIsOn(app_current_id) {
        let state = true;
        let msg = [];
        $('.app-my-checkbox:checked').filter(function () {
            return $(this).data('app-depend-on').includes(app_current_id)
        }).each(function () {
            state = false;
            msg.push(
                $(this).next('label').text()
            )
        });
        if (state === false) {
            $.fn.notifyB({
                description: msgTransEle.data('msg-depend-app') + ' : ' + msg.join(", ")
            }, 'failure');
        }
        return state;
    }

    // load step 2 | depends on step 1: loadData
    appendPlanAppOfEmployee(plan_app) {
        let DtbData = this.getFullData();
        let planByID = HandlePlanApp.convertToIDPlan(plan_app);
        DtbData.map((item) => {
            item['hasCheckInit'] = false;
            let planData = item?.['plan'];
            if (planData) {
                let baseAppData = planData?.['application'];
                let mappedData = planByID[planData.id];
                if (mappedData) {
                    let appData = mappedData['application_by_id'];
                    if (baseAppData && Array.isArray(baseAppData) && appData && typeof appData === 'object') {
                        baseAppData.map((item2) => {
                            let mappedApp2 = appData[item2.id];
                            if (!!mappedApp2) {
                                item2['checked'] = true;
                                item['hasCheckInit'] = true;
                            } else {
                                item2['checked'] = false
                            }
                        })
                    }
                } else {
                    if (baseAppData && Array.isArray(baseAppData)) {
                        baseAppData.map((item2) => {
                            item2['checked'] = false;
                        })
                    }
                }
            }
        })
        this.dtb.DataTable().clear().rows.add(DtbData).draw();
    }

    combinesData() {
        let result = [];
        let data = this.getFullData();
        if (data && Array.isArray(data)) {
            data.map(
                (item) => {
                    let planData = item['plan'];
                    if (planData) {
                        let appData = planData['application'];
                        if (appData && Array.isArray(appData)) {
                            let appIdTmp = [];
                            appData.map(
                                (item2) => {
                                    if (item2?.['checked'] === true) appIdTmp.push(item2.id);
                                }
                            )
                            if (appIdTmp.length > 0) result.push({
                                'plan': planData.id,
                                'application': appIdTmp,
                            });
                        }
                    }
                }
            )

        }
        return result;
    }
}