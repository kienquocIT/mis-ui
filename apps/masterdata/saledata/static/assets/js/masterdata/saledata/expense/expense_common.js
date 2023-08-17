function callData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
}

class ExpenseLoadPage {
    static etSelectEle = $('#chooseExpenseType');
    static uomSelectEle = $('#chooseUom');
    static roleSelectEle = $('#chooseRole')

    static data_a = [];

    static loadExpenseType(data) {
        let ele = ExpenseLoadPage.etSelectEle;
        ele.initSelect2({
            data: data,
            'allowClear': true,
            disabled: !(ele.attr('data-url')),
            keyResp: 'expense_type_list',
            keyText: 'title',
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
            'allowClear': true,
            disabled: !(ele.attr('data-url')),
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
        if (price_dict[ele_id] !== undefined && price_dict[ele_id].price_list_mapped !== null) {
            element[i].checked = document.querySelector(`input[type="checkbox"][data-id="` + price_dict[ele_id].price_list_mapped + `"]`).checked && price_dict[ele_id].status !== 'Expired';
        }
    }
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
        appendHtmlForPriceList(dataTree, element, 0);
        autoSelectPriceListCopyFromSource(price_dict);
    }