$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    WFRTControl.setWFInitialData('purchaserequest');

    $('#form-create-pr').submit(function (event) {
        event.preventDefault();
        let form = null;
        if ($request_for.val() === '0') {
            form = new PurchaseRequestHandle().combinesDataSO($(this));
        }
        else if ($request_for.val() === '1') {
            form = new PurchaseRequestHandle().combinesDataSF($(this));
        }
        else if ($request_for.val() === '2') {
            form = new PurchaseRequestHandle().combinesDataFA($(this));
        }
        else if ($request_for.val() === '3') {
            form = new PurchaseRequestHandle().combinesDataDP($(this));
        }
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})