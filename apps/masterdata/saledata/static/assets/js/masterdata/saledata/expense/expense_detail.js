$(document).ready(function () {
    // INIT DATA
    const pk = window.location.pathname.split('/').pop();
    const price_list = JSON.parse($('#id-price-list').text());
    const price_dict = price_list.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});

    const currency_primary = JSON.parse($('#id-currency-list').text()).find(obj => obj.is_primary === true);

    $(".select2").select2();

    function loadTaxCode(id) {
        let chooseTaxCode = $('#chooseTaxCode');
        let frm = new SetupFormSubmit(chooseTaxCode);
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    chooseTaxCode.append(`<option></option>`);
                    resp.data.tax_list.map(function (item) {
                        if (item.id === id)
                            chooseTaxCode.append(`<option value="` + item.id + `" selected>` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                        else
                            chooseTaxCode.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadUoM(group_id, id) {
        let chooseUom = $('#chooseUom');
        chooseUom.html('');
        let frm = new SetupFormSubmit(chooseUom);
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                    chooseUom.append(`<option></option>`);
                    resp.data.unit_of_measure.map(function (item) {
                        if (item.group.id === group_id) {
                            if (item.id === id)
                                chooseUom.append(`<option value="` + item.id + `" selected>` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                            else
                                chooseUom.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadUoMGroup(id) {
        let chooseUoMGroup = $('#chooseUoMGroup');
        let frm = new SetupFormSubmit(chooseUoMGroup);
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    chooseUoMGroup.append(`<option></option>`);
                    resp.data.unit_of_measure_group.map(function (item) {
                        if (item.id === id)
                            chooseUoMGroup.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                        else
                            chooseUoMGroup.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadExpenseType(id) {
        let chooseExpenseType = $('#chooseExpenseType');
        let frm = new SetupFormSubmit(chooseExpenseType);
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense_type_list')) {
                    chooseExpenseType.append(`<option></option>`);
                    resp.data.expense_type_list.map(function (item) {
                        if (item.id === id)
                            chooseExpenseType.append(`<option value="` + item.id + `" selected><span>` + item.title + `</span></option>`);
                        else
                            chooseExpenseType.append(`<option value="` + item.id + `"><span>` + item.title + `</span></option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    // onchange select box UoM Group for choose UoM
    $('#chooseUoMGroup').on('change', function () {
        loadUoM($(this).val(), null);
    })

    // load Price List
    function getTreePriceList(dataTree, parent_id, child) {
        for (let i = 0; i < dataTree.length; i++) {
            if (dataTree[i].item.id === parent_id) {
                dataTree[i].child.push({'item': child, 'child': []})
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
                                    <input class="form-check-input" type="checkbox"
                                        value="option1" data-id="` + dataTree[i].item.id + `" disabled>
                                    <label class="form-check-label">` + dataTree[i].item.title + `</label>
                                </div>
                            </div>
                            <div class="col-6 form-group">
                                <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                    <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" readonly>
                                    <span class="input-suffix">` + currency + `</span>
                                </span>
                            </div>
                        </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                            <div class="col-6">
                                <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                    <input class="form-check-input" type="checkbox"
                                        value="option1" data-id="` + dataTree[i].item.id + `">
                                    <label class="form-check-label">` + dataTree[i].item.title + `</label>
                                </div>
                            </div>
                            <div class="col-6 form-group">
                                <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                    <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" disabled>
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
                                        value="option1" checked disabled data-id="` + dataTree[i].item.id + `">
                                    <label class="form-check-label required">` + dataTree[i].item.title + `</label>
                                </div>
                            </div>
                            <div class="col-6 form-group">
                                <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                    <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="">
                                    <span class="input-suffix">` + currency + `</span>
                                </span>
                            </div>
                        </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                            <div class="col-6">
                                <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                    <input class="form-check-input" type="checkbox"
                                        value="option1" data-id="` + dataTree[i].item.id + `">
                                    <label class="form-check-label">` + dataTree[i].item.title + `</label>
                                </div>
                            </div>
                            <div class="col-6 form-group">
                                <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                    <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" disabled>
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

    function loadPriceList(price_list, price_dict) {

        let element = $('#choosePriceList')
        let dataTree = []
        price_list.map(function (item) {
            if (item.price_list_type.value === 2) {
                if (item.price_list_mapped === null) {
                    dataTree.push({'item': item, 'child': []})
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
                if (document.querySelector(`input[type="checkbox"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).checked) {
                    element[i].checked = true;
                } else {
                    element[i].checked = false;
                }
            }
        }
    }

    // auto checked checkbox for price list copy from source
    $(document).on('click', '.ul-price-list .form-check-input', function () {
        autoSelectPriceListCopyFromSource(price_dict)
        if ($(this).prop('checked')) {
            $(`input[type="text"][data-id="` + $(this).attr('data-id') + `"]`).prop('disabled', false)
        } else {
            $(`input[type="text"][data-id="` + $(this).attr('data-id') + `"]`).prop('disabled', true)
            let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input:not(:checked)')
            for (let i = 0; i < element.length; i++) {
                document.querySelector(`input[type="text"][data-id="` + element[i].getAttribute('data-id') + `"]`).value = null;
            }
        }
    })

    // auto to input value for price list copy from source
    $(document).on('input', '.ul-price-list .value-price-list', function () {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.value-price-list[readonly]')
        for (let i = 0; i < element.length; i++) {
            let ele_id = element[i].getAttribute('data-id')
            if (price_dict[ele_id] !== undefined && price_dict[ele_id].price_list_mapped !== null) {
                if (document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).value !== '') {
                    element[i].value = (parseFloat(document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).value.replace(/\./g, '').replace(',', '.')) * price_dict[ele_id].factor).toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            }
        }
    })

    function loadDetailExpense() {
        let frmDetail = $('#frmUpdateExpense')
        let frm = new SetupFormSubmit(frmDetail);
        $.fn.callAjax(frm.dataUrl.replace('1', pk), 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense')) {
                    $('#expenseCode').val(data.expense.code);
                    $('#expenseTitle').val(data.expense.title);
                    loadExpenseType(data.expense.general_information.expense_type.id);
                    loadUoMGroup(data.expense.general_information.uom_group.id);
                    loadUoM(data.expense.general_information.uom_group.id, data.expense.general_information.uom.id);
                    if (data.expense.general_information.tax_code !== null)
                        loadTaxCode(data.expense.general_information.tax_code.id);
                    else
                        loadTaxCode(null);

                    let price_list_expense = data.expense.general_information.price_list;
                    price_list_expense.map(function (item) {
                        if (price_dict[item.id].auto_update === false) {
                            document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).disabled = false;
                        }
                        document.querySelector(`input[type="checkbox"][data-id="` + item.id + `"]`).checked = true;
                        if (item.currency === currency_primary.id)
                            document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).value = item.price_value;
                    })
                    autoSelectPriceListCopyFromSource(price_dict)
                }
            }
        })
    }

    loadDetailExpense()

    //submit form update expense
    let frmCreate = $('#frmUpdateExpense')
    frmCreate.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        if (frm.dataForm['tax_code'] === "") {
            frm.dataForm['tax_code'] = null;
        }
        frm.dataForm['general_information'] = {
            'expense_type': frm.dataForm['expense_type'],
            'uom_group': frm.dataForm['uom_group'],
            'uom': frm.dataForm['uom'],
            'tax_code': frm.dataForm['tax_code'],
        }

        let price_list_add = []
        $('.ul-price-list .value-price-list').each(function () {
            let is_auto_update = '1';
            if (price_dict[$(this).attr('data-id')].auto_update === false) {
                is_auto_update = '0';
            }
            if ($(`input[type="checkbox"][data-id="` + $(this).attr('data-id') + `"]`).prop('checked') === true) {
                if ($(this).val() !== '') {
                    price_list_add.push(
                        {
                            'id': $(this).attr('data-id'),
                            'value': parseFloat($(this).val().replace(/\./g, '').replace(',', '.')),
                            'is_auto_update': is_auto_update,
                        }
                    )
                } else {
                    price_list_add.push(
                        {
                            'id': $(this).attr('data-id'),
                            'value': 0,
                            'is_auto_update': is_auto_update,
                        }
                    )
                }
            }
        })
        frm.dataForm['general_information']['price_list'] = price_list_add;
        frm.dataForm['general_information']['currency_using'] = currency_primary.id;


        $.fn.callAjax(frm.dataUrl.replace('1', pk), frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(window.location, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    })
})