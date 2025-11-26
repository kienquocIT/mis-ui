// Load data
class ContractLoadDataHandle {
    static $form = $('#frm_contract_create');
    static $boxOpp = $('#opportunity_id');
    static $boxEmp = $('#employee_inherit_id');
    static $btnOpenAttach = $('#btn-open-attachment');
    static $drawer = $('#drawer_contract_data');
    static $fileArea = $('#file-area');
    static $remark = $('#contract-doc-remark');
    static $attachment = $('#attachment');
    static $attachmentTmp = $('#attachment-tmp');
    static $trans = $('#app-trans-factory');
    static $url = $('#app-url-factory');

    static loadCustomCss() {
        $('.accordion-item').css({
            'margin-bottom': 0
        });
    };

    static loadInitInherit() {
        let dataStr = $('#employee_current').text();
        if (dataStr) {
            FormElementControl.loadInitS2(ContractLoadDataHandle.$boxEmp, [JSON.parse(dataStr)]);
        }
        return true;
    };

    static loadDataByOpp() {
        if (ContractLoadDataHandle.$boxOpp.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(ContractLoadDataHandle.$boxOpp, ContractLoadDataHandle.$boxOpp.val());
            if (dataSelected) {
                ContractLoadDataHandle.$boxEmp[0].setAttribute('readonly', 'true');
                ContractLoadDataHandle.$boxEmp.empty();
                ContractLoadDataHandle.$boxEmp.initSelect2({
                    data: dataSelected?.['sale_person'],
                    'allowClear': true,
                });
            }
        } else {
            ContractLoadDataHandle.$boxEmp[0].removeAttribute('readonly');
        }
        return true;
    };

    // DOCUMENT
    static loadAddDoc() {
        let TotalOrder = ContractDataTableHandle.$tableDocument[0].querySelectorAll('.table-row-order').length;
        let order = TotalOrder + 1;
        let dataAdd = {
            "title": "",
            "order": order,
            "attachment_data": [],
        }
        ContractDataTableHandle.$tableDocument.DataTable().row.add(dataAdd).draw().node();
        return true;
    };

    static loadOpenAttach(ele) {
        let row = ele.closest('tr');
        if (row) {
            ContractLoadDataHandle.$fileArea[0].classList.remove('bg-light');
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                ContractLoadDataHandle.$fileArea[0].setAttribute('data-doc', eleOrder.innerHTML);
            }
            ContractLoadDataHandle.$remark[0].removeAttribute('readonly');
            ContractLoadDataHandle.$remark.val('');
            let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
            if (fileIds) {
                fileIds.value = "";
            }
            if (ele.getAttribute('data-store') && fileIds) {
                let dataStore = JSON.parse(ele.getAttribute('data-store'));
                ContractLoadDataHandle.$remark.val(dataStore?.['remark']);
                let ids = [];
                for (let fileData of dataStore?.['attachment_data']) {
                    ids.push(fileData?.['attachment']?.['id']);
                }
                let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
                if (fileIds) {
                    fileIds.value = ids.join(',');
                }
                let attachmentParse = [];
                for (let attachData of dataStore?.['attachment_data']) {
                    attachmentParse.push(attachData?.['attachment']);
                }
                // append html file again
                ContractLoadDataHandle.$attachment.empty().html(`${ContractLoadDataHandle.$attachmentTmp.html()}`);
                // init file again
                new $x.cls.file(ContractLoadDataHandle.$attachment).init({
                    name: 'attachment',
                    enable_edit: true,
                    enable_download: true,
                    data: attachmentParse.reverse(),
                });
                ContractLoadDataHandle.loadCustomAttach();
                // add event
                let attachIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
                if (attachIds) {
                    attachIds.addEventListener('change', function () {
                        ContractLoadDataHandle.loadCustomAttach();
                    });
                }
            }
            ContractLoadDataHandle.$attachment[0].removeAttribute('hidden');
        }
        if (!ContractLoadDataHandle.$drawer[0].classList.contains('open')) {
            ContractLoadDataHandle.$btnOpenAttach.trigger('click');
        }
        return true;
    };

    // FILE
    static loadSetupAttach() {
        let result = [];
        let is_current = true;
        let count = 0;
        let attachIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
        if (attachIds) {
            let ids = $x.cls.file.get_val(attachIds.value, []).reverse();
            if (ids.length > 0) {
                for (let mediaBody of ContractLoadDataHandle.$attachment[0].querySelectorAll('.media-body')) {
                    let fileName = mediaBody.querySelector('.f-item-name');
                    let fileSize = mediaBody.querySelector('.f-item-info');
                    // let fileRemark = mediaBody.querySelector('.file-txt-remark');
                    if (fileName && fileSize) {
                        let dataAdd = {
                            'attachment': {
                                'id': ids[count],
                                'file_name': fileName.innerHTML,
                                'file_size': parseFloat(fileSize.innerHTML.replace(" KB", "")),
                                // 'remarks': fileRemark.value,
                            },
                            'date_created': DateTimeControl.getCurrentDate(),
                            'is_current': is_current,
                        };
                        result.push(dataAdd);
                    }
                    // update is_current
                    is_current = false;
                    count++;
                }
            }
        }
        return result;
    };

    static loadCustomAttach() {
        let is_current = true;
        let count = 0;
        let attachIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
        if (attachIds) {
            let ids = $x.cls.file.get_val(attachIds.value, []).reverse();
            if (ids.length > 0) {
                for (let mediaBody of ContractLoadDataHandle.$attachment[0].querySelectorAll('.media-body')) {
                    // append custom data to .media-body
                    let txt = ContractLoadDataHandle.$trans.attr('data-old');
                    let badge = 'danger';
                    let btn = `<div class="d-flex"><button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover set-current" data-attachment-id="${ids[count]}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-set-current')}"><span class="icon"><i class="fas fa-retweet"></i></span></button></div>`;
                    if (is_current === true) {
                        txt = ContractLoadDataHandle.$trans.attr('data-current');
                        badge = 'success';
                        btn = ``;
                    }
                    if (mediaBody.querySelector('.custom-file-data')) {
                        $(mediaBody.querySelector('.custom-file-data')).empty();
                        $(mediaBody.querySelector('.custom-file-data')).append(`<div class="mt-2"><span class="file-date-created mr-2">${DateTimeControl.getCurrentDate("DMY", "/")}</span><span class="text-${badge} file-is-current">${txt}</span></div>
                                                                        ${btn}`);
                    } else {
                        $(mediaBody).append(`<div class="d-flex custom-file-data">
                                        <div class="mt-2"><span class="file-date-created mr-2">${DateTimeControl.getCurrentDate("DMY", "/")}</span><span class="text-${badge} file-is-current">${txt}</span></div>
                                        ${btn}
                                    </div>`);
                    }
                    // update is_current & order
                    is_current = false;
                    count++;
                }
            }
        }
        return true;
    };

    static loadSetCurrent(ele) {
        let newDataList = [];
        let newIDList = [];
        let attachDataList = ContractLoadDataHandle.loadSetupAttach();
        let targetID = ele.getAttribute('data-attachment-id');
        for (let attachData of attachDataList) {
            if (attachData?.['attachment']?.['id'] === targetID) {
                attachData['is_current'] = true;
                newDataList.push(attachData?.['attachment']);
                newIDList.push(attachData?.['attachment']?.['id']);
            }
        }
        for (let attachData of attachDataList) {
            if (attachData?.['attachment']?.['id'] !== targetID) {
                newDataList.push(attachData?.['attachment']);
                newIDList.push(attachData?.['attachment']?.['id']);
            }
        }
        let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
        if (fileIds) {
            fileIds.value = newIDList.join(',');
        }
        // append html file again
        ContractLoadDataHandle.$attachment.empty().html(`${ContractLoadDataHandle.$attachmentTmp.html()}`);
        // init file again
        new $x.cls.file(ContractLoadDataHandle.$attachment).init({
            name: 'attachment',
            enable_edit: true,
            enable_download: true,
            data: newDataList.reverse(),
        });
        ContractLoadDataHandle.loadCustomAttach();
        // add event
        let attachIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
        if (attachIds) {
            attachIds.addEventListener('change', function () {
                ContractLoadDataHandle.loadCustomAttach();
            });
        }
    };

    // Dtb
    static loadCssToDtb(tableID) {
        let tableIDWrapper = tableID + '_wrapper';
        let tableWrapper = document.getElementById(tableIDWrapper);
        if (tableWrapper) {
            let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
            if (headerToolbar) {
                headerToolbar.classList.add('hidden');
            }
        }
    };

    // DETAIL
    static loadDetail(data) {
        $('#contract-title').val(data?.['title']);

        const processData = data?.['process'] || {};
        const processStageAppData = data?.['process_stage_app'] || {};
        const oppData = data?.['opportunity'] || {};
        const inheritData = data?.['employee_inherit'] || {};
        new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            has_process: true,
            data_process: processData && Object.keys(processData).length > 0 ? [
                {
                    ...processData,
                    'selected': true,
                }
            ] : [],
            data_process_stage_app: processStageAppData && Object.keys(processStageAppData).length > 0 ? [
                {
                    ...processStageAppData,
                    'selected': true,
                }
            ] : [],
            processStageAppFlagData: {
                'disable': true,
            },
            data_opp: oppData && Object.keys(oppData).length > 0 ? [
                {
                    ...oppData,
                    'selected': true,
                }
            ] : [],
            data_inherit: inheritData && Object.keys(inheritData).length > 0 ? [
                {
                    ...inheritData,
                    'selected': true,
                }
            ] : [],
        }).init();

        ContractLoadDataHandle.setupDetailDocAttach(data);
        ContractDataTableHandle.$tableDocument.DataTable().rows.add(data?.['document_data']).draw();
        ContractDataTableHandle.$tableDocument.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.open-attach') && row.querySelector('.file-preview-link')) {
                if (row.querySelector('.open-attach').getAttribute('data-store')) {
                    let dataStore = JSON.parse(row.querySelector('.open-attach').getAttribute('data-store'));
                    for (let attachmentData of dataStore?.['attachment_data']) {
                        if (attachmentData?.['is_current'] === true) {
                            if (attachmentData?.['attachment']?.['id']) {
                                let url = ContractLoadDataHandle.$url.attr('data-preview-attach').format_url_with_uuid(attachmentData?.['attachment']?.['id']);
                                row.querySelector('.file-preview-link').setAttribute('href', url);
                                break;
                            }
                        }
                    }
                }
            }
        });
        ContractLoadDataHandle.loadReadOnlyDisabled(ContractDataTableHandle.$tableDocument);
        ContractTinymceHandle.initTinymce(data?.['abstract_content'], 'abstract-content');
        ContractTinymceHandle.initTinymce(data?.['trade_content'], 'trade-content');
        ContractTinymceHandle.initTinymce(data?.['legal_content'], 'legal-content');
        ContractTinymceHandle.initTinymce(data?.['payment_content'], 'payment-content');
        return true;
    };

    static setupDetailDocAttach(data) {
        if (data?.['document_data']) {
            for (let dataDoc of data?.['document_data']) {
                if (dataDoc?.['attachment_data']) {
                    for (let attachData of dataDoc?.['attachment_data']) {
                        if (data?.['attachment']) {
                            for (let attach of data?.['attachment']) {
                                if (attachData?.['attachment']?.['id'] === attach?.['id']) {
                                    attachData['attachment'] = attach;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    static loadReadOnlyDisabled($table) {
        if (ContractLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            for (let ele of $table[0].querySelectorAll('.table-row-title')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of $table[0].querySelectorAll('.open-attach')) {
                ele.setAttribute('disabled', 'true');
            }
            for (let ele of $table[0].querySelectorAll('.del-row')) {
                ele.setAttribute('disabled', 'true');
            }
        }
        return true;
    };

}

// DataTable
class ContractDataTableHandle {
    static $tableDocument = $('#datable-contract-document');

    static dataTableDocument(data) {
        ContractDataTableHandle.$tableDocument.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row?.['order'] ? row?.['order'] : 0}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '60%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-title" value="${row?.['title'] ? row?.['title'] : ''}" required>`;
                    }
                },
                {
                    targets: 2,
                    class: 'text-center',
                    width: '15%',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-center">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover open-attach" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-attach-file')}" data-store="${JSON.stringify(row).replace(/"/g, "&quot;")}" data-order="${row?.['order']}"><span class="icon"><i class="fas fa-paperclip"></i></span></button>
                                    <a class="file-preview-link" href="/attachment/preview/000c7563-0eb5-45d0-94fb-f0f46186f325" target="_blank">
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover view-current" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-view-file')}"><span class="icon"><i class="far fa-eye"></i></span></button>
                                    </a>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-delete')}"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
                if (['post', 'put'].includes(ContractLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    ContractDataTableHandle.dtbDocumentHDCustom();
                }
            },
        });
    };

    // Custom dtb
    static dtbDocumentHDCustom() {
        let $table = ContractDataTableHandle.$tableDocument;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-doc').length) {
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-add-doc">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${ContractLoadDataHandle.$trans.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-doc').on('click', function () {
                    ContractLoadDataHandle.loadAddDoc();
                });
            }
        }
    };

}

// Store data
class ContractStoreHandle {
    static storeAttachment() {
        let dataStore = {};
        dataStore['remark'] = ContractLoadDataHandle.$remark.val();
        dataStore['attachment_data'] = ContractLoadDataHandle.loadSetupAttach();
        let doc = ContractLoadDataHandle.$fileArea.attr('data-doc');
        if (doc) {
            let btnStore = ContractDataTableHandle.$tableDocument[0].querySelector(`.open-attach[data-order="${doc}"]`);
            if (btnStore) {
                btnStore.setAttribute('data-store', JSON.stringify(dataStore));
            }
        }
        return true;
    };
}

// Submit Form
class ContractSubmitHandle {
    static setupDataDocument() {
        let result = [];
        let attachmentAll = [];
        ContractDataTableHandle.$tableDocument.DataTable().rows().every(function () {
            let row = this.node();
            let eleOrd = row.querySelector('.table-row-order');
            let eleTitle = row.querySelector('.table-row-title');
            let btnAttach = row.querySelector('.open-attach');
            if (eleOrd && eleTitle && btnAttach) {
                let attachment_data = [];
                let attachment = [];
                if (btnAttach.getAttribute('data-store')) {
                    let dataStore = JSON.parse(btnAttach.getAttribute('data-store'));
                    attachment_data = dataStore?.['attachment_data'];
                    for (let attach of dataStore?.['attachment_data']) {
                        attachment.push(attach?.['attachment']?.['id']);
                        attachmentAll.push(attach?.['attachment']?.['id']);
                    }
                }
                result.push({
                    'title': eleTitle.value,
                    'remark': ContractLoadDataHandle.$remark.val(),
                    // 'attachment': attachment,
                    'attachment_data': attachment_data,
                    'order': parseInt(eleOrd.innerHTML),
                })
            }
        });
        return {'dataDoc': result, 'attachment': attachmentAll}
    };

    static setupDataSubmit(_form) {
        if (ContractLoadDataHandle.$boxOpp.val()) {
            _form.dataForm['opportunity_id'] = ContractLoadDataHandle.$boxOpp.val();
            let data = SelectDDControl.get_data_from_idx(ContractLoadDataHandle.$boxOpp, ContractLoadDataHandle.$boxOpp.val());
            if (data) {
                _form.dataForm['opportunity_data'] = data;
            }
        }
        if (ContractLoadDataHandle.$boxEmp.val()) {
            _form.dataForm['employee_inherit_id'] = ContractLoadDataHandle.$boxEmp.val();
            let data = SelectDDControl.get_data_from_idx(ContractLoadDataHandle.$boxEmp, ContractLoadDataHandle.$boxEmp.val());
            if (data) {
                _form.dataForm['employee_inherit_data'] = data;
            }
        }
        ContractStoreHandle.storeAttachment();
        let dataDocParse = ContractSubmitHandle.setupDataDocument();
        _form.dataForm['document_data'] = dataDocParse?.['dataDoc'];
        _form.dataForm['attachment'] = dataDocParse?.['attachment'];
        _form.dataForm['abstract_content'] = ContractTinymceHandle.getContent('abstract-content');
        _form.dataForm['trade_content'] = ContractTinymceHandle.getContent('trade-content');
        _form.dataForm['legal_content'] = ContractTinymceHandle.getContent('legal-content');
        _form.dataForm['payment_content'] = ContractTinymceHandle.getContent('payment-content');
    };
}

// Common
class ContractCommonHandle {
    static commonDeleteRow(currentRow, $table) {
        ContractCommonHandle.deleteRowContract(currentRow, $table);
        ContractCommonHandle.reOrderTbl($table);
        return true;
    };

    static reOrderTbl($table) {
        let itemCount = $table[0].querySelectorAll('.table-row-order').length;
        if (itemCount === 0) {
            $table.DataTable().clear().draw();
        } else {
            let order = 1;
            for (let eleOrder of $table[0].querySelectorAll('.table-row-order')) {
                if (eleOrder.getAttribute('data-row')) {
                    let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                    dataRow['order'] = order;
                }
                eleOrder.innerHTML = order;
                order++
                if (order > itemCount) {
                    break;
                }
            }
        }
        return true;
    };

    static deleteRowContract(currentRow, $table) {
        let rowIdx = $table.DataTable().row(currentRow).index();
        let row = $table.DataTable().row(rowIdx);
        row.remove().draw();
        return true;
    };

    static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }

}

class ContractTinymceHandle{
    static initTinymce(htmlContent = '', idTarget) {
        tinymce.init({
            selector: `textarea#${idTarget}`,
            plugins: 'paste importcss autolink autosave save directionality code visualblocks visualchars fullscreen',
            menubar: false,  // Hide the menubar
            toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect | removeformat',
            toolbar_sticky: true,
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: false,  // Disable advanced image options
            importcss_append: true,
            height: 400,
            quickbars_selection_toolbar: 'bold italic underline | fontselect fontsizeselect',
            noneditable_noneditable_class: 'mceNonEditable',
            toolbar_mode: 'sliding',  // Toolbar slides to fit smaller screens
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            setup: function (editor) {
                // Set content when the editor is initialized
                editor.on('init', function () {
                    editor.setContent(htmlContent);
                });
            }
        });
    };

    static getContent(idTarget) {
        return tinymce.get(idTarget).getContent();
    };
}