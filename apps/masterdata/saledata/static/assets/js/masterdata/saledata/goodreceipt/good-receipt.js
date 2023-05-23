
class lineDetailUtil{
    datalist = [];
    currentIdx = 0;
    set setDatalist(data){
        this.datalist = data
    };
    get getDatalist(){
        return this.datalist;
    }

    /**
     * calculator subtotal table and total tab of table
     * @param row = Integer number index of row
     */
    handleTotal(row=null){
        const $table = $('#line_detail_table')
        const dataList = $table.DataTable().data().toArray()
        let pretax = 0
        let taxes = 0
        let total = 0
        if (row != null)
            if (dataList[row]?.quantity && dataList[row]?.unit_price){
                dataList[row]['subtotal_price'] = dataList[row]?.quantity * dataList[row]?.unit_price
                $table.DataTable().cell(row, 7).data(dataList[row]).draw(false)
            }
        for (const data of dataList) {
            if (data?.quantity && data?.unit_price)
                pretax += data.quantity * data.unit_price
            if (data?.tax?.rate)
                taxes += (pretax * data.tax.rate)/100
            total += pretax + taxes
        }
        $('.pretax').attr('data-init-money', pretax)
        $('.taxes').attr('data-init-money', taxes)
        $('.total').attr('data-init-money', total)
        $.fn.initMaskMoney2()
    }

    /**
     * listening event on change, blur of select dropdown... update data on change to datatable and re-calculator total
     * price tax or pretax amount
     * @param rowIdx
     */
    columnFuncUtil(rowIdx){
        const _this = this
        const $prodTable = $('#line_detail_table')
        // init product
        $(`.product_row_${rowIdx}`).on('select2:select', function(e) {
            let currentList = _this.getDatalist;
            const data = e.params.data
            currentList[rowIdx]['product'] = {id: data.id, 'title': data.title}
            if (data?.sale_information?.default_uom) currentList[rowIdx]['uom'] = {
                'id': data.sale_information.default_uom.id,
                'title': data.sale_information.default_uom.title
            }
            if (data?.sale_information?.tax_code) currentList[rowIdx]['tax'] = {
                'id': data.sale_information.tax_code.id,
                'title': data.sale_information.tax_code.title,
                'rate': data.sale_information.tax_code.rate
            }
            _this.setDatalist = currentList
            $prodTable.DataTable().cell(rowIdx, 3).data(currentList[rowIdx]['uom']).draw(false);
            $prodTable.DataTable().cell(rowIdx, 6).data(currentList[rowIdx]['tax']).draw(false);
            _this.handleTotal(rowIdx)
        });
        // warehouse
        $(`.warehouse_row_${rowIdx}`).on('select2:select', function(e){
            let currentList = _this.getDatalist;
            const data = e.params.data
            currentList[rowIdx]['warehouse'] = {
                'id': data.id,
                'title': data.title
            }
            _this.setDatalist = currentList
        });
        // UoM
        $(`.uom_row_${rowIdx}`).on('select2:select', function(e){
            let currentList = _this.getDatalist;
            const data = e.params.data
            currentList[rowIdx]['uom'] = {
                'id': data.id,
                'title': data.title
            }
            _this.setDatalist = currentList
        });
        // quantity
        $(`.quantity_row_${rowIdx}`).on('change', function(){
            let currentList = _this.getDatalist;
            currentList[rowIdx]['quantity'] = parseInt(this.value)
            _this.setDatalist = currentList
            _this.handleTotal(rowIdx)
        });
        // unit price
        $(`.unit_price_row_${rowIdx}`).on('blur', function(){
            let currentList = _this.getDatalist;
            currentList[rowIdx]['unit_price'] = $(this).valCurrency()
            _this.setDatalist = currentList
            _this.handleTotal(rowIdx)
        });
        // tax
        $(`.tax_row_${rowIdx}`).on('select2:select', function(e){
            let currentList = _this.getDatalist;
            const data = e.params.data
            currentList[rowIdx]['tax'] = {
                'id': data.id,
                'title': data.title,
                'rate': data.rate
            }
            _this.setDatalist = currentList
            _this.handleTotal(rowIdx)
        });
    }

    initTable(){
        const $tableElm = $('#line_detail_table');
        let _this = this
        $tableElm.DataTable({
            data: _this.getDatalist,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            responsive: {
                details: true
            },
            columns: [
                {
                    targets: 0,
                    defaultContent: ''
                },
                {
                    targets: 1,
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        let product = '';
                        if (data?.product?.id){
                            let temp = JSON.stringify({
                                'id': data.product.id,
                                'title': data.product.title
                            });
                            product = temp.replaceAll('"', "'")
                        }
                        const urlSelect = $('#url-factory').attr('data-product'),
                            urlSelectDetail = $('#url-factory').attr('data-product-detail');
                        return `<div class="input-group">
                                    <div class="input-affix-wrapper">
                                        <div class="input-prefix dropdown">
                                            <i class="fas fa-info-circle" data-bs-toggle="dropdown" 
                                            data-dropdown-animation aria-haspopup="true" aria-expanded="false" disabled
                                            >
                                            </i>
                                            <div class="dropdown-menu w-210p mt-4"></div>
                                        </div>
                                        <select class="form-select product_row_${idx}"
                                        data-prefix="product_list"
                                        data-url="${urlSelect}"
                                        data-link-detail="${urlSelectDetail}"
                                        data-onload="${product ? product : ''}"
                                        data-template-format="[{'name':'Title', 'value': 'title'},{'name':'Code', 'value': 'code'}]"
                                        >
                                        </select>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        const urlSelect = $('#url-factory').attr('data-warehouse')
                        let warehouse = '';
                        if (data?.warehouse?.id){
                            let temp = JSON.stringify({
                                'id': data.warehouse.id,
                                'title': data.warehouse.title
                            });
                            warehouse = temp.replaceAll('"', "'")
                        }
                        return `<select class="form-select warehouse_row_${idx}" ` +
                            `data-prefix="warehouse_list" ` +
                            `data-url="${urlSelect}" ` +
                            `data-onload="${warehouse ? warehouse : ''}"` +
                            `></select>`;
                    }
                },
                {
                    targets: 3,
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        const urlSelect = $('#url-factory').attr('data-uom')
                        let uom = '';
                        if (data?.uom?.id){
                            let temp = JSON.stringify({
                                'id': data.uom.id,
                                'title': data.uom.title
                            });
                            uom = temp.replaceAll('"', "'")
                        }
                        return `<select class="form-select uom_row_${idx}" 
                                    data-prefix="unit_of_measure" 
                                    data-url="${urlSelect}" 
                                    data-onload="${uom ? uom : ''}"></select>`;
                    }
                },
                {
                    targets: 4,
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        return `<input class="form-control quantity_row_${idx}" type="text" placeholder="0" required 
                                value="${data?.quantity ? data.quantity : 0}">`;

                    }
                },
                {
                    targets: 5,
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        return `<input class="form-control unit_price_row_${idx} mask-money" data-return-type="number"
                        type="text" placeholder="0" required value="${data?.unit_price ? data.unit_price : 0}">`;
                    }
                },
                {
                    targets: 6,
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        const urlSelect = $('#url-factory').attr('data-tax')
                        let tax = '';
                        if (data?.tax?.id){
                            let temp = JSON.stringify({
                                'id': data.tax.id,
                                'title': data.tax.title
                            });
                            tax = temp.replaceAll('"', "'")
                        }
                        return `<select class="form-select tax_row_${idx}" 
                                    data-prefix="tax_list" 
                                    data-url="${urlSelect}" 
                                    data-onload="${tax ? tax : ''}"></select>`;
                    }
                },
                {
                    targets: 7,
                    render: (row, type, data, meta) => {
                        return `<span class="mask-money"
                        data-init-money="${data?.subtotal_price ? data.subtotal_price : 0}">`;
                    }
                },
                {
                    targets: 8,
                    render: (row, type, data, meta) => {
                        return `<div class="actions-btn text-center">
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                   title="Delete"
                                   href="#"
                                   data-id="${data.id}"
                                   data-action="delete">
                                    <span class="btn-icon-wrap">
                                        <i class="bi bi-trash"></i>
                                    </span>
                                </a>
                            </div>`;
                    }
                },
            ],
            drawCallback: function(){
                // init event on change for all select per row
                this.api().rows().nodes().each(function (elm, i) {
                    _this.columnFuncUtil(i)
                    initSelectBox($(`.product_row_${i}, .warehouse_row_${i}, .uom_row_${i}, .tax_row_${i}`))
                })
            },
            rowCallback: function(row, data, index){
                // auto generate order number
                $('td:eq(0)', row).html(index + 1)
                data['order'] = index + 1
                // init currency
                $.fn.initMaskMoney2()
                $('.actions-btn a', row).on('click', function(){
                    $(row).closest('.table').DataTable().rows(row).remove().draw(false);
                    _this.handleTotal()
                })
            }
        })
    }

    addNewProduct(){
        let $btnAdd = $('#btn-add-product');
        const _this = this
        $btnAdd.off().on('click', function(e) {
            if (e.detail === 2) return false // this code is stop double click event
            const $tableElm = $('#line_detail_table');
            const newData = {
                'product': {
                    'id': null,
                    'title': ''
                },
                'warehouse': {
                    'id': null,
                    'title': ''
                },
                'uom': {
                    'id': null,
                    'title': ''
                },
                'tax': {
                    'id': null,
                    'title': ''
                },
                'quantity': null,
                'unit_price': null,
                'subtotal_price': null,
            }
            let temp = _this.getDatalist
            temp[_this.currentIdx] = newData
            _this.setDatalist = temp
            $tableElm.DataTable().row.add(newData).draw()
            _this.currentIdx = _this.currentIdx + 1
        });
    };


    init() {
        this.initTable();
        this.addNewProduct();
    };
}

function loadDetail(line){
    const $form = $('#good_receipt_form')
    if ($form.attr('data-method') === 'put'){
        $.fn.callAjax($form.attr('data-url'), 'get')
            .then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        $('#title').val(data.title)
                        $('#supplier').attr('data-onload', JSON.stringify(data.supplier));
                        initSelectBox($('#supplier'))
                        $('#posting_date').val(moment(data.posting_data).format('DD/MM/YYYY'));
                        line.setDatalist = data.product_list
                        $('#line_detail_table').DataTable().clear().rows.add(data.product_list).draw();
                        $('.pretax').attr('data-init-money', data.pretax_amount)
                        $('.taxes').attr('data-init-money', data.taxes)
                        $('.total').attr('data-init-money', data.total_amount)
                        $.fn.initMaskMoney2()
                    }
                },
            )
            .catch((err) => {
                console.log(err)
            })
    }
}

$(function(){
    // declare variable for all page
    const lineDetail = new lineDetailUtil();
    const $transFactory = $('#trans-factory')
    // end declare variable

    // load data on detail page
    loadDetail(lineDetail)

    //run line detail table and all util function
    lineDetail.init()

    // init currency
    $.fn.initMaskMoney2()

    //  run date pick of posting date
    let $validTime = $('#posting_date')
    $validTime.daterangepicker({
        minYear: 1901,
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY'
        }
    })

    // form submit
    let $form = $('#good_receipt_form')
    jQuery.validator.setDefaults({
        debug: false,
        success: "valid"
    });
    $form.validate({
        errorElement: 'p',
        errorClass: 'is-invalid cl-red',
    })
    $form.on('submit', function(e){
        $('.readonly [disabled]:not([hidden]):not(i)', $form).attr('disabled', false)
        e.preventDefault();
        let _form = new SetupFormSubmit($form);
        let csr = $("[name=csrfmiddlewaretoken]").val();
        const $tableElm = $('#line_detail_table')
        let lineDetail = $tableElm.DataTable().data().toArray()
        if (!lineDetail){
            $.fn.notifyPopup({description: $transFactory.attr('data-product')}, 'failure')
            return false
        }
        else{
            let temp = []
            for (let [idx, val] of lineDetail.entries()){
                if (!val?.quantity || !val?.unit_price || !val?.product?.id || !val?.warehouse?.id)
                    $.fn.notifyPopup({description: $transFactory.attr('data-row-error').replace('{}', idx)}, 'failure')
                temp[idx] = {
                    product: val.product.id,
                    warehouse: val.warehouse.id,
                    tax: val.tax.id,
                    uom: val.uom.id,
                    quantity: val.quantity,
                    unit_price: val.unit_price,
                    subtotal_price: val.subtotal_price,
                    order: val.order
                }
            }
            _form.dataForm['product_list'] = temp
        }
        _form.dataForm['posting_date'] = moment(_form.dataForm['posting_date'], 'DD/MM/YYYY').format('YYYY-MM-DD')
        _form.dataForm['pretax_amount'] = parseFloat($('.pretax').attr('data-init-money'))
        _form.dataForm['taxes'] = parseFloat($('.taxes').attr('data-init-money'))
        _form.dataForm['total_amount'] = parseFloat($('.total').attr('data-init-money'))


        delete _form.dataForm['date_created']
        delete _form.dataForm['status']

        $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
            .then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    const description = (_form.dataMethod.toLowerCase() === 'put') ? data.detail : data.message;
                    if (data) {
                        $.fn.notifyPopup({description: description}, 'success')
                        $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                    }
                },
            )
            .catch((err) => {
                console.log(err)
            })
    })
}, jQuery);