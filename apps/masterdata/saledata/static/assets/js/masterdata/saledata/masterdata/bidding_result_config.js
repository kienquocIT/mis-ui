$(document).ready(function () {
    let $formBiddingResultConfig = $('#form-bidding-result-config')
    let dataBiddingResultConfigEmployeeUrl = $formBiddingResultConfig.attr('data-url')
    let $employeeSelect = $('#employee-select')
    function loadBiddingResultConfigEmployee(){
        $.fn.callAjax2({
                'url': dataBiddingResultConfigEmployeeUrl,
                'method': 'GET',
            }
        )
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    console.log(data)
                    if (data) {
                        if (data?.["bidding_result_config"].length !== 0){
                            loadEmployee(data?.["bidding_result_config"][0]?.["employee"])
                        }
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    }

    loadBiddingResultConfigEmployee()

    function loadEmployee (data){
        $employeeSelect.initSelect2({
            ajax: {
                url: $employeeSelect.attr('data-url'),
                method: 'GET',
            },
            data: data ? data : null,
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
            templateResult: function (state) {
                console.log(state)
                let employeeName = state.text ? state.text : "_"
                let groupData = `<span class="badge badge-soft-primary">${state.data?.group?.title ? state.data.group.title : "_"}</span>`
                return $(`
                    <div class="row">
                       <div class="col-3">
                           ${employeeName}
                       </div>
                       <div class="col-3">
                           ${groupData}
                       </div>
                    </div>
                `);
            },
        })
    }

    function combinesDataConfig(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['employee'] = $('#employee-select').val();
        console.log(frm)
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $formBiddingResultConfig.on('submit', function (event) {
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
                        $.fn.notifyB({description: errs}, 'failure');
                    }
                )
        }
    })
});