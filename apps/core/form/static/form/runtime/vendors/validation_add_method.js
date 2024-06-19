(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "./jquery.validate"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
}(function ($) {
    // call check another rule prefix data-valid-* when valid was called
    $.validator.unpretentious = function (frm$) {
        let validator = $(frm$).validate();

        $(frm$).find(':input').each(function () {
            let attributes = $(this)[0].attributes;
            let name = $(this).attr('name');
            Object.keys(attributes).map(key => {
                let data = attributes[key];
                if (data.name.startsWith('data-valid-')) {
                    let ruleKey = data.name.replace('data-valid-', '');
                    ruleKey = ruleKey.toLowerCase().replaceAll('-', '_').trim();
                    if ($.validator.methods.hasOwnProperty(ruleKey)) {
                        if (!validator.settings.rules.hasOwnProperty(name)) validator.settings.rules[name] = {};
                        if (!validator.settings.rules[name].hasOwnProperty(ruleKey)) {
                            validator.settings.rules[name][ruleKey] = data.value;
                        }
                    }
                }
            })
        })
    }

    function checkBase(value, element, callback) {
        // get rules field
        let rules = this.settings.rules?.[$(element).attr('name')] || null;
        if (!value) {
            // allow empty
            if (!$(element).attr('required')) return true;
            // check rule
            if (typeof rules === 'object' && rules.hasOwnProperty('required')) {
                if (rules['required'] !== true) return true;
            }
        }
        if (callback instanceof Function) return callback.bind(this)(rules);
        return true;
    }

    $.validator.addMethod(
        "phone".toLowerCase(),
        function (value, element) {
            return checkBase.bind(this)(value, element, function (rules) {
                let regexStr = /^[0-9]*$/gm;
                const regionParent$ = $(element).siblings('.data-phone-region-parent');
                if (regionParent$.length > 0) {
                    const region$ = regionParent$.find('select.data-phone-region');
                    if (region$.length > 0 && region$.is('select')) {
                        if (rules.hasOwnProperty("phone".toLowerCase())) {
                            switch (region$.val()) {
                                case '1':
                                    regexStr = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;
                                    break
                                case '7':
                                    regexStr = /^[0-9]{10}$/gm;
                                    break
                                case '33':
                                    regexStr = /^[0-9]{9}$/gm;
                                    break
                                case '34':
                                    regexStr = /^[0-9]{9}$/gm;
                                    break
                                case '39':
                                    regexStr = /^[0-9]{6,11}$/gm;
                                    break
                                case '44':
                                    regexStr = /^[0-9]{7,10}$|^[0-9]{12}$/gm;
                                    break
                                case '49':
                                    regexStr = /^[0-9]{6,13}$/gm;
                                    break
                                case '52':
                                    regexStr = /^[0-9]{10,12}$/gm;
                                    break
                                case '54':
                                    regexStr = /^[0-9]{10}$/gm;
                                    break
                                case '55':
                                    regexStr = /^[0-9]{10,11}$/gm;
                                    break
                                case '57':
                                    regexStr = /^[0-9]{8,10}$/gm;
                                    break
                                case '61':
                                    regexStr = /^[0-9]{5,15}$/gm;
                                    break
                                case '62':
                                    regexStr = /^[0-9]{5,10}$/gm;
                                    break
                                case '64':
                                    regexStr = /^[0-9]{3,10}$/gm;
                                    break
                                case '66':
                                    regexStr = /(^[0-9]{8}$|^[0-9]{9}$)/gm;
                                    break
                                case '81':
                                    regexStr = /^[0-9]{5,13}$/gm;
                                    break
                                case '82':
                                    regexStr = /^[0-9]{8,11}$/gm;
                                    break
                                case '84':
                                    regexStr = /^((\+84)|0)([35789]|1[2389])([0-9]{8})$/gm;
                                    break
                                case '86':
                                    regexStr = /^[0-9]{5,12}$/gm;
                                    break
                                case '91':
                                    regexStr = /^[0-9]{7,10}$/gm;
                                    break
                            }
                        }
                    }
                }
                if (regexStr) return new RegExp(regexStr).test(value);
                return false;
            });
        },
        (params, element) => $.validator.format(
            $.validator.messages?.["phone_vn"] || "Please enter a valid phone number.",
            params
        )
    );

    $.validator.addMethod(
        "counterWordsMax".toLowerCase(),
        function (value, element) {
            return checkBase.bind(this)(value, element, function (rules) {
                let inpValue = $(element).val();
                let wordCount = inpValue ? inpValue.split(" ").length : 0;
                return value ? parseInt(rules["counterWordsMax".toLowerCase()]) >= parseInt(wordCount) : true;
            });
        },
        (params, element) => $.validator.format(
            $.validator.messages?.["counterWordsMax"] || "The field has exceeded the word count with {0}.",
            params
        )
    );

    $.validator.addMethod(
        "counterWordsMin".toLowerCase(),
        function (value, element) {
            return checkBase.bind(this)(value, element, function (rules) {
                let inpValue = $(element).val();
                let wordCount = inpValue ? inpValue.split(" ").length : 0;
                return value ? parseInt(rules["counterWordsMin".toLowerCase()]) <= parseInt(wordCount) : true;
            });
        },
        (params, element) => $.validator.format(
            $.validator.messages?.["counterWordsMin"] || "The field has not reached the minimum word count with {0}.",
            params
        )
    );

    $.validator.addMethod(
        "allow_emailDomainValidation".toLowerCase(),
        function (value, element) {
            return checkBase.bind(this)(value, element, function (rules) {
                const inpValue = $(element).val();
                const inpValueArr = inpValue.split("@");
                if (inpValueArr.length >= 2) {
                    const inpValueCompare = inpValueArr[inpValueArr.length - 1];
                    const configValid = rules["allow_emailDomainValidation".toLowerCase()];
                    const arrData = configValid.split(",").map(item => item.trim());

                    if (inpValue) return arrData.indexOf(inpValueCompare) !== -1;
                    return true;
                }
                return false;
            });
        },
        (params, element) => $.validator.format(
            $.validator.messages?.["allow_emailDomainValidation"] || "The domain name is not supported.",
            params
        )
    );
    $.validator.addMethod(
        "restrict_emailDomainValidation".toLowerCase(),
        function (value, element) {
            return checkBase.bind(this)(value, element, function (rules) {
                const inpValue = $(element).val();
                const inpValueArr = inpValue.split("@");
                if (inpValueArr.length >= 2) {
                    const inpValueCompare = inpValueArr[inpValueArr.length - 1];
                    const configValid = rules["restrict_emailDomainValidation".toLowerCase()];
                    const arrData = configValid.split(",").map(item => item.trim());

                    if (inpValue) return arrData.indexOf(inpValueCompare) === -1;
                    return true;
                }
                return false;
            });
        },
        (params, element) => $.validator.format(
            $.validator.messages?.["restrict_emailDomainValidation"] || "This domain is restricted.",
            params
        )
    );

    $.validator.addMethod(
        'numberType'.toLowerCase(),
        function (value, element) {
            return checkBase.bind(this)(value, element, function (rules) {
                const inpValue = $(element).val();
                if (inpValue) {
                    let inpNum = Number(inpValue);
                    if (isNaN(inpNum)) return false;
                    switch (rules['numberType'.toLowerCase()]) {
                        case 'int':
                            return Number.isInteger(inpNum);
                        case 'float':
                            try {
                                parseFloat(inpValue);
                                return true;
                            } catch (e) {
                                return false;
                            }
                    }
                }
                return true;
            });
        },
        (params, element) => {
            let msg = $.validator.messages?.["numberType"] || "This value type is incorrect.";
            switch (params) {
                case 'int':
                    msg = $.validator.messages?.["numberTypeInt"] || "This value should be of type integers.";
                    break
                case 'float':
                    msg = $.validator.messages?.["numberTypeFloat"] || "This value should be of type float.";
                    break
            }
            return $.validator.format(msg, params);
        }
    )
}));