$('#btnResetApp').on('click', function () {
    HandlePlanApp.resetPlanApp();
});
$('#btnResetPermit').on('click', function () {
    HandlePermissions.resetPermit();
})

$('#btnResetAll').on('click', function () {
    HandlePlanApp.resetPlanApp();
    HandlePermissions.resetPermit();
})

$('#btnResetData').on('click', function (){
    $('#member-current-edit').trigger('change');
})