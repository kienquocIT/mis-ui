function callDetailData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data && data.hasOwnProperty('employee')) {
            return data.employee;
        }
        return {};
    });
}

// template for select2 of BANK FIELD
function renderTemplateBank(state){
    if (!state.id) return state.text
    return $(
        `<p><span class="text-bold">${state?.data?.code}</span>&nbsp;|&nbsp;${state?.data?.title}</p>`
    )
}

// init all field of create, edit, detail page
class EmployeeHRMInit {
    static userSelectEle = $('#select-box-user');
    static empSelectEle = $('#select-box-employee');
    static ElmNationality = $('#employee-nationality');
    static $tableDependentInfo = $('#table_dependent');

    static loadUserList() {
        EmployeeHRMInit.userSelectEle.initSelect2({
            allowClear: true,
            keyId: 'user--id',
            keyText: 'user--full_name'
        }).on('select2:select', function (e) {
            const user = e.params?.data?.data.user;
            if (user){
                let middName = user.first_name.split(" ")
                middName.shift()
                $('#employee-first_name').val(user.last_name);
                $('#employee-middle_name').val(middName.join(" "));
                $('#employee-last_name').val(user.first_name.split(" ")[0]);
                $('#employee-date-joined')[0]._flatpickr.setDate(new Date())
                $('#employee-email').val(user.email)
                $('#employee-phone').val(user.phone)
                $('#employee-code').val(user.code)
                $('.switch-choice, .select-wrap').removeClass('is-select')
                $('#new_employee').val($x.cls.util.generateUUID4())
            }
        });
    }

    static loadEmpList(empData){
        const $userElm = $(`#select-box-user`)
        EmployeeHRMInit.empSelectEle.initSelect2({
            allowClear: true,
            keyId: 'employee--id',
            keyText: 'employee--full_name',
            data: (empData ? {'employee': empData} : null),
        }).on('select2:select', function(e){
            const empl = e.params.data.data.employee;
            let middName = empl.last_name.split(" ")
            middName.shift()
            $('#employee-first_name').val(empl.first_name);
            $('#employee-middle_name').val(middName.join(" "));
            $('#employee-last_name').val(empl.last_name.split(" ")[0]);
            $('#employee-date-joined')[0]._flatpickr.setDate(new Date(empl.date_joined))
            $('#employee-email').val(empl.email)
            $('#employee-phone').val(empl.phone)
            $('#employee-code').val(empl.code)
            if(Object.keys(empl.user).length > 0){
                EmployeeHRMInit.userSelectEle.attr('data-onload', JSON.stringify({...empl.user, selected: true}))
                const ElmUser = $(`#select-box-user option[value="${empl.user.id}"]`)
                if (ElmUser.length <= 0)
                    $userElm.append(`<option value="${empl.user.id}">${empl.user.last_name + ' ' + empl.user.first_name}</option>`).trigger('change')
                else ElmUser.prop('selected', true).trigger('change')
            }
            else $userElm.val('').trigger('change')
            $userElm.prop('disabled', true)
        }).on('select2:unselect', function(){
            $userElm.val('').trigger('change').prop('disabled', false)
        })
    }

    static loadDate(elm, dobData) {
        elm.flatpickr({
            'allowInput': true,
            'altInput': true,
            'altFormat': 'd/m/Y',
            'dateFormat': 'Y-m-d',
            'defaultDate': dobData || null,
            'locale': globeLanguage === 'vi' ? 'vn' : 'default',
            'shorthandCurrentMonth': true,
        })
    }

    static loadPOI(elm, value){
        elm.initSelect2({
            allowClear: true,
            keyId: 'id',
            keyText: 'title',
            data: (value ? {'cities': value} : null)
        })
    }

    static loadNationality(value){
        EmployeeHRMInit.ElmNationality.initSelect2({
            allowClear: true,
            keyId: 'id',
            keyText: 'title',
            data: (value ? {'cities': value} : null)
        })
    }

    static switchChoice(){
        $('.switch-choice').on('click', function(){
            $(this).toggleClass("is-select")
            if ($('#select-box-employee').attr('readonly') !== 'readonly')
                $(this).next().toggleClass("is-select")
        })
    }

    static loadDetail(option = 'detail'){
        $.fn.callAjax2({
            url: $('#frm_employee_hrm').attr('data-hrm-detail'),
            method: 'get',
            isLoading: true,
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                const employee = data?.employee || {};
                let middName = (employee?.last_name|| "").split(" ");
                middName.shift();
                $('#frm_employee_hrm').append(`<input type="hidden" name="id" value="${data?.id || ''}">`);
                $('.switch-choice, .select-wrap').addClass('is-select');
                $('#select-box-employee').attr('data-onload', {
                    ...employee,
                    selected: true
                }).append(`<option value="${employee?.id || ''}" selected>${employee?.full_name || ''}</option>`).trigger('change');
                $('#employee-first_name').val(employee?.first_name || '');
                $('#employee-middle_name').val(middName.join(" "));
                $('#employee-last_name').val((employee?.last_name || '').split(" ")[0]);
                $('#date_joined')[0]._flatpickr.setDate(new Date(employee.date_joined));
                $('#employee-email').val(employee?.email || '');
                $('#employee-phone').val(employee?.phone || '');
                $('#employee-code').val(employee?.code || '');

                if (data.employee.user?.id) {
                    $('#select-box-user').attr(
                        'data-onload',
                        {
                            ...data.employee.user,
                            selected: true
                        }
                    ).append(
                        `<option value="${data.employee.user.id}" selected>${
                            data.employee.user.first_name + ' ' + data.employee.user.last_name}</option>`).trigger('change')
                };
                $('#employee-citizen_id').val(data?.['citizen_id'] || '');
                $('#employee_doi')[0]._flatpickr.setDate(new Date(data?.['date_of_issue'] || ''));
                $('#place_of_issue').val(data?.['place_of_issue'] || '');
                $('#employee-dob')[0]._flatpickr.setDate(new Date(employee?.dob || ''));
                if (Object.keys(data['place_of_birth']).length > 0)
                    $('#employee-pob').attr('data-onload', JSON.stringify(data?.['place_of_birth'])).append(
                        `<option value="${data?.['place_of_birth'].id}" selected>${data?.['place_of_birth'].title}</option>`
                    ).trigger('change');
                if (Object.keys(data['nationality']).length > 0)
                    $('#employee-nationality').attr('data-onload', JSON.stringify(data['nationality'])).append(
                        `<option value="${data['nationality'].id}" selected>${data['nationality'].title}</option>`
                    ).trigger('change');
                if (Object.keys(data['place_of_origin']).length > 0)
                    $('#employee-poo').attr('data-onload', JSON.stringify(data['place_of_origin'])).append(
                        `<option value="${data['place_of_origin'].id}" selected>${data['place_of_origin'].title}</option>`
                    ).trigger('change');
                $('#employee-ethnicity').val(data?.['ethnicity'] || '');
                $('#employee-religion').val(data?.['religion'] || '');
                $('#employee-gender').val(data['gender']).trigger('change');
                $('#employee-mstt').val(data['marital_status']).trigger('change');
                $('#employee-ban').val(data?.['bank_acc_no'] || '');
                $('#employee-acc_name').val(data?.['acc_name'] || '');
                $('#employee-bank_name').val(data['bank_name']).trigger('change');
                $('#employee-tax_code').val(data?.['tax_code'] || '');
                $('#employee-permanent_address').val(data?.['permanent_address'] || '');
                $('#employee-current_resident').val(data?.['current_resident'] || '');
                EmployeeHRMInit.initDependentTable(data?.['dependent_deduction'] || [], option);

                $(document).trigger('detail.DetailLoaded');
                UsualLoadPageFunction.DisablePage(option === 'detail' ? true : false);
            }
        })
    }

    static loadBank(){
        $('#employee-bank_name').initSelect2({
            allowClear: true,
            templateResult: renderTemplateBank,
        })
    }

    static initDependentTable(data = [], option='create') {
        this.$tableDependentInfo.DataTable().destroy();
        this.$tableDependentInfo.DataTableDefault({
            data: data,
            styleDom: 'hide-foot',
            rowIdx: true,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            reloadCurrency: true,
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return '';
                    }
                },
                {
                    className: "w-25",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control row-dependent-id" 
                                type="text" required>`;
                    }
                },
                {
                    className: "w-30",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control row-dependent-title" 
                                type="text" required>`;
                    }
                },
                {
                    className: "w-30",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control row-dependent-address" 
                                type="text" required>`;
                    }
                },
                {
                    className: "w-10 text-center",
                    render: () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''}
                                   type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row">
                                   <span class="icon"><i class="far fa-trash-alt"></i></span>
                              </button>`;
                    }
                },
            ],
            initComplete: function() {
                EmployeeHRMInit.$tableDependentInfo.find('tbody tr').each(function (index, ele) {
                    $(ele).find('.row-dependent-id').val(data[index]?.citizen_id || '')
                    $(ele).find('.row-dependent-title').val(data[index]?.dependent_full_name || '')
                    $(ele).find('.row-dependent-address').val(data[index]?.address || '')
                })
            }
        });
    }

    static combineDependentTable() {
        const dependentData = [];
        EmployeeHRMInit.$tableDependentInfo.find('tbody tr').each(function () {
            let item = {
                citizen_id: $(this).find('.row-dependent-id').val() || '',
                dependent_full_name: $(this).find('.row-dependent-title').val() || '',
                address: $(this).find('.row-dependent-address').val() || '',
            };
            dependentData.push(item);
        });
        return dependentData;
    }
}

/** TAB CONTRACT HANDLE **/

class editor_handle {
    init(){
        const $txtArea = $('#inp-remarks');
        const $tempLst = $('#template_list');
        let templateList = []
        if ($tempLst.length)
            templateList = JSON.parse($tempLst.text())
        const isReadonly = $txtArea.hasClass('contract-readonly')
        $txtArea.tinymce({
            height: 1123,
            menubar: false,
            plugins: ['columns', 'print', 'preview', 'paste', 'importcss', 'searchreplace', 'autolink', 'autosave',
                'save', 'directionality', 'code', 'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media',
                'template', 'codesample', 'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc',
                'insertdatetime', 'advlist', 'lists', 'wordcount', 'imagetools', 'textpattern', 'noneditable',
                'help', 'charmap', 'quickbars', 'emoticons'],
            toolbar: 'bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist table twoColumn threeColumn | preview pagebreak removeformat print visualblocks | template | rarely_used',
            quickbars_insert_toolbar: 'link image | numlist bullist table twoColumn threeColumn | hr pagebreak',
            toolbar_groups: {
                rarely_used: {
                    icon: 'more-drawer',
                    tooltip: 'Rarely Used',
                    items: 'ltr rtl | charmap emoticons | superscript subscript | nonbreaking anchor media | undo redo | '
                }
            },
            font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Cambria=cambria,serif; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
            templates: templateList.map(
                (item) => {
                    item['content'] = item['template'];
                    item['description'] = JSON.stringify(item['extra_data'])
                    return item;
                }
            ),
            pagebreak_split_block: true,
            pagebreak_separator: '<span class="page-break-here"><!-- my page break --></span>',
            nonbreaking_force_tab: true,
            insertdatetime_formats: ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y', '%H:%M:%S', '%I:%M:%S %p'],
            content_css: $txtArea.attr('data-css-url-render'),
            content_style: `
                body { font-family: Cambria,sans-serif; font-size: 12pt; }
                @import url('/static/assets/fonts/cambria/Cambria.ttf');
                @media print {
                    .mce-visual-caret {
                        display: none;
                    }
                }
            `,
            setup: function (editor){
                editor.on('SetContent', function () {
                    const extra_data = $('.tox-dialog .tox-form__group[role="presentation"] p').text()
                    if (extra_data)
                        $('#extra_data').attr('value', extra_data)
                });
            },
        });
        if (isReadonly)
            tinymce.activeEditor.setMode('readonly');
    }
}

class contract_data {
    load_list(){
        const $contractTb = $('#datable_employee_contract_list')
        const CONTRACT_TYPE = JSON.parse($('#contract_type').text())
        const _this = this
        const _initTb = $contractTb.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: $contractTb.attr('data-url'),
                type: 'GET',
                data: function (d) {
                    d.employee_info = $('input[name="id"]').val();
                },
                dataSrc: "data.employee_contract_list",
            },
            pageLength: 50,
            columns: [
                {
                    data: 'code',
                    render: (row, index, data) => {
                        const color = {
                            0:'blue',
                            1:'primary',
                            2:'sky'
                        }
                        const href = $contractTb.attr('data-url-detail').format_url_with_uuid(data.id)
                        return `<a class="c-detail" href="#" data-href="${href}"><span class="badge badge-${color[data.contract_type]}">${row}</span></a>`
                    }
                },
                {
                    data: 'contract_type',
                    render: (data) => {
                        return `<strong>${CONTRACT_TYPE[data].title}</strong>`
                    }
                },
                {
                    data: 'effected_date',
                    class: 'text-center',
                    render: (data) => {
                        return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY')
                    }
                },
                {
                    data: 'expired_date',
                    class: 'text-center',
                    render: (data) => {
                        return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY')
                    }
                },
                {
                    data: 'sign_status',
                    class: 'text-center',
                    render: (data) => {
                        const stt = [
                            $.fn.gettext('Unsigned'),
                            $.fn.gettext('Signing'),
                            $.fn.gettext('Signed'),
                        ]
                        return `<span class="badge badge-${data === 0 ? 'soft-danger': data === 1 ? 'soft-warning' : 'soft-green'}">${stt[data]}</span>`;
                    }
                },
            ],
            rowCallback: function (row) {
                $(row).on('click', 'a.c-detail', function () {
                    _this.load_detail($(this).attr('data-href'))
                });
            }
        });

        // adjust colum to 100% when click show tab
        $('a[href="#tab-contract"]').on('shown.bs.tab', () => {
            $('.contract-list').removeClass('hidden')
            $('.contract-edit').addClass('hidden')
            _initTb.columns.adjust()
        });

        // click add new contract
        $('.new-contract').on('click', () =>{
            $('.contract-list').addClass('hidden');
            $('.contract-edit').removeClass('hidden');
            // handle reset attachment file
            $('#attachment .dm-uploader-no-files').show();
            $('#attachment .dm-uploader-result-list').html('');
            $('#attachment .dm-uploader').dmUploader("reset");
            $('#effected_date')[0]._flatpickr.clear()
            $('#expired_date')[0]._flatpickr.clear()
            $('#company_representative').val('').trigger('change')
            $('#signing_date')[0]._flatpickr.clear()
            $('input[name="file_type"]').prop('checked', false)
            $('#tab-contract #contract_id').remove()
            $('.sign_check').addClass('hidden')
            tinyMCE.activeEditor.setContent('');
        })

        // user click button REQUEST SIGNING
        const $requestElm = $('.request_sign');
        $('button', $requestElm).off().on('click', function(e){
            let dataRuntime = $('#extra_data').val();
            if (dataRuntime)
                dataRuntime = JSON.parse(dataRuntime);
            let data_prepare_submit = {
                'csrfmiddlewaretoken': $('#frm_employee_hrm input[name="csrfmiddlewaretoken"]').val(),
                'employee_contract': $('#contract_id').val(),
                'contract': tinymce.activeEditor.getContent(),
                'members': []
            }
            let matches = data_prepare_submit.contract.match(/{{(.*?)}}/g);
            if (matches)
                matches = matches.map(function (item) {
                    return item.replace(/{{|}}/g, '').trim();
                });
            // check data có user assign mặc định khi chọn template chưa
            if(Object.keys(dataRuntime).length){
                let signature_list = {}
                let check_flag = false
                for (let idx in dataRuntime){
                    const item = dataRuntime[idx]
                    if (!('id' in item)){
                        // nếu keyword ko có user thì mở popup add user
                        check_flag = true
                        break
                    }
                    else{
                        // kiểm tra xem keyword trong data template có trùng với keyword trong contract ko
                        if (matches.indexOf(idx) === -1){
                            check_flag = true
                            break
                        }
                        // lấy keyword add vào signature list
                        signature_list[idx] = {
                            'assignee': item,
                            'stt': false
                        }
                        data_prepare_submit['members'] = data_prepare_submit['members']
                            .concat(signature_list[idx]['assignee'])
                    }
                }
                if(check_flag) _this.modal_add_user_signing(matches);
                else{
                    data_prepare_submit['signatures'] = signature_list
                    _this.call_sign_request(data_prepare_submit)
                }
            }
            else {
                // nếu chưa có data user assign mặc định kiểm tra trong content
                if (matches) _this.modal_add_user_signing(matches)
                else{
                    $.fn.notifyB({description: $.fn.gettext('The assigned employee is missing, please verify again')}, 'failure');
                    return false
                }
            }
        });
    }

    load_detail(url=''){
        if (url)
            $.fn.callAjax2({
                url: url,
                method: 'get',
                isLoading: true,
                'sweetAlertOpts': {
                    'allowOutsideClick': true,
                    'showCancelButton': true
                }
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    const wrapElmContractForm = $('.contract-edit')
                    $('.contract-edit input[name="contract_id"]').remove()
                    wrapElmContractForm.append(`<input type="hidden" value="${data.id}" id="contract_id" name="contract_id"/>`)
                    .removeClass('hidden')

                    $('.contract-list').addClass('hidden')
                    $('#contract_type_id').val(data.contract_type).trigger('change')
                    $('#gridCheck').prop('checked', data.limit_time)
                    $('#effected_date')[0]._flatpickr.setDate(data.effected_date)
                    $('#expired_date')[0]._flatpickr.setDate(data.expired_date)
                    $('#company_representative').attr('data-onload', JSON.stringify({...data.represent, selected: true}))
                        .append(`<option value="${data.represent.id}" selected>${data.represent.full_name}</option>`).trigger('change')
                    $('#signing_date')[0]._flatpickr.setDate(data.signing_date)
                    $('input[name="file_type"]').prop('checked', false)
                    $(`input[name="file_type"][value="${data.file_type}"]`).prop('checked', true)
                    $('#extra_data').attr('value', data?.['content_info'] ? JSON.stringify(data.content_info) : '{}')

                    const signStt = [
                        {'text': $.fn.gettext('Unsigned'), 'class': 'badge-soft-danger'},
                        {'text': $.fn.gettext('Signing'), 'class': 'badge-soft-warning'},
                        {'text': $.fn.gettext('Signed'), 'class': 'badge-soft-green'}
                    ]
                    $('.sign_check span').text(signStt[data['sign_status']]['text'])
                        .addClass(signStt[data['sign_status']]['class'])
                    $('.sign_check').removeClass('hidden')

                    let attachElm = $('#attachment');
                    if (data.attachment) {
                        attachElm.find('.dm-uploader-results input[name="attachment"]').remove()
                        if (attachElm.find('.dm-uploader-initializer').length > 0)
                            attachElm.find('.dm-uploader').dmUploader("destroy");

                        if (attachElm.hasClass('contract-readonly'))
                            attachElm.find('.dm-uploader').addClass('hidden')

                        new $x.cls.file(
                            attachElm
                        ).init({
                            enable_choose_file: true,
                            enable_download: true,
                            name: 'attachment',
                            enable_edit: !attachElm.hasClass('contract-readonly'),
                            data: data.attachment,
                        })
                    }

                    if (data['sign_status'] >= 1) tinymce.activeEditor.setMode('readonly');
                    tinymce.activeEditor.setContent(data.content)

                    if (data['sign_status'] === 0)
                        $('.request_sign').removeClass('hidden')
                }
            });
    }

    valid_data(){
        const formSer = $('#frm_employee_hrm').serializeObject()
        let dataList = {};
        if (formSer['contract_type']) dataList.contract_type = parseInt(formSer['contract_type'])
        dataList.limit_time = formSer.limit_time
        dataList.employee_info = formSer.id
        if (formSer['contract_id']) dataList.id = formSer['contract_id']
        if (formSer['effected_date']) dataList.effected_date = formSer['effected_date']
        if (formSer['expired_date']) dataList.expired_date = formSer['expired_date']
        if (formSer['company_representative']) dataList.represent = formSer['company_representative']
        if (formSer['signing_date']) dataList.signing_date = formSer['signing_date']
        if (formSer['file_type']) dataList.file_type = parseInt(formSer['file_type'])
        if (formSer['remarks'] && dataList.file_type === 1) dataList.content = formSer['remarks']
        if (formSer['content_info']){
            let dataParse = {}
            try {
                dataParse = JSON.parse(formSer['content_info']);
            }
            catch {
                console.log('parse data error')
            }
            let temp = []
            let matches = dataList.content.match(/{{(.*?)}}/g);
            if (matches) {
                matches = matches.map(function (item) {
                    return item.replace(/{{|}}/g, '').trim();
                });
                for (let key in dataParse) {
                    if (matches.indexOf(key) === -1) temp.push(key)
                }
            } else if (!matches && Object.keys(dataParse).length > 0) dataParse = {}
            for (let idx in temp) {
                const value = temp[idx]
                delete dataParse[value]
            }
            dataList.content_info = dataParse
        }
        if (formSer['attachment'] && dataList.file_type === 0)
            dataList.attachment = $x.cls.file.get_val(formSer['attachment'], [])
        if (Object.keys(dataList).length < 8)
            return {}
        return dataList
    }

    modal_add_user_signing(data){
        const $ModalElm = $('#modal_prepare_sign');
        const _this = this
        if (data){
            let html = ''
            for (let item of data) {
                html += `<div class="item_sign">` +
                    `<input type="text" class="form-control" readonly value="${item}"><strong> : </strong>` +
                    `<div><select class="form-select" id="sign_emp_${item}" data-allowClear="true" data-closeOnSelect="true"></select></div></div>`
            }
            $ModalElm.find('.modal-body').html('').append(html)
            $('.modal-body select', $ModalElm).each(function () {
                $(this).initSelect2({
                    ajax: {
                        url: $('#url-factory').attr('data-employee'),
                        method: 'GET',
                    },
                    keyResp: 'employee_list',
                    keyText: 'full_name',
                    keyId: "id",
                }).on('select2:select', function(e){
                    $(this).data('data', e.params.data.data)
                })
            });
            $ModalElm.modal('show')
            $('#submit_runtime').off().on('click', function(e){
                e.preventDefault();
                let data_form = {
                    'csrfmiddlewaretoken': $('#frm_employee_hrm input[name="csrfmiddlewaretoken"]').val(),
                    'employee_contract': $('#contract_id').val(),
                    'contract': tinymce.activeEditor.getContent(),
                }
                let signature_list = {}
                let value_count = 0
                $('.item_sign').each(function () {
                    const key = $(this).find('input').val();
                    const value = $(this).find('select[id*="sign_emp_"]').data('data') || {}
                    const old = data_form.members || []
                    if (!Object.keys(value).length) return false
                    value_count++
                    signature_list[key] = {
                        'assignee': value,
                        'stt': false
                    }
                    data_form.members = old.concat([value])
                });
                data_form['signatures'] = signature_list
                if (value_count !== data.length) {
                    $('#modal_prepare_sign').prepend(`<ul><li><p class="text-warning">${
                        $.fn.gettext('Signature and employee not equal')}</p></li></ul>`)
                    return false
                }
                _this.call_sign_request(data_form);
                $ModalElm.modal('hide');
            })
        }
    }

    call_sign_request(data){
        $.fn.callAjax2({
            url: $('#url-factory').attr('data-contract-sign'),
            method: 'POST',
            isLoading: true,
            sweetAlertOpts: {
                'allowOutsideClick': true,
                'showCancelButton': true
            },
            data: data
        }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: data.message}, 'success');
                    $('#modal_prepare_sign').modal('hide');
                    $('.request_sign').addClass('hidden');
                    $('.sign_check span').text($.fn.gettext('Signing'))
                        .removeClass('badge-soft-secondary').addClass('badge-soft-primary')
                }
            },
            (error) => {
                $.fn.notifyB({description: error.data.errors}, 'failure');
            });
    }
}

/** EVENT HANDLE **/
class EmployeeInfoEventHandler {
    static InitPageEvent() {
        // event when click add button
        $('#add_dependent').on('click', function() {
            UsualLoadPageFunction.AddTableRow($('#table_dependent'));
        });

        // event for deleting row
        $('#table_dependent').on('click', '.del-row', function() {
            UsualLoadPageFunction.DeleteTableRow(
                $('#table_dependent'),
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
        });
    }
}
