$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    const urlParams = new URLSearchParams(window.location.search);
    const type= urlParams.get('type');
    new PurchaseRequestHandle().load(type, 'create')

    $('#form-create-pr').submit(function (event) {
        event.preventDefault();
        let form = null;
        if (type === '0' || $('#request-for-so').attr('data-type') === '0') {
            form = new PurchaseRequestHandle().combinesDataSO($(this));
        }
        else if (type === '1' || $('#request-for-sf').attr('data-type') === '1') {
            form = new PurchaseRequestHandle().combinesDataSF($(this));
        }
        else if (type === '3' || $('#request-for-db').attr('data-type') === '3') {
            form = new PurchaseRequestHandle().combinesDataDB($(this));
        }
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})