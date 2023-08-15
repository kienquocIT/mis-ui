$(document).ready(function () {
    // INIT DATA
    const pk = window.location.pathname.split('/').pop();
    const price_list = JSON.parse($('#id-price-list').text());
    const price_dict = price_list.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});

    const currency_primary = JSON.parse($('#id-currency-list').text()).find(obj => obj.is_primary === true);
    const frmDetail = $('#frmUpdateExpense');

    function loadUoM(group_id, id) {
        let chooseUom = $('#chooseUom');
        chooseUom.html('');
        let url = chooseUom.data('select2-url');
        let method = chooseUom.data('method')
        $.fn.callAjax2({
            'url': url,
            'method': method
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
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
                        if (item.id === id)
                            chooseUoMGroup.val(item.title);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadExpenseType(id) {
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
                                    <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list mask-money" type="text" value="" data-return-type="number" readonly>
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
                                <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list mask-money" type="text" value="" data-return-type="number" disabled>
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
                                <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list mask-money" data-return-type="number" type="text" value="" disabled>
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
                if (document.querySelector(`input[type="checkbox"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).checked) {
                    element[i].checked = true;
                } else {
                    element[i].checked = false;
                }
            }
        }
    }

    function autoSelectPriceListAfterCheckBox(price_dict) {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input[disabled]')
        for (let i = 0; i < element.length; i++) {
            let ele_id = element[i].getAttribute('data-id')
            if (price_dict[ele_id] !== undefined && price_dict[ele_id].price_list_mapped !== null) {
                let is_check = element[i].checked;
                if (document.querySelector(`input[type="checkbox"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).checked) {
                    element[i].checked = true;
                } else {
                    element[i].checked = false;
                }
                if (price_dict[ele_id].status === 'Expired') {
                    element[i].checked = is_check;
                }
            }
        }
    }


    // auto checked checkbox for price list copy from source
    $(document).on('click', '.ul-price-list .form-check-input', function () {
        let data_id = $(this).attr('data-id');
        if (price_dict[data_id].status === "Expired") {
            $(this).prop('checked', !$(this).prop('checked'));
        }
        autoSelectPriceListAfterCheckBox(price_dict)
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
    $(document).on('change', '.ul-price-list .value-price-list', function () {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.value-price-list[readonly]')
        for (let i = 0; i < element.length; i++) {
            let ele_id = element[i].getAttribute('data-id')
            if (price_dict[ele_id] !== undefined && price_dict[ele_id].price_list_mapped !== null) {
                if (document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).value !== '' && price_dict[ele_id].status !== 'Expired') {
                    element[i].setAttribute('value', document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).value * price_dict[ele_id].factor);
                }
            }
        }
        $.fn.initMaskMoney2();
    })

    function loadDetailExpense() {
        let frm = new SetupFormSubmit(frmDetail);
        $.fn.callAjax(frm.dataUrl.replace('1', pk), 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense')) {
                    let expense_detail = data?.['expense'];
                    $.fn.compareStatusShowPageAction(expense_detail);
                    $('#expenseCode').text(expense_detail.code);
                    $('#expenseTitle').val(expense_detail.title);
                    loadExpenseType(expense_detail.expense_type);
                    loadUoMGroup(expense_detail.uom_group);
                    loadUoM(expense_detail.uom_group, expense_detail.uom);
                    loadRole(expense_detail.role)
                    let price_list_expense = expense_detail.price_list;
                    price_list_expense.map(function (item) {
                        if (price_dict[item.id].auto_update === false) {
                            document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).disabled = false;
                        }
                        document.querySelector(`input[type="checkbox"][data-id="` + item.id + `"]`).checked = true;
                        if (item.currency === currency_primary.id)
                            document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).setAttribute('value', item.price_value);

                    })
                    $.fn.initMaskMoney2();
                    autoSelectPriceListCopyFromSource(price_dict)
                }
            }
        })
    }

    loadDetailExpense()

    //submit form update expense

    frmDetail.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        frm.dataForm['role'] = $('#chooseRole').val();
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
                            'value': $(this).valCurrency(),
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
        frm.dataForm['data_price_list'] = price_list_add;
        frm.dataForm['currency_using'] = currency_primary.id;
        frm.dataForm['uom'] = $('#chooseUom').val();

        $.fn.callAjax(frm.dataUrl.replace('1', pk), frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(window.location, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    })

    function loadRole(list_id) {
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
                        if (list_id.includes(item.id)) {
                            chooseRole.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                        }
                        chooseRole.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }
})