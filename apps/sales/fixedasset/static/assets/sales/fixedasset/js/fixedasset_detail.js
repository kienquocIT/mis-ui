$(document).ready(function () {
    class DetailHandler extends CommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-fixed-asset')
        }

        disableFields(){
            const $fields = $('#form-fixed-asset').find('input, select, button')
            $fields.attr('disabled', true)
            $fields.attr('readonly', true)

            $('#datatable-asset-source').on('draw.dt', function() {
                $(this).find('input, button').attr('disabled', true).attr('readonly', true);
            });
        }

        fetchDetailData(){
            $.fn.callAjax2({
                url: this.$formSubmit.attr('data-url'),
                method:'GET',
            }).then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        console.log(data)
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
                .then(() => {
                    this.disableFields()
                })
        }
    }

    const instance = new DetailHandler()
    instance.fetchDetailData()
})