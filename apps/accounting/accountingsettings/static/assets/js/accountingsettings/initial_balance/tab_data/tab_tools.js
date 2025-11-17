class TabToolElements {
    constructor() {
        this.$tableTools = $('#tbl_tools');
        this.$btnAddTools = $('#add_tab_tools');

        // tool modal element
        this.$toolModal = $('#tool-modal');
        this.$toolTypeEle = $('#selected_tool');
        this.$startDateEle = $('#start_date_tool');
        this.$uomEle = $('#uom_tool');
    }
}
const tabToolElements = new TabToolElements();


class TabToolFunction {
    static initToolTable(data=[], option='create') {
        tabToolElements.$tableTools.DataTable().destroy();
        tabToolElements.$tableTools.DataTableDefault({
            data: data,
            styleDom: 'hide-foot',
            rowIdx: true,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            reloadCurrency: true,
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return '';
                    }
                },
                {
                    className: "w-30",
                    render: (data, type, row) => {
                        return `<div class="input-group">
                            <select class="form-select select2 row-tool-type"></select>
                            <span class="input-group-text p-0">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-regular fa-circle-question"></i>
                                </a>
                                <div class="dropdown-menu bflow-mirrow-card-80 p-3" style="min-width: 200px;">
                                    <h5 class="row-tool-type-code fw-bold"></h5>
                                    <h6 class="row-fk-tool-type-name"></h6>
                                    <h6 class="row-tool-type-name"></h6>
                                </div>
                            </span>
                        </div>`;
                    }
                },
                {
                    className: "w-40",
                    render: (data, type, row) => {
                    return  `<div class="input-group">
                                <input type="text" class="form-control row-detail-tool"
                                    placeholder="Click icon to add detail..." readonly/>
                                <button type="button" class="btn btn-info btn-tool-modal"
                                        data-bs-toggle="modal"
                                        data-bs-target="#tool-modal">
                                   <i class="fas fa-info"></i>
                                </button>
                            </div>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-tool-debit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-tool-credit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-5 text-right",
                    render: () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''}
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-tool-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                          </button>`;
                    }
                },
            ]
        });
    }

    static loadToolType(data) {
        tabToolElements.$toolTypeEle.initSelect2({
            allowClear: true,
            ajax: {
                url: tabToolElements.$toolTypeEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'tool_classification_list',
            keyId: 'id',
            keyText: 'title'
        });
    }
}


class TabToolEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabToolElements.$btnAddTools.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabToolElements.$tableTools);
            let row_added = tabToolElements.$tableTools.find('tbody tr:last-child');
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: row_added.find('.row-tool-type'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'acc_type': 1, 'is_account': true}
            });
        });

        // event for deleting row
        tabToolElements.$tableTools.on('click', '.del-tool-row', function() {
            UsualLoadPageFunction.DeleteTableRow(
                tabToolElements.$tableTools,
                parseInt($(this).closest('tr').find('td:first-child').text())
            );
        });

        // show detail information for Account
        tabToolElements.$tableTools.on('change', '.row-tool-type', function() {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val());
            $(this).closest('tr').find('.row-tool-type-code').text(selected?.['acc_code'] || '');
            $(this).closest('tr').find('.row-fk-tool-type-name').text(selected?.['foreign_acc_name'] || '');
            $(this).closest('tr').find('.row-tool-type-name').text(`(${selected?.['acc_name'] || ''})`);
        });

        // event when tool modal is shown
        tabToolElements.$toolModal.on('shown.bs.modal', function() {
            TabToolFunction.loadToolType();
            UsualLoadPageFunction.LoadUOM({
                element: tabToolElements.$uomEle,
                data_url: tabToolElements.$uomEle.attr('data-url')
            });
        });
    }
}
