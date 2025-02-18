$(document).ready(function () {
    class CommonHandler{
        constructor(options) {
            this.currentSection = options.currentSection
            this.dataTableId = options.dataTableId
            this.respKeyword = options.respKeyword
            this.modalId = options.modalId
            this.modalUpdateId = options.modalUpdateId
            this.btnUpdate = options.btnUpdate
            this.formUpdateId = options.formUpdateId
            this.formId = options.formId

            this.dataUpdateUrl = options.dataUpdateUrl
            this.init()
        }

        init(){
            this.initDataTable()
            this.handleOpenUpdateModal(this.modalUpdateId, this.btnUpdate, this.formUpdateId)
            this.handleSubmitForm(this.formId, this.modalId, this.dataTableId)
            this.handleSubmitForm(this.formUpdateId, this.modalUpdateId, this.dataTableId)
        }

        initDataTable(){
            $(this.dataTableId).DataTable().destroy()
            let tbl = $(this.dataTableId);
            let columns = this.setupColumn(this.btnUpdate, this.modalUpdateId)
            let frm = new SetupFormSubmit(tbl);

            tbl.DataTableDefault(
                {
                    useDataServer: true,
                    rowIdx: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        data: {},
                        dataSrc:  (resp)=> {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty(this.respKeyword)) {
                                return resp.data[this.respKeyword] ? resp.data[this.respKeyword] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: columns,
                },
            )
        }

        setupColumn(btnUpdate, modalUpdate){
            switch (this.currentSection) {
                case 'section_fixed_asset_classification_group':
                    return [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                if (row.is_default) {
                                    return `<span class="badge badge-secondary">${row.code}</span>`
                                } else {
                                    return `<span class="badge badge-primary">${row.code}</span>`
                                }
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-75',
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
                                if (!row?.['is_default']) {
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover"
                                                   data-id="${row?.['id']}"
                                                   data-code="${row?.['code']}"
                                                   data-title="${row?.['title']}"
                                                   data-bs-toggle="modal"
                                                   data-bs-target=''
                                                   data-bs-placement="top" title=""
                                                   >
                                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                                </a>`
                                }
                                return ``
                            }
                        }
                    ]
                case 'section_fixed_asset_classification':
                    return [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                console.log(row.is_default);
                                if (row.is_default) {
                                    return `<span class="badge badge-secondary">${row.code}</span>`
                                } else {
                                    return `<span class="badge badge-primary">${row.code}</span>`
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
                            data: 'group',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data?.['title']}</b></span>`
                                }
                                return `<span><b>${data?.['title']}</b></span>`
                            }
                        },
                        {
                            className: 'wrap-text text-right w-10',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover"
                                                   data-id="${row?.['id']}"
                                                   data-code="${row?.['code']}"
                                                   data-title="${row?.['title']}"
                                                   data-bs-toggle="modal"
                                                   data-bs-target=''
                                                   data-bs-placement="top" title=""
                                                   >
                                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                                </a>`
                                }
                                return ``
                            }
                        }
                    ]
                case 'section_tool_classification':
                    return [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                console.log(row.is_default);
                                if (row.is_default) {
                                    return `<span class="badge badge-secondary">${row.code}</span>`
                                } else {
                                    return `<span class="badge badge-primary">${row.code}</span>`
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
                                if (!row?.['is_default']) {
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover ${btnUpdate}"
                                                   data-id="${row?.['id']}"
                                                   data-code="${row?.['code']}"
                                                   data-title="${row?.['title']}"
                                                   data-bs-toggle="modal"
                                                   data-bs-target=${modalUpdate}
                                                   data-bs-placement="top" title=""
                                                   >
                                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                                </a>`
                                }
                                return ``
                            }
                        }
                    ]
            }

        }

        handleSubmitForm(formId, modalId, dataTableId){
            new SetupFormSubmit($(formId)).validate({
                submitHandler: function (form) {
                    let frm = new SetupFormSubmit($(form));
                    let data_url =  $(formId).attr('data-url');
                    $.fn.callAjax2({
                        'url': data_url,
                        'method': frm.dataMethod,
                        'data': frm.dataForm,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $(modalId).modal('hide');
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                $(dataTableId).DataTable().ajax.reload();
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
                }
            })
        }

        handleOpenUpdateModal(modalUpdateId, btnUpdateClass, formUpdateId){
            const btnUpdateClassSelector = '.'  + btnUpdateClass
            $(document).on('click', btnUpdateClassSelector, (e)=> {
                let modal = $(modalUpdateId)
                modal.find('#inp_code').val($(e.currentTarget).attr('data-code'))
                modal.find('#inp_name').val($(e.currentTarget).attr('data-title'))
                const id = $(e.currentTarget).attr('data-id')
                const urlUpdate = $('#update-url-script').attr(this.dataUpdateUrl)
                $(formUpdateId).attr('data-url', urlUpdate.replace('/0', `/${id}`))
            })
        }
    }

    const $navLinks = $('#tab-select-table .nav-link')

    const initCurrentTab = () => {
        const $activeLink = $navLinks.filter('.active');
        const activeHref = $activeLink.attr('href');
        let options={}
        switch (activeHref) {
            case '#section_fixed_asset_classification_group':
                options = {
                    currentSection: 'section_fixed_asset_classification_group',
                    dataTableId: '#datatable-fixed-asset-classification-group',
                    respKeyword: 'classification_group_list',
                }
                new CommonHandler(options)
                break;
            case '#section_fixed_asset_classification':
                options = {
                    currentSection: 'section_fixed_asset_classification',
                    dataTableId: '#datatable-fixed-asset-classification',
                    respKeyword: 'classification_list',
                }
                new CommonHandler(options)
                break;
            case '#section_tool_classification':
                options = {
                    currentSection: 'section_tool_classification',
                    dataTableId: '#datatable-tool-classification',
                    respKeyword: 'tool_classification_list',
                    modalUpdateId: '#modal-tool-classification-update',
                    btnUpdate: 'btnUpdateToolClassification',
                    formUpdateId: '#form-update-tool-classification',
                    modalId: '#modal-tool-classification',
                    formId: '#form-create-tool-classification',
                    dataUpdateUrl: 'data-tool-update-url'
                }
                new CommonHandler(options)
                break;
        }
    };

    $navLinks.on('click', function () {
        setTimeout(initCurrentTab, 100);
    });

    initCurrentTab()

})