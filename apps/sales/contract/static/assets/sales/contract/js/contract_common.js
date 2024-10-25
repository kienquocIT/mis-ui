// Load data
class ContractLoadDataHandle {
    static $form = $('#frm_contract_create');
    static $btnAddDoc = $('#btn-add-doc');
    static $btnOpenAttach = $('#btn-open-attachment');
    static $drawer = $('#drawer_contract_data');
    static $fileArea = $('#file-area');
    static $remark = $('#contract-doc-remark');
    static $attachment = $('#attachment');
    static $attachmentTmp = $('#attachment-tmp');
    static $trans = $('#app-trans-factory');

    static loadCustomCss() {
        $('.accordion-item').css({
            'margin-bottom': 0
        });
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

    static loadOpenAttachFile(ele) {
        let row = ele.closest('tr');
        if (row) {
            ContractLoadDataHandle.$fileArea[0].classList.remove('bg-light');
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                ContractLoadDataHandle.$fileArea[0].setAttribute('data-doc', eleOrder.innerHTML);
            }
            ContractLoadDataHandle.$remark[0].removeAttribute('readonly');
            ContractLoadDataHandle.$remark.val('');
            ContractLoadDataHandle.loadAddFile([]);
            let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
            if (fileIds) {
                fileIds.value = "";
            }
            if (ele.getAttribute('data-store') && fileIds) {
                let dataStore = JSON.parse(ele.getAttribute('data-store'));
                ContractLoadDataHandle.$remark.val(dataStore?.['remark']);
                ContractLoadDataHandle.loadAddFile(dataStore?.['attachment_data']);
                let ids = [];
                for (let fileData of dataStore?.['attachment_data']) {
                    ids.push(fileData?.['attachment']?.['id']);
                }
                let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
                fileIds.value = ids.join(',');
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
                    data: attachmentParse,
                });
                // add event
                let inputs = ContractLoadDataHandle.$attachment[0].querySelectorAll('input[type="file"]');
                inputs.forEach((input) => {
                    input.addEventListener('change', function () {
                        let dataList = ContractLoadDataHandle.loadSetupAddFile();
                        ContractLoadDataHandle.loadAddFile(dataList);
                    });
                });
            }
            ContractLoadDataHandle.$attachment[0].removeAttribute('hidden');
        }
        if (!ContractLoadDataHandle.$drawer[0].classList.contains('open')) {
            ContractLoadDataHandle.$btnOpenAttach.trigger('click');
        }
        return true;
    };

    // FILE
    static loadAddFile(dataList) {
        if (dataList) {
            ContractDataTableHandle.$tableFile.DataTable().clear().draw();
            ContractDataTableHandle.$tableFile.DataTable().rows.add(dataList).draw();
        }
        return true;
    };

    static loadSetupAddFile() {
        let result = [];
        let is_current = true;
        let order = 1;
        for (let mediaBody of ContractLoadDataHandle.$attachment[0].querySelectorAll('.media-body')) {
            let fileName = mediaBody.querySelector('.f-item-name');
            let fileSize = mediaBody.querySelector('.f-item-info');
            let fileRemark = mediaBody.querySelector('.file-txt-remark');
            if (fileName && fileSize && fileRemark) {
                let dataAdd = {
                    'attachment': {
                        'file_name': fileName.innerHTML,
                        'file_size': parseFloat(fileSize.innerHTML.replace(" KB", "")),
                        'remarks': fileRemark.value,
                    },
                    'date_created': ContractCommonHandle.getCurrentDate(),
                    'order': order,
                    'is_current': is_current,
                };
                result.push(dataAdd);
            }
            is_current = false;
            order += 1;
        }
        return result;
    };

    static loadSetupSetCurrent(ele) {
        let result = [];
        let row = ele.closest('tr');
        let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
        if (row && fileIds) {
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                if (eleOrder.getAttribute('data-row')) {
                    let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                    let ids = $x.cls.file.get_val(fileIds.value, []);
                    let id = ids[dataRow?.['order'] - 1];
                    ids.splice(dataRow?.['order'] - 1, 1);
                    ids.unshift(id);
                    fileIds.value = ids.join(',');
                    dataRow['is_current'] = true;
                    dataRow['order'] = 1;
                    result.push(dataRow);
                    ContractCommonHandle.commonDeleteRow(row, ContractDataTableHandle.$tableFile);
                }
            }
            let order = 2;
            for (let eleOrder of ContractDataTableHandle.$tableFile[0].querySelectorAll('.table-row-order')) {
                if (eleOrder.getAttribute('data-row')) {
                    let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                    dataRow['is_current'] = false;
                    dataRow['order'] = order;
                    order += 1;
                    result.push(dataRow);
                }
            }
        }
        return result;
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
        ContractLoadDataHandle.setupDetailDocAttach(data);
        ContractDataTableHandle.$tableDocument.DataTable().rows.add(data?.['document_data']).draw();
        ContractTinymceHandle.initTinymce(data?.['tinymce_content']);
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

}

// DataTable
class ContractDataTableHandle {
    static $tableDocument = $('#datable-contract-document');
    static $tableFile = $('#datable-contract-file');

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
                        let readonly = '';
                        if (ContractLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                            readonly = 'readonly';
                        }
                        return `<input type="text" class="form-control table-row-title" value="${row?.['title'] ? row?.['title'] : ''}" required ${readonly}>`;
                    }
                },
                {
                    targets: 2,
                    class: 'text-center',
                    width: '15%',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-center">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover attach-file" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-attach-file')}" data-store="${JSON.stringify(row).replace(/"/g, "&quot;")}" data-order="${row?.['order']}"><span class="icon"><i class="fas fa-paperclip"></i></span></button>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover view-file" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-view-file')}"><span class="icon"><i class="far fa-eye"></i></span></button>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-delete')}"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                ContractLoadDataHandle.loadCssToDtb(ContractDataTableHandle.$tableDocument[0].id);
            },
        });
    };

    static dataTableFile(data) {
        ContractDataTableHandle.$tableFile.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '40%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}" hidden>${row?.['order'] ? row?.['order'] : 0}</span><span class="table-row-title" data-row="${dataRow}">${row?.['attachment']?.['file_name'] ? row?.['attachment']?.['file_name'] : ''}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '25%',
                    render: (data, type, row) => {
                        let txt = ContractLoadDataHandle.$trans.attr('data-old');
                        let badge = 'danger';
                        if (row?.['order'] === 1) {
                            txt = ContractLoadDataHandle.$trans.attr('data-current');
                            badge = 'success';
                        }
                        return `<span class="badge badge-soft-${badge} table-row-version">${txt}</span>`;
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        let date = '';
                        if (row?.['date_created']) {
                            date = moment(row?.['date_created']).format('DD/MM/YYYY')
                        }
                        return `<span class="table-row-date">${date}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    render: (data, type, row) => {
                        if (row?.['is_current'] === true) {
                            return ``;
                        }
                        let disabled = '';
                        if (ContractLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                            disabled = 'disabled';
                        }
                        return `<div class="d-flex">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover set-current" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-set-current')}" ${disabled}><span class="icon"><i class="fas fa-retweet"></i></span></button>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                ContractLoadDataHandle.loadCssToDtb(ContractDataTableHandle.$tableFile[0].id);
            },
        });
    };
}

// Store data
class ContractStoreHandle {
    static storeAttachment() {
        let dataStore = {};
        let fileData = [];
        dataStore['remark'] = ContractLoadDataHandle.$remark.val();
        let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
        if (fileIds) {
            let ids = $x.cls.file.get_val(fileIds.value, []);
            if (ids.length > 0) {
                ContractDataTableHandle.$tableFile.DataTable().rows().every(function () {
                    let row = this.node();
                    if (row.querySelector('.table-row-order')) {
                        if (row.querySelector('.table-row-order').getAttribute('data-row')) {
                            let dataRow = JSON.parse(row.querySelector('.table-row-order').getAttribute('data-row'));
                            if (!dataRow?.['id']) {
                                dataRow['attachment']['id'] = ids[dataRow?.['order'] - 1];
                                row.querySelector('.table-row-order').setAttribute('data-row', JSON.stringify(dataRow));
                            }
                            fileData.push(dataRow);
                        }
                    }
                })
            }
        }
        dataStore['attachment_data'] = fileData;
        let doc = ContractLoadDataHandle.$fileArea.attr('data-doc');
        if (doc) {
            let btnStore = ContractDataTableHandle.$tableDocument[0].querySelector(`.attach-file[data-order="${doc}"]`);
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
            let btnAttach = row.querySelector('.attach-file');
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
        ContractStoreHandle.storeAttachment();
        let dataDocParse = ContractSubmitHandle.setupDataDocument();
        _form.dataForm['document_data'] = dataDocParse?.['dataDoc'];
        _form.dataForm['attachment'] = dataDocParse?.['attachment'];
        _form.dataForm['abstract_content'] = ContractTinymceHandle.getContent('abstract_content');
        _form.dataForm['trade_content'] = ContractTinymceHandle.getContent('trade_content');
        _form.dataForm['legal_content'] = ContractTinymceHandle.getContent('legal_content');
        _form.dataForm['payment_content'] = ContractTinymceHandle.getContent('payment_content');
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

    static getCurrentDate() {
        let currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();
        return `${year}-${month}-${day}`;
    }

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