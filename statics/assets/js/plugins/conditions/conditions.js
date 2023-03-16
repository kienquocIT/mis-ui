class Conditions {
    constructor() {
    }

    /***
     * handle action click button of formset
     * @param elm_target element of action on click
     * @param elm_focus element store data serializer, if null function return array instead
     * @param element_formset element of formset. for loop get data purpose
     * @param {dropdown_list:string} data
     * @constructor
     */
    ElementAction(elm_target = null, elm_focus = null, element_formset = null) {
        if (elm_target && element_formset) elm_target.on('click', function (e) {
            e.preventDefault();
            let result = []
            element_formset.find('[data-formset-body] [data-formset-form]').each(function (idx, item) {
                /*** for loop in formset get list of condition ***/

                if (!$(item).attr('data-formset-form-deleted')) {
                    let formset_logic_temp = $(this).find('.formset-logic').val();
                    let sub_formset_temp = [];
                    $(item).find('[data-subformset-body] [data-subformset-form]').each(function () {
                        /*** for loop in sub formset get sub condition ***/
                        if (!$(this).attr('data-formset-form-deleted')) {
                            /*** get data form from sub-formset ***/
                            let left_cond = $(this).find('select[name*="-left_cond"]').val();
                            let operator = $(this).find('select[name*="-math"]').val();
                            let right_cond = $(this).find('[name*="-right_cond"]').val();
                            /*** push sub-formset to array temp ***/
                            sub_formset_temp.push({
                                left_cond: left_cond,
                                operator: operator,
                                right_cond: right_cond,
                                is_idx: parseInt($(this).find('[name*="ORDER"]').val()),
                            }, $(this).find('.subformset-logic').val())
                        }
                    });

                    /*** check if one condition convert to object else keep array ***/
                    if (sub_formset_temp.length === 2) result.push(sub_formset_temp[0], formset_logic_temp)
                    else result.push(sub_formset_temp, formset_logic_temp)
                }
            });
            let end_result = {
                node_in: parseInt(element_formset.parent('form').find('[name="node_in"]').val()),
                node_out: parseInt(element_formset.parent('form').find('[name="node_out"]').val()),
                condition: result,
            }

            // update condition for association data when edit condition, LHPHUC
            let key = element_formset.parent('form').find('[name="node_in"]').val() + "_" + element_formset.parent('form').find('[name="node_out"]').val();
            if (key && elm_focus) {
                let before_data = elm_focus.val();
                if (before_data) {
                    before_data = JSON.parse(before_data);
                    before_data[key] = end_result;
                    end_result = before_data
                } else {
                    let temp = {}
                    temp[key] = end_result;
                    end_result = temp
                }
                elm_focus.val(JSON.stringify(end_result))
            } else return end_result

        });
    }

    cleanFormset(element_formset = null) {
        element_formset.find('[data-formset-body]').empty()
    }

    // render data item to html
    appendData(form_elm = null, value = null, idx = 0, sub_idx_arr = 0) {
        let elm_idx = idx
        let $elm_cond = form_elm.find('[data-subformset-body]').children('.formset:not([data-formset-form-deleted])').eq(idx);
        if (sub_idx_arr !== 0) elm_idx = sub_idx_arr
        /*** append logic to html ***/
        let logic_formset = `condition-${elm_idx}-logic`;
        if (value.hasOwnProperty('logic_next') && value.logic)
            $elm_cond.find('select[name="' + logic_formset + '"]').val(value.logic)

        /*** append left condition ***/
        let left_cond = `parameter-${elm_idx}-left_cond`;
        if (value.hasOwnProperty('left_cond') && value.left_cond)
            $elm_cond.find('select[name="' + left_cond + '"]').val(value.left_cond)

        /*** append operator ***/
        let math = `parameter-${elm_idx}-math`;
        if (value.hasOwnProperty('math') && value.operator)
            $elm_cond.find('select[name="' + math + '"]').val(value.operator)

        /*** append left condition ***/
        let right_cond = `parameter-${elm_idx}-right_cond`;
        if (value.hasOwnProperty('right_cond') && value.right_cond)
            $elm_cond.find('select[name="' + right_cond + '"]').val(value.right_cond)
    }

    loopData(data_list = [], elm_form = null) {
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
                /*** add formset and add sub-formset ***/
                elm_form.find('[data-formset-add]').trigger('click');
                let elm_subform = elm_form.find('[data-formset-body] [data-formset-form]').eq(is_eq).find('[data-subformset-prefix]');
                for (let idx_child = 0; idx_child < item.length; idx_child++) {
                    let child = item[idx_child];
                    if (typeof child === 'object' && !Array.isArray(child) && Object.keys(child).length) {
                        let child_eq = idx_child
                        if (idx_child > 0) child_eq = idx_child - 1
                        elm_subform.find('[data-subformset-add]').trigger('click');
                        let subform_text = elm_subform.find('[data-subformset-body]').children('.formset').last().find('input[type="number"]').attr('name');
                        let reorder_idx = subform_text.split('-')
                        this.appendData(elm_subform, child, child_eq, parseInt(reorder_idx[1]))
                    } else {
                        let logic_formset = `-${idx_child}-type`;
                        elm_subform.find('select[name*="' + logic_formset + '"]').val(child)
                    }
                }
            } else {
                /*** item is string and item is prev logic of formset
                 add logic to prev item ***/
                let logic_formset = `-${is_eq}-logic`;
                elm_form.find('select[name*="' + logic_formset + '"]').val(item)
            }
            // });
        }
    }

    loadCondition(element_formset = null, data_condition = []) {
        // this.cleanFormset(element_formset)
        if (element_formset) {
            let data_condition_temp;
            if (!Array.isArray(data_condition)) {
                /*** check if data not array format ***/
                let replaceBoolean = data_condition.replaceAll("False", "false").replaceAll("True", "true");
                let replaceSlash = replaceBoolean.replaceAll(/"'"/g, '').replaceAll(/'/g, '"').replaceAll("None", '""');
                data_condition_temp = JSON.parse(replaceSlash);
            } else data_condition_temp = data_condition;
            this.loopData(data_condition_temp, element_formset);
        }
    }


    /*** init formset for condition
     * run formset when page loaded
     * init sub formset when user click add formset
     * handle click add formset and click add sub formset
     * handle delete formset and delete sub formset
     * ***/
    init() {
        let form_elm = $('[data-formset-prefix]');
        let form_opt = {
            form: '[data-formset-form]',
            emptyForm: '[data-formset-empty-form]',
            body: '[data-formset-body]',
            add: '[data-formset-add]',
            deleteButton: '[data-formset-delete]',
            moveUpButton: '[data-formset-move-up]',
            moveDownButton: '[data-formset-move-down]',
            prefix: 'formset-prefix'
        }
        let sub_form_opt = {
            form: '[data-subformset-form]',
            emptyForm: '[data-subformset-empty-form]',
            body: '[data-subformset-body]',
            add: '[data-subformset-add]',
            deleteButton: '[data-subformset-delete]',
            moveUpButton: '[data-subformset-move-up]',
            moveDownButton: '[data-subformset-move-down]',
            prefix: 'subformset-prefix'
        }

        if (form_elm.length) {
            form_elm.each(function (idx, elm) {
                let $this = $(elm)
                $this.formset(form_opt);
                // init sub formset
                let isAvailable = setInterval(function () {
                    if ($this.find('[data-subformset-prefix]')) {
                        $this.find('[data-subformset-prefix]').formset(sub_form_opt);
                        clearInterval(isAvailable)
                    }
                }, 200);
            });

            // init action button sub formset when click add new formset
            $('[data-formset-add]').on('click', function () {
                let $formset_name = $(this).data('formset-add');
                let $elm = $('[data-formset-prefix="' + $formset_name + '"]')
                $elm.find('[data-subformset-prefix]').formset(sub_form_opt);

                /*** validate logic condition each formset
                * @logic_rule: when user select logic, first logic condition will be applied for all logic after
                * @logic_on_change: when first logic change, all siblings logic change too
                 ***/
                let $formsetfirst = $elm.find('[data-formset-body] .formset:not([data-formset-form-deleted])').first()
                    .find('select[name*="-logic"]')
                $elm.find('[data-formset-body] .formset + .formset').find('select[name*="-logic"]')
                    .val($formsetfirst.val()).prop('disabled', true)

                $('[data-subformset-add]').on('click', function () {
                    let sub_formset_body = $(this).parent('[data-subformset-prefix]').find('[data-subformset-body]')
                    let elm_sub_formset_row = sub_formset_body.find('.formset:not([data-formset-form-deleted])').last();
                    let is_first = sub_formset_body.find('.formset:not([data-formset-form-deleted])').first()
                        .find('select[name*="-type"]')
                    sub_formset_body.find('.formset + .formset:not([data-formset-form-deleted])')
                        .find('select[name*="-type"]').val(is_first.val()).prop('disabled', true)

                    $('[data-subformset-delete]').on('click', function () {
                        $(this).parents('[data-subformset-body]').find('.formset:not([data-formset-form-deleted])')
                            .first().find('select[name*="-type"]').prop('disabled', false);
                    });
                    // call init select2 for left_cond
                    let left_cond = elm_sub_formset_row.find('[name*="-left_cond"]')
                    left_cond.attr('data-params', JSON.stringify({"application": $('#select-box-features').val()}))
                    initSelectbox(left_cond)

                    // datatype on change
                    left_cond.on("select2:select", function (e) {
                        // when select on change right condition will change with left data
                        let _data = e.params.data;
                        let _type = _data.type
                        let _code = _data.code
                        let properties = _data.properties;
                        let opt_select = '';
                        let dropdown = {};
                        let md_url = '',
                            md_multiple = false,
                            md_prefix = '';
                        let right_cond = $(this).parents('[data-subformset-form]').find('[name*="-right_cond"]')
                        if (Object.keys(properties).length !== 0 && Object.keys(properties).length !== -1){
                            if (properties.hasOwnProperty('data')){
                                for (let item of properties.data){
                                    opt_select += `<option value="${item.value}">${item.text}</option>`;
                                }
                            }
                            if (properties.hasOwnProperty('dropdown_list')){
                                dropdown = properties.dropdown_list
                                md_url = dropdown.url
                                md_prefix = dropdown.prefix
                                md_multiple = dropdown.multiple
                            }
                        }
                        let is_index = $(this).parents('[data-subformset-form]').index()

                        let html_temp = {
                            1: `<input class="form-control" type="${_type}" name="parameter-${is_index}-right_cond">`,
                            2: `<input class="form-control datetime_field" type="text" name="parameter-${is_index}-right_cond"/>`,
                            3: `<select class="form-select" name="parameter-${is_index}-right_cond">${opt_select}</select>`,
                            4: `<div class="form-check mt-2">
                            <input type="checkbox" class="form-check-input" id="${_code}-${is_index}" name="parameter-${is_index}-right_cond">
                            <label class="form-check-label" for="${_code}-${is_index}">${_data.title}</label></div>`,
                            5: `<select class="form-control dropdown-select_two" 
                            name="parameter-${is_index}-right_cond" data-multiple="${md_multiple}" 
                            data-prefix="${md_prefix}" data-url="${md_url}"></select>`,
                        }
                        // render html to column 3
                        if (_type === 2 || _type === 4 || _type === 6){
                            let int = _type === 6 ? 1 : _type
                            elm_sub_formset_row.find('.child-formset .flex-row').eq(2).html(html_temp[int])
                        }
                        else{
                            _data.selected = true
                            let virtual = {
                                "id": "default",
                                "text": "input type",
                                "title": "input type"
                            }
                            let params = JSON.stringify({
                                "application": $('#select-box-features').val(),
                                "type": _type,
                            })
                            right_cond.attr({
                                'data-virtual': JSON.stringify(virtual),
                                'data-params': params
                            })
                            if (right_cond[0].nodeName !== 'SELECT'){
                                let new_select = $(`<select name="${right_cond.attr('name')}" class="dropdown-select_two form-control"></select>`)
                                if (right_cond.parent().hasClass('form-check'))
                                    right_cond.parent().replaceWith(new_select)
                                else right_cond.replaceWith(new_select)

                            }
                            // get new element just replace
                            right_cond = $(this).parents('[data-subformset-form]').find('[name*="-right_cond"]')
                            right_cond.attr({
                                'data-virtual': JSON.stringify(virtual),
                                'data-onload': JSON.stringify([_data]),
                                'data-params': params,
                                'data-url': $(this).attr('data-url'),
                                'data-prefix': $(this).attr('data-prefix'),
                                'data-multiple': 'false'
                            })
                            initSelectbox(right_cond)
                            // on change right condition
                            right_cond.on("select2:select", function (e) {
                                const right_data = e.params.data;
                                if (right_data.type !== 5){
                                    let idx = right_data.type === 6 ? 1 : right_data.type
                                    if (right_data.id === 'default') idx = 1
                                    $(this).parent('.flex-row').html(html_temp[idx])
                                }
                                else if (right_data.type === 5){
                                    let textHtml = right_data.properties.dropdown_list;
                                    $(this).attr('data-virtual', false)
                                    $(this).attr('data-url', textHtml.url)
                                    $(this).attr('data-prefix', textHtml.prefix)
                                    $(this).attr('data-multiple', textHtml.multiple)
                                    $(this).select2('destroy')
                                    $(this).empty();
                                    initSelectbox($(this))
                                }
                            });
                        }
                        // append type of left_cond
                        let $input_type = $(`<input type="hidden" name="parameter-${is_index}-property_type">`);
                        $input_type.val(_type)
                        $(this).parent().append($input_type)
                        // re-init jquery for new html of column 3
                        if(_type === 2)
                            elm_sub_formset_row.find('.datetime_field').daterangepicker({
                            singleDatePicker: true,
                            timePicker: true,
                            showDropdowns: true,
                            minYear: 1901,
                            "cancelClass": "btn-secondary",
                            maxYear: parseInt(moment().format('YYYY'), 10)
                        });

                        // on change value left condition change dropdown math
                        changeParameter(_type, elm_sub_formset_row)
                    });

                });

                // handle event delete formset
                $('[data-formset-delete]').on('click', function () {
                    $(this).parents('[data-formset-body]').find('.formset:not([data-formset-form-deleted])').first()
                        .find('select[name*="-logic"]').prop('disabled', false);
                });
            });

        }

    };
}

// init field element went add new condition
jQuery.fn.renderFormElements = function (arg) {
    function changeComparisonOperator() {
        $('.formset-logic').on('change', function () {
            $(this).parents('[data-formset-body]').find('.formset + .formset .formset-logic').val(this.value);
        });
        $('.subformset-logic').on('change', function () {
            $(this).parents('[data-subformset-body]').find('.formset + .formset .subformset-logic').val(this.value)
        })
    }

    changeComparisonOperator();
    return arg
}

$(document).ready(function () {
    // declare and init condition component
    let condition = new Conditions();
    condition.init();

    // add action click for condition element in page
    let formset_cond = $('#formset-condition')
    condition.ElementAction($('#save-associate'), $('#node-associate'),formset_cond);

    // load condition when open page or open popup
    let data_cond = [];
    condition.loadCondition(formset_cond, data_cond)
});