class ProductAttribute {
    constructor() {
        this.selectedAttributes = {};
        this.productAttributes = [];
        this.currentRowData = null;
        this.currentRowIndex = null;
        this.currentTable = null
        this.isInitialized = false
    }

    // Initialize the product attribute system
    init() {
        if (this.isInitialized) {
            console.warn('ProductAttribute already initialized');
            return this;
        }

        this.loadSampleAttributes();
        this.bindEvents();
        this.isInitialized = true;
        return this
    }

    // Sample attributes data - Modified to include duration requirements
    loadSampleAttributes() {
        this.productAttributes = [
            {
                id: 'cpu',
                name: 'CPU',
                type: 'list',
                durationUnit: null,
                mandatory: true,
                requiresDuration: false, // List type doesn't require duration
                options: [
                    { name: 'Intel Core i5', cost: 2000 },
                    { name: 'Intel Core i7', cost: 3000 },
                    { name: 'Intel Core i9', cost: 4500 }
                ]
            },
            {
                id: 'ram',
                name: 'RAM',
                type: 'numeric',
                durationUnit: 'GB',
                mandatory: true,
                requiresDuration: true, // Numeric type requires duration
                min: 8,
                max: 64,
                increment: 8,
                costPerIncrement: 1000
            },
            {
                id: 'gpu',
                name: 'Graphics Card',
                type: 'list',
                durationUnit: null,
                mandatory: true,
                requiresDuration: false, // List type doesn't require duration
                options: [
                    { name: 'NVIDIA RTX 3060', cost: 3500 },
                    { name: 'NVIDIA RTX 3070', cost: 5000 },
                    { name: 'NVIDIA RTX 3080', cost: 7000 }
                ]
            },
            {
                id: 'storage',
                name: 'Storage',
                type: 'numeric',
                durationUnit: 'GB',
                mandatory: true,
                requiresDuration: true, // Numeric type requires duration
                min: 256,
                max: 2048,
                increment: 256,
                costPerIncrement: 500
            },
            {
                id: 'warranty',
                name: 'Extended Warranty',
                type: 'list',
                durationUnit: 'months',
                mandatory: true,
                requiresDuration: false, // List type doesn't require duration
                options: [
                    { name: '12', cost: 500 },
                    { name: '24', cost: 900 },
                    { name: '36', cost: 1200 }
                ]
            }
        ];
    }

    // Initialize default selections for mandatory attributes
    initializeDefaultSelections() {
        this.productAttributes.forEach(attr => {
            if (attr.mandatory && !this.selectedAttributes[attr.id]) {
                if (attr.type === 'list') {
                    // Select first option by default
                    const firstOption = attr.options[0];
                    const displayName = attr.durationUnit ?
                        `${firstOption.name} ${attr.durationUnit}` :
                        firstOption.name;

                    this.selectedAttributes[attr.id] = {
                        type: 'list',
                        value: displayName,
                        cost: firstOption.cost,
                        index: 0,
                        duration: 1, // Default duration for list (not used in calculation)
                        requiresDuration: false
                    };
                } else if (attr.type === 'numeric') {
                    // Select minimum value by default with duration
                    const displayValue = `${attr.min}${attr.durationUnit || ''}`;
                    this.selectedAttributes[attr.id] = {
                        type: 'numeric',
                        value: displayValue,
                        cost: 0,
                        baseCost: 0,
                        rawValue: attr.min,
                        duration: 1, // Default duration for numeric
                        requiresDuration: true
                    };
                }
            }
        });
    }

    // Bind all events
    bindEvents() {
        const self = this;

        // Handle attribute button click
        $(document).on('click', '.btn-open-product-attribute', function(e) {
            e.preventDefault();
            const $row = $(this).closest('tr');
            self.currentRowIndex = $row.index();

            // Get the DataTable instance and store it
            const $table = $row.closest('table');
            if ($table.length && $.fn.DataTable.isDataTable($table)) {
                self.currentTable = $table.DataTable();
                self.currentRowData = self.currentTable.row($row).data();

                // Load existing attributes from row data if they exist
                if (self.currentRowData && self.currentRowData.selected_attributes) {
                    self.selectedAttributes = {...self.currentRowData.selected_attributes};
                } else {
                    self.selectedAttributes = {};
                }
            } else {
                // Fallback: extract data from row HTML
                self.currentTable = null;
                self.currentRowData = self.extractRowData($row);
                self.selectedAttributes = {};
            }

            // Initialize default selections for mandatory attributes
            self.initializeDefaultSelections();

            // Render attributes in offcanvas
            self.renderAttributes();
        });

        // Handle save button click
        $(document).on('click', '#offcanvas-save-attribute-btn', function() {
            if (self.validateMandatoryAttributes()) {
                self.saveAttributes();
            }
        });

        // Handle list option selection
        $(document).on('change', '.attribute-list-option', function() {
            const attrId = $(this).data('attr-id');
            const optionIndex = $(this).val();
            const attr = self.productAttributes.find(a => a.id === attrId);
            const option = attr.options[optionIndex];

            const displayName = attr.durationUnit ?
                `${option.name} ${attr.durationUnit}` :
                option.name;

            self.selectedAttributes[attrId] = {
                type: 'list',
                value: displayName,
                cost: option.cost,
                index: parseInt(optionIndex),
                duration: 1, // Duration not used for list types
                requiresDuration: false
            };

            self.updateSummary();
        });

        // Handle numeric slider change
        $(document).on('input', '.attribute-range-slider', function() {
            const attrId = $(this).data('attr-id');
            const attr = self.productAttributes.find(a => a.id === attrId);
            const sliderValue = parseInt($(this).val());

            // Get duration value for this attribute
            const duration = parseFloat($(`#duration-${attrId}`).val()) || 1;

            self.updateNumericValue(attrId, sliderValue, attr.min, attr.increment,
                                   attr.costPerIncrement, attr.durationUnit || '', duration);
        });

        // Handle duration input change for numeric attributes
        $(document).on('input', '.attribute-duration', function() {
            const attrId = $(this).data('attr-id');
            const duration = parseFloat($(this).val()) || 1;
            const attr = self.productAttributes.find(a => a.id === attrId);

            if (attr && attr.type === 'numeric' && self.selectedAttributes[attrId]) {
                // Update the duration in selected attributes
                self.selectedAttributes[attrId].duration = duration;

                // Recalculate cost based on new duration
                const sliderValue = parseInt($(`#slider-${attrId}`).val()) || 0;
                self.updateNumericValue(attrId, sliderValue, attr.min, attr.increment,
                                       attr.costPerIncrement, attr.durationUnit || '', duration);
            }
        });
    }

    // Validate that all mandatory attributes have been set
    validateMandatoryAttributes() {
        const mandatoryAttrs = this.productAttributes.filter(attr => attr.mandatory);
        const missingAttrs = [];

        mandatoryAttrs.forEach(attr => {
            if (!this.selectedAttributes[attr.id]) {
                missingAttrs.push(attr.name);
            }
        });

        return missingAttrs.length === 0;
    }

    // Extract row data from HTML
    extractRowData($row) {
        const data = {};

        // Try to get product code/title from second column
        const $productInfo = $row.find('td:eq(1)');
        if ($productInfo.length) {
            data.code = $productInfo.find('.badge').text().trim();
            data.title = $productInfo.find('span:not(.badge)').text().trim();
        }

        data.description = $row.find('.cost-description').val() || '';
        data.quantity = $row.find('.service-quantity').val() || 1;
        data.duration = $row.find('.service-duration').val() || 1;
        data.price = $row.find('.mask-money').first().attr('data-init-money') || 0;

        return data;
    }

    // Render attributes in offcanvas
    renderAttributes() {
        const container = $('#offcanvas-product-attribute .offcanvas-body .row');
        container.empty();

        // Add title with product info if available
        if (this.currentRowData) {
            const productInfo = `
                <div class="col-12 mb-3">
                    <div class="card">
                        <div class="card-body d-flex align-items-center">
                            <span class="fs-5">
                                ${this.currentRowData.title || 'Unknown Product'}
                            </span>
                            ${this.currentRowData.code ? `<span class="badge bg-secondary ms-2">${this.currentRowData.code}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
            container.append(productInfo);
        }

        // Render each attribute
        this.productAttributes.forEach(attr => {
            const attrHtml = this.createAttributeCard(attr);
            container.append(attrHtml);
        });

        // Add summary section
        container.append(this.createSummarySection());

        // Update summary immediately
        this.updateSummary();
    }

    // Create attribute card HTML
    createAttributeCard(attr) {
        // For mandatory attributes, always show as selected
        const isSelected = attr.mandatory || this.selectedAttributes[attr.id];
        const cardSelected = isSelected ? 'selected' : '';

        let contentHtml = '';
        if (attr.type === 'list') {
            contentHtml = this.createListOptionsHtml(attr);
        } else if (attr.type === 'numeric') {
            contentHtml = this.createNumericControlHtml(attr);
        }

        return `
            <div class="col-12 mb-3">
                <div class="card attribute-card ${cardSelected}" id="attr-${attr.id}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="d-flex align-items-center gap-2">
                                <h6 class="mb-0">${attr.name}</h6>
                                <span class="badge ${attr.type === 'list' ? 'bg-primary' : 'bg-purple'} badge-sm">
                                    ${attr.type.toUpperCase()}
                                </span>
                                ${attr.requiresDuration ? '<span class="badge bg-warning badge-sm ms-1">Duration Required</span>' : ''}
                            </div>
                        </div>
                        <div class="attribute-content show" id="content-${attr.id}">
                            ${contentHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Create list options HTML
    createListOptionsHtml(attr) {
        let optionsHtml = '';
        attr.options.forEach((option, index) => {
            const displayName = attr.durationUnit ?
                `${option.name} ${attr.durationUnit}` :
                option.name;

            // Check if this option is selected (default to first if mandatory and nothing selected)
            let isChecked = false;
            if (this.selectedAttributes[attr.id]) {
                isChecked = this.selectedAttributes[attr.id].index === index;
            } else if (attr.mandatory && index === 0) {
                isChecked = true;
            }

            optionsHtml += `
                <div class="form-check list-option-item mb-2">
                    <input class="form-check-input attribute-list-option" 
                           type="radio" 
                           name="${attr.id}" 
                           value="${index}"
                           data-attr-id="${attr.id}"
                           id="option-${attr.id}-${index}"
                           ${isChecked ? 'checked' : ''}>
                    <label class="form-check-label d-flex justify-content-between align-items-center w-100" 
                           for="option-${attr.id}-${index}">
                        <span>${displayName}</span>
                        <span class="text-primary fw-bold mask-money" data-init-money="${option.cost}"></span>
                    </label>
                </div>
            `;
        });

        // Initialize mask money if the function exists
        if ($.fn.initMaskMoney2) {
            setTimeout(() => $.fn.initMaskMoney2(), 100);
        }

        return `<div class="list-options">${optionsHtml}</div>`;
    }

    // Create numeric control HTML with duration input
    createNumericControlHtml(attr) {
        const steps = (attr.max - attr.min) / attr.increment;
        let currentValue = 0;
        let displayValue = attr.min;
        let cost = 0;
        let duration = 1;

        if (this.selectedAttributes[attr.id]) {
            const savedValue = this.selectedAttributes[attr.id].rawValue || attr.min;
            currentValue = (savedValue - attr.min) / attr.increment;
            displayValue = savedValue;
            cost = this.selectedAttributes[attr.id].cost || 0;
            duration = this.selectedAttributes[attr.id].duration || 1;
        }

        return `
            <div class="numeric-control p-3 bg-light rounded">
                <div class="row mb-3">
                    <div class="col-6">
                        <label class="form-label text-muted">Duration (months)</label>
                        <input type="number" 
                               class="form-control attribute-duration" 
                               id="duration-${attr.id}"
                               data-attr-id="${attr.id}"
                               min="1" 
                               value="${duration}"
                               placeholder="Enter duration">
                    </div>
                    <div class="col-6">
                        <label class="form-label text-muted">Range</label>
                        <div class="d-flex justify-content-between">
                            <small class="text-muted">Min: ${attr.min}${attr.durationUnit || ''}</small>
                            <small class="text-muted">Max: ${attr.max}${attr.durationUnit || ''}</small>
                        </div>
                    </div>
                </div>
                <input type="range" 
                       class="form-range attribute-range-slider" 
                       id="slider-${attr.id}"
                       data-attr-id="${attr.id}"
                       min="0" 
                       max="${steps}" 
                       value="${currentValue}">
                <div class="d-flex justify-content-between mt-3">
                    <span class="fw-bold fs-5" id="value-${attr.id}">${displayValue}${attr.durationUnit || ''}</span>
                    <div class="text-end">
                        <small class="text-muted d-block">Total Cost (${duration} months)</small>
                        <span class="text-primary fw-bold fs-5 mask-money" id="cost-${attr.id}" data-init-money="${cost}">${cost}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Create summary section
    createSummarySection() {
        return `
            <div class="col-12 mt-3">
                <div class="card border-primary" id="attribute-summary">
                    <div class="card-body">
                        <h6 class="card-title text-primary mb-3">
                            <i class="fa fa-check-circle me-2"></i>Configuration Summary
                        </h6>
                        <div id="summary-content"></div>
                        <hr class="my-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bold fs-5">Total Additional Cost:</span>
                            <span class="h4 text-primary mb-0 mask-money" id="total-attr-cost" data-init-money="0"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update numeric value with duration
    updateNumericValue(attrId, sliderValue, min, increment, costPerIncrement, unit, duration = 1) {
        const value = min + (sliderValue * increment);
        const baseCost = sliderValue * costPerIncrement;
        const totalCost = baseCost * duration; // Multiply by duration

        $(`#value-${attrId}`).text(`${value}${unit}`);
        $(`#cost-${attrId}`).attr('data-init-money', totalCost);

        // Update the cost label to show duration
        $(`#cost-${attrId}`).siblings('small').text(`Total Cost (${duration} months)`);

        // Always save the value for mandatory attributes
        this.selectedAttributes[attrId] = {
            type: 'numeric',
            value: `${value}${unit}`,
            cost: totalCost,
            baseCost: baseCost, // Store base cost separately
            rawValue: value,
            duration: duration,
            requiresDuration: true
        };

        // Initialize mask money if the function exists
        if ($.fn.initMaskMoney2) {
            $.fn.initMaskMoney2();
        }

        this.updateSummary();
    }

    // Update summary to show duration info
    updateSummary() {
        const $summary = $('#attribute-summary');
        const $content = $('#summary-content');
        const $totalCost = $('#total-attr-cost');

        $content.empty();

        let totalCost = 0;
        let hasAllMandatory = true;

        // Check all attributes (including mandatory ones)
        this.productAttributes.forEach(attr => {
            const data = this.selectedAttributes[attr.id];

            if (attr.mandatory && !data) {
                hasAllMandatory = false;
                // Show placeholder for missing mandatory attribute
                const itemHtml = `
                    <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded border-danger">
                        <span class="fw-semibold text-danger">${attr.name}:</span>
                        <span class="text-danger">Not configured</span>
                    </div>
                `;
                $content.append(itemHtml);
            } else if (data) {
                const durationInfo = data.requiresDuration ? ` × ${data.duration} months` : '';
                const itemHtml = `
                    <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                        <span class="fw-semibold">${attr.name}:</span>
                        <span>
                            <span class="text-dark">${data.value}${durationInfo}</span>
                            <span class="text-primary fw-bold ms-2 mask-money" data-init-money="${data.cost}"></span>
                        </span>
                    </div>
                `;
                $content.append(itemHtml);
                totalCost += data.cost;
            }
        });

        $totalCost.attr('data-init-money', totalCost);

        // Update save button state based on mandatory fields
        const $saveBtn = $('#offcanvas-save-attribute-btn');
        if (!hasAllMandatory) {
            $saveBtn.addClass('disabled').attr('disabled', true);
        } else {
            $saveBtn.removeClass('disabled').attr('disabled', false);
        }

        // Initialize mask money if the function exists
        if ($.fn.initMaskMoney2) {
            $.fn.initMaskMoney2();
        }
    }

    // Save attributes directly to row data
    saveAttributes() {
        // Validate mandatory attributes one more time
        if (!this.validateMandatoryAttributes()) {
            return;
        }

        // Calculate total additional cost
        let totalAttrCost = this.calculateTotalAttributeCost();

        // Save directly to the DataTable row data
        if (this.currentTable && this.currentRowIndex !== null) {
            // Get the current row
            const row = this.currentTable.row(this.currentRowIndex);
            const rowData = row.data();

            // Add attributes to the row data
            rowData.selected_attributes = {...this.selectedAttributes};
            rowData.attributes_total_cost = totalAttrCost;
            rowData.has_attributes = true; // Always true now since attributes are mandatory

            // Update the row data in DataTable (without redrawing)
            row.data(rowData).invalidate('data');

            // Update the button appearance without redrawing the table
            this.updateRowButton();

            // If you need to update specific cells, you can do it here
            // For example, update the total value if needed
            // this.updateRowTotalValue(rowData, totalAttrCost);

        } else if (this.currentRowIndex !== null) {
            // Fallback: Store in DOM if DataTable is not available
            const $tables = $('table').filter(function() {
                return $(this).find('.btn-open-product-attribute').length > 0;
            });

            if ($tables.length) {
                const $row = $tables.first().find('tbody tr').eq(this.currentRowIndex);
                // Store as data attributes on the row
                $row.data('selected-attributes', this.selectedAttributes);
                $row.data('attributes-total-cost', totalAttrCost);

                this.updateRowButton();
            }
        }

        // Close offcanvas
        const offcanvasElement = document.getElementById('offcanvas-product-attribute');
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (offcanvas) {
            offcanvas.hide();
        }

        // Trigger event for other parts of the application
        $(document).trigger('productAttributeUpdate', {
            rowIndex: this.currentRowIndex,
            rowData: this.currentRowData,
            attributes: this.selectedAttributes,
            totalCost: totalAttrCost,
            table: this.currentTable
        });

        console.log('Saved attributes to row data:', {
            rowIndex: this.currentRowIndex,
            attributes: this.selectedAttributes,
            totalCost: totalAttrCost
        });
    }

    // Update row total value with attributes cost
    updateRowTotalValue(rowData, attributesCost) {
        // Find the row in the DOM
        const $tables = $('table').filter(function() {
            return $(this).find('.btn-open-product-attribute').length > 0;
        });

        if ($tables.length) {
            const $row = $tables.first().find('tbody tr').eq(this.currentRowIndex);

            // Get duration from the row (if it exists)
            const duration = parseFloat($row.find('.service-duration').val()) || 1;
            const quantity = parseInt($row.find('.service-quantity').val()) || 1;
            const basePrice = parseFloat(rowData.price) || 0;

            // Calculate new total with duration: duration * price * quantity + duration * attribute_price
            const newTotal = (duration * basePrice * quantity) + (duration * attributesCost);

            // Update the total value cell
            const $totalCells = $row.find('.mask-money');
            if ($totalCells.length >= 2) {
                const $totalCell = $totalCells.eq($totalCells.length - 1);
                $totalCell.attr('data-init-money', newTotal);

                // Initialize mask money if the function exists
                if ($.fn.initMaskMoney2) {
                    $.fn.initMaskMoney2();
                }
            }

            // Also update the row data
            rowData.total_value = newTotal;
            rowData.duration = duration;
        }
    }

    // Update the row button to show selection status
    updateRowButton() {
        // Find the table containing attribute buttons
        const $tables = $('table').filter(function() {
            return $(this).find('.btn-open-product-attribute').length > 0;
        });

        if ($tables.length) {
            const $row = $tables.first().find('tbody tr').eq(this.currentRowIndex);
            const $btn = $row.find('.btn-open-product-attribute');
            const $icon = $btn.find('i');

            // Calculate total attributes cost
            let totalAttrCost = this.calculateTotalAttributeCost();

            // Check if all mandatory attributes are configured
            const mandatoryCount = this.productAttributes.filter(attr => attr.mandatory).length;
            const configuredMandatoryCount = this.productAttributes.filter(attr =>
                attr.mandatory && this.selectedAttributes[attr.id]
            ).length;

            if (configuredMandatoryCount === mandatoryCount) {
                // All mandatory attributes configured
                $btn.removeClass('btn-soft-primary btn-soft-warning').addClass('btn-soft-success');
                $btn.attr('title', `Attributes configured - Total: ${totalAttrCost.toLocaleString()}`);
                $icon.removeClass('fa-plus fa-exclamation').addClass('fa-check');
            } else {
                // Some mandatory attributes missing
                $btn.removeClass('btn-soft-primary btn-soft-success').addClass('btn-soft-warning');
                $btn.attr('title', `Configure required attributes`);
                $icon.removeClass('fa-plus fa-check').addClass('fa-exclamation');
            }

            // Update or add money badge
            let $badge = $btn.parent().find('.attribute-badge');
            if (totalAttrCost > 0) {
                if (!$badge.length) {
                    $btn.parent().append(`
                        <span class="attribute-badge badge bg-info ms-1 mask-money" data-init-money="${totalAttrCost}">
                            ${totalAttrCost.toLocaleString()}
                        </span>
                    `);
                } else {
                    $badge.attr('data-init-money', totalAttrCost);
                    $badge.text(totalAttrCost.toLocaleString());
                }

                // Initialize mask money if the function exists
                if ($.fn.initMaskMoney2) {
                    $.fn.initMaskMoney2();
                }
            } else if ($badge.length) {
                $badge.remove();
            }
        }
    }

    // Calculate total attribute cost (with individual durations already applied)
    calculateTotalAttributeCost() {
        let totalCost = 0;

        for (const [attrId, data] of Object.entries(this.selectedAttributes)) {
            if (data && data.cost) {
                // Cost already includes duration for numeric attributes
                totalCost += data.cost;
            }
        }

        return totalCost;
    }

    // Calculate attribute price with duration passed in
    calculateAttributePriceWithDuration(duration = 1) {
        let totalAttributePrice = 0;

        // Iterate through all selected attributes
        for (const [attrId, data] of Object.entries(this.selectedAttributes)) {
            if (data && data.cost) {
                totalAttributePrice += data.cost;
            }
        }

        // Return total multiplied by duration
        return totalAttributePrice * duration;
    }

    // Static method to calculate attribute price for a row
    static calculateAttributePriceForRow(rowData, duration = 1) {
        if (!rowData || !rowData.selected_attributes) {
            return 0;
        }

        let totalAttributePrice = 0;

        for (const [attrId, data] of Object.entries(rowData.selected_attributes)) {
            if (data && data.cost) {
                totalAttributePrice += data.cost;
            }
        }

        return totalAttributePrice * duration;
    }

    // Get attributes cost breakdown by type
    getAttributeCostBreakdown() {
        const breakdown = {
            listAttributes: [],
            numericAttributes: [],
            totalListCost: 0,
            totalNumericCost: 0,
            grandTotal: 0
        };

        for (const [attrId, data] of Object.entries(this.selectedAttributes)) {
            if (data) {
                const attrInfo = {
                    id: attrId,
                    value: data.value,
                    cost: data.cost,
                    duration: data.duration || 1
                };

                if (data.type === 'list') {
                    breakdown.listAttributes.push(attrInfo);
                    breakdown.totalListCost += data.cost;
                } else if (data.type === 'numeric') {
                    breakdown.numericAttributes.push(attrInfo);
                    breakdown.totalNumericCost += data.cost;
                }
            }
        }

        breakdown.grandTotal = breakdown.totalListCost + breakdown.totalNumericCost;
        return breakdown;
    }

    // Helper method to check if all mandatory attributes are configured for a row
    hasAllMandatoryAttributes(rowIndex) {
        const rowData = this.getRowData(rowIndex);
        if (!rowData || !rowData.selected_attributes) {
            return false;
        }

        const mandatoryAttrs = this.productAttributes.filter(attr => attr.mandatory);
        return mandatoryAttrs.every(attr => rowData.selected_attributes[attr.id]);
    }

    // Helper method to get row data
    getRowData(rowIndex) {
        if (this.currentTable) {
            return this.currentTable.row(rowIndex).data();
        }
        return null;
    }

    // Helper method to get row attributes from DataTable
    getRowAttributes(rowIndex) {
        const rowData = this.getRowData(rowIndex);
        return rowData ? rowData.selected_attributes : null;
    }

    // Helper method to get total attributes cost for a row
    getRowAttributesTotalCost(rowIndex) {
        const rowData = this.getRowData(rowIndex);
        return rowData ? (rowData.attributes_total_cost || 0) : 0;
    }

    // Helper method to get total attribute cost with duration for a specific row
    getTotalAttributeCostWithDuration(rowIndex, duration = 1) {
        const rowData = this.getRowData(rowIndex);
        if (!rowData || !rowData.selected_attributes) {
            return 0;
        }

        let totalCost = 0;
        for (const [attrId, data] of Object.entries(rowData.selected_attributes)) {
            if (data && data.cost) {
                totalCost += data.cost;
            }
        }

        return totalCost * duration;
    }

    // Static method for rendering button (keeping your existing structure)
    static renderProductAttributeButton(rowData) {
        // Check if an instance exists, if not create and initialize one
        if (!window.productAttributeInstance) {
            window.productAttributeInstance = new ProductAttribute()
            window.productAttributeInstance.init()
        }

        // Check if attribute data exists
        const hasAttributes = rowData && rowData.selected_attributes &&
                            Object.keys(rowData.selected_attributes).length > 0;
        const totalCost = rowData && rowData.attributes_total_cost ? rowData.attributes_total_cost : 0;

        if (hasAttributes) {
            // Button with configured attributes - show check icon and total cost
            return `<div class="d-flex align-items-center justify-content-between">
                        <button 
                            type="button" 
                            class="btn btn-icon btn-rounded btn-soft-success btn-xs btn-open-product-attribute"
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#offcanvas-product-attribute" 
                            title="Edit attributes - Total: ${totalCost.toLocaleString()}"
                        >
                            <span class="icon"><i class="fa-solid fa-check"></i></span>
                        </button>
                        ${totalCost > 0 ? `<span class="attribute-badge badge bg-info ms-1 mask-money" data-init-money="${totalCost}">${totalCost.toLocaleString()}</span>` : ''}
                    </div>`;
        } else {
            // Button without configured attributes - show warning/add icon
            return `<div class="d-flex align-items-center justify-content-between">
                        <button 
                            type="button" 
                            class="btn btn-icon btn-rounded btn-soft-primary btn-xs btn-open-product-attribute"
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#offcanvas-product-attribute" 
                            title="Configure required attributes"
                        >
                            <span class="icon"><i class="fa-solid fa-exclamation"></i></span>
                        </button>
                    </div>`;
        }
    }
}