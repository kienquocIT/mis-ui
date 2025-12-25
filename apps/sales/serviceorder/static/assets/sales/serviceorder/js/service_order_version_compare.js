const VersionCompareControl = {
    $canvas: $('#versionCompareCanvas'),
    $openButton: $('#open_version_compare'),
    $versionSelect: $('#version-select'),
    $diffResultTable: $('#diffResultTable'),
    $currentVersionInfo: $('#currentVersionInfo'),
    $comparingVersionInfo: $('#comparingVersionInfo'),

    currentServiceOrderId: null,
    currentSnapshot: null,
    previousSnapshot: null,
    changedPaths: {},
    addedPaths: {},
    removedPaths: {},

    /**
     * Initialize version compare control
     */
    init: function () {
        this.currentServiceOrderId = $.fn.getPkDetail()
        this.setupEventListeners();
        this.addCustomStyles();
        $.fn.initMaskMoney2()
    },

    /**
     * Add custom styles for diff highlighting
     */
    addCustomStyles: function () {
        if (!$('#versionCompareStyles').length) {
            const styles = `
                <style id="versionCompareStyles">
                    .diff-changed {
                        background-color: #fff3cd !important;
                        border: 1px solid #ffc107 !important;
                    }
                    .diff-added {
                        background-color: #d4edda !important;
                        border: 1px solid #28a745 !important;
                    }
                    .diff-removed {
                        background-color: #f8d7da !important;
                        border: 1px solid #dc3545 !important;
                    }
                    .version-compare-container {
                        max-height: 75vh;
                        overflow-y: auto;
                    }
                    .comparison-wrapper {
                        margin-bottom: 20px;
                        border: 1px solid #dee2e6;
                        border-radius: 6px;
                        overflow: hidden;
                    }
                    .comparison-wrapper .row {
                        margin: 0;
                    }
                    .section-label {
                        background: #f8f9fa;
                        padding: 15px;
                        font-weight: 600;
                        font-size: 1em;
                        border-right: 2px solid #dee2e6;
                        display: flex;
                        align-items: center;
                        min-height: 60px;
                    }
                    .comparison-content {
                        padding: 0;
                    }
                    .comparison-item-row {
                        border-bottom: 1px solid #e9ecef;
                    }
                    .comparison-item-row:last-child {
                        border-bottom: none;
                    }
                    .comparison-item-row .col-6 {
                        padding: 12px 15px;
                        min-height: 50px;
                    }
                    .comparison-item-row .col-6:first-child {
                        background: #fafafa;
                        border-right: 1px solid #dee2e6;
                    }
                    .item-container {
                        padding: 8px;
                        background: white;
                        border: 1px solid #e0e0e0;
                        border-radius: 4px;
                    }
                    .item-header {
                        font-weight: 600;
                        margin-bottom: 8px;
                        padding-bottom: 6px;
                        border-bottom: 1px solid #dee2e6;
                        color: #495057;
                    }
                    .field-inline {
                        display: inline-block;
                        margin-right: 12px;
                        margin-bottom: 6px;
                        padding: 3px 6px;
                        background: #f8f9fa;
                        border: 1px solid #e0e0e0;
                        border-radius: 3px;
                        font-size: 0.85em;
                    }
                    .field-inline strong {
                        color: #6c757d;
                        margin-right: 4px;
                    }
                    .no-data {
                        color: #999;
                        font-style: italic;
                        padding: 10px;
                    }
                    .nested-items {
                        margin-top: 10px;
                        padding-left: 15px;
                        border-left: 3px solid #dee2e6;
                    }
                    .nested-item {
                        margin-bottom: 8px;
                        padding: 8px;
                        /*background: #f8f9fa;*/
                        border: 1px solid #e9ecef;
                        border-radius: 3px;
                    }
                    .nested-item-title {
                        font-weight: 600;
                        font-size: 0.85em;
                        color: #495057;
                        margin-bottom: 4px;
                    }
                    .version-headers {
                        background: #e9ecef;
                        padding: 10px 15px;
                        margin-bottom: 15px;
                        border-radius: 6px;
                    }
                    .version-headers .row > div {
                        padding: 8px;
                    }
                </style>
            `;
            $('head').append(styles);
        }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners: function () {
        this.$openButton.on('click', () => {
            this.loadVersions();
            this.$canvas.offcanvas('show');
        });

        this.$versionSelect.on('change', (e) => {
            const selectedVersionId = $(e.target).val();
            if (selectedVersionId) {
                this.loadDiff(selectedVersionId);
            } else {
                this.resetDisplay();
            }
        });

        // Tab click handlers
        $('#version-compare-tabs a[data-bs-toggle="tab"]').on('shown.bs.tab', (e) => {
            const targetTab = $(e.target).attr('href');
            this.renderTabContent(targetTab);
        });
    },

    /**
     * Reset display
     */
    resetDisplay: function () {
        $('#diffSummary').hide();
        $('.tab-pane').each(function() {
            $(this).find('div[id$="-content"]').empty();
        });
    },

    /**
     * Load all versions of the current service order
     */
    loadVersions: function () {
        this.$versionSelect.initSelect2({
            dataParams: {
                document_root_id: ServiceOrder.pageVariable.documentRootId || this.currentServiceOrderId,
                exclude_id: this.currentServiceOrderId,
            },
            templateResult: function (state) {
                if (state.data){
                    const title = state.data?.title || ''
                    const code = state.data?.code || ''
                    return $(`<span>${title} - ${code}</span>`);
                }
                return state.text
            },
            templateSelection: function (state) {
                if (state.data){
                    const title = state.data?.title || ''
                    const code = state.data?.code || ''
                    return $(`<span>${title} - ${code}</span>`);
                }
                return state.text
            },
        });
    },

    /**
     * Load and display diff between current and selected version
     */
    loadDiff: async function (comparingVersionId) {
        try {
            this.resetDisplay();

            const diffApiUrl = `/serviceorder/diff/api/${this.currentServiceOrderId}/${comparingVersionId}`;
            const response = await $.ajax({
                url: diffApiUrl,
                type: 'GET',
                dataType: 'json',
            });

            this.processDiffResponse(response);

        } catch (error) {
            console.error('Error loading diff:', error);
            this.showErrorMessage('Failed to load version comparison. Please try again.');
        }
    },

    /**
     * Process the diff response with enhanced structure
     */
    processDiffResponse: function (response) {
        const data = response.data || response;

        if (data.current_snapshot && data.previous_snapshot) {
            this.currentSnapshot = data.current_snapshot;
            this.previousSnapshot = data.previous_snapshot;

            if (data.differences) {
                this.processDifferences(data.differences);
            }

            if (data.summary) {
                this.updateSummary(data.summary);
            }

            // Render the active tab
            const activeTab = $('#version-compare-tabs a.active').attr('href');
            this.renderTabContent(activeTab || '#tab-compare-all');
        }
    },

    /**
     * Process differences and build changed paths maps
     */
    processDifferences: function (differences) {
        this.changedPaths = {};
        this.addedPaths = {};
        this.removedPaths = {};

        if (differences.values_changed) {
            differences.values_changed.forEach(change => {
                const cleanPath = this.cleanPath(change.path);
                this.changedPaths[cleanPath] = {
                    old: change.old_value,
                    new: change.new_value,
                    path: cleanPath
                };
            });
        }

        if (differences.iterable_item_added) {
            differences.iterable_item_added.forEach(item => {
                const cleanPath = this.cleanPath(item.path);
                this.addedPaths[cleanPath] = {
                    value: item.new_value,
                    path: cleanPath
                };
            });
        }

        if (differences.iterable_item_removed) {
            differences.iterable_item_removed.forEach(item => {
                const cleanPath = this.cleanPath(item.path);
                this.removedPaths[cleanPath] = {
                    value: item.old_value,
                    path: cleanPath
                };
            });
        }
    },

    /**
     * Clean path for easier processing
     */
    cleanPath: function (path) {
        return path
            .replace(/\]\[/g, '.')
            .replace(/root\[['"]?/g, '')
            .replace(/['"\]\[]/g, '')
            .replace(/\.$/, '');
    },

    /**
     * Check if a path itself is added or removed
     */
    isItemAddedOrRemoved: function (path) {
        return this.addedPaths[path] || this.removedPaths[path];
    },

    /**
     * Get change type for a path
     */
    getChangeType: function (path) {
        if (this.changedPaths[path]) return 'changed';
        if (this.addedPaths[path]) return 'added';
        if (this.removedPaths[path]) return 'removed';
        return null;
    },

    /**
     * Update summary statistics
     */
    updateSummary: function (summary) {
        $('#totalChanges').text(summary.total_changes || 0);
        $('#valuesChanged').text(summary.values_changed || 0);
        $('#itemsAdded').text((summary.items_added || 0) + (summary.iterable_item_added || 0));
        $('#itemsRemoved').text((summary.items_removed || 0) + (summary.iterable_item_removed || 0));
        $('#diffSummary').show();
    },

    /**
     * Render content based on active tab
     */
    renderTabContent: function (tabId) {
        if (!this.currentSnapshot || !this.previousSnapshot) return;

        const contentId = tabId.replace('#tab-', '') + '-content';
        const $container = $(`#${contentId}`);

        $container.empty();

        let html = '<div class="version-compare-container">';

        // Add version headers
        html += this.renderVersionHeaders();

        switch (tabId) {
            case '#tab-compare-all':
                html += this.renderBasicInfo();
                html += this.renderServiceDetails();
                html += this.renderWorkOrders();
                html += this.renderExpensesData();
                html += this.renderPaymentData();
                break;
            case '#tab-compare-service-detail':
                html += this.renderServiceDetails();
                break;
            case '#tab-compare-work-order':
                html += this.renderWorkOrders();
                break;
            case '#tab-compare-expense':
                html += this.renderExpensesData();
                break;
            case '#tab-compare-payment':
                html += this.renderPaymentData();
                break;
            case '#tab-compare-attachment':
                html += '<div class="alert alert-info">Attachment comparison not yet implemented</div>';
                break;
        }

        html += '</div>';
        $container.append(html);
        $.fn.initMaskMoney2()
    },

    /**
     * Render version headers
     */
    renderVersionHeaders: function () {
        return `
            <div class="version-headers">
                <div class="row">
                    <div class="col-2"><strong>Version Info</strong></div>
                    <div class="col-5">
                        <strong>Previous:</strong> ${this.previousSnapshot.title || this.previousSnapshot.code || 'N/A'}
                        <br><small class="text-muted">${this.formatDate(this.previousSnapshot.date_created)}</small>
                    </div>
                    <div class="col-5">
                        <strong>Current:</strong> ${this.currentSnapshot.title || this.currentSnapshot.code || 'N/A'}
                        <br><small class="text-muted">${this.formatDate($('#so-start-date').val())}</small>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render basic information section
     */
    renderBasicInfo: function () {
        return `
            <div class="comparison-wrapper">
                <div class="row">
                    <div class="col-2 section-label">
                        Basic Info
                    </div>
                    <div class="col-10 comparison-content">
                        ${this.renderSingleComparison(
                            this.renderBasicFields(this.previousSnapshot),
                            this.renderBasicFields(this.currentSnapshot)
                        )}
                    </div>
                </div>
            </div>
        `;
    },

    renderBasicFields: function(snapshot) {
        let html = '<div class="item-container">';
        html += this.renderInlineField($.fn.gettext('Code'), snapshot.code, 'code');
        html += this.renderInlineField($.fn.gettext('Title'), snapshot.title, 'title');
        html += this.renderInlineField($.fn.gettext('Start Date'), this.formatDate(snapshot.start_date), 'start_date');
        html += this.renderInlineField($.fn.gettext('End Date'), this.formatDate(snapshot.end_date), 'end_date');
        html += this.renderInlineField($.fn.gettext('Customer'), snapshot.customer_data.name, 'customer_data.name');
        html += '</div>';
        return html;
    },

    /**
     * Render customer information section
     */
    renderCustomerInfo: function () {
        if (!this.currentSnapshot.customer_data && !this.previousSnapshot.customer_data) return '';

        return `
            <div class="comparison-wrapper">
                <div class="row">
                    <div class="col-2 section-label">
                        Customer
                    </div>
                    <div class="col-10 comparison-content">
                        ${this.renderSingleComparison(
                            this.renderCustomerFields(this.previousSnapshot.customer_data),
                            this.renderCustomerFields(this.currentSnapshot.customer_data)
                        )}
                    </div>
                </div>
            </div>
        `;
    },

    renderCustomerFields: function(customer) {
        if (!customer) return '<div class="no-data">No data</div>';

        let html = '<div class="item-container">';
        html += this.renderInlineField('Code', customer.code, 'customer_data.code');
        html += this.renderInlineField('Name', customer.name, 'customer_data.name');
        html += this.renderInlineField('Tax Code', customer.tax_code, 'customer_data.tax_code');
        html += '</div>';
        return html;
    },

    /**
     * Render financial summary section
     */
    renderFinancialSummary: function () {
        return `
            <div class="comparison-wrapper">
                <div class="row">
                    <div class="col-2 section-label">
                        Financial
                    </div>
                    <div class="col-10 comparison-content">
                        ${this.renderSingleComparison(
                            this.renderFinancialFields(this.previousSnapshot),
                            this.renderFinancialFields(this.currentSnapshot)
                        )}
                    </div>
                </div>
            </div>
        `;
    },

    renderFinancialFields: function(snapshot) {
        let html = '<div class="item-container">';
        html += this.renderInlineField('Product Pre-tax', snapshot.total_product_pretax_amount, 'total_product_pretax_amount');
        html += this.renderInlineField('Product Tax', snapshot.total_product_tax, 'total_product_tax');
        html += this.renderInlineField('Product Total', snapshot.total_product, 'total_product');
        html += this.renderInlineField('Expense Total', snapshot.total_expense, 'total_expense');
        html += this.renderInlineField('Expense Tax', snapshot.total_expense_tax, 'total_expense_tax');
        html += '</div>';
        return html;
    },

    /**
     * Render indicators section
     */
    renderIndicators: function () {
        return `
            <div class="comparison-wrapper">
                <div class="row">
                    <div class="col-2 section-label">
                        Indicators
                    </div>
                    <div class="col-10 comparison-content">
                        ${this.renderSingleComparison(
                            this.renderIndicatorFields(this.previousSnapshot),
                            this.renderIndicatorFields(this.currentSnapshot)
                        )}
                    </div>
                </div>
            </div>
        `;
    },

    renderIndicatorFields: function(snapshot) {
        let html = '<div class="item-container">';
        html += this.renderInlineField('Revenue', snapshot.indicator_revenue, 'indicator_revenue');
        html += this.renderInlineField('Gross Profit', snapshot.indicator_gross_profit, 'indicator_gross_profit');
        html += this.renderInlineField('Net Income', snapshot.indicator_net_income, 'indicator_net_income');
        html += '</div>';
        return html;
    },

    /**
     * Render service details section
     */
    renderServiceDetails: function () {
        const prevServices = this.previousSnapshot.service_detail_data || [];
        const currServices = this.currentSnapshot.service_detail_data || [];

        if (prevServices.length === 0 && currServices.length === 0) return '';

        const maxLength = Math.max(prevServices.length, currServices.length);
        let comparisonRows = '';

        for (let i = 0; i < maxLength; i++) {
            const prevService = prevServices[i];
            const currService = currServices[i];
            const servicePath = `service_detail_data.${i}`;

            comparisonRows += this.renderComparisonRow(
                this.renderServiceItem(prevService, servicePath),
                this.renderServiceItem(currService, servicePath)
            );
        }

        return `
            <div class="comparison-wrapper">
                <div class="row">
                    <div class="col-2 section-label">
                        ${$.fn.gettext('Service Detail')}
                    </div>
                    <div class="col-10 comparison-content">
                        ${comparisonRows}
                    </div>
                </div>
            </div>
        `;
    },

    renderServiceItem: function(service, basePath) {
        if (!service) return '<div class="no-data">No data</div>';

        const changeType = this.getChangeType(basePath);
        let html = '<div class="item-container' + (changeType ? ' diff-' + changeType : '') + '">';
        html += `<div class="item-header">${service.title || 'N/A'} (${service.code || 'N/A'})`;
        html += '</div>';
        html += this.renderInlineField($.fn.gettext('Code'), service.code, `${basePath}.code`);
        html += this.renderInlineField($.fn.gettext('Title'), service.title, `${basePath}.title`);
        html += this.renderInlineField($.fn.gettext('Description'), service.description, `${basePath}.description`);
        html += this.renderInlineField($.fn.gettext('Weight Contribution'), service.service_percent, `${basePath}.service_percent`);
        html += this.renderInlineField($.fn.gettext('Quantity'), service.quantity, `${basePath}.quantity`);
        if(service.duration_id){
            html += this.renderInlineField($.fn.gettext('Duration'), service.duration, `${basePath}.duration`);
            html += this.renderInlineField($.fn.gettext('Duration Unit'), service.duration_unit_data?.title, `${basePath}.duration_unit_data.title`);
        }
        html += this.renderInlineField('Price', service.price, `${basePath}.price`, ['mask-money']);
        html += this.renderInlineField('Total', service.total_value, `${basePath}.total_value`, ['mask-money']);
        html += '</div>';
        return html;
    },

    /**
     * Render payment data section
     */
    renderPaymentData: function () {
        const prevPayments = this.previousSnapshot.payment_data || [];
        const currPayments = this.currentSnapshot.payment_data || [];

        if (prevPayments.length === 0 && currPayments.length === 0) return '';

        const maxLength = Math.max(prevPayments.length, currPayments.length);
        let comparisonRows = '';

        for (let i = 0; i < maxLength; i++) {
            const prevPayment = prevPayments[i];
            const currPayment = currPayments[i];
            const paymentPath = `payment_data.${i}`;

            comparisonRows += this.renderComparisonRow(
                this.renderPaymentItem(prevPayment, paymentPath),
                this.renderPaymentItem(currPayment, paymentPath)
            );
        }

        return `
            <div class="comparison-wrapper">
                <div class="row">
                    <div class="col-2 section-label">
                        Payment
                    </div>
                    <div class="col-10 comparison-content">
                        ${comparisonRows}
                    </div>
                </div>
            </div>
        `;
    },

    renderPaymentItem: function(payment, basePath) {
        if (!payment) return '<div class="no-data">No data</div>';

        const changeType = this.getChangeType(basePath);
        let html = '<div class="item-container' + (changeType ? ' diff-' + changeType : '') + '">';
        html += `<div class="item-header">Installment ${payment.installment || 'N/A'}`;
        html += '</div>';
        html += this.renderInlineField('Description', payment.description, `${basePath}.description`);
        html += this.renderInlineField(
            'Payment Type',
            payment.payment_type === 0 ? $.fn.gettext('Advance') : $.fn.gettext('Payment'),
            `${basePath}.payment_type`
        );
        html += this.renderInlineField('Invoice', payment.is_invoice_required, `${basePath}.is_invoice_required`);
        html += this.renderInlineField('Payment value', payment.payment_value, `${basePath}.payment_value`, ['mask-money']);
        html += this.renderInlineField('Tax', payment.tax_value, `${basePath}.tax_value`, ['mask-money']);
        html += this.renderInlineField('Reconcile Value', payment.reconcile_value, `${basePath}.reconcile_value`, ['mask-money']);
        html += this.renderInlineField('Receivable Value', payment.receivable_value, `${basePath}.receivable_value`, ['mask-money']);
        html += this.renderInlineField('Due Date', this.formatDate(payment.due_date), `${basePath}.due_date`);

        //render nested payment detail and reconcile
        if (payment.payment_detail_data && payment.payment_detail_data.length > 0) {
            html += '<div class="nested-items">';
            html += '<strong style="font-size: 0.85em; color: #6c757d;">Payment Details:</strong>';
            payment.payment_detail_data.forEach((paymentDetail, idx) => {
                const paymentDetailPath = `${basePath}.payment_detail_data.${idx}`;
                const paymentChangeType = this.getChangeType(paymentDetailPath);
                html += '<div class="nested-item' + (paymentChangeType ? ' diff-' + paymentChangeType : '') + '">';
                html += `<div class="nested-item-title">${paymentDetail.title || 'Payment Detail' + (idx + 1)}`;
                html += '</div>';
                if (!payment.is_invoice_required){
                    html += this.renderInlineField($.fn.gettext('Value %'), paymentDetail.payment_percent, `${paymentDetailPath}.payment_percent`);
                    html += this.renderInlineField($.fn.gettext('Value'), paymentDetail.payment_value, `${paymentDetailPath}.payment_value`, ['mask-money']);
                }
                else {
                    html += this.renderInlineField($.fn.gettext('Value %'), paymentDetail.payment_percent, `${paymentDetailPath}.payment_percent`);
                    html += this.renderInlineField($.fn.gettext('Value'), paymentDetail.payment_value, `${paymentDetailPath}.payment_value`, ['mask-money']);
                    html += this.renderInlineField($.fn.gettext('VAT'), paymentDetail.tax_value, `${paymentDetailPath}.tax_value`, ['mask-money']);
                    html += this.renderInlineField($.fn.gettext('Reconcile'), paymentDetail.reconcile_value, `${paymentDetailPath}.reconcile_value`, ['mask-money']);
                    html += this.renderInlineField($.fn.gettext('Receive'), paymentDetail.receivable_value, `${paymentDetailPath}.receivable_value`, ['mask-money']);

                    // render nested reconcile
                    if (paymentDetail.reconcile_data && paymentDetail.reconcile_data.length > 0) {
                        html += '<div class="nested-items">';
                        html += '<strong style="font-size: 0.85em; color: #6c757d;">Payment Reconcile: </strong>';
                        paymentDetail.reconcile_data.forEach((reconcile, idx) => {
                            const reconcilePath = `${paymentDetailPath}.reconcile_data.${idx}`;  // ← FIXED
                            const reconcileChangeType = this.getChangeType(reconcilePath);
                            html += '<div class="nested-item' + (reconcileChangeType ? ' diff-' + reconcileChangeType : '') + '">';
                            html += `<div class="nested-item-title">${'Installment ' + (idx + 1)}`;
                            html += '</div>';
                            html += this.renderInlineField($.fn.gettext('Value'), reconcile.reconcile_value, `${reconcilePath}.reconcile_value`, ['mask-money']);  // ← Also update this
                            html += '</div>';
                        })
                        html += '</div>';
                    }
                }
                html += '</div>';
            });
            html += '</div>';
        }

        html += '</div>';
        return html;
    },

    /**
     * Render expenses data section
     */
    renderExpensesData: function () {
        const prevExpenses = this.previousSnapshot.expenses_data || [];
        const currExpenses = this.currentSnapshot.expenses_data || [];

        if (prevExpenses.length === 0 && currExpenses.length === 0) return '';

        const maxLength = Math.max(prevExpenses.length, currExpenses.length);
        let comparisonRows = '';

        for (let i = 0; i < maxLength; i++) {
            const prevExpense = prevExpenses[i];
            const currExpense = currExpenses[i];
            const expensePath = `expenses_data.${i}`;

            comparisonRows += this.renderComparisonRow(
                this.renderExpenseItem(prevExpense, expensePath),
                this.renderExpenseItem(currExpense, expensePath)
            );
        }

        return `
            <div class="comparison-wrapper">
                <div class="row">
                    <div class="col-2 section-label">
                        Expense
                    </div>
                    <div class="col-10 comparison-content">
                        ${comparisonRows}
                    </div>
                </div>
            </div>
        `;
    },

    renderExpenseItem: function(expense, basePath) {
        if (!expense) return '<div class="no-data">No data</div>';

        const changeType = this.getChangeType(basePath);
        let html = '<div class="item-container' + (changeType ? ' diff-' + changeType : '') + '">';
        html += `<div class="item-header">${expense.title || 'N/A'}`;
        html += '</div>';
        html += this.renderInlineField('Title', expense.title, `${basePath}.title`);
        html += this.renderInlineField('Quantity', expense.quantity, `${basePath}.quantity`);
        if (expense.expense_item_data) {
            html += this.renderInlineField('Expense Item', expense.expense_item_data?.title, `${basePath}.expense_item_data.title`);
        }
        if (expense.uom_data) {
            html += this.renderInlineField('UOM', expense.uom_data?.title, `${basePath}.uom_data.title`);
        }
        html += this.renderInlineField('Price', expense.expense_price, `${basePath}.expense_price`, ['mask-money']);
        if (expense.tax_data) {
            html += this.renderInlineField('UOM', expense.tax_data?.title, `${basePath}.tax_data.title`);
        };
        html += this.renderInlineField('Subtotal', expense.expense_subtotal_price, `${basePath}.expense_subtotal_price`, ['mask-money']);
        html += '</div>';
        return html;
    },

    /**
     * Render work orders section
     */
    renderWorkOrders: function () {
        const prevWorkOrders = this.previousSnapshot.work_order_data || [];
        const currWorkOrders = this.currentSnapshot.work_order_data || [];

        if (prevWorkOrders.length === 0 && currWorkOrders.length === 0) return '';

        const maxLength = Math.max(prevWorkOrders.length, currWorkOrders.length);
        let comparisonRows = '';

        for (let i = 0; i < maxLength; i++) {
            const prevWorkOrder = prevWorkOrders[i];
            const currWorkOrder = currWorkOrders[i];
            const workOrderPath = `work_order_data.${i}`;

            comparisonRows += this.renderComparisonRow(
                this.renderWorkOrderItem(prevWorkOrder, workOrderPath),
                this.renderWorkOrderItem(currWorkOrder, workOrderPath)
            );
        }

        return `
            <div class="comparison-wrapper">
                <div class="row">
                    <div class="col-2 section-label">
                        Work Order
                    </div>
                    <div class="col-10 comparison-content">
                        ${comparisonRows}
                    </div>
                </div>
            </div>
        `;
    },

    renderWorkOrderItem: function(workOrder, basePath) {
        if (!workOrder) return '<div class="no-data">No data</div>';

        const changeType = this.getChangeType(basePath);
        let html = '<div class="item-container' + (changeType ? ' diff-' + changeType : '') + '">';
        html += `<div class="item-header">${workOrder.description || 'No data'}`;
        html += '</div>';
        html += this.renderInlineField('Start', this.formatDate(workOrder.start_date), `${basePath}.start_date`);
        html += this.renderInlineField('End', this.formatDate(workOrder.end_date), `${basePath}.end_date`);
        html += this.renderInlineField('Is Service Delivery', workOrder.is_delivery_point, `${basePath}.is_delivery_point`);
        html += this.renderInlineField('Quantity', workOrder.quantity, `${basePath}.quantity`);
        html += this.renderInlineField('Service Cost', workOrder.unit_cost, `${basePath}.unit_cost`, ['mask-money']);
        html += this.renderInlineField('Total', workOrder.total_value, `${basePath}.total_value`, ['mask-money']);

        // Render nested cost data
        if (workOrder.cost_data && workOrder.cost_data.length > 0) {
            html += '<div class="nested-items">';
            html += '<strong style="font-size: 0.85em; color: #6c757d;">Cost Details:</strong>';
            workOrder.cost_data.forEach((cost, idx) => {
                const costPath = `${basePath}.cost_data.${idx}`;
                const costChangeType = this.getChangeType(costPath);
                html += '<div class="nested-item' + (costChangeType ? ' diff-' + costChangeType : '') + '">';
                html += `<div class="nested-item-title">${cost.title || 'Cost ' + (idx + 1)}`;
                html += '</div>';
                html += this.renderInlineField($.fn.gettext('Title'), cost.title, `${costPath}.title`);
                html += this.renderInlineField($.fn.gettext('Description'), cost.description, `${costPath}.description`);
                if (cost.expense_data) {
                    html += this.renderInlineField('Expense', cost.expense_data.title, `${costPath}.expense_data.title`);
                }
                html += this.renderInlineField($.fn.gettext('Quantity'), cost.quantity, `${costPath}.quantity`);
                html += this.renderInlineField($.fn.gettext('Unit Cost'), cost.unit_cost, `${costPath}.unit_cost`, ['mask-money']);
                if (cost.currency_data) {
                    html += this.renderInlineField('Currency', cost.currency_data.title, `${costPath}.currency_data.title`);
                }
                if (cost.tax_data) {
                    html += this.renderInlineField('Tax', cost.tax_data.title, `${costPath}.tax_data.title`);
                }
                html += this.renderInlineField($.fn.gettext('Total'), cost.total_value, `${costPath}.total_value`, ['mask-money']);

                html += '</div>';
            });
            html += '</div>';
        }

        // Render nested product contribution
        if (workOrder.product_contribution_data && workOrder.product_contribution_data.length > 0) {
            html += '<div class="nested-items">';
            html += '<strong style="font-size: 0.85em; color: #6c757d;">Product Contributions:</strong>';
            workOrder.product_contribution_data.forEach((contrib, idx) => {
                const contribPath = `${basePath}.product_contribution_data.${idx}`;
                const contribChangeType = this.getChangeType(contribPath);
                html += '<div class="nested-item' + (contribChangeType ? ' diff-' + contribChangeType : '') + '">';
                html += `<div class="nested-item-title">${contrib.title || 'Product ' + (idx + 1)}`;
                html += '</div>';
                html += this.renderInlineField('Title', contrib.title, `${contribPath}.title`);
                html += this.renderInlineField('Contribution', contrib.contribution_percent, `${contribPath}.contribution_percent`);
                html += this.renderInlineField('Delivered Quantity', contrib.delivered_quantity, `${contribPath}.delivered_quantity`);
                html += this.renderInlineField('Unit Cost', contrib.unit_cost, `${contribPath}.unit_cost`, ['mask-money']);
                html += this.renderInlineField('Total Cost', contrib.total_cost, `${contribPath}.total_cost`, ['mask-money']);
                html += '</div>';
            });
            html += '</div>';
        }

        html += '</div>';
        return html;
    },

    /**
     * Render a comparison row (for multiple items)
     */
    renderComparisonRow: function(previousContent, currentContent) {
        return `
            <div class="row comparison-item-row">
                <div class="col-6">${previousContent}</div>
                <div class="col-6">${currentContent}</div>
            </div>
        `;
    },

    /**
     * Render a single comparison (for single items like basic info)
     */
    renderSingleComparison: function(previousContent, currentContent) {
        return `
            <div class="row">
                <div class="col-6">${previousContent}</div>
                <div class="col-6">${currentContent}</div>
            </div>
        `;
    },

    /**
     * Render inline field
     */
    renderInlineField: function(label, value, path, additionalClasses=[]) {
        const changeType = this.getChangeType(path);
        const diffClass = changeType ? ` diff-${changeType}` : '';
        if (additionalClasses.includes('mask-money')) {
            additionalClasses = additionalClasses.filter(c => c !== 'mask-money');
            return `<span class="field-inline${diffClass} ${additionalClasses}">
                        <strong>${label}:</strong>
                        <span class="mask-money" data-init-money="${this.formatValue(value)}"></span>
                    </span>`;
        }
        return `<span class="field-inline${diffClass} ${additionalClasses}"><strong>${label}:</strong> ${this.formatValue(value)}</span>`;
    },

    /**
     * Show error message
     */
    showErrorMessage: function (message) {
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-triangle"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        this.$canvas.find('.offcanvas-body').prepend(alertHtml);
    },

    formatDate: function (date) {
        return date ? DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", date) : '—';
    },

    formatValue: function (val) {
        if (val === null || val === undefined) return '—';
        if (typeof val === 'object') return JSON.stringify(val);
        return val;
    },
};

/**
 * Initialize on document ready
 */
$(document).ready(function () {
    VersionCompareControl.init();
});