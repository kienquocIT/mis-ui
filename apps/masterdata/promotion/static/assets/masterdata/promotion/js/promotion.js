class customerHandle {
    customerList = [];
    customerCond = [];
    set setCustomerList (data){
        this.customerList = data
    }
    get getCustomerList(){
        return this.customerList
    }
    set setCustomerCond (data){
        this.customerCond = data
    }
    get getCustomerCond(){
        return this.customerCond
    }
    onOpenModal() {
        $('#customer_modal').on('show.bs.modal', function () {
            let type = $('[name="customer_type"]').val() ? $('[name="customer_type"]').val() : '0';
            if (!type || type === 0) $('.customer_list, .customer_condition').addClass('hidden');
            else if (type === 1) {
                $('.customer_list').removeClass('hidden');
                $('.customer_condition').addClass('hidden');
            }
            else {
                $('.customer_list').addClass('hidden');
                $('.customer_condition').removeClass('hidden');
            }
            $(`[name="select_customer_type"] option[value="${type}"]`).trigger('change');
        });
    }

    runCustomerListTable(){
        let $table = $('#table_customer_list')
        let url = $table.attr('data-url');
        $table.DataTableDefault({
            ajax: {
                url: url,
                type: "GET",
                dataSrc: 'data.employee_list',
            },
            columns: [
                {
                    targets: 0,
                    class: 'w-10',
                    render: (row, type, data) => {
                        let checked = '';
                        if (data.checked) checked = 'checked'
                        return `<div class="form-check"><input type="checkbox" class="form-check-input" ${checked}></div>`
                    }
                },
                {
                    targets: 1,
                    class: 'w-65',
                    render: (row, type, data) => {
                        return `<p>${data.full_name}</p>`;
                    }
                },
                {
                    targets: 2,
                    class: 'w-25 text-center',
                    render: (row, type, data) => {
                        return `<p>${data.code}</p>`;
                    }
                },
            ],
            rowCallback(row, data){
                $('input[type="checkbox"]', row).on('change', function(){
                    data.checked = this.checked
                })
            }
        }, false);
    }

    onSave(){
        let _this = this
        $('#btn-customer').off().on('click', function () {
            let tempVal = parseInt($('[name="select_customer_type"]').val());
            $('[name="customer_type"]').val(tempVal);
            if (tempVal === 1) {
                _this.setCustomerList = $('#table_customer_list').DataTable().column(0, {selected: true}).data().toArray();
            }
            else if (tempVal === 2) {
                let $elmRow = $('.cc-content .row'),
                    listCond = [],
                    isLogic = '';
                $elmRow.each(function () {
                    let idx = $(this).data('idx'),
                        pro = $(this).find('.cus-property').val(),
                        ope = $(this).find('.cus-operator').val(),
                        rel = $(this).find('.cus-result').val();
                    isLogic = $(this).find('.row-operator').val();
                    if (pro && ope && rel)
                        listCond.append({
                            order: idx,
                            property: pro,
                            operator: ope,
                            result: rel
                        })
                });
                if (listCond.length)
                    listCond.append({"logic": isLogic,})
                _this.setCustomerCond = listCond
            }
        })

    }
    initSelectResult(param, $elm){
        let $relElm = $('.modal .cus-result')
        if ($elm) $relElm = $elm
        $relElm.attr('data-prefix', 'customer_param_list')
        $relElm.attr('data-url', $('#url-factory').attr('data-cus_params'))
        $relElm.attr('data-params', JSON.stringify({
            filter_by: param === '0' ? "group" : param === '1' ? "industry" : param === '2' ? "size" : "revenue"
        }))
        // run select result
        initSelectBox($relElm)
    }

    selectPropertyOnChange($elm=null){
        let $defElm = $('.modal .cus-property');
        if ($elm) $defElm = $elm
        let $parent = $defElm.parents('.row')
        let _this = this
        $defElm.on('change', function(){
            if (this.value === '3')
                $('.cus-operator option:not([value=""])', $parent).attr('hidden', false)
            else{
                $('.cus-operator option', $parent).attr('hidden', true)
                $('.cus-operator option[value="="], .cus-operator option[value="!="]', $parent).attr('hidden', false)
            }
            _this.initSelectResult(this.value, $parent.find('.cus-result'))
        })
    }

    childOperatorChange() {
        $('.row-operator').on('change', function () {
            $('.row-operator option').attr('selected', false);
            $('.row-operator option[value="' + this.value + '"]').attr('selected', true)

            // change option of add button
            $('#new-cus-cond a').addClass('disabled')
            $('#new-cus-cond a[data-operator="'+this.value+'"]').removeClass('disabled');
        });
    };

    initEventNewRowCondition(){
        let _this = this
        $('#new-cus-cond a').on('click', function () {
            let isOpe = $(this).data('operator');
            let newHTML = $('.t-conditions').html();
            $('.cc-content').append(newHTML)
            let $lastHTML = $('.cc-content .row:last-child');
            let idx = $lastHTML.index();
            $lastHTML.attr('data-idx', idx)
            $lastHTML.find('.row-operator option[value="'+isOpe+'"]').attr('selected', true)
            if (idx !== 1)
                $lastHTML.find('.row-operator').attr('disabled', true);
            if (idx === 1){
                let addBtn  = $('#new-cus-cond')
                if (isOpe === 'and')
                    addBtn.find('[data-operator="or"]').addClass('disabled');
                else
                    addBtn.find('[data-operator="and"]').addClass('disabled');
            }
            // add event on change select property
            _this.selectPropertyOnChange($lastHTML.find('.cus-property'));

            // event on change logic value row index 1
            _this.childOperatorChange();

            // scroll down when add click is too many row
            if (idx >= 4){
                let elm = $('#customer_modal .modal-body');
                elm.stop().animate({
                    scrollTop: elm.prop("scrollHeight")
                }, 500);
            }
        });

    };

    init() {
        // handle when modal is open
        this.onOpenModal();
        // load list of customer into table
        this.runCustomerListTable();

        // prepare/format data on modal when user click save btn
        this.onSave()

        // run init select property on change
        this.selectPropertyOnChange()

        // run init select result
        this.initSelectResult()
    }
}

let Customer = new customerHandle();

class methodHandle{

    discountHandle(){
        $('#is_discount').on('change', function(){
            if ($(this).prop('checked')){
                $('.group-select-box, .row-tax, .row-percent').removeClass('hidden');
                $('.group-gift-box').hide()
            }
        });
    };

    giftHandle(){
        $('#is_gift').on('change', function(){
            if ($(this).prop('checked')){
                $('.group-select-box, .row-tax, .row-percent').addClass('hidden');
                $('.group-gift-box').show()
            }
        });
    }

    init(){
        $('.row-method input:checkbox').on('change', function(){
            $('input[type="checkbox"]').not(this).prop('checked', false);
        })
        // run discount method action and rude
        this.discountHandle()
        //run gift method action and rude
        this.giftHandle()
    }
}

let Method = new methodHandle();

function getDetailPage($form){
    $form.attr('data-url')
    $.fn.callAjax($form.attr('data-url'), 'get')
        .then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#title').val(data.title)
                    $('#remark').val(data.remark)
                    $('#customer_remark').val(data.customer_remark)
                    $(`#select_customer_type option[value="${data.select_customer_type}"]`).attr('selected', true)

                }
            },
        )
}

$(function () {
    // declare common element
    let $transFactory = $('#trans-factory')

    // run customer modal feature
    Customer.init();

    // init select method action
    Method.init();

    //  run daterange of valid_time form field
    let $validTime = $('[name="valid_time"]')
    $validTime.daterangepicker({
        autoUpdateInput: false,
        minYear: 1901,
        singleDatePicker: false,
        timePicker: false,
        showDropdowns: true,
        // "cancelClass": "btn-secondary",
        // maxYear: parseInt(moment().format('YYYY'), 10)
    }).on("apply.daterangepicker", function (e, picker) {
        picker.element.val(picker.startDate.format(picker.locale.format)+ ' - ' +picker.endDate.format(picker.locale.format));
    });

    // run default currency form field
    $.fn.getCompanyConfig().then((configData)=>{
        let $currencyElm = $('[name="currency"]');
        $currencyElm.attr('data-onload', JSON.stringify({
            "id": configData?.['currency']?.['id'],
            "title": configData?.['currency']?.['title'],
            "code": configData?.['currency']?.['code'],
        }))
        initSelectBox($currencyElm);
    });

    /**
     * -------handle event onclick show/hide element in form-------
     **/
        // modal select type show/hide content
    $('[name="select_customer_type"]').on('change', function () {
        let _thisValue = parseInt(this.value);
        $('[name="customer_type"]').val(_thisValue);
        if (_thisValue === 0) $('.customer_list, .customer_condition').addClass('hidden');
        else if (_thisValue === 1) {
            $('.customer_list').removeClass('hidden');
            $('.customer_condition').addClass('hidden');
        } else {
            $('.customer_list').addClass('hidden');
            $('.customer_condition').removeClass('hidden');
            if(Customer.getCustomerCond.length){
                // call func html render condition data
            }
            Customer.initEventNewRowCondition();
        }
    });

    // percent fixed on change
    let $percentFixed =  $('[name="percent_fix_amount"]')
    $percentFixed.on('change', function (e){
        if ($(this).attr('id') === 'percent_01'){
            $('[name="percent_value"]').removeClass('hidden')
            $('[name="max_percent_value"]').parent('.form-group').css('visibility', 'visible')
            $('[name="fix_value"]').addClass('hidden')
        }
        else if ($(this).attr('id') === 'percent_02'){
            $('[name="percent_value"]').addClass('hidden')
            $('[name="max_percent_value"]').parent('.form-group').css('visibility', 'hidden')
            $('[name="fix_value"]').removeClass('hidden')
        }
    });

    // checkbox discount on order/special product/free ship on change
    let $allCheck = $('#is_on_order, #is_on_product, #is_free_shipping')
    $allCheck.on('change', function(){
        $allCheck.removeClass('is-invalid cl-red')
        if ($(this).attr('id') === 'is_on_order'
            || $(this).attr('id') === 'is_on_product'
            || $(this).attr('id') === 'is_free_shipping'){
            $allCheck.not(this).prop('checked', false);
        }
        if ($(this).attr('id') === 'is_free_shipping'){
            $('#percent_value').parent('.form-group').css('visibility', 'hidden')
            $('#percent_01').parent('.form-check').css('visibility', 'hidden')
        }
        else{
            $('#percent_value').parent('.form-group').css('visibility', 'visible')
            $('#percent_01').parent('.form-check').css('visibility', 'visible')
        }
    })

    // method gift checkbox in free product option
    let $allFree = $('#is_min_purchase, #is_purchase')
    $allFree.on('change', function(){
        $allFree.not(this).prop('checked', false);
    })
    /**
     * --------end---------
     **/

    // handle form submit
    let $form = $('#promo_form');
    jQuery.validator.setDefaults({
        debug: false,
        success: "valid"
    });
    $form.validate({
        errorElement: 'p',
        errorClass: 'is-invalid cl-red',
    })
    $form.on('submit', function(e){
        e.preventDefault();
        let _form = new SetupFormSubmit($form);
        _form.dataForm['customer_type'] = parseInt(_form.dataForm['customer_type']);
        let CustomerType = _form.dataForm['customer_type'];
        let csr = $("[name=csrfmiddlewaretoken]").val();
        if (CustomerType === 1){
            if (!Customer.getCustomerList.length){
                $.fn.notifyPopup({description: $transFactory.attr('data-customer-list')}, 'failure')
                return false
            }else
                _form.dataForm['customer_by_list'] = Customer.getCustomerList
        }
        if (CustomerType === 2){
            if (!Customer.getCustomerCond.length){
                $.fn.notifyPopup({description: $transFactory.attr('data-customer-cond')}, 'failure')
                return false
            }else
                _form.dataForm['customer_by_condition'] = Customer.getCustomerCond
        }
        let validDate = _form.dataForm['valid_time']
        _form.dataForm['valid_date_start'] = moment(validDate.split(' - ')[0]).format('YYYY-MM-DD');
        _form.dataForm['valid_date_end'] = moment(validDate.split(' - ')[1]).format('YYYY-MM-DD');

        if (_form.dataForm['is_discount']){
            _form.dataForm['discount_method'] = {
                before_after_tax: _form.dataForm['before_after_tax'],
                percent_fix_amount: _form.dataForm['percent_fix_amount'],
                use_count: parseInt(_form.dataForm['use_count']),
                times_condition: parseInt(_form.dataForm['times_condition']),
                max_usages: parseInt(_form.dataForm['max_usages'])
            }
            if (_form.dataForm['percent_fix_amount']){
                // if percent is checked
                if(!_form.dataForm['percent_value']){
                    $.fn.notifyPopup({description: $transFactory.attr('data-percent-invalid')}, 'failure')
                    $('[name="percent_value"]').addClass('is-invalid cl-red')
                    return false
                }
                _form.dataForm['discount_method']['percent_value'] = parseInt(_form.dataForm['percent_value'])
                let maxVal = $('[name="max_percent_value"]').valCurrency()
                if (!maxVal) {
                    $.fn.notifyPopup({description: $transFactory.attr('data-percent-max')}, 'failure')
                    $('#max_percent_value').addClass('is-invalid cl-red')
                    return false
                }
                _form.dataForm['discount_method']['max_percent_value'] = maxVal
            }else{
                // fixed amount is checked
                let fixedVal = $('[name="fix_value"]').valCurrency()
                if(!fixedVal){
                    $.fn.notifyPopup({description: $transFactory.attr('data-fixed-invalid')}, 'failure')
                    $('#fix_value').addClass('is-invalid cl-red')
                    return false
                }
                _form.dataForm['discount_method']['fix_value'] = fixedVal
            }
            if (_form.dataForm['is_on_order']){
                _form.dataForm['discount_method']['is_on_order'] = true
                if (_form.dataForm['is_minimum']){
                    _form.dataForm['discount_method']['is_minimum'] = true
                    if (!$('[name="minimum_value"]').valCurrency()){
                        $.fn.notifyPopup({
                            description: $transFactory.attr('data-invalid-minimum-value')
                        }, 'failure')
                        $('#minimum_value').addClass('is-invalid cl-red')
                        return false
                    }
                    _form.dataForm['discount_method']['minimum_value'] = $('#minimum_value').valCurrency()
                }
            }
            else if (_form.dataForm['is_on_product']){
                _form.dataForm['discount_method']['is_on_product'] = true
                let proonselect = $('#product_selected').val()
                if (!proonselect){
                    $.fn.notifyPopup({
                            description: $transFactory.attr('data-invalid-product-selected')
                        }, 'failure')
                    $('[name="product_selected"]').addClass('is-invalid cl-red')
                    return false
                }
                _form.dataForm['discount_method']['product_selected'] = proonselect
                if (_form.dataForm['is_min_quantity']
                    && !_form.dataForm['num_minimum']){
                    $.fn.notifyPopup({
                            description: $transFactory.attr('data-invalid-minimum-quantity')
                        }, 'failure')
                    $('#num_minimum').addClass('is-invalid cl-red')
                    return false
                }
                _form.dataForm['discount_method']['is_min_quantity'] = true
                _form.dataForm['discount_method']['num_minimum'] = parseInt(_form.dataForm['num_minimum'])
            }
            else if (_form.dataForm['free_shipping']){
                _form.dataForm['discount_method']['free_shipping'] = true
                if (!$('#fix_value').valCurrency()) {
                    $.fn.notifyPopup({
                        description: $transFactory.attr('data-fixed-invalid')
                    }, 'failure')
                }
            }
            else{
                $('#is_on_order, #is_on_product, #is_free_shipping').addClass('is-invalid cl-red')
                return false
            }
        }
        if(_form.dataForm['is_gift']){
            _form.dataForm['gift_method'] = {
                use_count: _form.dataForm['use_count'],
                times_condition: _form.dataForm['times_condition'],
                max_usages: _form.dataForm['max_usages'],
                is_free_product: _form.dataForm['is_free_product']
            }
            if (!_form.dataForm['num_product_received']){
                $('[name="num_product_received"]').addClass('is-invalid cl-red')
                return false
            }else _form.dataForm['gift_method']['num_product_received'] = _form.dataForm['num_product_received']

            if (!_form.dataForm['product_received']){
                $('#product_received').addClass('is-invalid cl-red')
                return false
            }else _form.dataForm['gift_method']['product_received'] = _form.dataForm['product_received']

            if (!_form.dataForm['is_min_purchase'] || !_form.dataForm['is_purchase']){
                $('#is_min_purchase, #is_purchase').addClass('is-invalid cl-red')
                return false
            } else {
                if (_form.dataForm['is_min_purchase']){
                    _form.dataForm['gift_method']['is_min_purchase'] = _form.dataForm['is_min_purchase']
                    _form.dataForm['gift_method']['before_after_tax'] = _form.dataForm['gift_before_after_tax']
                    if (!_form.dataForm['min_purchase_cost']){
                        $('[name="min_purchase_cost"]').addClass('is-invalid cl-red')
                        return false
                    }
                    _form.dataForm['gift_method']['min_purchase_cost'] = _form.dataForm['min_purchase_cost']
                } else {
                    _form.dataForm['gift_method']['is_purchase'] = _form.dataForm['is_purchase']
                    if (!_form.dataForm['purchase_num']) {
                        $('[name="purchase_num"]').addClass('is-invalid cl-red')
                        return false
                    }
                    _form.dataForm['gift_method']['purchase_num'] = _form.dataForm['purchase_num']
                    if (!_form.dataForm['purchase_product']) {
                        $('[name="purchase_product"]').addClass('is-invalid cl-red')
                        return false
                    }
                    _form.dataForm['gift_method']['purchase_product'] = _form.dataForm['purchase_product']
                }
            }
        }
        $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: data.message}, 'success')
                        $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                    }
                },
            )
    })

    // get detail page
    if ($form.attr('data-method') === 'PUT'){
        getDetailPage($form)
    }
});
