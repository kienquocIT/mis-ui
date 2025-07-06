/**
 * Khai báo các element trong page
 */
class EquipmentReturnPageElements {
    constructor() {
        // info
        this.$script_url = $('#script-url')
        this.$trans_url = $('#trans-url')
        this.$title = $('#title')
        this.$document_date = $('#document-date')
        // line detail
        this.$table_line_detail = $('#table_line_detail')
    }
}
const pageElements = new EquipmentReturnPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class EquipmentReturnPageVariables {
    constructor() {

    }
}
const pageVariables = new EquipmentReturnPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class EquipmentReturnPageFunction {
    static LoadLineDetailTable(data_list=[], option='create') {
        pageElements.$table_line_detail.DataTable().clear().destroy()
        pageElements.$table_line_detail.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '60vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <span class="input-group-text" style="width: 100px">
                                        <a class="icon-collapse" data-bs-toggle="collapse" href=".${row?.['loan_product_id']}" role="button" aria-expanded="false" aria-controls=".${row?.['loan_product_id']}">
                                            <i class="bi bi-info-circle"></i>
                                        </a>
                                        <span class="badge badge-sm badge-light ml-1">${row?.['loan_product_code'] || ''}</span>
                                    </span>
                                    <span data-loan-product-id="${row?.['loan_product_id']}" class="loan-product">${row?.['loan_product_title'] || ''}</span>
                                </div>
                                <div class="collapse ${row?.['loan_product_id']}"><span class="small">${row?.['loan_product_description'] || ''}</span></div>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span></span>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span></span>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span></span>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span></span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled readonly' : ''} class="form-select select2 return-to-warehouse"></select>`
                    }
                },
            ],
        })
    }
}

/**
 * Khai báo các hàm chính
 */
class EquipmentReturnHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = pageElements.$title.val()

        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        return frm
    }
    static LoadDetailEquipmentReturn(option) {
        let url_loaded = $('#form-detail-equipment-return').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['equipment_return_detail'];

                    // console.log(data)

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    pageElements.$title.val(data?.['title'])

                    new $x.cls.file($('#attachment')).init({
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                        name: 'attachment'
                    })

                    $.fn.initMaskMoney2();

                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                    UsualLoadPageFunction.DisablePage(
                        option==='detail'
                    )
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class EquipmentReturnEventHandler {
    static InitPageEven() {
        $(document).on("click", '#btn-select-detail', function () {

        })
    }
}
