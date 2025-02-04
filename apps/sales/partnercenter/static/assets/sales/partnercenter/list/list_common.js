class PartnerCenterListHandler {

    constructor(options) {
        this.COMPARE_OPERATOR_MAPPING = {
            1: [
                {id: 'exact', title: 'IS'},
                {id: 'notexact', title: 'IS NOT'},
                {id: 'icontains', title: 'CONTAINS'},
                {id: 'noticontains', title: 'DOES NOT CONTAIN'},
                {id: 'exactnull', title: 'IS EMPTY'},
                {id: 'notexactnull', title: 'IS NOT EMPTY'},
            ],
            5: [
                {id: 'notexact', title: 'IS NOT'},
                {id: 'exactnull', title: 'IS EMPTY'},
                {id: 'notexactnull', title: 'IS NOT EMPTY'},
                {id: 'exact', title: 'IS'},
            ],
            6: [
                {id: 'lt', title: '<'},
                {id: 'gt', title: '>'},
                {id: 'lte', title: '&le;'},
                {id: 'gte', title: '&ge;'},
                {id: 'notexact', title: '&ne;'},
                {id: 'exact', title: '='},
            ],
        }

        this.$eleUrl = $('#app-url-factory')
        this.CONTENT_TYPE_MAPPING_URL = {
            "hr.employee": {
                "url": $('#app-url-factory').data('md-employee'),
                "keyResp": "employee_list",
                "keyText": "title"
            },
            "saledata.contact": {
                "url": $('#app-url-factory').data('md-contact'),
                "keyResp": "contact_list",
                "keyText": "title"
            },
            "saledata.industry": {
                "url": $('#app-url-factory').data('md-industry'),
                "keyResp": "industry_list",
                "keyText": "title"
            },
            "opportunity.opportunityconfigstage": {
                "url": $('#app-url-factory').data('md-opp-config-stage'),
                "keyResp": "opp_config_stage_list",
                "keyText": "title"
            },
        }

        this.$formSubmit = $('#form_partnercenter_list')

        this.$dataObjArea = $('#data-object-area')
        this.$filterCondArea = $('#filter-cond-area')
        this.$listName = $('#list-name')

    }

    addEventBinding() {
        this.addNewCondGroupEventBinding()
        this.addNewCondEventBinding()
        this.delRowEventBinding()
        this.checkDataObjCheckboxEventBinding()
        this.changePropSelectValueEventBinding()
        this.changeOperatorSelectValueEventBinding()
    }

    fetchData(isDetail) {
            this.fetchDataObject()
                .then(()=>{
                    this.fetchDataDetail(isDetail);
                })
    }

    loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}, isMultiple = false) {
        const $selectedCheckbox = $("#data-object-area input[name='data_object']:checked");
        if ($selectedCheckbox.length > 0) {
            const appPropURL = this.$eleUrl.data('md-prop-list')
            $("select[name='left']").each(function () {
                $(this).attr('data-keyResp', 'application_property_list')
                $(this).attr('data-url', appPropURL)
            })

            let opts = {
                'allowClear': isClear,
            };
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
            this.addPropType($ele)
        } else {
            this.clearSelectEle()
        }
    }

    clearSelectEle() {
        $('#filter-cond-area select').each(function () {
            $(this).attr('data-keyResp', '')
            $(this).attr('data-url', '')
        })
    }

    addPropType($ele) {
        $ele.on('change', function () {
            let selectedData = $ele.select2('data')[0]?.data || {};
            if (selectedData.type) {
                $ele.attr('data-prop-type', selectedData.type);
            }
        });
    }

    addNewCondGroupEventBinding() {
        $(document).on('click', '#btn-add-new-cond-grp', () => {
            const appPropURL = this.$eleUrl.data('md-prop-list')

            const filterCardContainer = `
                <div class="filter-card">
                
                </div>`
            // Add "OR" text
            const ORRow = `
                <div class="row my-4 or-row">
                    <div class="col-12">
                        <div class="fs-2 text-center">OR</div>
                    </div>
                </div>
            `;
            const $filterCardContainer = $(filterCardContainer)
            if (this.$filterCondArea.find('.card').length > 0) {
                $filterCardContainer.append(ORRow);
            }

            // Add new filter row
            const newFilterCard = `
                <div class="card" >
                    <div class="card-header">
                       Filter group
                    </div>
                    <div class="card-body filter-group-body" >
                        <div class="filter-row">
                            <div class="row">
                                <div class="col-3">
                                    <div class="form-group">
                                        <select name="left" class="form-select select2 select-prop" data-method="GET" data-url="${appPropURL}" data-keyResp="application_property_list" required></select>
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
            $filterCardContainer.append($newFilterCard)

            $filterCardContainer.hide().appendTo(this.$filterCondArea)
            $filterCardContainer.fadeIn('slow')

            // init select2 for each left element
            $newFilterCard.find('.select-prop').each((id, e) => {
                let $selectElement = $(e);
                const currAppId = $("#data-object-area input[name='data_object']:checked").data('app-id')
                this.loadInitS2($selectElement, [], {'application': currAppId, 'is_filter_condition': true});
            })
        })
    }

    addNewCondEventBinding() {
        $(document).on('click', '.btn-add-new-cond', (e) => {
            const appPropURL = this.$eleUrl.data('md-prop-list')
            const $filterGroupBody = $(e.currentTarget).closest('.card').find('.filter-group-body')
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
                                <select name="left" class="form-select select2 select-prop" data-method="GET" data-url="${appPropURL}" data-keyResp="application_property_list" required></select>
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
            $newFilterRow.hide().appendTo($filterGroupBody).fadeIn('slow')
            // Initialize only the `.select-prop` and `.select-prop-data` within the new row
            $newFilterRow.find('.select-prop').each((id, e) => {
                let $selectElement = $(e);
                const currAppId = $("#data-object-area input[name='data_object']:checked").data('app-id')
                this.loadInitS2($selectElement, [], {'application': currAppId, 'is_filter_condition': true});
            });
        })
    }

    delRowEventBinding() {
        $(document).on('click', '.del-row', (e) => {
            const $currentRow = $(e.currentTarget).closest('.filter-row');
            const $currentCardBody = $currentRow.closest('.card-body')
            if ($currentCardBody.children().length === 1) {
                $currentCardBody.closest('.filter-card').fadeOut(() => {
                    $currentCardBody.closest('.filter-card').remove()
                })

            }
            if (this.$filterCondArea.find('.card').length < 2) {
                this.$filterCondArea.find('.or-row').fadeOut(() => {
                    this.$filterCondArea.find('.or-row').remove()
                })

            }
            $currentRow.fadeOut(() => {
                $currentRow.remove()
            })
        });
    }

    checkDataObjCheckboxEventBinding()  {
        $(document).on('click', '.data-obj-checkbox', (e) => {
            const $clickedCheckbox = $(e.currentTarget);

            $('.data-obj-checkbox').not($clickedCheckbox).prop('checked', false);

            // clear select data
            this.$filterCondArea.find('select').each((id, selectEle) => {
                let $selectElement = $(selectEle);
                $selectElement.val('')
                this.loadInitS2($selectElement, [])
                $selectElement.trigger('change')
            })

            // re-init select2 for prop select
            if ($('.data-obj-checkbox').length > 0) {
                $('.select-prop').each((id, selectPropEle) => {
                    let $selectElement = $(selectPropEle);
                    $selectElement.attr('data-keyResp', '')
                    $selectElement.attr('data-url', '')
                    const appId = $("#data-object-area input[name='data_object']:checked").data('app-id')
                    this.loadInitS2($selectElement, [], {'application': appId, 'is_filter_condition': true});
                })
            }
        })
    }

    changePropSelectValueEventBinding() {
        $(document).on('change', '.select-prop', (e) => {
            let data = SelectDDControl.get_data_from_idx($(e.currentTarget), $(e.currentTarget).val());
            if (data) {
                if (data?.['content_type']) {
                    // remove current 'right' element in case it is an input
                    let $formGroup = $(e.currentTarget).closest('.filter-row').find('[name="right"]').closest('.form-group')
                    $formGroup.empty()
                    let html = `<select name="right" class="form-select select2 select-prop-data" data-method="GET" required></select>`
                    $formGroup.append(html)
                    let content_type = data?.['content_type'].toLowerCase()
                    $(e.currentTarget).closest('.filter-row').find('.select-prop-data').attr('data-url', this.CONTENT_TYPE_MAPPING_URL[content_type]?.['url']);
                    $(e.currentTarget).closest('.filter-row').find('.select-prop-data').attr('data-keyResp', this.CONTENT_TYPE_MAPPING_URL[content_type]?.['keyResp']);
                    $(e.currentTarget).closest('.filter-row').find('.select-prop-data').attr('data-keyText', this.CONTENT_TYPE_MAPPING_URL[content_type]?.['keyText']);
                    this.loadInitS2(
                        $(e.currentTarget).closest('.filter-row').find('.select-prop-data'),
                        [],
                        {},
                        null,
                        false,
                        {res1: "code", res2: "title"}
                    );
                    if (data['type']) {
                        this.loadInitS2(
                            $(e.currentTarget).closest('.filter-row').find('.select-operator'),
                            this.COMPARE_OPERATOR_MAPPING[data['type']])
                    }
                } else {
                    if (data['type'] === 6 || data['type'] === 1) {
                        this.loadInitS2(
                            $(e.currentTarget).closest('.filter-row').find('.select-operator'),
                            this.COMPARE_OPERATOR_MAPPING[data['type']]
                        );
                        let $formGroup = $(e.currentTarget).closest('.filter-row').find('[name="right"]').closest('.form-group')
                        $formGroup.empty()
                        let html = `<input name="right" type="text" class="form-control" required/>`
                        $formGroup.append(html)
                    }
                }
                $('.select-operator').trigger('change')
            }
        })
    }

    changeOperatorSelectValueEventBinding(){
        $(document).on('change', '.select-operator', (e) => {
            let $currEle = $(e.currentTarget)
            if($currEle.val()==='exactnull' || $currEle.val()==='notexactnull'){
                let rightEle = $currEle.closest('.row').find('[name="right"]')
                rightEle.val(null).trigger('change')
                rightEle.attr('disabled', true)
            } else{
                let rightEle = $currEle.closest('.row').find('[name="right"]')
                rightEle.attr('disabled', false)
            }
        })
    }

    setUpFormData(form) {
        let filterCondition = []
        let isError = false
        $('.filter-group-body').each((id, filterBodyEle) => {
            let filterRow = []
            $(filterBodyEle).find('.filter-row').each((id, filterRowEle) => {
                const $right = $(filterRowEle).find("[name='right']")
                let rightData = null
                if ($right.is('select')) {
                    rightData = SelectDDControl.get_data_from_idx($right, $right.val());
                } else if ($right.is('input')) {
                    rightData = $right.val()
                }
                let type =$(filterRowEle).find("select[name='left']").data('prop-type');

                if (Number(type) === 6 && isNaN(rightData)) {
                    isError = true
                }
                filterRow.push({
                    'left': $(filterRowEle).find("select[name='left']").val(),
                    'operator': $(filterRowEle).find("select[name='operator']").val(),
                    'right': rightData,
                    'type': type,
                })
            })
            filterCondition.push(filterRow)
        })
        form.dataForm['filter_condition'] = filterCondition
        form.dataForm['data_object'] = $("#data-object-area input[name='data_object']:checked").data('id')
        form.dataForm['isError'] = isError
    }

    setUpFormSubmit() {
        SetupFormSubmit.call_validate(this.$formSubmit, {
            onsubmit: true,
            submitHandler: (form, event) => {
                let _form = new SetupFormSubmit(this.$formSubmit);
                this.setUpFormData(_form)
                if (_form.dataForm['isError']){
                    $.fn.notifyB({title: 'Right Value: ', description: 'Must be number'}, 'failure');
                    return
                }
                $.fn.callAjax2({
                    url: _form.dataUrl,
                    method: _form.dataMethod,
                    data: _form.dataForm
                }).then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({
                                'description': 'Success',
                            }, 'success');
                            setTimeout(() => {
                                window.location.replace(_form.dataUrlRedirect);
                            }, 3000);
                        }
                    },
                    (errs) => {
                        if(errs.data.errors){
                            for (const [key, value] of Object.entries(errs.data.errors)) {
                                $.fn.notifyB({title: key, description: value}, 'failure');
                            }
                        } else {
                            $.fn.notifyB('Error', 'failure');
                        }
                    });
            },
        })
    }

    fetchDataObject() {
        return $.fn.callAjax2({
            url: this.$eleUrl.data('md-data-obj'),
            method: 'GET'
        }).then((resp) => {
            const data = $.fn.switcherResp(resp);
            const dataObjListData = data?.['data_object_list'];

            if (dataObjListData) {
                for (let item of dataObjListData) {
                    this.$dataObjArea.append(`
                        <div class="col-2 mb-1">
                            <div class="form-check">
                                <div class="chip chip-outline-primary chip-lg">
                                    <input 
                                        name="data_object" 
                                        type="checkbox" 
                                        class="data-obj-checkbox" 
                                        data-app-id="${item?.['application_id']}"
                                        data-id="${item?.['id']}"
                                    >
                                    <span><span class="chip-text">${item?.['title']}</span></span>
                                </div>
                            </div>
                        </div>
                    `);
                }
            }

        });
    }

    fetchDataDetail(isDetail) {
        $.fn.callAjax2({
            url: this.$formSubmit.data('url'),
            method: 'GET',
            isLoading: true,
        }).then((resp) => {
            const data = $.fn.switcherResp(resp);
            if (data) {
                this.$listName.val(data?.['title'])
                const dataObjId = data?.['data_object']?.['id']


                // check the data-object
                $(`input[name="data_object"][data-id="${dataObjId}"]`).prop('checked', true)

                // empty filter area
                this.$filterCondArea.empty()

                const currAppId = $(`input[name="data_object"]:checked`).data('app-id')

                // loop through each filter group
                for (let filterGroupIndex = 0; filterGroupIndex < data['filter_condition'].length; filterGroupIndex++) {
                    let filterGroupData = data['filter_condition']?.[filterGroupIndex]
                    const filterCardContainer = `
                         <div class="filter-card">

                         </div>`

                    const $filterCardContainer = $(filterCardContainer)

                    // Add "OR" text
                    const ORRow = `
                         <div class="row my-4 or-row">
                             <div class="col-12">
                                 <div class="fs-2 text-center">OR</div>
                             </div>
                        </div>
                     `;

                    if (filterGroupIndex !== 0) {
                        $filterCardContainer.append(ORRow);
                    }
                    const newFilterCard = `
                         <div class="card" data-filter-group-id = ${filterGroupIndex}>
                             <div class="card-header">
                                Filter group
                             </div>
                             <div class="card-body filter-group-body">
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
                    const $newFilterCard = $(newFilterCard)
                    $filterCardContainer.append($newFilterCard)
                    this.$filterCondArea.append($filterCardContainer)

                    const $filterCardBody = $newFilterCard.find('.card-body')

                    // loop through each filter item
                    for (let filterItemId = 0; filterItemId < filterGroupData.length; filterItemId++) {
                        const filterItemData = filterGroupData[filterItemId]
                        const ANDRow = `
                            <div class="row mb-2">
                                <div class="col-12">
                                    AND
                                </div>
                            </div>`;
                        const filterRow = `
                            <div class="row">
                                <div class="col-3">
                                    <div class="form-group">
                                        <select data-filter-row-id="${filterItemId}" name="left" class="form-select select2 select-prop" data-method="GET" required></select>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="form-group">
                                        <select data-filter-row-id="${filterItemId}" name="operator" class="form-select select2 select-operator" required></select>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="form-group">
                                        <select data-filter-row-id="${filterItemId}" name="right" class="form-select select2 select-prop-data" data-method="GET" required></select>
                                    </div>
                                </div>
                                <div class="col-1">
                                    <div class="d-flex justify-content-center">
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title=""><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                    </div>
                                </div>
                            </div>`
                        // Add new filter row
                        const newFilterRow = `
                            <div class="filter-row" data-filter-row-id="${filterItemId}">
                            </div>
                        `;
                        const $newFilterRow = $(newFilterRow);
                        if (filterItemId !== 0){
                            $newFilterRow.append(ANDRow)
                        }
                        $newFilterRow.append(filterRow)
                        $filterCardBody.append($newFilterRow);

                        //add select 2
                        const $leftSelectEle = $filterCardBody.find(`select[name="left"][data-filter-row-id="${filterItemId}"]`)
                        this.loadInitS2($leftSelectEle, [filterItemData?.['left']], {'application': currAppId, 'is_filter_condition': true});
                        let selectedData = filterItemData?.['type'] || '';
                        if (selectedData) {
                            $leftSelectEle.attr('data-prop-type', selectedData); // Update `data-type` on the select element
                        }

                        if (filterItemData['left']?.['content_type']){
                            const $rightSelectEle = $filterCardBody.find(`select[name="right"][data-filter-row-id="${filterItemId}"]`)
                            let content_type = filterItemData?.['left']?.['content_type'].toLowerCase()
                            $rightSelectEle.attr('data-url', this.CONTENT_TYPE_MAPPING_URL[content_type]?.['url']);
                            $rightSelectEle.attr('data-keyResp', this.CONTENT_TYPE_MAPPING_URL[content_type]?.['keyResp']);
                            $rightSelectEle.attr('data-keyText', this.CONTENT_TYPE_MAPPING_URL[content_type]?.['keyText']);
                            if(filterItemData['operator']!=='notexactnull' && filterItemData['operator']!=='exactnull'){
                                this.loadInitS2(
                                    $rightSelectEle,
                                    [filterItemData?.['right']],
                                    {},
                                    null,
                                    false,
                                    {res1: "code", res2: "title"}
                                )
                            } else {
                                this.loadInitS2(
                                    $rightSelectEle,
                                    [],
                                    {},
                                    null,
                                    false,
                                    {res1: "code", res2: "title"}
                                )
                                $rightSelectEle.attr('disabled', true)
                            }

                        } else {
                            let $formGroup= $filterCardBody.find(`select[name="right"][data-filter-row-id="${filterItemId}"]`).closest('.form-group')
                            $formGroup.empty()
                            let html = `<input name="right" type="text" class="form-control" data-filter-row-id="${filterItemId}" required/>`
                            let $html = $(html)
                            $formGroup.append($html)

                            $html.val(filterItemData?.['right'])
                        }
                        const $operatorSelectEle = $filterCardBody.find(`select[name="operator"][data-filter-row-id="${filterItemId}"]`)
                        this.loadInitS2(
                            $operatorSelectEle,
                            this.COMPARE_OPERATOR_MAPPING[filterItemData?.['type'] ]
                        )
                        $operatorSelectEle.val(filterItemData?.['operator'])
                        $operatorSelectEle.trigger('change')
                    }
                }
            }
        }).then(()=>{
            if (isDetail){
                this.$formSubmit.find('button').not('[id="btn-enable-edit"]').not('[class="accordion-button"]').each(function () {
                    $(this).attr('disabled', true)
                    $(this).attr('readonly', true)
                })
                $('input').not('[name="data_object"]').each(function () {
                    $(this).attr('disabled', true)
                    $(this).attr('readonly', true)
                })
                this.$filterCondArea.find('select').each(function () {
                    $(this).attr('readonly', true)
                })
                $('.chip').on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                });
            }
        })
    }
}