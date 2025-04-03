/**
 * Các hàm load page và hàm hỗ trợ thường dùng
 */
class UsualLoadPageFunction {
    /**
     * Định dạng ô nhập ngày
     * @param {HTMLElement} element - element
     * @param {string} [output_format='DD/MM/YYYY'] - định dạng ngày
     * @returns {void}
     */
    static LoadDate({element, output_format='DD/MM/YYYY'}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        element.daterangepicker({
            singleDatePicker: true,
            timePicker: false,
            showDropdowns: true,
            autoApply: true,
            autoUpdateInput: false,
            minYear: parseInt(moment().format('YYYY')),
            locale: {format: output_format},
            maxYear: parseInt(moment().format('YYYY')) + 100,
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
        }).val('');
    }

    /**
     * Load ô Employee (expected-data-url = EmployeeListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadEmployee({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        })
    }

    /**
     * Load ô Industry (expected-data-url = IndustryListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadIndustry({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'industry_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    /**
     * Load ô Account (expected-data-url = AccountListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadAccount({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'account_list',
            keyId: 'id',
            keyText: 'name',
        })
    }

    /**
     * Load ô Account Group (expected-data-url = AccountGroupListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadAccountGroup({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'account_group_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    /**
     * Load ô Customer (expected-data-url = CustomerListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadCustomer({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'customer_list',
            keyId: 'id',
            keyText: 'name',
        })
    }

    /**
     * Load ô Supplier (expected-data-url = SupplierListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadSupplier({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'supplier_list',
            keyId: 'id',
            keyText: 'name',
        })
    }

    /**
     * Load ô Warehouse (expected-data-url = WareHouseListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadWarehouse({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'warehouse_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    /**
     * Load ô Product (expected-data-url = ProductListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadProduct({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        });
    }

    /**
     * Load ô Expense (expected-data-url = ExpenseListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadExpense({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'expense_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    /**
     * Load ô Tax (expected-data-url = TaxListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadTax({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'tax_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    /**
     * Load ô UOM Group (expected-data-url = UnitOfMeasureGroupListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadUOMGroup({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp].filter(function (item) {
                    return Object.keys(item?.['referenced_unit']).length !== 0 && item?.['code'] !== 'Import';
                });
            },
            data: (data ? data : null),
            keyResp: 'unit_of_measure_group',
            keyId: 'id',
            keyText: 'title',
        })
    }

    /**
     * Load ô Account Type (expected-data-url = AccountTypeListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadAccountType({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'account_type_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    /**
     * Load ô UOM (expected-data-url = UnitOfMeasureListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params (truyền vào 'group_id' để lọc theo Group UOM)
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadUOM({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'unit_of_measure',
            keyId: 'id',
            keyText: 'title',
        })
    }

    /**
     * Load ô Period (expected-data-url = PeriodsConfigListAPI)
     * @param {HTMLElement} element - element
     * @param {Object} data - data json
     * @param {Boolean} [allow_clear=true] - select allow clear
     * @param {Object} data_params - data_params
     * @param {string} data_url - data_url
     * @returns {void}
     */
    static LoadPeriod({element, data=null, allow_clear=true, data_params = {}, data_url=''}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        data_url = data_url || element.attr('data-url')
        let queryString = '';
        if (typeof data_params === 'object' && data_params !== null && Object.keys(data_params).length > 0) {
            queryString = '?' + new URLSearchParams(data_params).toString();
        }
        element.initSelect2({
            allow_clear: allow_clear,
            ajax: {
                url: data_url + queryString,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let res = []
                for (const item of resp.data[keyResp]) {
                    if (item?.['fiscal_year'] <= new Date().getFullYear()) {
                        res.push(item)
                    }
                }
                return res
            },
            data: (data ? data : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    /**
     * Thêm dòng trong bảng
     * @param {HTMLElement} table - table
     * @param {Object} [data={}] - data json tương ứng với các cột
     * @returns {void}
     */
    static AddTableRow(table, data={}) {
        table.DataTable().row.add(data).draw();
    }

    /**
     * Xóa dòng trong bảng
     * @param {HTMLElement} table - table
     * @param {number} row_index - thứ tự của hàng cần xóa
     * @returns {void}
     */
    static DeleteTableRow(table, row_index) {
        if (row_index > 0) {
            row_index = parseInt(row_index) - 1
            let rowIndex = table.DataTable().row(row_index).index();
            let row = table.DataTable().row(rowIndex);
            row.remove().draw();
        }
    }

    /**
     * Hàm disabled các element trong trang Detail
     * @param {Boolean} [active=true] - active=true để áp dụng hàm
     * @param {Array} except - các element ngoại lệ
     * @returns {void}
     */
    static DisablePage(active=true, except=[]) {
        if (active) {
            const shouldExclude = (el) => except.some(selector => el.matches(selector));

            const container = document.querySelector('#idxPageContent, #idxModalData');
            if (!container) return;

            container.querySelectorAll('select, input, textarea, button').forEach(el => {
                if (shouldExclude(el)) return;
                if (el.matches('select')) el.disabled = true;
                if (el.matches('input')) el.readOnly = true;
                if (el.matches('textarea')) el.readOnly = true;
                if (el.matches('button')) el.disabled = true;
            });

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && !shouldExclude(node)) {
                            if (node.matches('select')) node.disabled = true;
                            if (node.matches('input')) node.readOnly = true;
                            if (node.matches('textarea')) node.readOnly = true;
                            if (node.matches('button')) node.disabled = true;
                        }
                    });
                });
            });

            observer.observe(container, { childList: true, subtree: true });
        }
    }

}
