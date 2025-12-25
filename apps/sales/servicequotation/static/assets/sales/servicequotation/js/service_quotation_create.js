class ServiceQuotationCopyCanvas {
    constructor() {
        this.$canvas = $('#offcanvas-copy-service-quotation')
        this.$table = $('#datatable-copy-service-quotation')
        this.$selectBtn = $('#btn-select-quotation-copy')
        this.currentQuotId = null
    }

    getSelectedQuotationId(){
        const self= this
        return self.currentQuotId
    }

    updateSelectedQuotationId(quotationId){
        const self= this
        self.currentQuotId = quotationId
    }

    init(){
        const self = this
        self.initDataTable()
        self.initEvents()
    }

    initDataTable(){
        const self= this
        self.$table.DataTableDefault({
            useDataServer: true,
            rowIdx: false,
            ajax: {
            url: self.$canvas.attr('data-quotation-list-url'),
                type: 'GET',
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
                        const quotationId = row['id']
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="radio" name="row-check" class="form-check-input table-row-check" id="${quotationId}" data-id="${row?.['id']}">
                                    <label class="form-check-label table-row-title" for="${quotationId}">${row?.['title']}</label>
                                </div>`;
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<span>${row?.['code'] ? row?.['code'] : '__'}</span>`;
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
                }
            ]
        })
    }

    initEvents(){
        const self= this

        //select quotation and copy data
        self.$selectBtn.on('click', async (e) => {
            const templateDetailUrl = self.$canvas.attr('data-quotation-detail')
            const detailUrl = templateDetailUrl.format_url_with_uuid(self.getSelectedQuotationId())
            await ServiceOrderPageHandler.loadServiceOrderData(detailUrl, false, false);
        })

        //select quotation
        self.$table.on('click', 'input[type="radio"]', (e)=>{
            self.updateSelectedQuotationId($(e.currentTarget).attr('data-id'))
            console.log($(e.currentTarget).attr('data-id'))
        })
    }
}

$(document).ready(async function () {
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

    WFRTControl.setWFInitialData('servicequotation')

    await ServiceOrderPageHandler.initializeCommonData();
    ServiceOrderPageHandler.initializeComponents(true)
    ServiceOrderPageHandler.registerCommonEventHandlers()
    ServiceOrderPageHandler.setupFormSubmit('#form-create-service-quotation')
    ServiceOrderPageHandler.initializeTables(false);

    initializeBastionFields()

    const serviceQuotationCopyCanvas = new ServiceQuotationCopyCanvas()
    serviceQuotationCopyCanvas.init()
})
