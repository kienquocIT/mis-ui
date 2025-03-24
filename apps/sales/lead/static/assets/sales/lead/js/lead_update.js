$(document).ready(async function () {
    new LeadHandle().load('update');

    LoadDetailLead('update')

    const form_detail_lead = $('#form-detail-lead')
    let form_validator = form_detail_lead.validate({
        submitHandler: function (form) {
            let combinesData = new LeadHandle().combinesData(form);
            if (combinesData) {
                WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
                $.fn.callAjax2(combinesData)
                    .then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                setTimeout(() => {
                                    window.location.replace(form_detail_lead.attr('data-url-redirect'));
                                    location.reload.bind(location);
                                }, 1000);
                            }
                        },
                        (errs) => {
                            setTimeout(
                                () => {
                                    WindowControl.hideLoading();
                                },
                                1000
                            )
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])

    function callData(url, method) {
        return $.fn.callAjax2({
            url: url,
            method: method,
        }).then((resp) => {
                return $.fn.switcherResp(resp);
            },
            (errs) => {
                console.log(errs)
            });
    }
    async function loadConfig() {
        let url = $("#script-url").data('url-config');
        let method = 'GET';
        let result = await callData(url, method);
        return result?.['opportunity_config'];
    }
    const employee_current = $('#employee_current_id').val();
    const config = await loadConfig().then();

    function loadSalePerson(data, config, emp_current_id, list_account_manager) {
        $assign_to_sale_config.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                if (!config) {
                    resp.data[keyResp].map(function (item) {
                        // if (item.group.id === $('#employee_current_group').val() && list_account_manager.includes(item.id)) {
                        if (list_account_manager.includes(item.id)) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                } else {
                    resp.data[keyResp].map(function (item) {
                        if (item.id === emp_current_id) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                }
            },
            ajax: {
                url: $assign_to_sale_config.attr('data-url'),
                method: 'GET',
            },
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        })
    }

    $account_existing.on('change', function () {
        if ($(this).val()) {
            let customer = SelectDDControl.get_data_from_idx($(this), $(this).val());
            loadSalePerson({}, config.is_account_manager_create, employee_current, customer.manager.map(obj => obj.id));
        }
    })
});