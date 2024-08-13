$(document).ready(function () {
    new DistributionPlanHandle().load('update');
    LoadDetailDP('update')

    $('#form-detail-dp').submit(function (event) {
        event.preventDefault();
        let form = new DistributionPlanHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})