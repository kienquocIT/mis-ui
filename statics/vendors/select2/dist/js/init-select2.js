"use strict";
/***
 * init dropdown with select2
 * @required_html_data:
 * - class: dropdown-select_two
 * - data: -multiple="true" => set combobox is multiple
 *         -prefix="application_property_list" => object key of response return
 *         -url="{% url 'ApplicationPropertyListAPI' %}"
 *         -params="{name: value}"
 *         -onload={id="", title="asdad"}
 * handle event on change example:
 *     selectbox.on("select2:select", function (e) {
 *          // do action here
 *          console.log(e.params.data)
 *     });
 *     @variable e.params.data: full data of select store
 * @param selectBoxElement: element of select
 */

function initSelectbox(selectBoxElement = null) {
    let $select_box = selectBoxElement
    if (selectBoxElement === null)
        $select_box = $(".dropdown-select_two");

    $select_box.each(function () {
        let $this = $(this)

        // check if element has default data
        let default_data = $this.attr('data-onload')
        if (default_data && default_data.length) {
            if (typeof default_data === 'string') {
                try {
                    default_data = JSON.parse(default_data)
                } catch (e) {
                    console.log('Warning: ', $this.attr('id'), ' parse data onload is error with this error', e)
                }
            }
            if (default_data){
                if (Array.isArray(default_data)){
                    let htmlTemp = ''
                    for (let item of default_data){
                        htmlTemp += `<option value="${item.id}" selected>${item.title}</option>`
                    }
                    $this.html(htmlTemp)
                }
                else $this.html(`<option value="${default_data.id}" selected>${default_data.title}</option>`)
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
                            let text = 'title';
                            if ($this.attr('data-format')){
                                text = $this.attr('data-format')
                            }else{
                                if(item.hasOwnProperty('full_name')) text = 'full_name';
                            }
                            try{
                                if (default_data && default_data.hasOwnProperty('id')
                                    && default_data.id === item.id
                                )
                                    data_convert.push({...item, 'text': item[text], 'selected': true})
                                else data_convert.push({...item, 'text': item[text]})

                            }
                            catch (e) {
                                console.log(e)
                            }
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
