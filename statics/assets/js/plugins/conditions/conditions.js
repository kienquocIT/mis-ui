class Conditions {
    constructor() {}
    /***
     * handle action click button of formset
     * @param elm_target element of action on click handle event on click when user click on button
     * @param elm_focus element store data serializer after user click button elm_target, if null function return array instead
     * @param element_formset element of formset. for loop get data purpose
     * @constructor
     */
    ElementAction(elm_target = null, elm_focus = null, element_formset = null) {
        if (elm_target && element_formset)
            elm_target.on('click', function (e) {
                e.preventDefault();
                let result = []
                if (elm_focus) {
                    element_formset.find('[data-formset-body] [data-formset-form]').each(function (idx, item) {
                        /*** for loop in formset get list of condition ***/

                        if (!$(item).attr('data-formset-form-deleted')) {
                            let formset_logic_temp = $(this).find('.formset-logic').val();
                            let sub_formset_temp = [];
                            $(item).find('[data-subformset-body] [data-subformset-form]').each(function (){
                                /*** for loop in sub formset get sub condition ***/

                                if (!$(this).attr('data-formset-form-deleted')) {
                                    /*** get data form from subformset ***/
                                    let left_cond = $(this).find('select[name*="left_cond"]').val();
                                    let math = $(this).find('select[name*="math"]').val();
                                    let right_cond = $(this).find('select[name*="right_cond"]').val();
                                    /*** push subformset to array temp ***/
                                    sub_formset_temp.push({
                                        left_cond: left_cond,
                                        math: math,
                                        right_cond: right_cond,
                                        order: parseInt($(this).find('[name*="ORDER"]').val()),
                                    }, $(this).find('.subformset-logic').val())
                                }
                            });

                            /*** check if one condition convert to object else keep array ***/
                            if (sub_formset_temp.length === 2)
                                result.push(sub_formset_temp[0], formset_logic_temp)
                            else
                                result.push(sub_formset_temp, formset_logic_temp)
                        }
                    });
                    elm_focus.val(JSON.stringify(result))
                } else
                    return result
            });
    }

    cleanFormset(element_formset=null){
        element_formset.find('[data-formset-body]').empty()
    }

     // render data item to html
    appendData(form_elm = null, value = null, idx= 0, sub_idx_arr=0) {
        let elm_idx = idx
        let $elm_cond = form_elm.find('[data-subformset-body]').children('.formset:not([data-formset-form-deleted])').eq(idx);
        if (sub_idx_arr !== 0) elm_idx = sub_idx_arr
        /*** append logic to html ***/
        let logic_formset = `condition-${elm_idx}-logic`;
        if (value.hasOwnProperty('logic_next') && value.logic)
            $elm_cond.find('select[name="' + logic_formset + '"]').val(value.logic)

        /*** append left condition ***/
        let left_cond = `parameter-${elm_idx}-left_cond`
        if (value.hasOwnProperty('left_cond') && value.left_cond)
            $elm_cond.find('select[name="' + left_cond + '"]').val(value.left_cond)

        /*** append left condition ***/
        let math = `parameter-${elm_idx}-math`
        if (value.hasOwnProperty('math') && value.math)
            $elm_cond.find('select[name="' + math + '"]').val(value.math)

        /*** append left condition ***/
        let right_cond = `parameter-${elm_idx}-right_cond`
        if (value.hasOwnProperty('right_cond') && value.right_cond)
            $elm_cond.find('select[name="' + right_cond + '"]').val(value.right_cond)
    }
    loopData(data_list=[], elm_form=null){
        this.cleanFormset(elm_form)
        for (let idx = 0; idx < data_list.length; idx++) {
            let item = data_list[idx];
            let is_eq = idx;
            if (idx > 0) is_eq = idx - 1
            /*** loop data list append to HTML ***/
            if (typeof item === 'object' && !Array.isArray(item) && Object.keys(item).length) {
                /*** add formset ***/
                elm_form.find('[data-formset-add]').trigger('click');
                let elm_subform = elm_form.find('[data-formset-body] [data-formset-form]').eq(is_eq).find('[data-subformset-prefix]');
                elm_subform.find('[data-subformset-add]').trigger('click');
                this.appendData(elm_subform, item, is_eq)
            }
            else if (Array.isArray(item) && item.length) {
                /*** add formset and add subformset ***/
                elm_form.find('[data-formset-add]').trigger('click');
                let elm_subform = elm_form.find('[data-formset-body] [data-formset-form]').eq(is_eq).find('[data-subformset-prefix]');
                for (let idx_child = 0; idx_child < item.length; idx_child++){
                    let child = item[idx_child];
                    if (typeof child === 'object' && !Array.isArray(child) && Object.keys(child).length){
                        let child_eq = idx_child
                        if (idx_child > 0) child_eq = idx_child - 1
                        elm_subform.find('[data-subformset-add]').trigger('click');
                        let subform_text = elm_subform.find('[data-subformset-body]').children('.formset').last().find('input[type="number"]').attr('name');
                        let reorder_idx = subform_text.split('-')
                        this.appendData(elm_subform, child, child_eq, parseInt(reorder_idx[1]))
                    }
                    else{
                        let logic_formset = `-${idx_child}-type`;
                        elm_subform.find('select[name*="' + logic_formset + '"]').val(child)
                    }
                }
            }
            else {
                /*** item is string and item is prev logic of formset
                 add logic to prev item ***/
                let logic_formset = `-${is_eq}-logic`;
                elm_form.find('select[name*="' + logic_formset + '"]').val(item)
            }
            // });
        }
    }
    loadCondition(element_formset= null, data_condition = []) {
        // this.cleanFormset(element_formset)
        if (element_formset){
            let data_condition_temp;
            if (!Array.isArray(data_condition)) {
                /*** check if data not array format ***/
                let repalceBoolean = data_condition.replaceAll("False", "false").replaceAll("True", "true");
                let repalceSlash = repalceBoolean.replaceAll(/"'"/g, '').replaceAll(/'/g, '"').replaceAll("None", '""');
                data_condition_temp = JSON.parse(repalceSlash);
            }
            else data_condition_temp = data_condition;
            this.loopData(data_condition_temp, element_formset);
        }
    }
    // init formset for condition
    // run formset when page loaded
    // init sub formset when user click add formset
    init() {
        let formelm = $('[data-formset-prefix]');
        let form_opt =
            {
                form: '[data-formset-form]',
                emptyForm: '[data-formset-empty-form]',
                body: '[data-formset-body]',
                add: '[data-formset-add]',
                deleteButton: '[data-formset-delete]',
                moveUpButton: '[data-formset-move-up]',
                moveDownButton: '[data-formset-move-down]',
                prefix: 'formset-prefix'
            }
        let sub_form_opt =
            {
                form: '[data-subformset-form]',
                emptyForm: '[data-subformset-empty-form]',
                body: '[data-subformset-body]',
                add: '[data-subformset-add]',
                deleteButton: '[data-subformset-delete]',
                moveUpButton: '[data-subformset-move-up]',
                moveDownButton: '[data-subformset-move-down]',
                prefix: 'subformset-prefix'
            }

        if (formelm.length) {
            formelm.each(function (idx,elm) {
                let $this = $(elm)
                $this.formset(form_opt);
                // init sub formset
                let isAvailable = setInterval(function(){
                    if ($this.find('[data-subformset-prefix]')){
                        $this.find('[data-subformset-prefix]').formset(sub_form_opt);
                        // $this.find('[data-subformset-prefix] [data-subformset-add]').trigger('click');
                        clearInterval(isAvailable)
                    }
                }, 200);
            });

            // init action button sub formset when click add new formset
            $('[data-formset-add]').on('click', function () {
                let $this = $(this).data('formset-add');
                let $elm = $('[data-formset-prefix="' + $this + '"]')
                $elm.find('[data-subformset-prefix]').formset(sub_form_opt);
                // $elm.find('[data-subformset-prefix] [data-subformset-add]').trigger('click');
            });
        }

    };
}

// init field element went add new condition
jQuery.fn.renderFormElements = function (arg) {
    return arg
}