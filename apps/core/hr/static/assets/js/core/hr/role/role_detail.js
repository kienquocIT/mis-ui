$(document).ready(function () {
    let detailApi = $.fn.callAjax2({
        url: urlDetail,
        method: 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            return data['role'] || {};
        }
    );

    $x.fn.showLoadingPage();
    HandlePlanAppNew.editEnabled = false;
    Promise.all(
        [
            getAllAppOfTenant(),
            detailApi,
        ]
    ).then(
        (results) => {
            HandlePlanAppNew.setPlanApp(results[1]?.plan_app || [])
            HandlePlanAppNew.setPermissionByConfigured(results[1]?.permission_by_configured || [])

            let clsNew = new HandlePlanAppNew();
            clsNew.renderTenantApp(results[0]);
            clsNew.renderPermissionSelected()
            return results;
        }
    ).then(
        (results) => {
            RoleForm.loadDetail(results[1], {'disabled': true});
            return results;
        }
    ).then(
        () => {
            $x.fn.hideLoadingPage();
        }
    );
});