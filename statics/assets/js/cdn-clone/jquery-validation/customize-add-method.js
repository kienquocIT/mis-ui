(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "./jquery.validate"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
}(function ($) {
    $.validator.unpretentious = function (frm$) {
        let validator = $(frm$).validate();

        $(frm$).find('input').each(function () {
            let ruleKey = [];
            let attributes = $(this)[0].attributes;
            let name = $(this).attr('name');
            Object.keys(attributes).map(key => {
                let data = attributes[key];
                if (data.name.startsWith('data-valid-')) {
                    let ruleKey = data.name.replace('data-valid-', '');
                    ruleKey = ruleKey.toLowerCase().replaceAll('-', '_').trim();
                    if ($.validator.methods.hasOwnProperty(ruleKey)) {
                        if (!validator.settings.rules.hasOwnProperty(name)) {
                            validator.settings.rules[name] = {}
                        }
                        if (!validator.settings.rules[name].hasOwnProperty(ruleKey)) {
                            validator.settings.rules[name] = {};
                            validator.settings.rules[name][ruleKey] = data.value;
                        }
                    }
                }
                ruleKey.push(attributes[key])
            })

            if (ruleKey.length > 0) {

            }
        })
    }

    $.validator.addMethod("check_phone_vn", function (value, element) {
        let ruleOfMethod = this.settings.rules?.[$(element).attr('name')] || null;
        if (typeof ruleOfMethod === 'object' && ruleOfMethod.hasOwnProperty('check_phone_vn')) {
            let valueOfMethod = ruleOfMethod['check_phone_vn'];
            let regexStr = valueOfMethod && valueOfMethod !== 'true' ? valueOfMethod : /^((\+84)|0)([35789]|1[2389])([0-9]{8})$/gm;
            let regex = new RegExp(regexStr);
            return regex.test(value);
        }
        // outside case because The rules was removed
        return true;
    }, $.validator.messages?.["check_phone_vn"] || "Please enter a valid phone number.");
}));