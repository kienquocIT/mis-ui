class AdvanceFilterCommonHandler {
    constructor() {
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

        this.currPageAppID = ''
        this.$filterModal = $('#advance-filter-modal')
        this.$filterModalUpdate = $('#advance-filter-modal-update')

        this.$filterCondArea = $('#filter-cond-area')
        this.$addNewAdvanceFilterBtn = $('#btn-add-advance-filter')
        this.$formFilterCreate = $('#form-create-filter')
        this.$advanceFilterArea = $('#advance-filter-area')

        this.$filterUpdateTitle = $('#filter-title-update')
        this.$filterCondAreaUpdate = $('#filter-cond-area-update')

        this.$formFilterUpdate = $('#form-update-filter')

        this.$msgScript = $('#msg-script')
    }

    getPropUrl(){
        //abstract method
    }

    getContentTypeMappingUrl(contentType){

    }

    loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
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
                let res1 = `<span class="badge badge-soft-primary mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        this.addPropType($ele)
    }

    addPropType($ele) {
        $ele.on('change', function () {
            let selectedData = $ele.select2('data')[0]?.data || {};
            if (selectedData.type) {
                $ele.attr('data-prop-type', selectedData.type);
            }
        });
    }

    getCurrPageAppID() {
        this.currPageAppID = this.$filterModal.attr('data-curr-page-app-id')
    }

    init(){
        this.initPropFields()
    }

    initPropFields(){
        const $propSelect = $('.select-prop')
        $propSelect.each((id,e)=>{
            const $selectElement = $(e)
            const url = this.getPropUrl()
            $selectElement.attr('data-keyResp', 'application_property_list')
            $selectElement.attr('data-url', url)
            this.loadInitS2($selectElement, [], {'application': this.currPageAppID, 'is_filter_condition': true});
        })
    }

    addEventBinding(){
        this.onClickRadiusEventBinding()
        this.onClickDelFilterItemEventBinding()
        this.onClickAddNewFilterEventBinding()
        this.onClickAddNewFilterGroupEventBinding()
        this.onClickDelModalFilterItemEventBinding()
        this.onChangePropertySelectValueEventBinding()
        this.onChangeOperatorSelectValueEventBinding()
        this.onClickOpenModalDetailEventBinding()
        this.onClickAddNewFilterGroupUpdateEventBinding()
        this.onClickDeleteAdvanceFilterEventBinding()
    }

    onClickRadiusEventBinding() {
        $(document).on('click', 'input[type="radio"]', (e) => {
            const $target = $(e.currentTarget);

            if ($target.prop('checked') && $target.data('wasChecked')) {
                // If the radio is already checked and marked as previously checked, uncheck it
                $target.prop('checked', false);
                $target.data('wasChecked', false);
            } else {
                // Unselect all other radios and select the clicked one
                $('input[type="radio"]').prop('checked', false).data('wasChecked', false);
                $target.prop('checked', true).data('wasChecked', true);
            }
        });
    }

    onClickDelFilterItemEventBinding(){
        $(document).on('click','#advance-filter-area .del-row',(e)=>{
            $(e.currentTarget).closest('.filter-item').remove();
        })
    }

    onClickAddNewFilterEventBinding(){
        $(document).on('click', '.btn-add-new-cond', (e) => {
            // const appPropURL = this.$eleUrl.data('md-prop-list')
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
                                <select name="left" class="form-select select2 select-prop" data-method="GET" data-url="" data-keyResp="application_property_list" required></select>
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
                const url = this.getPropUrl()
                $selectElement.attr('data-keyResp', 'application_property_list')
                $selectElement.attr('data-url', url)
                this.loadInitS2($selectElement, [], {'application':  this.currPageAppID, 'is_filter_condition': true});
            });
        })
    }

    onClickAddNewFilterGroupEventBinding(){
        $(document).on('click', '.btn-add-new-cond-grp', () => {
            // const appPropURL = this.$eleUrl.data('md-prop-list')

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
                                        <select name="left" class="form-select select2 select-prop" data-method="GET" data-url="" data-keyResp="application_property_list" required></select>
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
                const url = this.getPropUrl()
                $selectElement.attr('data-keyResp', 'application_property_list')
                $selectElement.attr('data-url', url)
                this.loadInitS2($selectElement, [], {'application': this.currPageAppID, 'is_filter_condition': true});
            })
        })
    }

    onClickDelModalFilterItemEventBinding(){
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

    onChangePropertySelectValueEventBinding(){
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
                    $(e.currentTarget).closest('.filter-row').find('.select-prop-data').attr(
                        'data-url', this.getContentTypeMappingUrl(content_type)?.['url']
                    );
                    $(e.currentTarget).closest('.filter-row').find('.select-prop-data').attr(
                        'data-keyResp', this.getContentTypeMappingUrl(content_type)?.['keyResp']
                    );
                    $(e.currentTarget).closest('.filter-row').find('.select-prop-data').attr(
                        'data-keyText', this.getContentTypeMappingUrl(content_type)?.['keyText']
                    );

                    this.loadInitS2(
                        $(e.currentTarget).closest('.filter-row').find('.select-prop-data'),
                        [],
                        {},
                        null,
                        false,
                        {res1: "code", res2: this.getContentTypeMappingUrl(content_type)?.['keyText']}
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

    onChangeOperatorSelectValueEventBinding(){
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

    onClickDeleteAdvanceFilterEventBinding(){
        $(document).on('click', '.btn-del', (e)=>{
            Swal.fire({
                title: this.$msgScript.attr('data-msg-are-u-sure'),
                text: this.$msgScript.attr('data-msg-not-revert'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$msgScript.attr('data-msg-delete'),
                cancelButtonText: this.$msgScript.attr('data-msg-cancel'),
            }).then((result) => {
                if (result.isConfirmed) {
                    const advanceFilterId = $(e.currentTarget).closest('.filter-item').find('input[type="radio"]').attr('id')
                    let url = this.$formFilterUpdate.attr('data-url')
                    url = url.format_url_with_uuid(advanceFilterId)
                    $.fn.callAjax2({
                        url: url,
                        method: 'DELETE',
                    }).then(
                        (resp) => {
                            const data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({
                                    'description': 'Success',
                                }, 'success');
                                this.fetchDataFilterList()
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
                }
            })
        })
    }

    setUpFormCreateFilterData(form) {
        let filterCondition = []
        let isError = false
        $('#advance-filter-modal').find('.filter-group-body').each((id, filterBodyEle) => {
            let filterRow = []
            $(filterBodyEle).find('.filter-row').each((id, filterRowEle) => {
                const $right = $(filterRowEle).find("[name='right']")
                let rightData = null
                if ($right.is('select')) {
                    rightData = SelectDDControl.get_data_from_idx($right, $right.val());
                } else if ($right.is('input')) {
                    rightData = $right.val()
                }
                let type =$(filterRowEle).find("select[name='left']").attr('data-prop-type');

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
        form.dataForm['application'] = this.currPageAppID
        form.dataForm['isError'] = isError
    }

    setUpFormCreateFilterSubmit(){
        SetupFormSubmit.call_validate(this.$formFilterCreate, {
                onsubmit: true,
                submitHandler: (form, event) => {
                    let _form = new SetupFormSubmit(this.$formFilterCreate);
                    this.setUpFormCreateFilterData(_form)
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
                                this.fetchDataFilterList()
                                this.clearDataFormCreateFilter()
                                this.$filterModal.modal('hide')
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

    clearDataFormCreateFilter(){
        this.$formFilterCreate.find('#filter-title').val('')
        this.$formFilterCreate.find('#filter-cond-area').empty()
        const dataBody = `
            <div class="filter-card">
                <div class="card">
                <div class="card-header">
                    Filter group
                </div>
                <div class="card-body filter-group-body" >
                    <div class="filter-row">
                        <div class="row">
                            <div class="col-3">
                                <div class="form-group">
                                    <select name="left" class="form-select select2 select-prop" data-method="GET" required></select>
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
                    <button type="button" class="btn btn-outline-primary btn-add-new-cond">
                        <span>
                            <span class="icon"><i class="fa-solid fa-plus"></i></span>
                            <span>And</span>
                        </span>
                    </button>
                </div>
            </div>
            </div>
        `
        this.$formFilterCreate.find('#filter-cond-area').append(dataBody)
    }

    fetchDataFilterList(){
        const url = this.$formFilterCreate.data('url')
        $.fn.callAjax2({
            url: url,
            method: 'GET',
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('advance_filter_list')) {
                    this.loadDataFilterList(data['advance_filter_list']);
                    this.saveAdvanceFilterListDataToScript(data['advance_filter_list'])
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
    }

    loadDataFilterList(data){
        this.$advanceFilterArea.empty()
        this.$advanceFilterArea.append(`
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#advance-filter-modal">
                Open Advance Filter
            </button>
        `)
        for(let advanceFilter of data){
            const advanceFilterArea = `
                 <div class="d-flex flex-row align-items-center justify-content-center border rounded pl-2 filter-item">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" id="${advanceFilter?.['id']}">
                    </div>
                    <label class="form-check-label mr-5" for="${advanceFilter?.['id']}">
                        ${advanceFilter?.['title']}
                    </label>
                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-detail" data-bs-toggle="modal" data-bs-target="#advance-filter-modal-update" data-bs-placement="bottom" title=""><span class="icon"><i class="fa fa-pencil"></i></span></button>
                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-del" data-bs-toggle="tooltip" data-bs-placement="bottom" title=""><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                </div>
            `
            this.$advanceFilterArea.append(advanceFilterArea)
        }
    }

    saveAdvanceFilterListDataToScript(data){
        $('#advance-filter-script').attr('data-advance-filter-list', JSON.stringify(data))
    }

    //detail
    setUpFormUpdateFilterData(form) {
        let filterCondition = []
        let isError = false
        $('#advance-filter-modal-update').find('.filter-group-body').each((id, filterBodyEle) => {
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
        form.dataForm['application'] = this.currPageAppID
        form.dataForm['isError'] = isError
        form.dataUrl = form.dataUrl.format_url_with_uuid($('#btn-update-advance-filter').attr('data-id'))
    }

    setUpFormUpdateFilterSubmit(){
        SetupFormSubmit.call_validate(this.$formFilterUpdate, {
                onsubmit: true,
                submitHandler: (form, event) => {
                    let _form = new SetupFormSubmit(this.$formFilterUpdate);
                    this.setUpFormUpdateFilterData(_form)
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
                                this.fetchDataFilterList()
                                this.onClickOpenModalDetailEventBinding()
                                this.$filterModalUpdate.modal('hide')
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

    loadDataDetailAdvanceFilter(data){
        const title = data['title'];
        const filterCondition = data['filter_condition'];
        // console.log(filterCondition)
        this.$filterUpdateTitle.val(title)

        this.$filterCondAreaUpdate.empty()

        for (let filterGroupIndex = 0; filterGroupIndex < filterCondition.length; filterGroupIndex++) {
            let filterGroupData = filterCondition?.[filterGroupIndex]
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
                         <button type="button" class="btn btn-outline-primary btn-add-new-cond">
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
            this.$filterCondAreaUpdate.append($filterCardContainer)

            const $filterCardBody = $newFilterCard.find('.card-body')

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

                const $leftSelectEle = $filterCardBody.find(`select[name="left"][data-filter-row-id="${filterItemId}"]`)
                this.loadInitS2($leftSelectEle, [filterItemData?.['left']], {'application': this.currPageAppID, 'is_filter_condition': true});

                let selectedDataType = filterItemData?.['type'] || '';
                if (selectedDataType) {
                    $leftSelectEle.attr('data-prop-type', selectedDataType); // Update `data-type` on the select element
                }

                if (filterItemData['left']?.['content_type']){
                    const $rightSelectEle = $filterCardBody.find(`select[name="right"][data-filter-row-id="${filterItemId}"]`)
                    let content_type = filterItemData?.['left']?.['content_type'].toLowerCase()
                    $rightSelectEle.attr('data-url', this.getContentTypeMappingUrl(content_type)?.['url']);
                    $rightSelectEle.attr('data-keyResp', this.getContentTypeMappingUrl(content_type)?.['keyResp']);
                    $rightSelectEle.attr('data-keyText', this.getContentTypeMappingUrl(content_type)?.['keyText']);
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

    onClickOpenModalDetailEventBinding(){
        $(document).on('click', '.btn-detail', (e) => {
            const $currentEle = $(e.currentTarget)
            const advanceFilterId = $currentEle.closest('.filter-item').find('input').attr('id')
            const advanceFilterListData = JSON.parse($('#advance-filter-script').attr('data-advance-filter-list'))
            const currentAdvanceFilterData = advanceFilterListData.find(item=>item['id'] === advanceFilterId)
            this.loadDataDetailAdvanceFilter(currentAdvanceFilterData)
            $('#btn-update-advance-filter').attr('data-id', advanceFilterId)
        })
    }

    onClickAddNewFilterGroupUpdateEventBinding(){
        $(document).on('click', '.btn-add-new-cond-grp-update', () => {
            // const appPropURL = this.$eleUrl.data('md-prop-list')

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
            if (this.$filterCondAreaUpdate.find('.card').length > 0) {
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
                                        <select name="left" class="form-select select2 select-prop" data-method="GET" data-url="" data-keyResp="application_property_list" required></select>
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
                        <button type="button" class="btn btn-outline-primary btn-add-new-cond">
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

            $filterCardContainer.hide().appendTo(this.$filterCondAreaUpdate)
            $filterCardContainer.fadeIn('slow')


            // init select2 for each left element
            $newFilterCard.find('.select-prop').each((id, e) => {
                let $selectElement = $(e);
                const url = this.getPropUrl()
                $selectElement.attr('data-keyResp', 'application_property_list')
                $selectElement.attr('data-url', url)
                this.loadInitS2($selectElement, [], {'application': this.currPageAppID, 'is_filter_condition': true});
            })
        })
    }
}
