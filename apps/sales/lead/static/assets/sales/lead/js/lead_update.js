$(document).ready(function () {
    new LeadHandle().load('update');

    LoadDetailLead('update')

    $('#form-detail-lead').submit(function (event) {
        event.preventDefault();
        let form = new LeadHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
});