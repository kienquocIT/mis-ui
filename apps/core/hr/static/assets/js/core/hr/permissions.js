let msgPerm = $('#idBlockRangeMasterElement');
let tbl = $('#permissions_list');
let dtbEle = null;

let clsGreen = 'bg-green-light-5';
let clsYellow = 'bg-sun-light-5';

let eleNewRowSetup = $('#row_for_setup_new');
let eleNewRowSub = $('#sub_for_setup_new');
let eleNewApp = $('#newRowApp');
let eleNewAll = $('#newRowAllCheck');
let eleNewView = $('#newRowViewCheck');
let eleNewCreate = $('#newRowCreateCheck');
let eleNewEdit = $('#newRowEditCheck');
let eleNewDelete = $('#newRowDeleteCheck');
let eleNewRange = $('#newRowRange');
let eleNewAdd = $('#btnAddNewRowPerms');

let eleHeadingView = $('#headingPermitView');
let eleHeadingCreate = $('#headingPermitCreate');
let eleHeadingEdit = $('#headingPermitEdit');
let eleHeadingDelete = $('#headingPermitDelete');


// ***********************************************************************
// * BASTION
// ***********************************************************************

$('#btnCollapseSubAll').click(function () {
    if ($(this).hasClass('fa-square-caret-left')) {
        $(this).closest('table').find('tbody .btnCollapseSub').each(function () {
            if ($(this).find('.fa-caret-left').length > 0) {
                $(this).trigger('click');
            }
        })
    } else if ($(this).hasClass('fa-square-caret-down')) {
        $(this).closest('table').find('tbody .btnCollapseSub').each(function () {
            if ($(this).find('.fa-caret-down').length > 0) {
                $(this).trigger('click');
            }
        })
    }
    $(this).toggleClass('fa-square-caret-left').toggleClass('fa-square-caret-down');
});

class HandlePermissions {
    static updateDataRow(clsThis) {
        $x.fn.updateDataRow(clsThis, function (clsThat, rowIdx, rowData) {
            let [isView, isCreate, isEdit, isDelete] = [
                $(clsThat).find('[name="allow-view"]').prop('checked'),
                $(clsThat).find('[name="allow-create"]').prop('checked'),
                $(clsThat).find('[name="allow-edit"]').prop('checked'),
                $(clsThat).find('[name="allow-delete"]').prop('checked'),
            ];
            let rangeAllowed = PermitBastionRule._rangeAllowedByRowAdded({
                ...rowData,
                'view': isView,
                'create': isCreate,
                'edit': isEdit,
                'delete': isDelete,
            });
            let rangeCode = $(clsThat).find('[name="permission-range"]').val();
            if (!rangeAllowed.includes(rangeCode)){
                rangeCode = rangeAllowed.length > 0 ? rangeAllowed[0] : null;
            }

            let selectedData = SelectDDControl.get_data_from_idx(eleNewApp, rowData['app_id']);
            let permitMapping = selectedData?.['app']?.['permit_mapping'] || {};
            let clsBastion = new PermitBastionRule(clsThat, false);
            let dependsData = clsBastion._displayDependsOnApps(
                selectedData, permitMapping, isView, isCreate, isEdit, isDelete, true
            );
            let subData = [];
            subData = subData.concat(
                PermitBastionRule._parseSubData(
                    selectedData['app']['id'],
                    dependsData['local']
                )
            );
            Object.keys(dependsData['app']).map(
                (appID) => {
                    subData = subData.concat(
                        PermitBastionRule._parseSubData(
                            appID,
                            dependsData['app'][appID],
                        )
                    )
                }
            )
            let beforeFinalData = PermitBastionRule.convertDataToAdded(
                selectedData['app'], selectedData['plan'],
                rangeCode,
                isView, isCreate, isEdit, isDelete,
                subData, false,
            )
            let finalData = {
                ...rowData,
                ...beforeFinalData,
                'rowIdx': rowIdx,
                'was_changed': true,
            }
            PermitBastionRule.resolveChangeRowOfAdded(clsThat, finalData);
            PermitBastionRule._renderSubForAdded(clsThat, finalData)
            return finalData
        }, true);
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
        let dataAppPlan = [];
        if (planAppData) {
            planAppData.map((item) => {
                let applicationData = item.application;
                if (applicationData && Array.isArray(applicationData)) {
                    applicationData.map(
                        (childItem) => {
                            dataAppPlan.push({
                                id: childItem.id,
                                title: PermitBastionRule.convertTitleApplication(childItem, item),
                                plan: item,
                                app: childItem,
                                permit_mapping: item.permit_mapping,
                            })
                        })
                }
            })
        }
        eleNewApp.initSelect2({
            data: dataAppPlan.sort(
                (a, b) => {
                    return a.title.localeCompare(b.title); // sort by title
                }
            ),
        });
        eleNewApp.trigger('change');
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

    static makeSurePermHasIdx(permData) {
        return permData.map(
            (item) => {
                if (item.id) {
                    return item
                } else {
                    return {
                        ...item,
                        id: $x.cls.util.generateUUID4(),
                    }
                }
            }
        )
    }

    loadData(planAppData, permData = []) {
        HandlePermissions.loadAppNewRow(planAppData);

        let clsThis = this;
        permData = HandlePermissions.makeSurePermHasIdx(permData);
        clsThis.initDataStorage.text(JSON.stringify(HandlePermissions.convertDictToKeyValue(permData)));
        clsThis.initDataByKeyStorage.text(JSON.stringify(permData.reduce((acc, item) => {
            acc[item.id.toString()] = item;
            return acc;
        }, {})))
        dtbEle = clsThis.tbl.DataTableDefault({
            rowIdx: true,
            data: permData,
            autoWidth: false,
            columns: [
                {
                    width: "5%",
                    className: "row-data-counter",
                    data: "rowIdx",
                    render: (data, type, row) => {
                        // if (data !== undefined && Number.isInteger(data)) return data + 1;
                        return '';
                    }
                },
                {
                    width: "20%",
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
                },
                {
                    width: "10%",
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
                },
                {
                    width: "10%",
                    data: "create",
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input 
                                type="checkbox" 
                                class="form-check-input row-e-child row-style-child row-e-child-create ${HandlePermissions.getClassNameWarningOfRow(row, data, 'create')}" 
                                name="allow-create"
                                data-init="${row.id ? data : false}" 
                                ${data === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            />
                        </div>`;
                    }
                },
                {
                    width: "10%",
                    data: "view",
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input 
                                type="checkbox" 
                                class="form-check-input row-e-child row-style-child row-e-child-view ${HandlePermissions.getClassNameWarningOfRow(row, data, 'view')}" 
                                name="allow-view"
                                ${data === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            />
                        </div>`;
                    }
                },
                {
                    width: "10%",
                    data: "edit",
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input 
                                type="checkbox" 
                                class="form-check-input row-e-child row-style-child row-e-child-edit ${HandlePermissions.getClassNameWarningOfRow(row, data, 'edit')}" 
                                name="allow-edit"
                                ${data === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            />
                        </div>`;
                    }
                },
                {
                    width: "10%",
                    data: "delete",
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input 
                                type="checkbox" 
                                class="form-check-input row-e-child row-style-child row-e-child-delete ${HandlePermissions.getClassNameWarningOfRow(row, data, 'delete')}" 
                                name="allow-delete"
                                ${data === true ? "checked" : ""}
                                ${clsThis.textEnabled}
                            />
                        </div>`;
                    }
                },
                {
                    width: "15%",
                    data: "range",
                    render: (data, type, row) => {
                        let wasChanged = row?.['was_changed'] || false;
                        let arrValueAllowed = wasChanged === true ? PermitBastionRule._rangeAllowedByRowAdded(row) : Array.from(new Set(PermitBastionRule._rangeAllowedByRowAdded(row) + [row['range']]));
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
                            let rowRange = row['range'] !== undefined || row['range'] !== null ? row['range'] : null;
                            ele.find('option').each(function () {
                                $(this).attr('selected', false);
                                if (arrValueAllowed.includes($(this).attr('value'))) PermitBastionRule.__enabledEle($(this));
                                else PermitBastionRule.__disabledEle($(this));
                            });

                            if (rowRange === null) ele.val("");
                            else if (arrValueAllowed.includes(rowRange)) ele.find('option[value="' + rowRange + '"]').attr('selected', true);
                            else ele.val("");
                            return ele.prop('outerHTML');
                        } else {
                            let textShow = $('#newRowRange').find('option[value="' + data + '"]').text();
                            return `<span class="badge badge-soft-light">${textShow ? textShow : "_"}</span>`
                        }
                    }
                },
                {
                    width: "10%",
                    className: "wrap-text",
                    render: (data, type, row) => {
                        if (clsThis.enableChange === true) {
                            let destroyHTML = `
                                <button 
                                    class="btnRemoveRow btn btn-icon btn-rounded bg-dark-hover mr-1" 
                                    type="button"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    title="${msgPerm.attr('data-msg-delete')}"
                                >
                                    <span class="icon"><i class="fa-solid fa-xmark"></i></span>
                                </button>
                            `;
                            let toggleHTML = ``;
                            if (
                                (row?.['sub'] || []).length > 0
                            ) {
                                toggleHTML = `
                                    <button 
                                        class="btnCollapseSub btn btn-icon btn-rounded bg-dark-hover mr-1" 
                                        type="button"
                                    >
                                        <span class="icon">
                                            <i class="fa-solid fa-caret-left"></i>
                                        </span>
                                    </button>
                                `;
                            }
                            return `<div class="d-flex align-items-center justify-content-end">${toggleHTML}${destroyHTML}</div>`;
                        }
                        return '';
                    }
                },
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {
                let stateFalse = !data['view'] && !data['edit'] && !data['create'] && !data['delete'];
                if (stateFalse === true) {
                    $(row).attr('data-bs-toggle', 'tooltip').attr('data-bs-placement', 'bottom').attr('title', msgPerm.attr('data-msg-need-drop'));
                    $(row).addClass(clsYellow);
                } else {
                    $(row).removeClass(clsYellow);
                    $(row).removeAttr('data-bs-toggle').removeAttr('data-bs-placement').removeAttr('title');
                }

                PermitBastionRule.resolveChangeRowOfAdded(row, data);
                PermitBastionRule._renderSubForAdded(row, data);
            },
            initComplete: function (settings, json) {

            },
        });
        dtbEle.on('click', '.btnCollapseSub', function () {
            $(this).find('.icon .fa-solid').toggleClass('fa-caret-left').toggleClass('fa-caret-down');
            let tr = $(this).closest('tr');
            let row = dtbEle.row(tr);
            if (row.child.isShown()) {
                row.child.hide();
            } else {
                row.child.show();
            }
        })
        dtbEle.column(-1).visible(clsThis.enableChange);
    }

    combinesData() {
        let arr = this.tbl.DataTable().rows().data().toArray().map((item) => {
            return {
                app_id: item?.['app_data']?.['id'],
                plan_id: item?.['plan_data']?.['id'], ...item
            }
        });
        if (PermitBastionRule.validateDataSubmit(arr) === true) {
            return {
                'hasChanged': false,
                'data': arr,
            };
        }
        throw Error('Data is incorrect!'); // prevent next event
    }
}

class PermitBastionRule {
    static permitCodeFull = ['1', '2', '3', '4'];

    static _validateDataSubmit__oneData(data) {
        let state = true;
        if (!$x.fn.checkUUID4(data['app_id'])) state = false;
        if (typeof data['app_data'] !== 'object') state = false;
        if (!$x.fn.checkUUID4(data['plan_id'])) state = false;
        if (typeof data['plan_data'] !== 'object') state = false;
        if (!PermitBastionRule.permitCodeFull.includes(data['range'])) state = false;
        if (typeof data['view'] !== 'boolean') state = false;
        if (typeof data['create'] !== 'boolean') state = false;
        if (typeof data['edit'] !== 'boolean') state = false;
        if (typeof data['delete'] !== 'boolean') state = false;
        if (
            data['view'] === false &&
            data['create'] === false &&
            data['edit'] === false &&
            data['delete'] === false
        ) {
            state = false;
        }
        return state;
    }

    static validateDataSubmit(dataArr) {
        let errsData = [];
        if (Array.isArray(dataArr)) {
            let state = true;
            dataArr.map(
                (item, idx) => {
                    let _state_child = PermitBastionRule._validateDataSubmit__oneData(item);
                    if (_state_child === false) state = false;
                    (item['sub'] || []).map(
                        (item2) => {
                            if (_state_child === true) {
                                _state_child = PermitBastionRule._validateDataSubmit__oneData(item2);
                                if (_state_child === false) state = false;
                            }
                        }
                    )

                    if (_state_child === false) {
                        errsData.push(
                            idx + 1
                        )
                    }
                }
            );
            if (errsData.length > 0) {
                $.fn.notifyB({
                    description: msgPerm.data('msg-incorrect-line') + ': ' + errsData.join(", ")
                }, 'failure');
            }
            return state;
        }
        return false;
    }

    static convertTitleApplication(app_data, plan_data) {
        return `${plan_data['title'] || ''} - ${app_data['title'] || ''}`;
    }

    static __enabledEle(ele) {
        if (Array.isArray(ele)) {
            ele.map(
                (eleX) => {
                    PermitBastionRule.__enabledEle(eleX);
                }
            )
        } else {
            $(ele).prop('disabled', false).prop('readonly', false).removeClass('hidden');
        }
    }

    static __disabledEle(ele, is_hide = false, propKeyValue = {}) {
        if (Array.isArray(ele)) {
            ele.map(
                (eleX) => {
                    PermitBastionRule.__disabledEle(eleX, is_hide);
                    Object.keys(propKeyValue).map(
                        (key) => {
                            $(this).prop(key, propKeyValue[key]);
                        }
                    )
                }
            )
        } else {
            $(ele).prop('disabled', true).prop('readonly', true);
            if (is_hide === true) {
                $(ele).addClass('hidden');
            }
            Object.keys(propKeyValue).map(
                (key) => {
                    $(this).prop(key, propKeyValue[key]);
                }
            )
        }
    }

    static __renderSubDataHTML(arrData) {
        // [ {"app_id": "", "permit": "", "range": ""} ]

        function getTitleApp(data) {
            let _clsName = '';
            let _txt = '';

            let app_data = data?.['data']?.['app_data'] || null;
            let plan_data = data?.['data']?.['plan_data'] || null;
            if (app_data !== null && typeof app_data === 'object' && plan_data !== null && typeof plan_data === 'object') {
                _txt = PermitBastionRule.convertTitleApplication(app_data, plan_data);
                _clsName = DocumentControl.classOfPlan(plan_data?.['code'] || '');
            } else {
                let _id = data['app_id'];
                _txt = eleNewApp.find(`option[value="${_id}"`).text() || '';
                let _recentData = SelectDDControl.get_data_from_idx(eleNewApp, _id);
                if (_recentData) {
                    _clsName = DocumentControl.classOfPlan(_recentData?.['plan']?.['code'] || '');
                }
            }
            return `<span class="badge badge-${_clsName} mr-1">${_txt}</span>`
        }

        function getPermit(_permit) {
            let _txt = '';
            if (_permit === 'view') {
                _txt = eleHeadingView.text();
            } else if (_permit === 'create') {
                _txt = eleHeadingCreate.text();
            } else if (_permit === 'edit') {
                _txt = eleHeadingEdit.text();
            } else if (_permit === 'delete') {
                _txt = eleHeadingDelete.text();
            }
            return `<span class="badge badge-light mr-1">${_txt}</span>`;
        }

        function getRangeCode(_range_code) {
            let _txt = '';
            if (_range_code === '==') {
                _txt = `[${msgPerm.data('msg-same-range-of-main')}]`;
            } else {
                _txt = eleNewRange.find(`option[value="${_range_code}"]`).text();
            }

            return `<span class="badge badge-light mr-1">${_txt}</span>`;
        }

        let arrTmp = [];
        arrData.map(
            (data) => {
                arrTmp.push(`
                    <li class="list-group-item bg-smoke-light-5">
                        ${getTitleApp(data)}
                        ${getPermit(data['permit'])}
                        ${getRangeCode(data['range'])}
                    </li>
                `);
            }
        )
        return `
            <ol class="list-group list-group-numbered">${arrTmp.join("")}</ol>
        `;
    }

    static _parseSubData(appId, permit) {
        // ID, { "view": ["4"] }

        let resultData = [];
        if (appId) {
            let selectedData = SelectDDControl.get_data_from_idx(eleNewApp, appId);
            let appDataBackup = selectedData['app'];
            let planDataBackup = selectedData['plan'];
            Object.keys(permit).map(
                (_permit_key) => {
                    let [isView, isCreate, isEdit, isDelete] = [false, false, false, false];
                    if (_permit_key === 'view') {
                        isView = true;
                    } else if (_permit_key === 'create') {
                        isCreate = true;
                    } else if (_permit_key === 'edit') {
                        isEdit = true;
                    } else if (_permit_key === 'delete') {
                        isDelete = true;
                    }
                    permit[_permit_key].map(
                        (_range) => {
                            resultData.push(
                                PermitBastionRule.convertDataToAdded(
                                    appDataBackup,
                                    planDataBackup,
                                    _range,
                                    isView, isCreate, isEdit, isDelete,
                                    [],
                                    true,
                                )
                            )
                        }
                    )
                }
            )
        }
        return resultData;
    }

    static _unionRange(rangeView, rangeCreate, rangeEdit, rangeDelete) {
        let result = [];
        let rangeMerge = (
            Array.isArray(rangeView) ? rangeView : []
        ).concat(
            Array.isArray(rangeCreate) ? rangeCreate : []
        ).concat(
            Array.isArray(rangeEdit) ? rangeEdit : []
        ).concat(
            Array.isArray(rangeDelete) ? rangeDelete : []
        );
        Array.from(new Set(rangeMerge)).map((range) => {
            if (
                (
                    (rangeView && rangeView.includes(range)) || !rangeView
                ) && (
                    (rangeCreate && rangeCreate.includes(range)) || !rangeCreate
                ) && (
                    (rangeEdit && rangeEdit.includes(range)) || !rangeEdit
                ) && (
                    (rangeDelete && rangeDelete.includes(range)) || !rangeDelete
                )
            ) {
                result.push(range);
            }
        })
        return result;
    }

    static _rangeAllowedByRowAdded(rowData) {
        let [isView, isCreate, isEdit, isDelete] = [rowData['view'], rowData['create'], rowData['edit'], rowData['delete']];
        let selectedData = SelectDDControl.get_data_from_idx(eleNewApp, rowData['app_id']);
        let permitMapping = selectedData?.['app']?.['permit_mapping'] || {};
        return PermitBastionRule._unionRange(
            isView ? permitMapping?.['view']?.['range'] || [] : null,
            isCreate ? permitMapping?.['create']?.['range'] || [] : null,
            isEdit ? permitMapping?.['edit']?.['range'] || [] : null,
            isDelete ? permitMapping?.['delete']?.['range'] || [] : null,
        );
    }

    static _generateSubForAddedWasChanged(rowEle, rowData, isView, isCreate, isEdit, isDelete) {
        let selectedData = SelectDDControl.get_data_from_idx(eleNewApp, rowData['app_id']);
        let permitMapping = selectedData?.['app']?.['permit_mapping'] || {};
        let clsBastion = new PermitBastionRule(rowEle, false);
        clsBastion._displayDependsOnApps(
            selectedData, permitMapping, isView, isCreate, isEdit, isDelete
        );
    }

    static _renderSubForAdded(row, data, callClickCollapse = false) {
        let rowEle = dtbEle.row(row);
        let dataSub = data?.['sub'] || [];
        if (dataSub && Array.isArray(dataSub) && dataSub.length > 0) {
            let arrTmp = [];
            dataSub.map(
                (item) => {
                    let _appID = item['app_data']['id'];
                    let _range = item['range'];

                    if (item?.['view'] === true) {
                        arrTmp.push({
                            'app_id': _appID,
                            'permit': 'view',
                            'range': _range,
                            'data': item,
                        })
                    }
                    if (item?.['create'] === true) {
                        arrTmp.push({
                            'app_id': _appID,
                            'permit': 'create',
                            'range': _range,
                        })
                    }
                    if (item?.['edit'] === true) {
                        arrTmp.push({
                            'app_id': _appID,
                            'permit': 'edit',
                            'range': _range,
                        })
                    }
                    if (item?.['delete'] === true) {
                        arrTmp.push({
                            'app_id': _appID,
                            'permit': 'delete',
                            'range': _range,
                        })
                    }
                }
            )
            let subHTML = PermitBastionRule.__renderSubDataHTML(arrTmp);
            rowEle.child(`${subHTML}`, "wrap-text bg-gray-light-5");
        } else {
            rowEle.child(``, "wrap-text bg-gray-light-5").hide();
        }

        if (callClickCollapse === true) {
            $(row).find('.btnCollapseSub').trigger('click');
        }
    }

    _bgColor(showSuccess = true, showError = true) {
        let stateRange = !!(this.eleRange.val());
        let stateAllow = this.eleIsCreate.prop('checked') || this.eleIsView.prop('checked') || this.eleIsEdit.prop('checked') || this.eleIsDelete.prop('checked');
        if (stateRange === true && stateAllow === true) {
            if (showSuccess === true) this.rowEle.addClass(clsGreen).removeClass(clsYellow);
        } else {
            if (showError === true) this.rowEle.removeClass(clsGreen).addClass(clsYellow);
        }
    }

    _applyAllowRange(rangeAllowed) {
        this.eleRange.val('');
        this.eleRange.find('option').each(function () {
            if (rangeAllowed.includes($(this).val())) {
                PermitBastionRule.__enabledEle($(this));
            } else {
                PermitBastionRule.__disabledEle($(this), true);
            }
        });
    }

    _displayDependsOnApps(selectedData, permitMapping, isView, isCreate, isEdit, isDelete, returnData = false) {
        let clsThis = this;

        function __parseLocalDepends(result, config) {
            // {view: 4}
            if (config && typeof config === 'object' && Object.keys(config).length > 0) {
                Object.keys(config).map(
                    (key) => {
                        if (result.hasOwnProperty(key)) result[key].push(config[key]);
                        else result[key] = [config[key]];
                        result[key] = Array.from(new Set(result[key]));
                    }
                )
            }
        }

        function __parseAppDepends(result, config) {
            // { "50348927-2c4f-4023-b638-445469c66953": { "view": "4" } }
            if (config && typeof config === 'object' && Object.keys(config).length > 0) {
                Object.keys(config).map(
                    (key) => {
                        let appAdded = result?.[key] || {};
                        __parseLocalDepends(appAdded, config[key]);
                        result[key] = appAdded;
                    }
                )
            }
        }

        function __displayDependsOn(selectedData, dataLocal, dataApp) {
            // dataLocal : { "view": ["4"] }
            // dataApp : {"50348927-2c4f-4023-b638-445469c66953":{"view":["4"]}}

            function summaryData() {
                let appId = (selectedData?.['app'] || {})?.['id'] || null;
                if (appId && typeof dataLocal === 'object' && Object.keys(dataLocal).length > 0) {
                    let mainDataOfApp = dataApp?.[appId] || {};
                    if (mainDataOfApp && typeof mainDataOfApp === 'object' && Object.keys(mainDataOfApp).length > 0) {
                        __parseLocalDepends(mainDataOfApp, dataLocal);
                    } else {
                        mainDataOfApp = dataLocal
                    }
                    dataApp[appId] = mainDataOfApp;
                }
                return dataApp;
            }

            function renderHTML(data) {
                if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                    let arrTmp = [];
                    let backupData = [];
                    Object.keys(data).map(
                        (_appId) => {
                            backupData = backupData.concat(
                                PermitBastionRule._parseSubData(_appId, data[_appId])
                            );
                            Object.keys(data[_appId]).map(
                                (_permit) => {
                                    let _range = data[_appId][_permit] || [];
                                    if (_range && Array.isArray(_range) && _range.length > 0) {
                                        _range.map(
                                            (_range_code) => {
                                                arrTmp.push({
                                                    'app_id': _appId,
                                                    'permit': _permit,
                                                    'range': _range_code,
                                                });
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    )
                    let subHTML = PermitBastionRule.__renderSubDataHTML(arrTmp);
                    let backupDataHTML = `<script type="application/json" class="row-new-data-sub hidden">${JSON.stringify(backupData)}</script>`;
                    return `${subHTML}${backupDataHTML}`;
                }
                return '';
            }

            // case eleRowSub has value => row New
            // else => Row Added
            if (clsThis.eleRowSub === null) {
                let bigResult = summaryData();
                let htmlRender = renderHTML(bigResult);
                let rowEleTmp = dtbEle.row(clsThis.rowEle);
                if (htmlRender) {
                    rowEleTmp.child(htmlRender).show();
                } else {
                    rowEleTmp.child(``).hide();
                }
            } else {
                let rowELe = clsThis.eleRowSub.closest('tr');
                if (Object.keys(dataLocal).length > 0 || Object.keys(dataApp).length > 0) {
                    let bigResult = summaryData();
                    rowELe.fadeIn({
                        'duration': 'fast',
                        'start': function () {
                            let htmlRender = renderHTML(bigResult);
                            clsThis.eleRowSub.html(htmlRender);
                            $(this).removeClass("hidden")
                        },
                    });
                } else {
                    rowELe.fadeOut({
                        'duration': 'fast',
                        'done': function () {
                            $(this).addClass('hidden');
                            clsThis.eleRowSub.html('');
                        },
                    });
                }
            }
        }

        let summaryDependsLocal = {};
        let summaryDependsApp = {};
        if (isView === true) {
            let viewDepend = permitMapping?.['view'] || {};
            __parseLocalDepends(summaryDependsLocal, viewDepend?.['local_depends_on'] || {});
            __parseAppDepends(summaryDependsApp, viewDepend?.['app_depends_on'] || {});
        }

        if (isCreate === true) {
            let viewDepend = permitMapping?.['create'] || {};
            __parseLocalDepends(summaryDependsLocal, viewDepend?.['local_depends_on'] || {});
            __parseAppDepends(summaryDependsApp, viewDepend?.['app_depends_on'] || {});
        }

        if (isEdit === true) {
            let viewDepend = permitMapping?.['edit'] || {};
            __parseLocalDepends(summaryDependsLocal, viewDepend?.['local_depends_on'] || {});
            __parseAppDepends(summaryDependsApp, viewDepend?.['app_depends_on'] || {});
        }

        if (isDelete === true) {
            let viewDepend = permitMapping?.['delete'] || {};
            __parseLocalDepends(summaryDependsLocal, viewDepend?.['local_depends_on'] || {});
            __parseAppDepends(summaryDependsApp, viewDepend?.['app_depends_on'] || {});
        }

        if (returnData) {
            return {
                'local': summaryDependsLocal,
                'app': summaryDependsApp
            };
        }
        __displayDependsOn(selectedData, summaryDependsLocal, summaryDependsApp);
    }

    constructor(thisEle, isNewRow = true) {
        this.ele = $(thisEle);
        this.rowEle = this.ele.closest('tr');
        this.eleRange = this.rowEle.find('select[name="permission-range"]');

        this.eleIsCreate = this.rowEle.find('input[name="row-e-child-create"]');
        this.eleIsView = this.rowEle.find('input[name="row-e-child-view"]');
        this.eleIsEdit = this.rowEle.find('input[name="row-e-child-edit"]');
        this.eleIsDelete = this.rowEle.find('input[name="row-e-child-delete"]');

        this.eleRowSub = isNewRow === true ? eleNewRowSub : null;
    }

    static resolveChangeRowOfAdded(row, data) {
        let selectedData = SelectDDControl.get_data_from_idx(eleNewApp, data['app_data']['id']);
        let permitMapping = selectedData?.['app']?.['permit_mapping'] || {};
        let permitConfig = Object.keys(permitMapping);

        if (permitConfig.includes('view')) {
            PermitBastionRule.__enabledEle($(row).find('[name="allow-view"]'));
        } else {
            PermitBastionRule.__disabledEle($(row).find('[name="allow-view"]'), false);
        }

        if (permitConfig.includes('create')) {
            PermitBastionRule.__enabledEle($(row).find('[name="allow-create"]'));
        } else {
            PermitBastionRule.__disabledEle($(row).find('[name="allow-create"]'), false);
        }
        if (permitConfig.includes('edit')) {
            PermitBastionRule.__enabledEle($(row).find('[name="allow-edit"]'));
        } else {
            PermitBastionRule.__disabledEle($(row).find('[name="allow-edit"]'), false);
        }
        if (permitConfig.includes('delete')) {
            PermitBastionRule.__enabledEle($(row).find('[name="allow-delete"]'));
        } else {
            PermitBastionRule.__disabledEle($(row).find('[name="allow-delete"]'), false);
        }

        if (
            permitConfig.includes('view') &&
            permitConfig.includes('create') &&
            permitConfig.includes('edit') &&
            permitConfig.includes('delete')
        ) {
            PermitBastionRule.__enabledEle($(row).find('[name="all-1"]'));
        } else {
            PermitBastionRule.__disabledEle($(row).find('[name="all-1"]'), false);
        }

        new PermitBastionRule(eleNewRowSetup)._bgColor(true, true);

    }

    static convertDataToAdded(
        appDataBackup, planDataBackup, range,
        isView = false, isCreate = false, isEdit = false, isDelete = false,
        sub = [], for_sub = false, _id = null,
    ) {
        if (!(
            typeof appDataBackup === 'object' &&
            appDataBackup.hasOwnProperty('id') &&
            typeof planDataBackup === 'object' &&
            planDataBackup.hasOwnProperty('id')
        )) {
            $.fn.notifyB({
                description: msgPerm.data('msg-check-app-depend-on-info')
            }, 'failure');
            throw Error('App | Plan data empty.');
        }
        let app_data = {
            "id": appDataBackup['id'],
            "title": appDataBackup['title'],
            "code": appDataBackup['code'],
        };
        let plan_data = {
            "id": planDataBackup['id'],
            "title": planDataBackup['title'],
            "code": planDataBackup['code'],
        };

        if (!for_sub) {
            app_data = {
                ...app_data,
                "option_permission": appDataBackup['option_permission'],
                "option_allowed": appDataBackup['option_allowed'],
                "range_allow": appDataBackup['range_allow'],
                "permit_mapping": appDataBackup['permit_mapping'],
            }
        }

        let sub_result = [];
        sub.map(
            (item) => {
                let _sub_data = {...item};
                if (_sub_data['range'] === '==') {
                    _sub_data['range'] = range;
                }
                sub_result.push(_sub_data);
            }
        )
        return {
            "id": _id,
            "app_data": app_data,
            "app_id": app_data['id'],
            "plan_data": plan_data,
            "plan_id": plan_data['id'],
            "create": isCreate,
            "view": isView,
            "edit": isEdit,
            "delete": isDelete,
            "range": range,
            "sub": sub_result,
        }
    }
}

// ***********************************************************************
// * -- BASTION
// ***********************************************************************


// ***********************************************************************
// * ADDED DATA
// ***********************************************************************

tbl.on('click', '.row-e-all', function () {
    let stateCheck = $(this).prop('checked');
    $(this).closest('tr').find('.row-e-child').prop('checked', stateCheck);
    $(this).trigger('change');
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

// ***********************************************************************
// * -- ADDED DATA
// ***********************************************************************


// ***********************************************************************
// * FOOTER
// ***********************************************************************

tbl.on('change', '#newRowApp', function () {
    HandleFooterNew.resolveChangeApp(this);
    HandleFooterNew.resetNew();
});

tbl.on('click', '.row-e-all-foot', function () {
    let state = $(this).prop('checked');
    eleNewView.prop('disabled') === false || eleNewView.prop('readonly') === false ? eleNewView.prop('checked', state) : null;
    eleNewCreate.prop('disabled') === false || eleNewCreate.prop('readonly') === false ? eleNewCreate.prop('checked', state) : null;
    eleNewEdit.prop('disabled') === false || eleNewEdit.prop('readonly') === false ? eleNewEdit.prop('checked', state) : null;
    eleNewDelete.prop('disabled') === false || eleNewDelete.prop('readonly') === false ? eleNewDelete.prop('checked', state) : null;
    eleNewRowSetup.find('.row-e-child-foot').trigger('change');
});

tbl.on('change', '.row-e-child-foot', function () {
    HandleFooterNew.resoleChangePermit();
    if (
        eleNewView.prop('checked') &&
        eleNewCreate.prop('checked') &&
        eleNewEdit.prop('checked') &&
        eleNewDelete.prop('checked')
    ) eleNewAll.prop('checked', true);
    else eleNewAll.prop('checked', false);
});

tbl.on('change', '#newRowRange', function () {
    HandleFooterNew.resolveChangeRange();
});

tbl.on('click', '#btnAddNewRowPerms', function () {
    let stateRange = !!(eleNewRange.val());
    let stateAllow = eleNewCreate.prop('checked') || eleNewView.prop('checked') || eleNewEdit.prop('checked') || eleNewDelete.prop('checked');

    let msg = '';
    if (stateRange && stateAllow) {
        let dataPlanApp = SelectDDControl.get_data_from_idx(eleNewApp);
        let appDataBackup = dataPlanApp['app'];
        let planDataBackup = dataPlanApp['plan'];
        let tbl = $('#permissions_list').DataTable();
        tbl.row.add(
            PermitBastionRule.convertDataToAdded(
                appDataBackup,
                planDataBackup,
                eleNewRange.val(),
                eleNewView.prop('checked'),
                eleNewCreate.prop('checked'),
                eleNewEdit.prop('checked'),
                eleNewDelete.prop('checked'),
                $x.fn.parseJson(
                    eleNewRowSub.find('.row-new-data-sub').text(),
                    [],
                ),
            )
        ).draw(false);

        // switch to end page.
        let totalPages = tbl.page.info().pages;
        let currentPages = tbl.page.info().page;
        if (totalPages - 1 > currentPages) {
            $.fn.notifyB({
                'description': globeGoToEndPage,
            }, 'info')
        }
        tbl.page(totalPages - 1).draw('page');
        return true;
    } else if (!stateRange && !stateAllow) {
        msg = [msgPerm.data('msg-select-range'), msgPerm.data('msg-least-one')];
    } else if (!stateRange) {
        msg = msgPerm.data('msg-select-range');
    } else if (!stateAllow) {
        msg = msgPerm.data('msg-least-one');
    }

    $.fn.notifyB({
        description: msg,
    }, 'failure');
});

class HandleFooterNew {
    static resolveChangeApp() {
        let selectedData = SelectDDControl.get_data_from_idx(eleNewApp);
        let permitMapping = selectedData?.['app']?.['permit_mapping'] || {};
        let permitConfig = Object.keys(permitMapping);

        if (permitConfig.length === 0) {
            PermitBastionRule.__disabledEle([eleNewAll, eleNewRange, eleNewAdd], false);
        } else {
            PermitBastionRule.__enabledEle([eleNewAll, eleNewRange, eleNewAdd])
            new PermitBastionRule(eleNewApp)._applyAllowRange([]); // disabled all option before has one allow
        }

        if (permitConfig.includes('view')) {
            PermitBastionRule.__enabledEle(eleNewView);
        } else {
            PermitBastionRule.__disabledEle(eleNewView, false);
        }
        if (permitConfig.includes('create')) {
            PermitBastionRule.__enabledEle(eleNewCreate);
        } else {
            PermitBastionRule.__disabledEle(eleNewCreate, false);
        }
        if (permitConfig.includes('edit')) {
            PermitBastionRule.__enabledEle(eleNewEdit);
        } else {
            PermitBastionRule.__disabledEle(eleNewEdit, false);
        }
        if (permitConfig.includes('delete')) {
            PermitBastionRule.__enabledEle(eleNewDelete);
        } else {
            PermitBastionRule.__disabledEle(eleNewDelete, false);
        }

        if (
            permitConfig.includes('view') &&
            permitConfig.includes('create') &&
            permitConfig.includes('edit') &&
            permitConfig.includes('delete')
        ) {
            PermitBastionRule.__enabledEle(eleNewAll);
        } else {
            PermitBastionRule.__disabledEle(eleNewAll, false);
        }

        new PermitBastionRule(eleNewRowSetup)._bgColor(true, true);
    }

    static resoleChangePermit() {
        let selectedData = SelectDDControl.get_data_from_idx(eleNewApp);
        let permitMapping = selectedData?.['app']?.['permit_mapping'] || {};
        let [isView, isCreate, isEdit, isDelete] = [
            eleNewView.prop('checked') === true,
            eleNewCreate.prop('checked') === true,
            eleNewEdit.prop('checked') === true,
            eleNewDelete.prop('checked') === true,
        ]
        let rangeUnion = PermitBastionRule._unionRange(
            isView ? permitMapping?.['view']?.['range'] || [] : null,
            isCreate ? permitMapping?.['create']?.['range'] || [] : null,
            isEdit ? permitMapping?.['edit']?.['range'] || [] : null,
            isDelete ? permitMapping?.['delete']?.['range'] || [] : null,
        );

        //
        let clsBastion = new PermitBastionRule(eleNewApp);
        clsBastion._applyAllowRange(rangeUnion);
        clsBastion._bgColor(true, true);
        clsBastion._displayDependsOnApps(
            selectedData, permitMapping, isView, isCreate, isEdit, isDelete
        );
    }

    static resolveChangeRange() {
        new PermitBastionRule(eleNewRowSetup)._bgColor(true, true);
    }

    static resetNew() {
        eleNewRange.val("").find('option').each(function () {
            PermitBastionRule.__disabledEle($(this), true);
        });

        eleNewAll.prop('checked', false);
        eleNewCreate.prop('checked', false);
        eleNewView.prop('checked', false);
        eleNewEdit.prop('checked', false);
        eleNewDelete.prop('checked', false);
        eleNewRowSetup.find('.row-e-child-foot').trigger('change');
    }
}

// ***********************************************************************
// * -- FOOTER
// ***********************************************************************
