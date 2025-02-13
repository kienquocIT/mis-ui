$(document).ready(function () {
    class UpdateHandler extends CommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-fixed-asset')
        }

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

            tmpData = form.dataForm['depreciation_time']
            form.dataForm['depreciation_time'] = Number(tmpData)

            if (form.dataForm['depreciation_method']===0){
                delete form.dataForm['adjustment_factor']
            }
        }

        setupFormSubmit() {
            SetupFormSubmit.call_validate(this.$formSubmit, {
                onsubmit: true,
                submitHandler: (form, event) => {
                    let _form = new SetupFormSubmit(this.$formSubmit);
                    this.setupFormData(_form)
                    WFRTControl.callWFSubmitForm(_form)
                }
            })
        }

        init() {
            $.fn.initMaskMoney2()
            this.initClassificationSelect()
            this.initOffsetItemSelect()
            this.initManageDepartmentSelect()
            this.initUseDepartmentSelect()
            this.initDateInput(this.$depreciationStartDateInput, null)
            this.initDateInput(this.$depreciationEndDateInput, null)
            this.initAPInvoiceDataTable()
            this.initAccumulativeDepreciation()
            this.addEventBinding()
            this.initAPInvoiceDetailDataTable()
        }

        fetchDetailData(){
            $.fn.callAjax2({
                url: this.$formSubmit.attr('data-url'),
                method:'GET',
            }).then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        $x.fn.renderCodeBreadcrumb(data);
                        $.fn.compareStatusShowPageAction(data);
                        console.log(data)
                        $('#data-script').attr('data-fixed-asset-detail', JSON.stringify(data))
                        this.initClassificationSelect([data?.['classification']])
                        this.$assetNameInput.val(data?.['title'])
                        this.$assetCodeInput.val(data?.['code'])
                        this.initOffsetItemSelect([data?.['product']])
                        this.initManageDepartmentSelect([data?.['manage_department']])
                        this.initUseDepartmentSelect(data?.['use_department'])
                        this.$originalCostInput.attr('value', data?.['original_cost']).focus({preventScroll: true}).blur()
                        this.$accDepreciationInput.attr('value', data?.['accumulative_depreciation']).focus({preventScroll: true}).blur()
                        this.$netBookValueInput.attr('value', data?.['net_book_value']).focus({preventScroll: true}).blur()
                        this.initSourceListDataTable(data?.['asset_sources'])
                        this.$sourceTypeSelect.val(data?.['source_type']).trigger('change')
                        this.initDateInput(this.$depreciationStartDateInput, data?.['depreciation_start_date'])
                        this.initDateInput(this.$depreciationEndDateInput, data?.['depreciation_end_date'])
                        this.$depreciationTimeInput.val(data?.['depreciation_time'])
                        this.$depreciationMethodSelect.val(data?.['depreciation_method']).trigger('change')
                        this.$adjustmentFactorSelect.val(data?.['adjustment_factor']).trigger('change')
                        this.$timeUnitSelect.val(data?.['depreciation_time_unit']).trigger('change')
                        this.openModalAPInvoiceDetailEventBinding()

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
        }
    }
    WFRTControl.setWFInitialData('asset');
    const instance = new UpdateHandler()
    instance.init()
    instance.setupFormSubmit()
    instance.fetchDetailData()
})