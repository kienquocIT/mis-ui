$(document).ready(function () {
    class CommonHandler{
        constructor(options) {
            this.currentSection = options.currentSection
            this.dataTableId = options.dataTableId
            this.respKeyword = options.respKeyword
            this.init()
        }

        init(){
            this.initDataTable()
        }

        initDataTable(){
            $(this.dataTableId).DataTable().destroy()
            let tbl = $(this.dataTableId);
            let columns = this.setupColumn()
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

        setupColumn(){
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
            }

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
                    'currentSection': 'section_fixed_asset_classification_group',
                    'dataTableId': '#datatable-fixed-asset-classification-group',
                    'respKeyword': 'classification_group_list',
                }
                new CommonHandler(options)
                break;
            case '#section_fixed_asset_classification':
                options = {
                    'currentSection': 'section_fixed_asset_classification',
                    'dataTableId': '#datatable-fixed-asset-classification',
                    'respKeyword': 'classification_list',
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