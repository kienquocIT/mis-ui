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
            if (tempVal === 0) {

            }
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
                $('.group-select-box, .row-tax , .row-percent').show();
                $('.group-gift-box').hide()
            }
        });
    };

    giftHandle(){
        $('#is_gift').on('change', function(){
            if ($(this).prop('checked')){
                $('.group-select-box, .row-tax , .row-percent').hide();
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

function formatState(state, elm) {
    if (elm.closest('.selection').find('p').length === 0)
        elm.closest('.selection').prepend('<p><a data-href="#" class="detail-view"><i class="bi bi-file-text"></i></a></p>')
    // t.closefind(".selection").append(``)
    var $state = $(`<p class="ml-2"><span></span></p>`);

    // Use .text() instead of HTML string concatenation to avoid script injection issues
    $state.find("span").text(state.text);
    // $state.find("a").attr("href", baseUrl);
    return $state;
};

function popupInfo(event, data){
    $(event.target).next('span.select2').find('.detail-view').on('click', function(evt){
        $(event.target).select2('close');
        let spanPosition = $(event.target).next('span.select2').offset()
        //declare html and append HTML to body
        let popupContent = defaultTemplate(data)
        if ($.isFunction(localTemplateCustom)) popupContent = localTemplateCustom(data)
        let htmlPopup = $('<div class="popup-info"><div class="popup-wrap"><div class="popup-content"></div>' +
            '<div class="popup-btn"><a href="#" class="btn border-primary text-primary btn-sm" target="_blank">' +
            'View Detail</a></div></div></div>')
        htmlPopup.find('.popup-content').html(popupContent)
        htmlPopup.find('.popup-wrap').css({left: spanPosition.left, top: spanPosition.top - 38})
        //handle position of popup info
        let divHeight = htmlPopup.height() + 16 // 16 is padding top + bottom

        if ((popupContent + 38 + divHeight) > window.innerHeight)
            // if position popup larger than window screen
            htmlPopup.find('.popup-wrap').css({
                left:spanPosition.left + 25,
                top: window.innerHeight - divHeight
            })

        htmlPopup.appendTo('body');
        htmlPopup.click(()=>htmlPopup.remove())
    })
}
function localTemplateCustom(data){
    return `<div class="row no-gutters">
        <p class="form-label">Title</p>
        <p class="form-text">${data.title}</
        <p class="form-label">Code</p>
        <p class="form-text">${data.code}</p>
        </div>`
}
function defaultTemplate(data){
    return `<div class="row no-gutters">
        <p class="form-label">Title</p>
        <p class="form-text">${data.title}</
        <p class="form-label">Code</p>
        <p class="form-text">${data.code}</p>
        </div>`
}
$(function () {
    // modal select type show/hide content
    $('[name="select_customer_type"]').on('change', function () {
        let _thisValue = parseInt(this.value);
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

    // run customer modal feature
    Customer.init();

    // init select method action
    Method.init();

    // custom select2 PopupInfo
    let dumpData = [
        {
            id: 0,
            text: 'Valid time'
        },{
            id: 1,
            text: 'Week'
        },{
            id: 2,
            text: 'Month'
        },
    ]
    $('select[name="customer_per"]').select2({
        data: dumpData,
        templateSelection: formatState,
        is_has_icon: true
    }).on("select2:select", function (e) {
        let item = e.params.data;
        popupInfo(e, item)
    });
});
