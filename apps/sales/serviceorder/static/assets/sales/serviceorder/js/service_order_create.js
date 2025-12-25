class ServiceOrderCopyQuotationCanvas {
    constructor() {
        this.$canvas = $('#offcanvas-copy-service-quotation');
        this.$table = $('#datatable-copy-service-quotation');
        this.$selectBtn = $('#btn-select-quotation-copy');
        this.currentQuotationId = null;
    }

    getSelectedQuotationId() {
        return this.currentQuotationId;
    }

    updateSelectedQuotationId(quotationId) {
        this.currentQuotationId = quotationId;
    }

    init() {
        this.initDataTable();
        this.initEvents();
    }

    initDataTable() {
        const self = this;

        self.$table.DataTableDefault({
            useDataServer: true,
            rowIdx: false,
            ajax: {
                url: self.$canvas.attr('data-quotation-list-url'),
                type: 'GET',
                data: {
                    'system_status': 3
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['service_quotation_list'] ? resp.data['service_quotation_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        const quotationId = row['id'];
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="radio" name="row-check" class="form-check-input table-row-check" id="${quotationId}" data-id="${row?.['id']}">
                                    <label class="form-check-label table-row-title" for="${quotationId}">
                                        <span class="badge badge-sm badge-soft-secondary">${row?.['code'] || ''}</span><br><span>${row?.['title'] || ''}</span>
                                    </label>
                                </div>`
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        if (row?.['opportunity']?.['title'] && row?.['opportunity']?.['code']) {
                            return `<span>${row?.['opportunity']?.['title']}</span>`;
                        }
                        return `__`;
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        if (row?.['customer_data']?.['name']) {
                            return `<p>${row?.['customer_data']?.['name']}</p>`;
                        }
                        return `__`;
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                    }
                },
            ]
        });
    }

    initEvents() {
        const self = this;

        // Handle select button click - copy quotation data to service order form
        self.$selectBtn.on('click', async (e) => {
            const selectedId = self.getSelectedQuotationId();

            if (!selectedId) {
                $.fn.notifyB({'description': 'Please select a quotation first'}, 'warning')
                return;
            }

            const templateDetailUrl = self.$canvas.attr('data-quotation-detail');
            const detailUrl = templateDetailUrl.format_url_with_uuid(selectedId);

            // Show loading indicator
            WindowControl.showLoading();

            try {
                await this.loadServiceQuotationData(detailUrl)

                $.fn.notifyB({'description': 'Quotation data loaded successfully'}, 'success')
            } catch (error) {
                console.error('Error loading quotation data:', error);
                $.fn.notifyB({'description': 'Failed to load quotation data'}, 'error')
            } finally {
                WindowControl.hideLoading();
            }
        });

        // Handle quotation selection via radio button
        self.$table.on('click', 'input[type="radio"]', (e) => {
            const quotationId = $(e.currentTarget).attr('data-id');
            self.updateSelectedQuotationId(quotationId);
            console.log('Selected quotation ID:', quotationId);
        });
    }

    async loadServiceQuotationData(dataUrl){
        if(!dataUrl){
            console.log('missing data url detail')
            return false
        }
        await $.fn.callAjax2({
            url: dataUrl,
            method: 'GET',
        }).then(
            (resp)=>{
                const data = $.fn.switcherResp(resp);

                // Attachment
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: true,
                    enable_download: true,
                    data: data?.['attachment']
                });

                // Load all form data
                ServiceOrderPageHandler.loadBastionFields(data, false);
                ServiceOrderPageHandler.loadBasicFields(data);
                ServiceOrderPageHandler.loadTableData(data, false, true);

                $.fn.initMaskMoney2();
            }
        )
    }
}

$(document).ready(async function() {
    // Initialize bastion fields from URL parameters
    function initializeBastionFields() {
        const params = $x.fn.getManyUrlParameters([
            'opp_id', 'opp_title', 'opp_code',
            'inherit_id', 'inherit_title',
            'customer_id', 'customer_code', 'customer_title'
        ]);

        if (params.opp_id) {
            new $x.cls.bastionField({
                data_opp: $x.fn.checkUUID4(params.opp_id) ? [{
                    id: params.opp_id,
                    title: $x.fn.decodeURI(params.opp_title),
                    code: $x.fn.decodeURI(params.opp_code),
                    selected: true
                }] : [],
                data_inherit: $x.fn.checkUUID4(params.inherit_id) ? [{
                    id: params.inherit_id,
                    full_name: params.inherit_title,
                    selected: true
                }] : []
            }).init();

            ServiceOrderPageHandler.loadCustomerList([{
                id: params.customer_id,
                code: params.customer_code,
                name: params.customer_title
            }]);
        } else {
            new $x.cls.bastionField().init();
        }
    }

    // Set workflow initial data
    WFRTControl.setWFInitialData('serviceorder');

    // Load common data (currency, tax, UOM)
    WindowControl.showLoading();
    await ServiceOrderPageHandler.initializeCommonData();
    WindowControl.hideLoading();

    // Initialize components and tables
    ServiceOrderPageHandler.initializeComponents(true);
    ServiceOrderPageHandler.registerCommonEventHandlers();
    ServiceOrderPageHandler.setupFormSubmit('#form-create-service-order');
    ServiceOrderPageHandler.setupIndicatorCanvas('#form-create-service-order');
    ServiceOrderPageHandler.initializeTables();

    // Initialize bastion fields
    initializeBastionFields();

    // Initialize copy quotation canvas
    const serviceOrderCopyQuotationCanvas = new ServiceOrderCopyQuotationCanvas();
    serviceOrderCopyQuotationCanvas.init();
});
