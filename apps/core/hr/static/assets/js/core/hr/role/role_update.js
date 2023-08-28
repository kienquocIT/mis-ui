$(document).ready(function () {
    let detailApi = $.fn.callAjax2({
        url: urlDetail,
        method: 'GET',
    }).then(
        (resp)=>{
            let data = $.fn.switcherResp(resp);
            return data['role'] || {};
        }
    );

    Promise.all([
        callAppList(), detailApi
    ]).then(
        (results)=>{
            renderAppList(results[0]);
            return results;
        }
    ).then(
        (results)=>{
            RoleForm.loadDetail(results[1]);
        }
    );

    let frm = $("#form-role");
    SetupFormSubmit.validate(
        frm,
        {
            submitHandler: function (form) {
                return new RoleForm({'form': $(form)}).combinesForm(true);
            }
        });
});