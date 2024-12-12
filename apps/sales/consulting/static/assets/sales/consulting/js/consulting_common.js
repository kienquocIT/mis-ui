// naming convention:  [...] + selector = $(...)

class ConsultingHandler{
    constructor(options){
        this.consultingName = $('#consulting-name')
        this.consultingCustomer = $('#consulting-customer')
        this.consultingDate = $('#consulting-date')
        this.consultingValue = $('#consulting-value')
        this.btnAddProductCategory = $('#btn-add-product-category')
        this.tableProductCategories = $('#datatable-product-categories')
        this.customerSelect = $('#consulting-customer-select')

    }

    /**
     * @typedef keyObject
     * @property {string} keyResp
     * @property {string} keyId
     * @property {string} keyText
     */

    /**
     * @param {any} selectFieldSelector The selected field selector
     * @param {keyObject} key The object key
     */
     fetchDataSelect(selectFieldSelector, key){
        selectFieldSelector.initSelect2({
            ajax: {
                url: selectFieldSelector.attr('data-url'),
                method: 'GET',
            },
            keyResp: key.keyResp,
            keyId: key.keyId,
            keyText: key.keyText,
            templateResult: function (state) {
                const title = state.text || "_";
                return $(`
                    <div class="row">
                        <div class="col-12">${title}</div>
                    </div>
                    `);
            },
        })
    }

    initDateField(dateSelector){
        dateSelector.each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD-MM-YYYY'));
            });
            $(this).val('').trigger('change');
        })
    }

    handleAddProductCategory(addBtnSelector){
        addBtnSelector.on('click', function () {
            console.log('ok')
        })
    }

    initNewRow(tableSelector, dataInit){

    }

    initTableProductCategories(tableSelector, data=[]){
        tableSelector.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row?.['order'] ? row?.['order'] : 0}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '55%',
                    render: (data, type, row) => {
                        let urlScript = $('#url-script')
                        let prodCateUrl = urlScript.data('url-product-category')
                        console.log()
                        return `<select class="form-select select2 product-select" data-method="GET" data-url=${prodCateUrl} required>`;
                    }
                },
                {
                    targets: 2,
                    width: '30%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-title mask-money" value="${row?.['title'] ? row?.['title'] : ''}" required>`;
                    }
                },
                {
                    targets: 3,
                    class: 'text-center',
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-center">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title=""><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                </div>`;
                    }
                },
            ],
            drawCallback:() => {
                $('.product-select').each((_, element) => {
                    this.fetchDataSelect($(element), {
                        keyResp: 'consulting_product_category_list',
                        keyId: 'id',
                        keyText: 'title'
                    });
                });
            }
        })
    }
}