// Load data
class ContractLoadDataHandle {
    static $btnAddDoc = $('#btn-add-doc');
    static $fileArea = $('#file-area');
    static $remark = $('#contract-doc-remark');
    static $attachment = $('#attachment');
    static $trans = $('#app-trans-factory');

    // DOCUMENT
    static loadAddDoc() {
        let TotalOrder = ContractDataTableHandle.$tableDocument[0].querySelectorAll('.table-row-order').length;
        let order = TotalOrder + 1;
        let dataAdd = {
            "title": "",
            "order": order,
        }
        ContractDataTableHandle.$tableDocument.DataTable().row.add(dataAdd).draw().node();
        return true;
    };

    static loadOpenAttachFile(ele) {
        ContractDataTableHandle.$tableDocument.DataTable().rows().every(function () {
            let row = this.node();
            $(row).css('background-color', '');
        });
        let row = ele.closest('tr');
        if (row) {
            $(row).css('background-color', '#ebfcf5');
            ContractLoadDataHandle.$fileArea[0].classList.remove('bg-light');
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                ContractLoadDataHandle.$fileArea[0].setAttribute('data-doc', eleOrder.innerHTML);
            }
            ContractLoadDataHandle.$remark[0].removeAttribute('disabled');
            ContractLoadDataHandle.$remark.val('');
            ContractLoadDataHandle.loadAddFile([]);
            let uploaderResult = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-result-list');
            if (uploaderResult) {
                uploaderResult.innerHTML = "";
            }
            let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
            if (fileIds) {
                fileIds.value = "";
            }
            if (ele.getAttribute('data-store') && uploaderResult && fileIds) {
                let dataStore = JSON.parse(ele.getAttribute('data-store'));
                ContractLoadDataHandle.$remark.val(dataStore?.['remark']);
                ContractLoadDataHandle.loadAddFile(dataStore?.['attachment_data']);
                let ids = [];
                for (let fileData of dataStore?.['attachment_data']) {
                    ids.push(fileData?.['attachment']?.['id']);
                }
                let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
                fileIds.value = ids.join(',');
                let tmpUploader = row.querySelector('.tmp-uploader');
                if (tmpUploader) {
                    uploaderResult.innerHTML = tmpUploader.innerHTML;
                }
            }
            ContractLoadDataHandle.$attachment[0].removeAttribute('hidden');
            ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-results').setAttribute('hidden', 'true');
        }
        return true;
    };

    // FILE
    static loadAddFile(dataList) {
        ContractDataTableHandle.$tableFile.DataTable().clear().draw();
        ContractDataTableHandle.$tableFile.DataTable().rows.add(dataList).draw();
        return true;
    };

    static loadSetupAddFile() {
        let result = [];
        let is_current = true;
        let order = 1;
        for (let mediaBody of ContractLoadDataHandle.$attachment[0].querySelectorAll('.media-body')) {
            let fileName = mediaBody.querySelector('.f-item-name');
            let dataAdd = {
                'attachment': {
                    'file_name': fileName.innerHTML,
                },
                'date_created': ContractCommonHandle.getCurrentDate(),
                'order': order,
                'is_current': is_current,
            };
            result.push(dataAdd);
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
                        return `<input type="text" class="form-control table-row-title" value="${row?.['remark'] ? row?.['remark'] : ''}" required>`;
                    }
                },
                {
                    targets: 2,
                    class: 'text-center',
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="d-flex">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover attach-file" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-attach-file')}" data-store="" data-order="${row?.['order']}"><span class="icon"><i class="fas fa-paperclip"></i></span></button>
                                    <div class="tmp-uploader" hidden></div>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover view-file" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-view-file')}"><span class="icon"><i class="far fa-eye"></i></span></button>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-delete')}"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
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
                        if (row?.['order'] === 1) {
                            return `<span class="table-row-version">Current version</span>`;
                        }
                        return `<span class="table-row-version">Old version</span>`;
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-date">${row?.['date_created'] ? row?.['date_created'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    render: (data, type, row) => {
                        if (row?.['is_current'] === true) {
                            return `<i class="fas fa-check text-green ml-2"></i>`;
                        }
                        return `<div class="d-flex">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover set-current" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-set-current')}"><span class="icon"><i class="fas fa-retweet"></i></span></button>
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
                    let eleOrder = row.querySelector('.table-row-order');
                    let eleTitle = row.querySelector('.table-row-title');
                    let eleDate = row.querySelector('.table-row-date');
                    if (eleOrder && eleTitle && eleDate) {
                        let is_current = false;
                        if (eleOrder.innerHTML === '1') {
                            is_current = true;
                        }
                        fileData.push({
                            'attachment': {
                                'id': ids[parseInt(eleOrder.innerHTML) - 1],
                                'file_name': eleTitle.innerHTML,
                            },
                            'date_created': eleDate.innerHTML,
                            'order': parseInt(eleOrder.innerHTML),
                            'is_current': is_current,
                        })
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
                let row = btnStore.closest('tr');
                if (row) {
                    let uploaderResult = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-result-list');
                    let tmpUploader = row.querySelector('.tmp-uploader');
                    if (uploaderResult && tmpUploader) {
                        tmpUploader.innerHTML = uploaderResult.innerHTML;
                    }
                }
            }
        }
        return true;
    };
}

// Submit Form
class ContractSubmitHandle {
    static setupDataDocument() {
        let result = [];
        ContractDataTableHandle.$tableDocument.DataTable().rows().every(function () {
            let row = this.node();
            let eleOrd = row.querySelector('.table-row-order');
            let eleTitle = row.querySelector('.table-row-title');
            let btnAttach = row.querySelector('.attach-file');
            if (eleOrd && eleTitle && btnAttach) {
                let remark = '';
                let attachment_data = [];
                let attachment = [];
                if (btnAttach.getAttribute('data-store')) {
                    let dataStore = JSON.parse(btnAttach.getAttribute('data-store'));
                    attachment_data = dataStore?.['attachment_data'];
                    for (let attach of dataStore?.['attachment_data']) {
                        attachment.push(attach?.['attachment']?.['id']);
                    }
                }
                result.push({
                    'title': eleTitle.value,
                    'remark': ContractLoadDataHandle.$remark.val(),
                    'attachment': attachment,
                    'attachment_data': attachment_data,
                    'order': parseInt(eleOrd.innerHTML),
                })
            }
        });
        return result
    };

    static setupDataSubmit(_form) {
        let dataDocument = ContractSubmitHandle.setupDataDocument();
        if (dataDocument.length > 0) {
            _form.dataForm['document_data'] = dataDocument;
        }
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
        return `${day}/${month}/${year}`;
    }

    static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }

}

class ContractTinymceHandle{
    static initTinymce() {
        tinymce.init({
            selector: 'textarea#inp-contents',
            plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
            imagetools_cors_hosts: ['picsum.photos'],
            menubar: false,
            toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
            toolbar_sticky: true,
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: true,
            link_list: [
                {title: 'My page 1', value: 'http://www.tinymce.com'},
                {title: 'My page 2', value: 'http://www.moxiecode.com'}
            ],
            image_list: [
                {title: 'My page 1', value: 'http://www.tinymce.com'},
                {title: 'My page 2', value: 'http://www.moxiecode.com'}
            ],
            image_class_list: [
                {title: 'None', value: ''},
                {title: 'Some class', value: 'class-name'}
            ],
            importcss_append: true,
            file_picker_callback: function (callback, value, meta) {
                /* Provide file and text for the link dialog */
                if (meta.filetype === 'file') {
                    callback('https://www.google.com/logos/google.jpg', {text: 'My text'});
                }

                /* Provide image and alt text for the image dialog */
                if (meta.filetype === 'image') {
                    callback('https://www.google.com/logos/google.jpg', {alt: 'My alt text'});
                }

                /* Provide alternative source and posted for the media dialog */
                if (meta.filetype === 'media') {
                    callback('movie.mp4', {source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg'});
                }
            },
            templates: [
                {
                    title: 'New Table',
                    description: 'creates a new table',
                    content: '<div class="mceTmpl"><table width="98%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>'
                },
                {title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...'},
                {
                    title: 'New list with dates',
                    description: 'New List with dates',
                    content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>'
                }
            ],
            template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
            template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
            height: 400,
            image_caption: true,
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            noneditable_noneditable_class: 'mceNonEditable',
            toolbar_mode: 'sliding',
            contextmenu: 'link image imagetools table',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        });
    }
}