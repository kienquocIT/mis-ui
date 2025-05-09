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
                           `<input type="checkbox" id="radio_${data.title}" class="form-check-input" value="${data.id}">` +
                           `<label title="${data.title}" for="radio_${data.title}" class="form-check-label">` +
                               `${data.title}</label>`
                        return txt;
                    },
                },
            ],
            rowCallback: function (row, data) {
                $(row).find('input').on('change', function () {
                    let state = $(this).prop('checked');
                    if(state) _this.get_employee(data.id)
                })
            },
        })
    }

    load_employee_table(data){
        const $empTbl = $('#table_employee');
        if ($empTbl.hasClass('dataTable')){
            $empTbl.DataTable().clear().rows.data(data).draw()
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
                        data: "code",
                        render: (row) =>{
                            return row
                        }
                    },
                    {
                        data: 'id',
                        render: (row, index, data) => {
                            let txt = `<div class="form-check">` +
                                `<input type="checkbox" id="radio_${data.title}" class="form-check-input" value="${data.id}">` +
                                `<label title="${data.title}" for="radio_${data.title}" class="form-check-label">` +
                                `${data.title}</label>`
                            return txt;
                        },
                    },
                    {
                        data: 'group',
                        render: (row) =>{
                            let txt = row?.title || '--'
                            return txt
                        }
                    }
                ],
            })
        }
    }

    get_employee(params){
        $.fn.callAjax2({
            url: $('#table_employee').attr('data-url'),
            method: 'get',
            isLoading: true,
            data: params
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
            }
        })
    }
}
$('document').ready(function(){
    const recipient = new popup_recipient();

    $('#modal-recipient').on('show.bs.modal', function(){
        const $tbGroup = $('#table_group')
        if (!$tbGroup.hasClass('dataTable')){
            recipient.init_group()
        }

        recipient.load_employee_table([])
    });


});