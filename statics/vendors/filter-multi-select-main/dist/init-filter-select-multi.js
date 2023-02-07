$(document).ready(function () {
    /***
     * setup attribute in HTML:
     * add class on DOM element "multi-select-filter"
     * add data attribute url:
     * add data attribute method:
     * example:
     * <select
     *    class="form-control multi-select-filter"
     *    data-placeholder="{% trans 'Choose' %}"
     *    name="role"
     *    id="select-box-role"
     *    data-url="{% url 'RoleListAPI' %}"
     *    data-method="GET">
     * </select>
     * ***/
    // let $elements = document.querySelectorAll('.multi-select-filter');
    var $elements = document.querySelectorAll(".multi-select-filter");
    $elements.forEach(function (element) {
        let url = $(element).attr('data-url');
        let method = $(element).attr('data-method');
        let first_data = $(element).attr('data-onload');
        $.fn.callAjax(url, method)
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $(element).text("");
                    if (data.hasOwnProperty('role_list') && Array.isArray(data.role_list)) {
                        $(element).prop('multiple', true)
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
                    // placeholderText: "nothing selected",

                });
            })
    });
});