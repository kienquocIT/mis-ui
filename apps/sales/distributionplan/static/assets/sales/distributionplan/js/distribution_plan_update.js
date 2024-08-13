$(document).ready(function () {
    new DistributionPlanHandle().load('update');
    WFRTControl.setWFInitialData('distributionplan', 'PUT')
    LoadDetailDP('update')

    $('#form-detail-dp').submit(function (event) {
        event.preventDefault();
        let form = new DistributionPlanHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})