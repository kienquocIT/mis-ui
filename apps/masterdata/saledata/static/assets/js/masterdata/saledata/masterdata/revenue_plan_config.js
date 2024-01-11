$(document).ready(function () {
    const roleSelectEle = $('#role-select')

    let revenue_plan_config = []
    if ($('#revenue_plan_config').text() !== '') {
        revenue_plan_config = JSON.parse($('#revenue_plan_config').text());
        LoadRoles(revenue_plan_config[0]?.['roles_mapped_list'])
    }

    function LoadRoles(data) {
        roleSelectEle.initSelect2({
            ajax: {
                url: roleSelectEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'role_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    LoadRoles()

    function combinesDataConfig(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['roles_mapped_list'] = $('#role-select').val();

        console.log(frm.dataForm)
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-config-revenue-plan').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataConfig($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
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
    })
});