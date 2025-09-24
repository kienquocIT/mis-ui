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

    // Sample attributes data - You can modify this based on your needs
    loadSampleAttributes() {
        this.productAttributes = [
            {
                id: 'cpu',
                name: 'CPU',
                type: 'list',
                durationUnit: null,
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
                options: [
                    { name: '12', cost: 500 },
                    { name: '24', cost: 900 },
                    { name: '36', cost: 1200 }
                ]
            }
        ];
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

            // Render attributes in offcanvas
            self.renderAttributes();
        });

        // Handle save button click
        $(document).on('click', '#offcanvas-save-attribute-btn', function() {
            self.saveAttributes();
        });

        // Handle attribute toggle
        $(document).on('click', '.attribute-toggle', function() {
            const attrId = $(this).data('attr-id');
            self.toggleAttribute(attrId);
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
                index: parseInt(optionIndex)
            };

            self.updateSummary();
        });

        // Handle numeric slider change
        $(document).on('input', '.attribute-range-slider', function() {
            const attrId = $(this).data('attr-id');
            const attr = self.productAttributes.find(a => a.id === attrId);
            const sliderValue = parseInt($(this).val());

            self.updateNumericValue(attrId, sliderValue, attr.min, attr.increment,
                                   attr.costPerIncrement, attr.durationUnit || '');
        });
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
                    <div class="alert alert-info p-5 d-flex align-items-center">
                        <span class="fs-5">
                            ${this.currentRowData.title || 'Unknown Product'}
                        </span>
                        ${this.currentRowData.code ? `<span class="badge bg-secondary ms-2">${this.currentRowData.code}</span>` : ''}
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

        // Update summary immediately if there are selected attributes
        if (Object.keys(this.selectedAttributes).length > 0) {
            this.updateSummary();
        }
    }

    // Create attribute card HTML
    createAttributeCard(attr) {
        const isSelected = this.selectedAttributes[attr.id] ? true : false;
        const isActive = isSelected ? 'checked' : '';
        const showContent = isSelected ? 'show' : '';
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
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input attribute-toggle" 
                                       type="checkbox" 
                                       data-attr-id="${attr.id}"
                                       ${isActive}>
                            </div>
                        </div>
                        <div class="attribute-content ${showContent}" id="content-${attr.id}">
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

            const isChecked = this.selectedAttributes[attr.id] &&
                             this.selectedAttributes[attr.id].index === index ? 'checked' : '';

            optionsHtml += `
                <div class="form-check list-option-item mb-2">
                    <input class="form-check-input attribute-list-option" 
                           type="radio" 
                           name="${attr.id}" 
                           value="${index}"
                           data-attr-id="${attr.id}"
                           id="option-${attr.id}-${index}"
                           ${isChecked}>
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

    // Create numeric control HTML
    createNumericControlHtml(attr) {
        const steps = (attr.max - attr.min) / attr.increment;
        let currentValue = 0;
        let displayValue = attr.min;
        let cost = 0;

        if (this.selectedAttributes[attr.id]) {
            const savedValue = this.selectedAttributes[attr.id].rawValue || attr.min;
            currentValue = (savedValue - attr.min) / attr.increment;
            displayValue = savedValue;
            cost = this.selectedAttributes[attr.id].cost || 0;
        }

        return `
            <div class="numeric-control p-3 bg-light rounded">
                <div class="d-flex justify-content-between mb-2">
                    <small class="text-muted">Min: ${attr.min}${attr.durationUnit || ''}</small>
                    <small class="text-muted">Max: ${attr.max}${attr.durationUnit || ''}</small>
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
                    <span class="text-primary fw-bold fs-5 mask-money" id="cost-${attr.id}" data-init-money="${cost}">${cost}</span>
                </div>
            </div>
        `;
    }

    // Create summary section
    createSummarySection() {
        return `
            <div class="col-12 mt-3">
                <div class="card border-primary" id="attribute-summary" style="display: none;">
                    <div class="card-body">
                        <h6 class="card-title text-primary mb-3">
                            <i class="fa fa-check-circle me-2"></i>Selected Attributes
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

    // Toggle attribute selection
    toggleAttribute(attrId) {
        const $toggle = $(`.attribute-toggle[data-attr-id="${attrId}"]`);
        const $card = $(`#attr-${attrId}`);
        const $content = $(`#content-${attrId}`);

        if ($toggle.prop('checked')) {
            $card.addClass('selected');
            $content.addClass('show');
        } else {
            $card.removeClass('selected');
            $content.removeClass('show');

            // Remove from selected attributes
            delete this.selectedAttributes[attrId];

            // Reset the inputs
            const attr = this.productAttributes.find(a => a.id === attrId);
            if (attr.type === 'list') {
                $card.find('input[type="radio"]').prop('checked', false);
            } else if (attr.type === 'numeric') {
                $(`#slider-${attrId}`).val(0);
                $(`#value-${attrId}`).text(`${attr.min}${attr.durationUnit || ''}`);
                $(`#cost-${attrId}`).attr('data-init-money', 0);
            }
        }

        this.updateSummary();
    }

    // Update numeric value
    updateNumericValue(attrId, sliderValue, min, increment, costPerIncrement, unit) {
        const value = min + (sliderValue * increment);
        const cost = sliderValue * costPerIncrement;

        $(`#value-${attrId}`).text(`${value}${unit}`);
        $(`#cost-${attrId}`).attr('data-init-money', cost);

        if (sliderValue > 0) {
            this.selectedAttributes[attrId] = {
                type: 'numeric',
                value: `${value}${unit}`,
                cost: cost,
                rawValue: value
            };
        } else {
            delete this.selectedAttributes[attrId];
        }

        // Initialize mask money if the function exists
        if ($.fn.initMaskMoney2) {
            $.fn.initMaskMoney2();
        }

        this.updateSummary();
    }

    // Update summary
    updateSummary() {
        const $summary = $('#attribute-summary');
        const $content = $('#summary-content');
        const $totalCost = $('#total-attr-cost');

        if (Object.keys(this.selectedAttributes).length === 0) {
            $summary.hide();
            return;
        }

        $summary.show();
        $content.empty();

        let totalCost = 0;

        for (const [attrId, data] of Object.entries(this.selectedAttributes)) {
            const attr = this.productAttributes.find(a => a.id === attrId);
            if (!attr) continue;

            const itemHtml = `
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <span class="fw-semibold">${attr.name}:</span>
                    <span>
                        <span class="text-dark">${data.value}</span>
                        <span class="text-primary fw-bold ms-2 mask-money" data-init-money="${data.cost}"></span>
                    </span>
                </div>
            `;
            $content.append(itemHtml);
            totalCost += data.cost;
        }

        $totalCost.attr('data-init-money', totalCost);

        // Initialize mask money if the function exists
        if ($.fn.initMaskMoney2) {
            $.fn.initMaskMoney2();
        }
    }

    // Save attributes directly to row data
    saveAttributes() {
        // Calculate total additional cost
        let totalAttrCost = 0;
        for (const [attrId, data] of Object.entries(this.selectedAttributes)) {
            totalAttrCost += data.cost;
        }

        // Save directly to the DataTable row data
        if (this.currentTable && this.currentRowIndex !== null) {
            // Get the current row
            const row = this.currentTable.row(this.currentRowIndex);
            const rowData = row.data();

            // Add attributes to the row data
            rowData.selected_attributes = {...this.selectedAttributes};
            rowData.attributes_total_cost = totalAttrCost;
            rowData.has_attributes = Object.keys(this.selectedAttributes).length > 0;

            // Update the row data in DataTable (without redrawing)
            row.data(rowData).invalidate('data');

            // Update the button appearance without redrawing the table
            this.updateRowButton();

            // If you need to update specific cells, you can do it here
            // For example, update the total value if needed
            this.updateRowTotalValue(rowData, totalAttrCost);

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
        $(document).trigger('attributesUpdated', {
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
            const quantity = parseInt($row.find('.service-quantity').val()) || 1;
            const basePrice = parseFloat(rowData.price) || 0;

            // Calculate new total with attributes
            const newTotal = (basePrice * quantity) + attributesCost;

            // Update the total value cell (usually the second to last column with mask-money)
            const $totalCells = $row.find('.mask-money');
            if ($totalCells.length >= 2) {
                // Assuming the total is in one of the last mask-money elements
                const $totalCell = $totalCells.eq($totalCells.length - 1);
                $totalCell.attr('data-init-money', newTotal);

                // Initialize mask money if the function exists
                if ($.fn.initMaskMoney2) {
                    $.fn.initMaskMoney2();
                }
            }

            // Also update the row data
            rowData.total_value = newTotal;
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

            if (Object.keys(this.selectedAttributes).length > 0) {
                $btn.removeClass('btn-soft-primary').addClass('btn-soft-success');
                $btn.attr('title', `${Object.keys(this.selectedAttributes).length} attributes selected`);
                $icon.removeClass('fa-plus').addClass('fa-check');

                // Add or update badge
                let $badge = $btn.parent().find('.attribute-badge');
                if (!$badge.length) {
                    $btn.parent().append(`
                        <span class="attribute-badge badge bg-success ms-1">
                            ${Object.keys(this.selectedAttributes).length}
                        </span>
                    `);
                } else {
                    $badge.text(Object.keys(this.selectedAttributes).length);
                }
            } else {
                $btn.removeClass('btn-soft-success').addClass('btn-soft-primary');
                $btn.attr('title', 'Add attributes');
                $icon.removeClass('fa-check').addClass('fa-plus');
                $btn.parent().find('.attribute-badge').remove();
            }
        }
    }

    // Helper method to get row attributes from DataTable
    getRowAttributes(rowIndex) {
        if (this.currentTable) {
            const rowData = this.currentTable.row(rowIndex).data();
            return rowData ? rowData.selected_attributes : null;
        }
        return null;
    }

    // Helper method to get total attributes cost for a row
    getRowAttributesTotalCost(rowIndex) {
        if (this.currentTable) {
            const rowData = this.currentTable.row(rowIndex).data();
            return rowData ? (rowData.attributes_total_cost || 0) : 0;
        }
        return 0;
    }

    // Static method for rendering button (keeping your existing structure)
    static renderProductAttributeButton() {
        // Check if an instance exists, if not create and initialize one
        if (!window.productAttributeInstance) {
            window.productAttributeInstance = new ProductAttribute()
            window.productAttributeInstance.init()
        }

        return `<div class="d-flex align-items-center justify-content-between">
                    <button 
                        type="button" 
                        class="btn btn-icon btn-rounded btn-soft-primary btn-xs btn-open-product-attribute"
                        data-bs-toggle="offcanvas" 
                        data-bs-target="#offcanvas-product-attribute" 
                        title="Add attributes"
                    >
                        <span class="icon"><i class="fa-solid fa-plus"></i></span>
                    </button>
                </div>`;
    }
}