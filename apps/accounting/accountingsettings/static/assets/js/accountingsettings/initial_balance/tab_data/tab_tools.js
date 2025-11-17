class TabToolElements {
    constructor() {
        this.$tableTools = $('#tbl_tools');
        this.$btnAddTools = $('#add_tab_tools');

        // tool modal element
        this.$toolModal = $('#tool-modal');
        this.$toolTypeEle = $('#selected_tool');
        this.$startDateEle = $('#start_date_tool');
        this.$uomEle = $('#uom_tool');

        // tool modal fields
        this.$toolCodeEle = $('#tool_code');
        this.$toolNameEle = $('#tool_name');
        this.$amountToolEle = $('#amount_tool');
        this.$totalValueToolEle = $('#total_value_tool');
        this.$totalPeriodEle = $('#total_period');
        this.$totalAllocatedPeriodEle = $('#total_allocated_period');
        this.$remainingPeriodEle = $('#remaining_period');
        this.$allocatedValueEle = $('#allocated_value');
        this.$remainingValueEle = $('#remaining_value');
        this.$btnSaveTool = $('#btn_save_tool');
    }
}
const tabToolElements = new TabToolElements();


class TabToolVariables {
    constructor() {
        this.currentEditingRow = null;
        this.currentToolData = null;
    }
}
const tabToolVariables = new TabToolVariables();


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

    static resetModalData() {
        // clear all fields
        tabToolElements.$toolCodeEle.val('');
        tabToolElements.$toolNameEle.val('');
        tabToolElements.$amountToolEle.val('');
        tabToolElements.$totalValueToolEle.val('');
        tabToolElements.$totalPeriodEle.val('');
        tabToolElements.$totalAllocatedPeriodEle.val('');
        tabToolElements.$remainingPeriodEle.val('');
        tabToolElements.$allocatedValueEle.val('');
        tabToolElements.$remainingValueEle.val('');
        tabToolElements.$startDateEle.val('');

        // clear select2
        if (tabToolElements.$toolTypeEle.data('select2')) {
            tabToolElements.$toolTypeEle.val(null).trigger('change');
        }
        if (tabToolElements.$uomEle.data('select2')) {
            tabToolElements.$uomEle.val(null).trigger('change');
        }

    }

    static calculateRemainingPeriods() {
        const totalPeriod = parseFloat(tabToolElements.$totalPeriodEle.val()) || 0;
        const allocatedPeriod = parseFloat(tabToolElements.$totalAllocatedPeriodEle.val()) || 0;
        const remainingPeriod = totalPeriod - allocatedPeriod;

        tabToolElements.$remainingPeriodEle.val(remainingPeriod);
    }

    static calculateRemainingValue() {
        const remainingValue = parseFloat(tabToolElements.$totalValueToolEle.attr('value') || 0) - parseFloat(tabToolElements.$allocatedValueEle.attr('value') || 0);
        tabToolElements.$remainingValueEle.attr('value', remainingValue);
        $.fn.initMaskMoney2();
    }

    static validateToolData() {
        let isValid = true;
        let errorMessage = '';

        // validate allocated period
        const totalPeriod = parseFloat(tabToolElements.$totalPeriodEle.val()) || 0;
        const allocatedPeriod = parseFloat(tabToolElements.$totalAllocatedPeriodEle.val()) || 0;
        if (allocatedPeriod > totalPeriod) {
            isValid = false;
            errorMessage += $.fn.gettext('Allocated periods must be lower than total periods');
        }

        // validate allocated value
        const totalValue = parseFloat(tabToolElements.$totalValueToolEle.attr('value') || 0);
        const allocatedValue = parseFloat(tabToolElements.$allocatedValueEle.attr('value') || 0);
        if (allocatedValue > totalValue) {
            isValid = false;
            errorMessage += $.fn.gettext('Allocated value must be lower than total value');
        }

        return {isValid: isValid, errorMessage: errorMessage};
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

        // event when clicking button to open tool modal
        tabToolElements.$tableTools.on('click', '.btn-tool-modal', function() {
            tabToolVariables.currentEditingRow = $(this).closest('tr');
        });

        // event when tool modal is shown
        tabToolElements.$toolModal.on('shown.bs.modal', function() {
            TabToolFunction.loadToolType();
            UsualLoadPageFunction.LoadUOM({
                element: tabToolElements.$uomEle,
                data_url: tabToolElements.$uomEle.attr('data-url')
            });
        });

        // event when tool modal is closed
        tabToolElements.$toolModal.on('hidden.bs.modal', function() {
            TabToolFunction.resetModalData();
            tabToolVariables.currentEditingRow = null;
        });

        // event to fill number of remaining periods
        tabToolElements.$totalPeriodEle.on('change', function() {
            TabToolFunction.calculateRemainingPeriods();
        });
        tabToolElements.$totalAllocatedPeriodEle.on('change', function() {
            TabToolFunction.calculateRemainingPeriods();
        });

        // event to fill remaining value
        tabToolElements.$totalValueToolEle.on('change', function() {
            TabToolFunction.calculateRemainingValue();
        });
        tabToolElements.$allocatedValueEle.on('change', function() {
            TabToolFunction.calculateRemainingValue();
        });

        // event for button save Modal
        tabToolElements.$btnSaveTool.on('click', function () {
            // validate data
            const validation = TabToolFunction.validateToolData();
            if (!validation.isValid) {
                alert(validation.errorMessage);
                return;
            }

            // get values from modal
            const toolCode = tabToolElements.$toolCodeEle.val();
            const toolName = tabToolElements.$toolNameEle.val();
            const amount = tabToolElements.$amountToolEle.val();
            const uomText = tabToolElements.$uomEle.find('option:selected').text();
            const totalPeriod = tabToolElements.$totalPeriodEle.val();
            const remainingValue = tabToolElements.$remainingValueEle.attr('value') || 0;

            // fill row detail
            const detailText = `${toolCode} - ${toolName} (${amount} ${uomText}, ${totalPeriod} periods)`;
            tabToolVariables.currentEditingRow.find('.row-detail-tool').val(detailText);
            tabToolVariables.currentEditingRow.find('.row-tool-debit').attr('value', remainingValue);
            $.fn.initMaskMoney2();

            // close modal
            tabToolElements.$toolModal.modal('hide');
        });
    }
}
