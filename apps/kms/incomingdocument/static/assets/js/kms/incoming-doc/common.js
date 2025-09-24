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
        this.$folderEle = $('#kms_incoming_doc_folder');

        // internal recipient
        this.$recipientListEle = $('#recipient_list');
        this.$tableGroup = $('#table_group');
        this.$tableEmployee = $('#table_employee');
        this.$storeGroupEle = $('#group-checked');
        this.$storeEmployeeEle = $('#employee-checked');

        // url
        this.$urlEle = $('#app-url-factory');
    }
}

const pageElements = new IncomingDocElements();

/**
 * Khai báo các hàm chính
 */
class IncomingDocLoadDataHandle {

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
            folder: pageElements.$folderEle.val()
        }]
    }

    static getInternalRecipientData() {
        let employeeListRaw = pageElements.$storeEmployeeEle.val();
        let employeeList = {};
        if (typeof employeeListRaw === 'object' && employeeListRaw !== null) {
            employeeList = employeeListRaw;
        } else if (typeof employeeListRaw === 'string') {
            try {
                employeeList = JSON.parse(employeeListRaw);
            } catch (err) {
                employeeList = {};
            }
        }
        let recipientData = Object.entries(employeeList).map(([uuid, obj]) => ({
            employee: uuid,
            employee_access: obj.data
        }));
        return recipientData;
    }

    static combineData(formEle) {
        let frm = new SetupFormSubmit($(formEle));
        frm.dataForm['title'] = pageElements.$titleEle.val();
        frm.dataForm['remark'] = pageElements.$descriptionEle.val() || '';
        frm.dataForm['attached_list'] = IncomingDocLoadDataHandle.buildAttachedList();
        frm.dataForm['internal_recipient'] = IncomingDocLoadDataHandle.getInternalRecipientData();
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
        // organize data for Employee element
        const storeEmployeeObj = {};
        recipient.forEach(item => {
            storeEmployeeObj[item.employee] = {
                type: 'current',
                data: item.employee_access
            };
        });
        pageElements.$storeEmployeeEle.val(JSON.stringify(storeEmployeeObj));

        const storeGroupObj = {};
        recipient.forEach(item => {
            const employeeAccess = item.employee_access;
            storeGroupObj[employeeAccess.group.id] = {
                type: 'current',
                data: employeeAccess
            };
        });
        pageElements.$storeGroupEle.val(JSON.stringify(storeGroupObj));
    }

    static loadDetailIncomingDoc() {
        let $form = $('#frm_detail_incoming_document');
        const data_url = $form.attr('data-url');
        $.fn.callAjax2({url: data_url, method: 'GET'}).then(
            (resp) => {
                IS_DETAIL_PAGE = $form.attr('data-method').toLowerCase() === 'get';

                const data = $.fn.switcherResp(resp);
                $x.fn.renderCodeBreadcrumb(data);
                $.fn.compareStatusShowPageAction(data);
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: !IS_DETAIL_PAGE,
                    enable_download: true,
                    data: data?.['attachment'],
                });
                const attached = data?.['attached_list']?.[0] || {};
                const recipients = data?.['internal_recipient'] || [];
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
                IncomingDocPageFunction.LoadFolderType(attached.folder);

                // Match by label (for cases where value may not be id)
                const matchedOption = pageElements.$securityLevelEle.find('option').filter(function () {
                    return $(this).text().trim() === levelLabel.trim();
                }).first();
                if (matchedOption.length > 0) {
                    pageElements.$securityLevelEle.val(matchedOption.val()).trigger('change');
                }
                IncomingDocPageFunction.prepareGroupAndEmployeeAccess(recipients);
                recipientModalFunction.loadGroupList();
                recipientModalFunction.loadEmployeeList();
                recipientModalFunction.loadEmployeeShow();
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                // disable element
                UsualLoadPageFunction.DisablePage(IS_DETAIL_PAGE, ['.modal-header button']);
            },
        );
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
                                    <input ${IS_DETAIL_PAGE ? 'disabled' : ''} type="checkbox" id="checkbox_${data.code}" class="form-check-input row-checkbox" value="${data.id}" ${checked}>
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
                                    <input ${IS_DETAIL_PAGE ? 'disabled' : ''} type="checkbox" id="checkbox_${data.code}" class="form-check-input row-checkbox" value="${data.id}" ${checked}>
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
            pageElements.$recipientListEle.empty();
            let storeData = JSON.parse(pageElements.$storeEmployeeEle.val());
            let bodyShow = ``;
            for (let key in storeData) {
                let dataKey = storeData[key];
                let data = dataKey?.['data'];
                bodyShow += `<div class="chip chip-primary chip-dismissable mr-2">
                                <span>
                                    <span class="chip-text">${data?.['full_name']}</span>
                                    <button type="button" class="btn-close" data-id="${data?.['id']}" ${IS_DETAIL_PAGE ? 'disabled' : ''}></button>
                                </span>
                            </div>`;
            }
            pageElements.$recipientListEle.append(bodyShow);
        }
        return true;
    }

    static runPopup() {
        recipientModalFunction.loadGroupList();
        recipientModalFunction.loadEmployeeList();
    }
}

/**
 * Khai báo các Event
 */
class IncomingDocEventHandler {
    static InitPageEvent() {
        // create page
        $('#edit_recipient_btn').on('click', function () {
            $('#modal-recipient').modal('show');
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
    }
}
