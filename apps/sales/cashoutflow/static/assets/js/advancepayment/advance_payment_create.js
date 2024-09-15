$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    APHandle.LoadPage();
    WFRTControl.setWFInitialData('advancepayment', 'POST')

    // SUBMIT FORM CREATE ADVANCE PAYMENT
    $('#form-create-advance').submit(function (event) {
        event.preventDefault();
        let form = APHandle.CombinesData($(this), 'create');
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
});
