"use strict";
$(function () {
    /***
     * init dropdown with select2
     * @required_html_data:
     * - class: dropdown-select_two
     * - data: data-multiple="true" => set combobox is multiple
     *         data-prefix="application_property_list" => object key of response return
     *         data-url="{% url 'ApplicationPropertyListAPI' %}" => UI url
     *
     */
    $(document).ready(function () {

        // init select function applied
        let $select_box = $(".dropdown-select_two");

        $select_box.each(function(e){
            let $this = $(this)

            // check if element has default data
            let default_data = $this.attr('data-onload')
            if (default_data && default_data.length){
                let temp = []
                if (typeof default_data === 'string'){
                    try{
                        default_data = JSON.parse(default_data)
                    }catch (e) {
                        console.log('Warning: ', $this.attr('id'), ' parse data onload is error with this error', e)
                    }
                }
                if (Object.keys(default_data).length !== 0){
                    for (let item of default_data){
                        if (item.id)
                            temp.append(item.id)
                        else temp.append(item)
                    }
                    default_data = temp
                }
            }
            let $thisURL = $this.attr('data-url')
            // init select2
            $this.select2({
                ajax: {
                    url: $thisURL,
                    data: function (params) {
                        let query = params
                        if ($this.attr('data-params')){
                            let data_params = JSON.parse($this.attr('data-params'));
                            query = {...query,...data_params}
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
                        }
                        return {
                            results: data_convert
                        };
                    }
                },
                tags: true,
                multiple: $this.attr('data-prefix') ? $this.attr('data-prefix') : false,
                tokenSeparators: [',', ' ']
            })
        });
    });
});