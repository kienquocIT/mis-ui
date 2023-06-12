"use strict";

function loadConfig(data) {
    if (data.short_sale_config) {
        $('#is-choose-price-list')[0].checked = data.short_sale_config.is_choose_price_list;
        $('#is-input-price')[0].checked = data.short_sale_config.is_input_price;
        $('#is-discount-on-product')[0].checked = data.short_sale_config.is_discount_on_product;
        $('#is-discount-on-total')[0].checked = data.short_sale_config.is_discount_on_total;
    }
    if (data.long_sale_config) {
        $('#is-not-input-price')[0].checked = data.long_sale_config.is_not_input_price;
        $('#is-not-discount-on-product')[0].checked = data.long_sale_config.is_not_discount_on_product;
        $('#is-not-discount-on-total')[0].checked = data.long_sale_config.is_not_discount_on_total;
    }
}

function setupSubmit() {
    let result = {}
    result['short_sale_config'] = {
        'is_choose_price_list': $('#is-choose-price-list')[0].checked,
        'is_input_price': $('#is-input-price')[0].checked,
        'is_discount_on_product': $('#is-discount-on-product')[0].checked,
        'is_discount_on_total': $('#is-discount-on-total')[0].checked,
    }
    result['long_sale_config'] = {
        'is_not_input_price': $('#is-not-input-price')[0].checked,
        'is_not_discount_on_product': $('#is-not-discount-on-product')[0].checked,
        'is_not_discount_on_total': $('#is-not-discount-on-total')[0].checked,
    }
    return result
}

$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_config_create');

        // call ajax get info quotation config detail
        $.fn.callAjax($form.data('url'), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    loadConfig(data)
                }
            }
        )

        // enable edit
        $('#btn-edit_quotation_config').on('click', function () {
            $(this)[0].setAttribute('hidden', true)
            $('#btn-create_quotation_config')[0].removeAttribute('hidden');
            $form.find('.disabled-but-edit').removeAttr('disabled');
        });

        // Submit form quotation + sale order
        $('#btn-create_quotation_config').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('frm_quotation_config_create');
            let _form = new SetupFormSubmit($('#frm_quotation_config_create'));
            let dataSubmit = setupSubmit();
            if (dataSubmit) {
                _form.dataForm['short_sale_config'] = dataSubmit.short_sale_config;
                _form.dataForm['long_sale_config'] = dataSubmit.long_sale_config;
            }
            let submitFields = [
                'short_sale_config',
                'long_sale_config',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }

            let csr = $("[name=csrfmiddlewaretoken]").val()
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });


        // TAB INDICATOR
        function loadIndicatorDbl() {
            let $table = $('#table_indicator_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('quotation_indicator_list')) {
                            return resp.data['quotation_indicator_list'] ? resp.data['quotation_indicator_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columnDefs: [
                    {
                        "width": "10%",
                        "targets": 0
                    }, {
                        "width": "35%",
                        "targets": 1
                    }, {
                        "width": "10%",
                        "targets": 2
                    }, {
                        "width": "35%",
                        "targets": 3
                    }, {
                        "width": "10%",
                        "targets": 4
                    }
                ],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            return `<span>${row.order}</span>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            return `<span>${row.title}</span>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<i 
                                        class="fa-regular fa-pen-to-square"
                                        data-bs-toggle="modal"
                                        data-bs-target="#indicatorEditModalCenter"
                                    ></i>
                                    <div
                                            class="modal fade" id="indicatorEditModalCenter" tabindex="-1"
                                            role="dialog" aria-labelledby="indicatorEditModalCenter"
                                            aria-hidden="true"
                                    >
                                        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Edit Formula</h5>
                                                    <button
                                                            type="button" class="btn-close"
                                                            data-bs-dismiss="modal" aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                </div>
                                                <div class="modal-footer">
                                                    <button
                                                            type="button" class="btn btn-secondary"
                                                            data-bs-dismiss="modal"
                                                    >Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            return `<span>${row.description}</span>`
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            return `<i class="fa-regular fa-trash-can"></i>`
                        }
                    }
                ],
            });
        }

        $('#tab-indicator').on('click', function () {
            $('#table_indicator_list').DataTable().destroy();
            loadIndicatorDbl();
        })


    });
});
