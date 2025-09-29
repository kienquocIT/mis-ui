function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const icon_map = {
    'folder': '<i class="bi bi-folder2"></i>',
    'pdf': '<i class="bi bi-file-earmark-pdf"></i>',
    'img': '<i class="bi bi-file-image"></i>',
    'webp': '<i class="bi bi-file-binary"></i>',
    'txt': '<i class="bi bi-file-earmark-text"></i>',
    'doc': '<i class="bi bi-file-earmark-word"></i>',
    'xls': '<i class="bi bi-file-earmark-excel"></i>',
    'csv': '<i class="fa-solid fa-file-csv"></i>',
    'audio': '<i class="bi bi-speaker"></i>',
    'video': '<i class="bi bi-file-play"></i>',
    'zip': '<i class="bi bi-file-earmark-zip"></i>',
}

function convertKeyIconMap (dataType){
    let key = 'folder';
    if (dataType?.['file_type']){
        const fileType = dataType.file_type;
        if (fileType.indexOf('.sheet') !== -1 || fileType.indexOf('.ms-excel') !== -1) key = 'xls'
        else if (fileType.indexOf('msword') !== -1 || fileType.indexOf('.document') !== -1) key = 'doc'
        else if (fileType === 'application/pdf') key = 'pdf'
        else if (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png' || fileType === 'image/gif') key = 'img'
        else if (fileType === 'image/webp') key = 'webp'
        else if (fileType === 'text/plain') key = 'txt'
        else if (fileType === 'text/csv' || fileType === 'application/csv' || fileType === 'application/x-csv'
            || fileType === 'text/x-csv' ) key = 'csv'
        else if (fileType.indexOf('audio/') !== -1) key = 'audio'
        else if (fileType.indexOf('video/') !== -1) key = 'video'
        else if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed'
            || fileType === 'application/x-rar-compressed' || fileType === 'application/octet-stream'
            || fileType.indexOf('.rar') !== -1 || fileType === 'application/x-7z-compressed'
            || fileType === 'application/x-tar' || fileType === 'application/gzip' || fileType === 'application/x-gzip'
            || fileType === 'application/x-bzip2') key = 'zip'
    }
    return key
}

class popupPermission {
    load_group_list() {
        const _this = this;
        const $table = $('#table_group');
        $table.DataTableDefault({
            useDataServer: true,
            paging: false,
            info: false,
            searching: false,
            scrollY: '250px',
            ajax: {
                url: $table.attr('data-url'), type: 'get', data: function (d) {
                    d.pageSize = -1
                }, dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('group_dd_list')) {
                        return resp.data['group_dd_list'] ? [{
                            id: "all_com", title: $.fn.gettext('All company'), code: 'all'
                        }, ...resp.data['group_dd_list']] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [{
                data: 'id', render: (row, index, data) => {
                    return `<div class="form-check"><input type="checkbox" id="radio_${
                        data.code}" class="form-check-input" value="${data.id}"><label title="${data.title
                    }" for="radio_${data.code}" class="form-check-label">${data.title}</label>`;
                },
            },],
            rowCallback: function (row, data) {
                $(row).find('input').on('change', function () {
                    let state = $(this).prop('checked');
                    const is_all = data?.id === 'all_com'
                    if (state)
                        $(this).closest('tr').addClass('selected')
                    else{
                        $(this).closest('tr').removeClass('selected')
                    }

                    if (state && data?.id && parseInt($('input[name="kind"]:checked').val()) === 1) {
                        let params = data?.id === 'all_com' ? {pageSize: -1} : {group_id: data.id};
                        _this.get_employee(params, is_all)
                    }
                    else _this.load_employee_list([], is_all)
                    if (is_all) $('tbody tr td input:not([value="all_com"])', $table).prop('checked', false)
                });
            },
        })
    }

    load_employee_list(data, is_all) {
        const $empTbl = $('#table_employee');
        if ($empTbl.hasClass('dataTable')) {
            if (is_all) $empTbl.DataTable().clear().rows.add(data).draw()
            else {
                if (data.length === 0) $empTbl.DataTable().clear().draw()
                else $empTbl.DataTable().rows.add(data).draw()
            }
        } else {
            $empTbl.DataTableDefault({
                paging: false,
                info: false, // searching: false,
                scrollY: '250px',
                scrollX: '1023px',
                scrollCollapse: true,
                data: data,
                columns: [
                    {
                        data: 'id',
                        width: '5%',
                        render: (row, index, data) => {
                            return `<div class="form-check"><input type="checkbox" id="radio_${data.code
                            }" class="form-check-input" value="${data.id}" ${data?.selected ? 'checked' : ''}></div>`;
                        }
                    },
                    {
                        data: "code",
                        width: '35%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        data: "full_name",
                        width: '30%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        data: 'group',
                        width: '30%',
                        render: (row) => {
                            return row?.title || '--'
                        }
                    }
                ],
            })
        }
        $('thead tr td input#checkbox_all', $empTbl).off().on('change', function () {
            const is_checked = $(this).prop('checked')
            $('tbody tr td input', $empTbl).prop('checked', is_checked)
        })
    }

    get_employee(params, all) {
        const _this = this
        $.fn.callAjax2({
            url: $('#table_employee').attr('data-url'), method: 'get', data: params
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                _this.load_employee_list(data.employee_list, all)
            }
        })
    }

    add_new_recipient() {
        const $btn = $('#add_selected');
        const $groupTbl = $('#table_group');
        const $empTbl = $('#table_employee');
        $btn.off().on('click', function () {
            $(this).prop('disabled', true)
            const owner_list = {};
            const show_list = [];
            const dataGroup = $groupTbl.DataTable().data().toArray();

            if (parseInt($('input[name="kind"]:checked').val()) === 2) {  // nếu chọn recipient là group
                if ($('#radio_all').prop('checked')) {
                    owner_list['all_com'] = {
                        id: 'all_com', title: $.fn.gettext('All Company')
                    }
                    show_list.push(`<span class="badge badge-soft-primary">${$.fn.gettext('All Company')}</span>`)
                }
                else {
                    $groupTbl.DataTable().rows().every(function () {
                        let row = this.node();
                        if ($('input', row).prop('checked')) {
                            const idx = $(row).index();
                            owner_list[dataGroup[idx].id] = dataGroup[idx]
                            show_list.push(`<span class="badge badge-soft-primary">${dataGroup[idx].title}</span>`)
                        }
                    });
                }
                const $elmGroupData = $('input[name="group_access"]');
                $elmGroupData.data('group', owner_list)
            }
            else {
                const dataEmp = $empTbl.DataTable().data().toArray();
                $empTbl.DataTable().rows().every(function () {
                    let row = this.node();
                    if ($('input', row).prop('checked')) {
                        const idx = $(row).index();
                        owner_list[dataEmp[idx].id] = dataEmp[idx]
                        show_list.push(`<span class="badge badge-soft-primary">${dataEmp[idx].full_name}</span>`)
                    }
                });

                if (Object.keys(owner_list).length === 0) {
                    $.fn.notifyB({'description': $.fn.gettext('Please select employee')}, 'failure')
                    return false
                }
                const $elmEmpData = $('input[name="employee_access"]');
                $elmEmpData.data('employee', owner_list)

                const stored_group = {}
                $groupTbl.DataTable().rows().every(function () {
                    let row = this.node();
                    if ($('input', row).prop('checked')) {
                        const idx = $(row).index();
                        stored_group[dataGroup[idx].id] = dataGroup[idx]
                    }
                });
                const $elmGroupData = $('input[name="group_access"]');
                $elmGroupData.data('group', stored_group)
            }
            $('.employee-added > div').html(show_list)
            $(this).prop('disabled', false)
        })
    }

    switch_kind() {
        const $elmGroupData = $('#frm_folder input[name="group_access"]');
        const $elmEmpData = $('#frm_folder input[name="employee_access"]');
        $('#frm_folder input[name="kind"]').on('change', function () {
            if (this.value === 'employee') $elmGroupData.data('group', [])
            else {
                $elmEmpData.data('employee', [])
                // un-check all user in table
                $('#table_employee tr td input').prop('checked', false)
            }
            $('.employee-added > div').html('')
        });
    }

    btn_perm() {
        $('input[name="radio_perm_file"]').off().on('change', function () {
            // $('#checkbox_review, #checkbox_download, #checkbox_edit_f_attr, #checkbox_share, #checkbox_upload_ver, ' +
            //     '#checkbox_duplicate, #checkbox_edit_f').prop('checked', false)
            const $elementLst = $('#checkbox_see, #folder_upload_file, #folder_create_subfolders, #folder_delete, ' +
                '#folder_share, #checkbox_review, #checkbox_edit_f')
            $elementLst.prop('checked', false)
            switch (parseInt(this.value)) {
                case 1:
                    $('#checkbox_review').prop('checked', true);
                    break;
                case 2:
                    $('#checkbox_see, #checkbox_review').prop('checked', true);
                    break;
                case 3:
                    $('#checkbox_see, #folder_delete, #checkbox_review').prop('checked', true);
                    break;
                default:
                    $elementLst.prop('checked', true)
                    break;
            }
        })
    }

    init_date_exp() {
        const $inp = $('input[name="expiration_date"]')
        $inp.flatpickr({
            allowInput: true,
            altInput: true,
            altFormat: 'd/m/Y',
            defaultDate: null,
            locale: globeLanguage === 'vi' ? 'vn' : 'default',
            shorthandCurrentMonth: true,
            onReady: function (dObj, dStr, fp){
                $(fp.element.nextSibling).attr('aria-label', 'input_expired')
                    .attr('id', 'input_expired')
            },
        }).set('clickOpens', false)

        $('#enabled_switch').on('change', function () {
            if (!$(this).prop('checked')) {
                $inp[0]._flatpickr.clear()
                $inp[0]._flatpickr.set('clickOpens', false)
                $inp.prop('readonly', true)
                $inp.next().prop('disabled', true)
            } else {
                $inp.prop('readonly', false)
                $inp.next().prop('disabled', false)
                $inp[0]._flatpickr.set('clickOpens', true)
            }
        })
    }

    save_popup() {
        const _this = this;
        const $form_popup = this.$form;
        const $urlF = $('#url-factory')

        $('#btn_update_perm').off().on('click', function (e) {
            e.preventDefault();
            const _data = $form_popup.serializeObject();
            // validate data
            const emp_lst = $('input[name="employee_access"]').data('employee') || {}
            const group_lst = $('input[name="group_access"]').data('group') || {}
            if (Object.keys(emp_lst).length === 0 && Object.keys(group_lst).length === 0) {
                $.fn.notifyB({'description': $.fn.gettext('Employee or Group are empty')}, 'failure')
                return false
            }

            let folder_perm = []
            for (let i = 1; i <= 6; i++) {
                if ($(_this.checkMapFolder[i], $form_popup).prop('checked')) folder_perm.push(i);
            }

            let file_perm = []
            for (let i = 1; i <= 7; i++) {
                if ($(_this.checkMap[i], $form_popup).prop('checked')) file_perm.push(i);
            }

            let temp_data = {
                folder: _data.folder,
                employee_list: emp_lst,
                group_list: group_lst,
                folder_perm_list: folder_perm,
                file_in_perm_list: file_perm,
                employee_or_group: parseInt(_data.kind) === 1,
                capability_list: _data['radio_perm_file'],
                is_apply_sub: _data['apply_to_sub'],
            }

            // folder_perm_list: folder_perm
            temp_data.exp_date = _data.expiration_date ? _data.expiration_date : null;

            if (_data.id && $x.fn.checkUUID4(_data.id)) temp_data.id = _data.id
            const url = $urlF.attr('data-folder-detail')
            let url_parse = url.format_url_with_uuid(_data.folder)
            if(_data.type !== 'folder' && url)
                url_parse = url.format_url_with_uuid(_data.file)
            if (!url){
                Swal.fire({
                    icon: 'error', title: 'Oops...', text: $.fn.gettext('File permissions cannot be shared in this space'),
                })
                return false
            }
            $.fn.callAjax2({
                'url': url_parse,
                'method': 'PUT',
                data: {'permission_obj': temp_data}
            }).then((resp) => {
                let rep = $.fn.switcherResp(resp);
                if (rep && (rep['status'] === 201 || rep['status'] === 200)) {
                    $.fn.notifyB({'description': $.fn.gettext('Update successfully')}, 'success')
                    $('#sharePerm').modal('hide')
                }
            }, (error) => {
                $.fn.notifyB({'description': error.data.errors}, 'failure')
            })
        })
    }

    clear_form_popup() {
        this.$form[0].reset()
        const $inp = $('input[name="expiration_date"]')
        $('#table_group tbody tr td input').prop('checked', false)
        $('#table_employee').DataTable().clear().draw();
        $('.employee-added > div').html('')
        // $inp[0]._flatpickr.set('clickOpens', false)
        $inp.prop('readonly', true)
        $('#sharePerm .modal-title span').text('')
        $('#btn_create').show()
        $('#btn_edit').hide()
        this.$modalLoad.hide()
    }

    load_popup(){
        let $modal = $('#sharePerm');
        const $url = $('#url-factory')
        const id = $modal.find('input[name="id"]').val()
        const type = $modal.find('input[name="type"]').val()
        const folder = $modal.find('input[name="folder"]').val()
        const file = $modal.find('input[name="file"]').val()
        let url = $url.attr('data-folder-perm-lst')
        const _this = this

        if(type === 'file') url = $url.attr('data-file-perm-lst')
        if ($x.fn.checkUUID4(id)){
            $.fn.callAjax2({
                'url': url,
                'method': 'GET',
                'data': {'id': id}
            }).then((resp) => {
                let rep = $.fn.switcherResp(resp);
                if (rep && (rep['status'] === 201 || rep['status'] === 200)) {
                    const res = rep[type === 'file'? 'perm_file_lst'[0] : 'perm_fol_lst'][0];

                    $(`input[name="kind"][val="${res.employee_or_group ? '1' : '2'}"],
                    input[name="radio_perm_file"][val="${res.capability_list}"]`, $modal).prop('checked', true)
                    $('input[name="type"]', $modal).val(type)
                    $('input[name="folder"]', $modal).val(folder)
                    $('input[name="file"]', $modal).val(file)
                    if (res?.employee_list){
                        let txtShow = '';
                        const empLst = Object.values(res.employee_list).map((item) => {
                            item.selected = true
                            txtShow += `<span class="badge badge-soft-primary">${item.full_name}</span>`
                            return item
                        });
                        $('.employee-added > div').html(txtShow)
                        $('#table_employee').DataTable().rows.add(empLst).draw()
                        $('input[name="employee_access"]', $modal).data('employee', res.employee_list)
                    }
                    if (res?.group_list){
                        for (let key of Object.keys(res.group_list)){
                            $(`#table_group tbody tr td input[value="${key}"]`).prop('checked', true)
                                .closest('tr').addClass('selected')
                        }
                        $('input[name="group_access"]', $modal).data('group', res.group_list)
                    }

                    for (let item of res.folder_perm_list){
                        $(`.wrap-folder-perm input[value="${item}"]`).prop('checked', true)
                    }

                    for (let item of res.file_in_perm_list){
                        $(`.wrap-file-perm input[value="${item}"]`).prop('checked', true)
                    }

                    if (res.exp_date){
                        $('#enabled_switch').prop('checked', true).trigger('change')
                        const $exp = $('input[name="expiration_date"]')[0]
                        $exp._flatpickr.setDate(res.exp_date)
                    }
                _this.$modalLoad.hide();
                }
            })
        }
        else this.$modalLoad.hide();
    }

    init() {
        this.load_group_list()
        this.load_employee_list([])
        this.add_new_recipient()
        this.switch_kind()
        this.btn_perm()
        this.init_date_exp()
        this.save_popup()

        // reset form
        const _this = this
        $('#sharePerm').on('hidden.bs.modal', function () {
            _this.clear_form_popup()
        }).on('shown.bs.modal', function (event) {
            const $target = $(event.relatedTarget);
            const _dataFolderId = $target.attr('data-folder')
            const _dataFileId = $target.attr('data-file')
            const _dataId = $target.attr('data-perm_id')
            const _dataType = $target.attr('data-type')
            let _dataTitle = $target.closest('tr').find('td:nth-child(2)').text()
            if (!_dataTitle) _dataTitle = $target.attr('data-title')
            $('input[name="folder"]', $(this)).val(_dataFolderId)
            $('input[name="file"]', $(this)).val(_dataFileId)
            $('input[name="id"]', $(this)).val(_dataId)
            $(this).find('input[name="type"]').val(_dataType)
            $('#sharePerm .modal-title span').text(_dataTitle)
            _this.$modalLoad.show()
            _this.load_popup()
        });
    }

    constructor() {
        this.$form = $('#frm_folder');
        this.checkMapFolder = {
            1: '#checkbox_see',
            2: '#folder_upload_file',
            3: '#folder_download',
            4: '#folder_create_subfolders',
            5: '#folder_delete',
            6: '#folder_share',
        }
        this.checkMap = {
            1: '#checkbox_review',
            2: '#checkbox_download',
            3: '#checkbox_edit_f_attr',
            4: '#checkbox_share',
            5: '#checkbox_upload_ver',
            6: '#checkbox_duplicate',
            7: '#checkbox_edit_f'
        }
        this.$modalLoad = $('.wrap-loading')
    }
}

class FilesHandle {
    loadTable(data_tbl = {}, isReset=false) {
        const $tbl = $('#main-files-info')
        const _this = this
        const space = $('#folder-tree .btn-active').attr('data-space')
        let url = this.$urlFact.attr('data-folder-api')
        if (space === 'shared') url = this.$urlFact.attr('data-folder-shared-to-me-lst')
        if (data_tbl?.['url']) url = data_tbl.url
        if (isReset) $tbl.DataTable().ajax.url(url).load()
        else
            $tbl.DataTableDefault({
            destroy: true,
            ajax: {
                url: url,
                type: 'GET',
                data: function (d) {
                    const space = $('#folder-tree .btn-active').attr('data-space')
                    if (space === 'workspace') {
                        d.is_system = true
                        d.parent_n__isnull=true
                    }
                    d.length = 50
                    if (data_tbl?.next) d.page = data_tbl.next
                    return d
                },
                dataSrc: function (resp) {
                    const space = $('#folder-tree .btn-active').attr('data-space')
                    let data = $.fn.switcherResp(resp);
                    const res = data[space === 'workspace' ? 'folder_list' : space === 'my'
                        ? 'folder_mf_list' : 'folder_stm_list']
                    $tbl.data('ajax', {'next': data['page_next'], 'url': url})
                    if (data['page_next'] === 0)
                        $('#btn-loading').prop('disabled', true).removeClass('iactive').parent().addClass('hidden')
                    else{
                        $('#btn-loading').prop('disabled', false).removeClass('iactive')
                            .parent().removeClass('hidden')
                    }
                    if (res)
                        return res;
                    throw Error('Call data raise errors.')
                },
            },
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            ordering: true,
            order: [1, 'asc' ],
            columns: [
                {
                    data: 'id',
                    width: '2%',
                    render: (row, index, data) => {
                        const type = data?.['file_type'] !== undefined ? data['file_type'] : 'folder'
                        return `<input type="checkbox" id="checkbox_id_${row}" value="${row}" data-type="${
                            type}" ${data?.is_system ? 'disabled' : ''}>`
                    }
                },
                {
                    data: 'title',
                    width: '30%',
                    render: (row, index, data) => {
                        const type = convertKeyIconMap(data);
                        const icon = icon_map[type]
                        let title = row ? row : data?.file_name
                        const clsName = type === 'folder' ? 'folder_title' : 'file_title';
                        let editBtn = ''
                        if (data?.is_system)
                            title = data?.['title_i18n']
                        if (type === 'folder' && !data?.is_system)
                            editBtn = `<span class="edit-rename" title="${$.fn.gettext('rename')}"><i class="fa-solid fa-pencil"></i></span>`
                        else{
                            let url = this.$urlFact.attr('data-file-review').format_url_with_uuid(data.id)
                            editBtn = `<a class="file-preview-link ml-2" href="${url}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square fa-xs"></i></a>`
                        }
                        return `<a href="#" data-id="${data.id}" class="${clsName}">` +
                            `<span class="icon text-${$x.fn.randomColor()}">${icon}</span><span class="fw-medium">${
                                title}</span></a>${editBtn}`

                    }
                },
                {
                    data: 'employee_inherit',
                    width: '15%',
                    render: (row, index, data) => {
                        return row?.full_name ? row.full_name : data?.employee_created ?
                            data.employee_created.full_name : data?.['is_system'] ? $.fn.gettext('System') : '--';
                    }
                },
                {
                    data: 'date_modified',
                    width: '10%',
                    render: (row, index, data) => {
                        const data_date_created = row ? row : data?.date_created
                        return row ? moment(data_date_created, 'YYYY-MM-DD').format('DD/MM/YYYY') : '--';
                    }
                },
                {
                    data: 'file_size',
                    width: '8%',
                    render: (row) => {
                        return row ? formatBytes(row) : '--';
                    }
                },
                {
                    data: 'id',
                    width: '10%',
                    render: (row, index, data) => {
                        // row type (folder or file)
                        let file_type = $.fn.gettext('Folder')
                        if (data?.file_type && data?.file_size && data?.file_name) file_type = $.fn.gettext('File')
                        return file_type;
                    }
                },
                {
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span>${row?.['document_type']?.['title'] ? row?.['document_type']?.['title'] : '--'}</span>`;
                    }
                },
                // {
                //     width: '10%',
                //     render: (data, type, row) => {
                //         return `<span>${row?.['content_group']?.['title'] ? row?.['content_group']?.['title'] : ''}</span>`;
                //     }
                // },
                {
                    data: 'id',
                    width: '10%',
                    render: (row, index, data) => {
                        let type = 'folder'
                        const isDisabled = data?.['is_system'] ? 'disabled' : '';
                        if (data?.file_type && data?.file_size && data?.file_name) type = 'file';
                        const btn1 = `<button type="button" class="btn btn-icon btn-rounded bg-dark-hover" data-${type}="${row}" data-bs-toggle="modal" data-bs-target="#sharePerm" data-type="${type}" ${isDisabled}><span><i class="fa-solid fa-share-nodes"></i></span></button>`;
                        const btn2 = `<a class="btn btn-icon btn-rounded bg-dark-hover download-dtn rotate90deg ${
                            isDisabled}" data-id="${row}" href="#"><span class="icon"><i class="fa-solid fa-arrow-right-to-bracket"></i></span></a>`;
                        const btn3 = `<button type="button" class="btn btn-icon btn-rounded bg-dark-hover dropdown-toggle" data-bs-toggle="dropdown" id="action_${row}" ${isDisabled}>`
                            + `<span class="icon-animate"><i class="fa-solid fa-ellipsis"></i></span></button>`
                            + `<div class="dropdown-menu" aria-labelledby="action_${row}">`
                            + `<a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#accessLst"><i class="dropdown-icon fas fa-folder-plus text-primary"></i><span>${$.fn.gettext('Access list')}</span></a>` + // `<a class="dropdown-item" href="#" id="upload-file" data-bs-toggle="modal" data-bs-target="#uploadFileMdl"><i class="dropdown-icon fas fa-file-upload text-primary"></i><span class="mt-2">${$.fn.gettext('Delete')}</span></a>` +
                            `<a class="dropdown-item" href="#" id="update-folder"><i class="dropdown-icon fas fa-upload text-primary"></i><span>${$.fn.gettext('Move')}</span></a></div>`;
                        return `<div class="wrap-action">${btn1 + btn2 + btn3}</div>`;
                    }
                }
            ],
            rowCallback: function (row, data) {

                $('a.folder_title', row).off().on('click', function (e) {
                    e.stopPropagation();
                    const folderId = $(this).attr('data-id')
                    _this.$loading.show()
                    _this.get_folder(folderId)
                })

                // table select row
                $('input[id*="checkbox_id_"]', row).off().on('change', function () {
                    const isCheck = $(this).prop('checked');
                    const $actSlc = $('.action-slc')
                    if (isCheck) {
                        $actSlc.addClass('active');
                        $(this).closest('tr').addClass('selected')
                    } else {
                        if ($('input[id*="checkbox_id_"]:checked', $tbl).length === 0)
                            $actSlc.removeClass('active')
                        $(this).closest('tr').removeClass('selected')
                    }
                })

                // open modal update folder
                $('#update-folder', row).off().on('click', function () {
                    const $flMd = _this.$elmMdFdr
                    const $crtFolder = $('#current_folder')
                    $('#add-folder-title', $flMd).prop('disabled', true)
                        .val(data.title)
                    const folderParent = $crtFolder.val() ? {
                        "id": $crtFolder.val(),
                        "title": $('.tit-crt').text()
                    } : null;
                    if (folderParent)
                        $('#add-folder-box-parent', $flMd).append(`<option value="${folderParent.id}" selected>${
                            folderParent.title}</option>`)
                    $('#folder_id', $flMd).val(data.id)
                    $flMd.modal('show')

                });

                // edit folder
                $('.edit-rename', row).off().on('click', function () {
                    const $flMd = _this.$elmMdFdr;
                    $('#folder_id', $flMd).val(data.id)
                    $('#add-folder-title', $flMd).val(data.title)

                    const crtFolderID = $('#current_folder').val();
                    if (crtFolderID && crtFolderID !== 'root') {
                        const title = $('.tit-crt').text()
                        $('#add-folder-box-parent', $flMd).append(`<option value="${crtFolderID}" selected>${
                            title}</option>`).trigger('change')
                    }
                    $('#add-folder-box-parent', $flMd).attr('data-params', JSON.stringify({ne: data.id}))
                    $flMd.modal('show')
                });

                // download
                $('.download-dtn', row).off().on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let url = _this.$urlFact.attr('data-folder-download');
                    if (data?.file_type && data?.file_size && data?.file_name)
                        url = _this.$urlFact.attr('data-attach-download').format_url_with_uuid(data.id)
                    if (!url) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: $.fn.gettext('Folder permissions cannot be downloaded in this space'),
                        })
                        return false
                    }
                    _this.download_faf({
                        url: url,
                        params: {id: data.id, folder_name: data.title}
                    })
                });
            },
            drawCallback: function () {
                _this.$loading.hide();
                _this.customDtbHeader();
            },
            initComplete: function () {
                _this.infinityLoading()
            }
        })

    }

    customDtbHeader() {
        let wrapper$ = $('#main-files-info').closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        if (headerToolbar$.length > 0) {
            if (!$('#open-file-filter').length) {
                let $group = $(`<div class="btn-filter">
                                        <button type="button" class="btn btn-light btn-sm ml-1" id="open-file-filter" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
                                            <span><span class="icon"><i class="fas fa-filter"></i></span><span>${$.fn.transEle.attr('data-filter')}</span></span>
                                        </button>
                                    </div>`);
                headerToolbar$.append($group);
                $('#open-file-filter').on('click', function () {
                    FileFilterHandle.initCanvas();
                    FileFilterHandle.$canvas.offcanvas('show');
                });
            }
        }
    }

    infinityLoading(){
        const $tbl = $('#main-files-info')
        const $btnLoad = $('#btn-loading')
        const $activeSpace = $('#folder-tree');
        const _this = this
        $btnLoad.on('click', function (e) {
            e.preventDefault();
            $btnLoad.prop('disabled', false).addClass('iactive')
            const dataAjax = $tbl.data('ajax')
            const crtSpace = $('.btn-active', $activeSpace).attr('data-space')
            if (dataAjax.next === 0) return true
            let url = _this.$urlFact.attr('data-folder-api')
            let params = {page: dataAjax.next, pageSize: 50}
            if(crtSpace === 'shared')
                url = _this.$urlFact.attr('data-folder-shared-to-me-lst')
            if (crtSpace === 'workspace') params['is_system'] = true
            $.fn.callAjax2({
                'url': url,
                'method': 'get',
                data: params,
            }).then((req)=>{
                const res = $.fn.switcherResp(req);
                if (res && (res['status'] === 201 || res['status'] === 200)) {
                    let tblNewData = res[crtSpace === 'my' ? 'folder_mf_list' : crtSpace === 'shared' ? 'folder_stm_list' : 'folder_list']
                    $tbl.DataTable().rows.add(tblNewData).draw()
                    if (res.page_next > 0){
                        $tbl.data('ajax', {next: res.page_next})
                        $btnLoad.removeClass('iactive')
                    }
                    else $btnLoad.removeClass('iactive').prop('disabled', true)
                }
            })
        })
    }

    get_folder(dataId = null) {
        const _this = this;
        $.fn.callAjax2({
            'url': this.$urlFact.attr('data-folder-detail').format_url_with_uuid(dataId),
            'method': 'GET',
            'data': FileFilterHandle.getFilterData(),
            'sweetAlertOpts': {'allowOutsideClick': true}
        }).then((resp) => {
            let rep = $.fn.switcherResp(resp);
            if (rep && (rep['status'] === 201 || rep['status'] === 200)) {
                const list_new = []
                for (let child of rep?.['child_n']) {
                    list_new.push(child)
                }
                for (let file of rep?.['files']) {
                    list_new.push(file)
                }
                _this.$folder.DataTable().clear().rows.add(list_new).draw()

                let $currentFolderEle = $('#current_folder');
                if ($currentFolderEle.val() !== rep.id) {
                // set new current folder
                $currentFolderEle.data('brc', {id: rep.id, title: rep.title}).val(rep.id)

                // load new breadcrumb
                _this.breadcrumb_handle({
                    'id': rep.id,
                    'title': rep.title
                })
                $('.tit-crt').html(rep.title)
                }
            }
        })
    }

    create_folder() {
        const $btnAdd = $('#btn-add-folder');
        const _this = this;
        const $crtFolder = $('#current_folder');

        $btnAdd.on('click', function () {
            let dataSubmit = {
                'title': $('#add-folder-title').val(),
                'is_owner': true,
            };
            $(this).prop('disabled', true)

            const id = $('#folder_id').val()
            const parent = $('#add-folder-box-parent').val();
            dataSubmit['parent_n'] = parent ? parent : null;
            if (id) dataSubmit['id'] = id
            const url = id ? _this.$urlFact.attr('data-folder-detail').format_url_with_uuid(id) : _this.$urlFact.attr('data-folder-api');
            if ($('#folder-tree .btn-active').attr('data-space') === 'workspace')
                dataSubmit['is_admin'] = true
            $.fn.callAjax2({
                'url': url,
                'method': id ? 'PUT' : 'POST',
                'data': dataSubmit,
                'sweetAlertOpts': {'allowOutsideClick': true},
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                let crtVal = $crtFolder.val()
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    if (!id && (!parent || parent === crtVal)){
                         // nếu là form create và là thư mục root hoặc parent = current thì add vào table
                        _this.$folder.DataTable().row.add({
                            'id': data.id,
                            'title': data.title,
                            'date_created': data.date_created,
                            'employee_inherit': data.employee_inherit
                        }).draw()
                    }
                    else{
                        const $tblFile = $('#main-files-info')
                        const idx = $(`#main-files-info input[id="checkbox_id_${id}"]`).closest('tr').index()
                        if (parent === crtVal || (!parent && crtVal === 'root')){
                            // nếu folder cha bằng folder current
                            // or ko có parent và current value bằng root
                            let oldData = $tblFile.DataTable().row(idx).data();
                            const newData = {...oldData,
                                title: dataSubmit.title,
                                date_modified: moment(new Date()).format('YYYY-MM-DD'),
                                parent_n: parent ? {id: parent, title: $('.tit-crt').val()} : {}
                            }
                            // case update row when folder is in current folder
                            $tblFile.DataTable().row(idx).data(newData).draw()
                        }
                        else
                            // remove row data when row not belong to current folder
                            $tblFile.DataTable().row(idx).remove().draw();
                    }
                    _this.$elmMdFdr.modal('hide');
                }
            }, (err) => {
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            })
        });
    }

    action_space_title(){
        const $btnSpace = $('#folder-tree button');
        const urlMap = {
            "workspace": this.$urlFact.attr('data-folder-api'),
            "my": this.$urlFact.attr('data-folder-api'),
            "shared": this.$urlFact.attr('data-folder-shared-to-me-lst')
        }
        const _this = this

        $btnSpace.on('click', function(e){
            e.preventDefault();
            if ($(this).hasClass('btn-active')) return true
            $('#folder-tree button').removeClass('btn-active')
            $(this).addClass('btn-active')
            const btnKey = $(this).attr('data-space')
            _this.loadTable({'url': urlMap[btnKey]}, true)
            $('#folder-path').html('')
            $('.tit-crt').text('')
            $('.btn_cancel_slt').trigger('click');
        })
    }

    breadcrumb_handle(data = {}){
        const _this = this
        if (Object.keys(data).length){
            const $listHtml = $('#folder-path');
            const hasItem = $('a', $listHtml).length;
            const $ElmCrt = $('#current_folder')
            let currentData = undefined
            if ($ElmCrt.data('brc')){
                currentData = $ElmCrt.data('brc')
            }

            $('a', $listHtml).removeClass('brc-current')
            const aTag = $('<a href="#" class="brc-item brc-current">');
            aTag.text(data.title)
            aTag.data('brc', data)

            if(hasItem === 0) {
                const RootMenu = $('#folder-tree button.btn-active');
                const Rootxt = $('span.no-transform', RootMenu).text();
                const RootElm = $('<a href="#" class="brc-item">');
                RootElm.text(Rootxt)
                $listHtml.append(RootElm).append('<span>/</span>')
                RootElm.data('brc', {
                    "id": RootMenu.attr('data-space'),
                    "title": Rootxt,
                })
                RootElm.on('click', function(){
                    const rootData = $(this).data('brc');
                    let url = _this.$urlFact.attr('data-folder-api')
                    if (rootData.id === 'shared') url = _this.$urlFact.attr('data-folder-shared-to-me-lst')
                    _this.loadTable({'url':url}, true)
                    $listHtml.add($('.tit-crt')).html('');
                    $ElmCrt.data('brc', undefined).val('')
                })
            }
            if (hasItem) $listHtml.append('<span>/</span>');
            $listHtml.append(aTag)

            aTag.on('click', function(){
                const data = $(this).data('brc')
                if (data.id === $ElmCrt.val() || $(this).hasClass('brc-current')) return true
                else{
                    _this.get_folder(data.id)
                    $('.tit-crt').html(data.title)
                }
                $(this).prev().prev().nextAll().remove();
                // reset and uncheck table
                $('.btn_cancel_slt').trigger('click');
            })
        }
    }

    delete_folder(id){
        let _url = this.$urlFact.attr('data-folder-api')
        if ($('#folder-tree button[data-space="shared"]').hasClass('btn-active'))
            _url = this.$urlFact.attr('data-folder-shared-to-me-lst')
        NotiConfirm({
            url: _url,
            data: {'ids': id},
            type: 'folder'
        })
    }

    delete_file(ids){
        NotiConfirm({
            url: this.$urlFact.attr('data-file-edit'),
            data: {'ids': ids},
            type: 'file'
        })
    }

    action_bar(){
        const $btnDel = $('.btn_delete_slt')
        const $btnCal = $('.btn_cancel_slt')
        const $folderTbl = $('#main-files-info')
        const _this = this
        $btnDel.off().on('click', () => {
            const delete_folder = [];
            const delete_file = [];
            $('input[id*="checkbox_id_"]:checked', $folderTbl).each(function(){
                const type = $(this).attr('data-type');
                const _val = $(this).val()
                if(type === 'folder') delete_folder.push(_val)
                else delete_file.push(_val)
            });
            if (delete_folder.length) _this.delete_folder(delete_folder);
            if (delete_file.length) _this.delete_file(delete_file);
        });

        $btnCal.on('click', () => {
            $('.action-slc').removeClass('active')
            $('input[id*="checkbox_id_"]:checked', $folderTbl).prop('checked', false)
        })
    }

    loadAccessLst(tblRowData){
        let _url = this.$urlFact.attr('data-folder-perm-lst')
        let params = {
            'folder': tblRowData.folder,
            'ids': tblRowData.perm_id,
        }
        if (tblRowData.type !== 'folder'){
            _url = this.$urlFact.attr('data-file-perm-lst')
            params = {'file': tblRowData.file}
        }
        // const crtEmployee = $x.fn.getEmployeeCurrentID();
        const _this = this
        function actBtnDel(tblDataRow){
            let urlDel = _this.$urlFact.attr('data-folder-perm-lst')
            const paramsDel = { 'ids': [tblDataRow.perm_id] }
            if (tblDataRow.type !== 'folder'){
                urlDel = _this.$urlFact.attr('data-file-perm-lst')
                paramsDel.file = tblDataRow.file
            }
            else paramsDel.folder = tblDataRow.folder
            NotiConfirm({
                url: urlDel,
                data: paramsDel,
                type: 'access',
                perm_id: tblDataRow.perm_id
            })
        }

        $.fn.callAjax2({
            'url': _url,
            'method': 'GET',
            'data': params
        }).then((resp) => {
            let rep = $.fn.switcherResp(resp);
            const $tabExp = $('#tab-expired');
            const $tabAces = $('#tab-access');
            if (rep && (rep['status'] === 201 || rep['status'] === 200)) {
                const htmlTemp = $('#access-template-lst').html()
                const crtDateTime = new Date();
                for (let child of rep['perm_fol_lst']) {
                    let newItem = $(htmlTemp)
                    newItem.find('.heading').text($.fn.gettext(child?.employee_or_group ? 'Employee' : 'Group'))
                    if (child?.exp_date && crtDateTime.getTime() < new Date(child.exp_date).getTime())
                        newItem.find('.exp-heading').text(`${$.fn.gettext('Expire on')} ${moment(child.exp_date).format('DD MMM YYYY')}`)
                    const listLoop = child?.employee_list ? child.employee_list : child.group_list
                    const recipientLst = [];
                    for (let item of Object.values(listLoop)){
                        if (item?.full_name) recipientLst.push(`<span class="badge badge-soft-primary">${item.full_name}</span>`)
                        else recipientLst.push(`<span class="badge badge-soft-primary">${item.title}</span>`)
                    }

                    $('.recipient-item', newItem).html(recipientLst)
                    $('.recipient-action .view-perm', newItem).attr('data-perm_id', child.id)
                        .attr('data-type', tblRowData.type)
                        .attr('data-file', tblRowData.file)
                        .attr('data-folder', tblRowData.folder)
                        .attr('data-title', $('#accessLst .modal-title span').text())
                    // if (child?.employee_created?.id !== crtEmployee){
                        // - nếu ko phải user created, ko phải folder owner, ko có quyền share thì ẩn delete btn
                        // $('.del-perm', newItem).addClass('disabled', true)
                    // }
                    if (child?.exp_date && crtDateTime.getTime() > new Date(child.exp_date).getTime())
                        $tabExp.append(newItem)
                    else $tabAces.append(newItem)

                    newItem.attr('data-id', child.id)

                    const temp = {...tblRowData, perm_id: child.id}
                    $('.del-perm:not(.disabled)', newItem).off().on('click', () => actBtnDel(temp))
                }

                if ($tabExp.find('div.access-item').length <= 0 )
                    $tabExp.append(`<div class="access-item d-flex flex-column mb-4"><p class="text-center">${
                        $.fn.gettext('Access list is empty')
                    }</p></div>`)
                if ($tabAces.find('div.access-item').length <= 0 )
                    $tabAces.append(`<div class="access-item d-flex flex-column mb-4"><p class="text-center">${
                        $.fn.gettext('Access list is empty')
                    }</p></div>`)
            }
        });
    }

    download_faf(data){
        const a = document.createElement("a");
        a.href = data.url + `?id=${data.params.id}`;
        if (data.params?.folder_name)
            a.download = `${data.params.folder_name}.zip`
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    init() {
        // load select parent_n
        $('#add-folder-box-parent').initSelect2({
            allowClear: true,
        });
        // init on replace slash
        $('#add-folder-title').on('blur', function(){
            const txt = this.value
            const regex = /\//g;
            // Perform the replacement
            this.value = txt.replace(regex, '-')
        })

        // on init load folder list
        const _this = this;
        this.loadTable();

        // valid folder clicked before click upload file
        $('#upload-file').off().on('click', function (e) {
            e.preventDefault()
            const folderId = $('#current_folder').val()
            if (folderId === 'root' || !$x.fn.checkUUID4(folderId)) {
                Swal.fire({
                    icon: 'error', title: 'Oops...', text: $.fn.gettext('Please go to the folder to upload'),
                })
                return true
            }
            $('#attachment .dm-uploader input[type="file"]').trigger('click')
        });

        // reset modals
        this.$elmMdFdr.on('hidden.bs.modal', function(){
            $('#add-folder-title').val('').prop('disabled', false)
            $('#folder_id').val('')
            $('#add-folder-box-parent').attr('data-params', '').val('').trigger('change')
            $('#btn-add-folder').prop('disabled', false)
        });

        // click toggle menu on mobile
        $('.hamburger-menu, .side_overlay, #folder-tree > .btn').off().on('click', function(){
            $(this).closest('.align-items-stretch').toggleClass('active-menu')
        })

        // on modal show access list
        const $tbMdL = $('#accessLst')
        $tbMdL.on('show.bs.modal', function(e){
            const $target = $(e.relatedTarget);
            const $crtTr = $target.closest('tr');
            let _title = $crtTr.find('td:nth-child(2) span.fw-medium').text()
            const $rowIpt = $crtTr.find('td:nth-child(1) input')
            let _dataTblRow = {
                type: $rowIpt.attr('data-type'),
                perm_id: null
            }
            if (_dataTblRow.type === 'folder')
                _dataTblRow.folder = $rowIpt.val()
            else _dataTblRow.file = $rowIpt.val()

            _this.loadAccessLst(_dataTblRow)
            $('#accessLst .modal-title span').text(_title)
        })
            .on('hidden.bs.modal', () => {
                $('#tab-access, #tab-expired').html('')
                $('.modal-title span', $tbMdL).text('')
            })

        this.create_folder()
        this.action_space_title()
        this.breadcrumb_handle()
        this.action_bar()

    };

    constructor() {
        this.$urlFact = $('#url-factory')
        this.$elmMdFdr = $('#addFolderMdl')
        this.$loading = $('.refresh-container')
        this.$folder = $('#main-files-info')
    }
}

function triggerAfterUpload(data={}){
    if (Object.keys(data).length){
        $('#main-files-info').DataTable().row.add(data).draw();
        $.fn.notifyB({'description': $.fn.gettext("Upload file successfully")}, 'success')
    }
}

function NotiConfirm(params) {
    Swal.fire({
        title: $.fn.gettext('Delete this selection'),
        text: $.fn.transEle.attr('data-sure-delete'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $.fn.transEle.attr('data-delete'),
        cancelButtonText: $.fn.transEle.attr('data-cancel'),
    }).then((result) => {
        if (result.isConfirmed) {
            $.fn.callAjax2({
                'url': params.url,
                'method': 'delete',
                'data': params.data,
                'sweetAlertOpts': {'allowOutsideClick': true},
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data['status'] === 204) {
                    if (['folder', 'file'].indexOf(params.type) !== -1){
                        $('#main-files-info').DataTable().rows('.selected').remove().draw();
                        $('.action-slc').removeClass('active');
                    }
                    else{
                        // delete access list param type access
                        $(`.access-item[data-id="${params.perm_id}"]`).remove()
                    }

                }
            })
        }
    })
}

$(document).ready(function () {

    // handle table attachment file and upload file and create folder
    const files = new FilesHandle()
    files.init()

    // run modal
    const modalPermission = new popupPermission();
    modalPermission.init()

    // init loading upload file
    new $x.cls.file($('#attachment')).init({
        'name': 'attachment',
        'select_folder': true,
        'element_folder': $('#current_folder'),
        'CB_after_upload': triggerAfterUpload,
        'maxFileSize': parseInt($('#max_upload_file').text()) || 20971520,
    });

    FileFilterHandle.$btnApply.on('click', function () {
        let $currentFolder = $('#current_folder');
        if ($currentFolder.length > 0) {
            if ($currentFolder.val()) {
                files.get_folder($currentFolder.val());
            }
        }
    });
});