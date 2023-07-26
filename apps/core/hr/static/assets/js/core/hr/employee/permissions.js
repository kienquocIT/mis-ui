let msgPerm = $('#idBlockRangeMasterElement');
let tbl = $('#permissions_list');

class HandleWhenAllFalse {
    constructor(rowEle) {
        this.rowEle = $(rowEle);
    }

    valid() {
        let stateCheck = true;
        this.rowEle.find('.row-e-child').each(function () {
            if ($(this).prop('checked') === true) {
                // one true -> don't raise
                stateCheck = false;
            }
        })
        return stateCheck;
    }

    active() {
        let stateFalse = this.valid();
        if (stateFalse === true) {
            this.rowEle.attr('data-bs-toggle', 'tooltip').attr('data-bs-placement', 'bottom').attr('title', msgPerm.attr('data-msg-need-drop'));
            this.rowEle.addClass('bg-sun-light-5');
        } else {
            this.rowEle.removeClass('bg-sun-light-5');
            this.rowEle.removeAttr('data-bs-toggle').removeAttr('data-bs-placement').removeAttr('title');
        }
    }
}

class HandlePermissions {
    static returnValueAllowRange(opt_perm) {
        // check range allow for option permission
        if (opt_perm === 0 || opt_perm === '0') return ['1', '2', '3', '4'];
        if (opt_perm === 1 || opt_perm === '1') return ['4'];
        return [];
    }

    constructor() {
        this.tbl = tbl;
        this.initDataStorage = $('#tblPermissionInitData');
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

    getInitData() {
        return JSON.parse(this.initDataStorage.text());
    }

    _testCallCheckChange() {
        // constructor is not required when call it
        console.log(HandlePermissions.checkChangeData(this.getInitData(), this.combinesData()['data'],))
    }

    loadData(planAppData, permData = []) {
        let clsThis = this;
        HandlePermissions.loadAppNewRow(planAppData);
        clsThis.initDataStorage.text(JSON.stringify(HandlePermissions.convertDictToKeyValue(permData)));
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
                                data-init="${checkAll}"
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
                                class="form-check-input row-e-child row-style-child" 
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
                                class="form-check-input row-e-child row-style-child" 
                                name="allow-view"
                                data-init="${row.id ? data : false}" 
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
                                class="form-check-input row-e-child row-style-child" 
                                name="allow-edit"
                                data-init="${row.id ? data : false}" 
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
                                class="form-check-input row-e-child row-style-child" 
                                name="allow-delete"
                                data-init="${row.id ? data : false}" 
                                ${data === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            />
                        </div>`;
                    }
                }, {
                    data: "range",
                    width: "15%",
                    render: (data, type, row) => {
                        let arrValueAllowed = HandlePermissions.returnValueAllowRange(row['app_data']['option_permission']);
                        if (clsThis.enableChange === true) {
                            let ele = $(`
                                <select class="form-control row-perm-range" data-init="${data}" name="permission-range" ${clsThis.textEnabled}>
                                    ${$('#newRowRange').html()}
                                </select>
                            `);
                            ele.find('option').each(function () {
                                $(this).attr('selected', false);
                                if (arrValueAllowed.includes($(this).attr('value'))) {
                                    $(this).attr('disabled', false);
                                } else {
                                    $(this).attr('disabled', true);
                                }
                            });
                            ele.val(data);
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
            drawCallback: function () {
                $(clsThis.tbl).find('input[type=checkbox].row-style-child').trigger('change');
            },
        }).column(-1).visible(clsThis.enableChange);
    }

    combinesData() {
        let hasChange = false;
        let arr = [];
        this.tbl.find('tbody tr').each(function () {
            let countNum = parseInt($(this).find('td.row-data-counter').text());
            if (countNum) {
                let rowData = DTBControl.getRowData($(this));
                let realId = rowData.hasOwnProperty('id') ? rowData['id'] : null;
                let inputPlanAppEle = $(this).find('td input[name="permission-app"]');
                let inputAppId = inputPlanAppEle.attr('data-app-id');
                let inputPlanId = inputPlanAppEle.attr('data-plan-id');

                let allowCreateEle = $(this).find('td input[name="allow-create"]');
                let allowCreate = allowCreateEle.prop('checked');

                let allowViewEle = $(this).find('td input[name="allow-view"]');
                let allowView = allowViewEle.prop('checked');

                let allowEditEle = $(this).find('td input[name="allow-edit"]');
                let allowEdit = allowEditEle.prop('checked');

                let allowDeleteEle = $(this).find('td input[name="allow-delete"]');
                let allowDelete = allowDeleteEle.prop('checked');

                let inputRangeEle = $(this).find('td select[name="permission-range"]');
                let inputRange = inputRangeEle.val();

                if (hasChange === false) {
                    if ((allowCreate !== $.fn.parseBoolean($(allowCreateEle).attr('data-init'), true)) || (allowView !== $.fn.parseBoolean($(allowViewEle).attr('data-init'), true)) || (allowEdit !== $.fn.parseBoolean($(allowEditEle).attr('data-init'), true)) || (allowDelete !== $.fn.parseBoolean($(allowDeleteEle).attr('data-init'), true)) || ($(inputRangeEle).attr('data-init') !== inputRange)) {
                        hasChange = true;
                    }
                }

                arr.push({
                    'id': realId ? realId : null,
                    'counter': countNum,
                    'app_id': inputAppId,
                    'plan_id': inputPlanId,
                    'create': allowCreate,
                    'view': allowView,
                    'edit': allowEdit,
                    'delete': allowDelete,
                    'range': inputRange,
                });
            }
        });
        return {
            'hasChanged': hasChange,
            'data': arr,
        };
    }
}

tbl.on('click', '.row-e-all', function () {
    let stateCheck = $(this).prop('checked');
    $(this).closest('tr').find('.row-e-child').prop('checked', stateCheck).trigger('change');
});

tbl.on('click', '.row-e-child', function () {
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
    let stateCheck = $(this).prop('checked');

    if (stateCheck !== $.fn.parseBoolean($(this).attr('data-init'), true)) {
        $(this).addClass('border-warning');
    } else $(this).removeClass('border-warning');

    new HandleWhenAllFalse($(this).closest('tr')).active();
})

tbl.on('change', '.row-style-child', function () {
    if ($(this).prop('checked') !== $.fn.parseBoolean($(this).attr('data-init'), true)) {
        $(this).addClass('border-warning');
    } else {
        $(this).removeClass('border-warning');
    }
    new HandleWhenAllFalse($(this).closest('tr')).active();
})

tbl.on('change', '.row-perm-range', function () {
    if ($(this).attr('data-init') !== $(this).val()) {
        $(this).addClass('border-warning');
    } else {
        $(this).removeClass('border-warning');
    }

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
    selectRangeEle.find(":selected").prop('selected', false);
    let optPerm = $(this).find(":selected").attr('data-opt-perm');
    if (optPerm === '0') {
        $(selectRangeEle).find('option').each(function () {
            $(this).prop('disabled', false);
        });
    } else if (optPerm === '1') {
        $(selectRangeEle).find('option').each(function () {
            if ($(this).attr('value') === '4') {
                $(this).prop('disabled', false);
            } else {
                $(this).prop('disabled', true);
            }
        });
    }
    selectRangeEle.val(selectRangeEle.find('option:not([disabled]):first').attr('value')).trigger('change');
})

$('#btnAddNewRowPerms').click(function () {
    let newRowApp = $('#newRowApp');
    let newRowAllCheck = $('#newRowAllCheck');
    let newRowCreateCheck = $('#newRowCreateCheck');
    let newRowViewCheck = $('#newRowViewCheck');
    let newRowEditCheck = $('#newRowEditCheck');
    let newRowDeleteCheck = $('#newRowDeleteCheck');
    let newRowRange = $('#newRowRange');
    if (newRowCreateCheck.prop('checked') || newRowViewCheck.prop('checked') || newRowEditCheck.prop('checked') || newRowDeleteCheck.prop('checked')) {
        let appSelected = newRowApp.find(":selected");
        $('#permissions_list').DataTable().row.add({
            "id": null,
            "app_data": {
                "id": appSelected.attr('data-app-id'),
                "title": appSelected.attr('data-app-title'),
                "code": appSelected.attr('data-app-code'),
                "option_permission": appSelected.attr('data-opt-perm'),
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
            timeout: 1,
        });
    }
});
