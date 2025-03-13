$(document).ready(function () {
    class CommonHandler{
        constructor(options) {
            this.currentSection = options.currentSection
            this.dataTableId = options.dataTableId
            this.respKeyword = options.respKeyword
            this.modalId = options.modalId
            this.modalUpdateId = options.modalUpdateId
            this.btnUpdate = options.btnUpdate
            this.formUpdateId = options.formUpdateId
            this.formId = options.formId

            this.dataUpdateUrl = options.dataUpdateUrl

            this.$addressModal = $('#modal-address')
            this.$countrySelect = $('#country')
            this.$citySelect = $('#city')
            this.$districtSelect = $('#district')
            this.$wardSelect = $('#ward')
            this.$addressTextArea = $('#address')

            this.$fullAddressTextArea = $('#full-address')

            this.$addressModalUpdate = $('#modal-address-update')
            this.$countrySelectUpdate = $('#country-update')
            this.$citySelectUpdate = $('#city-update')
            this.$districtSelectUpdate = $('#district-update')
            this.$wardSelectUpdate = $('#ward-update')
            this.$addressTextAreaUpdate = $('#address-update')

            this.$fullAddressTextAreaUpdate = $('#full-address-update')


            this.$brandFullAddressTextArea = $('#brand-full-address')
        }

        init(){
            this.initDataTable()
            this.handleOpenUpdateModal(this.modalUpdateId, this.btnUpdate, this.formUpdateId)
            this.handleSubmitForm(this.formId, this.modalId, this.dataTableId)
            this.handleSubmitForm(this.formUpdateId, this.modalUpdateId, this.dataTableId)
        }

        initDataTable(){
            $(this.dataTableId).DataTable().destroy()
            let tbl = $(this.dataTableId);
            let columns = this.setupColumn(this.btnUpdate, this.modalUpdateId)
            let frm = new SetupFormSubmit(tbl);

            tbl.DataTableDefault(
                {
                    useDataServer: true,
                    rowIdx: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        data: {},
                        dataSrc:  (resp)=> {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty(this.respKeyword)) {
                                return resp.data[this.respKeyword] ? resp.data[this.respKeyword] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: columns,
                },
            )
        }

        initSelect2(){
            this.$countrySelect.initSelect2();
            this.$citySelect.initSelect2()
            this.$districtSelect.initSelect2()
            this.$wardSelect.initSelect2()
        }

        setupColumn(btnUpdate, modalUpdate){
            switch (this.currentSection) {
                case 'section_fixed_asset_classification_group':
                    return [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                if (row.is_default) {
                                    return `<span class="badge badge-secondary">${row.code}</span>`
                                } else {
                                    return `<span class="badge badge-primary">${row.code}</span>`
                                }
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-75',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data}</b></span>`
                                }
                                return `<span><b>${data}</b></span>`
                            }
                        },
                        {
                            className: 'wrap-text text-right w-10',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover"
                                                   data-id="${row?.['id']}"
                                                   data-code="${row?.['code']}"
                                                   data-title="${row?.['title']}"
                                                   data-bs-toggle="modal"
                                                   data-bs-target=''
                                                   data-bs-placement="top" title=""
                                                   >
                                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                                </a>`
                                }
                                return ``
                            }
                        }
                    ]
                case 'section_fixed_asset_classification':
                    return [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                console.log(row.is_default);
                                if (row.is_default) {
                                    return `<span class="badge badge-secondary">${row.code}</span>`
                                } else {
                                    return `<span class="badge badge-primary">${row.code}</span>`
                                }
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-55',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data}</b></span>`
                                }
                                return `<span><b>${data}</b></span>`
                            }
                        },
                        {
                            data: 'group',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data?.['title']}</b></span>`
                                }
                                return `<span><b>${data?.['title']}</b></span>`
                            }
                        },
                        {
                            className: 'wrap-text text-right w-10',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover"
                                                   data-id="${row?.['id']}"
                                                   data-code="${row?.['code']}"
                                                   data-title="${row?.['title']}"
                                                   data-bs-toggle="modal"
                                                   data-bs-target=''
                                                   data-bs-placement="top" title=""
                                                   >
                                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                                </a>`
                                }
                                return ``
                            }
                        }
                    ]
                case 'section_tool_classification':
                    return [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                console.log(row.is_default);
                                if (row.is_default) {
                                    return `<span class="badge badge-secondary">${row.code}</span>`
                                } else {
                                    return `<span class="badge badge-primary">${row.code}</span>`
                                }
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-55',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data}</b></span>`
                                }
                                return `<span><b>${data}</b></span>`
                            }
                        },
                        {
                            className: 'wrap-text text-right w-10',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover ${btnUpdate}"
                                                   data-id="${row?.['id']}"
                                                   data-code="${row?.['code']}"
                                                   data-title="${row?.['title']}"
                                                   data-bs-toggle="modal"
                                                   data-bs-target=${modalUpdate}
                                                   data-bs-placement="top" title=""
                                                   >
                                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                                </a>`
                                }
                                return ``
                            }
                        }
                    ]
                case 'section_bank':
                    return [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'abbreviation',
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data}</b></span>`
                                }
                                return `<span><b>${data}</b></span>`
                            }
                        },
                        {
                            data: 'vietnamese_name',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data}</b></span>`
                                }
                                return `<span><b>${data}</b></span>`
                            }
                        },
                        {
                            data: 'english_name',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data}</b></span>`
                                }
                                return `<span><b>${data}</b></span>`
                            }
                        },
                        {
                            className: 'wrap-text text-right w-10',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover ${btnUpdate}"
                                                   data-bs-toggle="modal"
                                                   data-bs-target=${modalUpdate}
                                                   data-bs-placement="top" title=""
                                                   data-id="${row?.['id']}"
                                                   >
                                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                                </a>`
                                }
                                return ``
                            }
                        }
                    ]
                case 'section_bank_account':
                    return [
                        {
                            className: 'wrap-text w-5',
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'bank_account_number',
                            className: 'wrap-text w-20',
                            render: (data, type, row) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data}</b></span>`
                                }
                                return `<span><b>${data}</b></span>`
                            }
                        },
                        {
                            data: 'bank_name',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data}</b></span>`
                                }
                                return `<span><b>${data}</b></span>`
                            }
                        },
                        {
                            data: 'brand_name',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<span class="text-primary"><b>${data}</b></span>`
                                }
                                return `<span><b>${data}</b></span>`
                            }
                        },
                        {
                            className: 'wrap-text text-right w-10',
                            render: (data, type, row, meta) => {
                                if (!row?.['is_default']) {
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover ${btnUpdate}"
                                                   data-bs-toggle="modal"
                                                   data-bs-target=${modalUpdate}
                                                   data-bs-placement="top" title=""
                                                   data-id="${row?.['id']}"
                                                   >
                                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                                </a>`
                                }
                                return ``
                            }
                        }
                    ]
            }

        }

        handleSelectCity(){
            // remove event handler first, init object many times might cause duplicate
            $(document).off('change', '#city').on('change', '#city', (e)=>{
                const cityValue = $(e.currentTarget).val()
                this.$districtSelect.val('').trigger('change:select2')
                this.$wardSelect.val('').trigger('change:select2')
                this.$districtSelect.initSelect2(
                    {
                        'dataParams': {
                            'city_id': cityValue
                        }
                    }
                )
            })

            $(document).off('change', '#city-update').on('change', '#city-update', (e)=>{
                const cityValue = $(e.currentTarget).val()
                this.$districtSelectUpdate.val('').trigger('change:select2')
                this.$wardSelectUpdate.val('').trigger('change:select2')
                this.$districtSelectUpdate.initSelect2(
                    {
                        'dataParams': {
                            'city_id': cityValue
                        }
                    }
                )
            })
        }

        handleSelectDistrict(){
            $(document).off('change', '#district').on('change', '#district', (e)=>{
                const districtValue = $(e.currentTarget).val()
                this.$wardSelect.val('').trigger('change:select2')
                this.$wardSelect.initSelect2(
                    {
                        'dataParams': {
                            'district_id': districtValue
                        }
                    }
                )
            })

             $(document).off('change', '#district-update').on('change', '#district-update', (e)=>{
                const districtValue = $(e.currentTarget).val()
                this.$wardSelectUpdate.val('').trigger('change:select2')
                this.$wardSelectUpdate.initSelect2(
                    {
                        'dataParams': {
                            'district_id': districtValue
                        }
                    }
                )
            })
        }

        handleSubmitForm(formId, modalId, dataTableId){
            new SetupFormSubmit($(formId)).validate({
                submitHandler:  (form) => {
                    let frm = new SetupFormSubmit($(form));
                    let data_url =  $(formId).attr('data-url');
                    $.fn.callAjax2({
                        'url': data_url,
                        'method': frm.dataMethod,
                        'data': frm.dataForm,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $(modalId).modal('hide');
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                $(dataTableId).DataTable().ajax.reload();
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
                }
            })
        }

        handleOpenUpdateModal(modalUpdateId, btnUpdateClass, formUpdateId){
            const btnUpdateClassSelector = '.'  + btnUpdateClass
            $(document).on('click', btnUpdateClassSelector, (e)=> {
                let modal = $(modalUpdateId)
                modal.find('#inp_code').val($(e.currentTarget).attr('data-code'))
                modal.find('#inp_name').val($(e.currentTarget).attr('data-title'))
                const id = $(e.currentTarget).attr('data-id')
                const urlUpdate = $('#update-url-script').attr(this.dataUpdateUrl)
                $(formUpdateId).attr('data-url', urlUpdate.replace('/0', `/${id}`))
            })
        }

        clearAddressData(){
            this.$districtSelect.val('').trigger('change:select2')
            this.$citySelect.val('').trigger('change:select2')
            this.$wardSelect.val('').trigger('change:select2')
            this.$countrySelect.val('').trigger('change:select2')
            this.$addressTextArea.val('').trigger('change')
        }
    }

    class BankHandler extends CommonHandler{
        constructor(options) {
            super(options);
        }

        init() {
            super.init()
            this.initSelect2()
            this.handleSelectCity()
            this.handleSelectDistrict()
            this.handleSaveAddress()
        }

        handleSubmitForm(formId, modalId, dataTableId){
            new SetupFormSubmit($(formId)).validate({
                submitHandler:  (form) => {
                    let frm = new SetupFormSubmit($(form))
                    if (frm.dataMethod === 'PUT') {
                        this.setupSubmitDataUpdate(frm)
                    } else {
                        this.setupSubmitData(frm)
                    }
                    let data_url =  $(formId).attr('data-url')
                    $.fn.callAjax2({
                        'url': data_url,
                        'method': frm.dataMethod,
                        'data': frm.dataForm,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $(modalId).modal('hide');
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                this.clearAddressData()
                                $(dataTableId).DataTable().ajax.reload();
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
                }
            })
        }

        setupSubmitData(frm) {
            frm['dataForm']['district'] = this.$districtSelect.val()
            frm['dataForm']['city'] = this.$citySelect.val()
            frm['dataForm']['ward'] = this.$wardSelect.val()
            frm['dataForm']['country'] = this.$countrySelect.val()
            frm['dataForm']['address'] = this.$addressTextArea.val()
        }

        setupSubmitDataUpdate(frm){
            frm['dataForm']['district'] = this.$districtSelectUpdate.val()
            frm['dataForm']['city'] = this.$citySelectUpdate.val()
            frm['dataForm']['ward'] = this.$wardSelectUpdate.val()
            frm['dataForm']['country'] = this.$countrySelectUpdate.val()
            frm['dataForm']['address'] = this.$addressTextAreaUpdate.val()
        }

        handleSaveAddress(){
            $(document).off('click', '#btn-save-address').on('click', '#btn-save-address', (e)=>{
                const addressValue = this.$addressTextArea.val()
                const countryValue = $('#country option:selected').text()
                const cityValue = $('#city option:selected').text()
                const districtValue = $('#district option:selected').text()
                const wardValue = $('#ward option:selected').text()
                let valueArray = [addressValue, wardValue, districtValue, cityValue, countryValue]
                valueArray = valueArray.filter((item)=> item !== '')
                let fullAddressValue = valueArray.join(', ')
                this.$fullAddressTextArea.val(fullAddressValue)
                this.$addressModal.modal('hide')
                $(this.modalId).modal('show')
            })
             $(document).off('click', '#btn-save-address-update').on('click', '#btn-save-address-update', (e)=>{
                const addressValue = this.$addressTextAreaUpdate.val()
                const countryValue = $('#country-update option:selected').text()
                const cityValue = $('#city-update option:selected').text()
                const districtValue = $('#district-update option:selected').text()
                const wardValue = $('#ward-update option:selected').text()
                let valueArray = [addressValue, wardValue, districtValue, cityValue, countryValue]
                valueArray = valueArray.filter((item)=> item !== '')
                let fullAddressValue = valueArray.join(', ')
                this.$fullAddressTextAreaUpdate.val(fullAddressValue)
                this.$addressModalUpdate.modal('hide')
                $(this.modalUpdateId).modal('show')
            })
        }

        handleOpenUpdateModal(modalUpdateId, btnUpdateClass, formUpdateId){
            const btnUpdateClassSelector = '.'  + btnUpdateClass
            $(document).on('click', btnUpdateClassSelector, (e)=> {
                let modal = $(modalUpdateId)
                const id = $(e.currentTarget).attr('data-id')
                const urlUpdate = $('#update-url-script').attr(this.dataUpdateUrl)
                $(formUpdateId).attr('data-url', urlUpdate.replace('/0', `/${id}`))
                const url = $(formUpdateId).attr('data-url')

                $.fn.callAjax2({
                    'url': url,
                    'method': 'GET',
                    'isLoading': true
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data['bank_detail']) {
                            this.loadDetailData(data['bank_detail'], modal)
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            })
        }

        loadDetailData(data, $detailModal){
            $detailModal.find('#abbreviation-update').val(data?.['abbreviation'])
            $detailModal.find('#vietnamese-name-update').val(data?.['vietnamese_name'])
            $detailModal.find('#english-name-update').val(data?.['english_name'])
            $detailModal.find('#full-address-update').val(data?.['full_address'])
            this.$addressTextAreaUpdate.val(data?.['address'])

            this.$countrySelectUpdate.val('').trigger('change:select2')
            this.$citySelectUpdate.val('').trigger('change:select2')
            this.$districtSelectUpdate.val('').trigger('change:select2')
            this.$wardSelectUpdate.val('').trigger('change:select2')

            this.$countrySelectUpdate.initSelect2({
                'data': [data?.['country']]
            })
            this.$citySelectUpdate.initSelect2({
                'dataParams': {
                    'country_id': data?.['country']?.['id']
                },
                'data': [data?.['city']]
            })
            this.$districtSelectUpdate.initSelect2({
                'dataParams': {
                    'city_id': data?.['city']?.['id']
                },
                'data': [data?.['district']]
            })
            this.$wardSelectUpdate.initSelect2({
                'dataParams': {
                    'district_id': data?.['district']?.['id']
                },
                'data': [data?.['ward']]
            })
        }
    }

    class BankAccountHandler extends CommonHandler{
        constructor(options) {
            super(options);
            this.$bankAbbreviationSelect = $('#bank-abbreviation')
            this.$currencySelect = $('#currency')
            this.$brandNameInput = $('#brand-name')

            this.$bankAbbreviationSelectUpdate = $('#bank-abbreviation-update')
            this.$bankNameInputUpdate = $('#bank-name-update')
            this.$accountNumberInputUpdate = $('#account-number-update')
            this.$bankOwnerInputUpdate = $('#bank-owner-update')
            this.$currencySelectUpdate = $('#currency-update')
            this.$isBrandInputUpdate = $('#brand-update')
            this.$brandNameInputUpdate = $('#brand-name-update')
            this.$brandFullAddressTextAreaUpdate = $('#brand-full-address-update')
        }

        init() {
            super.init()
            this.initSelect2()
            this.handleSelectCity()
            this.handleSelectDistrict()
            this.handleSaveAddress()
            this.handleSelectBrand()
        }

        handleOpenUpdateModal(modalUpdateId, btnUpdateClass, formUpdateId){
            const btnUpdateClassSelector = '.'  + btnUpdateClass
            $(document).on('click', btnUpdateClassSelector, (e)=> {
                let modal = $(modalUpdateId)
                const id = $(e.currentTarget).attr('data-id')
                const urlUpdate = $('#update-url-script').attr(this.dataUpdateUrl)
                $(formUpdateId).attr('data-url', urlUpdate.replace('/0', `/${id}`))
                const url = $(formUpdateId).attr('data-url')

                $.fn.callAjax2({
                    'url': url,
                    'method': 'GET',
                    'isLoading': true
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data['bank_account_detail']) {
                            this.loadDetailData(data['bank_account_detail'], modal)
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            })
        }

        handleSubmitForm(formId, modalId, dataTableId){
            new SetupFormSubmit($(formId)).validate({
                submitHandler:  (form) => {
                    let frm = new SetupFormSubmit($(form))
                    if (frm.dataMethod === 'PUT') {
                        this.setupSubmitDataUpdate(frm)
                    } else {
                        this.setupSubmitData(frm)
                    }
                    let data_url =  $(formId).attr('data-url')
                    $.fn.callAjax2({
                        'url': data_url,
                        'method': frm.dataMethod,
                        'data': frm.dataForm,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $(modalId).modal('hide');
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                this.clearAddressData()
                                $(dataTableId).DataTable().ajax.reload();
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
                }
            })
        }

        setupSubmitData(frm) {
            if(frm['dataForm']['is_brand']){
                frm['dataForm']['brand_district'] = this.$districtSelect.val()
                frm['dataForm']['brand_city'] = this.$citySelect.val()
                frm['dataForm']['brand_ward'] = this.$wardSelect.val()
                frm['dataForm']['brand_country'] = this.$countrySelect.val()
                frm['dataForm']['brand_address'] = this.$addressTextArea.val()
            } else {
                delete frm['dataForm']['brand_district']
                delete frm['dataForm']['brand_city']
                delete frm['dataForm']['brand_ward']
                delete frm['dataForm']['brand_country']
                delete frm['dataForm']['brand_address']
            }
        }

        setupSubmitDataUpdate(frm){
            if(frm['dataForm']['is_brand']){
                frm['dataForm']['brand_district'] = this.$districtSelectUpdate.val()
                frm['dataForm']['brand_city'] = this.$citySelectUpdate.val()
                frm['dataForm']['brand_ward'] = this.$wardSelectUpdate.val()
                frm['dataForm']['brand_country'] = this.$countrySelectUpdate.val()
                frm['dataForm']['brand_address'] = this.$addressTextAreaUpdate.val()
            } else {
                delete frm['dataForm']['brand_district']
                delete frm['dataForm']['brand_city']
                delete frm['dataForm']['brand_ward']
                delete frm['dataForm']['brand_country']
                delete frm['dataForm']['brand_address']
            }
        }

        initSelect2(){
            this.$countrySelect.initSelect2();
            this.$citySelect.initSelect2()
            this.$districtSelect.initSelect2()
            this.$wardSelect.initSelect2()
            this.$bankAbbreviationSelect.initSelect2()
            this.$currencySelect.initSelect2()
        }

        handleSaveAddress(){
            $(document).off('click', '#btn-save-address').on('click', '#btn-save-address', (e)=>{
                const addressValue = this.$addressTextArea.val()
                const countryValue = $('#country option:selected').text()
                const cityValue = $('#city option:selected').text()
                const districtValue = $('#district option:selected').text()
                const wardValue = $('#ward option:selected').text()
                let valueArray = [addressValue, wardValue, districtValue, cityValue, countryValue]
                valueArray = valueArray.filter((item)=> item !== '')
                let fullAddressValue = valueArray.join(', ')
                this.$brandFullAddressTextArea.val(fullAddressValue)
                this.$addressModal.modal('hide')
                $(this.modalId).modal('show')
            })
             $(document).off('click', '#btn-save-address-update').on('click', '#btn-save-address-update', (e)=>{
                const addressValue = this.$addressTextAreaUpdate.val()
                const countryValue = $('#country-update option:selected').text()
                const cityValue = $('#city-update option:selected').text()
                const districtValue = $('#district-update option:selected').text()
                const wardValue = $('#ward-update option:selected').text()
                let valueArray = [addressValue, wardValue, districtValue, cityValue, countryValue]
                valueArray = valueArray.filter((item)=> item !== '')
                let fullAddressValue = valueArray.join(', ')
                this.$brandFullAddressTextAreaUpdate.val(fullAddressValue)
                this.$addressModalUpdate.modal('hide')
                $(this.modalUpdateId).modal('show')
            })
        }

        handleSelectBrand(){
            $(document).on('change', '#brand', (e)=>{
                if(!$(e.currentTarget).is(':checked')){
                    // when unselect checkbox
                    this.$brandNameInput.val('').attr('readonly', true).attr('required', false)
                    this.$brandFullAddressTextArea.val('').attr('readonly', true).attr('required', false)
                    $(this.modalId).find('a.edit-address').addClass('disabled').attr('data-bs-target', '').attr('data-bs-toggle', '')
                } else {
                    // when select checkbox
                    this.$brandNameInput.attr('readonly', false).attr('required', true)
                    this.$brandFullAddressTextArea.attr('readonly', false).attr('required', true)
                    $(this.modalId).find('a.edit-address').removeClass('disabled').attr('data-bs-target', '#modal-address').attr('data-bs-toggle', 'modal')
                }
            })
            $(document).on('change', '#brand-update', (e)=>{
                if(!$(e.currentTarget).is(':checked')){
                    // when unselect checkbox
                    this.$brandNameInputUpdate.val('').attr('readonly', true).attr('required', false)
                    this.$brandFullAddressTextAreaUpdate.val('').attr('readonly', true).attr('required', false)
                    $(this.modalUpdateId).find('a.edit-address-update').addClass('disabled').attr('data-bs-target', '').attr('data-bs-toggle', '')
                } else {
                    // when select checkbox
                    this.$brandNameInputUpdate.attr('readonly', false).attr('required', true)
                    this.$brandFullAddressTextAreaUpdate.attr('readonly', false).attr('required', true)
                    $(this.modalUpdateId).find('a.edit-address-update').removeClass('disabled').attr('data-bs-target', '#modal-address-update').attr('data-bs-toggle', 'modal')
                }
            })
        }

        loadDetailData(data, $detailModal){
            this.$bankAbbreviationSelectUpdate.initSelect2({
                'data': [data?.['bank_abbreviation']]
            })
            this.$bankNameInputUpdate.val(data?.['bank_name'])
            this.$accountNumberInputUpdate.val(data?.['bank_account_number'])
            this.$bankOwnerInputUpdate.val(data?.['bank_owner'])
            this.$currencySelectUpdate.initSelect2({
                'data': [data?.['currency']]
            })
            this.$brandFullAddressTextAreaUpdate.val(data?.['bank_full_address'])
            if(data?.['is_brand']){
                this.$isBrandInputUpdate.attr('checked', true)
                this.$brandNameInputUpdate.attr('readonly', false).attr('required', true)
                this.$brandFullAddressTextAreaUpdate.attr('readonly', false).attr('required', true)
                $(this.modalUpdateId).find('a.edit-address-update').removeClass('disabled').attr('data-bs-target', '#modal-address-update').attr('data-bs-toggle', 'modal')

                this.$brandNameInputUpdate.val(data?.['brand_name'])
                this.$brandFullAddressTextAreaUpdate.val(data?.['brand_full_address'])
            } else {
                this.$isBrandInputUpdate.attr('checked', false)
            }


            this.$addressTextAreaUpdate.val(data?.['brand_address'])

            this.$countrySelectUpdate.val('').trigger('change:select2')
            this.$citySelectUpdate.val('').trigger('change:select2')
            this.$districtSelectUpdate.val('').trigger('change:select2')
            this.$wardSelectUpdate.val('').trigger('change:select2')

            this.$countrySelectUpdate.initSelect2({
                'data': [data?.['brand_country']]
            })
            this.$citySelectUpdate.initSelect2({
                'dataParams': {
                    'country_id': data?.['brand_country']?.['id']
                },
                'data': [data?.['brand_city']]
            })
            this.$districtSelectUpdate.initSelect2({
                'dataParams': {
                    'city_id': data?.['brand_city']?.['id']
                },
                'data': [data?.['brand_district']]
            })
            this.$wardSelectUpdate.initSelect2({
                'dataParams': {
                    'district_id': data?.['brand_district']?.['id']
                },
                'data': [data?.['brand_ward']]
            })
        }
    }

    const $navLinks = $('#tab-select-table .nav-link')

    const initCurrentTab = () => {
        const $activeLink = $navLinks.filter('.active');
        const activeHref = $activeLink.attr('href');
        let options={}
        switch (activeHref) {
            case '#section_fixed_asset_classification_group':
                options = {
                    currentSection: 'section_fixed_asset_classification_group',
                    dataTableId: '#datatable-fixed-asset-classification-group',
                    respKeyword: 'classification_group_list',
                }
                new CommonHandler(options).init()
                break;
            case '#section_fixed_asset_classification':
                options = {
                    currentSection: 'section_fixed_asset_classification',
                    dataTableId: '#datatable-fixed-asset-classification',
                    respKeyword: 'classification_list',
                }
                new CommonHandler(options).init()
                break;
            case '#section_tool_classification':
                options = {
                    currentSection: 'section_tool_classification',
                    dataTableId: '#datatable-tool-classification',
                    respKeyword: 'tool_classification_list',
                    modalUpdateId: '#modal-tool-classification-update',
                    btnUpdate: 'btnUpdateToolClassification',
                    formUpdateId: '#form-update-tool-classification',
                    modalId: '#modal-tool-classification',
                    formId: '#form-create-tool-classification',
                    dataUpdateUrl: 'data-tool-update-url'
                }
                new CommonHandler(options).init()
                break;
            case '#section_bank':
                options = {
                    currentSection: 'section_bank',
                    dataTableId: '#datatable-bank',
                    respKeyword: 'bank_list',
                    modalId: '#modal-bank',
                    formId: '#form-create-bank',
                    modalUpdateId: '#modal-bank-update',
                    btnUpdate: 'btnUpdateBank',
                    formUpdateId: '#form-update-bank',
                    dataUpdateUrl: 'data-bank-update-url'
                }
                new BankHandler(options).init()
                break;
            case '#section_bank_account':
                options = {
                    currentSection: 'section_bank_account',
                    dataTableId: '#datatable-bank-account',
                    respKeyword: 'bank_account_list',
                    modalId: '#modal-bank-account',
                    formId: '#form-create-bank-account',
                    modalUpdateId: '#modal-bank-account-update',
                    btnUpdate: 'btnUpdateBankAccount',
                    formUpdateId: '#form-update-bank-account',
                    dataUpdateUrl: 'data-bank-account-update-url'
                }
                new BankAccountHandler(options).init()
                break;
        }
    };

    $navLinks.on('click', function () {
        setTimeout(initCurrentTab, 100);
    });

    initCurrentTab()

})