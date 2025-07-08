class popup_recipient {
    static $tableGroup = $('#table_group');
    static $tableEmployee = $('#table_employee');
    static $storeGroupEle = $('#group-checked');
    static $storeEmployeeEle = $('#employee-checked');
    static $btnAddEmployee = $('#add_employee');
    static $employeeShowEle = $('#employee_show');

    static $radioReview = $('#radio_review');
    static $radioView = $('#radio_view');
    static $radioEdit = $('#radio_edit');
    static $radioCustom = $('#radio_custom');
    static $checkboxesToCheck = [
        $('#checkbox_review'),
        $('#checkbox_download'),
        $('#checkbox_edit_f_attr'),
        $('#checkbox_share'),
        $('#checkbox_upload_ver'),
        $('#checkbox_duplicate'),
        $('#checkbox_edit_f')
    ];

    static loadStoreCheckGroup(ele) {
        let row = ele.closest('tr');
        let rowIndex = popup_recipient.$tableGroup.DataTable().row(row).index();
        let $row = popup_recipient.$tableGroup.DataTable().row(rowIndex);
        let dataRow = $row.data();

        if (dataRow) {
            if (popup_recipient.$storeGroupEle.val()) {
                let storeID = JSON.parse(popup_recipient.$storeGroupEle.val());
                if (typeof storeID === 'object') {
                    if (ele.checked) {
                        if (!storeID?.[dataRow?.['id']]) {
                            storeID[dataRow?.['id']] = {
                                "type": "current",
                                "data": dataRow,
                            };
                        }
                    }
                    else {
                        if (storeID?.[dataRow?.['id']]) {
                            delete storeID?.[dataRow?.['id']];
                        }
                    }
                    popup_recipient.$storeGroupEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                popup_recipient.$storeGroupEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static loadStoreCheckEmployee(ele) {
        let row = ele.closest('tr');
        let rowIndex = popup_recipient.$tableEmployee.DataTable().row(row).index();
        let $row = popup_recipient.$tableEmployee.DataTable().row(rowIndex);
        let dataRow = $row.data();

        if (dataRow) {
            if (popup_recipient.$storeEmployeeEle.val()) {
                let storeID = JSON.parse(popup_recipient.$storeEmployeeEle.val());
                if (typeof storeID === 'object') {
                    if (ele.checked === true) {
                        if (!storeID?.[dataRow?.['id']]) {
                            storeID[dataRow?.['id']] = {
                                "type": "current",
                                "data": dataRow,
                            };
                        }
                    }
                    if (ele.checked === false) {
                        if (storeID?.[dataRow?.['id']]) {
                            delete storeID?.[dataRow?.['id']];
                        }
                    }
                    popup_recipient.$storeEmployeeEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                popup_recipient.$storeEmployeeEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static load_group_list() {
        popup_recipient.$tableGroup.DataTable().clear().destroy()
        popup_recipient.$tableGroup.DataTableDefault({
            useDataServer: true,
            info: false,
            pageLength: 5,
            scrollY: '250px',
            scrollCollapse: true,
            ajax: {
                url: pageElements.$urlEle.attr('data-md-group'),
                type: 'get',
                data: function (d) {
                    d.pageSize = -1
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('group_dd_list')) {
                        return resp.data['group_dd_list'] ? resp.data['group_dd_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    data: 'id',
                    render: (row, index, data) => {
                        let checked = '';
                        if (popup_recipient.$storeGroupEle.val()) {
                            let storeID = JSON.parse(popup_recipient.$storeGroupEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[data?.['id']]) {
                                    checked = 'checked';
                                }
                            }
                        }
                        return `<div class="form-check form-check-lg">
                                    <input type="checkbox" id="checkbox_${data.code}" class="form-check-input row-checkbox" value="${data.id}" ${checked}>
                                    <label title="${data.title}" for="checkbox_${data.code}" class="form-check-label">
                                    ${data.title}</label>
                                </div>`;
                    },
                },
            ],
            rowCallback: function (row, data) {
                $(row).find('.row-checkbox').on('click', function () {
                    popup_recipient.loadStoreCheckGroup(this);
                    popup_recipient.collect_group_load_employee();
                })
            },
        })
    }

    static collect_group_load_employee() {
        let listGroupID = [];
        if (popup_recipient.$storeGroupEle.val()) {
            let storeData = JSON.parse(popup_recipient.$storeGroupEle.val());
            for (let key in storeData) {
                listGroupID.push(key);
            }
        }
        if ($.fn.dataTable.isDataTable(popup_recipient.$tableEmployee)) {
            popup_recipient.$tableEmployee.DataTable().destroy();
        }
        popup_recipient.load_employee_list({'group_id__in': listGroupID.join(',')});
        return true;
    }

    static load_employee_list(dataParams) {
        popup_recipient.$tableEmployee.DataTable().clear().destroy()
        popup_recipient.$tableEmployee.DataTableDefault({
            useDataServer: true,
            pageLength: 5,
            info: false,
            scrollY: '250px',
            scrollX: '1023px',
            scrollCollapse: true,
            ajax: {
                url: pageElements.$urlEle.attr('data-md-employee'),
                type: 'get',
                data: dataParams,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('employee_list')) {
                        return resp.data['employee_list'] ? resp.data['employee_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    data: 'id',
                    render: (row, index, data) => {
                        let checked = '';
                        if (popup_recipient.$storeEmployeeEle.val()) {
                            let storeID = JSON.parse(popup_recipient.$storeEmployeeEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[data?.['id']]) {
                                    checked = 'checked';
                                }
                            }
                        }
                        return `<div class="form-check form-check-lg">
                                    <input type="checkbox" id="checkbox_${data.code}" class="form-check-input row-checkbox" value="${data.id}" ${checked}>
                                    <label title="${data.full_name}" for="checkbox_${data.code}" class="form-check-label">
                                    ${data.full_name}</label>
                                </div>`;
                    },
                },
                {
                    data: "code",
                    render: (row) => {
                        return row
                    }
                },
                {
                    data: 'group',
                    render: (row) => {
                        return row?.title || '--'
                    }
                }
            ],
            rowCallback: function (row, data) {
                $(row).find('.row-checkbox').on('click', function () {
                    popup_recipient.loadStoreCheckEmployee(this);
                    let listEmployeeID = [];
                    if (popup_recipient.$storeEmployeeEle.val()) {
                        let storeData = JSON.parse(popup_recipient.$storeEmployeeEle.val());
                        for (let key in storeData) {
                            listEmployeeID.push(key);
                        }
                    }
                })
            }
        })
    }

    static load_employee_show() {
        if (popup_recipient.$storeEmployeeEle.val()) {
            popup_recipient.$employeeShowEle.empty();
            let storeData = JSON.parse(popup_recipient.$storeEmployeeEle.val());
            let bodyShow = ``;
            for (let key in storeData) {
                let dataKey = storeData[key];
                let data = dataKey?.['data'];
                bodyShow += `<div class="chip chip-primary chip-dismissable mr-2">
                                <span><span class="chip-text">${data?.['full_name']}</span>
                                <button type="button" class="btn-close" data-id="${data?.['id']}"></button>
                                </span>
                            </div>`
            }
            popup_recipient.$employeeShowEle.append(bodyShow);
        }
        return true;
    }

    static init_date_exp() {
        $('#input_expired').flatpickr({
            allowInput: true,
            altInput: true,
            altFormat: 'd/m/Y',
            defaultDate: null,
            locale: globeLanguage === 'vi' ? 'vn' : 'default',
            shorthandCurrentMonth: true,
        }).set('clickOpens', false)

        $('#enabled_switch').on('change', function () {
            const $inp = $('#input_expired')
            if (!$(this).prop('checked')) {
                $inp[0]._flatpickr.clear()
                $inp[0]._flatpickr.set('clickOpens', false)
                $inp.prop('readonly', true)
            } else {
                $inp[0]._flatpickr.set('clickOpens', true)
                $inp.prop('readonly', false)
            }
        })
    }

    static run_popup() {
        popup_recipient.load_group_list()
        popup_recipient.load_employee_list()
        popup_recipient.init_date_exp()
    }
}

class recipientLoadEventHandler {
    static uncheckAllRightCheckboxes() {
        $('.right-access input[type="checkbox"]').prop('checked', false);
    }

    static InitPageEvent() {
        popup_recipient.$btnAddEmployee.on('click', function () {
            popup_recipient.load_employee_show();
        });

        popup_recipient.$employeeShowEle.on('click', '.btn-close', function () {
            if ($(this).attr('data-id') && popup_recipient.$storeEmployeeEle.val()) {
                let removeID = $(this).attr('data-id');
                let storeData = JSON.parse(popup_recipient.$storeEmployeeEle.val());
                if (storeData?.[removeID]) {
                    delete storeData?.[removeID];
                }
                popup_recipient.$storeEmployeeEle.val(JSON.stringify(storeData));
            }
            popup_recipient.collect_group_load_employee();
            popup_recipient.load_employee_show();
        });

        popup_recipient.$radioReview.on('click', function () {
            recipientLoadEventHandler.uncheckAllRightCheckboxes();
            $('#checkbox_review').prop('checked', true);
        })

        popup_recipient.$radioView.on('click', function () {
            recipientLoadEventHandler.uncheckAllRightCheckboxes();
            const checkboxesToCheck = [
                $('#checkbox_review'),
                $('#checkbox_download')
            ];
            checkboxesToCheck.forEach($checkbox => {
                $checkbox.prop('checked', true);
            })
        })

        popup_recipient.$radioEdit.on('click', function () {
            recipientLoadEventHandler.uncheckAllRightCheckboxes();
            popup_recipient.$checkboxesToCheck.forEach($checkbox => {
                $checkbox.prop('checked', true);
            })
        })

        popup_recipient.$radioCustom.on('click', function () {
            recipientLoadEventHandler.uncheckAllRightCheckboxes();
            popup_recipient.$checkboxesToCheck.forEach($checkbox => {
                $checkbox.prop('checked', true);
            })
        })
    }
}

class submitPopupRecipient {
    constructor() {
        this.$form = $('#recipient_form');
        this.init();
    }

    init() {
        this.$form.on('submit', this.handleSubmit.bind(this));
        this.modalTrigger();
    }

    //  Main submit handler
    handleSubmit(e) {
        e.preventDefault();
        const formData = this.$form.serializeObject();
        const rowIndex = $('#form_id').val() ? parseInt($('#form_id').val()) : '';
        const filePermissions = this.getSelectedPermissions();

        // get list employee
        let employeeListRaw = popup_recipient.$storeEmployeeEle.val();
        let employeeList = {};
        if (typeof employeeListRaw === 'object' && employeeListRaw !== null) {
            employeeList = employeeListRaw;
        }
        else if (typeof employeeListRaw === 'string') {
            try {
                employeeList = JSON.parse(employeeListRaw);
            }
            catch (err) {
                employeeList = {};
            }
        }

        // get list group
        let groupListRaw = popup_recipient.$storeGroupEle.val();
        let groupList = {};
        if (typeof groupListRaw === 'object' && groupListRaw !== null) {
            groupList = groupListRaw;
        }
        else if (typeof groupListRaw === 'string') {
            try {
                groupList = JSON.parse(groupListRaw);
            }
            catch (err) {
                groupList = {};
            }
        }

        // validate group and employee are both not empty
        if (!this.hasValidRecipients(employeeList, groupList)) {
            $.fn.notifyB({
                description: $.fn.gettext('Employee or Group are empty')
            }, 'failure');
            return;
        }

        // create whole data for recipient popup
        const newData = this.prepareData(formData, rowIndex, employeeList, groupList, filePermissions);

        // show recipient data in Table
        const table = $('#table_internal_recipient').DataTable();
        if (rowIndex !== '') {
            newData.id = rowIndex;
            table.row(rowIndex).data(newData).draw();
        }
        else {
            table.rows.add([newData]).draw();
        }
        $('#modal-recipient').modal('hide');
    }

    hasValidRecipients(employeeList, groupList) {
        return Object.keys(employeeList).length > 0 || Object.keys(groupList).length > 0;
    }

    getSelectedPermissions() {
        const permissions = [];
        popup_recipient.$checkboxesToCheck.forEach(($checkbox, index) => {
            if ($checkbox.prop('checked')) {
                permissions.push(index + 1);
            }
        });
        return permissions;
    }

    prepareData(formData, rowIndex, employeeList, groupList, permissions) {
        const data = {
            id: rowIndex,
            title: '',
            kind: parseInt(formData.kind),
            employee_access: employeeList,
            group_access: groupList,
            document_permission_list: permissions
        };
        if (formData.expiration_date) {
            data.expiration_date = formData.expiration_date;
        }

        // extract full_name to display in table
        const employeeNames = Object.values(employeeList)
            .map(emp => emp?.data?.full_name)
            .filter(Boolean);
        data.employee_names = employeeNames;
        return data;
    }

    clear_form_popup() {
        this.$form[0].reset();
        const $inp = $('#input_expired');
        $('#table_group tbody tr td input, #table_employee tbody tr td input').prop('checked', false);
        $('.employee-added > div').html('');
        $inp[0]._flatpickr.set('clickOpens', false);
        $inp.prop('readonly', true);
        $('#btn_edit').hide();
        $('#btn_create').show();
    }

    modalTrigger() {
        const $modal = $('#modal-recipient');
        const _this = this;

        $(document).on('modal.Recipient.edit', function (e, detail) {
            e.preventDefault();
            $modal.modal('show');
            _this.clear_form_popup();

            const data_row = $('#table_internal_recipient').DataTable().row(detail.row_index).data();
            if (data_row) {
                if (data_row?.id) {
                    $('input[name="id"]', _this.$form).val(data_row.id);
                    $('input[name="id"]', _this.$form).attr('data-idx', detail.row_index);
                    $('#btn_create').hide();
                    $('#bth_edit').show();
                }
                $('#txt_title', _this.$form).val(data_row.title);
                $('input[name="kind"][value="' + data_row.kind + '"]', _this.$form).prop('checked', true);

                popup_recipient.load_group_list();
                popup_recipient.load_employee_list();
                popup_recipient.load_employee_show();

                // authorization
                switch (data_row.document_permission_list.length) {
                    case 1:
                        $('#radio_review').prop('checked', true);
                        break;
                    case 2:
                        $('#radio_view').prop('checked', true);
                        break;
                    default:
                        $('#radio_edit').prop('checked', true);
                        break;
                }

                for (let val of data_row.document_permission_list) {
                    const checkboxId = popup_recipient.$checkboxesToCheck[val - 1];
                    if (checkboxId) {
                        $(checkboxId).prop('checked', true);
                    }
                }

                // expiration date
                if (data_row.expiration_date) {
                    const $iptExp = $('#input_expired');
                    $('#enabled_switch').prop('checked', true);
                    $iptExp.prop('readonly', false);
                    $iptExp[0]._flatpickr.set('clickOpens', true);
                    $iptExp[0]._flatpickr.setDate(data_row.expiration_date);
                }
            }
        });
    }
}

$('document').ready(function () {
    popup_recipient.run_popup();
    recipientLoadEventHandler.InitPageEvent();
    new submitPopupRecipient();
});