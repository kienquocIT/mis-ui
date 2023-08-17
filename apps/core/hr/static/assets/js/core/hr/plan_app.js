let dtb = $('#dtb-plan-app');

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
        this.isEdit = dtb.attr('data-is-edit') === 'true';
        this.eleUserSelected = $('#select-box-user');
    }

    getFullData() {
        return this.dtb.DataTable().rows().data().toArray();
    }

    // load step 1
    loadData(tenant_plan_list) {
        console.log(tenant_plan_list);
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
                                return `
                                    <div class="col-md-3 col-sm-6 col-12"><div class="form-check">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input mr-1 app-my-checkbox"
                                            id="${idxRandom}"
                                            data-id="${item.id}"
                                            ${item?.['checked'] === true ? "checked" : ""}
                                            ${clsThis.isEdit ? "" : "disabled"}
                                        />
                                        <label class="form-check-label wrap-text" for="${idxRandom}">${item.title}</label>
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
            rowCallback: function (row, data, index) {
                $(row).on('change', '.app-my-checkbox', function () {
                    let checkEle$ = $(this);
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
    }

    // load step 2 | depends on step 1: loadData
    appendPlanAppOfEmployee(plan_app) {
        let DtbData = this.getFullData();
        let planByID = HandlePlanApp.convertToIDPlan(plan_app);
        DtbData.map((item) => {
            item['hasCheckInit'] = false;
            let planData = item?.['plan'];
            if (planData) {
                let mappedData = planByID[planData.id];
                if (mappedData) {
                    let baseAppData = planData?.['application']
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