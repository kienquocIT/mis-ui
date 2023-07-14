class lineDetailUtil {
    datalist = [];

    set setDatalist(data) {
        this.datalist = data
    };

    get getDatalist() {
        return this.datalist;
    }

    /**
     * calculator subtotal table and total tab of table
     * @param row = Integer number index of row
     */
    handleTotal(row = null) {
        const $table = $('#line_detail_table')
        const dataList = $table.DataTable().data().toArray()
        let pretax = 0
        let taxes = 0
        let total = 0
        if (row != null)
            if (dataList[row]?.quantity && dataList[row]?.unit_price) {
                const subtotal = dataList[row].quantity * dataList[row].unit_price
                dataList[row].subtotal_price = subtotal
                $table.DataTable().cell(row, 7).data(dataList[row].subtotal_price).draw(false)
            }
        for (const data of dataList) {
            if (data?.quantity && data?.unit_price)
                pretax += data.quantity * data.unit_price
            if (data.tax.rate > 0)
                taxes += ((data.quantity * data.unit_price) * data.tax.rate) / 100
        }
        total += pretax + taxes
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
    columnFuncUtil(rowIdx, row) {
        const _this = this
        const $prodTable = $('#line_detail_table');
        // init product
        $(`#product_row_${rowIdx}`, row).off().on('select2:select', function (e) {
            e.stopPropagation()
            let currentList = _this.getDatalist;
            const data = e.params.data
            currentList[rowIdx]['product'] = {id: data.id, 'title': data.title}
            if (data?.sale_information?.default_uom){
                currentList[rowIdx]['uom'] = {
                    'id': data.sale_information.default_uom.id,
                    'title': data.sale_information.default_uom.title,
                    'uom_group': data?.general_information?.uom_group?.id
                }
            }
            if (data?.sale_information?.tax_code) currentList[rowIdx]['tax'] = {
                'id': data.sale_information.tax_code.id,
                'title': data.sale_information.tax_code.title,
                'rate': data?.sale_information?.tax_code?.rate ?? 0
            }
            _this.setDatalist = currentList
            $prodTable.DataTable().cell(rowIdx, 3).data(currentList[rowIdx]['uom']).draw(false);
            $prodTable.DataTable().cell(rowIdx, 6).data(currentList[rowIdx]['tax']).draw(false);
            _this.handleTotal(rowIdx)
        });
        // warehouse
        $(`#warehouse_row_${rowIdx}`, row).off().on('select2:select', function (e) {
            let currentList = _this.getDatalist;
            const data = e.params.data
            currentList[rowIdx]['warehouse'] = {
                'id': data.id,
                'title': data.title
            }
            _this.setDatalist = currentList
            $prodTable.DataTable().cell(rowIdx, 2).data(currentList[rowIdx]['warehouse']).draw(false);
        });
        // UoM
        $(`#uom_row_${rowIdx}`, row).off().on('select2:select', function (e) {
            e.stopPropagation()
            let currentList = _this.getDatalist;
            const data = e.params.data
            currentList[rowIdx]['uom'] = {
                'id': data.id,
                'title': data.title
            }
            _this.setDatalist = currentList
            $prodTable.DataTable().cell(rowIdx, 3).data(currentList[rowIdx]['uom']).draw(false);
        });
        // quantity
        $(`#quantity_row_${rowIdx}`, row).off().on('change', function () {
            let currentList = _this.getDatalist;
            currentList[rowIdx]['quantity'] = parseInt(this.value)
            _this.setDatalist = currentList
            _this.handleTotal(rowIdx)
        });
        // unit price
        $(`#unit_price_row_${rowIdx}`, row).off().on('blur', function () {
            let currentList = _this.getDatalist;
            currentList[rowIdx]['unit_price'] = $(this).valCurrency()
            _this.setDatalist = currentList
            _this.handleTotal(rowIdx)
        });
        // tax
        $(`#tax_row_${rowIdx}`, row).off().on('select2:select', function (e) {
            let currentList = _this.getDatalist;
            const data = e.params.data
            currentList[rowIdx]['tax'] = {
                'id': data.id,
                'title': data.title,
                'rate': data.rate
            }
            _this.setDatalist = currentList
            $prodTable.DataTable().cell(rowIdx, 6).data(currentList[rowIdx]['tax']).draw(false);
            _this.handleTotal(rowIdx)
        });
    }

    initTable() {
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
                    data: 'product',
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        let product = '';
                        if (row?.id) {
                            let temp = JSON.stringify({
                                'id': row.id,
                                'title': row.title
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
                                        <select class="form-select dropdown-select_two" id="product_row_${idx}"
                                        data-prefix="product_list" data-select2-closeOnSelect="false"
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
                    data: 'warehouse',
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        const urlSelect = $('#url-factory').attr('data-warehouse')
                        let warehouse = '';
                        if (row?.id) {
                            let temp = JSON.stringify({
                                'id': row.id,
                                'title': row.title
                            });
                            warehouse = temp.replaceAll('"', "'")
                        }
                        return `<select class="form-select dropdown-select_two" id="warehouse_row_${idx}"` +
                            `data-prefix="warehouse_list" data-select2-closeOnSelect="false" ` +
                            `data-url="${urlSelect}" ` +
                            `data-onload="${warehouse ? warehouse : ''}"` +
                            `></select>`;
                    }
                },
                {
                    targets: 3,
                    data: 'uom',
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        const urlSelect = $('#url-factory').attr('data-uom')

                        let uom = '';
                        if (row?.id) {
                            let temp = JSON.stringify({
                                'id': row.id,
                                'title': row.title
                            });
                            uom = temp.replaceAll('"', "'")
                        }
                        let params = ''
                        if (row?.uom_group) {
                            let gTemp = JSON.stringify({'group': row.uom_group})
                            params = gTemp.replace(/"/g, "'")
                        }
                        return `<select class="form-select dropdown-select_two" id="uom_row_${idx}"
                                    data-prefix="unit_of_measure" data-select2-closeOnSelect="false"
                                    data-url="${urlSelect}"
                                    data-params="${params}"
                                    data-onload="${uom ? uom : ''}"></select>`;
                    }
                },
                {
                    targets: 4,
                    data: 'quantity',
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        return `<input class="form-control" id="quantity_row_${idx}" type="text" placeholder="0" required 
                                value="${row ? row : 0}">`;

                    }
                },
                {
                    targets: 5,
                    data: 'unit_price',
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        return `<input class="form-control mask-money" id="unit_price_row_${idx}" data-return-type="number"
                        type="text" placeholder="0" required value="${row ? row : 0}">`;
                    }
                },
                {
                    targets: 6,
                    data: 'tax',
                    render: (row, type, data, meta) => {
                        const idx = meta.row;
                        const urlSelect = $('#url-factory').attr('data-tax')
                        let tax = '';
                        if (row?.id){
                            let temp = JSON.stringify({
                                'id': row.id,
                                'title': row.title
                            });
                            tax = temp.replaceAll('"', "'")
                        }
                        return `<select class="form-select dropdown-select_two w-10" id="tax_row_${idx}" 
                                    data-prefix="tax_list" data-select2-closeOnSelect="false"
                                    data-url="${urlSelect}" 
                                    data-onload="${tax ? tax : ''}"></select>`;
                    }
                },
                {
                    targets: 7,
                    data: 'subtotal_price',
                    render: (row, type, data) => {
                        return `<span class="mask-money" data-init-money="${row ? row : 0}">`;
                    }
                },
                {
                    targets: 8,
                    data: 'product',
                    render: (row, type, data) => {
                        return `<div class="actions-btn text-center">
                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                   title="Delete"
                                   href="#"
                                   data-id="${row?.id}"
                                   data-action="delete">
                                    <span class="btn-icon-wrap">
                                        <i class="bi bi-trash"></i>
                                    </span>
                                </a>
                            </div>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                // auto generate order number
                $('td:eq(0)', row).html(index + 1)
                data['order'] = index + 1

                // init currency
                $.fn.initMaskMoney2()

                // init select 2
                initSelectBox($('.dropdown-select_two', row))

                // init event on change
                _this.columnFuncUtil(index, row)

                // action button delete
                $('.actions-btn a', row).off().on('click', function (e) {
                    $(row).closest('.table').DataTable().rows(row).remove().draw(false);
                    let changeData = _this.getDatalist
                    changeData.splice(index, 1)
                    _this.setDatalist = changeData
                    _this.handleTotal()
                })
            }
        })
    }

    addNewProduct() {
        let $btnAdd = $('#btn-add-product');
        const _this = this
        $btnAdd.off().on('click', function (e) {
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
            let idx = temp.length
            temp[idx] = newData
            _this.setDatalist = temp
            $tableElm.DataTable().row.add(newData).draw()
        });
    };


    init() {
        this.initTable();
        this.addNewProduct();
    };
}

function loadDetail(line) {
    const $form = $('#good_receipt_form')
    if ($form.attr('data-method') === 'put') {
        $.fn.callAjax($form.attr('data-url'), 'get')
            .then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        $('#title').val(data.title)
                        $('#supplier').attr('data-onload', JSON.stringify(data.supplier));
                        initSelectBox($('#supplier'))
                        $('#date_created').val(moment(data.date_created, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY'))
                        $('#posting_date').val(moment(data.posting_date, 'YYYY-MM-DD').format('DD/MM/YYYY'));
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

$(function () {
    // declare variable for all page
    const lineDetail = new lineDetailUtil();
    const $transFactory = $('#trans-factory')
    // end declare variable

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

    // load data on detail page
    loadDetail(lineDetail)

    //run line detail table and all util function
    lineDetail.init()

    // init currency
    $.fn.initMaskMoney2()



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
    $form.on('submit', function (e) {
        $('.readonly [disabled]:not([hidden]):not(i)', $form).attr('disabled', false)
        e.preventDefault();
        let _form = new SetupFormSubmit($form);
        let csr = $("[name=csrfmiddlewaretoken]").val();
        const $tableElm = $('#line_detail_table')
        let lineDetail = $tableElm.DataTable().data().toArray()
        if (!lineDetail) {
            $.fn.notifyPopup({description: $transFactory.attr('data-product')}, 'failure')
            return false
        } else {
            let temp = []
            for (let [idx, val] of lineDetail.entries()) {
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