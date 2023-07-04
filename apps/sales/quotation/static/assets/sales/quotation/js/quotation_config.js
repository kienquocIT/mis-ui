"use strict";

function loadConfig(data) {
    if (data.short_sale_config) {
        $('#is-choose-price-list')[0].checked = data.short_sale_config.is_choose_price_list;
        $('#is-input-price')[0].checked = data.short_sale_config.is_input_price;
        $('#is-discount-on-product')[0].checked = data.short_sale_config.is_discount_on_product;
        $('#is-discount-on-total')[0].checked = data.short_sale_config.is_discount_on_total;
    }
    if (data.long_sale_config) {
        $('#is-not-input-price')[0].checked = data.long_sale_config.is_not_input_price;
        $('#is-not-discount-on-product')[0].checked = data.long_sale_config.is_not_discount_on_product;
        $('#is-not-discount-on-total')[0].checked = data.long_sale_config.is_not_discount_on_total;
    }
}

function loadInitIndicatorList(indicator_id, eleShow, indicator_detail_id = null, row = null) {
    let jqueryId = '#' + indicator_id;
    let ele = $(jqueryId);
    if (ele.val()) {
        if (eleShow.is(':empty')) {
            let data_list = JSON.parse(ele.val());
            let indicator_list = ``;
            for (let i = 0; i < data_list.length; i++) {
                let item = data_list[i];
                item['is_indicator'] = true;
                item['syntax'] = "indicator(" + item.title + ")";
                item['syntax_show'] = "indicator(" + item.title + ")";
                let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                if (item.id !== indicator_detail_id) { // check & not append this current indicator
                    indicator_list += `<div class="row param-item">
                                            <button type="button" class="btn btn-flush-light">
                                                <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="indicator-title">${item.title}</span></span></div>
                                                <input type="hidden" class="data-show" value="${dataStr}">
                                            </button>
                                        </div>`
                }
                // load detail editor by ID indicator
                if (indicator_detail_id) {
                    if (item.id === indicator_detail_id) {
                        let editor = row.querySelector('.indicator-editor');
                        editor.value = item.formula_data_show;
                    }
                }
            }
            eleShow.append(`<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-250p position-relative overflow-y-scroll">
                                ${indicator_list}
                            </div>`);
        }
    }
}

function loadInitPropertyList(property_id, eleShow, is_sale_order = false) {
    let jqueryId = '#' + property_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    let code_app = "quotation";
    if (is_sale_order === true) {
        code_app = "saleorder";
    }
    let data_filter = {'application__code': code_app};
    if (eleShow.is(':empty')) {
        $.fn.callAjax(url, method, data_filter).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('application_property_list') && Array.isArray(data.application_property_list)) {
                        let param_list = ``;
                        data.application_property_list.map(function (item) {
                            item['is_property'] = true;
                            item['syntax'] = "prop(" + item.title + ")";
                            item['syntax_show'] = "prop(" + item.title + ")";
                            let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                            param_list += `<div class="row param-item">
                                                <button type="button" class="btn btn-flush-light">
                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="property-title">${item.title}</span></span></div>
                                                    <input type="hidden" class="data-show" value="${dataStr}">
                                                </button>
                                            </div>`
                        })
                        eleShow.append(`<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-250p position-relative overflow-y-scroll">
                                            ${param_list}
                                        </div>`);
                    }
                }
            }
        )
    }
}

function loadInitParamList(param_id, eleShow) {
    let jqueryId = '#' + param_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    let data_filter = {'param_type': 2};
    if (eleShow.is(':empty')) {
        $.fn.callAjax(url, method, data_filter).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('indicator_param') && Array.isArray(data.indicator_param)) {
                        let param_list = ``;
                        data.indicator_param.map(function (item) {
                            let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                            param_list += `<div class="row param-item">
                                                <button type="button" class="btn btn-flush-light">
                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="property-title">${item.title}</span></span></div>
                                                    <input type="hidden" class="data-show" value="${dataStr}">
                                                </button>
                                            </div>`
                        })
                        eleShow.append(`<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-250p position-relative overflow-y-scroll">
                                            ${param_list}
                                        </div>`);
                    }
                }
            }
        )
    }
}

function setupSubmit() {
    let result = {}
    result['short_sale_config'] = {
        'is_choose_price_list': $('#is-choose-price-list')[0].checked,
        'is_input_price': $('#is-input-price')[0].checked,
        'is_discount_on_product': $('#is-discount-on-product')[0].checked,
        'is_discount_on_total': $('#is-discount-on-total')[0].checked,
    }
    result['long_sale_config'] = {
        'is_not_input_price': $('#is-not-input-price')[0].checked,
        'is_not_discount_on_product': $('#is-not-discount-on-product')[0].checked,
        'is_not_discount_on_total': $('#is-not-discount-on-total')[0].checked,
    }
    return result
}

$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_config_create');
        let tableIndicator = $('#table_indicator_list');
        let btnCreateIndicator = $('#btn-create-indicator');

        // call ajax get info quotation config detail
        $.fn.callAjax($form.data('url'), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    loadConfig(data)
                }
            }
        )

        // enable edit
        $('#btn-edit_quotation_config').on('click', function () {
            $(this)[0].setAttribute('hidden', true)
            $('#btn-create_quotation_config')[0].removeAttribute('hidden');
            $form.find('.disabled-but-edit').removeAttr('disabled');
        });

        // Submit form config quotation + sale order
        $form.submit(function (e) {
            e.preventDefault()
            let _form = new SetupFormSubmit($(this));
            let dataSubmit = setupSubmit();
            if (dataSubmit) {
                _form.dataForm['short_sale_config'] = dataSubmit.short_sale_config;
                _form.dataForm['long_sale_config'] = dataSubmit.long_sale_config;
            }
            let submitFields = [
                'short_sale_config',
                'long_sale_config',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl($(this).attr('data-url-redirect'), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });


        // TAB INDICATOR
        function loadIndicatorDbl() {
            let $table = tableIndicator;
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('quotation_indicator_list')) {
                            $('#init-indicator-list').val(JSON.stringify(resp.data['quotation_indicator_list']));
                            return resp.data['quotation_indicator_list'] ? resp.data['quotation_indicator_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columnDefs: [
                    {
                        "width": "5%",
                        "targets": 0
                    }, {
                        "width": "40%",
                        "targets": 1
                    }, {
                        "width": "5%",
                        "targets": 2
                    }, {
                        "width": "45%",
                        "targets": 3
                    }, {
                        "width": "5%",
                        "targets": 4
                    }
                ],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            return `<span>${row.order}</span>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            // return `<span>${row.title}</span>`
                            return `<input type="text" class="form-control table-row-title" value="${row.title}" hidden><span>${row.title}</span>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            let modalID = "indicatorEditModalCenter" + String(row.order);
                            let modalTarget = "#indicatorEditModalCenter" + String(row.order);
                            let tabIndicatorID = "tab_indicator_" + String(row.order);
                            let tabIndicatorHref = "#tab_indicator_" + String(row.order);
                            let tabPropertyID = "tab_property_" + String(row.order);
                            let tabPropertyHref = "#tab_property_" + String(row.order);
                            let tabFunctionID = "tab_function_" + String(row.order);
                            let tabFunctionHref = "#tab_function_" + String(row.order);
                            let tabOperatorID = "tab_operator_" + String(row.order);
                            let tabOperatorHref = "#tab_operator_" + String(row.order);
                            return `<button
                                        type="button"
                                        class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover modal-edit-formula"
                                        data-bs-toggle="modal"
                                        data-bs-target="${modalTarget}"
                                    ><span class="icon"><i class="fa-regular fa-pen-to-square"></i></span></button>
                                    <div
                                            class="modal fade" id="${modalID}" tabindex="-1"
                                            role="dialog" aria-labelledby="${modalID}"
                                            aria-hidden="true"
                                    >
                                        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">${$.fn.transEle.attr('data-edit-formula')}</h5>
                                                    <button
                                                            type="button" class="btn-close"
                                                            data-bs-dismiss="modal" aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <div class="row">
                                                        <div class="form-group">
                                                            <label class="form-label">${$.fn.transEle.attr('data-editor')}</label>
                                                            <textarea class="form-control indicator-editor" rows="3" cols="50" name=""></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <ul class="nav nav-light">
                                                            <li class="nav-item">
                                                                <a class="nav-link active" data-bs-toggle="tab" href="${tabIndicatorHref}">
                                                                <span class="nav-link-text">${$.fn.transEle.attr('data-indicator')}</span>
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" data-bs-toggle="tab" href="${tabPropertyHref}">
                                                                <span class="nav-link-text">${$.fn.transEle.attr('data-property')}</span>
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" data-bs-toggle="tab" href="${tabFunctionHref}">
                                                                <span class="nav-link-text">${$.fn.transEle.attr('data-function')}</span>
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" data-bs-toggle="tab" href="${tabOperatorHref}">
                                                                <span class="nav-link-text">${$.fn.transEle.attr('data-operator')}</span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                        
                                                        <div class="tab-content">
                                                            <div class="row tab-pane fade show active" id="${tabIndicatorID}">
                                                                <div class="row">
                                                                    <div class="col-4 indicator-list"></div>
                                                                    <div class="col-8 indicator-description"></div>
                                                                </div>
                                                            </div>
                                                            <div class="row tab-pane fade" id="${tabPropertyID}">
                                                                <div class="row">
                                                                    <div class="col-4 property-list"></div>
                                                                    <div class="col-8 property-description"></div>
                                                                </div>
                                                            </div>
                                                            <div class="row tab-pane fade" id="${tabFunctionID}">
                                                                <div class="row">
                                                                    <div class="col-4 function-list"></div>
                                                                    <div class="col-8 function-description"></div>
                                                                </div>
                                                            </div>
                                                            <div class="row tab-pane fade" id="${tabOperatorID}">
                                                                <div class="col-6"></div>
                                                                <div class="col-6"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row modal-footer-edit-formula">
                                                    <div class="col-6 modal-edit-formula-validate">
                                                        <span class="valid-indicator-formula ml-1"></span>
                                                    </div>
                                                    <div class="col-6 modal-edit-formula-action">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${$.fn.transEle.attr('data-btn-close')}</button>
                                                        <button 
                                                            type="button" 
                                                            class="btn btn-primary btn-edit-indicator"
                                                            data-id="${row.id}"
                                                        >${$.fn.transEle.attr('data-btn-save')}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            // return `<span>${row.description}</span>`
                            return `<input type="text" class="form-control table-row-description" value="${row.remark}">`
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            let btn_edit = `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover table-row-save" data-id="${row.id}" disabled><span class="icon"><i class="fa-regular fa-floppy-disk"></i></span></button>`;
                            let btn_delete = `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row" data-id="${row.id}" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`;
                            return btn_edit + btn_delete;
                        }
                    }
                ],
            });
        }

        $('#tab-indicator').on('click', function () {
            // disable main edit & save btn
            document.getElementById('btn-edit_quotation_config').setAttribute('hidden', 'true');
            document.getElementById('btn-create_quotation_config').setAttribute('hidden', 'true');
            // load table indicator
            $('#table_indicator_list').DataTable().destroy();
            loadIndicatorDbl();
        });

        $('#tab-config').on('click', function () {
            // enable main edit & save btn
            document.getElementById('btn-edit_quotation_config').removeAttribute('hidden');
        });

        tableIndicator.on('change', '.table-row-title, .table-row-description', function(e) {
            $(this)[0].closest('tr').querySelector('.table-row-save').removeAttribute('disabled');
        });

        tableIndicator.on('click', '.table-row-save', function(e) {
            let url_update = btnCreateIndicator.attr('data-url-update');
            let url = url_update.format_url_with_uuid($(this).attr('data-id'));
            let url_redirect = btnCreateIndicator.attr('data-url-redirect');
            let method = "put";
            let data_submit = {};
            data_submit['title'] = $(this)[0].closest('tr').querySelector('.table-row-title').value;
            data_submit['remark'] = $(this)[0].closest('tr').querySelector('.table-row-description').value;
            data_submit['example'] = "indicator(" + data_submit['title'] + ")";
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(url, method, data_submit, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl(url_redirect, 3000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
            // disable save btn
            $(this)[0].setAttribute('disabled', true);
        });

        tableIndicator.on('click', '.modal-edit-formula', function(e) {
            let eleIndicatorListShow = $(this)[0].closest('tr').querySelector('.indicator-list');
            let row = $(this)[0].closest('tr');
            let indicator_detail_id = row.querySelector('.btn-edit-indicator').getAttribute('data-id');
            loadInitIndicatorList('init-indicator-list', $(eleIndicatorListShow), indicator_detail_id, row);
            let elePropertyListShow = $(this)[0].closest('tr').querySelector('.property-list');
            if (!$form.hasClass('sale-order')) {
                loadInitPropertyList('init-indicator-property-param', $(elePropertyListShow));
            } else {
                loadInitPropertyList('init-indicator-property-param', $(elePropertyListShow), true);
            }
            let eleParamFunctionListShow = $(this)[0].closest('tr').querySelector('.function-list');
            loadInitParamList('init-indicator-param-list', $(eleParamFunctionListShow));
        });

        tableIndicator.on('click', '.param-item', function(e) {
            let propertySelected = $(this)[0].querySelector('.data-show');
            if (propertySelected) {
                let dataShow = JSON.parse(propertySelected.value);
                // show editor
                let editor = $(this)[0].closest('.modal-body').querySelector('.indicator-editor');
                editor.value = editor.value + dataShow.syntax;
            }
        });

        tableIndicator.on('mouseenter', '.param-item', function(e) {
            let propertySelected = $(this)[0].querySelector('.data-show');
            if (propertySelected) {
                let dataShow = JSON.parse(propertySelected.value);
                // show description
                let eleDescription = null;
                if ($(this)[0].closest('.tab-pane').querySelector('.property-description')) {
                    eleDescription = $(this)[0].closest('.tab-pane').querySelector('.property-description');
                } else if ($(this)[0].closest('.tab-pane').querySelector('.indicator-description')) {
                    eleDescription = $(this)[0].closest('.tab-pane').querySelector('.indicator-description');
                } else if ($(this)[0].closest('.tab-pane').querySelector('.function-description')) {
                    eleDescription = $(this)[0].closest('.tab-pane').querySelector('.function-description');
                }
                if (eleDescription) {
                    eleDescription.innerHTML = "";
                    $(eleDescription).append(`<div data-simplebar class="nicescroll-bar h-250p">
                                                <div class="row mb-3">
                                                    <h5>${dataShow.title}</h5>
                                                    <p>${dataShow.remark}</p>
                                                </div>
                                                <div class="row mb-2">
                                                    <b>Syntax</b>
                                                    <p class="ml-2">${dataShow.syntax_show}</p>
                                                </div>
                                                <div class="row">
                                                    <b>Example</b>
                                                    <p class="ml-2">${dataShow.example}</p>
                                                </div>
                                            </div>`)
                }
            }
        });

// Validate Indicator Formula Editor
        tableIndicator.on('change', '.indicator-editor', function (e) {
            let editorValue = $(this).val();
            let isValid = true;
            let row = $(this)[0].closest('tr');
            let btnSave = row.querySelector('.btn-edit-indicator')
            // validate parenthesis "(", ")"
            isValid = validateEditor(editorValue);
            if (isValid.result === true) {
                if (btnSave.hasAttribute('disabled')) {
                    btnSave.removeAttribute('disabled')
                }
                row.querySelector('.valid-indicator-formula').innerHTML = "";
            } else {
                if (!btnSave.hasAttribute('disabled')) {
                    btnSave.setAttribute('disabled', 'true');
                }
                if (isValid.remark === "parentheses") {
                    row.querySelector('.valid-indicator-formula').innerHTML = ") expected";
                } else if (isValid.remark === "syntax") {
                    row.querySelector('.valid-indicator-formula').innerHTML = "syntax error";
                }
            }
        })

        function validateEditor(strValue) {
            let isValid = validateParentheses(strValue);
            if (isValid === false) {
                return {
                    'result': false,
                    'remark': 'parentheses'
                }
            }
            isValid = hasNonMatchingValue(strValue);
            if (isValid === false) {
                return {
                    'result': false,
                    'remark': 'syntax'
                }
            }
            return {
                'result': true,
                'remark': ''
            }
        }

        function validateParentheses(strValue) {
            let stack = [];
            for (let i = 0; i < strValue.length; i++) {
                let char = strValue[i];
                if (char === "(") {
                    // Push opening parenthesis to the stack
                    stack.push(char);
                } else if (char === ")") {
                    // Check if there is a corresponding opening parenthesis
                    if (stack.length === 0 || stack.pop() !== "(") {
                        return false;
                    }
                }
            }
            // Check if there are any unclosed parentheses
            return stack.length === 0;
        }

        function hasNonMatchingValue(strValue) {
            let str_test = "";
            let strValueNoSpace = strValue.replace(/\s/g, "");
            let list_data = strValueNoSpace.match(main_regex);
            if (list_data.length > 0) {
                for (let item of list_data) {
                    str_test += item
                }
            }
            let str_test_no_space = str_test.replace(/\s/g, "");
            return strValueNoSpace.length === str_test_no_space.length
        }

// BEGIN setup formula
        let main_regex = /[a-zA-Z]+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[a-zA-Z]+|[-+*()]|\d+|%/g;
        let body_simple_regex = /\((.*?)\)/;
        let body_nested_regex = /\((.*)\)/;
        let main_body_regex = /[a-zA-Z]+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[a-zA-Z]+|[-+*()]|\d+|".*?"|==|!=|>=|<=|>|</g;

        function setupFormula(data_submit, ele) {
            let row = ele[0].closest('tr');
            let editor = row.querySelector('.indicator-editor');
            let formula_list_raw = parseStringToArray(editor.value);
            formula_list_raw = validateItemInList(formula_list_raw);
            data_submit['formula_data'] = parseFormulaRaw(formula_list_raw, row);
            data_submit['formula_data_show'] = editor.value;
            return true
        }

        function parseStringToArray(expression) {
            let data = expression.replace(/\s/g, "");
            const regex = /[a-zA-Z]+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[a-zA-Z]+|[-+*()]|\d+/g;
            return data.match(main_regex)
        }

        function parseFormulaRaw(formula_list_raw, row) {
            let formula_data = [];
            let functionList = ['contains', 'empty', 'concat', 'min', 'max', 'sumItemIf'];
            for (let item of formula_list_raw) {
                if (functionList.some(value => item.includes(value))) { // FUNCTION
                    let functionValue = functionList.find(value => item.includes(value));
                    let functionJSON = checkMatchPropertyIndicator(functionValue, row, '.function-list');
                    let functionBodyData = [];
                    let functionBody = item.match(body_nested_regex)[1];
                    let body_list_raw = functionBody.match(main_body_regex).map((match) => match.replace(/^"(.*)"$/, '$1'));
                    for (let body_item of body_list_raw) {
                        if (body_item.includes("indicator")) {
                            let indicatorValue = body_item.match(body_nested_regex)[1];
                            functionBodyData.push(checkMatchPropertyIndicator(indicatorValue, row, '.indicator-list'));
                        } else if (body_item.includes("prop")) {
                            let propertyValue = body_item.match(body_nested_regex)[1];
                            functionBodyData.push(checkMatchPropertyIndicator(propertyValue, row, '.property-list'));
                        } else {
                            functionBodyData.push(body_item);
                        }
                    }
                    functionBodyData = validateItemInList(functionBodyData);
                    functionJSON['function_data'] = functionBodyData;
                    formula_data.push(functionJSON);
                } else if (item.includes("indicator")) { // INDICATOR
                    let indicatorValue = item.match(body_nested_regex)[1];
                    formula_data.push(checkMatchPropertyIndicator(indicatorValue, row, '.indicator-list'));
                } else if (item.includes("prop")) { // PROPERTY
                    let propertyValue = item.match(body_nested_regex)[1];
                    formula_data.push(checkMatchPropertyIndicator(propertyValue, row, '.property-list'));
                } else {
                    formula_data.push(item)
                }
            }
            return formula_data
        }

        function checkMatchPropertyIndicator(check_value, row, classCheck) {
            let result = "";
            let choiceList = row.querySelector(classCheck);
            let allChoice = choiceList.querySelectorAll('.param-item');
            for (let indi of allChoice) {
                let dataShow = indi.querySelector('.data-show');
                if (dataShow) {
                    let dataShowValue = JSON.parse(dataShow.value);
                    if (dataShowValue.title.replace(/\s/g, "") === check_value) {
                        result = dataShowValue;
                        break
                    }
                }
            }
            return result
        }

        function validateItemInList(data_list) {
            // valid percent "==", "!="
            for (let i = 0; i < data_list.length; i++) {
                let data = data_list[i];
                if (data === "==") {
                    data_list[i] = "===";
                }
                if (data === "!=") {
                    data_list[i] = "!==";
                }
            }
            // valid percent %
            data_list = data_list.map((item) => {
                if (item === "%") {
                    return ["/", "100"];
                }
                return item;
            }).flat();

            return data_list
        }
// END setup formula

        // submit create indicator
        btnCreateIndicator.on('click', function(e) {
            let url = $(this).attr('data-url');
            let url_redirect = $(this).attr('data-url-redirect');
            let method = $(this).attr('data-method');
            let data_submit = {};
            let eleTitle = $('#indicator-create-title');
            let eleRemark = $('#indicator-create-description');
            data_submit['title'] = eleTitle.val();
            data_submit['remark'] = eleRemark.val();
            data_submit['example'] = "indicator(" + data_submit['title'] + ")";
            let order = 1;
            let tableEmpty = tableIndicator[0].querySelector('.dataTables_empty');
            let tableLen = tableIndicator[0].tBodies[0].rows.length;
            if (tableLen !== 0 && !tableEmpty) {
                order = (tableLen + 1);
            }
            data_submit['order'] = order;
            let application_code = 'quotation';
            if ($form.hasClass('sale-order')) {
                application_code = 'saleorder';
            }
            data_submit['application_code'] = application_code;
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(url, method, data_submit, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl(url_redirect, 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });

        // submit update indicator
        tableIndicator.on('click', '.btn-edit-indicator', function (e) {
            let url_update = btnCreateIndicator.attr('data-url-update');
            let url = url_update.format_url_with_uuid($(this).attr('data-id'));
            let url_redirect = btnCreateIndicator.attr('data-url-redirect');
            let method = "put";
            let data_submit = {};
            setupFormula(data_submit, $(this));
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(url, method, data_submit, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl(url_redirect, 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });

        // submit restore indicator
        $('#btn-accept-restore-indicator').on('click', function (e) {
            if (!tableIndicator[0].querySelector('.dataTables_empty')) {
                let dataID = null;
                for (let i = 0; i < tableIndicator[0].tBodies[0].rows.length; i++) {
                    let row = tableIndicator[0].tBodies[0].rows[i];
                    dataID = row.querySelector('.table-row-save').getAttribute('data-id');
                    break;
                }
                if (dataID) {
                    let url_update = $(this).attr('data-url');
                    let url = url_update.format_url_with_uuid(dataID);
                    let url_redirect = $(this).attr('data-url-redirect');
                    let method = $(this).attr('data-method');
                    let data_submit = {};
                    let csr = $("[name=csrfmiddlewaretoken]").val();
                    $.fn.callAjax(url, method, data_submit, csr)
                        .then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyPopup({description: data.message}, 'success')
                                    $.fn.redirectUrl(url_redirect, 1000);
                                }
                            },
                            (errs) => {
                                console.log(errs)
                            }
                        )
                }
            }
        });




    });
});
