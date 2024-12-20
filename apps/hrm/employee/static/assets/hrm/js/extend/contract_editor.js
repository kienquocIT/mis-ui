class editor_handle {
    init(){
        const $txtArea = $('#inp-remarks');
        const $tempLst = $('#template_list');
        let templateList = []
        if ($tempLst.length)
            templateList = JSON.parse($tempLst.text())
        const isReadonly = $txtArea.hasClass('contract-readonly')
        $txtArea.tinymce({
            height: 500,
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
                    item['url'] = staticStart + item['url'];
                    return item;
                }
            ),
            pagebreak_split_block: true,
            pagebreak_separator: '<span class="page-break-here"><!-- my page break --></span>',
            nonbreaking_force_tab: true,
            insertdatetime_formats: ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y', '%H:%M:%S', '%I:%M:%S %p'],
            content_css: $txtArea.attr('data-css-url-render'),
            content_style: `
                @import url('/static/assets/fonts/cambria/Cambria.ttf');
                @media print {
                    .mce-visual-caret {
                        display: none;
                    }
                }
            `,
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
                            $.fn.gettext('unsigned'),
                            $.fn.gettext('signed'),
                        ]
                        return `<span class="badge badge-${data === 0 ? 'soft-danger' : 'soft-green'}">${stt[data]}</span>`;
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
                    $('#tab-contract input[name="contract_id"]').remove()
                    $('#tab-contract').append(`<input type="hidden" value="${data.id}" id="contract_id" name="contract_id"/>`)

                    $('.contract-list').addClass('hidden')
                    $('.contract-edit').removeClass('hidden')
                    $('#contract_type_id').val(data.contract_type).trigger('change')
                    $('#gridCheck').prop('checked', data.limit_time)
                    $('#effected_date')[0]._flatpickr.setDate(data.effected_date)
                    $('#expired_date')[0]._flatpickr.setDate(data.expired_date)
                    $('#company_representative').attr('data-onload', JSON.stringify({...data.represent, selected: true}))
                        .append(`<option value="${data.represent.id}" selected>${data.represent.full_name}</option>`).trigger('change')
                    $('#signing_date')[0]._flatpickr.setDate(data.signing_date)
                    $('input[name="file_type"]').prop('checked', false)
                    $(`input[name="file_type"][value="${data.file_type}"]`).prop('checked', true)

                    $('.sign_check span').text(data.sign_status === true
                        ? $.fn.gettext('Signed') : $.fn.gettext('Unsigned')).addClass(data.sign_status === true
                    ? 'badge-soft-primary' : 'badge-soft-danger')
                    let attchElm = $('#attachment');
                    if (data.attachment) {
                        attchElm.find('.dm-uploader-results input[name="attachment"]').remove()
                        if (attchElm.find('.dm-uploader-initializer').length > 0)
                            attchElm.find('.dm-uploader').dmUploader("destroy");

                        if (attchElm.hasClass('contract-readonly'))
                            attchElm.find('.dm-uploader').addClass('hidden')

                        new $x.cls.file(
                            attchElm
                        ).init({
                            enable_choose_file: true,
                            enable_download: true,
                            name: 'attachment',
                            enable_edit: !attchElm.hasClass('contract-readonly'),
                            data: data.attachment,
                        })
                    }
                    tinymce.activeEditor.setContent(data.content)
                    $('.sign_check').removeClass('hidden')
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
        if (formSer['attachment'] && dataList.file_type === 0)
            dataList.attachment = $x.cls.file.get_val(formSer['attachment'], [])
        if (Object.keys(dataList).length < 8)
            return {}
        return dataList
    }
}