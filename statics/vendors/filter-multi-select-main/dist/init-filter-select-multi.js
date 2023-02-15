$(document).ready(function () {
    /***
     * setup attribute in HTML:
     *
     * ***/
    // let $elements = document.querySelectorAll('.multi-select-filter');
    var $elements = document.querySelectorAll(".multi-select-filter");
    $elements.forEach(function (element, idx) {
        let url = $(element).attr('data-url');
        let first_data = $(element).attr('data-onload');
        let elm_name = $(element).attr('name');
        let isMulti = $(element).attr('data-multiple')
        $.fn.callAjax(url, 'get')
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $(element).text("");
                    if (data.hasOwnProperty('role_list') && Array.isArray(data.role_list)) {
                        if (isMulti === 'true') $(element).prop('multiple', true)
                        let temp = '';
                        data.role_list.map(function (item) {
                            if (first_data && first_data.indexOf(item.id) !== -1)
                                temp += `<option value="${item.id}" selected>${item.title}</option>`
                            else
                                temp += `<option value="${item.id}">${item.title}</option>`
                        })
                        $(element).append(temp)
                    }
                }

                $(element).filterMultiSelect({
                    // displayed when no options are selected
                    placeholderText: $(element).attr('data-placeholder'),

                });
                $(`#${$(element).attr('id')}`).attr('data-index', idx)
            })
    });
});