$(document).ready(function () {

    let config = JSON.parse($('#id-config-data').text());

    let config_is_select_stage = config.is_select_stage;

    function sortStage(list_stage) {
        let object_lost = null;
        let delivery = null;
        let object_close = null;
        let list_result = []

        for (let i = 0; i < list_stage.length; i++) {
            if (list_stage[i].is_closed_lost) {
                object_lost = list_stage[i];
            } else if (list_stage[i].is_delivery) {
                delivery = list_stage[i];
            } else if (list_stage[i].is_deal_closed) {
                object_close = list_stage[i];
            } else {
                list_result.push(list_stage[i]);
            }
        }

        list_result.sort(function (a, b) {
            return a.win_rate - b.win_rate;
        });
        list_result.push(object_lost);
        list_result.push(delivery);
        list_result.push(object_close);

        return list_result
    }

    let list_stage = [];
    let dict_stage = {};

    function loadStage() {
        let ele = $('#div-stage');
        let method = ele.data('method');
        let url = ele.data('url');

        let html = $('#stage-hidden').html();
        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_config_stage')) {
                    list_stage = sortStage(data.opportunity_config_stage);
                    dict_stage = list_stage.reduce((obj, item) => {
                        obj[item.id] = item;
                        return obj;
                    }, {});

                    list_stage.map(function (item) {
                        ele.append(html);
                        let ele_last_stage = ele.find('.sub-stage').last();
                        ele_last_stage.attr('data-id', item.id);
                        ele_last_stage.find('.stage-indicator').text(item.indicator);
                        if (item.is_closed_lost) {
                            ele_last_stage.find('.dropdown').remove();
                            ele_last_stage.addClass('stage-lost')
                        }
                        if (item.is_deal_closed) {
                            ele_last_stage.find('.dropdown-menu').empty();
                            ele_last_stage.find('.dropdown-menu').append(
                                `<div class="form-check form-switch mb-1">
                                    <input type="checkbox" class="form-check-input" id="inputActive">
                                    <label for="inputActive" class="form-label">Close Deal</label>
                                </div>`
                            )
                        }
                    })
                }
            }
        })
    }

    loadStage();

    $(document).on('click', '.btn-go-to-stage', function () {
        if (config_is_select_stage) {
            if ($('#check-lost-reason').is(':checked') || $('.input-win-deal:checked').length > 0) {
                alert($('#deal-close-lost').text());
            } else {
                let stage = $(this).closest('.sub-stage');
                let index = stage.index();
                let ele_stage = $('#div-stage .sub-stage');
                $('.stage-lost').removeClass('bg-red-light-5');
                for (let i = 0; i <= ele_stage.length; i++) {
                    if (i <= index) {
                        if (!ele_stage.eq(i).hasClass('stage-lost'))
                            ele_stage.eq(i).addClass('bg-primary-light-5');
                    } else {
                        ele_stage.eq(i).removeClass('bg-primary-light-5');
                    }
                }
                $('#input-rate').val(dict_stage[stage.data('id')].win_rate);
                $('#rangeInput').val(dict_stage[stage.data('id')].win_rate);
            }
        } else {
            alert($('#not-select-stage').text());
        }
    })

    $(document).on('change', '#check-lost-reason', function () {
        if ($(this).is(':checked')) {
            let ele_stage_lost = $('.stage-lost')
            $('.sub-stage').removeClass('bg-primary-light-5');
            ele_stage_lost.addClass('bg-red-light-5');
            $('#input-rate').val(dict_stage[ele_stage_lost.data('id')].win_rate);
            $('#rangeInput').val(dict_stage[ele_stage_lost.data('id')].win_rate);
        }
    })

    $(document).on('change', '.input-win-deal', function () {
        if ($(this).is(':checked')) {
            $('.sub-stage').removeClass('bg-primary-light-5');
            $('.stage-lost').addClass('bg-red-light-5');
        }
    })
})