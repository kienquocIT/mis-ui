"use strict";

/***
 * init dropdown with select2
 * @required_html_data:
 * - class: dropdown-select_two
 * - data: multiple="true" => set combobox is multiple
 *         prefix="application_property_list" => object key of response return
 *         url="{% url 'ApplicationPropertyListAPI' %}" => UI url
 *         params="{name: value}"
 * handle event on change example:
 *     selectbox.on("select2:select", function (e) {
 *          // do action here
 *          console.log(e.params.data)
 *     });
 *     @params selectbox: element of select
 *     @variable e.params.data: full data of select store
 */
function initSelectbox(selectBoxElement = null) {
    let $select_box = selectBoxElement
    if (selectBoxElement === null)
        $select_box = $(".dropdown-select_two");

    $select_box.each(function (e) {
        let $this = $(this)

        // check if element has default data
        let default_data = $this.attr('data-onload')
        if (default_data && default_data.length) {
            let temp = []
            if (typeof default_data === 'string') {
                try {
                    default_data = JSON.parse(default_data)
                } catch (e) {
                    console.log('Warning: ', $this.attr('id'), ' parse data onload is error with this error', e)
                }
            }
            if (Object.keys(default_data).length !== 0) {
                for (let item of default_data) {
                    if (item.id)
                        temp.push(item.id)
                    else temp.push(item)
                }
                default_data = temp
            }
        }
        let $thisURL = $this.attr('data-url')
        // init select2
        let options = {
            ajax: {
                url: $thisURL,
                data: function (params) {
                    let query = params
                    query['is_ajax'] = true
                    if ($this.attr('data-params')) {
                        let data_params = JSON.parse($this.attr('data-params'));
                        query = {...query, ...data_params}
                    }
                    return query
                },
                processResults: function (res) {
                    let data_original = res.data[$this.attr('data-prefix')];
                    let data_convert = []
                    if (data_original.length) {
                        for (let item of data_original) {
                            if (default_data && default_data.includes(item.id))
                                data_convert.push({...item, 'text': item.title, 'selected': true})
                            else data_convert.push({...item, 'text': item.title})
                        }
                        if ($this.attr('data-virtual') !== undefined
                            && $this.attr('data-virtual') !== ''
                            && $this.attr('data-virtual') !== "[]")
                            data_convert.push(JSON.parse($this.attr('data-virtual')))
                    }
                    return {
                        results: data_convert
                    };
                }
            },
            multiple: false,
            tags:false

        }
        if ($this.attr('data-multiple') !== 'false'){
            options['multiple'] = true
            options['tags'] = true
            $this.prop('multiple', true)
        }
        $this.select2(options)
    });
}

$(document).ready(function () {
    initSelectbox()
});
