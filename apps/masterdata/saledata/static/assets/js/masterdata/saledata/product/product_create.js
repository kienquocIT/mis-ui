$(document).ready(function () {
    function disabledTab(check, link_tab, id_tab) {
        if (!check) {
            $(link_tab).addClass('disabled');
            $(id_tab).removeClass('active show');
            if ($(`a[href="` + id_tab + `"]`).hasClass('active')) {
                $('a[href="#tab_general"]').addClass('active');
                $('#tab_general').addClass('active show');
            }
            $(`a[href="` + id_tab + `"]`).removeClass('active');
        } else {
            $(link_tab).removeClass('disabled');
        }
    }

    $('#input-product-image').dropify({
        messages: {
            'default': 'Upload an image',
            'replace': 'Drag and drop or click to replace',
            'remove':  'Remove',
            'error':   'Ooops, something wrong happended.'
        },
        tpl: {
            message:' {{ default }}',
        }
    });

    $('#check-tab-inventory').change(function () {
        disabledTab(this.checked, '#link-tab-inventory', '#tab_inventory');
        $('#tab_inventory input,#tab_inventory select').val('');
        if (this.checked) {
            $('.dimensionControl').show();
        } else {
            $('.dimensionControl').hide();
        }
    });

    $('#check-tab-sale').change(function () {
        disabledTab(this.checked, '#link-tab-sale', '#tab_sale');
        $('#tab_sale select').val('');
    });


    $('#check-tab-purchase').change(function () {
        disabledTab(this.checked, '#link-tab-purchase', '#tab_purchase');
    });

    function loadProductType() {
        let ele = $('#select-box-product-type');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_type_list')) {
                    ele.append(`<option></option>`);
                    resp.data.product_type_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadProductCategory() {
        let ele = $('#select-box-product-category');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_category_list')) {
                    ele.append(`<option></option>`);
                    resp.data.product_category_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadUoMGroup() {
        let ele = $('#select-box-uom-group');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    ele.append(`<option></option>`);
                    resp.data.unit_of_measure_group.map(function (item) {
                        if (Object.keys(item.referenced_unit).length !== 0)
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadTaxCode() {
        let ele = $('#select-box-tax-code');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    ele.append(`<option></option>`);
                    resp.data.tax_list.map(function (item) {
                        if (item.type === 0 || item.type === 2)
                            ele.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                    })
                }
            }
        }, (errs) => {
        },)

    }

    function getTreePriceList(dataTree, parent_id, child) {
        for (let i = 0; i < dataTree.length; i++) {
            if (dataTree[i].item.id === parent_id) {
                dataTree[i].child.push({
                    'item': child,
                    'child': []
                })
            } else {
                if (dataTree[i].child.length === 0)
                    continue;
                else {
                    getTreePriceList(dataTree[i].child, parent_id, child)
                }
            }
        }
        return dataTree
    }

    function appendHtmlForPriceList(dataTree, ele, currency, count) {
        for (let i = 0; i < dataTree.length; i++) {
            if (dataTree[i].item.price_list_mapped !== null) {
                if (dataTree[i].item.auto_update === true) {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                <input data-source="` + dataTree[i].item.price_list_mapped + `" class="form-check-input" type="checkbox"
                                    value="option1" data-check="check-` + count + `" data-id="` + dataTree[i].item.id + `" disabled>
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-source="` + dataTree[i].item.price_list_mapped + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" readonly>
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                <input data-source="` + dataTree[i].item.price_list_mapped + `" class="form-check-input" type="checkbox"
                                    value="option1" data-check="check-` + count + `" data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-source="` + dataTree[i].item.price_list_mapped + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" disabled>
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                }
            } else {
                if (dataTree[i].item.is_default === true) {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                <input class="form-check-input" type="checkbox"
                                    value="option1" checked data-check="check-` + count + `" disabled data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label required">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="">
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                <input class="form-check-input" type="checkbox"
                                    value="option1" data-check="check-` + count + `" data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" disabled>
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                }
            }
            count += 1
            if (dataTree[i].child.length !== 0) {
                count = appendHtmlForPriceList(dataTree[i].child, ele, currency, count)
            } else {
                continue;
            }
        }
        return count
    }

    let currency_id;

    function loadPriceList() {
        let ele = $('#select-price-list');
        let currency_primary;
        $.fn.callAjax(ele.attr('data-currency'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency_list')) {
                    data.currency_list.map(function (item) {
                        if (item.is_primary === true) {
                            currency_primary = item.abbreviation;
                            currency_id = item.id;
                        }
                    })
                }
            }
        }, (errs) => {
        },).then(
            (resp) => {
                let dataTree = [];
                $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {
                            data.price_list.map(function (item) {
                                if (item.price_list_type.value === 0) {
                                    if (item.price_list_mapped === null) {
                                        dataTree.push({
                                            'item': item,
                                            'child': []
                                        })
                                    } else {
                                        dataTree = getTreePriceList(dataTree, item.price_list_mapped, item)
                                    }
                                }
                            })
                            appendHtmlForPriceList(dataTree, ele, currency_primary, 0);
                            autoSelectPriceListCopyFromSource()
                        }
                    }
                }, (errs) => {
                },)
            }
        )
    }

    loadPriceList();
    loadProductCategory();
    loadProductType();
    loadUoMGroup();
    loadTaxCode();

    // change select box UoM group tab general
    $('#select-box-uom-group').on('change', function () {
        $('#uom-code').val('');
        let select_box_default_uom = $('#select-box-default-uom');
        let select_box_uom_name = $('#select-box-uom-name');
        select_box_default_uom.html('');
        select_box_uom_name.html('');
        if ($(this).val()) {
            let data_url = $(this).attr('data-url-detail').replace(0, $(this).val());
            let data_method = $(this).attr('data-method');
            $.fn.callAjax(data_url, data_method).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('uom_group')) {
                        select_box_default_uom.append(`<option></option>`);
                        select_box_uom_name.append(`<option data-code=""></option>`);
                        data.uom_group.uom.map(function (item) {
                            select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                            select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `">` + item.uom_title + `</option>`);
                        })
                    }
                }
            }, (errs) => {
            },)
        }
    })

    // change select box UoM Name in tab inventory
    $('#select-box-uom-name').on('change', function () {
        $('#uom-code').val($(this).find(":selected").attr('data-code'));
    })

    $('#select-box-default-uom').on('change', function () {
        if ($('#check-tab-inventory').is(':checked') === true) {
            if ($('#select-box-uom-name').val() === '') {
                $('#select-box-uom-name').val($(this).val());
                $('#uom-code').val(($('#select-box-uom-name option:selected').attr('data-code')));
            }
        }
    })

    function getDataForm(dataForm) {
        let list_option = []
        let price_list = []
        $('.ul-price-list .value-price-list').each(function () {
            let is_auto_update = '1';
            if ($(this).attr('data-auto-update') === 'false') {
                is_auto_update = '0';
            }
            if ($(`input[type="checkbox"][data-id="` + $(this).attr('data-id') + `"]`).prop('checked') === true) {
                if ($(this).val() !== '') {
                    price_list.push(
                        {
                            'price_list_id': $(this).attr('data-id'),
                            'price_value': parseFloat($(this).val().replace(/\./g, '').replace(',', '.')),
                            'is_auto_update': is_auto_update,
                        }
                    )
                } else {
                    price_list.push(
                        {
                            'price_list_id': $(this).attr('data-id'),
                            'price_value': 0,
                            'is_auto_update': is_auto_update,
                        }
                    )
                }
            }
        })

        if ($('#check-tab-sale').is(':checked') === true) {
            dataForm['price_list'] = price_list;
            let measurementList = []
            dataForm['currency_using'] = currency_id;

            if($('[name="length"]').val() === ''){
                delete dataForm['length']
            }
            if($('[name="width"]').val() === ''){
                delete dataForm['width']
            }
            if($('[name="height"]').val() === ''){
                delete dataForm['height']
            }
            let inpVolume = $('[name="volume"]');
            let inpWeight = $('[name="weight"]');
            if(inpVolume.val() !== ''){
                measurementList.push({
                    'unit': inpVolume.attr('data-id'),
                    'value': parseFloat(inpVolume.val())
                })
            }
            if (inpWeight.val() !== ''){
                measurementList.push({
                    'unit': inpWeight.attr('data-id'),
                    'value': parseFloat(inpWeight.val())
                })
            }


            dataForm['measure'] = measurementList;
            list_option.push(0)
        } else {
            let list_field_del = ['default_uom', 'tax_code', 'currency_using', 'length', 'width', 'height', 'measure', 'price_list']
            for (const key of list_field_del) {
                if (key in dataForm) {
                    delete dataForm[key];
                }
            }
        }

        if ($('#check-tab-inventory').is(':checked') === true) {
            if (dataForm['inventory_level_min'] === ''){
                delete dataForm['inventory_level_min']
            }
            if (dataForm['inventory_level_max'] === ''){
                delete dataForm['inventory_level_max']
            }
            list_option.push(1)
        } else {
            let list_field_del = ['inventory_uom', 'inventory_level_min', 'inventory_level_max', 'height', 'width', 'length', 'measure']
            for (const key of list_field_del) {
                if (key in dataForm) {
                    delete dataForm[key];
                }
            }
        }

        if ($('#check-tab-purchase').is(':checked') === true) {
            list_option.push(2)
        }

        dataForm['product_choice'] = list_option;
        return dataForm
    }

    //submit form create product
    let form_create_product = $('#form-create-product');
    form_create_product.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let dataForm = getDataForm(frm.dataForm);

        console.log(frm.dataForm)
        $.fn.callAjax(frm.dataUrl, frm.dataMethod,  dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    })

    function autoSelectPriceListCopyFromSource() {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input[disabled]')
        for (let i = 0; i < element.length; i++) {
            if (element[i].hasAttribute('data-source')) {
                let data_id = element[i].getAttribute('data-source')
                if (document.querySelector(`input[type="checkbox"][data-id="` + data_id + `"]`).checked) {
                    element[i].checked = true;
                } else {
                    element[i].checked = false;
                }
            }
        }
    }

    $(document).on('click', '.ul-price-list .form-check-input', function () {
        autoSelectPriceListCopyFromSource()
        if ($(this).prop('checked')) {
            $(`input[data-text="` + $(this).attr('data-check') + `"]`).prop('disabled', false)
        } else {
            $(`input[data-text="` + $(this).attr('data-check') + `"]`).prop('disabled', true)
            // $(`input[data-text="`+ $(this).attr('data-check') +`"]`).val(null);
            let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input:not(:checked)')
            for (let i = 0; i < element.length; i++) {
                document.querySelector(`input[type="text"][data-text="` + element[i].getAttribute('data-check') + `"]`).value = null;
            }
        }

    })

    $(document).on('input', '.ul-price-list .value-price-list', function () {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.value-price-list[readonly]')
        for (let i = 0; i < element.length; i++) {
            if (element[i].hasAttribute('data-source')) {
                let data_id = element[i].getAttribute('data-source')
                if (document.querySelector(`input[type="text"][data-id="` + data_id + `"]`).value !== '') {
                    element[i].value = (parseFloat(document.querySelector(`input[type="text"][data-id="` + data_id + `"]`).value.replace(/\./g, '').replace(',', '.')) * element[i].getAttribute('data-factor')).toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            }
        }
    })

    const inpDimensionEle = $('.inpDimension')
    const inpVolumeEle = $('input[name="volume"]');
    inpDimensionEle.on('change', function () {
        let dimensions = $('.inpDimension').map(function () {
            return $(this).val();
        }).get();

        let volume = dimensions.reduce(function (a, b) {
            return (a * b).toFixed(2);
        }, 1);

        if (volume === (0).toFixed(2)) {
            inpVolumeEle.val('');
        } else {
            inpVolumeEle.val(volume);
        }
    });

    const item_unit_list = JSON.parse($('#id-unit-list').text());
    const item_unit_dict = item_unit_list.reduce((obj, item) => {
        obj[item.title] = item;
        return obj;
    }, {});

    function loadBaseItemUnit() {
        let eleVolume = $('#divVolume');
        let eleWeight = $('#divWeight');

        eleVolume.find('.input-suffix').text(item_unit_dict['volume'].measure)
        eleVolume.find('input').attr('data-id', item_unit_dict['volume'].id)
        eleWeight.find('.input-suffix').text(item_unit_dict['weight'].measure)
        eleWeight.find('input').attr('data-id', item_unit_dict['weight'].id)
    }

    loadBaseItemUnit();

    function loadWareHouseList() {
        if (!$.fn.DataTable.isDataTable('#datatable-warehouse-list')) {
            let dtb = $('#datatable-warehouse-list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                dom: '',
                paging: false,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['warehouse_list'] ? resp.data['warehouse_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        data: 'code',
                        className: 'wrap-text w-25',
                        render: (data, type, row, meta) => {
                            return `<span class="text-secondary">` + row.code + `</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text text-center w-50',
                        render: (data, type, row, meta) => {
                            return `<center><span class="text-secondary"><b>` + row.title + `</b></span></center>`
                        }
                    },
                    {
                        data: 'stock_value',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<span>0</span>`
                        }
                    },
                ],
            });
        }
    }

    loadWareHouseList();

    function loadWareHouseOverView() {
        if (!$.fn.DataTable.isDataTable('#datatable-warehouse-overview')) {
            let dtb = $('#datatable-warehouse-overview');
            dtb.DataTableDefault({
                dom: '',
                paging: false,
                data: [''],
                columns: [
                    {
                        data: '',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<span style="font-weight: bolder" class="text-danger">0</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<span style="font-weight: bolder" class="text-danger">0</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<span style="font-weight: bolder" class="text-danger">0</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<span style="font-weight: bolder" class="text-danger">0</span>`
                        }
                    },
                ],
            });
        }
    }

    loadWareHouseOverView();
})