// naming convention:  [...] + selector = $(...)

let transScript = $('#trans-script')

class ConsultingHandler{
    constructor(){
        this.consultingName = $('#consulting-name')
        this.consultingDate = $('#consulting-date')
        this.consultingValue = $('#consulting-value')
        this.btnAddProductCategory = $('#btn-add-product-category')
        this.btnOpendocModal = $('#btn-open-document-modal')
        this.tableProductCategories = $('#datatable-product-categories')
        this.customerSelect = $('#consulting-customer-select')
        this.abstractContent = 'inp-contents'
        this.urlScript = $('#url-script')
        this.docDataScript = $('#doc-data-script')
        this.tableMasterDoc = $('#document-modal-table')
        this.tableManualDoc = $('#document-modal-table-manual')
        this.btnAddManualDoc = $('#btn-add-document-manual')
        this.btnAddDoc = $('#btn-add-document')

        this.tableDoc = $('#datatable-document')

        this.fileArea = $('#file-area')
        this.remark = $('#doc-remark')
        this.attachment = $('#attachment')
        this.attachmentTmp = $('#attachment-tmp')

        this.submitForm = $('#form_consulting_create')

        this.opp = $('#opportunity_id')

    }

    // ------Common------
    /**
     * @param {any} selectFieldSelector The selected field selector
     * @param {Object} key The object key
     * @param {[Object]} data initial data
     * @param {string} key.keyResp The response text
     * @param {string} key.keyId The ID key
     * @param {string} key.keyText The text key
     * @desc fetching data for 'select' element
     */
    fetchDataSelect(selectFieldSelector, key, data=[]){
        selectFieldSelector.initSelect2({
            ajax: {
                url: selectFieldSelector.attr('data-url'),
                method: 'GET',
            },
            keyResp: key.keyResp,
            keyId: key.keyId,
            keyText: key.keyText,
            data: data,
            templateResult: function (state) {
                const title = state.text || "_";
                return $(`
                    <div class="row">
                        <div class="col-12">${title}</div>
                    </div>
                    `);
            },
        })
    }

    /**
     * @param {HTMLElement} selectedRow The row element
     * @param {any} tableSelector The table selector
     * @desc delete selected row from the table
     */
    deleteRow(selectedRow, tableSelector){
        let rowIndex = tableSelector.DataTable().row(selectedRow).index();
        let row = tableSelector.DataTable().row(rowIndex);
        row.remove().draw();
    }

    /**
     * @param {any} tableSelector The table selector
     * @desc re-order table
     */
    reOrderTable(tableSelector){
        let itemCount = tableSelector.find('.table-row-order').length;
        if (itemCount === 0) {
            tableSelector.DataTable().clear().draw();
        } else {
            let order = 1;
            for (let eleOrder of tableSelector.find('.table-row-order')) {
                if ($(eleOrder).data('row')) {
                    let dataRow = $(eleOrder).data('row')
                    dataRow['order'] = order;
                }
                $(eleOrder).text(order)
                order++
                if (order > itemCount) {
                    break;
                }
            }
        }
    }

    /**
     * @param {any} tableSelector The table selector
     * @param {object} dataAdd The data for this row
     * @desc init new row for datatable
     */
    initNewRow(tableSelector, dataAdd){
        let totalOrder = tableSelector.find('.table-row-order').length;
        dataAdd['order'] = totalOrder + 1;
        tableSelector.DataTable().row.add(dataAdd).draw().node();
    }

    /**
     * @desc Returns the current date in the format 'YYYY-MM-DD'.
     * @return {string} The current date as a string.
     */
    getCurrentDate(){
        let currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();
        return `${year}-${month}-${day}`;
    }

    /**
     * @param {any} tableSelector The table selector
     * @param {string} uniqueIdentifier The string for identify which row to uncheck
     * @example uncheckRow($("#id"), `data-id="uniqueId"`)
     * @desc uncheck selected rows
     */
    uncheckRow(tableSelector, uniqueIdentifier){
        let checkbox = tableSelector.find(`input[type="checkbox"][${uniqueIdentifier}]`);
        if (checkbox.length) {
            checkbox.prop('checked', false);
        }
    }

    /**
     * @param {[any]} selectorList The field selector list
     * @desc disabled selected fields
     */
    disableFields(selectorList) {
        selectorList.forEach(selector => {
            if (selector instanceof jQuery) {
                selector.attr('disabled', true);
            }
        });
    }

    // ------Attachment field------
    /**
     * @desc Init attachment UI
     */
    initAttachment(){
         new $x.cls.file($('#attachment')).init({
            name: 'attachment',
            enable_edit: true,
        });
    }

    // ------Date field------
    /**
     * @param {any} dateSelector The date field selector
     * @desc method for init date field
     */
    initDateField(dateSelector){
        dateSelector.each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD-MM-YYYY'));
            });
            $(this).val('').trigger('change');
        })
    }

    // ------Abstract content------
    /**
     * @param {string} htmlContent The abstract field content. Default = ''
     * @desc method for init abstract field
     */
    initAbstractField(htmlContent){
        this.initTinymce(htmlContent)
    }

    /**
     * @desc Init tinymce UI
     */
    initTinymce(htmlContent = ''){
        tinymce.init({
            selector: `textarea#inp-contents`,
            plugins: 'paste importcss autolink autosave save directionality code visualblocks visualchars fullscreen lists',
            menubar: false,  // Hide the menubar
            toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | numlist bullist | removeformat',
            toolbar_sticky: true,
            autosave_ask_before_unload: false,
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
    }

    getContent(){
        return tinymce.get(this.abstractContent).getContent();
    }

    // ------Total Value------
    /**
     * @param {any} tableSelector The table selector
     * @param {any} valueSelector The value field selector
     * @desc Calculate sum and init data to the value field
     */
    initTotalValue(tableSelector, valueSelector){
        let valueList = tableSelector.find('.table-row-value')
        let sum = 0
        for (let valueItem of valueList){
            let value = parseFloat($(valueItem).attr('value')) || 0
            sum += value
        }
        valueSelector.attr('value', sum).focus().blur()
    }

    // ------Product Categories Handler------
    /**
     * @param {any} addBtnSelector The add btn field selector
     * @param {any} tableSelector The table selector
     * @desc add event listener for btn add product category
     */
    handleAddProductCategory(addBtnSelector, tableSelector){
        addBtnSelector.on('click', ()=>{
            this.initNewRow(tableSelector, {
                'title': '',
            })
        })
    }

    /**
     * @param {any} tableSelector The table selector
     * @param {any} valueSelector The value selector
     * @desc add event listener for btn delete product category
     */
    handleDeleteProductCategory(tableSelector, valueSelector){
        tableSelector.on('click', '.del-row', (e)=>{
            Swal.fire({
                html: `<div class="mb-3">
                            <i class="fas fa-trash-alt text-primary"></i>
                       </div>
                       <h6 class="text-primary">
                            Do you want to delete this row?
                       </h6>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-primary',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg'
                },
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    this.deleteRow(e.currentTarget.closest('tr'), tableSelector)
                    this.reOrderTable(tableSelector)
                    this.initTotalValue(tableSelector, valueSelector)
                }
            })
        })
    }

    // ------Product Categories Init------
    /**
     * @param {any} tableSelector The table selector
     * @param {[object]} data The data for table, default = []
     * @param {[object]} valueSelector
     * @param isDetail
     * @desc init datatable product categories
     */
    initTableProductCategories(tableSelector, data=[], valueSelector, isDetail){
        tableSelector.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row?.['order'] ? row?.['order'] : 0}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '55%',
                    render: (data, type, row) => {
                        let prodCateUrl = this.urlScript.data('url-product-category');
                        let defaultOption = row['product_category']
                            ? `<option value="${row['product_category']}">${row['title']}</option>`
                            : ``;

                        return `<select name="product_category_${row.order}"  class="form-select select2 product-select" data-method="GET" data-url=${prodCateUrl} required>
                                    ${defaultOption}
                                </select>`;
                    }
                },
                {
                    targets: 2,
                    width: '30%',
                    render: (data, type, row) => {
                        return `<input type="text"  name="product_value_${row.order}"  class="form-control table-row-value mask-money required" value="${row?.['value'] ? row?.['value'] : ''}" required>`;
                    }
                },
                {
                    targets: 3,
                    class: 'text-center',
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-center">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title=""><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                </div>`;
                    }
                },
            ],
            drawCallback:() => {
                $('.product-select').each((_, element) => {
                    this.fetchDataSelect($(element), {
                        keyResp: 'consulting_product_category_list',
                        keyId: 'id',
                        keyText: 'title'
                    });
                });
                tableSelector.on('focusout', '.table-row-value', () => {
                    this.initTotalValue(tableSelector, valueSelector);
                });
                tableSelector.on('change', '.product-select', (e) => {
                    let selectedValues = [];
                    let duplicate = false;

                    // Collect selected values
                    $('.product-select').each((_, el) => {
                        let val = $(el).val();
                        if (val && selectedValues.includes(val)) {
                            duplicate = true;
                        }
                        selectedValues.push(val);
                    });

                    // Prevent duplicate selection
                    if (duplicate) {
                        $.fn.notifyB({description: transScript.data('product-already-selected')}, 'failure');
                        $(e.currentTarget).empty() // Reset the current selection
                    }
                });
            },
            initComplete: ()=>{
                $.fn.initMaskMoney2()
                if (isDetail) {
                    tableSelector.find('select, input, button.del-row').attr('disabled', true);
                }
            }
        })
    }

    // ------Document Handle------
    /**
     * @param {any} addBtnSelector The add manual doc btn field selector
     * @param {any} tableSelector The table selector
     * @desc add event listener for btn init new manual document
     */
    handleAddNewRowManualDoc(addBtnSelector, tableSelector){
        addBtnSelector.on('click', ()=>{
            let totalOrder = tableSelector.find('.table-row-order').length;
             this.initNewRow(tableSelector, {
                 'id': totalOrder+'manual',
                'title': '',
            })
        })
    }

    /**
     * @param {any} addBtnSelector The add-all-doc btn field selector
     * @return {boolean|void}
     * @desc add event listener for btn add all document
     */
    handleAddDoc(addBtnSelector) {
        addBtnSelector.on('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            let data = [];
            let dataDocList = JSON.parse(this.docDataScript.attr('data-doc-list') || '[]');

            // Handle Master Documents
            let masterDocData = this.getDocFromTableMasterDoc(dataDocList)
            data = [...data, ...masterDocData]

            // Handle Manual Documents
            let manualDocReturnObj = this.getDocFromTableManualDoc(dataDocList)
            let manualDocData = manualDocReturnObj["data"]
            if (manualDocReturnObj['isErrorValidate']) {
                return; // Stop further execution if an error occurred
            } else {
                data = [...data, ...manualDocData]
            }

            // Initialize documents if no error occurred
            this.initDoc(data);

            // Close modal
            $('#modal-document').modal('hide')
        });
    }

    /**
     * @param {[object]} dataDocList The doc-data from doc-data-script
     * @return {[object]} An array of objects with the document details.
     * @desc get data from table master document
     */
    getDocFromTableMasterDoc(dataDocList){
        let data = []
        this.tableMasterDoc.find('.form-check-checkbox:checked').each(function () {
            let selectedRow = $(this).closest("tr");
            let document_type = $(this).data('id');
            let attachmentData = [];

            let dataDocListRowData = dataDocList.find(item => item?.['document_type'] === document_type)
            if (dataDocListRowData){
                data.push({
                    ...dataDocListRowData
                })
            } else {
                data.push({
                    "document_type": document_type,
                    "title": selectedRow.find(".table-row-title").text(),
                    "attachment_data": attachmentData,
                    "isManual": false
                });
            }

        });
        return data
    }

    /**
      * @param {[object]} dataDocList The list of document data.
      * @desc Fetches data for 'select' elements in the manual document table.
      * @return {{data: [object], isErrorValidate: boolean}}
      *         An object containing:
      *         - `data`: An array of objects with the document details.
      *         - `isErrorValidate`: A boolean indicating if a validation error occurred.
     */
    getDocFromTableManualDoc(dataDocList){
        let errorOccurred = false;
        let data = []
        this.tableManualDoc.find('.form-check-checkbox:checked').each(function () {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('row-id');
            let titleField = selectedRow.find(".table-row-title");
            let title = titleField.val();
            let attachmentData = [];

            // Remove existing error message if any
            titleField.next(".error-message").remove();

            if (!title || title.trim() === "") {
                errorOccurred = true;
                titleField.addClass('is-invalid');
                let errMsg = transScript.data('field-required')
                titleField.after(`<small class="text-danger error-message">${errMsg}</small>`); // Add error message
                return {
                    data: [],
                    isErrorValidate: errorOccurred
                };
            } else {
                titleField.removeClass('is-invalid'); // Clear invalid state
            }

            let dataDocListRowData = dataDocList.find(item => item?.['id'] === id)
            if (dataDocListRowData){
                data.push({
                    ...dataDocListRowData
                })
            } else {
                data.push({
                    "id": id,
                    "title": title,
                    "attachment_data": attachmentData,
                    "isManual": true
                });
            }

        });
        return {
            data: data,
            isErrorValidate: errorOccurred
        }
    }

     /**
      * @param {any} tableSelector The table selector
      * @param {any} masterdataTableSelector The masterdata doc table selector
      * @param {any} manualTableSelector The manual doc table selector
      * @desc add event handler for delete doc button
     */
    handleDeleteDoc(tableSelector, masterdataTableSelector, manualTableSelector){
        tableSelector.on('click', '.del-row', (e)=>{
            Swal.fire({
                html: `<div class="mb-3">
                            <i class="fas fa-trash-alt text-primary"></i>
                       </div>
                       <h6 class="text-primary">
                            Do you want to delete this row?
                       </h6>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-primary',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg'
                },
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    let row = $(e.currentTarget).closest('tr');
                    let rowData = tableSelector.DataTable().row(row).data();
                    if (rowData.isManual) {
                        this.uncheckRow(manualTableSelector, `data-row-id="${rowData.id}"`)
                    } else {
                        this.uncheckRow(masterdataTableSelector, `data-id="${rowData.document_type}"`)
                    }
                    this.deleteRow(e.currentTarget.closest('tr'), tableSelector)
                    this.reOrderTable(tableSelector)
                }
            })
        })
    }

    // ------Document init------
    /**
      * @param {[object]} data The initial data.
      * @desc Init document data when add new doc for table document
     */
    initDoc(data){
        let dataDocList = JSON.parse(this.docDataScript.attr('data-doc-list') || '[]')
        this.tableDoc.DataTable().clear().draw();
        for (const dataRow of data) {
            let TotalOrder = this.tableDoc.find('.table-row-order').length;
            dataRow.order = TotalOrder + 1;
            this.tableDoc.DataTable().row.add(dataRow).draw().node();
            if(dataRow.isManual){
                if (!dataDocList.find(item => item?.['id'] === dataRow.id)){
                    dataDocList.push(dataRow);
                }
            } else {
                if (!dataDocList.find(item => item?.['document_type'] === dataRow?.['document_type'])){
                    dataDocList.push(dataRow);
                }
            }
        }

        this.docDataScript.attr('data-doc-list',JSON.stringify(dataDocList))
    }

    /**
     * @param {any} tableSelector The table selector
     * @param {[object]} data The initial data.
     * @desc Init document master data for table masterdata document
     */
    initTableMasterDataDoc(tableSelector, data=[]){
        let checkedMasterDoc = data ? data.filter(item => item.isManual === false) : []
        tableSelector.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: this.urlScript.data('url-masterdatadoc'),
                type: "GET",
                data: {doc_type_category: 'consulting'},
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('consulting_document_masterdata_list')) {
                        return resp.data['consulting_document_masterdata_list'] ? resp.data['consulting_document_masterdata_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            scrollY: '30vh',
            scrollX: true,
            scrollCollapse: true,
            ordering: false,
            paging: false,
            columns: [
                {
                    targets: 0,
                    width: '10%',
                    class: 'text-center',
                    render: (data, type, row) => {
                        let checked = checkedMasterDoc.find(item=>item.document_type===row.id) ? 'checked' : ''
                        return `<input type="checkbox" class="form-check-checkbox table-row-order" data-id=${row?.id} ${checked}>`;
                    }
                },
                {
                    targets: 1,
                    width: '90%',
                    render: (data, type, row) => {
                        return `<div class="table-row-title">${row.title}</div>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb

            },
        })
    }

    /**
     * @param {any} tableSelector The table selector
     * @param {[object]} data The initial data.
     * @desc Init document manual data for table manual document
     */
    initTableManualDataDoc(tableSelector, data=[]){
        let manualData = data ? data.filter(item => item.isManual === true) : []
        tableSelector.DataTableDefault({
            data: manualData ? manualData : [],
            scrollY: '30vh',
            scrollX: true,
            scrollCollapse: true,
            ordering: false,
            paging: false,
            columns: [
                {
                    targets: 0,
                    width: '10%',
                    class: 'text-center',
                    render: (data, type, row) => {
                        return `<input type="checkbox" class="form-check-checkbox table-row-order" data-row-id=${row?.id} checked>`;
                    }
                },
                {
                    targets: 1,
                    width: '90%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-title required" value="${row?.['title'] ? row?.['title'] : ''}">`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
            },
        })
    }

    /**
     * @param {any} tableSelector The table selector
     * @param {[object]} data The initial data.
     * @param {boolean} isDetail If the current page is page detail, isDetail = true
     * @desc Init document data for table document
     */
    initTableDoc(tableSelector, data=[], isDetail){
        tableSelector.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row?.order}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '75%',
                    render: (data, type, row) => {
                        return `<div class="table-row-title">${row.title}</div>`;
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    class: 'text-center',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-center">
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover attach-file" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom" 
                                        data-store="${JSON.stringify(row).replace(/"/g, "&quot;")}" 
                                        data-order="${row?.['order']}"
                                        data-id = "${row?.['id']}"
                                        data-doctype-id="${row?.document_type}"
                                        data-is-manual=${row?.isManual}
                                    >
                                            <span class="icon"><i class="fas fa-paperclip"></i></span>
                                    </button>
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom"
                                    >
                                        <span class="icon"><i class="far fa-trash-alt"></i></span>
                                    </button>
                                </div>`;
                    }
                },
            ],
            initComplete: ()=>{
                if (isDetail) {
                    tableSelector.find('button.del-row').attr('disabled', true);
                }
            }
        })
    }

    // ------File Handle------
    /**
     * @param {any} tableSelector The table selector
     * @param {boolean} isDetail If the current page is page detail, isDetail = true
     * @desc Init document data for table document
     */
    handleAttachFile(tableSelector, isDetail){
        tableSelector.on('click', '.attach-file',  (e)=> {
            let dataStoreFields = {
                fileArea: this.fileArea,
                remark: this.remark,
                attachment: this.attachment,
                attachmentTmp: this.attachmentTmp
            }
            this.storeCurrentAttachments(tableSelector, dataStoreFields)
            this.loadAttachment(tableSelector, e.currentTarget, isDetail, dataStoreFields)
        })
    }

    /**
     * @param {any} tableSelector The table selector
     * @param {Object} dataStoreFields Fields that will be stored
     * @desc Save the current document data to the btn HTMLElement and to doc-data-script
     */
    storeCurrentAttachments(tableSelector, dataStoreFields){
        let docId = dataStoreFields.fileArea.attr('doc-id');
        let dataStore = {};
        let fileData = [];
        dataStore['remark'] = dataStoreFields.remark.val();
        let fileIds = dataStoreFields.attachment.find('.dm-uploader-ids')
        if(fileIds){
            let ids = $x.cls.file.get_val(fileIds.val(), []).slice().reverse()
            if(ids.length>0){
                let order = 1;
                for (let mediaBody of this.attachment.find('.media-body')) {
                    let $mediaBody = $(mediaBody);
                    let fileName = $mediaBody.find('.f-item-name');
                    let fileSize = $mediaBody.find('.f-item-info');
                    let fileRemark = $mediaBody.find('.file-txt-remark');
                    if (fileName && fileSize && fileRemark) {
                        let dataAdd = {
                            'attachment': {
                                'id': ids[order - 1],
                                'file_name': fileName.text(),
                                'file_size': parseFloat(fileSize.text().replace(" KB", "")),
                                'remarks': fileRemark.val(),
                            },
                            'date_created': this.getCurrentDate(),
                            'order': order,
                        };
                        fileData.push(dataAdd);
                    }
                    order += 1;
                }
            }
        }
        dataStore['attachment_data'] = fileData;
        let btnStore = null
        let isManual = dataStoreFields.fileArea.attr('doc-is-manual');
        let dataDocList = JSON.parse(this.docDataScript.attr('data-doc-list') || '[]')
        if(isManual==='false'){
           let doc_data = dataDocList.find(item => item.document_type === docId)
            if(doc_data){
                doc_data['attachment_data'] = fileData
            }
            btnStore = tableSelector.find(`.attach-file[data-doctype-id="${docId}"]`);
            if (btnStore.length>0) {
                btnStore.attr('data-store', JSON.stringify(dataStore));
            }
        } else if (isManual==='true'){
            let doc_data = dataDocList.find(item => item.id === docId)
            if(doc_data){
                doc_data['attachment_data'] = fileData
            }
            btnStore = tableSelector.find(`.attach-file[data-id="${docId}"]`);
            if (btnStore.length>0) {
                btnStore.attr('data-store', JSON.stringify(dataStore));
            }
        }

        this.docDataScript.attr('data-doc-list',JSON.stringify(dataDocList))
    }

    /**
     * @param {any} tableSelector The table selector
     * @param {HTMLElement} element The current button element
     * @param {boolean} isDetail If the current page is page detail, isDetail = true
     * @param {Object} dataStoreFields Fields that will be stored
     * @desc Load the current document data from the btn HTMLElement to the UI
     */
    loadAttachment(tableSelector, element, isDetail=false, dataStoreFields){
        tableSelector.DataTable().rows().every(function () {
            let row = this.node();
            $(row).css('background-color', '');
        });
        let row = element.closest('tr');
        if(row){
            $(row).css('background-color', '#ebfcf5');
            dataStoreFields.fileArea.removeClass('bg-light');
            let isManual = $(row).find('.attach-file').data('is-manual')
            let eleId = ''
            if (isManual===false){
                eleId = $(row).find('.attach-file').attr('data-doctype-id');
            } else {
                eleId = $(row).find('.attach-file').attr('data-id');
            }
            dataStoreFields.fileArea.attr('doc-id', eleId);
            dataStoreFields.fileArea.attr('doc-is-manual', isManual);
            dataStoreFields.remark.prop('readonly',false);
            dataStoreFields.remark.val('');
            let fileIds = dataStoreFields.attachment.find('.dm-uploader-ids')
            if (fileIds) {
                fileIds.val('')
            }
            if($(element).attr('data-store') && fileIds){
                let dataStore = JSON.parse($(element).attr('data-store'));
                dataStoreFields.remark.val(dataStore?.['remark']);
                let ids = [];
                for (let fileData of dataStore?.['attachment_data']) {
                    ids.push(fileData?.['attachment']?.['id']);
                }
                fileIds = dataStoreFields.attachment.find('.dm-uploader-ids')
                fileIds.val(ids.join(','))
                let attachmentParse = [];
                for (let attachData of dataStore?.['attachment_data']) {
                    attachmentParse.push(attachData?.['attachment']);
                }
                dataStoreFields.attachment.empty().html(`${dataStoreFields.attachmentTmp.html()}`);
                // init file again
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: !isDetail,
                    enable_download: !isDetail,
                    data: attachmentParse,
                });
            }
            dataStoreFields.attachment.removeAttr('hidden');
        }
    }

    /**
     * @param {any} btnSelector The btn field selector
     * @param {any} tableSelector The table selector
     * @desc Store current doc data before open the modal
     */
    handleOpenDocModal(btnSelector, tableSelector){
        btnSelector.on('change', ()=>{
            let dataStoreFields = {
                fileArea: this.fileArea,
                remark: this.remark,
                attachment: this.attachment,
                attachmentTmp: this.attachmentTmp
            }
            this.storeCurrentAttachments(tableSelector, dataStoreFields)
        })
    }

    // ------Opp Init------
    /**
     * @desc Init opp
     */
    initOpp(){
        let {
            opp_id,
            opp_title,
            opp_code,
            process_id,
            process_title,
            process_stage_app_id,
            process_stage_app_title,
            inherit_id,
            inherit_title
        } = $x.fn.getManyUrlParameters([
            'opp_id', 'opp_title', 'opp_code',
            'process_id', 'process_title',
            'process_stage_app_id', 'process_stage_app_title',
            'inherit_id', 'inherit_title'
        ])
        let initBastionField=()=>{
            new $x.cls.bastionField({
            data_opp: $x.fn.checkUUID4(opp_id) ? [
                {
                    "id": opp_id,
                    "title": $x.fn.decodeURI(opp_title),
                    "code": $x.fn.decodeURI(opp_code),
                    "selected": true,
                }
            ] : [],
            data_process: $x.fn.checkUUID4(process_id) ? [
                {
                    "id": process_id,
                    "title": process_title,
                    "selected": true,
                }
            ] : [],
            data_process_stage_app: $x.fn.checkUUID4(process_stage_app_id) ? [
                {
                    "id": process_stage_app_id,
                    "title": process_stage_app_title,
                    "selected": true,
                }
            ] : [],
            data_inherit: $x.fn.checkUUID4(inherit_id) ? [
                {
                    "id": inherit_id,
                    "full_name": inherit_title,
                    "selected": true,
                }
            ] : [],
            "inheritFlagData": {"disabled": false, "readonly": false},
        }).init();
        }
        if (opp_id){
            let currOpp = this.opp.val()
            let urlDetail = this.urlScript.data('url-oppdetail').format_url_with_uuid(opp_id);
            $.fn.callAjax2({
                url: urlDetail,
                method: 'GET',
                isLoading: false,
            })
                .then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                         this.customerSelect.empty();

                        this.fetchDataSelect(this.customerSelect, {
                            keyResp: 'consulting_account_list',
                            keyId: 'id',
                            keyText: 'name'
                        }, [{id: data['customer']['id'], name: data['customer']['title']}])
                        this.customerSelect.prop('disabled', true);
                        if(!process_id){
                            process_id=data['process']['id']
                            process_title= data['process']['title']
                            process_stage_app_id=data['process_stage_app']['id']
                            process_stage_app_title= data['process_stage_app']['title']
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error fetching opportunity details:", error);
                }).finally(() => {
                    initBastionField();
                });
        } else {
            initBastionField();
        }
    }


    /**
     * @param {any} customerSelector The customer select field selector
     * @param {any} oppSelector The opp field selector
     * @desc add event listener for select opp
     */
    handleSelectOpp(customerSelector, oppSelector) {
        oppSelector.on('change', () => {
            let currOpp = this.opp.val()
            if (currOpp) {
                let dataSelected = SelectDDControl.get_data_from_idx(this.opp, $(this.opp).val());
                if (dataSelected) {
                    customerSelector.empty();
                    this.fetchDataSelect(customerSelector, {
                        keyResp: 'consulting_account_list',
                        keyId: 'id',
                        keyText: 'name'
                    }, [{id: dataSelected['customer']['id'], name: dataSelected['customer']['title']}])
                }
                customerSelector.prop('disabled', true);
            } else {
                customerSelector.empty();
                customerSelector.prop('disabled', false);
                customerSelector.trigger('change');
            }
        })
    }

    // ------Data submit handler------
    handleSubmitForm(formSubmit){
        SetupFormSubmit.call_validate(formSubmit, {
             rules: {
                'product_category_\\d+': {
                    required: true
                },
                'product_value_\\d+': {
                    required: true
                }
            },
            messages: {
                'product_category_\\d+': "Please select a product category.",
                'product_value_\\d+': "This value is required."
            },
            onsubmit: true,
            submitHandler:  (form, event)=> {
                 if (!this.consultingValue.attr('value') || this.consultingValue.attr('value').trim() === "") {
                    // Show validation error
                    $.fn.notifyB({ description: "Total value is required." }, "failure");
                    return;
                }
                let _form = new SetupFormSubmit(formSubmit);
                this.setupDataSubmit(_form)
                let submitFields = [
                    'opportunity',
                    'employee_inherit',
                    'title',
                    'attachment',
                    'document_data',
                    'due_date',
                    'value',
                    'abstract_content',
                    'customer',
                    'product_categories',
                    'process',
                    'process_stage_app'
                ]
                if (_form.dataForm) {
                    this.filterFieldList(submitFields, _form.dataForm);
                }

                WFRTControl.callWFSubmitForm(_form)

            },
        })
    }

    setupDataSubmit(_form){
        let dataStoreFields = {
                fileArea: this.fileArea,
                remark: this.remark,
                attachment: this.attachment,
                attachmentTmp: this.attachmentTmp
            }
        this.storeCurrentAttachments(this.tableDoc, dataStoreFields)
        let dataDocParse = this.getDataDoc(this.tableDoc)
        _form.dataForm['document_data'] = dataDocParse?.['document_data'];
        _form.dataForm['attachment'] = dataDocParse?.['attachment'];
        _form.dataForm['product_categories'] = this.getDataCategories(this.tableProductCategories)
        _form.dataForm['product_categories_total_number'] = _form.dataForm['product_categories']?.length
        _form.dataForm['value'] = this.getConsultingValue(this.consultingValue)
        _form.dataForm['abstract_content'] = this.getContent();
        let tmpDate = _form.dataForm['due_date']
        _form.dataForm['due_date'] = tmpDate.split('-').reverse().join('-')
        _form.dataForm['opportunity'] = _form.dataForm['opportunity_id']
        delete _form.dataForm['opportunity_id']
        _form.dataForm['employee_inherit'] = _form.dataForm['employee_inherit_id']
        delete _form.dataForm['employee_inherit_id']
        return _form
    }

    getDataDoc(tableSelector){
        let result = [];
        let attachmentAll = [];
        tableSelector.DataTable().rows().every(function(){
            let rowData = this.data();
            let row = $(this.node());
            let eleOrd = row.find('.table-row-order');
            let eleTitle = row.find('.table-row-title');
            let btnAttach = row.find('.attach-file');
            let isManual= rowData.isManual
            let document_type_id = !isManual ? rowData.document_type : null
            let remark = ''
            if (eleOrd && eleTitle && btnAttach) {
                let attachment_data = [];
                if (btnAttach.attr('data-store')) {
                    let dataStore = JSON.parse(btnAttach.attr('data-store'));
                    remark = dataStore['remark']
                    attachment_data = dataStore?.['attachment_data'];
                    for (let attach of dataStore?.['attachment_data']) {
                        attachmentAll.push(attach?.['attachment']?.['id']);
                    }
                }
                result.push({
                    'title': eleTitle.text(),
                    'remark':remark,
                    'document_type': document_type_id,
                    'attachment_data': attachment_data,
                    'order': parseInt(eleOrd.text()),
                    'isManual': isManual
                })
            }
        })
        return {'document_data': result, 'attachment': attachmentAll}
    }

    getDataCategories(tableSelector){
        let result=[]
        tableSelector.DataTable().rows().every(function(){
            let row = $(this.node());
            let eleOption = row.find('.product-select');
            let eleValueInput = row.find('input[type="text"]')
            let eleOrd = row.find('.table-row-order')
            let title = "";
            if (eleOption.val()) {
                let data = SelectDDControl.get_data_from_idx(eleOption, eleOption.val());
                if (data) {
                    title = data?.['title'] ? data?.['title'] : '';
                }
            }
            if (eleOption && eleValueInput) {
                result.push({
                    'product_category': eleOption.val(),
                    'value': eleValueInput.valCurrency(),
                    'order': parseInt(eleOrd.text()),
                    'title': title,
                })
            }

        })
        return result

    }

    getConsultingValue(valueSelector){
        return valueSelector.attr('value')
    }

    filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }

    // ------Data Detail Page------
    /**
     * @param {[any]} data The initial data
     * @param {boolean} isDetail is detail page?
     * @desc add event listener for select opp
     */
    fetchPageData(data, isDetail) {
        new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            has_process: true,
            has_prj: true,
            data_opp: data?.['opportunity']?.['id'] ? [
                {
                    "id": data?.['opportunity']?.['id'],
                    "title": data?.['opportunity']?.['title'] || '',
                    "code": data?.['opportunity']?.['code'] || '',
                    "selected": true,
                }
            ] : [],
            data_process: data?.['process']?.['id'] ? [
                {
                    "id": data?.['process']?.['id'],
                    "title": data?.['process']?.['title'] || '',
                    "selected": true,
                }
            ] : [],
            data_process_stage_app: data?.['process_stage_app']?.['id'] ? [
                {
                    "id": data?.['process_stage_app']?.['id'],
                    "title": data?.['process_stage_app']?.['title'] || '',
                    "selected": true,
                }
            ] : [],
            data_inherit: data?.['employee_inherit']?.['id'] ? [
                {
                    "id": data?.['employee_inherit']?.['id'],
                    "full_name": data?.['employee_inherit']?.['full_name'] || '',
                    "code": data?.['employee_inherit']?.['code'] || '',
                    "selected": true,
                }
            ] : [],
            "oppFlagData": {"disabled": true},
            "prjFlagData": {"disabled": true},
            "inheritFlagData": {"disabled": true},
            "processFlagData": {"disabled": true},
            "processStageAppFlagData": {"disabled": true},
        }).init();

        this.consultingName.val(data?.['title'])
        this.customerSelect.empty();
        this.fetchDataSelect(this.customerSelect, {
            keyResp: 'consulting_account_list',
            keyId: 'id',
            keyText: 'name'
        }, [{id: data['customer']['id'], name: data['customer']['title']}])
        if(data?.['opportunity']?.['id']){
            this.customerSelect.prop('disabled', true);
        }

        this.consultingDate.each(function () {
            let dateData = data?.['due_date'];
            if (dateData) {
                dateData = $x.fn.reformatData(
                    dateData,
                    $x.cls.datetime.defaultFormatDate,
                    'DD-MM-YYYY',
                    moment().format('DD-MM-YYYY')
                );
            }
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                autoApply: true,
                autoUpdateInput: false,
                startDate: dateData || moment(), // Default to dateData or current date
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('YYYY-MM-DD'));
            }).on('show.daterangepicker', function (ev, picker) {
                // Dynamically set startDate when the picker is opened
                if (dateData) {
                    picker.setStartDate(moment(dateData, 'DD-MM-YYYY'));
                }
            });
            $(this).val(dateData).trigger('change');
        })
        this.consultingValue.attr('value', data?.['value']);
        this.initTableProductCategories(this.tableProductCategories,data?.['product_categories'], this.consultingValue, isDetail)
        this.setupDetailDocAttach(data['attachment_data'])
        let manualData = data['attachment_data'] ? data['attachment_data'].filter(item => item.isManual === true) : []
        let checkedMasterDoc = data['attachment_data'] ? data['attachment_data'].filter(item => item.isManual === false) : []
        this.initTableManualDataDoc(this.tableManualDoc, manualData)
        this.initTableMasterDataDoc(this.tableMasterDoc, checkedMasterDoc)
        this.initTableDoc(this.tableDoc, data['attachment_data'], isDetail)
        this.docDataScript.attr('data-doc-list', JSON.stringify(data['attachment_data']))
        this.initTinymce(data?.['abstract_content'])
        $.fn.initMaskMoney2()
    }

    /**
     * @param {[any]} data The attachment data
     * @desc set up data attachment
     */
    setupDetailDocAttach(data) {
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