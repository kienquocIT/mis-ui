$(document).ready(function () {
    new LeadHandle().load();

    $('#form-create-lead').submit(function (event) {
        event.preventDefault();
        let form = new LeadHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
});