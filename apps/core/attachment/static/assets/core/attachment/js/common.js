function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const icon_map = {
    'folder': '<i class="bi bi-folder2"></i>',
    '.pdf': '<i class="bi bi-file-earmark-pdf"></i>',
    'image/png': '<i class="bi bi-file-image"></i>',
    'image/jpeg': '<i class="bi bi-file-image"></i>',
    'image/gif': '<i class="bi bi-filetype-gif"></i>',
    'image/webp': '<i class="bi bi-file-binary"></i>',
    'text/plain': '<i class="bi bi-file-earmark-text"></i>',
    '.doc': '<i class="bi bi-file-earmark-word"></i>',
    '.docx': '<i class="bi bi-file-earmark-word"></i>',
    '.xls': '<i class="bi bi-file-earmark-excel"></i>',
    '.xlsx': '<i class="bi bi-file-earmark-excel"></i>',
    '.csv': '<i class="bi bi-filetype-csv"></i>',
    'audio/*': '<i class="bi bi-speaker"></i>',
    'video/*': '<i class="bi bi-file-play"></i>',
    'application/zip': '<i class="bi bi-file-earmark-zip"></i>',
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
            scrollCollapse: true,
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
                    return `<div class="form-check">` + `<input type="checkbox" id="radio_${data.code}" class="form-check-input" value="${data.id}">` + `<label title="${data.title}" for="radio_${data.code}" class="form-check-label">` + `${data.title}</label>`
                },
            },],
            rowCallback: function (row, data) {
                $(row).find('input').on('change', function () {
                    let state = $(this).prop('checked');
                    const is_all = data?.id === 'all_com'
                    if (state && data?.id && parseInt($('input[name="kind"]:checked').val()) === 1) {
                        let params = data?.id === 'all_com' ? {pageSize: -1} : {group_id: data.id};
                        _this.get_employee(params, is_all)
                    } else _this.load_employee_list([], is_all)
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
                paging: false, info: false, // searching: false,
                scrollY: '250px', scrollX: '1023px', scrollCollapse: true, data: data, columns: [{
                    data: 'id', width: '5%', render: (row, index, data) => {
                        return `<div class="form-check">` + `<input type="checkbox" id="radio_${data.code}" class="form-check-input" value="${data.id}">` + `</div>`;
                    },
                }, {
                    data: "code", width: '35%', render: (row) => {
                        return row
                    }
                }, {
                    data: "full_name", width: '30%', render: (row) => {
                        return row
                    }
                }, {
                    data: 'group', width: '30%', render: (row) => {
                        return row?.title || '--'
                    }
                }],
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
                    show_list.push(`<div class="chip chip-outline-primary pill chip-pill"><span class="chip-text">${$.fn.gettext('All Company')}</span></div>`)
                } else {
                    $groupTbl.DataTable().rows().every(function () {
                        let row = this.node();
                        if ($('input', row).prop('checked')) {
                            const idx = $(row).index();
                            owner_list[dataGroup[idx].id] = dataGroup[idx]
                            show_list.push(`<div class="chip chip-outline-primary pill chip-pill"><span class="chip-text">${dataGroup[idx].title}</span></div>`)
                        }
                    });
                }
                const $elmGroupData = $('input[name="group_access"]');
                let data = $elmGroupData.data('group') || []
                let newData = {...data, ...owner_list};
                $elmGroupData.data('group', newData)
            } else {
                const dataEmp = $empTbl.DataTable().data().toArray();
                $empTbl.DataTable().rows().every(function () {
                    let row = this.node();
                    if ($('input', row).prop('checked')) {
                        const idx = $(row).index();
                        owner_list[dataEmp[idx].id] = dataEmp[idx]
                        show_list.push(`<div class="chip chip-outline-primary pill chip-pill"><span class="chip-text">${dataEmp[idx].full_name}</span></div>`)
                    }
                });

                if (Object.keys(owner_list).length === 0) {
                    $.fn.notifyB({'description': $.fn.gettext('Please select employee')}, 'failure')
                    return false
                }
                const $elmEmpData = $('input[name="employee_access"]');
                let data = $elmEmpData.data('employee') || {}
                let newData = {...data, ...owner_list};
                $elmEmpData.data('employee', newData)

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
        const $elmGroupData = $('#recipient_form input[name="group_access"]');
        const $elmEmpData = $('#recipient_form input[name="employee_access"]');
        $('#recipient_form input[name="kind"]').on('change', function () {
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
            $('#checkbox_review, #checkbox_download, #checkbox_edit_f_attr, #checkbox_share, #checkbox_upload_ver, #checkbox_duplicate, #checkbox_edit_f').prop('checked', false)
            switch (parseInt(this.value)) {
                case 1:
                    $('#checkbox_review').prop('checked', true);
                    break;
                case 2:
                    $('#checkbox_review, #checkbox_download').prop('checked', true);
                    break;
                default:
                    $('#checkbox_download, #checkbox_review, #checkbox_edit_f_attr, #checkbox_share, #checkbox_upload_ver, #checkbox_duplicate, #checkbox_edit_f').prop('checked', true)
                    break;
            }
        })
    }

    init_date_exp() {
        $('#input_expired').flatpickr({
            allowInput: true,
            altInput: true,
            altFormat: 'd/m/Y',
            defaultDate: null,
            locale: globeLanguage === 'vi' ? 'vn' : 'default',
            shorthandCurrentMonth: true,
        }).set('clickOpens', false)

        $('#enabled_switch').on('change', function () {
            const $inp = $('#input_expired')
            if (!$(this).prop('checked')) {
                $inp[0]._flatpickr.clear()
                $inp[0]._flatpickr.set('clickOpens', false)
                $inp.prop('readonly', true)
            } else {
                $inp[0]._flatpickr.set('clickOpens', true)
                $inp.prop('readonly', false)
            }
        })
    }

    save_popup() {
        const _this = this;
        const $form_popup = this.$form;

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
                employee_or_group: parseInt(_data.kind),
                capability_list: _data['radio_perm_file'],
                is_apply_sub: _data['apply_to_sub'],
            }

            // folder_perm_list: folder_perm
            if (_data.expiration_date) temp_data.exp_date = _data.exp_date

            if (_data.id && $x.fn.checkUUID4(_data.id)) temp_data.id = _data.id

            $.fn.callAjax2({
                'url': $('#url-factory').attr('data-url-detail').format_url_with_uuid(_data.id),
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
        const $inp = $('#input_expired')
        $('#table_group tbody tr td input, #table_employee tbody tr td input').prop('checked', false)
        $('.employee-added > div').html('')
        // $inp[0]._flatpickr.set('clickOpens', false)
        $inp.prop('readonly', true)
        $('#sharePerm .modal-title span').text('')
        $('#btn_create').show()
        $('#btn_edit').hide()
    }

    init() {
        this.load_group_list()
        this.load_employee_list([])
        this.add_new_recipient()
        // this.switch_kind()
        // this.btn_perm()
        // this.init_date_exp()
        this.save_popup()

        // reset form
        const _this = this
        $('#sharePerm').on('hidden.bs.modal', function () {
            _this.clear_form_popup()
        }).on('shown.bs.modal', function (event) {
            const _dataId = $(event.relatedTarget).attr('data-id')
            const _dataType = $(event.relatedTarget).attr('data-type')
            const _dataTitle = $(event.relatedTarget).closest('tr').find('td:nth-child(2)').text()
            $('input[name="folder"], input[name="id"]', $(this)).val(_dataId)
            $(this).find('input[name="type"]').val(_dataType)
            $('#sharePerm .modal-title span').text(_dataTitle)
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
    }
};

class FilesHandle {

    loadTable(data_tbl = [], reload_data = false) {
        const $tbl = $('#main-files-info')
        const _this = this

        if ($tbl.hasClass('dataTable')) {
            if (reload_data) $tbl.DataTable().clear().rows.add(data_tbl).draw();
            else $tbl.DataTable().row.add(data_tbl).draw();
        }
        else{
            $tbl.DataTableDefault({
                data: data_tbl,
                paging: false,
                info: false,
                searching: false,
                columns: [
                    {
                        data: 'id',
                        width: '2%',
                        render: (row, index, data) => {
                            const type = data?.['file_type'] !== undefined ? data['file_type'] : 'folder'
                            return `<input type="checkbox" id="checkbox_id_${row}" value="${row}" data-type="${type}">`
                        }
                    },
                    {
                        data: 'title',
                        width: '38%',
                        render: (row, index, data) => {
                            const type = data?.['file_type'] ? data?.['file_type'] : 'folder'
                            const icon = icon_map?.[type] ? icon_map[type] : `<i class="bi bi-file-earmark"></i>`
                            const title = row ? row : data?.file_name
                            const clsName = type === 'folder' ? 'folder_title' : 'file_title'
                            return `<a href="#" data-id="${data.id}" class="${clsName}">` +
                                `<span class="icon text-${$x.fn.randomColor()}">${icon}</span><span class="fw-medium">${title}</span></a>`;
                        }
                    },
                    {
                        data: 'employee_inherit',
                        width: '20%',
                        render: (row, index, data) => {
                            return row?.full_name ? row.full_name : data?.employee_created ? data.employee_created.full_name : '--';
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
                        width: '10%',
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
                        data: 'id',
                        width: '10%',
                        render: (row, index, data) => {
                            let type = 'folder'
                            if (data?.file_type && data?.file_size && data?.file_name) type = 'file'
                            const btn1 = `<button type="button" class="btn btn-icon btn-rounded bg-dark-hover" data-id="${row}" data-bs-toggle="modal" data-bs-target="#sharePerm" data-type="${type}"><span><i class="fa-solid fa-share-nodes"></i></span></button>`;
                            const btn2 = `<a class="btn btn-icon btn-rounded bg-dark-hover edit-button rotate90deg" ` + `data-id="${row}"><span class="icon"><i class="fa-solid fa-arrow-right-to-bracket"></i></span></a>`;
                            const btn3 = `<button type="button" class="btn btn-icon btn-rounded bg-dark-hover dropdown-toggle" data-bs-toggle="dropdown" id="action_${row}">` + `<span class="icon-animate"><i class="fa-solid fa-ellipsis"></i></span></button>` + `<div class="dropdown-menu" aria-labelledby="action_${row}">` + `<a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#addFolderMdl"><i class="dropdown-icon fas fa-folder-plus text-primary"></i><span>${$.fn.gettext('Access list')}</span></a>` + // `<a class="dropdown-item" href="#" id="upload-file" data-bs-toggle="modal" data-bs-target="#uploadFileMdl"><i class="dropdown-icon fas fa-file-upload text-primary"></i><span class="mt-2">${$.fn.gettext('Delete')}</span></a>` +
                                `<a class="dropdown-item" href="#" id="update-folder"><i class="dropdown-icon fas fa-upload text-primary"></i><span>${'Move'}</span></a></div>`;
                            return `<div class="wrap-action">${btn1 + btn2 + btn3}</div>`;
                        }
                    }
                ],
                rowCallback: function (row, data) {
                    // click on title
                    $('a.folder_title', row).off().on('click', function (e) {
                        e.stopPropagation();
                        const folderId = $(this).attr('data-id')
                        _this.$loading.show()
                        _this.get_folder(folderId)
                        _this.breadcrumb_handle({
                            'id': folderId,
                            'title': $('span:nth-child(2)', $(this)).text()
                        })
                        $('.tit-crt').html($('span:nth-child(2)', $(this)).text())
                    })

                    // checked to select
                    $('input[id*="checkbox_id_"]', row).off().on('change', function () {
                        const isCheck = $(this).prop('checked');
                        const $actSlc = $('.action-slc')
                        if (isCheck){
                            $actSlc.addClass('active');
                            $(this).closest('tr').addClass('selected')
                        }
                        else{
                             if($('input[id*="checkbox_id_"]:checked', $tbl).length === 0)
                                 $actSlc.removeClass('active')
                            $(this).closest('tr').removeClass('selected')
                        }
                    })

                    // open modal update folder
                    $('#update-folder', row).off().on('click', function(){
                        const $flMd = $('#addFolderMdl')
                        const $crtFolder = $('#current_folder')
                        $('#add-folder-title', $flMd).prop('disabled',true)
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

                    })
                },
            })
        }
    }

    get_folder(dataId = null) {
        const _this = this;
        $.fn.callAjax2({
            'url': this.$urlFact.attr('data-url-detail').format_url_with_uuid(dataId), 'method': 'GET',
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
                _this.loadTable(list_new, true)
                $('#current_folder').data('data-json', {id: rep.id, title: rep.title}).val(rep.id)
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
            const id = $('#folder_id').val()
            const parent = $('#add-folder-box-parent').val();
            if (parent) dataSubmit['parent_n'] = parent;
            if (id) dataSubmit['id'] = id
            const url = id ? _this.$urlFact.attr('data-url-detail').format_url_with_uuid(id) : _this.$urlFact.attr('data-folder-api');
            $.fn.callAjax2({
                'url': url,
                'method': id ? 'PUT' : 'POST',
                'data': dataSubmit,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    if ((!parent || parent === $crtFolder.val()) && !id){
                        // nếu là form create và là thư mục root hoặc parent = current thì add vào table
                        _this.loadTable({
                            'id': data.id,
                            'title': data.title,
                            'date_created': data.date_created,
                            'employee_inherit': data.employee_inherit
                        })
                    }
                    if (id && parent !== $crtFolder.val()){
                        // nếu là update và parent != current thì xóa row đó ra khỏi current
                        const idx = $(`#main-files-info input[id="checkbox_id_${id}"]`).closest('tr').index()
                        $('#main-files-info').DataTable().row(idx).remove().draw()
                    }
                    $('#addFolderMdl').modal('hide');
                }
            }, (err) => {
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            })
        });
    }

    action_space_title(){
        const $btnSpace = $('#folder-tree button');
        const urlMap = {
            "my": this.$urlFact.attr('data-folder-my'),
            "shared": this.$urlFact.attr('data-folder-share-api')
        }
        const _this = this

        $btnSpace.on('click', function(){
            if ($(this).hasClass('btn-active')) return true
            $('#folder-tree button').removeClass('btn-active')
            $(this).addClass('btn-active')
            const btnKey = $(this).attr('data-space')
            $.fn.callAjax2({
                'url': urlMap[btnKey],
                'method': 'GET'
            }).then(
                (resp) => {
                    let rep = $.fn.switcherResp(resp);
                    if (rep && (rep['status'] === 201 || rep['status'] === 200)){
                        const keyLst = btnKey === 'my' ? 'folder_mf_list' : 'folder_stm_list';
                        _this.loadTable(rep[keyLst], true)
                    }
                    else _this.loadTable([], true)
                    $('#folder-path').html('')
                    $('.tit-crt').text('')
                    $('.btn_cancel_slt').trigger('click');
                },
                (error) => {
                    $.fn.notifyB({'description': error.data.errors?.detail}, 'failure')
                    _this.loadTable([], true)
                }
            )
        })
    }

    breadcrumb_handle(data = {}){
        const _this = this
        if (Object.keys(data).length){
            const $listHtml = $('#folder-path');
            const hasItem = $('a', $listHtml).length;
            $('a', $listHtml).each(function(e){
                $(e).removeClass('brc-current')
            })
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
                    let url = _this.$urlFact.attr('data-folder-my')
                    if (rootData.id === 'shared') url = _this.$urlFact.attr('data-folder-share-api')
                    $.fn.callAjax2({url: url, method: 'get'}
                    ).then(
                        (resp) => {
                            let rep = $.fn.switcherResp(resp);
                            if (rep && (rep['status'] === 201 || rep['status'] === 200)){
                                _this.loadTable(rep[rootData.id === 'my' ? 'folder_mf_list' : 'folder_stm_list'], true)
                                $listHtml.add($('.tit-crt')).html('');
                                $('#current_folder').val('')
                            }
                        }
                    )
                })
            }
            if (hasItem) $listHtml.append('<span>/</span>');
            $listHtml.append(aTag)

            aTag.on('click', function(){
                const data = $(this).data('brc')
                if (data.id === $('#current_folder').val()) return true
                else{
                    _this.get_folder(data.id)
                    $('.tit-crt').html(data.title)
                }
                $(this).nextAll().remove();
                // reset and uncheck table
                $('.btn_cancel_slt').trigger('click');
            })
        }
    }

    delete_folder(id){
        $.fn.callAjax2({
            'url': this.$urlFact.attr('data-folder-my'),
            'method': 'delete',
            'data': {'ids': id}
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data['status'] === 204){
                $('#main-files-info').DataTable().rows('.selected').remove().draw();
                $('.action-slc').removeClass('active');
            }
        })
    }

    delete_file(ids){
        $.fn.callAjax2({
            'url': this.$urlFact.attr('data-file-edit'),
            'method': 'delete',
            'data': {'ids': ids}
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data['status'] === 204){
                $('#main-files-info').DataTable().rows('.selected').remove().draw();
                $('.action-slc').removeClass('active');
            }
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

    init() {
        // load select parent_n
        $('#add-folder-box-parent').initSelect2({
            allowClear: true,
        });

        // on init load folder list
        const _this = this;
        $.fn.callAjax2({
            'url': this.$urlFact.attr('data-folder-my'), 'method': 'GET'
        }).then((resp) => {
            let rep = $.fn.switcherResp(resp);
            if (rep && (rep['status'] === 201 || rep['status'] === 200)) _this.loadTable(rep['folder_mf_list'])
        }, (error) => $.fn.notifyB({
            'description': error.data.errors?.detail}, 'failure'))

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
            $('#add-folder-box-parent').val('').trigger('change')
        });


        this.create_folder()
        this.action_space_title()
        this.breadcrumb_handle()
        this.action_bar()
    };

    constructor() {
        this.$urlFact = $('#url-factory')
        this.$elmMdFdr = $('#addFolderMdl')
        this.$loading = $('#refresh-container')
    }
};

function triggerAfterUpload(data={}){
    if (Object.keys(data).length){
        $('#main-files-info').DataTable().row.add(data).draw();
    }
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
        'select_folder': false,
        'element_folder': $('#current_folder'),
        'CB_after_upload': triggerAfterUpload,
    });
});