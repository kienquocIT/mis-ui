$(document).ready(function () {
    new LeadHandle().load('update');

    LoadDetailLead('update')

    $('#form-update-lead').submit(function (event) {
        event.preventDefault();
        let form = new LeadHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
});