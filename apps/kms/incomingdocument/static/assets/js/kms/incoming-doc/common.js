let IS_DETAIL_PAGE = false

/**
 * Khai báo các Element
 */
class IncomingDocElements {
    constructor() {
        this.$titleEle = $('#txt_create_title');
        this.$descriptionEle = $('#textarea_remark');

        // attached document
        this.$senderEle = $('#sender');
        this.$docTypeEle = $('#select-box-doc_type');
        this.$contentGroupEle = $('#select-box-content_group');
        this.$effectiveDateEle = $('#kms_effective_date');
        this.$expiredDateEle = $('#kms_expired_date');
        this.$securityLevelEle = $('#kms_security_level');
        this.$folderEle = $('#kms_folder');

        // internal recipient
        this.$tableInternalRecipient = $('#table_internal_recipient');
        this.$tableGroup = $('#table_group');
        this.$tableEmployee = $('#table_employee');
        this.$storeGroupEle = $('#group-checked');
        this.$storeEmployeeEle = $('#employee-checked');
        this.$btnAddEmployee = $('#add_employee');
        this.$employeeShowEle = $('#employee_show');
        this.$radioReview = $('#radio_review');
        this.$radioView = $('#radio_view');
        this.$radioEdit = $('#radio_edit');
        this.$radioCustom = $('#radio_custom');
        this.$inputExpired = $('#input_expired');
        this.$checkboxesToCheck = [
            $('#checkbox_review'),
            $('#checkbox_download'),
            $('#checkbox_edit_f_attr'),
            $('#checkbox_share'),
            $('#checkbox_upload_ver'),
            $('#checkbox_duplicate'),
            $('#checkbox_edit_f')
        ];

        // url
        this.$urlEle = $('#app-url-factory');
    }
}
const pageElements = new IncomingDocElements();

/**
 * Khai báo các hàm chính
 */
class IncomingDocLoadDataHandle {
    static initInternalRecipientTable(data, option='create') {
        const $tbl = pageElements.$tableInternalRecipient;

        if ($tbl.hasClass('dataTable')) {
            $tbl.DataTable().clear().rows.add(data).draw();
            return;
        }

        $tbl.DataTableDefault({
            data: data,
            paging: false,
            info: false,
            searching: false,
            columns: [
                {
                    title: 'Internal Recipient',
                    data: 'employee_access',
                    render: (employeeAccess) => {
                        if (!employeeAccess || typeof employeeAccess !== 'object') return '';

                        const names = Object.values(employeeAccess)
                            .map(emp => emp?.data?.full_name)
                            .filter(Boolean);

                        return names.map(name => `
                        <div class="chip recipient-chip chip-outline-primary pill chip-pill mr-2">
                            <span class="chip-text">${name}</span>
                        </div>
                    `).join('');
                    }
                },
                {
                    title: 'Actions',
                    data: 'id',
                    render: (id) => {
                        return `
                        <div class="actions-btn text-center">
                            <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button"
                               title="Edit" href="#" data-id="${id}" data-action="edit">
                                <span class="btn-icon-wrap">${option==='detail' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-pen"></i>'}</span>
                            </a>
                            <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn ${option==='detail' ? 'disabled' : ''}"
                               title="Delete" href="#" data-id="${id}" data-action="delete">
                                <span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span>
                            </a>
                        </div>
                    `;
                    }
                }
            ],
            rowCallback: function (row, data, index) {
                // Bind delete button
                $('.actions-btn a.delete-btn', row).off().on('click', function (e) {
                    e.stopPropagation();
                    $tbl.DataTable().row(row).remove().draw(false);
                });

                // Bind edit button
                $('.actions-btn a.edit-button', row).off().on('click', function (e) {
                    e.stopPropagation();
                    $('#modal-recipient').trigger('modal.Recipient.edit', [{row_index: index}]);
                    $('#form_id').val(index);
                });
            }
        });
    }

    static buildAttachedList() {
        let parsedEffectiveDate = moment(pageElements.$effectiveDateEle.val(), "DD/MM/YYYY", true);
        let parsedExpiredDate = moment(pageElements.$expiredDateEle.val(), "DD/MM/YYYY", true);

        return [{
            sender: pageElements.$senderEle.val(),
            document_type: pageElements.$docTypeEle.val(),
            content_group: pageElements.$contentGroupEle.val(),
            effective_date: parsedEffectiveDate.isValid() ? parsedEffectiveDate.format('YYYY-MM-DD') : null,
            expired_date: parsedExpiredDate.isValid() ? parsedExpiredDate.format('YYYY-MM-DD') : null,
            security_level: pageElements.$securityLevelEle.val(),
        }]
    }

    static combineData(formEle) {
        let frm = new SetupFormSubmit($(formEle));
        frm.dataForm['title'] = pageElements.$titleEle.val();
        frm.dataForm['remark'] = pageElements.$descriptionEle.val() || '';
        frm.dataForm['attached_list'] = IncomingDocLoadDataHandle.buildAttachedList();
        frm.dataForm['internal_recipient'] = pageElements.$tableInternalRecipient.DataTable().data().toArray();
        if (frm.dataForm.hasOwnProperty('attachment')) {
            frm.dataForm['attachment'] = $x.cls.file.get_val(frm.dataForm?.['attachment'], []);
        }
        return frm;
    }
}

/**
 * Các hàm load page và hàm hỗ trợ
 */
class IncomingDocPageFunction {
    static LoadDocumentType(data) {
        pageElements.$docTypeEle.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$docTypeEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'document_type_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    static LoadContentGroup(data) {
        pageElements.$contentGroupEle.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$contentGroupEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'content_group_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    static LoadFolderType(data) {
        pageElements.$folderEle.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$folderEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'folder_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    // init date picker and load Editor
    static initDatePickers() {
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });
    }

    static loadEditor() {
        const $textArea = $('#textarea_remark');
        $textArea.tinymce({
            height: 500,
            menubar: false,
            plugins: ['columns', 'print', 'preview', 'paste', 'importcss', 'searchreplace', 'autolink', 'autosave',
                'save', 'directionality', 'code', 'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media',
                'codesample', 'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc',
                'insertdatetime', 'advlist', 'lists', 'wordcount', 'imagetools', 'textpattern', 'noneditable',
                'help', 'charmap', 'quickbars', 'emoticons'],
            toolbar: 'bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist table twoColumn threeColumn | preview pagebreak removeformat print visualblocks',  // | rarely_used
            quickbars_insert_toolbar: 'link image | numlist bullist table twoColumn threeColumn | hr pagebreak',
            toolbar_groups: {
                rarely_used: {
                    icon: 'more-drawer',
                    tooltip: 'Rarely Used',
                    items: 'ltr rtl | charmap emoticons | superscript subscript | nonbreaking anchor media | undo redo | '
                }
            },
            font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Cambria=cambria,serif; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
            pagebreak_split_block: true,
            pagebreak_separator: '<span class="page-break-here"><!-- my page break --></span>',
            nonbreaking_force_tab: true,
            insertdatetime_formats: ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y', '%H:%M:%S', '%I:%M:%S %p'],
            content_css: $textArea.attr('data-css-url-render'),
            content_style: `
                body { font-family: Cambria,sans-serif; font-size: 12pt; }
                @import url('/static/assets/fonts/cambria/Cambria.ttf');
                @media print {
                    .mce-visual-caret {
                        display: none;
                    }
                }
            `
        });
    }

    static prepareGroupAndEmployeeAccess(recipient) {
        if (!recipient || typeof recipient !== 'object') return;

        const storeGroupObj = {};
        const storeEmployeeObj = {};
        const employeeAccess = recipient?.['employee_access'] || {};
        const groupAccess = recipient?.['group_access'] || {};

        Object.entries(employeeAccess).forEach(([id, info]) => {
            if (id && info?.data) {
                storeEmployeeObj[id] = info;
            }
        });

        Object.entries(groupAccess).forEach(([id, info]) => {
            if (id && info?.data) {
                storeGroupObj[id] = info;
            }
        });

        pageElements.$storeEmployeeEle.val(JSON.stringify(storeEmployeeObj));
        pageElements.$storeGroupEle.val(JSON.stringify(storeGroupObj));
    }

    static loadDetailIncomingDoc(option) {
        const data_url = $('#frm_detail_incoming_document').attr('data-url');
        $.fn.callAjax2({url: data_url, method: 'GET'}).then(
            (resp) => {
                IS_DETAIL_PAGE = option === 'detail';

                const data = $.fn.switcherResp(resp);
                $x.fn.renderCodeBreadcrumb(data);
                $.fn.compareStatusShowPageAction(data);
                new $x.cls.file($('#attachment')).init({
                    enable_edit: false,
                    enable_download: true,
                    data: data?.['attachment'],
                });
                const attached = data?.['attached_list']?.[0] || {};
                const recipients = data?.['internal_recipient'] || [];
                const recipients_detail = recipients?.[0] || {};
                const effectiveDate = attached.effective_date ? moment(attached.effective_date).format('DD/MM/YYYY') : '';
                const expiredDate = attached.expired_date ? moment(attached.expired_date).format('DD/MM/YYYY') : '';
                const levelLabel = attached.security_level || '';

                pageElements.$titleEle.val(data.title);
                pageElements.$descriptionEle.val(data.remark?.replace(/<[^>]*>?/gm, '')).prop('disabled', true);
                pageElements.$senderEle.val(attached.sender || '');
                pageElements.$effectiveDateEle.val(effectiveDate);
                pageElements.$expiredDateEle.val(expiredDate);

                IncomingDocPageFunction.LoadDocumentType(attached.document_type);
                IncomingDocPageFunction.LoadContentGroup(attached.content_group);
                IncomingDocPageFunction.LoadFolderType();
                IncomingDocPageFunction.initDatePickers();

                // Match by label (for cases where value may not be id)
                const matchedOption = pageElements.$securityLevelEle.find('option').filter(function () {
                    return $(this).text().trim() === levelLabel.trim();
                }).first();
                if (matchedOption.length > 0) {
                    pageElements.$securityLevelEle.val(matchedOption.val()).trigger('change');
                }
                IncomingDocLoadDataHandle.initInternalRecipientTable(recipients, option);
                IncomingDocPageFunction.prepareGroupAndEmployeeAccess(recipients_detail);
                recipientModalFunction.loadGroupList();
                recipientModalFunction.loadEmployeeList();
                recipientModalFunction.loadEmployeeShow();
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                UsualLoadPageFunction.DisablePage(option==='detail', ['.modal-header button']);
            },
        );
    }

    // process for recipient popup
    static uncheckAllRightCheckboxes() {
        $('.right-access input[type="checkbox"]').prop('checked', false);
    }

    static clearRecipientPopup() {
        const $form = $('#recipient_form');
        $form[0].reset();

        $('input[name="id"]', $form).val('').attr('data-idx', '');
        $('#table_group tbody tr td input, #table_employee tbody tr td input').prop('checked', false);
        $('.employee-added > div').html('');
        const $inp = $('#input_expired');
        $('#enabled_switch').prop('checked', false);
        $inp.prop('readonly', true).val('');
        if ($inp[0]?._flatpickr) {
            $inp[0]._flatpickr.clear();
            $inp[0]._flatpickr.set('clickOpens', false);
        }
        $('#btn_edit').hide();
        $('#btn_create').show();
    }
}

/**
 * Các hàm xử lý logic cho modal Recipient
 */
class recipientModalFunction {
    static loadStoreCheckGroup(ele) {
        let row = ele.closest('tr');
        let rowIndex = pageElements.$tableGroup.DataTable().row(row).index();
        let $row = pageElements.$tableGroup.DataTable().row(rowIndex);
        let dataRow = $row.data();

        if (dataRow) {
            if (pageElements.$storeGroupEle.val()) {
                let storeID = JSON.parse(pageElements.$storeGroupEle.val());
                if (typeof storeID === 'object') {
                    if (ele.checked) {
                        if (!storeID?.[dataRow?.['id']]) {
                            storeID[dataRow?.['id']] = {
                                "type": "current",
                                "data": dataRow,
                            };
                        }
                    } else {
                        if (storeID?.[dataRow?.['id']]) {
                            delete storeID?.[dataRow?.['id']];
                        }
                    }
                    pageElements.$storeGroupEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                pageElements.$storeGroupEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    }

    static loadStoreCheckEmployee(ele) {
        let row = ele.closest('tr');
        let rowIndex = pageElements.$tableEmployee.DataTable().row(row).index();
        let $row = pageElements.$tableEmployee.DataTable().row(rowIndex);
        let dataRow = $row.data();

        if (dataRow) {
            if (pageElements.$storeEmployeeEle.val()) {
                let storeID = JSON.parse(pageElements.$storeEmployeeEle.val());
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
                    pageElements.$storeEmployeeEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                pageElements.$storeEmployeeEle.val(JSON.stringify(dataStore));
            }
        }
        return true;

    }

    static collectGroupLoadEmployee() {
        let listGroupID = [];
        if (pageElements.$storeGroupEle.val()) {
            let storeData = JSON.parse(pageElements.$storeGroupEle.val());
            for (let key in storeData) {
                listGroupID.push(key);
            }
        }
        if ($.fn.dataTable.isDataTable(pageElements.$tableEmployee)) {
            pageElements.$tableEmployee.DataTable().destroy();
        }

        recipientModalFunction.loadEmployeeList({'group_id__in': listGroupID.join(',')});
        return true;
    }

    static loadGroupList() {
        pageElements.$tableGroup.DataTable().clear().destroy();
        pageElements.$tableGroup.DataTableDefault({
            useDataServer: true,
            pageLength: 5,
            scrollY: '250px',
            scrollCollapse: true,
            rowIndex: false,
            info: false,
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
                        if (pageElements.$storeGroupEle.val()) {
                            let storeID = JSON.parse(pageElements.$storeGroupEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[data?.['id']]) {
                                    checked = 'checked';
                                }
                            }
                        }
                        return `<div class="form-check form-check-lg">
                                    <input ${IS_DETAIL_PAGE ? 'disabled' : '' } type="checkbox" id="checkbox_${data.code}" class="form-check-input row-checkbox" value="${data.id}" ${checked}>
                                    <label title="${data.title}" for="checkbox_${data.code}" class="form-check-label">
                                    ${data.title}</label>
                                </div>`;
                    },
                },
            ],
            rowCallback: function (row, data) {
                $(row).find('.row-checkbox').on('click', function () {
                    recipientModalFunction.loadStoreCheckGroup(this);
                    recipientModalFunction.collectGroupLoadEmployee();
                })
            },

        })
    }

    static loadEmployeeList(dataParams) {
        pageElements.$tableEmployee.DataTable().clear().destroy();
        pageElements.$tableEmployee.DataTableDefault({
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
                        if (pageElements.$storeEmployeeEle.val()) {
                            let storeID = JSON.parse(pageElements.$storeEmployeeEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[data?.['id']]) {
                                    checked = 'checked';
                                }
                            }
                        }
                        return `<div class="form-check form-check-lg">
                                    <input ${IS_DETAIL_PAGE ? 'disabled' : '' } type="checkbox" id="checkbox_${data.code}" class="form-check-input row-checkbox" value="${data.id}" ${checked}>
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
                    recipientModalFunction.loadStoreCheckEmployee(this);
                    let listEmployeeID = [];
                    if (pageElements.$storeEmployeeEle.val()) {
                        let storeData = JSON.parse(pageElements.$storeEmployeeEle.val());
                        for (let key in storeData) {
                            listEmployeeID.push(key);
                        }
                    }
                })
            },
        })
    }

    static loadEmployeeShow() {
        if (pageElements.$storeEmployeeEle.val()) {
            pageElements.$employeeShowEle.empty();
            let storeData = JSON.parse(pageElements.$storeEmployeeEle.val());
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
            pageElements.$employeeShowEle.append(bodyShow);
        }
        return true;
    }

    static loadDateExp() {
        pageElements.$inputExpired.flatpickr({
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

    static runPopup() {
        recipientModalFunction.loadGroupList();
        recipientModalFunction.loadEmployeeList();
        recipientModalFunction.loadDateExp();
    }
}

/**
 * Khai báo các Event
 */
class IncomingDocEventHandler {
    static InitPageEvent() {
        // create page
        $('#add_new_recipient').on('click', function () {
            IncomingDocPageFunction.clearRecipientPopup();
            $('#modal-recipient').modal('show');
        });

        // recipient page
        $('#add_employee').on('click', function () {
            recipientModalFunction.loadEmployeeShow();
        });

        $('#employee_show').on('click', '.btn-close', function () {
            if ($(this).attr('data-id') && pageElements.$storeEmployeeEle.val()) {
                let removeID = $(this).attr('data-id');
                let storeData = JSON.parse(pageElements.$storeEmployeeEle.val());
                if (storeData?.[removeID]) {
                    delete storeData?.[removeID];
                }
                pageElements.$storeEmployeeEle.val(JSON.stringify(storeData));
            }
            recipientModalFunction.collectGroupLoadEmployee();
            recipientModalFunction.loadEmployeeShow();
        });

        pageElements.$radioReview.on('click', function () {
            IncomingDocPageFunction.uncheckAllRightCheckboxes();
            $('#checkbox_review').prop('checked', true);
        });

        pageElements.$radioView.on('click', function () {
            IncomingDocPageFunction.uncheckAllRightCheckboxes();
            const checkboxesToCheck = [
                $('#checkbox_review'),
                $('#checkbox_download')
            ];
            checkboxesToCheck.forEach($checkbox => {
                $checkbox.prop('checked', true);
            })
        })

        pageElements.$radioEdit.on('click', function () {
            IncomingDocPageFunction.uncheckAllRightCheckboxes();
            pageElements.$checkboxesToCheck.forEach($checkbox => {
                $checkbox.prop('checked', true);
            })
        })

        pageElements.$radioCustom.on('click', function () {
            IncomingDocPageFunction.uncheckAllRightCheckboxes();
            pageElements.$checkboxesToCheck.forEach($checkbox => {
                $checkbox.prop('checked', true);
            })
        })
    }

}