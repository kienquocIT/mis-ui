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
        let employeeListRaw = pageElements.$storeEmployeeEle.val();
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
        let groupListRaw = pageElements.$storeGroupEle.val();
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
        pageElements.$checkboxesToCheck.forEach(($checkbox, index) => {
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
        return data;
    }

    modalTrigger() {
        const $modal = $('#modal-recipient');
        const _this = this;

        $(document).on('modal.Recipient.edit', function (e, detail) {
            e.preventDefault();
            $modal.modal('show');
            IncomingDocPageFunction.clearRecipientPopup();

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

                recipientModalFunction.loadGroupList();
                recipientModalFunction.loadEmployeeList();
                recipientModalFunction.loadEmployeeShow();

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
                    const checkboxId = pageElements.$checkboxesToCheck[val - 1];
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
    recipientModalFunction.runPopup();
    new submitPopupRecipient();
});