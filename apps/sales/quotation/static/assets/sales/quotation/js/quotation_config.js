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

        // Submit form config quotation + sale order
        $form.submit(function (e) {
            e.preventDefault()
            let _form = new SetupFormSubmit($(this));
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
                            $.fn.redirectUrl($(this).attr('data-url-redirect'), 3000);
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
                                                    <div class="row">
                                                        <div class="form-group">
                                                            <label class="form-label">Editor</label>
                                                            <textarea class="form-control" rows="2" cols="50" name="" id=""></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <ul class="nav nav-light nav-tabs">
                                                            <li class="nav-item">
                                                                <a class="nav-link active" data-bs-toggle="tab" href="#tab_indicator">
                                                                <span class="nav-link-text">Indicator</span>
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" data-bs-toggle="tab" href="#tab_param">
                                                                <span class="nav-link-text">Param</span>
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" data-bs-toggle="tab" href="#tab_function">
                                                                <span class="nav-link-text">Functions</span>
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" data-bs-toggle="tab" href="#tab_operator">
                                                                <span class="nav-link-text">Operators</span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                        
                                                        <div class="tab-content">
                                                            <div class="row tab-pane fade show active" id="tab_indicator">
                                                                <div class="row">
                                                                    <div class="col-4">
                                                                        <div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-200p position-relative overflow-y-scroll">
                                                                            <div class="row">
                                                                                <button type="button" class="btn btn-flush-light">
                                                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span>Revenue</span></span></div>
                                                                                    <input class="data-show" hidden>
                                                                                </button>
                                                                            </div>
                                                                            <div class="row">
                                                                                <button type="button" class="btn btn-flush-light">
                                                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span>Total Cost</span></span></div>
                                                                                </button>
                                                                            </div>
                                                                            <div class="row">
                                                                                <button type="button" class="btn btn-flush-light">
                                                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span>Gross Profit</span></span></div>
                                                                                </button>
                                                                            </div>
                                                                            <div class="row">
                                                                                <button type="button" class="btn btn-flush-light">
                                                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span>Pretax Amount</span></span></div>
                                                                                </button>
                                                                            </div>
                                                                            <div class="row">
                                                                                <button type="button" class="btn btn-flush-light">
                                                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span>Operating Expense</span></span></div>
                                                                                </button>
                                                                            </div>
                                                                            <div class="row">
                                                                                <button type="button" class="btn btn-flush-light">
                                                                                    <div class="float-left"><span><span class="icon mr-2"><span class="feather-icon"><i class="fa-solid fa-hashtag"></i></span></span><span>Net Income</span></span></div>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-8">
                                                                    <div data-simplebar class="nicescroll-bar h-200p">
                                                                        <div>
                                                                        <h5>Revenue</h5>
                                                                        <p>indicator revenue</p>
                                                                        <b>Syntax</b>
                                                                            <p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p>
                                                                        <b>Example</b>
                                                                            <p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p>
                                                                            <p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        <div class="row tab-pane fade" id="tab_param">
                                                            <div class="col-6">
                                                            </div>
                                                            <div class="col-6"></div>
                                                        </div>
                                                        <div class="row tab-pane fade" id="tab_function">
                                                            <div class="col-6">
                                                            </div>
                                                            <div class="col-6"></div>
                                                        </div>
                                                        <div class="row tab-pane fade" id="tab_operator">
                                                            <div class="col-6">
                                                                <div class="beauty_scroll h-250p">
                                                                <p class="white-space-wrap">
                                                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passageContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passageContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passageContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passageContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage
                                                                </p>
                                                                </div>
                                                            </div>
                                                            <div class="col-6"></div>
                                                        </div>
                                                        </div>
                                                    </div>
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
                            return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span></a>`
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
