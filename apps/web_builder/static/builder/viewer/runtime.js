(function ($) {
        $.fn.alterClass = function (removals, additions) {

            let self = this;

            if (removals.indexOf('*') === -1) {
                // Use native jQuery methods if there is no wildcard matching
                self.removeClass(removals);
                return !additions ? self : self.addClass(additions);
            }

            let patt = new RegExp('\\s' +
                removals.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') +
                '\\s', 'g');

            self.each(function (i, it) {
                let cn = ' ' + it.className + ' ';
                while (patt.test(cn)) {
                    cn = cn.replace(patt, ' ');
                }
                it.className = $.trim(cn);
            });

            return !additions ? self : self.addClass(additions);
        };
        $.fn.callAjaxPublic = function (settings) {
            return new Promise(function (resolve, reject) {
                let csrfToken = $("input[name=csrfmiddlewaretoken]").val();
                let url = settings?.['url'];
                let method = settings?.['method'] || 'GET';
                let data = settings?.['data'] || {};

                if (url && method) {
                    let ctx = {
                        url: url,
                        type: method, // dataType: 'json',
                        contentType: "application/json",
                        processData: true,
                        data: method === 'GET' ? '' : JSON.stringify(data),
                        headers: {
                            "X-CSRFToken": csrfToken,
                        },
                        success: function (rest, textStatus, jqXHR) {
                            resolve(rest);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            let resp_data = jqXHR.responseJSON;
                            if (resp_data && typeof resp_data === 'object') {
                                reject(resp_data);
                            } else if (jqXHR.status === 204) reject({'status': 204});
                        },
                    }
                    return $.ajax(ctx);
                }
                return null;
            })
        }
        $.fn.convertThousand = function (value) {
            let arr = [];
            let arrData = value.split("").reverse();
            arrData.map(
                (item, idx) => {
                    if (idx !== 0 && idx % 3 === 0 && idx !== arrData.length - 1) {
                        arr.push(".");
                        arr.push(item);
                    } else {
                        arr.push(item);
                    }
                }
            )
            return arr.reverse().join("");
        }
})(jQuery);