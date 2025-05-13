class popup_recipient {
    init_group(){
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
                    if (data && data.hasOwnProperty('group_list')) {
                        return resp.data['group_list'] ? [{
                            id: "all_com",
                            title: $.fn.gettext('All company'),
                            code: 'all'
                        }, ...resp.data['group_list']] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                   data: 'id',
                    render: (row, index, data) => {
                       let txt = `<div class="form-check">` +
                           `<input type="checkbox" id="radio_${data.code}" class="form-check-input" value="${data.id}">` +
                           `<label title="${data.title}" for="radio_${data.code}" class="form-check-label">` +
                               `${data.title}</label>`
                        return txt;
                    },
                },
            ],
            rowCallback: function (row, data) {
                $(row).find('input').on('change', function () {
                    let state = $(this).prop('checked');
                    const is_all = data?.id === 'all_com'
                    if(state && data?.id){
                        let params = data?.id === 'all_com' ? {pageSize: -1} : {group_id: data.id};
                        _this.get_employee(params, is_all)
                    }
                    else _this.load_employee_table([], is_all)
                    if (is_all) $('tbody tr td input:not([value="all_com"])', $table).prop('checked', false)
                })
            },
        })
    }

    load_employee_table(data, is_all){
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
                scrollCollapse: true,
                data: data,
                columns: [
                    {
                        data: 'id',
                        width: '5%',
                        render: (row, index, data) => {
                            let txt = `<div class="form-check">` +
                                `<input type="checkbox" id="radio_${data.code}" class="form-check-input" value="${data.id}">` +
                                `</div>`
                            return txt;
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
                            let txt = row?.title || '--'
                            return txt
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
                _this.load_employee_table(data.employee_list, all)
            }
        })
    }

    add_btn(){
        const $btn = $('#add_selected');
        const $groupTbl = $('#table_group');
        const $empTbl = $('#table_employee');

        $btn.off().on('click', function(){
            $(this).prop('disabled', true)
            const owner_list = [];
            const show_list = [];
            if ($('input[name="kind"]').val() === 'group'){
                const dataGroup = $groupTbl.DataTable().data().toArray();
                if ($('#radio_all').prop('checked')) owner_list.push('all_com')
                else{
                    $groupTbl.DataTable().rows().every(function () {
                        let row = this.node();
                        if ($('input', row).prop('checked')){
                            const idx = $(row).index();
                            owner_list.push(dataGroup[idx].id)
                            show_list.push(`<div class="chip chip-outline-primary pill chip-pill"><span class="chip-text">${dataGroup[idx].title}</span></div>`)
                        }
                    });
                }
                const $elmGroupData = $('#recipient_form input[name="group_access"]');
                let data = $elmGroupData.data('group') || []
                let newData = $.merge(data, owner_list);
                $elmGroupData.data('group', newData)
            }
            else{
                const dataEmp = $empTbl.DataTable().data().toArray();
                $empTbl.DataTable().rows().every(function () {
                    let row = this.node();
                    if ($('input', row).prop('checked')){
                        const idx = $(row).index();
                        owner_list.push(dataEmp[idx].id)
                        show_list.push(`<div class="chip chip-outline-primary pill chip-pill"><span class="chip-text">${dataEmp[idx].full_name}</span></div>`)
                    }

                });
                const $elmEmpData = $('#recipient_form input[name="employee_access"]');
                let data = $elmEmpData.data('employee') || []
                let newData = $.merge(data, owner_list);
                $elmEmpData.data('employee', newData)
            }
            $('.employee-added > div').html(show_list)
            $(this).prop('disabled', false)
        })
    }

    switch_choice_act(){
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



    run_popup(){
        this.init_group()
        this.load_employee_table([])
        this.add_btn()
        this.switch_choice_act()
        this.btn_perm()
    }
}
$('document').ready(function(){

    const recipient = new popup_recipient();
    recipient.run_popup()


});