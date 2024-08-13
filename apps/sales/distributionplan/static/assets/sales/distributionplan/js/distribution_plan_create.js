$(document).ready(function () {
    new DistributionPlanHandle().load();
    WFRTControl.setWFInitialData('distributionplan', 'POST')

    $('#form-create-dp').submit(function (event) {
        event.preventDefault();
        let form = new DistributionPlanHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})