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
        this.$loan_date = $('#loan-date')
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

    }
}
