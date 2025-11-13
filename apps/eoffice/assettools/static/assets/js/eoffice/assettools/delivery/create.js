$(document).ready(function () {
    // run select provide
    let $ProvideElm = $('#selectProvide')
    $ProvideElm.initSelect2({
        'templateResult': renderTemplateResult
    })
    WFRTControl.setWFInitialData('assettoolsdelivery');
});