$(document).ready(function () {
    class CreateHandler extends CommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-fixed-asset-create')
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
                    $.fn.callAjax2({
                        url: _form.dataUrl,
                        method: _form.dataMethod,
                        data: _form.dataForm
                    }).then(
                        (resp) => {
                            const data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({
                                    'description': 'Success',
                                }, 'success');
                                setTimeout(() => {
                                    window.location.replace(_form.dataUrlRedirect);
                                }, 3000)
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
                        });
                }
            })
        }
    }

    const instance = new CreateHandler()
    instance.init()
    instance.setupFormSubmit()
})