class popup_recipient {
    load_group_list(){
        const _this = this;
        const $table = $('#table_group');
        $table.DataTableDefault({
            useDataServer : true,
            paging: false,
            info: false,
            searching: false,
            scrollY: '250px',
            scrollCollapse: true,
            ajax: {
                url: $table.attr('data-url'),
                type: 'get',
                data: function (d) {
                    d.pageSize = -1
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('group_dd_list')) {
                        return resp.data['group_dd_list'] ? [{
                            id: "all_com",
                            title: $.fn.gettext('All company'),
                            code: 'all'
                        }, ...resp.data['group_dd_list']] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                   data: 'id',
                    render: (row, index, data) => {
                       return `<div class="form-check">` +
                           `<input type="checkbox" id="radio_${data.code}" class="form-check-input" value="${data.id}">` +
                           `<label title="${data.title}" for="radio_${data.code}" class="form-check-label">` +
                               `${data.title}</label>`
                    },
                },
            ],
            rowCallback: function (row, data) {
                $(row).find('input').on('change', function () {
                    let state = $(this).prop('checked');
                    const is_all = data?.id === 'all_com'
                    if(state && data?.id && parseInt($('input[name="kind"]:checked').val()) === 1){
                        let params = data?.id === 'all_com' ? {pageSize: -1} : {group_id: data.id};
                        _this.get_employee(params, is_all)
                    }
                    else _this.load_employee_list([], is_all)
                    if (is_all) $('tbody tr td input:not([value="all_com"])', $table).prop('checked', false)
                })
            },
        })
    }

    load_employee_list(data, is_all){
        const $empTbl = $('#table_employee');
        if ($empTbl.hasClass('dataTable')){
            if (is_all) $empTbl.DataTable().clear().rows.add(data).draw()
            else $empTbl.DataTable().rows.add(data).draw()
        }
        else{
            $empTbl.DataTableDefault({
                paging: false,
                info: false,
                // searching: false,
                scrollY: '250px',
                scrollX: '1023px',
                scrollCollapse: true,
                data: data,
                columns: [
                    {
                        data: 'id',
                        width: '5%',
                        render: (row, index, data) => {
                            return `<div class="form-check">` +
                                `<input type="checkbox" id="radio_${data.code}" class="form-check-input" value="${data.id}">` +
                                `</div>`;
                        },
                    },
                    {
                        data: "code",
                        width: '35%',
                        render: (row) =>{
                            return row
                        }
                    },
                    {
                        data: "full_name",
                        width: '30%',
                        render: (row) =>{
                            return row
                        }
                    },
                    {
                        data: 'group',
                        width: '30%',
                        render: (row) =>{
                            return row?.title || '--'
                        }
                    }
                ],
            })
        }
        $('thead tr td input#checkbox_all', $empTbl).off().on('change', function(){
            const is_checked = $(this).prop('checked')
            $('tbody tr td input', $empTbl).prop('checked', is_checked)
        })
    }

    get_employee(params, all){
        const _this = this
        $.fn.callAjax2({
            url: $('#table_employee').attr('data-url'),
            method: 'get',
            data: params
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                _this.load_employee_list(data.employee_list, all)
            }
        })
    }

    add_new_row_recipient(){
        const $btn = $('#add_selected');
        const $groupTbl = $('#table_group');
        const $empTbl = $('#table_employee');

        $btn.off().on('click', function(){
            $(this).prop('disabled', true)
            const owner_list = {};
            const show_list = [];
            if (parseInt($('input[name="kind"]:checked').val()) === 2){  // nếu chọn recipient là group
                const dataGroup = $groupTbl.DataTable().data().toArray();
                if ($('#radio_all').prop('checked')){
                    owner_list['all_com'] = {
                        id: 'all_com',
                        title: $.fn.gettext('All Company')
                    }
                    show_list.push(`<div class="chip chip-outline-primary pill chip-pill"><span class="chip-text">${$.fn.gettext('All Company')}</span></div>`)
                }
                else{
                    $groupTbl.DataTable().rows().every(function () {
                        let row = this.node();
                        if ($('input', row).prop('checked')){
                            const idx = $(row).index();
                            owner_list[dataGroup[idx].id] = dataGroup[idx]
                            show_list.push(`<div class="chip chip-outline-primary pill chip-pill"><span class="chip-text">${dataGroup[idx].title}</span></div>`)
                        }
                    });
                }
                const $elmGroupData = $('#recipient_form input[name="group_access"]');
                let data = $elmGroupData.data('group') || []
                let newData = {...data, ...owner_list};
                $elmGroupData.data('group', newData)
            }
            else{
                const dataEmp = $empTbl.DataTable().data().toArray();
                $empTbl.DataTable().rows().every(function () {
                    let row = this.node();
                    if ($('input', row).prop('checked')){
                        const idx = $(row).index();
                        owner_list[dataEmp[idx].id] = dataEmp[idx]
                        show_list.push(`<div class="chip chip-outline-primary pill chip-pill"><span class="chip-text">${dataEmp[idx].full_name}</span></div>`)
                    }

                });
                const $elmEmpData = $('#recipient_form input[name="employee_access"]');
                let data = $elmEmpData.data('employee') || {}
                let newData = {...data, ...owner_list};
                $elmEmpData.data('employee', newData)
            }
            $('.employee-added > div').html(show_list)
            $(this).prop('disabled', false)
        })
    }

    switch_kind(){
        const $elmGroupData = $('#recipient_form input[name="group_access"]');
        const $elmEmpData = $('#recipient_form input[name="employee_access"]');
        $('#recipient_form input[name="kind"]').on('change', function(){
            if(this.value === 'employee') $elmGroupData.data('group', [])
            else {
                $elmEmpData.data('employee', [])
                // un-check all user in table
                $('#table_employee tr td input').prop('checked', false)
            }
            $('.employee-added > div').html('')
        });
    }

    btn_perm(){
        $('input[name="radio_perm_file"]').off().on('change', function(){
            $('#checkbox_review, #checkbox_download, #checkbox_edit_f_attr, #checkbox_share, #checkbox_upload_ver, #checkbox_duplicate, #checkbox_edit_f').prop('checked', false)
            switch (parseInt(this.value)){
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

    init_date_exp(){
        $('#input_expired').flatpickr({
            allowInput: true,
            altInput: true,
            altFormat: 'd/m/Y',
            defaultDate: null,
            locale: globeLanguage === 'vi' ? 'vn' : 'default',
            shorthandCurrentMonth: true,
        }).set('clickOpens', false)

        $('#enabled_switch').on('change', function(){
            const $inp = $('#input_expired')
            if (!$(this).prop('checked')){
                $inp[0]._flatpickr.clear()
                $inp[0]._flatpickr.set('clickOpens', false)
                $inp.prop('readonly', true)
            }
            else{
                $inp[0]._flatpickr.set('clickOpens', true)
                $inp.prop('readonly', false)
            }
        })
    }

    save_popup(){
        const $form_popup = this.$form;
        const _this = this;
        $form_popup.on('submit', function(e){
            e.preventDefault()
            const _data = $form_popup.serializeObject();
            const _dataIdx = parseInt($('input[name="id"]', $form_popup).attr('data-idx'))
            // validate data
            const emp_lst = $('input[name="employee_access"]').data('employee') || {}
            const group_lst = $('input[name="group_access"]').data('group') || {}
            if (Object.keys(emp_lst).length === 0 && Object.keys(group_lst).length === 0){
                $.fn.notifyB({'description': $.fn.gettext('Employee or Group are empty')}, 'failure')
                return false
            }
            let file_perm = []
            for (let i = 1; i <= 7;i++){
                if ($(_this.checkMap[i]).prop('checked')) file_perm.push(i);
            }

            let temp_data = {
                    title: _data.title,
                    kind: parseInt(_data.kind),
                    employee_access: emp_lst,
                    group_access: group_lst,
                    document_permission_list: file_perm
                }
            if (_data.expiration_date) temp_data.expiration_date = _data.expiration_date
            if (_data.id && $x.fn.checkUUID4(_data.id)){
                temp_data.id = _data.id
                $('#table_internal_recipient').DataTable().row(_dataIdx).data(temp_data).draw()
            }
            else $('#table_internal_recipient').DataTable().rows.add([temp_data]).draw()
            $('#modal-recipient').modal('hide')
        })
    }

    clear_form_popup(){
        this.$form[0].reset()
        const $inp = $('#input_expired')
        $('#table_group tbody tr td input, #table_employee tbody tr td input').prop('checked', false)
        $('.employee-added > div').html('')
        $inp[0]._flatpickr.set('clickOpens', false)
        $inp.prop('readonly', true)
        $('#btn_create').show()
        $('#btn_edit').hide()
    }

    modal_trigger(){
        const $modal = $('#modal-recipient')
        const $tblGroup = $('#table_group')
        const _this = this
        $(document).on('modal.Recipient.edit', function(e, detail){
            e.preventDefault()
            $modal.modal('show')
            _this.clear_form_popup()
            const data_row = $('#table_internal_recipient').DataTable().row(detail.row_index).data();
            if (data_row) {
                if (data_row?.id){
                    $('input[name="id"]', _this.$form).val(data_row.id)
                    $('input[name="id"]', _this.$form).attr('data-idx', detail.row_index)
                    $('#btn_create').hide()
                    $('#btn_edit').show()
                }
                $('#txt_title', _this.$form).val(data_row.title)
                $('input[name="kind"][value="' + data_row.kind + '"]', _this.$form).prop('checked', true)
                $('input[name="group_access"]').data('group', data_row.group_access)
                const show_list = [];
                for (let idx in data_row.group_access){
                    const item = data_row.group_access[idx]
                    if (item.id === 'all_com') $('tbody tr:first-child() td input', $tblGroup).prop('checked', true)
                    else $('tbody input[value="' + item.id + '"]', $tblGroup).prop('checked', true)
                    if (data_row.kind === 2) show_list.push(`<div class="chip chip-outline-primary pill chip-pill"><span class="chip-text">${item.title}</span></div>`)
                }

                $('.employee-added > div').html(show_list)
                switch (data_row.document_permission_list.length){
                    case 1:
                        $('#radio_review').prop('checked', true)
                        break
                    case 2:
                        $('#radio_view').prop('checked', true)
                        break
                    default:
                        $('#radio_edit').prop('checked', true)
                        break
                }

                for (let val of data_row.document_permission_list){
                    const checkboxId = _this.checkMap[val];
                    if (checkboxId) {
                        $(checkboxId).prop('checked', true);
                    }
                }

                if (data_row.expiration_date){
                    const $iptExp = $('#input_expired')
                    $('#enabled_switch').prop('checked', true)
                    $iptExp.prop('readonly', false)
                    $iptExp[0]._flatpickr.set('clickOpens', true)
                    $iptExp[0]._flatpickr.setDate(data_row.expiration_date)
                }
            }
        })
    }

    run_popup(){
        this.load_group_list()
        this.load_employee_list([])
        this.add_new_row_recipient()
        this.switch_kind()
        this.btn_perm()
        this.init_date_exp()
        this.save_popup()
        this.modal_trigger()
    }

    constructor() {
        this.$form = $('#recipient_form');
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
}
$(document).ready(function(){
    const recipient = new popup_recipient();
    recipient.run_popup()
});