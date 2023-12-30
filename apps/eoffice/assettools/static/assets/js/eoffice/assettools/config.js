$(document).ready(function(){
    let $elm = $('#select_prod_type, #select_warehouse, #select_employee')
    let $FormElm = $('#form_asset_tools')

    $elm.each(function(){
        $(this).initSelect2()
    });

    // get config info
    $.fn.callAjax2({
        'url': $FormElm.attr('data-url'),
        'method': 'get',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data?.['product_type']){
                let prodT = {...data['product_type'], selected: true}
                $('#select_prod_type').attr('data-onload', JSON.stringify(prodT)).initSelect2()
            }
            if (data?.['employee_tools_list_access']){
                let empL = data['employee_tools_list_access']
                $.map(empL, function(item){
                    return item.selected = true
                })
                $('#select_employee').attr('data-onload', JSON.stringify(empL)).initSelect2()
            }
            if (data?.['warehouse']){
                let empL = data['warehouse']
                $.map(empL, function(item){
                    return item.selected = true
                })
                $('#select_warehouse').attr('data-onload', JSON.stringify(empL)).initSelect2()
            }

    })

    function submitHandleFunc() {
        const frm = new SetupFormSubmit($FormElm);
        let formData = frm.dataForm;
        formData['warehouse'] = $('#select_warehouse').val()
        formData['employee_tools_list_access'] = $('#select_employee').val()
        $.fn.callAjax2({
            'url': frm.dataUrl,
            'method': frm.dataMethod,
            'data': formData,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                }
            }, (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
    }
    // form submit

    SetupFormSubmit.validate($FormElm, {
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});