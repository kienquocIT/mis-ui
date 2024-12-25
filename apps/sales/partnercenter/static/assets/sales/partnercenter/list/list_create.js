$(document).ready(function () {
    const COMPARE_OPERATOR = {
        "string": [
            {id: 'is', title: 'IS'},
            {id: 'is not', title: 'IS NOT'},
            {id: 'contains', title: 'CONTAINS'},
            {id: 'does not contain', title: 'DOES NOT CONTAIN'},
        ],
        "math": [
            {id: '<', title: '<'},
            {id: '>', title: '>'},
            {id: '<=', title: '&le;'},
            {id: '>=', title: '&ge;'},
            {id: '#', title: '&ne;'},
            {id: '=', title: '='}
        ]
    }
    let dataObjAppCurrID = ''
    let $eleUrl = $('#app-url-factory');
    let appMapMasterDatas = {
        "saledata.product": {
            "url": $eleUrl.attr('data-md-product'),
            "keyResp": "product_list",
            "keyText": "full_name"
        },
        "saledata.producttype": {
            "url": $eleUrl.attr('data-md-product-type'),
            "keyResp": "product_type_list",
            "keyText": "full_name"
        },
        "saledata.expense": {
            "url": $eleUrl.attr('data-md-labor'),
            "keyResp": "expense_list",
            "keyText": "full_name"
        },
        "saledata.expenseitem": {
            "url": $eleUrl.attr('data-md-expense-item'),
            "keyResp": "expense_item_list",
            "keyText": "full_name"
        },
        "hr.employee": {
            "url": $eleUrl.attr('data-md-employee'),
            "keyResp": "employee_list",
            "keyText": "full_name"
        }
    }
    let formSubmit = $('#form_partnercenter_list_create')

    function loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
        let opts = {'allowClear': isClear};
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }
        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    }

    $('#btn-add-new-cond-grp').on('click', function () {
        const $filterGroupArea = $('#filter-cond-area');
        let applicationPropertyListAPIUrl = $eleUrl.attr('data-md-prop-list')
        // Add "OR" text
        const ORRow = `
            <div class="row my-4">
                <div class="col-12">
                    <div class="fs-2 text-center">OR</div>
                </div>
            </div>
        `;
        $filterGroupArea.append(ORRow);

        // Add new filter row
        const newFilterCard = `
            <div class="card">
                <div class="card-header">
                   Filter group
                </div>
                <div class="card-body filter-group-body" >
                    <div class="filter-row">
                        <div class="row">
                            <div class="col-3">
                                <div class="form-group">
                                    <select name="left" class="form-select select2 select-prop" data-method="GET" data-url="${applicationPropertyListAPIUrl}" data-keyResp="application_property_list" required></select>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="form-group">
                                    <select name="operator" class="form-select select2 select-operator" required></select>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="form-group">
                                    <select name="right" class="form-select select2 select-prop-data" data-method="GET" required></select>
                                </div>
                            </div>
                            <div class="col-1">
                                <div class="d-flex justify-content-center">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title=""><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-outline-primary btn-add-new-cond" >
                        <span>
                            <span class="icon"><i class="fa-solid fa-plus"></i></span>
                            <span>And</span>
                        </span>
                    </button>
                </div>
            </div>
        `;
        let $newFilterCard = $(newFilterCard)
        $filterGroupArea.append($newFilterCard);
        $newFilterCard.find('.select-prop').each(function () {
            let $selectElement = $(this);
            loadInitS2($selectElement, [], {'application': dataObjAppCurrID});
        })
    })

    $(document).on('click', '.btn-add-new-cond', function () {
        const $filterGroupBody = $(this).closest('.card').find('.filter-group-body');
        let applicationPropertyListAPIUrl = $eleUrl.attr('data-md-prop-list')
        // Add new filter row
        const newFilterRow = `
            <div class="filter-row">
                <div class="row mb-2">
                    <div class="col-12">
                        AND
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        <div class="form-group">
                            <select name="left" class="form-select select2 select-prop" data-method="GET" data-url="${applicationPropertyListAPIUrl}" data-keyResp="application_property_list" required></select>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <select name="operator" class="form-select select2 select-operator" required></select>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <select name="right" class="form-select select2 select-prop-data" data-method="GET" required></select>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="d-flex justify-content-center">
                            <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title=""><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const $newFilterRow = $(newFilterRow);
        $filterGroupBody.append($newFilterRow);

        // Initialize only the `.select-prop` and `.select-prop-data` within the new row
        $newFilterRow.find('.select-prop').each(function () {
            loadInitS2($(this), [], {'application': dataObjAppCurrID});
        });
    });

    $(document).on('click', '.del-row', function () {
        const $currentRow = $(this).closest('.filter-row');
        const $currentCardBody = $currentRow.closest('.card-body')
        if ($currentCardBody.children().length === 1) {
            $currentCardBody.closest('.card').remove()
        }
        $currentRow.remove()
    });

    function loadDataObject() {
        $.fn.callAjax2({
            url: $eleUrl.data('md-data-obj'),
            method: 'GET'
        }).then((resp) => {
            const data = $.fn.switcherResp(resp);
            console.log(data);
            const dataObjListData = data?.['data_object_list'];
            let $dataObjArea = $('#data-object-area');

            if (dataObjListData) {
                for (let item of dataObjListData) {
                    $dataObjArea.append(`
                        <div class="col-2 mb-1">
                            <div class="form-check">
                                <div class="chip chip-outline-primary chip-lg">
                                    <input name="data_object" type="checkbox" class="data-obj-checkbox" data-app-id="${item?.['application_id']}">
                                    <span><span class="chip-text">${item?.['title']}</span></span>
                                </div>
                            </div>
                        </div>
                    `);
                }
            }
        });
    }

    loadDataObject()

    $(document).on('click', '.data-obj-checkbox', function () {
        $('.data-obj-checkbox').not(this).prop('checked', false);
        dataObjAppCurrID = $(this).data('app-id')
        console.log(dataObjAppCurrID)
        $('.select-prop').each(function () {
            let $selectElement = $(this);
            $selectElement.select2('destroy');
            loadInitS2($selectElement, [], {'application': dataObjAppCurrID});
        })
    })

    $(document).on('change', '.select-prop', function () {
        let data = SelectDDControl.get_data_from_idx($(this), $(this).val());
        if (data) {
            if (data?.['content_type']) {
                console.log(data?.['content_type'])
                let content_type = data?.['content_type'].toLowerCase()
                $(this).closest('.filter-row').find('.select-prop-data').attr('data-url', appMapMasterDatas[content_type]?.['url']);
                $(this).closest('.filter-row').find('.select-prop-data').attr('data-keyResp', appMapMasterDatas[content_type]?.['keyResp']);
                $(this).closest('.filter-row').find('.select-prop-data').attr('data-keyText', appMapMasterDatas[content_type]?.['keyText']);
                if (content_type === 'hr.employee') {
                    loadInitS2(
                        $(this).closest('.filter-row').find('.select-prop-data'),
                        [],
                        {},
                        null,
                        false,
                        {res1: "code", res2: "full_name"}
                    );
                } else {
                    loadInitS2(
                        $(this).closest('.filter-row').find('.select-prop-data')
                    );
                }
                if (data['type']) {
                    if (data['type'] === 6) {
                        loadInitS2(
                            $(this).closest('.filter-row').find('.select-operator'),
                            COMPARE_OPERATOR['math']
                        );
                    } else {
                        loadInitS2(
                            $(this).closest('.filter-row').find('.select-operator'),
                            COMPARE_OPERATOR['string']
                        );
                    }
                }
            }
        }

    })

    function setUpFormData(form){
        let filterCondition =[]
        $('.filter-group-body').each(function () {
            $(this).find('.filter-row').each(function () {
                filterCondition.push({
                    'left': $(this).find("select[name='left']").val(),
                    'operator': $(this).find("select[name='operator']").val(),
                    'right': $(this).find("select[name='right']").val()
                })
            })
        })
        form.dataForm['filter_condition'] = filterCondition


        form.dataForm['data_object'] = $("input[name='data_object']").prop('check', true).data('app-id')
    }

    let validator = SetupFormSubmit.call_validate(formSubmit, {
        onsubmit: true,
        submitHandler: function (form, event) {
            let _form = new SetupFormSubmit(formSubmit);
            setUpFormData(_form)
            console.log(_form)
        },
    })
})