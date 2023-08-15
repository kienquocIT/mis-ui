$(document).ready(function () {
    // INIT DATA
    const price_list = JSON.parse($('#id-price-list').text());
    const price_dict = price_list.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});

    const currency_primary = JSON.parse($('#id-currency-list').text()).find(obj => obj.is_primary === true);

    function loadUoM(group_id) {
        let chooseUom = $('#chooseUom');
        let url = chooseUom.data('select2-url');
        let method = chooseUom.data('method')
        $.fn.callAjax2({
            'url': url,
            'method': method
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                    chooseUom.append(`<option></option>`);
                    resp.data.unit_of_measure.map(function (item) {
                        if (item.group.id === group_id) {
                            chooseUom.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadUoMGroup() {
        let chooseUoMGroup = $('#chooseUoMGroup');
        let url = chooseUoMGroup.data('url');
        let method = chooseUoMGroup.data('method')
        $.fn.callAjax2({
            'url': url,
            'method': method
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    resp.data.unit_of_measure_group.map(function (item) {
                        if (item.is_default) {
                            chooseUoMGroup.val(item.title);
                            chooseUoMGroup.attr('data-id', item.id);
                            loadUoM(item.id);
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadExpenseType() {
        let chooseExpenseType = $('#chooseExpenseType');
        let url = chooseExpenseType.data('select2-url');
        let method = chooseExpenseType.data('method')
        $.fn.callAjax2({
            'url': url,
            'method': method
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense_type_list')) {
                    chooseExpenseType.append(`<option></option>`);
                    resp.data.expense_type_list.map(function (item) {
                        chooseExpenseType.append(`<option value="` + item.id + `"><span>` + item.title + `</span></option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    loadExpenseType();
    loadUoMGroup();


    // submit form create expense
    let frmCreate = $('#frmCreateExpense')
    frmCreate.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['uom_group'] = $('#chooseUoMGroup').data('id');
        let price_list = []
        $('.ul-price-list .value-price-list').each(function () {
            let is_auto_update = '1';
            if (price_dict[$(this).attr('data-id')].auto_update === false) {
                is_auto_update = '0';
            }
            if ($(`input[type="checkbox"][data-id="` + $(this).attr('data-id') + `"]`).prop('checked') === true) {
                if ($(this).val() !== '') {
                    price_list.push(
                        {
                            'id': $(this).attr('data-id'),
                            'value': $(this).valCurrency(),
                            'is_auto_update': is_auto_update,
                        }
                    )
                } else {
                    price_list.push(
                        {
                            'id': $(this).attr('data-id'),
                            'value': 0,
                            'is_auto_update': is_auto_update,
                        }
                    )
                }
            }
        })

        if (price_list.length > 0) {
            frm.dataForm['data_price_list'] = price_list;
            frm.dataForm['currency_using'] = currency_primary.id;
        }

        frm.dataForm['role'] = $('#chooseRole').val();

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
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
                })
    })

    // load Price List
    function getTreePriceList(dataTree, parent_id, child) {
        for (let i = 0; i < dataTree.length; i++) {
            if (dataTree[i].item.id === parent_id) {
                dataTree[i].child.push({
                    'item': child,
                    'child': []
                })
            } else {
                if (dataTree[i].child.length !== 0) {
                    getTreePriceList(dataTree[i].child, parent_id, child)
                }
            }
        }
        return dataTree
    }

    function appendHtmlForPriceList(dataTree, ele, currency, count) {
        for (let i = 0; i < dataTree.length; i++) {
            let fg_class = '';
            switch (dataTree[i].item.status) {
                case "Valid":
                    fg_class = 'text-success';
                    break;
                case "Invalid":
                    fg_class = 'text-warning';
                    break;
                case "Expired":
                    fg_class = "text-danger";
            }

            if (dataTree[i].item.price_list_mapped !== null) {
                if (dataTree[i].item.auto_update === true) {
                    ele.find('ul').append(`<div class="row">
                            <div class="col-6">
                                <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                    <input class="form-check-input" type="checkbox"
                                        value="option1" data-id="` + dataTree[i].item.id + `" disabled>
                                    <label class="form-check-label">` + dataTree[i].item.title + `<span class="ml-2 ` + fg_class + `">(` + dataTree[i].item.status + `)</span></label>
                                </div>
                            </div>
                            <div class="col-6 form-group">
                                <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list mask-money" data-return-type="number" type="text" value="" readonly>
                            </div>
                        </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                            <div class="col-6">
                                <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                    <input class="form-check-input" type="checkbox"
                                        value="option1" data-id="` + dataTree[i].item.id + `">
                                    <label class="form-check-label">` + dataTree[i].item.title + `<span class="ml-2 ` + fg_class + `">(` + dataTree[i].item.status + `)</span></label>
                                </div>
                            </div>
                            <div class="col-6 form-group">
                                <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list mask-money" type="text" data-return-type="number" value="" disabled>
                            </div>
                        </div>`)
                }
            } else {
                if (dataTree[i].item.is_default === true) {
                    ele.find('ul').append(`<div class="row">
                            <div class="col-6">
                                <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                    <input class="form-check-input" type="checkbox"
                                        value="option1" checked disabled data-id="` + dataTree[i].item.id + `">
                                    <label class="form-check-label required">` + dataTree[i].item.title + `<span class="ml-2 ` + fg_class + `">(` + dataTree[i].item.status + `)</span></label>
                                </div>
                            </div>
                            <div class="col-6 form-group">
                                <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list mask-money" data-return-type="number" type="text" value="">
                            </div>
                        </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                            <div class="col-6">
                                <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                    <input class="form-check-input" type="checkbox"
                                        value="option1" data-id="` + dataTree[i].item.id + `">
                                    <label class="form-check-label">` + dataTree[i].item.title + `<span class="ml-2 ` + fg_class + `">(` + dataTree[i].item.status + `)</span></label>
                                </div>
                            </div>
                            <div class="col-6 form-group">
                                <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list mask-money" type="text" data-return-type="number" value="" disabled>    
                            </div>
                        </div>`)
                }
            }

            count += 1
            if (dataTree[i].child.length !== 0) {
                count = appendHtmlForPriceList(dataTree[i].child, ele, currency, count)
            }
        }
        return count
    }

    function loadPriceList(price_list, price_dict) {

        let element = $('#choosePriceList')
        let dataTree = []
        price_list.map(function (item) {
            if (item.price_list_type.value === 2) {
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
        appendHtmlForPriceList(dataTree, element, currency_primary.abbreviation, 0);
        autoSelectPriceListCopyFromSource(price_dict);
    }

    loadPriceList(price_list, price_dict);

    function autoSelectPriceListCopyFromSource(price_dict) {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input[disabled]')
        for (let i = 0; i < element.length; i++) {
            let ele_id = element[i].getAttribute('data-id')
            if (price_dict[ele_id] !== undefined && price_dict[ele_id].price_list_mapped !== null) {
                element[i].checked = document.querySelector(`input[type="checkbox"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).checked && price_dict[ele_id].status !== 'Expired';
            }
        }
    }

    // auto checked checkbox for price list copy from source
    $(document).on('click', '.ul-price-list .form-check-input', function () {
        let data_id = $(this).attr('data-id');
        if (price_dict[data_id].status === "Expired") {
            $(this).prop('checked', false);
        }
        autoSelectPriceListCopyFromSource(price_dict)
        if ($(this).prop('checked')) {
            $(`input[type="text"][data-id="` + data_id + `"]`).prop('disabled', false)
        } else {
            $(`input[type="text"][data-id="` + data_id + `"]`).prop('disabled', true)
            let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input:not(:checked)')
            for (let i = 0; i < element.length; i++) {
                document.querySelector(`input[type="text"][data-id="` + element[i].getAttribute('data-id') + `"]`).value = null;
            }
        }
    })

    // auto to input value for price list copy from source
    $(document).on('change', '.ul-price-list .value-price-list', function () {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.value-price-list[readonly]')
        for (let i = 0; i < element.length; i++) {
            let ele_id = element[i].getAttribute('data-id')
            if (price_dict[ele_id] !== undefined && price_dict[ele_id].price_list_mapped !== null) {
                if (document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).value !== '' && price_dict[ele_id].status !== 'Expired') {
                    element[i].setAttribute('value', document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).value * price_dict[ele_id].factor)
                }
            }
            $.fn.initMaskMoney2();
        }
    })


    function loadRole() {
        let chooseRole = $('#chooseRole');
        let url = chooseRole.data('select2-url');
        let method = chooseRole.data('method')
        $.fn.callAjax2({
            'url': url,
            'method': method
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('role_list')) {
                    resp.data.role_list.map(function (item) {
                        chooseRole.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    loadRole();
})