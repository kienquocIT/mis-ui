/**
 * Khai báo các element trong page
 */
class CompanyPageElements {
    constructor() {
        this.$company_config = $('#company-config')
        this.$idxCurrencyDefault = $('#idxCurrencyDefault')
        this.$cost_per_warehouse = $('#cost-per-warehouse')
        this.$cost_per_lot = $('#cost-per-lot')
        this.$cost_per_prj = $('#cost-per-prj')
        this.$companyCityEle = $('#company-address-city')
        this.$companyDistrictEle = $('#company-address-district')
        this.$companyWardEle = $('#company-address-ward')
        // function number
        this.$schema_item_list = $('#schema-item-list')
        this.$first_number_ele = $('#first-number')
        this.$last_number_ele = $('#last-number')
        this.$reset_frequency_ele = $('#reset-frequency')
        this.$min_num_char_ele = $('#min_num_char')
        this.$min_num_char_checkbox_ele = $('#min_num_char_checkbox')
        this.$app_function_number_table = $('#app_function_number_table')
        this.$add_new_app = $('#add-new-app')
        this.$master_data_function_number_table = $('#master_data_function_number_table')
        this.$add_new_master_data = $('#add-new-master-data')
    }
}
const pageElements = new CompanyPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class CompanyPageVariables {
    constructor() {
        // function number
        this.schema_item_list_value = [
            '{Number}',
            '{Short year}',
            '{Long year}',
            '{Short month}',
            '{Long month}',
            '{Month of year}',
            '{Week of year}',
            '{Day of year}',
            '{Day of month}',
            '{Day of week}'
        ]
        this.currentDate = new Date()
        this.fullYear = this.currentDate.getFullYear()
        this.shortYear = this.fullYear.toString().slice(-2)
        this.monthOfYear = this.currentDate.getMonth() + 1
        this.weekOfYear = Math.ceil((this.currentDate - new Date(this.currentDate.getFullYear(), 0, 1) + 1) / 604800000)
        this.dayOfYear = Math.floor((this.currentDate - new Date(this.fullYear, 0, 0)) / 86400000)
        this.dayOfMonth = this.currentDate.getDate()
        this.dayOfWeek = this.currentDate.getDay() || 7
        this.schema_item_preview = [
            '#number',
            this.shortYear.toString(),
            this.fullYear.toString(),
            this.currentDate.toLocaleString('default', {month: 'short'}),
            this.currentDate.toLocaleString('default', {month: 'long'}),
            this.monthOfYear.toString().padStart(2, '0'),
            this.weekOfYear.toString().padStart(2, '0'),
            this.dayOfYear.toString().padStart(3, '0'),
            this.dayOfMonth.toString().padStart(2, '0'),
            this.dayOfWeek.toString()
        ]
        this.current_schema_row = null
    }
}
const pageVariables = new CompanyPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class CompanyPageFunction {
    // info
    static loadCompanyCities(cityData) {
        pageElements.$companyCityEle.initSelect2({
            data: (cityData ? cityData : null),
            keyResp: 'cities',
        }).on('change', function () {
            let dataParams = JSON.stringify({'city_id': $(this).val()});
            pageElements.$companyDistrictEle.attr('data-params', dataParams).val("");
            pageElements.$companyWardEle.attr('data-params', '{}').val("");
        });
    }
    static loadCompanyDistrict(disData) {
        pageElements.$companyDistrictEle.initSelect2({
            data: (disData ? disData : null),
            keyResp: 'districts',
        }).on('change', function () {
            let dataParams = JSON.stringify({'district_id': $(this).val()});
            pageElements.$companyWardEle.attr('data-params', dataParams).val("");
        });
    }
    static loadCompanyWard(wardData) {
        pageElements.$companyWardEle.initSelect2({
            data: (wardData ? wardData : null),
            keyResp: 'wards',
        });
    }
    static loadCurrency(data) {
        pageElements.$idxCurrencyDefault.initSelect2({
            ajax: {
                url: pageElements.$company_config.attr('data-url-currency-list') || pageElements.$idxCurrencyDefault.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'currency_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    // function number
    static preview_next_code() {
        let raw_schema = pageElements.$schema_item_list.val();
        if (raw_schema && pageElements.$last_number_ele.val() && pageElements.$first_number_ele) {
            let raw_schema_item_list = raw_schema.match(/{([^}]+)}/g);
            let code_1 = raw_schema;
            let code_2 = raw_schema;
            for (let i = 0; i < raw_schema_item_list.length; i++) {
                if (pageVariables.schema_item_list_value.includes(raw_schema_item_list[i])) {
                    let format_value = pageVariables.schema_item_list_value.indexOf(raw_schema_item_list[i]);
                    if (format_value === 0) {
                        let min_char_number = pageElements.$min_num_char_ele.val() ? parseInt(pageElements.$min_num_char_ele.val()) : 0;
                        code_1 = code_1.replace(raw_schema_item_list[i], pageElements.$last_number_ele.val().padStart(min_char_number, '0'));
                        code_2 = code_2.replace(raw_schema_item_list[i], (parseInt(pageElements.$last_number_ele.val()) + 1).toString().padStart(min_char_number, '0'));
                    } else {
                        code_1 = code_1.replace(raw_schema_item_list[i], pageVariables.schema_item_preview[format_value]);
                        code_2 = code_2.replace(raw_schema_item_list[i], pageVariables.schema_item_preview[format_value]);
                    }
                }
            }
            $('#preview').html(`<span class="badge badge-primary">${code_1}</span><i class="mr-1 ml-1 fas fa-caret-right"></i><span class="badge badge-primary">${code_2}</span><i class="mr-1 ml-1 fas fa-caret-right"></i>...`);
        }
    }
    static formatInputSchema() {
        let schema_item_value_list = pageElements.$schema_item_list.val().match(/{([^}]+)}/g);
        for (let i = 0; i < schema_item_value_list.length; i++) {
            if (schema_item_value_list[i]) {
                if (!pageVariables.schema_item_list_value.includes(schema_item_value_list[i])) {
                    if (schema_item_value_list[i].includes('{') || schema_item_value_list[i].includes('}')) {
                        $.fn.notifyB({description: "Wrong schema format: " + schema_item_value_list[i]}, 'warning');
                        return false;
                    }
                }
            }
        }
        if (!schema_item_value_list.includes('{Number}')) {
            $.fn.notifyB({description: "Schema must be included {Number}"}, 'failure');
            return false;
        }
        return true;
    }
    static formatSubmitSchema(raw_schema) {
        let raw_schema_item_list = raw_schema.match(/{([^}]+)}/g);
        for (let i = 0; i < raw_schema_item_list.length; i++) {
            if (pageVariables.schema_item_list_value.includes(raw_schema_item_list[i])) {
                let format_value = pageVariables.schema_item_list_value.indexOf(raw_schema_item_list[i]);
                raw_schema = raw_schema.replace(raw_schema_item_list[i], '[' + format_value.toString() + ']');
            }
        }
        return raw_schema;
    }
    static LoadApplicationList(ele, data) {
        ele.initSelect2({
            ajax: {
                url: pageElements.$company_config.attr('data-url-all-app') + '?allowed_app=true',
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'tenant_application_list',
            keyId: 'code',
            keyText: 'title',
        })
    }
    static LoadAppFunctionNumberTable(option='detail', table_detail_data=[]) {
        table_detail_data.sort(function (a, b) {
            return a.function - b.function;
        });
        pageElements.$app_function_number_table.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            scrollX: true,
            scrollY: '55vh',
            scrollCollapse: true,
            paging: false,
            data: table_detail_data,
            columns: [
                {
                    render: () => {
                        return ``;
                    }
                }, {
                    render: () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 app-select"></select>`;
                    }
                }, {
                    render: (data, type, row) => {
                        if (row?.['schema']) {
                            return `<span data-schema="${row?.['schema']}" data-first-number="${row?.['first_number']}" data-last-number="${row?.['last_number']}" data-reset-frequency="${row?.['reset_frequency']}" data-min-number-char="${row?.['min_number_char']}" class="schema-show">${row?.['schema_text']}</span>`;
                        }
                        return `<span class="schema-show"></span>`;
                    }
                }, {
                    className: 'text-center',
                    render: () => {
                        if (option !== 'detail') {
                            return `
                                    <a class="schema-custom" href="#" data-bs-toggle="modal" data-bs-target="#modal-function-number"><i class="far fa-edit"></i></a>
                                    <a class="delete-schema text-danger ml-1" href="#"><i class="bi bi-x-square"></i></a>
                            `;
                        }
                        return ''
                    }
                }
            ],
            initComplete: function () {
                pageElements.$app_function_number_table.find('tbody tr').each(function (index, ele) {
                    CompanyPageFunction.LoadApplicationList($(ele).find('.app-select'), {
                        'code': table_detail_data[index]?.['app_code'],
                        'title': table_detail_data[index]?.['app_title'],
                    })
                })
            }
        })
    }
    static LoadMasterDataList(ele, data) {
        ele.initSelect2({
            ajax: {
                url: pageElements.$company_config.attr('data-url-all-app') + '?allowed_master_data=true',
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'tenant_application_list',
            keyId: 'code',
            keyText: 'title',
        })
    }
    static LoadMasterDataFunctionNumberTable(option='detail', table_detail_data=[]) {
        table_detail_data.sort(function (a, b) {
            return a.function - b.function;
        });
        pageElements.$master_data_function_number_table.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            scrollX: true,
            scrollY: '55vh',
            scrollCollapse: true,
            paging: false,
            data: table_detail_data,
            columns: [
                {
                    render: () => {
                        return ``;
                    }
                }, {
                    render: () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 master-data-select"></select>`;
                    }
                }, {
                    render: (data, type, row) => {
                        if (row?.['schema']) {
                            return `<span data-schema="${row?.['schema']}" data-first-number="${row?.['first_number']}" data-last-number="${row?.['last_number']}" data-reset-frequency="${row?.['reset_frequency']}" data-min-number-char="${row?.['min_number_char']}" class="schema-show">${row?.['schema_text']}</span>`;
                        }
                        return `<span class="schema-show"></span>`;
                    }
                }, {
                    className: 'text-center',
                    render: () => {
                        if (option !== 'detail') {
                            return `
                                    <a class="schema-custom" href="#" data-bs-toggle="modal" data-bs-target="#modal-function-number"><i class="far fa-edit"></i></a>
                                    <a class="delete-schema text-danger ml-1" href="#"><i class="bi bi-x-square"></i></a>
                            `;
                        }
                        return ''
                    }
                }
            ],
            initComplete: function () {
                pageElements.$master_data_function_number_table.find('tbody tr').each(function (index, ele) {
                    CompanyPageFunction.LoadMasterDataList($(ele).find('.master-data-select'), {
                        'code': table_detail_data[index]?.['app_code'],
                        'title': table_detail_data[index]?.['app_title'],
                    })
                })
            }
        })
    }
}

/**
 * Khai báo các hàm chính
 */
class CompanyHandler {
    static CombinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['code'] = $('#code').val();
        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['fax'] = $('#fax').val();
        frm.dataForm['address'] = $('#address').val();
        frm.dataForm['representative_fullname'] = $('#representative_fullname').val();
        frm.dataForm['phone'] = $('#phone').val();
        frm.dataForm['email'] = $('#email').val();

        let function_number = []
        $('#app_function_number_table tbody tr').each(function () {
            let schema_text = $(this).find('.schema-show').text()
            let schema = $(this).find('.schema-show').attr('data-schema');
            let first_number = $(this).find('.schema-show').attr('data-first-number');
            let last_number = $(this).find('.schema-show').attr('data-last-number');
            let reset_frequency = $(this).find('.schema-show').attr('data-reset-frequency');
            let min_number_char = $(this).find('.schema-show').attr('data-min-number-char');
            if (min_number_char === 'null') {
                min_number_char = null
            }
            let app_selected = SelectDDControl.get_data_from_idx($(this).find('.app-select'), $(this).find('.app-select').val())

            if (schema_text && schema && last_number && reset_frequency) {
                function_number.push({
                    'schema_text': schema_text,
                    'schema': schema,
                    'first_number': first_number || null,
                    'last_number': last_number,
                    'reset_frequency': reset_frequency,
                    'min_number_char': min_number_char || null,
                    'app_type': 0,
                    'app_code': app_selected?.['code'],
                    'app_title': app_selected?.['title']
                })
            }
        })
        $('#master_data_function_number_table tbody tr').each(function () {
            let schema_text = $(this).find('.schema-show').text()
            let schema = $(this).find('.schema-show').attr('data-schema');
            let first_number = $(this).find('.schema-show').attr('data-first-number');
            let last_number = $(this).find('.schema-show').attr('data-last-number');
            let reset_frequency = $(this).find('.schema-show').attr('data-reset-frequency');
            let min_number_char = $(this).find('.schema-show').attr('data-min-number-char');
            if (min_number_char === 'null') {
                min_number_char = null
            }
            let app_selected = SelectDDControl.get_data_from_idx($(this).find('.master-data-select'), $(this).find('.master-data-select').val())

            if (schema_text && schema && last_number && reset_frequency) {
                function_number.push({
                    'schema_text': schema_text,
                    'schema': schema,
                    'first_number': first_number || null,
                    'last_number': last_number,
                    'reset_frequency': reset_frequency,
                    'min_number_char': min_number_char || null,
                    'app_type': 1,
                    'app_code': app_selected?.['code'],
                    'app_title': app_selected?.['title']
                })
            }
        })
        frm.dataForm['function_number'] = function_number

        if (for_update) {
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid($.fn.getPkDetail()),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        } else {
            return {
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
    }
    static LoadDetailCompany(frm, option) {
        Promise.all([
            $.fn.callAjax2({
                'url': frm.attr('data-url-detail').replace(0, $.fn.getPkDetail()),
                'method': 'GET',
            }),
            $.fn.callAjax2({
                'url': pageElements.$company_config.attr('data-url-detail'),
                'data': {'company_id': $.fn.getPkDetail()},
                'method': 'GET',
            }),
        ]).then(([result0, result1]) => {
            let data0 = $.fn.switcherResp(result0); // detail data
            let data1 = $.fn.switcherResp(result1); // config

            WFRTControl.setWFRuntimeID(data0['company_detail']?.['workflow_runtime_id']);
            data0 = data0['company_detail'];
            $.fn.compareStatusShowPageAction(data0);
            $x.fn.renderCodeBreadcrumb(data0);

            $('#title').val(data0.title);
            $('#code').val(data0.code);
            $('#representative_fullname').val(data0.representative_fullname);
            $('#address').val(data0.address);
            $('#email').val(data0.email);
            $('#phone').val(data0.phone);
            $('#fax').val(data0.fax);

            const eleInputLogo = $('#company_logo');
            const eleInputIcon = $('#company_icon');
            if (option === 'update') {
                if (data0?.['logo']) {
                    eleInputLogo.attr('data-default-file', data0?.['logo']);
                }
                eleInputLogo.dropify({
                    messages: {
                        'default': '',
                    }
                });

                if (data0?.['icon']){
                    eleInputIcon.attr('data-default-file', data0?.['icon']);
                }
                eleInputIcon.dropify({
                    messages: {
                        'default': '',
                    }
                })
            }
            else {
                if (data0?.['logo']) {
                    $(`<img alt="" src="${data0?.['logo']}" class="img-fluid" style="max-height: 100px">`).insertAfter(eleInputLogo);
                }
                eleInputLogo.attr('disabled', 'disabled').remove();
                if (data0?.['icon']) {
                    $(`<img alt="" src="${data0?.['icon']}" class="img-fluid" style="max-height: 100px"/>`).insertAfter(eleInputIcon);
                }
                eleInputIcon.attr('disabled', 'disabled').remove();
            }

            CompanyPageFunction.LoadAppFunctionNumberTable(option, data0?.['function_number'].filter((item) => {return item?.['app_type'] === 0}))
            CompanyPageFunction.LoadMasterDataFunctionNumberTable(option, data0?.['function_number'].filter((item) => {return item?.['app_type'] === 1}))

            $.fn.initMaskMoney2();

            if (data1['config']) {
                pageElements.$company_config.attr('data-config-id', data1['config']?.['id'])
                if (!data1['config']?.['definition_inventory_valuation']) {
                    $('#perpetual-selection').prop('checked', true);
                } else {
                    $('#periodic-selection').prop('checked', true);
                }

                $('#default-inventory-value-method').val(data1['config']?.['default_inventory_value_method']);

                if (data1['config']?.['cost_per_warehouse']) {
                    pageElements.$cost_per_warehouse.prop('checked', true);
                    pageElements.$cost_per_warehouse.trigger('change')
                }
                if (data1['config']?.['cost_per_lot']) {
                    pageElements.$cost_per_lot.prop('checked', true);
                    pageElements.$cost_per_lot.trigger('change')
                }
                if (data1['config']?.['cost_per_project']) {
                    pageElements.$cost_per_prj.prop('checked', true);
                    pageElements.$cost_per_prj.trigger('change')
                }

                $('#idxLanguage').val(data1['config']['language']).trigger('change.select2');
                CompanyPageFunction.loadCurrency(data1['config']?.['master_data_currency'])
                $('#idxCurrencyMaskPrefix').val(data1['config']['currency_rule'].prefix);
                $('#idxCurrencyMaskSuffix').val(data1['config']['currency_rule'].suffix);
                $('#idxCurrencyMaskThousand').val(data1['config']['currency_rule'].thousands);
                $('#idxCurrencyMaskDecimal').val(data1['config']['currency_rule'].decimal);
                $('#idxCurrencyMaskPrecision').val(data1['config']['currency_rule'].precision);
                $('#idxSubdomain').val(data1['config']['sub_domain']);
            }

            UsualLoadPageFunction.DisablePage(option==='detail')
        })
    }
}

/**
 * Khai báo các Event
 */
class CompanyEventHandler {
    static InitPageEven() {
        $('#save-changes-modal-company-address').on('click', function () {
            try {
                let detail_company_address = $('#detail-company-address-modal').val();
                let city = pageElements.$companyCityEle.find(`option:selected`).text();
                let district = pageElements.$companyDistrictEle.find(`option:selected`).text();
                let ward = pageElements.$companyWardEle.find(`option:selected`).text();

                let company_address = '';
                if (city && district && detail_company_address) {

                    if (ward === '') {
                        company_address = detail_company_address + ', ' + district + ', ' + city;
                    } else {
                        company_address = detail_company_address + ', ' + ward + ', ' + district + ', ' + city;
                    }
                } else {
                    $.fn.notifyB({description: "Missing address information!"}, 'failure');
                }

                if (company_address) {
                    $('#address').val(company_address);
                    $('#modal-company-address').modal('hide')
                }
            } catch (error) {
                $.fn.notifyB({description: "No address information!"}, 'failure');
            }
        })
        pageElements.$cost_per_warehouse.on('change', function () {
            if ($(this).prop('checked')) {
                pageElements.$cost_per_lot.prop('disabled', false)
                pageElements.$cost_per_prj.prop('disabled', true)
            }
            else {
                if (!pageElements.$cost_per_lot.prop('checked')) {
                    pageElements.$cost_per_prj.prop('disabled', false)
                }
            }
        })
        pageElements.$cost_per_lot.on('change', function () {
            if ($(this).prop('checked')) {
                pageElements.$cost_per_warehouse.prop('disabled', false)
                pageElements.$cost_per_prj.prop('disabled', true)
            }
            else {
                if (!pageElements.$cost_per_warehouse.prop('checked')) {
                    pageElements.$cost_per_prj.prop('disabled', false)
                }
            }
        })
        pageElements.$cost_per_prj.on('change', function () {
            if ($(this).prop('checked')) {
                pageElements.$cost_per_warehouse.prop('disabled', true)
                pageElements.$cost_per_lot.prop('disabled', true)
            }
            else {
                pageElements.$cost_per_warehouse.prop('disabled', false)
                pageElements.$cost_per_lot.prop('disabled', false)
            }
        })
        // function number
        pageElements.$min_num_char_checkbox_ele.on('change', function () {
            if ($(this).is(':checked')) {
                pageElements.$min_num_char_ele.prop('disabled', false);
            } else {
                pageElements.$min_num_char_ele.val('').prop('disabled', true);
            }
            CompanyPageFunction.preview_next_code()
        })
        pageElements.$min_num_char_ele.on('change', function () {
            CompanyPageFunction.preview_next_code()
        })
        pageElements.$schema_item_list.on('input', function () {
            CompanyPageFunction.preview_next_code()
        })
        pageElements.$first_number_ele.on('input', function () {
            CompanyPageFunction.preview_next_code()
        })
        pageElements.$last_number_ele.on('input', function () {
            CompanyPageFunction.preview_next_code()
        })
        pageElements.$reset_frequency_ele.on('change', function () {
            pageElements.$first_number_ele.val('').prop('disabled', $(this).val() === '4')
            if ($(this).val() === '4') {
                pageElements.$first_number_ele.closest('.form-group').find('label').removeClass('required')
            }
            else {
                pageElements.$first_number_ele.closest('.form-group').find('label').addClass('required')
            }
        })
        $(document).on("click", '.schema-custom', function () {
            pageVariables.current_schema_row = $(this).closest('tr');
            let schema_show_ele = pageVariables.current_schema_row.find('.schema-show');
            if (schema_show_ele.text()) {
                pageElements.$schema_item_list.val(schema_show_ele.text());
                pageElements.$first_number_ele.val(schema_show_ele.attr('data-first-number'));
                pageElements.$last_number_ele.val(schema_show_ele.attr('data-last-number'));
                pageElements.$reset_frequency_ele.val(schema_show_ele.attr('data-reset-frequency'));
            } else {
                pageElements.$schema_item_list.val('');
                pageElements.$first_number_ele.val('');
                pageElements.$last_number_ele.val('');
                pageElements.$reset_frequency_ele.val('');

            }
            if (schema_show_ele.attr('data-min-number-char') && schema_show_ele.attr('data-min-number-char') !== 'null') {
                pageElements.$min_num_char_ele.val(schema_show_ele.attr('data-min-number-char')).prop('disabled', false);
                pageElements.$min_num_char_checkbox_ele.prop('checked', true);
            } else {
                pageElements.$min_num_char_ele.val('').prop('disabled', true);
                pageElements.$min_num_char_checkbox_ele.prop('checked', false);
            }
            CompanyPageFunction.preview_next_code()

            if ($(this).closest('table').attr('id') === 'master_data_function_number_table') {
                pageElements.$reset_frequency_ele.val(4).prop('disabled', true)
                pageElements.$first_number_ele.val('').prop('disabled', true)
            }
            else {
                pageElements.$reset_frequency_ele.prop('disabled', false)
                pageElements.$first_number_ele.prop('disabled', false)
            }
        })
        $(document).on("click", '.delete-schema', function () {
            UsualLoadPageFunction.DeleteTableRow(
                $(this).closest('table'),
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
        })
        $('.schema-item').on('click', function () {
            let old_content = pageElements.$schema_item_list.val();
            if (old_content === '') {
                pageElements.$schema_item_list.val(pageVariables.schema_item_list_value[parseInt($(this).attr('data-value'))])
            } else {
                pageElements.$schema_item_list.val(old_content + pageVariables.schema_item_list_value[parseInt($(this).attr('data-value'))])
            }
            CompanyPageFunction.preview_next_code()
        })
        $('#save-changes-modal-function-number').on('click', function () {
            if (CompanyPageFunction.formatInputSchema()) {
                let schema = pageElements.$schema_item_list.val();
                let first_number = pageElements.$first_number_ele.val();
                let last_number = pageElements.$last_number_ele.val();
                let reset_frequency = pageElements.$reset_frequency_ele.val();
                let min_number_char = pageElements.$min_num_char_ele.val();

                if (min_number_char < 2 && pageElements.$min_num_char_checkbox_ele.prop('checked')) {
                    $.fn.notifyB({'description': 'Minimum char number must be > 2.'}, 'warning');
                } else {
                    if (schema && last_number && reset_frequency) {
                        let schema_show_ele = pageVariables.current_schema_row.find('.schema-show');
                        schema_show_ele.text(schema);
                        schema_show_ele.attr('data-schema', CompanyPageFunction.formatSubmitSchema(schema));
                        schema_show_ele.attr('data-first-number', first_number);
                        schema_show_ele.attr('data-last-number', last_number);
                        schema_show_ele.attr('data-reset-frequency', reset_frequency);
                        schema_show_ele.attr('data-min-number-char', min_number_char);
                        $('#modal-function-number').hide();
                    } else {
                        $.fn.notifyB({description: "Missing information!"}, 'failure');
                    }
                }
            }
        })
        pageElements.$add_new_app.on('click', function () {
            UsualLoadPageFunction.AddTableRow(pageElements.$app_function_number_table)
            let row_added = pageElements.$app_function_number_table.find('tbody tr:last-child')
            CompanyPageFunction.LoadApplicationList(row_added.find('.app-select'))
        })
        pageElements.$add_new_master_data.on('click', function () {
            UsualLoadPageFunction.AddTableRow(pageElements.$master_data_function_number_table)
            let row_added = pageElements.$master_data_function_number_table.find('tbody tr:last-child')
            CompanyPageFunction.LoadMasterDataList(row_added.find('.master-data-select'))
        })
    }
}
