$(document).ready(function () {
    class DocumentTypeHandler{

        constructor(options) {
            this.btnUpdateDocTypeClass = options.btnUpdateDocTypeClass

            this.modalUpdateDocTypeId = options.modalUpdateDocTypeId

            this.modalDocTypeId = options.modalDocTypeId

            this.dataTableDocTypeListId = options.dataTableDocTypeListId

            this.formCreateDocTypeId = options.formCreateDocTypeId
            this.formUpdateDocTypeId = options.formUpdateDocTypeId

            this.docTypeCategory = options.docTypeCategory

            this.init()
        }

        init(){
            this.initDataTable(
                this.btnUpdateDocTypeClass,
                this.modalUpdateDocTypeId,
                this.dataTableDocTypeListId,
                this.docTypeCategory
            )
            this.handleOpenUpdateModal(this.modalUpdateDocTypeId, this.btnUpdateDocTypeClass, this.formUpdateDocTypeId)
            this.handleSubmitForm(this.formCreateDocTypeId, this.formUpdateDocTypeId, this.modalDocTypeId, this.modalUpdateDocTypeId, this.docTypeCategory, this.dataTableDocTypeListId)
        }

        initDataTable(btnUpdateDocType, modalUpdateDocType, dataTableDocTypeList, docTypeCategory){
            $(dataTableDocTypeList).DataTable().destroy()
            let columns = this.setupColumnDocType(btnUpdateDocType, modalUpdateDocType)
            let tbl = $(dataTableDocTypeList);
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
                    useDataServer: true,
                    rowIdx: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        data: {"doc_type_category": docTypeCategory},
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('document_type_list')) {
                                return resp.data['document_type_list'] ? resp.data['document_type_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: columns,
                },
            );
        }

        setupColumnDocType(btnUpdateDocType, modalUpdateDocType){
            return [
                {
                    className: 'wrap-text w-5',
                    render: (data, type, row, meta) => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text w-30',
                    render: (data, type, row) => {
                        if (row.is_default) {
                            return `<span class="badge badge-light w-70">${row.code}</span>`
                        } else {
                            return `<span class="badge badge-primary w-70">${row.code}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text w-55',
                    render: (data, type, row, meta) => {
                        if (!row?.['is_default']) {
                            return `<span class="text-primary"><b>${data}</b></span>`
                        }
                        return `<span><b>${data}</b></span>`
                    }
                },
                {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row, meta) => {
                        return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover ${btnUpdateDocType}"
                                   data-id="${row?.['id']}"
                                   data-code="${row?.['code']}"
                                   data-title="${row?.['title']}"
                                   data-bs-toggle="modal"
                                   data-bs-target=${modalUpdateDocType}
                                   data-bs-placement="top" title=""
                                   >
                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                               </a>`
                    }
                }
            ]
        }

        handleOpenUpdateModal(modalUpdateDocTypeId, btnUpdateDocTypeClass, formUpdateDocTypeId){
            let btnUpdateDocTypeClassSelector = '.'+btnUpdateDocTypeClass
            $(document).on('click', btnUpdateDocTypeClassSelector, function () {
                let modal = $(modalUpdateDocTypeId)
                modal.find('#inp_code').val($(this).attr('data-code'))
                modal.find('#inp_name').val($(this).attr('data-title'))
                const id = $(this).attr('data-id')
                const urlUpdate = $('#update-url-script').attr('data-url-update-document-type')
                $(formUpdateDocTypeId).attr('data-url-update-document-type', urlUpdate.replace('/0', `/${id}`))
            });
        }


        handleSubmitForm(formCreateDocTypeId, formUpdateDocTypeId, modalDocTypeId, modalUpdateDocTypeId, docTypeCategory, dataTableDocTypeListId ){
            this.handleSubmitFormCreate(formCreateDocTypeId, modalDocTypeId, docTypeCategory, dataTableDocTypeListId)
            this.handleSubmitFormUpdate(formUpdateDocTypeId, modalUpdateDocTypeId, docTypeCategory, dataTableDocTypeListId)
        }

        handleSubmitFormCreate(formCreateDocTypeId, modalDocTypeId, docTypeCategory, dataTableDocTypeListId){
            new SetupFormSubmit($(formCreateDocTypeId)).validate({
                submitHandler: function (form) {
                    let frm = new SetupFormSubmit($(form));
                    let frm_data = frm.dataForm;
                    frm_data["doc_type_category"] = docTypeCategory
                    let data_url =  $(formCreateDocTypeId).attr('data-url-document-type');
                    $.fn.callAjax2({
                        'url': data_url,
                        'method': frm.dataMethod,
                        'data': frm_data,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $(modalDocTypeId).modal('hide');
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                $(dataTableDocTypeListId).DataTable().ajax.reload();
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
                }
            })
        }

        handleSubmitFormUpdate(formUpdateDocTypeId, modalUpdateDocTypeId, docTypeCategory, dataTableDocTypeListId){
            new SetupFormSubmit($(formUpdateDocTypeId)).validate({
                submitHandler: function (form) {
                    let frm = new SetupFormSubmit($(form));
                    let frm_data = frm.dataForm;
                    let data_url =  $(formUpdateDocTypeId).attr('data-url-update-document-type');
                    $.fn.callAjax2({
                        'url': data_url,
                        'method': frm.dataMethod,
                        'data': frm_data,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $(modalUpdateDocTypeId).modal('hide');
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                $(dataTableDocTypeListId).DataTable().ajax.reload();
                            }
                        },
                        (errs) => {
                            if(errs.data){
                                $.fn.notifyB({description: errs.data.errors}, 'failure');
                            }
                            $.fn.notifyB({description: 'Error'}, 'failure');
                        }
                    )
                }
            })
        }
    }

    const $navLinks = $('#tab-select-table .nav-link')

    const initCurrentTab = () => {
        const $activeLink = $navLinks.filter('.active');
        const activeHref = $activeLink.attr('href');
        let options={}
        switch (activeHref) {
            case '#section_document_type_bidding':
                options = {
                    btnUpdateDocTypeClass: 'btn-update-document-type',
                    modalUpdateDocTypeId: '#modal_update_document_type_bidding',
                    modalDocTypeId: '#modal_document_type_bidding',
                    dataTableDocTypeListId: '#datatable-document-type-list-bidding',
                    formUpdateDocTypeId: '#form_update_document_type_bidding',
                    formCreateDocTypeId: '#form_create_document_type_bidding',
                    docTypeCategory: 'bidding'
                }
                new DocumentTypeHandler(options)
                break;
            case '#section_document_type_consulting':
                options = {
                    btnUpdateDocTypeClass: 'btn-update-document-type',
                    modalUpdateDocTypeId: '#modal_update_document_type_consulting',
                    modalDocTypeId: '#modal_document_type_consulting',
                    dataTableDocTypeListId: '#datatable-document-type-list-consulting',
                    formUpdateDocTypeId: '#form_update_document_type_consulting',
                    formCreateDocTypeId: '#form_create_document_type_consulting',
                    docTypeCategory: 'consulting'
                }
                new DocumentTypeHandler(options)
                break;
        }
    };

    $navLinks.on('click', function () {
        setTimeout(initCurrentTab, 100);
    });

    initCurrentTab()
})
