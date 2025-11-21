class TemplateAttrElements {
    constructor() {
        // modal element
        this.$titleEle = $('#template_attr_title');
        this.$nameEle = $('#template_attr_name');
        this.$codeEle = $('#template_attr_code');
        this.$attrTypeEle = $('#template_attr_type');
        this.$mandatoryEle = $('#mandatory');
        this.$formulaEle = $('#formula_element');

        this.$btnSubmit = $('#btn_save_attr');
    }
}

const pageElements = new TemplateAttrElements();


class TemplateAttrPageFunction {
    static combineSubmitData(form) {
        form.dataForm['component_title'] = pageElements.$titleEle.val();
        form.dataForm['component_name'] = pageElements.$nameEle.val();
        form.dataForm['component_code'] = pageElements.$codeEle.val();
        form.dataForm['component_type'] = pageElements.$attrTypeEle.val();
        form.dataForm['component_mandatory'] = pageElements.$mandatoryEle.is(':checked');
        form.dataForm['component_formula'] = pageElements.$formulaEle.val();
        return form;
    }
}

class TemplateAttrEventHandler {
    static initPageEvent() {
        $(document).on('click', '.edit-attr', function() {
            $('#template_attr_modal_title').attr('data-id', $(this).attr('data-id'));
            pageElements.$titleEle.val($(this).attr('data-title'));
            pageElements.$nameEle.val($(this).attr('data-name'));
            pageElements.$codeEle.val($(this).attr('data-code'));
            pageElements.$attrTypeEle.val($(this).attr('data-type')).trigger('change');
            pageElements.$mandatoryEle.prop('checked', $(this).attr('data-mandatory') === 'true');
            pageElements.$formulaEle.val($(this).attr('data-formula'));
        });

        // reset all element when closing modal
        $('#templateAttributeModal').on('hidden.bs.modal', function () {
            $('#frm_template_attribute')[0].reset();
            $('#template_attr_type').val('').trigger('change');
            $('#frm_template_attribute').removeAttr('data-id').data('method', 'POST');
            $('#template_attr_modal_title').removeAttr('data-id');
        });
    }
}
