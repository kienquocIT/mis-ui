function callData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
}

class ExpenseLoadPage {
    static etSelectEle = $('#box-expense-item');
    static uomSelectEle = $('#chooseUom');
    static roleSelectEle = $('#chooseRole')

    static loadExpenseItem(data) {
        let ele = ExpenseLoadPage.etSelectEle;
        ele.initSelect2({
            data: data,
            'allowClear': true,
            disabled: !(ele.attr('data-url')),
        })
    }

    static loadUoM(data) {
        let ele = ExpenseLoadPage.uomSelectEle;
        ele.initSelect2({
            data: data,
            'allowClear': true,
            disabled: !(ele.attr('data-url')),
            keyResp: 'uom_of_group_labor',
            keyText: 'title',
        })
    }

    static loadRole(data) {
        let ele = ExpenseLoadPage.roleSelectEle;
        ele.initSelect2({
            data: data,
            keyResp: 'role_list',
            keyText: 'title',
        })
    }

}

function appendHtmlForPriceList(dataTree, ele, count) {
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

        if (dataTree[i].item?.['price_list_mapped'] !== null) {
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
            ele.find('ul').append(`<div class="row">
                <div class="col-6">
                    <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                        <input class="form-check-input" type="checkbox"
                            value="option1" data-id="` + dataTree[i].item.id + `">
                        <label class="form-check-label required">` + dataTree[i].item.title + `<span class="ml-2 ` + fg_class + `">(` + dataTree[i].item.status + `)</span></label>
                    </div>
                </div>
                <div class="col-6 form-group">
                    <input data-id="` + dataTree[i].item.id + `" class="form-control value-price-list mask-money" data-return-type="number" type="text" value="" disabled>
                </div>
            </div>`)
        }

        count += 1
        if (dataTree[i].child.length !== 0) {
            count = appendHtmlForPriceList(dataTree[i].child, ele, count)
        }
    }
    return count
}

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

function autoSelectPriceListCopyFromSource(price_dict) {
    let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input[disabled]')
    for (let i = 0; i < element.length; i++) {
        let ele_id = element[i].getAttribute('data-id')
        if (price_dict[ele_id] !== undefined && price_dict[ele_id]?.['price_list_mapped'] !== null) {
            element[i].checked = document.querySelector(`input[type="checkbox"][data-id="` + price_dict[ele_id]?.['price_list_mapped'] + `"]`).checked && price_dict[ele_id].status !== 'Expired';
        }
    }
}

function loadPriceList(price_list, price_dict) {
    let element = $('#choosePriceList')
    let dataTree = []
    price_list.map(function (item) {
        if (item?.['price_list_type'].value === 2) {
            if (item?.['price_list_mapped'] === null) {
                dataTree.push({
                    'item': item,
                    'child': []
                })
            } else {
                dataTree = getTreePriceList(dataTree, item?.['price_list_mapped'], item)
            }
        }
    })
    appendHtmlForPriceList(dataTree, element, 0);
    autoSelectPriceListCopyFromSource(price_dict);
}

async function loadDataPriceList() {
    let obj_price = {};
    let url = $('#url-factory').data('price_list');
    let method = 'GET';
    let result = await callData(url, method);
    obj_price['list'] = result.price_list;
    obj_price['dict'] = result.price_list.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});

    return obj_price;
}

async function loadCurrencyPrimary() {
    let url = $('#url-factory').data('currency_list');
    let method = 'GET';
    let result = await callData(url, method);
    return result?.['currency_list'].find(obj => obj.is_primary === true);
}

function loadUoMGroup() {
    let chooseUoMGroup = $('#chooseUoMGroup');
    let url = chooseUoMGroup.data('url');
    let method = chooseUoMGroup.data('method');
    callData(url, method).then((result) => {
        result?.['unit_of_measure_group'].map(function (item) {
            if (item.is_default) {
                chooseUoMGroup.val(item.title);
                chooseUoMGroup.attr('data-id', item.id);
            }
        })
    });
}

function renderDetailData(resp) {
    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense')) {
        let expense_detail = resp.data?.['expense'];
        $x.fn.renderCodeBreadcrumb(expense_detail);
        $.fn.compareStatusShowPageAction(expense_detail);
        $('#expenseTitle').val(expense_detail.title);
        console.log(expense_detail.role)
        ExpenseLoadPage.loadExpenseItem(expense_detail?.['expense_item']);
        ExpenseLoadPage.loadRole(expense_detail.role);
        ExpenseLoadPage.loadUoM(expense_detail.uom);

        return expense_detail.price_list;
    }
}

function loadDetailPriceList(price_list, price_dict, obj_price, expense_price, currency_primary) {
    if (price_list.length === 0 || Object.keys(price_dict).length === 0) {
        price_dict = obj_price.dict;
        price_list = obj_price.list;
        loadPriceList(price_list, price_dict);
    }
    expense_price.map(function (item) {
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


function getDataFormPriceList(price_dict) {
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
    return price_list
}

function controlSelectPriceList(ele, price_dict) {
    let data_id = ele.attr('data-id');
    if (price_dict[data_id].status === "Expired") {
        ele.prop('checked', false);
    }
    autoSelectPriceListCopyFromSource(price_dict)
    if (ele.is(':checked')) {
        $(`input[type="text"][data-id="` + data_id + `"]`).prop('disabled', false)
    } else {
        $(`input[type="text"][data-id="` + data_id + `"]`).prop('disabled', true)
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input:not(:checked)')
        for (let i = 0; i < element.length; i++) {
            document.querySelector(`input[type="text"][data-id="` + element[i].getAttribute('data-id') + `"]`).value = null;
        }
    }
}

function autoInputValuePriceList(price_dict) {
    let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.value-price-list[readonly]')
    for (let i = 0; i < element.length; i++) {
        let ele_id = element[i].getAttribute('data-id')
        if (price_dict[ele_id] !== undefined && price_dict[ele_id]?.['price_list_mapped'] !== null) {
            if (document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id]?.['price_list_mapped'] + `"]`).value !== '' && price_dict[ele_id].status !== 'Expired') {
                let value = document.querySelector(`input[type="text"][data-id="` + price_dict[ele_id]?.['price_list_mapped'] + `"]`).value * price_dict[ele_id].factor;
                element[i].setAttribute('value', value.toString())
            }
        }
        $.fn.initMaskMoney2();
    }
}

function submitForm(ele, price_dict, currency_primary) {
    let frm = new SetupFormSubmit(ele);
    frm.dataForm['uom_group'] = $('#chooseUoMGroup').data('id');
    let price_list = getDataFormPriceList(price_dict);

    if (price_list.length > 0) {
        frm.dataForm['data_price_list'] = price_list;
        frm.dataForm['currency_using'] = currency_primary.id;
    }
    frm.dataForm['role'] = ExpenseLoadPage.roleSelectEle.val();
    return {
        url: frm.dataUrl,
        method: frm.dataMethod,
        data: frm.dataForm,
        urlRedirect: frm.dataUrlRedirect,
    }
}