let msgPerm = $('#idBlockRangeMasterElement');
let tbl = $('#permissions_list');

tbl.on('click', '.row-e-all', function () {
    let stateCheck = $(this).prop('checked');
    $(this).closest('tr').find('.row-e-child').prop('checked', stateCheck).trigger('change');
});

tbl.on('click', '.row-e-child', function () {
    $(this).trigger('change');
    let rowEle = $(this).closest('tr');
    let allCheck = rowEle.find('.row-e-all');
    let allTrue = true;
    rowEle.find('.row-e-child').each(function () {
        if ($(this).prop('checked') !== true) allTrue = false;
    })
    if (allTrue === true) allCheck.prop('checked', true); else allCheck.prop('checked', false);
    $(allCheck).trigger('change');
});

tbl.on('change', '.row-style-all', function () {
    HandlePermissions.updateDataRow($(this));
})

tbl.on('change', '.row-style-child', function () {
    HandlePermissions.updateDataRow($(this));
})

tbl.on('change', '.row-perm-range', function () {
    HandlePermissions.updateDataRow($(this));
});

tbl.on('click', '.btnRemoveRow', function () {
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

tbl.on('change', '#newRowApp', function () {
    let selectRangeEle = $('#newRowRange');
    let optSelected = $(this).find('option:selected');
    selectRangeEle.find(":selected").prop('selected', false);
    let rangeAllow = $(optSelected).attr('data-range-allow').split(",");
    $(selectRangeEle).find('option').each(function () {
        if (rangeAllow.includes($(this).attr('value'))) {
            $(this).prop('disabled', false).removeClass('hidden');
        } else {
            $(this).prop('disabled', true).addClass('hidden');
        }
    });
    selectRangeEle.val(selectRangeEle.find('option:not([disabled]):first').attr('value')).trigger('change');
})

$('#btnAddNewRowPerms').click(function () {
    let newRowApp = $('#newRowApp');
    let newRowCreateCheck = $('#newRowCreateCheck');
    let newRowViewCheck = $('#newRowViewCheck');
    let newRowEditCheck = $('#newRowEditCheck');
    let newRowDeleteCheck = $('#newRowDeleteCheck');
    let newRowRange = $('#newRowRange');
    if (newRowCreateCheck.prop('checked') || newRowViewCheck.prop('checked') || newRowEditCheck.prop('checked') || newRowDeleteCheck.prop('checked')) {
        let appSelected = newRowApp.find(":selected");

        let tbl = $('#permissions_list').DataTable();
        tbl.row.add({
            "id": null,
            "app_data": {
                "id": appSelected.attr('data-app-id'),
                "title": appSelected.attr('data-app-title'),
                "code": appSelected.attr('data-app-code'),
                "option_permission": appSelected.attr('data-opt-perm'),
                "range_allow": appSelected.attr('data-range-allow').split(','),
            },
            "plan_data": {
                "id": appSelected.attr('data-plan-id'),
                "title": appSelected.attr('data-plan-title'),
                "code": appSelected.attr('data-plan-code'),
            },
            "create": newRowCreateCheck.prop('checked'),
            "view": newRowViewCheck.prop('checked'),
            "edit": newRowEditCheck.prop('checked'),
            "delete": newRowDeleteCheck.prop('checked'),
            "range": newRowRange.val(),
        }).draw(false);

        // switch to end page.
        let totalPages = tbl.page.info().pages;
        let currentPages = tbl.page.info().page;
        if (totalPages - 1 > currentPages) {
            $.fn.notifyB({
                'description': $.fn.storageSystemData.attr('data-msg-goto-end-page'),
            }, 'info')
        }
        tbl.page(totalPages - 1).draw('page');
    } else {
        hopscotch.startTour({
            id: "hopscotch-light",
            steps: [
                {
                    target: "btnAddNewRowPerms",
                    placement: 'left',
                    content: msgPerm.attr('data-msg-least-one'),
                },
            ],
            showPrevButton: false,
            showNextButton: false,
        });
    }
});

class HandlePermissions {
    static updateDataRow(clsThis) {
        $x.fn.updateDataRow(clsThis, function (clsThat, rowIdx, rowData) {
            return {
                ...rowData,
                'view': $(clsThat).find('[name="allow-view"]').prop('checked'),
                'create': $(clsThat).find('[name="allow-create"]').prop('checked'),
                'edit': $(clsThat).find('[name="allow-edit"]').prop('checked'),
                'delete': $(clsThat).find('[name="allow-delete"]').prop('checked'),
                'range': $(clsThat).find('[name="permission-range"]').val(),
            }
        })
    }

    static returnValueAllowRange(opt_perm, range_allow) {
        // check range allow for option permission
        if (opt_perm === 0 || opt_perm === '0') return ['1', '2', '3', '4'];
        if (opt_perm === 1 || opt_perm === '1') return ['4'];
        return [];
    }

    constructor() {
        this.tbl = tbl;
        this.initDataStorage = $('#tblPermissionInitData');
        this.initDataByKeyStorage = $('#tblPermissionInitDataByKey');
        this.enableChange = $.fn.parseBoolean(this.tbl.attr('data-change-enable'), true);
        this.textEnabled = this.enableChange === false ? "readonly disabled" : "";
        this.dataDemo = [
            {
                "id": "",
                "app_data": {
                    "id": "1",
                    "title": "Employee",
                    "code": "employee",
                },
                "plan_data": {
                    "id": "2",
                    "title": "HRM title",
                    "code": "hrm",
                },
                "create": true,
                "view": true,
                "edit": false,
                "delete": true,
                "range": "3",
            }, {
                "id": "1",
                "app_data": {
                    "id": "1",
                    "title": "Account",
                    "code": "account",
                },
                "plan_data": {
                    "id": "2",
                    "title": "Sale title",
                    "code": "sale",
                },
                "create": false,
                "view": true,
                "edit": false,
                "delete": false,
                "range": "4",
            },
        ]
    }

    static loadAppNewRow(planAppData,) {
        let html = ``;
        if (planAppData) {
            planAppData.map((item) => {
                let applicationData = item.application;
                if (applicationData && Array.isArray(applicationData)) {
                    applicationData.map((childItem) => {
                        html += `
                            <option 
                                value="${childItem.id}"
                                data-app-id="${childItem.id}"
                                data-app-title="${childItem.title}"
                                data-app-code="${childItem.code}"
                                data-plan-id="${item.id}"
                                data-plan-title="${item.title}" 
                                data-plan-code="${item.code}"
                                data-opt-perm="${childItem?.['option_permission']}"
                                data-range-allow="${childItem?.['range_allow'].join(',')}"
                            >${item.title} - ${childItem.title}</option>`;
                    })
                }
            })
        }
        let newRowApp = $('#newRowApp');
        newRowApp.html(html).initSelect2();
        newRowApp.trigger('change');
    }

    static convertDictToKeyValue(data) {
        let result = {};
        if (data && typeof data === 'object') {
            data.map((item) => {
                result[item['id']] = item;
            })
        }
        return result
    }

    static checkChangeData(initData, changeData) {
        let isChanged = false;
        let idsCompared = [];
        let ids = Object.keys(initData);
        changeData.map((item) => {
            if (ids.includes(item['id'])) {
                idsCompared.push(item['id']);
                if (item['create'] !== initData[item['id']]['create'] || item['view'] !== initData[item['id']]['view'] || item['edit'] !== initData[item['id']]['edit'] || item['delete'] !== initData[item['id']]['delete'] || item['range'] !== initData[item['id']]['range']) {
                    isChanged = true;
                }
            } else {
                isChanged = true;
            }
        })
        if (isChanged === true) return true;
        return idsCompared.length !== ids.length;
    }

    static getInitData() {
        return JSON.parse(new HandlePermissions().initDataStorage.text());
    }

    static getInitDataByKey(idx = null) {
        let data = JSON.parse(new HandlePermissions().initDataByKeyStorage.text());
        if (idx) return data[idx];
        return data;
    }

    _testCallCheckChange() {
        // constructor is not required when call it
        console.log(HandlePermissions.checkChangeData(HandlePermissions.getInitData(), this.combinesData()['data'],))
    }

    static getClassNameWarningOfRow(row, data, key) {
        if (row['id']) {
            if (HandlePermissions.getInitDataByKey(row['id'])[key] !== row[key]) return 'border-warning';
        } else {
            if (row[key] === true || key === 'range') return 'border-warning';
        }
        return '';
    }

    loadData(planAppData, permData = []) {
        let clsThis = this;
        HandlePermissions.loadAppNewRow(planAppData);
        clsThis.initDataStorage.text(JSON.stringify(HandlePermissions.convertDictToKeyValue(permData)));
        clsThis.initDataByKeyStorage.text(JSON.stringify(permData.reduce((acc, item) => {
            acc[item.id.toString()] = item;
            return acc;
        }, {})))
        clsThis.tbl.DataTableDefault({
            rowIdx: true,
            data: permData,
            columns: [
                {
                    width: "5%",
                    className: "row-data-counter",
                    render: (data, type, row) => {
                        return '';
                    }
                }, {
                    width: "15%",
                    className: "wrap-text",
                    render: (data, type, row) => {
                        let app_data = row['app_data'];
                        let plan_data = row['plan_data'];
                        return `
                            <span class="badge badge-${DocumentControl.classOfPlan(plan_data.code)}">${plan_data.title} - ${app_data.title}</span>
                            <input 
                                type="text" 
                                name="permission-app" 
                                class="hidden" 
                                data-plan-id="${plan_data.id}" 
                                data-app-id="${app_data.id}" 
                                value="${app_data.id}" 
                                ${clsThis.textEnabled}
                            >
                        `;
                    }
                }, {
                    width: "15%",
                    render: (data, type, row) => {
                        let checkAll = "";
                        if (row['create'] === true && row['view'] === true && row['edit'] === true && row['delete'] === true) {
                            checkAll = true;
                        }
                        return `<div class="form-check form-switch">
                            <input 
                                type="checkbox" 
                                class="form-check-input row-e-all row-style-all" 
                                name="all-1" ${checkAll === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            >
                        </div>`;
                    }
                }, {
                    data: "create",
                    width: "15%",
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input 
                                type="checkbox" 
                                class="form-check-input row-e-child row-style-child ${HandlePermissions.getClassNameWarningOfRow(row, data, 'create')}" 
                                name="allow-create"
                                data-init="${row.id ? data : false}" 
                                ${data === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            />
                        </div>`;
                    }
                }, {
                    data: "view",
                    width: "15%",
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input 
                                type="checkbox" 
                                class="form-check-input row-e-child row-style-child ${HandlePermissions.getClassNameWarningOfRow(row, data, 'view')}" 
                                name="allow-view"
                                ${data === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            />
                        </div>`;
                    }
                }, {
                    data: "edit",
                    width: "15%",
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input 
                                type="checkbox" 
                                class="form-check-input row-e-child row-style-child ${HandlePermissions.getClassNameWarningOfRow(row, data, 'edit')}" 
                                name="allow-edit"
                                ${data === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            />
                        </div>`;
                    }
                }, {
                    data: "delete",
                    width: "15%",
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input 
                                type="checkbox" 
                                class="form-check-input row-e-child row-style-child ${HandlePermissions.getClassNameWarningOfRow(row, data, 'delete')}" 
                                name="allow-delete"
                                ${data === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            />
                        </div>`;
                    }
                }, {
                    data: "range",
                    width: "15%",
                    render: (data, type, row) => {
                        let arrValueAllowed = HandlePermissions.returnValueAllowRange(row['app_data']['option_permission'], row['app_data']['range_allow']);
                        if (clsThis.enableChange === true) {
                            let ele = $(`
                                <select 
                                    class="form-control row-perm-range ${HandlePermissions.getClassNameWarningOfRow(row, data, 'range')}"
                                    name="permission-range" 
                                    ${clsThis.textEnabled}
                                >
                                    ${$('#newRowRange').html()}
                                </select>
                            `);
                            ele.find('option').each(function () {
                                $(this).attr('selected', false);
                                if (arrValueAllowed.includes($(this).attr('value'))) {
                                    $(this).attr('disabled', false).removeClass('hidden');
                                } else {
                                    $(this).attr('disabled', true).addClass('hidden');
                                }
                            });
                            ele.find('option[value="' + data + '"]').attr('selected', true);
                            return ele.prop('outerHTML');
                        } else {
                            let textShow = $('#newRowRange').find('option[value="' + data + '"]').text();
                            return `<span class="badge badge-soft-light">${textShow ? textShow : "_"}</span>`
                        }
                    }
                }, {
                    width: "5%",
                    className: "wrap-text",
                    render: (data, type, row) => {
                        if (clsThis.enableChange === true) {
                            return `
                            <div  class="d-flex align-items-center justify-content-end">
                                <button 
                                    class="btnRemoveRow btn btn-icon btn-rounded bg-dark-hover mr-1" 
                                    type="button"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    title="${msgPerm.attr('data-msg-delete')}"
                                >
                                    <span class="icon"><i class="fa-solid fa-xmark"></i></span>
                                </button>
                            </div>
                        `;
                        }
                        return '_';
                    }
                },
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {
                let stateFalse = !data['view'] && !data['edit'] && !data['create'] && !data['delete'];
                if (stateFalse === true) {
                    $(row).attr('data-bs-toggle', 'tooltip').attr('data-bs-placement', 'bottom').attr('title', msgPerm.attr('data-msg-need-drop'));
                    $(row).addClass('bg-sun-light-5');
                } else {
                    $(row).removeClass('bg-sun-light-5');
                    $(row).removeAttr('data-bs-toggle').removeAttr('data-bs-placement').removeAttr('title');
                }
            }
        }).column(-1).visible(clsThis.enableChange);
    }

    combinesData() {
        let arr = this.tbl.DataTable().rows().data().toArray().map((item) => {
            return {
                app_id: item?.['app_data']?.['id'],
                plan_id: item?.['plan_data']?.['id'], ...item
            }
        });
        return {
            'hasChanged': false,
            'data': arr,
        };
    }
}
