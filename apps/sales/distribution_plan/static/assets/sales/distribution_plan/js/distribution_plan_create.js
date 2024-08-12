$(document).ready(function () {
    new DistributionPlanHandle().load();

    $('#form-create-dp').submit(function (event) {
        event.preventDefault();
        let form = new DistributionPlanHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})