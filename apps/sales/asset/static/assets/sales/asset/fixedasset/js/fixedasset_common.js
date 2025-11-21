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
        this.$depreciationValueInput = $('#depreciation-value')
        this.$depreciationDatatable = $('#datatable-depreciation')
        this.$depreciationTableArea = $('#table-depreciation-area')

        this.$transScript = $('#trans-script')
    }

    init(isUpdate=false){
        $.fn.initMaskMoney2()
        this.initClassificationSelect()
        this.initOffsetItemSelect()
        this.initManageDepartmentSelect()
        this.initUseDepartmentSelect()

        this.initDateInput(this.$depreciationStartDateInput, null)
        this.initDateInput(this.$depreciationEndDateInput, null)
        this.initMaskMoneyInput(this.$accDepreciationInput, 0)

        this.initAPInvoiceDataTable()
        if(!isUpdate){
            this.initSourceListDataTable()
        }
        this.initAPInvoiceDetailDataTable()

        this.addEventBinding()
    }

    addEventBinding(){
        this.addSourceAPInvoiceEventBinding()
        this.openModalAPInvoiceDetailEventBinding()
        this.updateAPInvoiceValueEventBinding()
        this.changeDepreciationTimeEventBinding()
        this.changeDepreciationStartDateEventBinding()
        this.changeTimeUnitEventBinding()
        this.changeDepreciationMethodEventBinding()
        this.loadDepreciationEventBinding()
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
    }

    // ----selects----
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

    triggerChangeSelect($selector, data=null){
        $selector.val(data).trigger('change')
    }

    // ----inputs----
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

    initInput($selector, data=null){
        $selector.val(data)
    }

    initMaskMoneyInput($selector, data=null){
        $selector.attr('value', data).focus({preventScroll: true}).blur()
    }

    // datatables
    initAPInvoiceDataTable(){
        this.$APInvoiceDatatable.DataTableDefault({
            useDataServer: true,
            dom: 't',
            ajax: {
                url: this.$APInvoiceDatatable.attr('data-url'),
                type: 'GET',
                data: {
                    'purchase_order_mapped__purchase_requests__request_for': 2
                },
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
                        return `<div>${row?.['purchase_order_mapped_data']?.['title']}</div>`
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
                        return `<span class="mask-money source-value" data-id="${row?.['source_id']}" value="${value}" data-init-money="${value}"></span>`
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

    initAPInvoiceDetailDataTable(){
        const apInvoiceId = this.$APInvoiceDetailDatatable.attr('data-id')
        const dataScript = $('#data-script')
        const dataApInvoiceDetailList = JSON.parse(dataScript.attr('data-apinvoice-detail-list'))
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
                scrollX: true,
                ajax: {
                    url: url,
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.data['ap_invoice_detail']){
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
                            return `<div>${row?.['product_data']['code'] || '--'}</div>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<div>${row?.['product_quantity']}</div>`
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
                        width: '15%',
                        render: (data, type, row) => {
                            const totalValue = Number(row?.['product_subtotal'])
                            return `<span class="mask-money total-value" data-init-money="${totalValue}"></span>`
                        }
                    },
                    {
                        targets: 4,
                        width: '15%',
                        render: (data, type, row) => {
                            const totalValueAfterTax = Number(row?.['product_subtotal']) + Number(row?.['product_tax_value'])
                            return `<span class="mask-money total-value-after-tax" data-init-money="${totalValueAfterTax}"></span>`
                        }
                    },
                    {
                        targets: 5,
                        width: '15%',
                        render: (data, type, row) => {
                            const apInvoiceProdId = row?.['id']
                            let dataFADetail = $('#data-script').attr('data-fixed-asset-detail')
                            if (dataFADetail){
                                dataFADetail = JSON.parse(dataFADetail)
                            }
                            let increasedFA = row?.['increased_FA_value'] ? Number(row?.['increased_FA_value']) : 0

                            if(dataFADetail?.['ap_invoice_items']){
                                const fixedAssetAPInvoiceItem = dataFADetail?.['ap_invoice_items'].find(item=>item.ap_invoice_item_id===apInvoiceProdId)
                                if(fixedAssetAPInvoiceItem){
                                    increasedFA = increasedFA - fixedAssetAPInvoiceItem?.['increased_FA_value']
                                }
                            }

                            return `<span class="mask-money prior-increased-fa" data-init-money="${increasedFA}"></span>`
                        }
                    },
                    {
                        targets: 6,
                        width: '15%',
                        render: (data, type, row) => {
                            const apInvoiceProdId = row?.['id']
                            let value = 0
                            if(apDetailData){
                                value = apDetailData[apInvoiceProdId]
                            } else {
                               let dataFADetail = $('#data-script').attr('data-fixed-asset-detail')
                                if (dataFADetail){
                                    dataFADetail = JSON.parse(dataFADetail)
                                }
                                if(dataFADetail?.['ap_invoice_items']){
                                    const fixedAssetAPInvoiceItem = dataFADetail?.['ap_invoice_items'].find(item=>item.ap_invoice_item_id===apInvoiceProdId)
                                    if(fixedAssetAPInvoiceItem){
                                        value= fixedAssetAPInvoiceItem?.['increased_FA_value']
                                    }
                                }
                            }
                            return `<input value="${value}" data-apinvoice-prod-id="${apInvoiceProdId}" type="text" data-id="${apInvoiceId}" class="mask-money form-control current-increased-fa">`
                        }
                    },
                ]
            })
        }
    }

    initDepreciationDatable(){
        const data = this.getDepreciationData()

        if ($.fn.DataTable.isDataTable(this.$depreciationDatatable)){
            this.$depreciationDatatable.DataTable().destroy()
        }
        this.$depreciationDatatable.DataTableDefault({
            reloadCurrency: true,
            data: data,
            columns: [
                {
                    targets: 0,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['month']}</div>`;
                    }
                },
                {
                    targets: 1,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['begin']}</div>`;
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['end']}</div>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        let beginNetValue = row?.['start_value']
                        return `<span class="mask-money" data-init-money="${beginNetValue}"></span>`
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        let depreciationValue = row?.['depreciation_value']
                        return `<span class="mask-money" data-init-money="${depreciationValue}"></span>`
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        let endNetValue = row?.['end_value']
                        return `<span class="mask-money" data-init-money="${endNetValue}"></span>`
                    }
                },
            ],
            drawCallback: ()=>{
                this.$depreciationTableArea.prop('hidden', false)
                $.fn.initMaskMoney2()
            }
        })


    }

    // event handler
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

            // validate currFAVAlue
            currIncreasedFA.each((id, ele) => {
                const currIncreaseValue = Number($(ele).attr('value'))
                const apInvoiceProdId = $(ele).attr('data-apinvoice-prod-id')
                const increasedFA = Number($(ele).closest('tr').find('.prior-increased-fa').attr('data-init-money')) || 0
                const totalValue = Number($(ele).closest('tr').find('.total-value').attr('data-init-money')) || 0

                if(currIncreaseValue<0){
                    const text = this.$transScript.attr('data-increase-must-positive')
                    $.fn.notifyB({'title': '','description': text}, 'failure')
                    isValid = false
                    return false
                }

                //  check if value + increasedFA > totalValue
                if ((currIncreaseValue + increasedFA) > totalValue) {
                    const text = this.$transScript.attr('data-sum-exceed-total-value')
                    $.fn.notifyB({'title': '','description': text}, 'failure')
                    isValid = false
                    return false
                }

                if (!dataApInvoiceDetailList[apInvoiceId]) {
                    dataApInvoiceDetailList[apInvoiceId] = {}
                }
                dataApInvoiceDetailList[apInvoiceId][apInvoiceProdId] = currIncreaseValue

                valueNumber += currIncreaseValue
            })

            if (!isValid) {
                return
            }
            dataScript.attr('data-apinvoice-detail-list', JSON.stringify(dataApInvoiceDetailList))
            let updatedSourceValue = $('.source-value[data-id="' + apInvoiceId + '"]')
            updatedSourceValue.attr('data-init-money', valueNumber)
            updatedSourceValue.attr('value', valueNumber)
            $.fn.initMaskMoney2()

            // update original cost
            let $sourceValues = $('.source-value')
            $sourceValues.each((id, ele)=>{
                const cost = $(ele).attr('data-init-money')
                originalCost += Number(cost)
            })
            this.$originalCostInput.attr('value', originalCost).focus({preventScroll: true}).blur()

            // update net book value
            let netBookValue = this.$originalCostInput.attr('value') - this.$accDepreciationInput.attr('value')
            this.$netBookValueInput.attr('value', netBookValue).focus({preventScroll: true}).blur()
            $.fn.initMaskMoney2()
        })
    }

    changeDepreciationTimeEventBinding(){
        $(document).on('input', '#depreciation-time', (e)=>{
            this.updateEndDate()
        })
    }

    changeDepreciationStartDateEventBinding(){
        $(document).on('change', '#depreciation-start-date', (e)=>{
            this.updateEndDate()
        })
    }

    changeTimeUnitEventBinding(){
        $(document).on('change', '#time-unit', (e)=>{
            this.updateEndDate()
        })
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

    loadDepreciationEventBinding(){
        $(document).on('click', '#load-depreciation-btn', (e)=>{
            let isValid = this.isInputEmpty(this.$netBookValueInput)
                        && this.isInputEmpty(this.$depreciationStartDateInput)
                        && this.isInputEmpty(this.$depreciationEndDateInput)
            if (isValid){
                this.initDepreciationDatable()
            }
        })
    }

    // setup form
    setupFormData(form) {
        let tmpData = form.dataForm['depreciation_start_date'];
        form.dataForm['depreciation_start_date'] = tmpData.split('-').reverse().join('-');
        tmpData = this.$depreciationEndDateInput.val()

        form.dataForm['depreciation_end_date'] = tmpData.split('-').reverse().join('-');

        form.dataForm['increase_fa_list'] = JSON.parse($('#data-script').attr('data-apinvoice-detail-list'))

        let result=[]
        this.$sourceDatatable.DataTable().rows().every(function(){
            let row = $(this.node());
            const description = row.find('.source-description').val()
            const documentNo = row.find('.source-document-no').val()
            const transactionType = row.find('.source-transaction-type').text()
            const code = row.find('.source-code').text()
            const value = row.find('.source-value').attr('value')
            result.push({
                'description': description,
                'document_no': documentNo,
                'transaction_type': transactionType === 'AP Invoice' ? 0 : 1,
                'code': code,
                'value': value
            })
        })
        form.dataForm['asset_sources'] = result

        tmpData = this.$originalCostInput.attr('value')
        form.dataForm['original_cost'] = tmpData

        tmpData = this.$netBookValueInput.attr('value')
        form.dataForm['net_book_value'] = tmpData

        tmpData = this.$accDepreciationInput.attr('value')
        form.dataForm['accumulative_depreciation'] = tmpData

        tmpData = this.$depreciationValueInput.attr('value')
        form.dataForm['depreciation_value'] = tmpData

        tmpData = form.dataForm['depreciation_time']
        form.dataForm['depreciation_time'] = Number(tmpData)

        if (form.dataForm['depreciation_method']===0){
            delete form.dataForm['adjustment_factor']
        }

        tmpData = this.getDepreciationData()
        form.dataForm['depreciation_data'] =  tmpData
    }

    setupFormSubmit($formSubmit) {
        SetupFormSubmit.call_validate($formSubmit, {
            onsubmit: true,
            submitHandler: (form, event) => {
                let _form = new SetupFormSubmit($formSubmit);
                this.setupFormData(_form)
                WFRTControl.callWFSubmitForm(_form)
            }
        })
    }

    // detail page
    fetchDetailData(disabledFields=false){
        $.fn.callAjax2({
            url: this.$formSubmit.attr('data-url'),
            method:'GET',
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                if (data) {
                    $x.fn.renderCodeBreadcrumb(data);
                    $.fn.compareStatusShowPageAction(data);

                    $('#data-script').attr('data-fixed-asset-detail', JSON.stringify(data))
                    this.initInput(this.$assetNameInput, data?.['title'])
                    this.initInput(this.$assetCodeInput, data?.['asset_code'])
                    this.initInput(this.$depreciationTimeInput, data?.['depreciation_time'])
                    this.initMaskMoneyInput(this.$originalCostInput, data?.['original_cost'])
                    this.initMaskMoneyInput(this.$accDepreciationInput, data?.['accumulative_depreciation'])
                    this.initMaskMoneyInput(this.$netBookValueInput, data?.['net_book_value'])
                    this.initMaskMoneyInput(this.$depreciationValueInput, data?.['depreciation_value'])
                    this.initDateInput(this.$depreciationStartDateInput, data?.['depreciation_start_date'])
                    this.initDateInput(this.$depreciationEndDateInput, data?.['depreciation_end_date'])

                    this.initOffsetItemSelect([data?.['product']])
                    this.initManageDepartmentSelect([data?.['manage_department']])
                    this.initUseDepartmentSelect(data?.['use_department'])
                    this.initClassificationSelect([data?.['classification']])

                    this.triggerChangeSelect(this.$sourceTypeSelect, data?.['source_type'])
                    this.triggerChangeSelect(this.$depreciationMethodSelect, data?.['depreciation_method'])
                    this.triggerChangeSelect(this.$adjustmentFactorSelect, data?.['adjustment_factor'])
                    this.triggerChangeSelect(this.$timeUnitSelect, data?.['depreciation_time_unit'])

                    this.initSourceListDataTable(data?.['asset_sources'])
                    this.openModalAPInvoiceDetailEventBinding()
                    this.loadDepreciationEventBinding()
                }
            },
            (errs) => {
                if(errs.data.errors){
                    for (const [key, value] of Object.entries(errs.data.errors)) {
                        $.fn.notifyB({title: key, description: value}, 'failure')
                    }
                } else {
                    $.fn.notifyB('Error', 'failure')
                }
            })
            .then(() => {
                UsualLoadPageFunction.DisablePage(disabledFields, ['.open-modal', '.btn-close', '#load-depreciation-btn'])
            })
    }

    //common function
    updateEndDate(){
        const startDateStr = $('#depreciation-start-date').val();
        const timeValue = parseInt($('#depreciation-time').val(), 10)
        const timeUnit = $('#time-unit').val(); // 0 = Months, 1 = Years

        if (startDateStr && timeValue > 0) {
            const startDate = moment(startDateStr, 'DD-MM-YYYY');

            if (timeUnit === '0') {
                startDate.add(timeValue, 'months');
            } else {
                startDate.add(timeValue, 'years');
            }

            startDate.subtract(1, 'days')

            $('#depreciation-end-date').val(startDate.format('DD-MM-YYYY')).trigger('change');
        }
    }

    isInputEmpty($ele){
        return !!$ele.val()
    }

    getDepreciationData(){
        const depreciationMethod = this.$depreciationMethodSelect.val()
        let depreciationTime = 0
        const depreciationTimeUnit = this.$timeUnitSelect.val()
        if (depreciationTimeUnit == 0){
            depreciationTime = this.$depreciationTimeInput.val()
        } else {
            depreciationTime = Number(this.$depreciationTimeInput.val())*12
        }
        let startDate = this.$depreciationStartDateInput.val().split('-').join('/')
        let endDate = this.$depreciationEndDateInput.val().split('-').join('/')
        const netBookValue = this.$depreciationValueInput.attr('value')
        const adjustmentFactor = depreciationMethod == 1 ? this.$adjustmentFactorSelect.val() : null
        const data = DepreciationControl.callDepreciation({
            method: Number(depreciationMethod),
            months: Number(depreciationTime),
            start_date: startDate,
            end_date: endDate,
            price: Number(netBookValue),
            adjust: Number(adjustmentFactor)
        })
        return data
    }
}