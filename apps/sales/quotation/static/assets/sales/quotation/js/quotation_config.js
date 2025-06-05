$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_config_create');
        let btnEdit = $('#btn-edit_quotation_config');
        let btnSave = $('#btn-save_quotation_config');
        let tabs = $('#config-tabs');

        let tableIndicator = $('#table_indicator_list');
        let btnCreateIndicator = $('#btn-create-indicator');

        let $formulaCanvas = $('#formulaCanvas');
        let $formulaTitle = $('#formula_title');
        let $formulaEditor = $('#formula_editor');
        let $indicatorMD = $('#indicator_md');
        let $indicatorRemark = $('#indicator_remark');
        let $propertyMD = $('#property_md');
        let $propertyRemark = $('#property_remark');
        let $functionMD = $('#function_md');
        let $functionRemark = $('#function_remark');
        let $boxAcceptanceAffect = $('#box_acceptance_affect');
        let $isNegativeSetZero = $('#is_negative_set_zero');
        let $isAcceptanceEditable = $('#acceptance_editable');
        let $formulaValidateTxt = $('#formula_validate_txt');
        let $btnSaveFormula = $('#btn-save-formula');

        let eleTrans = $('#app-trans-factory');
        let $eleUrlFact = $('#app-url-factory');
        let dataAcceptanceAffect = [
            {'id': 6, 'title': eleTrans.attr('data-project')},
            {'id': 5, 'title': eleTrans.attr('data-invoice')},
            {'id': 4, 'title': eleTrans.attr('data-payment')},
            {'id': 3, 'title': eleTrans.attr('data-delivery')},
            {'id': 2, 'title': eleTrans.attr('data-plan')},
            {'id': 1, 'title': eleTrans.attr('data-none')},
        ];
        let boxSRole = $('#box-ss-role');
        let boxLRole = $('#box-ls-role');

        let $tableZones = $('#table_zones');
        let $btnCAdd = $('#btn-confirm-add');
        let $btnCEdit = $('#btn-confirm-edit');

        let boxEmployeeAdd = $('#add-zone-box-employee');
        let boxZonesEditingAdd = $('#add-zone-box-zones-editing');
        let boxZonesHiddenAdd = $('#add-zone-box-zones-hidden');
        let $eleRemarkAdd = $('#add-zone-remark');

        let boxEmployeeEdit = $('#edit-zone-box-employee');
        let boxZonesEditingEdit = $('#edit-zone-box-zones-editing');
        let boxZonesHiddenEdit = $('#edit-zone-box-zones-hidden');
        let $eleRemarkEdit = $('#edit-zone-remark');
        let appMapMDUrls = {
            "saledata.product": {
                "url": $eleUrlFact.attr('data-md-product'),
                "keyResp": "product_sale_list"
            },
            "saledata.producttype": {
                "url": $eleUrlFact.attr('data-md-type'),
                "keyResp": "product_type_list"
            },
            "saledata.productcategory": {
                "url": $eleUrlFact.attr('data-md-category'),
                "keyResp": "product_category_list"
            },
            "saledata.expense": {
                "url": $eleUrlFact.attr('data-md-labor'),
                "keyResp": "expense_list"
            },
            "saledata.expenseitem": {
                "url": $eleUrlFact.attr('data-md-expense-item'),
                "keyResp": "expense_item_list"
            },
        }

        // call ajax get info quotation config detail
        $.fn.callAjax($form.data('url'), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    loadConfig(data);
                }
            }
        )
        // load indicators
        initPage();

        // enable edit
        btnEdit.on('click', function () {
            $(this)[0].setAttribute('hidden', true)
            $('#btn-save_quotation_config')[0].removeAttribute('hidden');
            $form.find('.disabled-but-edit').removeAttr('disabled');
        });

        // valid SRole, LRole
        boxSRole.on('change', function () {
            return validateRole(boxSRole);
        })

        boxLRole.on('change', function () {
            return validateRole(boxLRole);
        })

        // Submit form config quotation + sale order
        $form.submit(function (e) {
            e.preventDefault()
            let _form = new SetupFormSubmit($(this));
            let dataSubmit = setupSubmit();
            if (dataSubmit) {
                _form.dataForm['short_sale_config'] = dataSubmit.short_sale_config;
                _form.dataForm['long_sale_config'] = dataSubmit.long_sale_config;
                _form.dataForm['is_require_payment'] = dataSubmit.is_require_payment;
                _form.dataForm['ss_role'] = boxSRole.val();
                _form.dataForm['ls_role'] = boxLRole.val();
            }
            let submitFields = [
                'short_sale_config',
                'long_sale_config',
                'is_require_payment',
                'ss_role',
                'ls_role',
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
                            $.fn.notifyB({description: data.message}, 'success')
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
            let is_sale_order = false;
            if ($form[0].classList.contains('sale-order')) {
                is_sale_order = true;
            }
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
                paging: false,
                info: false,
                searching: false,
                columnDefs: [],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            if (is_sale_order === false) {
                                return `<input type="text" class="form-control table-row-order" value="${row?.['order']}">`;
                            } else {
                                return `<span>${row?.['order']}</span>`;
                            }
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            return `<input type="text" class="form-control table-row-title" value="${row?.['title']}" hidden><span>${row?.['title']}</span>`;
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            let ele = `<button
                                        type="button"
                                        class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-edit-formula"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#formulaCanvas"
                                    ><span class="icon"><i class="fa-regular fa-pen-to-square"></i></span></button>`;
                            if (is_sale_order === false) {
                                return ele;
                            } else {
                                return ``;
                            }
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            if (is_sale_order === false) {
                                return `<input type="text" class="form-control table-row-description" value="${row?.['remark']}">`;
                            } else {
                                return `<span>${row?.['remark']}</span>`;
                            }
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            let btn_edit = `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover table-row-save" data-id="${row.id}" disabled><span class="icon"><i class="fa-regular fa-floppy-disk"></i></span></button>`;
                            let btn_delete = `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row" data-id="${row.id}" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`;
                            if (is_sale_order === false) {
                                return btn_edit + btn_delete;
                            } else {
                                return ``;
                            }
                        }
                    }
                ],
                drawCallback: function () {
                    dtbHDCustom();
                },
            });
        }

        // Custom dtb
        function dtbHDCustom() {
            let $table = tableIndicator;
            let wrapper$ = $table.closest('.dataTables_wrapper');
            let $theadEle = wrapper$.find('thead');
            if ($theadEle.length > 0) {
                for (let thEle of $theadEle[0].querySelectorAll('th')) {
                    if (!$(thEle).hasClass('border-right')) {
                        $(thEle).addClass('border-right');
                    }
                }
            }
            let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
            headerToolbar$.prepend(textFilter$);

            if (textFilter$.length > 0) {
                textFilter$.css('display', 'flex');
                // Check if the button already exists before appending
                if (!$('#btn-add-indicator').length) {
                    let $group = $(`<button
                                            type="button"
                                            class="btn btn-primary"
                                            id="btn-add-indicator"
                                            data-bs-toggle="modal"
                                            data-bs-target="#indicatorCreateModalCenter"
                                    >
                                    <span><span class="icon"><span class="feather-icon"><i class="fa-solid fa-plus"></i></span></span><span>${eleTrans.attr('data-add')}</span></span>
                                    </button>
                                    <button
                                            type="button"
                                            class="btn btn-outline-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#restoreIndicatorModalCenter"
                                    >
                                    <span><span class="icon"><span class="feather-icon"><i class="fas fa-redo-alt"></i></span></span><span>${eleTrans.attr('data-restore')}</span></span>
                                    </button>`);
                    textFilter$.append(
                        $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                    );
                    // Select the appended button from the DOM and attach the event listener
                    $('#btn-add-indicator').on('click', function () {
                    });
                }
            }
        }

        tabs.on('click', '.nav-item', function () {
            checkOpenBtnEditSave();
        });

        tableIndicator.on('change', '.table-row-title, .table-row-description, .table-row-order', function () {
            let row = this.closest('tr');
            if (row) {
                let btnSaveEle = row.querySelector('.table-row-save');
                if (btnSaveEle) {
                    btnSaveEle.removeAttribute('disabled');
                    btnSaveEle.classList.remove('flush-soft-hover');
                    btnSaveEle.classList.add('btn-soft-success');
                }
            }
        });

        tableIndicator.on('click', '.btn-edit-formula', function () {
            let row = this.closest('tr');
            if (row) {
                let rowIndex = tableIndicator.DataTable().row(row).index();
                let $row = tableIndicator.DataTable().row(rowIndex);
                let dataRow = $row.data();
                $btnSaveFormula.attr('data-id', dataRow?.['id']);
            }
            loadFormulaTitleEditor($(this));
            loadIndicatorMD($(this));
            loadAcceptance($(this));
        });

        // BEGIN FORMULA

        $formulaCanvas.on('mouseenter', '.param-item', function () {
            mouseenterParam(this);
        });

        $formulaCanvas.on('click', '.param-item', function () {
            clickParam(this);
        });

        $formulaCanvas.on('change', '.box-property-md', function () {
            let dataShowRaw = $(this).attr('data-show');
            if (dataShowRaw) {
                let dataShow = JSON.parse(dataShowRaw);
                let dataSelected = SelectDDControl.get_data_from_idx($(this), $(this).val());
                if (dataSelected) {
                    // show editor
                    $formulaEditor.val(`${$formulaEditor.val() + dataShow?.['syntax']}=="${dataSelected?.['title']}"`);
                    // on blur editor to validate formula
                    $formulaEditor.blur();
                }
            }
        });

        $formulaCanvas.on('change', '.box-acceptance-affect', function () {
            let eleEditable = this.closest('.final-acceptance-zone').querySelector('.acceptance-editable');
            if ($(this).val() === '1') {
                if (eleEditable) {
                    eleEditable.checked = false;
                    eleEditable.setAttribute('disabled', 'true');
                }
            } else {
                if (eleEditable) {
                    eleEditable.removeAttribute('disabled');
                }
            }
        });

        function loadFormulaTitleEditor($ele) {
            let targetRow = $ele[0].closest('tr');
            if (targetRow) {
                let targetRowIndex = tableIndicator.DataTable().row(targetRow).index();
                let $targetRow = tableIndicator.DataTable().row(targetRowIndex);
                let targetDataRow = $targetRow.data();
                $formulaTitle[0].innerHTML = "(" + targetDataRow?.['title'] + ")";
                $formulaEditor.val(targetDataRow?.['formula_data_show']);
                $isNegativeSetZero[0].checked = targetDataRow?.['is_negative_set_zero'];
            }
        }

        function loadIndicatorMD($ele) {
            let targetRow = $ele[0].closest('tr');
            if (targetRow) {
                let targetRowIndex = tableIndicator.DataTable().row(targetRow).index();
                let $targetRow = tableIndicator.DataTable().row(targetRowIndex);
                let targetDataRow = $targetRow.data();
                $indicatorMD.empty();
                let indicator_list = ``;
                tableIndicator.DataTable().rows().every(function () {
                    let row = this.node();
                    let rowIndex = tableIndicator.DataTable().row(row).index();
                    let $row = tableIndicator.DataTable().row(rowIndex);
                    let dataRow = $row.data();

                    dataRow['is_indicator'] = true;
                    dataRow['syntax'] = "indicator(" + dataRow?.['title'] + ")";
                    dataRow['syntax_show'] = "indicator(" + dataRow?.['title'] + ")";
                    let dataStr = JSON.stringify(dataRow).replace(/"/g, "&quot;");
                    if (dataRow?.['id'] !== targetDataRow?.['id'] && dataRow?.['order'] < targetDataRow?.['order']) { // check & not append this current indicator or higher indicators
                        indicator_list += `<div class="row param-item mb-2">
                                                    <button type="button" class="btn btn-flush-light">
                                                        <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="indicator-title">${dataRow?.['title']}</span></span></div>
                                                        <input type="hidden" class="data-show" value="${dataStr}">
                                                    </button>
                                                </div>`;
                    }
                })
                $indicatorMD.append(`<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-350p position-relative overflow-y-scroll">
                                ${indicator_list}
                            </div>`);
            }
            return true;
        }

        function loadPropertyMD() {
            let code_app = "quotation";
            if ($form.hasClass('sale-order')) {
                code_app = "saleorder";
            }
            $propertyMD.empty();
            $.fn.callAjax2({
                    'url': $eleUrlFact.attr('data-md-property'),
                    'method': "GET",
                    'data': {
                        'application__code': code_app,
                        'is_sale_indicator': true,
                    },
                    'isDropdown': true,
                }
            ).then(
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
                                let iconMD = ``;
                                if (item?.['type'] === 5) {
                                    iconMD = `<span class="icon"><span class="feather-icon"><i class="fas fa-database"></i></span></span>`;
                                }
                                param_list += `<div class="row param-item mb-2">
                                                        <button type="button" class="btn btn-flush-light">
                                                            <div class="float-left">
                                                                <div class="d-flex justify-content-between">
                                                                    <span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="property-title mr-2">${item?.['title_i18n']}</span>${iconMD}</span>
                                                                </div>
                                                            </div>
                                                            <input type="hidden" class="data-show" value="${dataStr}">
                                                        </button>
                                                    </div>`;
                            })
                            $propertyMD.append(`<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-350p position-relative overflow-y-scroll">
                                            ${param_list}
                                        </div>`);
                        }
                    }
                }
            )
            return true;
        }

        function loadFunctionMD() {
            $functionMD.empty();
            $.fn.callAjax2({
                    'url': $eleUrlFact.attr('data-md-function'),
                    'method': "GET",
                    'data': {'param_type': 2},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('indicator_param') && Array.isArray(data.indicator_param)) {
                            let param_list = ``;
                            data.indicator_param.map(function (item) {
                                let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                                param_list += `<div class="row param-item mb-2">
                                                <button type="button" class="btn btn-flush-light">
                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span class="property-title">${item.title}</span></span></div>
                                                    <input type="hidden" class="data-show" value="${dataStr}">
                                                </button>
                                            </div>`
                            })
                            $functionMD.append(`<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-350p position-relative overflow-y-scroll">
                                            ${param_list}
                                        </div>`);
                        }
                    }
                }
            )
            return true;
        }

        function mouseenterParam(ele) {
            let dataEle = ele.querySelector('.data-show');
            if (dataEle) {
                if ($(dataEle).val()) {
                    let data = JSON.parse($(dataEle).val());
                    let dataStr = JSON.stringify(data);
                    let htmlBase = `<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-350p position-relative overflow-y-scroll">
                                        <div class="row">
                                            <h5>${data?.['title_i18n'] ? data?.['title_i18n'] : ''}</h5>
                                            <p>${data?.['remark'] ? data?.['remark'] : ''}</p>
                                        </div>
                                        <div class="row area-property-md hidden">
                                            <div class="form-group">
                                                <select class="form-select box-property-md"></select>
                                            </div>
                                        </div>
                                        <br>
                                        <div class="row">
                                            <b>${eleTrans.attr('data-syntax')}</b>
                                            <p>${data?.['syntax_show'] ? data?.['syntax_show'] : ''}</p>
                                        </div>
                                        <div class="row">
                                            <b>${eleTrans.attr('data-example')}</b>
                                            <p>${data?.['example'] ? data?.['example'] : ''}</p>
                                        </div>
                                    </div>`;

                    let tabEle = ele.closest('.tab-pane');
                    if (tabEle) {
                        if (tabEle.id === "tab_formula_indicator") {
                            $indicatorRemark.empty();
                            $indicatorRemark.append(htmlBase);
                        }
                        if (tabEle.id === "tab_formula_property") {
                            $propertyRemark.empty();
                            $propertyRemark.append(htmlBase);
                            if (data?.['type'] === 5) {
                                let url = "";
                                let keyResp = "";
                                if (appMapMDUrls?.[data?.['content_type']]) {
                                    if (appMapMDUrls[data?.['content_type']]?.['url']) {
                                        url = appMapMDUrls[data?.['content_type']]?.['url'];
                                    }
                                    if (appMapMDUrls[data?.['content_type']]?.['keyResp']) {
                                        keyResp = appMapMDUrls[data?.['content_type']]?.['keyResp'];
                                    }
                                }
                                let areaBoxMDEle = $propertyRemark[0].querySelector('.area-property-md');
                                let boxMDEle = $propertyRemark[0].querySelector('.box-property-md');
                                if (areaBoxMDEle && boxMDEle) {
                                    $(boxMDEle).attr('data-url', url);
                                    $(boxMDEle).attr('data-method', 'GET');
                                    $(boxMDEle).attr('data-keyResp', keyResp);
                                    $(boxMDEle).attr('data-show', dataStr);
                                    $(boxMDEle).attr('disabled', 'true');
                                    loadInitS2($(boxMDEle), [], {}, $propertyRemark, true);

                                    $(areaBoxMDEle).removeClass('hidden');
                                }
                            }
                        }
                        if (tabEle.id === "tab_formula_function") {
                            $functionRemark.empty();
                            $functionRemark.append(htmlBase);
                        }
                    }
                }
            }
            return true;
        }

        function clickParam(ele) {
            let dataEle = ele.querySelector('.data-show');
            if (dataEle) {
                if ($(dataEle).val()) {
                    let data = JSON.parse($(dataEle).val());
                    let tabEle = ele.closest('.tab-pane');
                    if (tabEle) {
                        if (tabEle.id === "tab_formula_indicator") {
                            // show editor
                            $formulaEditor.val($formulaEditor.val() + data.syntax);
                            // on blur editor to validate formula
                            $formulaEditor.blur();
                        }
                        if (tabEle.id === "tab_formula_property") {
                            if (data?.['type'] === 5) {
                                let boxMDEle = $propertyRemark[0].querySelector('.box-property-md');
                                if (boxMDEle) {
                                    boxMDEle.removeAttribute('disabled');
                                }
                            } else {
                                // show editor
                                $formulaEditor.val($formulaEditor.val() + data.syntax);
                                $formulaEditor.focus();
                                showValidate();
                            }
                        }
                        if (tabEle.id === "tab_formula_function") {
                            // show editor
                            $formulaEditor.val($formulaEditor.val() + data.syntax);
                            $formulaEditor.focus();
                            showValidate();
                        }
                    }
                }
            }
            return true;
        }

        function loadAcceptance($ele) {
            let targetRow = $ele[0].closest('tr');
            if (targetRow) {
                let targetRowIndex = tableIndicator.DataTable().row(targetRow).index();
                let $targetRow = tableIndicator.DataTable().row(targetRowIndex);
                let targetDataRow = $targetRow.data();
                $isAcceptanceEditable[0].checked = targetDataRow?.['is_acceptance_editable'];
                $isAcceptanceEditable[0].removeAttribute('disabled');
                $boxAcceptanceAffect.val(targetDataRow?.['acceptance_affect_by']).trigger('change');
                if (targetDataRow?.['acceptance_affect_by'] === 1) {
                    $isAcceptanceEditable[0].checked = false;
                    $isAcceptanceEditable[0].setAttribute('disabled', 'true');
                }
            }
            return true;
        }

        // VALIDATE FORMULA

        $formulaEditor.on('blur', function () {
            showValidate();
        })

        function showValidate() {
            // validate editor
            let isValid = validateEditor($formulaEditor.val());
            if (isValid?.['result'] === true) {
                if ($btnSaveFormula[0].hasAttribute('disabled')) {
                    $btnSaveFormula[0].removeAttribute('disabled')
                }
                $formulaValidateTxt.empty();
            } else {
                if (!$btnSaveFormula[0].hasAttribute('disabled')) {
                    $btnSaveFormula[0].setAttribute('disabled', 'true');
                }
                let error = "";
                if (isValid?.['remark'] === "parentheses") {
                    error = ") expected";
                } else if (isValid?.['remark'] === "syntax") {
                    error = "syntax error";
                } else if (isValid?.['remark'] === "quote") {
                    error = "single quote (') not allowed";
                } else if (isValid?.['remark'] === "unbalance") {
                    error = "value or operator expected";
                }
                $formulaValidateTxt.text(error);
            }
        }

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
            isValid = hasSingleQuote(strValue);
            if (isValid === false) {
                return {
                    'result': false,
                    'remark': 'quote'
                }
            }
            isValid = notBalanceOperatorAndValue(strValue);
            if (isValid === false) {
                return {
                    'result': false,
                    'remark': 'unbalance'
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
            if (strValueNoSpace.length === 0) {
                return false;
            }
            let list_data = strValueNoSpace.match(main_regex);
            if (list_data.length > 0) {
                for (let item of list_data) {
                    str_test += item
                }
            }
            let str_test_no_space = str_test.replace(/\s/g, "");
            return strValueNoSpace.length === str_test_no_space.length
        }

        function hasSingleQuote(strValue) {
            return !strValue.includes("'")
        }

        function notBalanceOperatorAndValue(strValue) {
            let list_data = parseStringToArray(strValue);
            let valueCount = 0;
            let operatorCount = 0;
            for (let data of list_data) {
                if (!["(", ")", "%"].includes(data)) {
                    if (["+", "-", "*", "/"].includes(data)) {
                        operatorCount++;
                    } else {
                        valueCount++
                    }
                }
            }
            return operatorCount === (valueCount - 1);
        }

        // SETUP FORMULA

        // let main_regex = /[a-zA-Z]+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[a-zA-Z]+|[-+*/()]|\d+|%/g;
        let main_regex = /[a-zA-Z]+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[a-zA-Z]+|[-+*/()]|\d+(?:\.\d+)?|%/g;
        /*
        This main_regex parts are:
        function calls with nested parentheses
        any plain word or variable
        numbers, including decimals
        any single operator or parenthesis: +, -, *, /, (, ).
        */
        let body_nested_regex = /\((.*)\)/;
        let main_body_regex = /[a-zA-Z]+\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[a-zA-Z]+|[-+*/()]|\d+|".*?"|==|!=|>=|<=|>|</g;

        function setupFormula(data_submit) {
            let formula_list_raw = parseStringToArray($formulaEditor.val());
            formula_list_raw = parseItemInList(formula_list_raw);
            data_submit['formula_data'] = parseFormulaRaw(formula_list_raw);
            data_submit['formula_data_show'] = $formulaEditor.val();
            data_submit['is_negative_set_zero'] = $isNegativeSetZero[0].checked;
            data_submit['acceptance_affect_by'] = parseFloat($boxAcceptanceAffect.val());
            data_submit['is_acceptance_editable'] = $isAcceptanceEditable[0].checked;
            return true;
        }

        function parseStringToArray(expression) {
            let data = expression.replace(/\s/g, "");
            return data.match(main_regex)
        }

        function parseFormulaRaw(formula_list_raw) {
            let formula_data = [];
            let functionList = ['contains', 'empty', 'concat', 'min', 'max', 'sumItemIf'];
            for (let item of formula_list_raw) {
                if (functionList.some(value => item.includes(value))) { // FUNCTION
                    let functionValue = functionList.find(value => item.includes(value));
                    let functionJSON = checkMatchPropertyIndicator(functionValue, 3);
                    let functionBodyData = [];
                    let functionBody = item.match(body_nested_regex)[1];
                    let body_list_raw = functionBody.match(main_body_regex).map((match) => match.replace(/^"(.*)"$/, '$1'));
                    for (let body_item of body_list_raw) {
                        if (body_item.includes("indicator")) {
                            let indicatorValue = body_item.match(body_nested_regex)[1];
                            functionBodyData.push(checkMatchPropertyIndicator(indicatorValue, 1));
                        } else if (body_item.includes("prop")) {
                            let propertyValue = body_item.match(body_nested_regex)[1];
                            functionBodyData.push(checkMatchPropertyIndicator(propertyValue, 2));
                        } else {
                            functionBodyData.push(body_item.toLowerCase());
                        }
                    }
                    functionBodyData = parseItemInList(functionBodyData);
                    functionJSON['function_data'] = functionBodyData;
                    formula_data.push(functionJSON);
                } else if (item.includes("indicator")) { // INDICATOR
                    let indicatorValue = item.match(body_nested_regex)[1];
                    formula_data.push(checkMatchPropertyIndicator(indicatorValue, 1));
                } else if (item.includes("prop")) { // PROPERTY
                    let propertyValue = item.match(body_nested_regex)[1];
                    formula_data.push(checkMatchPropertyIndicator(propertyValue, 2));
                } else {
                    formula_data.push(item)
                }
            }
            return formula_data
        }

        function checkMatchPropertyIndicator(check_value, type) {
            let result = "";
            let params = [];
            if (type === 1) {
                params = $indicatorMD[0].querySelectorAll('.param-item');
            }
            if (type === 2) {
                params = $propertyMD[0].querySelectorAll('.param-item');
            }
            if (type === 3) {
                params = $functionMD[0].querySelectorAll('.param-item');
            }
            for (let param of params) {
                let dataShowEle = param.querySelector('.data-show');
                if (dataShowEle) {
                    if ($(dataShowEle).val()) {
                        let data = JSON.parse($(dataShowEle).val());
                        if (data?.['title'].replace(/\s/g, "") === check_value) {
                            result = data;
                            break
                        }
                    }
                }
            }
            return result;
        }

        function parseItemInList(data_list) {
            // valid "==", "!="
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

        // END FORMULA

// BEGIN SUBMIT
        // submit create indicator
        btnCreateIndicator.on('click', function() {
            let data_submit = {};
            data_submit['title'] = $('#indicator-create-title').val();
            data_submit['remark'] = $('#indicator-create-description').val();
            data_submit['example'] = "indicator(" + data_submit['title'] + ")";
            let ordersEle = tableIndicator[0].querySelectorAll('.table-row-order');
            data_submit['order'] = ordersEle.length + 1;
            let application_code = 'quotation';
            if ($form.hasClass('sale-order')) {
                application_code = 'saleorder';
            }
            data_submit['application_code'] = application_code;
            $.fn.callAjax2(
                {
                    'url': $eleUrlFact.attr('data-indicator'),
                    'method': 'POST',
                    'data': data_submit,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            $('#table_indicator_list').DataTable().destroy();
                            loadIndicatorDbl();
                            WindowControl.hideLoading();
                        }, 2000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        });

        // submit edit order & title & description on row
        tableIndicator.on('click', '.table-row-save', function () {
            let data_submit = {};
            let row = this.closest('tr');
            if (row) {
                let titleEle = row.querySelector('.table-row-title');
                let remarkEle = row.querySelector('.table-row-description');
                let orderEle = row.querySelector('.table-row-order');
                if (titleEle && remarkEle && orderEle) {
                    data_submit['title'] = $(titleEle).val();
                    data_submit['remark'] = $(remarkEle).val();
                    data_submit['example'] = "indicator(" + data_submit['title'] + ")";
                    if ($(orderEle).val()) {
                        data_submit['order'] = parseInt($(orderEle).val());
                    }
                    WindowControl.showLoading();
                    $.fn.callAjax2(
                        {
                            'url': $eleUrlFact.attr('data-detail-indicator').format_url_with_uuid($(this).attr('data-id')),
                            'method': 'PUT',
                            'data': data_submit,
                        }
                    ).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && (data['status'] === 201 || data['status'] === 200)) {
                                $.fn.notifyB({description: data.message}, 'success');
                                setTimeout(() => {
                                    $('#table_indicator_list').DataTable().destroy();
                                    loadIndicatorDbl();
                                    WindowControl.hideLoading();
                                }, 2000);
                            }
                        }, (err) => {
                            setTimeout(() => {
                                WindowControl.hideLoading();
                            }, 1000)
                            $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                        }
                    )
                    // disable save btn
                    $(this)[0].setAttribute('disabled', true);
                }
            }
        });

        // submit update indicator formula
        $btnSaveFormula.on('click', function () {
            let data_submit = {};
            setupFormula(data_submit, $(this));
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': $eleUrlFact.attr('data-detail-indicator').format_url_with_uuid($(this).attr('data-id')),
                    'method': 'PUT',
                    'data': data_submit,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            $('#table_indicator_list').DataTable().destroy();
                            loadIndicatorDbl();
                            WindowControl.hideLoading();
                        }, 2000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        });

        // submit restore indicator
        $('#btn-accept-restore-indicator').on('click', function () {
            if (!tableIndicator[0].querySelector('.dataTables_empty')) {
                let dataID = null;
                for (let i = 0; i < tableIndicator[0].tBodies[0].rows.length; i++) {
                    let row = tableIndicator[0].tBodies[0].rows[i];
                    dataID = row.querySelector('.table-row-save').getAttribute('data-id');
                    if (dataID) {
                        break;
                    }
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
                                    $.fn.notifyB({description: data.message}, 'success')
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

        // EMPLOYEE CONFIG ON APP
        $('#addZoneMdl').on('shown.bs.modal', function () {
            let $modal = $(this);
            loadInitS2(boxEmployeeAdd, [], {}, $modal);
            loadInitS2(boxZonesEditingAdd, [], {'application_id': "b9650500-aba7-44e3-b6e0-2542622702a3"}, $modal);
            loadInitS2(boxZonesHiddenAdd, [], {'application_id': "b9650500-aba7-44e3-b6e0-2542622702a3"}, $modal);
        });

        boxZonesEditingAdd.on('change', function () {
            validateZoneDuplicated(boxZonesEditingAdd);
        });

        boxZonesHiddenAdd.on('change', function () {
            validateZoneDuplicated(boxZonesHiddenAdd);
        });

        boxZonesEditingEdit.on('change', function () {
            validateZoneDuplicated(boxZonesEditingEdit);
        });

        boxZonesHiddenEdit.on('change', function () {
            validateZoneDuplicated(boxZonesHiddenEdit);
        });

        $btnCAdd.on('click', function () {
            if (boxEmployeeAdd.val() && (boxZonesEditingAdd.val() && boxZonesEditingAdd.val().length > 0) || (boxZonesHiddenAdd.val() && boxZonesHiddenAdd.val().length > 0)) {
                $.fn.callAjax2({
                    url: boxZonesEditingAdd.attr('data-url'),
                    method: 'GET',
                    'data': {'id__in': boxZonesEditingAdd.val().join(',')},
                    isLoading: false,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('zones_list')) {
                            let dataAdd = {};
                            dataAdd['order'] = $tableZones[0].querySelectorAll('.table-row-order').length + 1;
                            dataAdd['remark'] = $eleRemarkAdd.val();
                            dataAdd['employee_data'] = SelectDDControl.get_data_from_idx(boxEmployeeAdd, boxEmployeeAdd.val());
                            dataAdd['zones_editing_data'] = [];
                            if (boxZonesEditingAdd.val().length > 0) {
                                dataAdd['zones_editing_data'] = data?.['zones_list'];
                            }
                            $.fn.callAjax2({
                                url: boxZonesHiddenAdd.attr('data-url'),
                                method: 'GET',
                                'data': {'id__in': boxZonesHiddenAdd.val().join(',')},
                                isLoading: false,
                            }).then(
                                (resp) => {
                                    let data = $.fn.switcherResp(resp);
                                    if (data && resp.data.hasOwnProperty('zones_list')) {
                                        dataAdd['zones_hidden_data'] = [];
                                        if (boxZonesHiddenAdd.val().length > 0) {
                                            dataAdd['zones_hidden_data'] = data?.['zones_list'];
                                        }
                                        $tableZones.DataTable().row.add(dataAdd).draw().node();
                                        submitAppEmpConfig();
                                    }
                                }
                            )
                        }
                    }
                )
            } else {
                $.fn.notifyB({description: eleTrans.attr('data-zone-required')}, 'failure');
                return false;
            }
        });

        $tableZones.on('click', '.edit-row', function () {
            let $modal = $('#editZoneMdl');
            let row = this.closest('tr');
            let rowOrder = row.querySelector('.table-row-order');
            let rowEmployee = row.querySelector('.table-row-employee');
            let rowZonesEditing = row.querySelector('.table-row-zones-editing');
            let rowZonesHidden = row.querySelector('.table-row-zones-hidden');
            let rowRemark = row.querySelector('.table-row-remark');
            if (rowOrder) {
                $btnCEdit.attr('data-order', rowOrder.innerHTML);
            }
            if (rowEmployee) {
                if (rowEmployee.getAttribute('data-employee')) {
                    let dataEmployee = JSON.parse(rowEmployee.getAttribute('data-employee'));
                    loadInitS2(boxEmployeeEdit, [dataEmployee], {}, $modal);
                }
            }
            if (rowRemark) {
                $eleRemarkEdit.val(rowRemark.innerHTML);
            }
            if (rowZonesEditing) {
                if (rowZonesEditing.getAttribute('data-zones')) {
                    let dataZonesEditing = JSON.parse(rowZonesEditing.getAttribute('data-zones'));
                    loadInitS2(boxZonesEditingEdit, dataZonesEditing, {
                        'application_id': "b9650500-aba7-44e3-b6e0-2542622702a3",
                    }, $modal);
                    let dataZonesID = [];
                    for (let zone of dataZonesEditing) {
                        dataZonesID.push(zone?.['id']);
                    }
                    boxZonesEditingEdit.val(dataZonesID);
                }
            }
            if (rowZonesHidden) {
                if (rowZonesHidden.getAttribute('data-zones')) {
                    let dataZonesHidden = JSON.parse(rowZonesHidden.getAttribute('data-zones'));
                    loadInitS2(boxZonesHiddenEdit, dataZonesHidden, {
                        'application_id': "b9650500-aba7-44e3-b6e0-2542622702a3",
                    }, $modal);
                    let dataZonesID = [];
                    for (let zone of dataZonesHidden) {
                        dataZonesID.push(zone?.['id']);
                    }
                    boxZonesHiddenEdit.val(dataZonesID);
                }
            }
        });

        $tableZones.on('click', '.del-row', function () {
            deleteRowAEC(this.closest('tr'), $tableZones);
            reOrderSTTRowAEC($tableZones);
            submitAppEmpConfig();
        });

        $btnCEdit.on('click', function () {
            if (boxEmployeeEdit.val() && (boxZonesEditingEdit.val() && boxZonesEditingEdit.val().length > 0) || (boxZonesHiddenEdit.val() && boxZonesHiddenEdit.val().length > 0)) {
                $.fn.callAjax2({
                    url: boxZonesEditingEdit.attr('data-url'),
                    method: 'GET',
                    'data': {'id__in': boxZonesEditingEdit.val().join(',')},
                    isLoading: false,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('zones_list')) {
                            let dataZonesEditing = [];
                            if (boxZonesEditingEdit.val().length > 0) {
                                dataZonesEditing = data?.['zones_list'];
                            }
                            $.fn.callAjax2({
                                url: boxZonesHiddenEdit.attr('data-url'),
                                method: 'GET',
                                'data': {'id__in': boxZonesHiddenEdit.val().join(',')},
                                isLoading: false,
                            }).then(
                                (resp) => {
                                    let data = $.fn.switcherResp(resp);
                                    if (data && resp.data.hasOwnProperty('zones_list')) {
                                        let dataZonesHidden = [];
                                        if (boxZonesHiddenEdit.val().length > 0) {
                                            dataZonesHidden = data?.['zones_list'];
                                        }
                                        for (let eleOrder of $tableZones[0].querySelectorAll('.table-row-order')) {
                                            if (eleOrder.innerHTML === $btnCEdit.attr('data-order')) {
                                                let row = eleOrder.closest('tr');
                                                let rowEmployee = row.querySelector('.table-row-employee');
                                                let rowZonesEditing = row.querySelector('.table-row-zones-editing');
                                                let rowZonesHidden = row.querySelector('.table-row-zones-hidden');
                                                let rowRemark = row.querySelector('.table-row-remark');
                                                if (rowEmployee) {
                                                    let dataEmployee = SelectDDControl.get_data_from_idx(boxEmployeeEdit, boxEmployeeEdit.val());
                                                    $(rowEmployee).empty();
                                                    $(rowEmployee).attr('data-employee', JSON.stringify(dataEmployee));
                                                    $(rowEmployee).append(`<span class="badge badge-primary mr-2">${dataEmployee?.['code'] ? dataEmployee?.['code'] : ''}</span>
                                                                    <span class="badge badge-primary badge-outline">${dataEmployee?.['full_name'] ? dataEmployee?.['full_name'] : ''}</span>`);
                                                }
                                                if (rowRemark) {
                                                    rowRemark.innerHTML = $eleRemarkEdit.val();
                                                }
                                                if (rowZonesEditing) {
                                                    $(rowZonesEditing).empty();
                                                    $(rowZonesEditing).attr('data-zones', JSON.stringify(dataZonesEditing));
                                                    for (let zone of dataZonesEditing) {
                                                        $(rowZonesEditing).append(`<span class="badge badge-soft-green mr-1 mb-1">${zone?.['title']}</span>`);
                                                    }
                                                }
                                                if (rowZonesHidden) {
                                                    $(rowZonesHidden).empty();
                                                    $(rowZonesHidden).attr('data-zones', JSON.stringify(dataZonesHidden));
                                                    for (let zone of dataZonesHidden) {
                                                        $(rowZonesHidden).append(`<span class="badge badge-soft-warning mr-1 mb-1">${zone?.['title']}</span>`);
                                                    }
                                                }
                                                submitAppEmpConfig();
                                                break;
                                            }
                                        }
                                    }
                                }
                            )
                        }
                    }
                )
            } else {
                $.fn.notifyB({description: eleTrans.attr('data-zone-required')}, 'failure');
                return false;
            }
        });


        // functions
        function loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false) {
            let opts = {'allowClear': isClear};
            $ele.empty();
            if (data.length > 0) {
                opts['data'] = data;
            }
            if (Object.keys(dataParams).length !== 0) {
                opts['dataParams'] = dataParams;
            }
            if ($modal) {
                opts['dropdownParent'] = $modal;
            }
            $ele.initSelect2(opts);
            return true;
        }

        function initPage() {

            loadInitS2(boxSRole);
            loadInitS2(boxLRole);
            loadAppEmpConfig();
            checkOpenBtnEditSave();

            loadIndicatorDbl();
            loadPropertyMD();
            loadFunctionMD();
            loadInitS2($boxAcceptanceAffect, dataAcceptanceAffect);
        }

        function checkOpenBtnEditSave() {
            btnEdit[0].removeAttribute('hidden');
            let navLink = tabs[0].querySelector('.nav-link.active');
            if (navLink) {
                let navItem = navLink.closest('.nav-item');
                if (navItem) {
                    if (['tab-indicator', 'tab-zones'].includes(navItem.id)) {
                        btnEdit[0].setAttribute('hidden', 'true');
                        btnSave[0].setAttribute('hidden', 'true');
                    }
                }
            }
        }

        function validateRole($ele) {
            let ss_role = boxSRole.val();
            let ls_role = boxLRole.val();
            for (let role_id of ss_role) {
                if (ls_role.includes(role_id)) {
                    $ele.empty();
                    $.fn.notifyB({description: 'Role can only in short sales or long sales'}, 'failure');
                    return false
                }
            }
            return true;
        }

        function loadConfig(data) {
            if (data?.['short_sale_config']) {
                $('#is-choose-price-list')[0].checked = data?.['short_sale_config']?.['is_choose_price_list'];
                $('#is-input-price')[0].checked = data?.['short_sale_config']?.['is_input_price'];
                $('#is-discount-on-product')[0].checked = data?.['short_sale_config']?.['is_discount_on_product'];
                $('#is-discount-on-total')[0].checked = data?.['short_sale_config']?.['is_discount_on_total'];
            }
            if (data?.['long_sale_config']) {
                $('#is-not-input-price')[0].checked = data?.['long_sale_config']?.['is_not_input_price'];
                $('#is-not-discount-on-product')[0].checked = data?.['long_sale_config']?.['is_not_discount_on_product'];
                $('#is-not-discount-on-total')[0].checked = data?.['long_sale_config']?.['is_not_discount_on_total'];
            }
            if (data?.['is_require_payment']) {
                $('#is-require-payment')[0].checked = data?.['is_require_payment'];
            }
            if (data?.['ss_role']) {
                loadInitS2(boxSRole, data?.['ss_role']);
            }
            if (data?.['ls_role']) {
                loadInitS2(boxLRole, data?.['ls_role']);
            }
            return true;
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
            result['is_require_payment'] = $('#is-require-payment')[0].checked
            return result;
        }

        function dataTableZone(data) {
            // init dataTable
            $tableZones.DataTableDefault({
                data: data ? data : [],
                paging: false,
                info: false,
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                            return `<span class="table-row-order ml-2" data-row="${dataRow}">${row?.['order']}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            return `<div class="d-flex table-row-employee" data-employee="${JSON.stringify(row?.['employee_data']).replace(/"/g, "&quot;")}">
                                        <span class="badge badge-primary mr-2">${row?.['employee_data']?.['code'] ? row?.['employee_data']?.['code'] : ''}</span>
                                        <span class="badge badge-primary badge-outline">${row?.['employee_data']?.['full_name'] ? row?.['employee_data']?.['full_name'] : ''}</span>
                                    </div>`;
                        },
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            let listShow = ``;
                            for (let zone of row?.['zones_editing_data']) {
                                listShow += `<span class="badge badge-soft-green mr-1 mb-1">${zone?.['title']}</span>`;
                            }
                            return `<div class="table-row-zones-editing" data-zones="${JSON.stringify(row?.['zones_editing_data']).replace(/"/g, "&quot;")}">${listShow}</div>`;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            let listShow = ``;
                            for (let zone of row?.['zones_hidden_data']) {
                                listShow += `<span class="badge badge-soft-warning mr-1 mb-1">${zone?.['title']}</span>`;
                            }
                            return `<div class="table-row-zones-hidden" data-zones="${JSON.stringify(row?.['zones_hidden_data']).replace(/"/g, "&quot;")}">${listShow}</div>`;
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            return `<p class="table-row-remark">${row?.['remark']}</p>`;
                        }
                    },
                    {
                        targets: 4,
                        render: () => {
                            return `<div class="d-flex">
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover edit-row mr-1" data-bs-toggle="modal" data-bs-target="#editZoneMdl"><span class="icon"><i class="far fa-edit"></i></span></button>
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                    </div>`;

                        }
                    },
                ],
                drawCallback: function () {
                    loadCssToDtb('table_zones')
                },
            });
        }

        function loadCssToDtb(tableID) {
            let tableIDWrapper = tableID + '_wrapper';
            let tableWrapper = document.getElementById(tableIDWrapper);
            if (tableWrapper) {
                let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
                if (headerToolbar) {
                    headerToolbar.classList.add('hidden');
                }
            }
        }

        function loadAppEmpConfig() {
            $.fn.callAjax2({
                    'url': $eleUrlFact.attr('data-url-app-emp-config'),
                    'method': 'GET',
                    'data': {'application_id': "b9650500-aba7-44e3-b6e0-2542622702a3"},
                    isLoading: false,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('app_emp_config_list') && Array.isArray(data.app_emp_config_list)) {
                            $tableZones.DataTable().clear().destroy();
                            dataTableZone();
                            $tableZones.DataTable().rows.add(data?.['app_emp_config_list']).draw();
                        }
                    }
                }
            )
        }

        function deleteRowAEC(currentRow, table) {
            // Get the index of the current row within the DataTable
            let rowIndex = table.DataTable().row(currentRow).index();
            let row = table.DataTable().row(rowIndex);
            // Delete current row
            row.remove().draw();
        }

        function reOrderSTTRowAEC(table) {
            let order = 1;
            let itemCount = table[0].querySelectorAll('.table-row-order').length;
            if (itemCount === 0) {
                table.DataTable().clear().draw();
            } else {
                for (let eleOrder of table[0].querySelectorAll('.table-row-order')) {
                    eleOrder.innerHTML = order;
                    order++
                    if (order > itemCount) {
                        break;
                    }
                }
            }
        }

        function submitAppEmpConfig() {
            let dataSubmit = {'application': "b9650500-aba7-44e3-b6e0-2542622702a3"};
            let configs_data = [];
            $tableZones.DataTable().rows().every(function () {
                let row = this.node();
                let config_data = {};
                let rowOrder = row.querySelector('.table-row-order');
                let rowEmployee = row.querySelector('.table-row-employee');
                let rowZonesEditing = row.querySelector('.table-row-zones-editing');
                let rowZonesHidden = row.querySelector('.table-row-zones-hidden');
                let rowRemark = row.querySelector('.table-row-remark');
                if (rowOrder) {
                    config_data['order'] = parseInt(rowOrder.innerHTML);
                }
                if (rowRemark) {
                    config_data['remark'] = rowRemark.innerHTML;
                }
                if (rowEmployee) {
                    if (rowEmployee.getAttribute('data-employee')) {
                        let dataEmployee = JSON.parse(rowEmployee.getAttribute('data-employee'));
                        config_data['employee_data'] = dataEmployee?.['id'];
                    }
                }
                if (rowZonesEditing) {
                    if (rowZonesEditing.getAttribute('data-zones')) {
                        let dataZonesEditing = JSON.parse(rowZonesEditing.getAttribute('data-zones'));
                        let zones_editing_data = [];
                        for (let dataZone of dataZonesEditing) {
                            zones_editing_data.push(dataZone?.['id']);
                        }
                        config_data['zones_editing_data'] = zones_editing_data;
                    }
                }
                if (rowZonesHidden) {
                    if (rowZonesHidden.getAttribute('data-zones')) {
                        let dataZonesHidden = JSON.parse(rowZonesHidden.getAttribute('data-zones'));
                        let zones_hidden_data = [];
                        for (let dataZone of dataZonesHidden) {
                            zones_hidden_data.push(dataZone?.['id']);
                        }
                        config_data['zones_hidden_data'] = zones_hidden_data;
                    }
                }
                configs_data.push(config_data);
            });
            dataSubmit['configs_data'] = configs_data;
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': $eleUrlFact.attr('data-url-app-emp-config'),
                    'method': "POST",
                    'data': dataSubmit,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        loadAppEmpConfig();
                        boxEmployeeAdd.empty();
                        boxZonesEditingAdd.empty();
                        boxZonesHiddenAdd.empty();
                        $eleRemarkAdd.val('');
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000)
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        }

        function validateZoneDuplicated($ele) {
            let modal = $ele[0].closest('.modal');
            if (modal) {
                let zoneEditVal = boxZonesEditingAdd.val();
                let zoneHiddenVal = boxZonesHiddenAdd.val();
                if (modal.id === 'editZoneMdl') {
                    zoneEditVal = boxZonesEditingEdit.val();
                    zoneHiddenVal = boxZonesHiddenEdit.val();
                }
                let isDuplicate = zoneEditVal.some(value => zoneHiddenVal.includes(value));
                if (isDuplicate) {
                    $.fn.notifyB({description: 'Editing zone and hidden zone must be different'}, 'failure');
                    $ele.empty();
                    return false;
                }
            }
            return true;
        }




    });
});
