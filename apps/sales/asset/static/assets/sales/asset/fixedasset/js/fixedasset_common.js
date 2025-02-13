class CommonHandler{
    constructor(){
        this.$classificationSelect = $('#classification')
        this.$offsetItemSelect = $('#asset-product-code')
        this.$manageDepartmentSelect = $('#manage-department')
        this.$useDepartmentSelect = $('#use-department')
        this.$depreciationStartDateInput = $('#depreciation-start-date')
        this.$depreciationEndDateInput = $('#depreciation-end-date')
        this.$APInvoiceDatatable = $('#modal-datatable-ap-invoice')
        this.$sourceDatatable = $('#datatable-asset-source')
        this.$APInvoiceModal = $('#modal-ap-invoice')
        this.$APInvoiceDetailDatatable = $('#modal-datatable-ap-invoice-detail')
        this.$originalCostInput = $('#original-cost')
        this.$netBookValueInput = $('#net-book-value')
        this.$updateAPInvoiceValueBtn = $('#btn-update-ap-invoice-value')
        this.$accDepreciationInput = $('#accumulative-depreciation')
        this.$adjustmentFactorSelect = $('#adjustment-factor')
        this.$assetNameInput = $('#asset-name')
        this.$assetCodeInput = $('#asset-code')
        this.$sourceTypeSelect = $('#source-type')
        this.$depreciationTimeInput = $('#depreciation-time')
        this.$depreciationMethodSelect = $('#depreciation-method')
        this.$timeUnitSelect = $('#time-unit')
    }

    init(){
        $.fn.initMaskMoney2()
        this.initClassificationSelect()
        this.initOffsetItemSelect()
        this.initManageDepartmentSelect()
        this.initUseDepartmentSelect()
        this.initDateInput(this.$depreciationStartDateInput, null)
        this.initDateInput(this.$depreciationEndDateInput, null)
        this.initAPInvoiceDataTable()
        this.initSourceListDataTable()
        this.initAccumulativeDepreciation()
        this.addEventBinding()
        this.initAPInvoiceDetailDataTable()
    }

    addEventBinding(){
        this.addSourceAPInvoiceEventBinding()
        this.openModalAPInvoiceDetailEventBinding()
        this.updateAPInvoiceValueEventBinding()
        this.changeDepreciationTimeEventBinding()
        this.changeDepreciationStartDateEventBinding()
        this.changeTimeUnitEventBinding()
        this.changeDepreciationMethodEventBinding()
    }

    loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
        let opts = {'allowClear': isClear};
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }
        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    initClassificationSelect(data=[]){
        this.loadInitS2(this.$classificationSelect, data)
    }

    initOffsetItemSelect(data=[]){
        this.loadInitS2(this.$offsetItemSelect, data, {}, null, false, {res1: "code", res2: "title"})
    }

    initManageDepartmentSelect(data=[]){
        this.loadInitS2(this.$manageDepartmentSelect, data)
    }

    initUseDepartmentSelect(data=[]){
        this.loadInitS2(this.$useDepartmentSelect, data)
    }

    initDateInput($dateInput, dateData){
        if (dateData) {
            dateData = $x.fn.reformatData(
                dateData,
                $x.cls.datetime.defaultFormatDatetime,
                'DD-MM-YYYY',
                moment().format('DD-MM-YYYY')
            );
        }
        $dateInput.daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY',
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true,
            autoUpdateInput: false,
            startDate: dateData || moment(), // Default to dateData or current date
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY')).trigger('change')
        }).on('show.daterangepicker', function (ev, picker) {
            // Dynamically set startDate when the picker is opened
            if (dateData) {
                picker.setStartDate(moment(dateData, 'DD-MM-YYYY'))
            }
        });
        $dateInput.val(dateData).trigger('change');
    }

    initAPInvoiceDataTable(){
        this.$APInvoiceDatatable.DataTableDefault({
            useDataServer: true,
            dom: 't',
            ajax: {
                url: this.$APInvoiceDatatable.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['ap_invoice_list'] ? resp.data['ap_invoice_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<input type="radio" name="ap_invoice" data-id="${row?.['id']}" 
                                data-code="${row?.['code']}" data-document-no="${row?.['invoice_number']}">`;
                    }
                },
                {
                    targets: 1,
                    width: '55%',
                    render: (data, type, row) => {
                        return `<div>${row?.['title']}</div>`
                    }
                },
                 {
                    targets: 2,
                    width: '40%',
                    render: (data, type, row) => {
                        return `<div>${row?.['po_mapped']?.['title']}</div>`
                    }
                },
            ]
        })
    }

    initSourceListDataTable(data=[]){
        this.$sourceDatatable.DataTableDefault({
            data: data,
            rowIdx: true,
            reloadCurrency: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    width: '30%',
                    render: (data, type, row) => {
                        const description = row?.['description']
                        return `<input type="text" class="form-control source-description" value="${description}">`;
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control source-document-no" value="${row?.['document_no']}">`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        const transactionTypeMap = {
                            0: 'AP Invoice',
                            1: 'Journal Entry'
                        }
                        return `<span class="source-transaction-type">${transactionTypeMap[Number(row?.['transaction_type'])]}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="source-code">${row?.['code']}</span>`;
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        const value =  row?.['value'] ? row?.['value'] : '0';
                        return `<span class="mask-money source-value" data-id="${row?.['source_id']}" value="${value}">${value} VND</span>`
                    }
                },
                {
                    targets: 6,
                    width: '5%',
                    render: (data, type, row) => {
                        const dataBSTargetMap = {
                            0: '#modal-ap-invoice-detail'
                        }
                        const dataBSTarget = dataBSTargetMap[Number(row?.['transaction_type'])]
                        return `<div class="d-flex justify-content-center">
                                    <button data-id="${row?.['source_id']}" type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover open-modal" data-bs-toggle="modal" data-bs-target="${dataBSTarget}">
                                        <span class="icon"><i class="fa-regular fa-pen-to-square"></i></span>
                                    </button>
                                </div>`
                    }
                },
            ]
        })
    }

    initAccumulativeDepreciation(data){
        const value = data ? data : 0
        this.$accDepreciationInput.attr('value', value).focus().blur()
    }

    addSourceAPInvoiceEventBinding(){
        $(document).on('click', '#btn-add-ap-invoice', ()=>{
            const $curAPInvoice = $('input[name="ap_invoice"]:checked')
            if($curAPInvoice.length===0){
                return;
            }
            const code = $curAPInvoice.attr("data-code")
            const documentNo = $curAPInvoice.attr("data-document-no")
            const id = $curAPInvoice.attr("data-id")
            const table = this.$sourceDatatable.DataTable();

            // Check if the ID already exists in the table
            let exists = false;
            table.rows().every(function () {
                let rowData = this.data();
                if (rowData.source_id === id) {
                    exists = true;
                    return false;
                }
            });

            if (exists) {
                alert("This invoice has already been added.");
                return;
            }

            this.$APInvoiceModal.modal('hide')

            let data={
                'source_id': id,
                'code': code,
                'document_no': documentNo,
                'transaction_type': 0,
                'value': 0,
                'description': '',
            }
            this.$sourceDatatable.DataTable().row.add(data).draw()
        })
    }

    openModalAPInvoiceDetailEventBinding(){
        $(document).on('click', '.open-modal', (e)=>{
            const apInvoiceId = $(e.currentTarget).attr('data-id')
            this.$APInvoiceDetailDatatable.attr('data-id', apInvoiceId)
            this.initAPInvoiceDetailDataTable()
        })
    }

    initAPInvoiceDetailDataTable(){
        const apInvoiceId = this.$APInvoiceDetailDatatable.attr('data-id')
        const dataScript = $('#data-script')
        const dataApInvoiceDetailList = JSON.parse(dataScript.attr('data-apinvoice-detail-list'))
        console.log(dataApInvoiceDetailList)
        const apDetailData = dataApInvoiceDetailList[apInvoiceId]
        if (apInvoiceId){
            let url = this.$APInvoiceDetailDatatable.attr('data-url').format_url_with_uuid(apInvoiceId)
            this.$updateAPInvoiceValueBtn.attr('data-id', apInvoiceId)
            if($.fn.DataTable.isDataTable(this.$APInvoiceDetailDatatable)){
                this.$APInvoiceDetailDatatable.DataTable().destroy()
            }
            this.$APInvoiceDetailDatatable.DataTableDefault({
                useDataServer: true,
                reloadCurrency: true,
                ajax: {
                    url: url,
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.data['ap_invoice_detail']){
                                console.log(resp.data['ap_invoice_detail']?.['item_mapped'])
                                return resp.data['ap_invoice_detail']?.['item_mapped']
                            }
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        targets: 0,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<div>${row?.['product_data']?.['code']}</div>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<div>${row?.['quantity_import']}</div>`
                        }
                    },
                    {
                        targets: 2,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<div>no data</div>`
                        }
                    },
                    {
                        targets: 3,
                        width: '20%',
                        render: (data, type, row) => {
                            const totalValue = Number(row?.['product_subtotal_price']) + Number(row?.['product_tax_value'])
                            return `<span class="mask-money total-value" data-init-money="${totalValue}"></span>`
                        }
                    },
                    {
                        targets: 4,
                        width: '20%',
                        render: (data, type, row) => {
                            const apInvoiceProdId = row?.['id']
                            let dataFADetail = $('#data-script').attr('data-fixed-asset-detail')
                            if (dataFADetail){
                                dataFADetail = JSON.parse(dataFADetail)
                            }
                            let increasedFA = row?.['increased_FA_value'] ? Number(row?.['increased_FA_value']) : 0

                            if(dataFADetail?.['ap_invoice_items']){
                                const fixedAssetAPInvoiceItem = dataFADetail?.['ap_invoice_items'].find(item=>item.ap_invoice_item_id=apInvoiceProdId)
                                if(fixedAssetAPInvoiceItem){
                                    increasedFA = increasedFA - fixedAssetAPInvoiceItem?.['increased_FA_value']
                                }
                            }

                            return `<span class="mask-money prior-increased-fa" data-init-money="${increasedFA}"></span>`
                        }
                    },
                    {
                        targets: 5,
                        width: '20%',
                        render: (data, type, row) => {
                            const apInvoiceProdId = row?.['id']
                            let value = 0
                            console.log(apDetailData)
                            if(apDetailData){
                                value = apDetailData[apInvoiceProdId]
                            }
                            return `<input value="${value}" data-apinvoice-prod-id="${apInvoiceProdId}" type="text" data-id="${apInvoiceId}" class="mask-money form-control current-increased-fa">`
                        }
                    },
                ]
            })
        }
    }

    updateAPInvoiceValueEventBinding(){
        $(document).on('click', '#btn-update-ap-invoice-value', (e)=>{
            const dataScript = $('#data-script')
            const apInvoiceId = $(e.currentTarget).attr('data-id')
            let originalCost = 0
            // update source value
            const currIncreasedFA = $('.current-increased-fa[data-id="' + apInvoiceId + '"]')
            let valueNumber = 0
            let dataApInvoiceDetailList = JSON.parse(dataScript.attr('data-apinvoice-detail-list'))
            let isValid = true

            currIncreasedFA.each((id, ele) => {
                const value = Number($(ele).attr('value'))
                valueNumber += value
                const apInvoiceProdId = $(ele).attr('data-apinvoice-prod-id')
                const increasedFA = Number($(ele).closest('tr').find('.prior-increased-fa').attr('data-init-money')) || 0
                const totalValue = Number($(ele).closest('tr').find('.total-value').attr('data-init-money')) || 0
                if ((value + increasedFA) > totalValue) {
                    const text = `The sum of current increased FA (${value}) and existing increased FA (${increasedFA}) exceeds the total value (${totalValue})`
                    $.fn.notifyB({'title': '','description': text}, 'failure')
                    isValid = false
                    return false
                }

                if (!dataApInvoiceDetailList[apInvoiceId]) {
                    dataApInvoiceDetailList[apInvoiceId] = {}
                }

                dataApInvoiceDetailList[apInvoiceId][apInvoiceProdId] = value
            })
            if (!isValid) {
                return
            }
            console.log(dataApInvoiceDetailList)
            dataScript.attr('data-apinvoice-detail-list', JSON.stringify(dataApInvoiceDetailList))
            const valueText = valueNumber.toString() + ' VND'
            let updatedSourceValue = $('.source-value[data-id="' + apInvoiceId + '"]')
            updatedSourceValue.text(valueText)
            updatedSourceValue.attr('value',valueNumber)

            // update original cost
            let $sourceValues = $('.source-value')
            $sourceValues.each((id, ele)=>{
                const cost = $(ele).attr('value')
                originalCost += Number(cost)
            })
            this.$originalCostInput.attr('value', originalCost).focus({preventScroll: true}).blur()

            // update net book value
            let netBookValue = this.$originalCostInput.attr('value') - this.$accDepreciationInput.attr('value')
            this.$netBookValueInput.attr('value', netBookValue).focus({preventScroll: true}).blur()

            // update data-prod-id
            let dataProdId = currIncreasedFA.attr('data-prod-id')
            updatedSourceValue.closest('tr').find('button').attr('data-prod-id', dataProdId)
        })
    }

    changeDepreciationTimeEventBinding(){
        $(document).on('change', '#depreciation-time', (e)=>{
            this.updateEndDate();
        })
    }

    changeDepreciationStartDateEventBinding(){
        $(document).on('change', '#depreciation-start-date', (e)=>{
            this.updateEndDate();
        })
    }

    changeTimeUnitEventBinding(){
        $(document).on('change', '#time-unit', (e)=>{
            this.updateEndDate();
        })
    }

    updateEndDate(){
        const startDateStr = $('#depreciation-start-date').val();
        const timeValue = parseInt($('#depreciation-time').val(), 10);
        const timeUnit = $('#time-unit').val(); // 0 = Months, 1 = Years

        if (startDateStr && timeValue > 0) {
            const startDate = moment(startDateStr, 'DD-MM-YYYY');

            if (timeUnit === '0') {
                startDate.add(timeValue, 'months');
            } else {
                startDate.add(timeValue, 'years');
            }

            $('#depreciation-end-date').val(startDate.format('DD-MM-YYYY')).trigger('change');
        }

    }

    changeDepreciationMethodEventBinding(){
        $(document).on('change', '#depreciation-method', (e)=>{
            const methodValue = $(e.currentTarget).val();
            if (methodValue === '0') {
                this.$adjustmentFactorSelect.val(0).trigger('change')
                this.$adjustmentFactorSelect.attr('readonly', true)
            } else {
                this.$adjustmentFactorSelect.attr('readonly', false)
                this.$adjustmentFactorSelect.attr('disabled', false)
            }
        })
    }
}