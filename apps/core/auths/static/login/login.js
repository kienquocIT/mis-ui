class SetupFormSubmitLogin {
    constructor(formSelected, urlDefault = null, urlRedirectDefault = null, dataMethodDefault = null) {
        this.formSelected = formSelected;

        // URL call API
        this.dataUrl = formSelected.attr('data-url');
        if (!this.dataUrl) this.dataUrl = urlDefault ? urlDefault : window.location.pathname;

        // METHOD call API
        this.dataMethod = formSelected.attr('data-method');
        if (!this.dataMethod) {
            if (dataMethodDefault) {
                this.dataMethod = dataMethodDefault
            } else {
                throw ('Data Method do not support! It is ' + this.dataMethod);
            }
        }

        // URL REDIRECT after success callback
        this.dataUrlRedirect = formSelected.attr('data-url-redirect');
        if (!this.dataUrlRedirect) this.dataUrlRedirect = urlRedirectDefault ? urlRedirectDefault : null;

        // REDIRECT TIMEOUT
        this.dataRedirectTimeout = formSelected.attr('data-redirect-timeout');
        if (!this.dataRedirectTimeout) this.dataRedirectTimeout = this.dataRedirectTimeout ? this.dataRedirectTimeout : 1000;

        // Data body get from form input
        this.dataForm = $.fn.serializerObjectLogin(formSelected);

        // URL DETAIL
        this.dataUrlDetail = formSelected.attr('data-url-detail');
        if (!this.dataUrlRedirect) this.dataUrlRedirect = urlRedirectDefault ? urlRedirectDefault : null;
        if (this.dataUrlDetail) {
            this.dataUrlDetail = this.dataUrlDetail.split("/").slice(0, -1).join("/") + "/";
        }
    }

    getUrlDetail(pk) {
        if (this.dataUrlDetail && pk) {
            return this.dataUrlDetail + pk.toString();
        }
        return null;
    }

    static getUrlDetailWithID(url, pk) {
        url = url.split("/").slice(0, -1).join("/") + "/";
        if (url && pk) {
            return url + pk.toString();
        }
        return null;
    }
}

$.fn.extend({
    redirectUrlLogin: function (redirectPath, timeout = 0, params = '') {
        setTimeout(() => {
            if (params && (params !== '' && params !== undefined)) {
                window.location.href = redirectPath + '?' + params;
            } else {
                window.location.href = redirectPath;
            }
        }, timeout);
    },
    notifyBLogin: function (option, typeAlert = null) {
        setTimeout(function () {
            $('.alert.alert-dismissible .close').addClass('btn-close').removeClass('close');
        }, 100);
        let msg = "";
        if (option.title) {
            msg += option.title;
        }
        if (option.description) {
            let des_tmp = '';
            if (typeof option.description === 'string') {
                des_tmp = option.description;
            } else if (Array.isArray(option.description)) {
                des_tmp = option.description.join(", ");
            } else if (typeof option.description === 'object') {
                let des_tmp_arr = [];
                for (const [_key, value] of Object.entries(option.description)) {
                    des_tmp_arr.push(value);
                }
                des_tmp = des_tmp_arr.join(", ");
            } else {
                des_tmp = option.description.toString();
            }
            if (msg) {
                msg += ": " + des_tmp;
            } else {
                msg = des_tmp;
            }
        }
        let alert_config = {
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            },
            type: "dismissible alert-primary",
            z_index: 2147483647, /* Maximum index */
        }
        switch (typeAlert) {
            case 'success':
                alert_config['type'] = "dismissible alert-success";
                break
            case 'failure':
                alert_config['type'] = "dismissible alert-danger";
                break
            case 'warning':
                alert_config['type'] = "dismissible alert-warning";
                break
            case 'info':
                alert_config['type'] = "dismissible alert-info";
                break
        }
        $.notify(msg, alert_config);
    },
    serializerObjectLogin: function (formSelected) {
        return formSelected.serializeArray().reduce((o, kv) => ({
            ...o,
            [kv.name]: kv.value
        }), {});
    },
    showLoadingLogin: function (timeout) {
        $('#loadingContainer').removeClass('hidden');
        if (timeout) {
            setTimeout($.fn.hideLoadingLogin, (timeout > 100 ? timeout : 1000));
        }
    },
    hideLoadingLogin: function () {
        setTimeout(() => {
            $('#loadingContainer').addClass('hidden');
        }, 250,)
    },
    callAjaxLogin: function (url, method, data = {}, csrfToken = null, headers = {}, content_type = "application/json") {
        return new Promise(function (resolve, reject) {
            // Setup then Call Ajax
            let ctx = {
                url: url,
                type: method,
                dataType: 'json',
                contentType: content_type,
                data: content_type === "application/json" ? JSON.stringify(data) : data,
                headers: {
                    "X-CSRFToken": (csrfToken === true ? $("input[name=csrfmiddlewaretoken]").val() : csrfToken), ...headers
                },
                success: function (rest, textStatus, jqXHR) {
                    resolve(rest);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(jqXHR.responseJSON);
                },
            };
            if (method.toLowerCase() === 'get') ctx.data = data
            $.ajax(ctx);
        });
    },

})