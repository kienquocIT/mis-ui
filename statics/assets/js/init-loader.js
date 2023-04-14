$(document).ready(function () {
    class ValidateDataResp {
        constructor(obj, schema) {
            this.errs = {};
            this.obj = obj;
            this.schema = schema;
        }

        get_key(parent_key, key) {
            return parent_key ? parent_key + '__' + key : key;
        }

        append_errs(obj, schema, key) {
            if (typeof schema === 'function') {
                this.errs[key] = {
                    'type': [typeof obj, schema.name], 'value': [obj, schema],
                }
            } else {
                this.errs[key] = {
                    'type': [typeof obj, typeof schema], 'value': [obj, schema],
                }
            }

        }

        validate(obj, schema, parent_key = '') {
            if (typeof obj === 'object') {
                return Object.keys(schema).every(k => this.validate(obj[k], schema[k], this.get_key(parent_key, k)));
            } else {
                if (obj?.constructor !== schema) {
                    this.append_errs(obj, schema, parent_key);
                    return false
                } else {
                    return true
                }
            }
        }

        valid() {
            let state = this.validate(this.obj, this.schema);
            return {'state': state, 'errors': this.errs}
        }
    }

    const OBJECT_SCHEMA = {
        "uuid": {
            "value": String, "type": String, "id": String
        }, "rate": {
            "value": Number, "type": String
        }
    }
    let testObj = {
        "uuid": {
            "value": "5481da7-8b7-22db-d326-b6a0a858ae2f", "type": "id"
        }, "rate": {
            "value": 0.12, "type": "percent"
        }
    }
    // new ValidateDataResp(testObj, OBJECT_SCHEMA).valid();


    // Submit support on listen from button
    $('.btn_support_submit').click(function (e) {
        let frm_id = $(this).attr('data-form-id');
        if (frm_id) {
            $('#' + frm_id).submit();
        }
    });


    $('#btn-call-switch-company').click(function () {
        let current_company_id = $('#company-current-id').attr('data-id');
        let company_id_selected = $("input[name='switch_current_company']:checked").val();
        if (current_company_id !== company_id_selected) {
            $.fn.callAjax($(this).attr('data-url'), $(this).attr('data-method'), {
                'company': company_id_selected
            }, $('input[name=csrfmiddlewaretoken]').val(),).then((resp) => {
                $.fn.notifyB({
                    'description': resp.data.detail
                }, 'success');
                setTimeout(() => {
                    $('#link-logout')[0].click();
                }, 1200);
            });
        }
        $('#switchMyCompany').modal('toggle');
    });

    $.fn.classOfPlan = (code) => {
        let classPlan = {
            'e-office': 'primary', 'hrm': 'success', 'personal': 'info', 'sale': 'danger'
        }
        if (code) {
            return classPlan[code] ? classPlan[code] : 'primary'
        }
        return classPlan
    }
})