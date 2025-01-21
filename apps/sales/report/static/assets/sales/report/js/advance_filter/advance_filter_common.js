class AdvanceFilterCommonHandler {
    constructor() {
        this.currPageAppID = ''
        this.$filterModal = $('#advance-filter-modal')
        this.$filterCondArea = $('#filter-cond-area')
    }

    getPropUrl(){
        //abstract method
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
    }

    getCurrPageAppID() {
        this.currPageAppID = this.$filterModal.data('curr-page-app-id')
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
    }

    onClickRadiusEventBinding(){
        $(document).on('click','input[type="radio"]',(e)=>{
            const $target = $(e.currentTarget);

            // allow to un-select a radio
            if ($target.data('wasChecked')) {
                $target.prop('checked', false);
                $target.data('wasChecked', false);
            } else {
                $('input[type="radio"]').data('wasChecked', false); // Reset all radios
                $target.data('wasChecked', true);
            }
        })
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
            // $newFilterRow.find('.select-prop').each((id, e) => {
            //     let $selectElement = $(e);
            //     const currAppId = $("#data-object-area input[name='data_object']:checked").data('app-id')
            //     this.loadInitS2($selectElement, [], {'application': currAppId, 'is_filter_condition': true});
            // });
        })
    }

    onClickAddNewFilterGroupEventBinding(){
        $(document).on('click', '#btn-add-new-cond-grp', () => {
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
            // $newFilterCard.find('.select-prop').each((id, e) => {
            //     let $selectElement = $(e);
            //     const currAppId = $("#data-object-area input[name='data_object']:checked").data('app-id')
            //     this.loadInitS2($selectElement, [], {'application': currAppId, 'is_filter_condition': true});
            // })
        })
    }

    onClickDelModalFilterItemEventBinding(){
        $(document).on('click', '#advance-filter-modal .del-row', (e) => {
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
}