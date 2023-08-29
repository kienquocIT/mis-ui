$(document).ready(async function () {
    let employee_current = $('#employee_current_id').val();
    let config = await loadConfig().then();

    let customerSelectEle = $('#select-box-customer');

    loadDtbOpportunityList();

    SetupFormSubmit.validate(
        $('#form-create_opportunity'),
        {
            submitHandler: function (form) {
                let combinesData = OpportunityLoadDropdown.combinesData($(form))
                $.fn.callAjax2({
                    url: combinesData.url,
                    method: combinesData.method,
                    data: combinesData.data,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success')
                        setTimeout(() => {
                            window.location.href = $(form).data('url-detail').format_url_with_uuid(data.id);
                        }, 1000)
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        }
    );

    $(document).on('click', '#create_opportunity_button', function () {
        OpportunityLoadDropdown.loadCustomer({}, config.is_account_manager_create, employee_current);
        OpportunityLoadDropdown.loadProductCategory();
    })

    customerSelectEle.on('change', function () {
        let customer = SelectDDControl.get_data_from_idx($(this), $(this).val());
        OpportunityLoadDropdown.loadSalePerson({}, config.is_account_manager_create, employee_current, customer.manager.map(obj => obj.id));
    })
})
