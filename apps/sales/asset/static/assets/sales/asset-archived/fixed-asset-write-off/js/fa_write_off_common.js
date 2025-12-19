class FAWriteOffCommonHandler {
    constructor() {
        this.$urlScript = $('#url-script')

        this.$assetDatatable = $('#datatable-asset-list')
        this.$postingDateInput = $('#posting-date')
        this.$documentDateInput = $('#document-date')

        this.$typeSelect = $('#type')
        this.$titleInput = $('#title')
        this.$noteInput = $('#note')
    }

    init(isUpdate=false){
        if(!isUpdate) {
            this.initAssetDatatable()
        }

        this.initDateInput(this.$postingDateInput, null)
        this.initDateInput(this.$documentDateInput, null)

        this.addEventBinding()
    }

    addEventBinding(){
        this.changeAssetSelectEventBinding()
        this.addRowDataTableEventBinding()
        this.delRowDataTableEventBinding()
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
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    }

    initAssetDatatable(data=[{}]){
        if (!$.fn.DataTable.isDataTable('#datatable-asset-list')) {
            this.$assetDatatable.DataTableDefault({
                retrieve:true,
                reloadCurrency: true,
                rowIdx: true,
                data: data,
                columns: [
                    {
                        targets: 0,
                        width: '1%',
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            const id = row?.['id']
                            const FAListUrl = this.$urlScript.attr('data-fixed-asset-list-api')
                            return `<select class="form-select select2 asset-code-select" data-method="GET" data-keytext="asset_code"
                                            data-keyResp="fixed_asset_list" data-url="${FAListUrl}" data-fa-id="${id}">
                                    </select>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '10%',
                        render: (data, type, row) => {
                            const title = row?.['title'] || ''
                            return `<div>${title}</div>`
                        }
                    },
                    {
                        targets: 3,
                        width: '10%',
                        render: (data, type, row) => {
                            const status = row?.['fa_status'] || ''
                            return `<div>${status}</div>`
                        }
                    },
                    {
                        targets: 4,
                        width: '10%',
                        render: (data, type, row) => {
                            const useDepartments = row?.['use_department'] || []
                            let element = ''
                            for (let i = 0; i < useDepartments.length; i++) {
                                element += `<span class="w-100 badge badge-soft-success badge-outline mb-1">${useDepartments[i]?.['title']}</span>`;
                            }
                            return element;
                        }
                    },
                    {
                        targets: 5,
                        width: '10%',
                        render: (data, type, row) => {
                            const customerName = row?.['use_customer']?.['name'] ? row?.['use_customer']?.['name'] : ''
                            return `<div>${customerName}</div>`
                        }
                    },
                    {
                        targets: 6,
                        width: '10%',
                        render: (data, type, row) => {
                            const depreciationTimeUnitMap = {
                                0: 'Month',
                                1: 'Year',
                            }
                            const depreciationTime = row?.['depreciation_time'] || ''
                            const depreciationTimeUnit = depreciationTimeUnitMap[row?.['depreciation_time_unit']] || ''
                            return `<div>${depreciationTime} ${depreciationTimeUnit}</div>`
                        }
                    },
                    {
                        targets: 7,
                        width: '10%',
                        render: (data, type, row) => {
                            const originalAssetCost = row?.['original_cost'] || ''
                            return `<span class="mask-money" data-init-money=${originalAssetCost}></span>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '10%',
                        render: (data, type, row) => {
                            const accDepreciation = row?.['accumulative_depreciation'] || ''
                            return `<span class="mask-money" data-init-money=${Number(accDepreciation)}></span>`;
                        }
                    },
                    {
                        targets: 9,
                        width: '10%',
                        render: (data, type, row) => {
                            const netBookValue = row?.['net_book_value'] || ''
                            return `<span class="mask-money" data-init-money=${netBookValue}></span>`
                        }
                    },
                    {
                        targets: 10,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<div class="d-flex justify-content-center">
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title=""><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                    </div>`
                        }
                    },
                ],
                rowCallback: function(row, data) {
                    const $select = $(row).find('.asset-code-select');
                    this.loadInitS2($select)
                    if (data?.['asset_code']) {
                        const assetCode = data['asset_code'];
                        const assetId = data['id']
                        $select.append(new Option(assetCode, assetId, true, true));
                        $select.trigger('change.select2');
                    }
                }.bind(this),
            })
        }
    }

    initDateInput($dateInput, dateData){
        if (dateData) {
            dateData = $x.fn.reformatData(
                dateData,
                $x.cls.datetime.defaultFormatDatetime,
                'DD-MM-YYYY',
                moment().format('DD-MM-YYYY')
            );
        }
        $dateInput.daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY',
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true,
            autoUpdateInput: false,
            startDate: dateData || moment(), // Default to dateData or current date
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY')).trigger('change')
        }).on('show.daterangepicker', function (ev, picker) {
            // Dynamically set startDate when the picker is opened
            if (dateData) {
                picker.setStartDate(moment(dateData, 'DD-MM-YYYY'))
            }
        });
        $dateInput.val(dateData).trigger('change');
    }

    initInput($selector, data=null){
        $selector.val(data)
    }

    checkDuplicateSelectOption($element) {
        let duplicate = false
        let selectedValues = [];
        $element.each((_, el) => {
            let val = $(el).val()
            if (val && selectedValues.includes(val)) {
                duplicate = true
            }
            selectedValues.push(val)
        });
        return duplicate
    }

    changeAssetSelectEventBinding(){
        this.$assetDatatable.on('change', '.asset-code-select', (e)=> {
            const selectedValue = $(e.currentTarget).val();
            const table = this.$assetDatatable.DataTableDefault({
                retrieve:true,
            })
            const row = table.row($(e.currentTarget).closest('tr'))

            const isValueDuplicated = this.checkDuplicateSelectOption($('.asset-code-select'))
            if (isValueDuplicated) {
                $.fn.notifyB({description: 'Duplicate'}, 'failure')
                $(e.currentTarget).empty()
                // DO NOT USE row. here, because row.data({}).draw() or row.remove().draw() ... will cause bug (page will be not scrollable)
                $(row).find('div').each((_, el) => {
                    $(el).empty()
                })
            } else {
                const dataUrl = this.$urlScript.attr('data-fixed-asset-detail-api')
                const detailUrl = dataUrl.format_url_with_uuid(selectedValue);

                if (selectedValue){
                    $.fn.callAjax2({
                        url: detailUrl,
                        method: 'GET',
                    }).then((resp) => {
                        let newData = resp?.['data'] || {}
                        row.data(newData).draw()
                        $.fn.initMaskMoney2()
                    })
                }
            }
        });
    }

    addRowDataTableEventBinding() {
        $(document).on('click', '#btn-add-asset', (e)=> {
            const table = this.$assetDatatable.DataTableDefault({
                retrieve:true,
            })
            table.row.add({}).draw()
        })
    }

    delRowDataTableEventBinding() {
        this.$assetDatatable.on('click', '.del-row', (e)=> {
            const table = this.$assetDatatable.DataTableDefault({
                retrieve:true,
            })
            const row = table.row($(e.currentTarget).closest('tr'))
            row.remove().draw()
        })
    }

    setupFormData(form) {
        let tmpData = form.dataForm['posting_date'];
        form.dataForm['posting_date'] = tmpData.split('-').reverse().join('-');

        tmpData = form.dataForm['document_date']
        form.dataForm['document_date'] = tmpData.split('-').reverse().join('-');

        let result=[]
        this.$assetDatatable.DataTable().rows().every(function(){
            let row = $(this.node());
            const id = row.find('.asset-code-select').attr('data-fa-id')
            const code = row.find('.asset-code-select').text()
            if (id && code){
                result.push({
                    'id': id,
                    'asset_code': code
                })
            }
        })
        form.dataForm['asset_list'] = result
    }

    setUpFormSubmit($formSubmit){
        SetupFormSubmit.call_validate($formSubmit, {
            onsubmit: true,
            submitHandler: (form, event) => {
                let _form = new SetupFormSubmit($formSubmit);
                this.setupFormData(_form)
                console.log(_form)
                WFRTControl.callWFSubmitForm(_form)
            }
        })
    }

    disableFields(){
        const $fields = $('#form-fixed-asset-writeoff').find('input, select, button, textarea')
        $fields.attr('disabled', true)
        $fields.attr('readonly', true)

        $('#datatable-asset-list').on('draw.dt', function() {
            $(this).find('input, select, button').attr('disabled', true).attr('readonly', true);
        });
    }

    fetchDetailData($formSubmit ,disabledFields=false){
        $.fn.callAjax2({
            url: $formSubmit.attr('data-url'),
            method:'GET',
            isLoading: true
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp)
                if (data) {
                    $x.fn.renderCodeBreadcrumb(data)
                    $.fn.compareStatusShowPageAction(data)

                    this.$typeSelect.val(data?.['type']).trigger('change')
                    this.initInput(this.$titleInput, data?.['title'])
                    this.initInput(this.$noteInput, data?.['note'])
                    this.initDateInput(this.$postingDateInput, data?.['posting_date'])
                    this.initDateInput(this.$documentDateInput, data?.['document_date'])

                    this.initAssetDatatable(data?.['asset_list'])
                }
            },
            (errs) => {
                if(errs.data.errors){
                    for (const [key, value] of Object.entries(errs.data.errors)) {
                        $.fn.notifyB({title: key, description: value}, 'failure')
                    }
                } else {
                    $.fn.notifyB('Error', 'failure')
                }
            })
            .then(() => {
                if (disabledFields) {
                    this.disableFields();
                }
            })
    }
}

