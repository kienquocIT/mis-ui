class popup_recipient {

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
                    if (state && data?.id && parseInt($('input[name="kind"]:checked').val()) === 1) {
                        let params = data?.id === 'all_com' ? {pageSize: -1} : {group_id: data.id};
                        _this.get_employee(params, is_all)
                    } else _this.load_employee_list([], is_all)
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

    run_popup() {
        this.load_group_list()
        this.init_date_exp()
    }

    constructor() {
        this.$form = $('#recipient_form');
    }
}

$('document').ready(function () {
    const recipient = new popup_recipient();
    recipient.run_popup()
});