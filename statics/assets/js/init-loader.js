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
})