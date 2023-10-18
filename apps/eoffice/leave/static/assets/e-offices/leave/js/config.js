$(document).ready(function(){
    // declare variable
    const configData = JSON.parse($('#data_config').text());
    const $tbELm = $('#leave_config_type_tb');
    const $tbELmYS = $('#year_senior_tb');
    const PAID_BY = JSON.parse($('#paid_by').text())
    const $trans = $('#trans-factory')
    const $urlElm = $('#url-factory')
    const $modal = $('#modal_leave_type')

    // form submit
    function leaveTypeSubmit(data={}){
        let url = $urlElm.attr('data-create')
        let method = 'post'
        const $form = $('#formLeaveType')
        if (data?.['type_id']){
            url = $urlElm.attr('data-detail').format_url_with_uuid(data.type_id)
            method = 'put'
        }
        let _form = new SetupFormSubmit($form);
        let formData = _form.dataForm
        if (!formData.is_check_expiration){
            formData.is_check_expiration = false
            formData.data_expired = 0
        }
        if (formData.no_of_paid) formData.no_of_paid = parseInt(formData.no_of_paid)
        else delete formData.no_of_paid

        const clone = $.extend({}, formData); // clone for update to table when user update purpose
        delete formData.is_lt_system
        delete formData.is_lt_edit

        if (formData.code === 'AN'){
            const temp = {
                leave_config: formData.leave_config,
                no_of_paid: parseInt(formData.no_of_paid)
            }
            formData = temp
        }
        else if (formData.code === 'ANPY'){
            const temp = {
                leave_config: formData.leave_config,
                prev_year: parseInt(formData.prev_year)
            }
            formData = temp
        }
        $.fn.callAjax2({
            'url': url,
            'method': method,
            'data': formData
        }).then(
            (resp) => {
                const res = $.fn.switcherResp(resp);
                if (res) {
                    $.fn.notifyB({description: res?.message || res?.detail}, 'success')
                    if (!data?.['type_id']) {
                        configData.leave_type.unshift(res)
                        $tbELm.DataTable().clear().rows.add(configData.leave_type).draw()
                    }
                    $modal.modal('hide')
                }
                if (data?.['type_id'] && clone?.type_idx){
                    delete clone.csrfmiddlewaretoken
                    clone.is_lt_edit = JSON.parse(clone.is_lt_edit)
                    clone.is_lt_system = JSON.parse(clone.is_lt_system)
                    clone.paid_by = parseInt(clone.paid_by)
                    $tbELm.DataTable().row(parseInt(clone.type_idx)).data(clone).draw()
                }
            },
            (err) => {
                $.fn.notifyB({description: err?.data?.errors}, 'failure')
            }
        )
    }

    function appendDataToForm(data){
        $('.an-type, .prev-type, .create-or-edit').addClass('hidden')
        if (data.code === 'AN'){
            $modal.find('.an-type').removeClass('hidden')
            $('#inputNoP').val(data.no_of_paid)
        }
        else if (data.code === 'ANPY'){
            $modal.find('.prev-type').removeClass('hidden')
            $('#inputNoM').val(data.prev_year).trigger('change')
        }
        else $modal.find('.create-or-edit').removeClass('hidden')

        $('#selectPaidBy').val(data.paid_by).trigger('change')
        $('#txtAreaRemark').val(data.remark)
        $('#inputBalanceControl').prop('checked', data.balance_control)
        if (data.balance_control)
            $('#inputExpired').removeClass('hidden')
        if (data.is_check_expiration){
            $('#inputExpired').prop('checked', data.is_check_expiration).closest('.form-check').removeClass('hidden')

        }
        else{
            $('#inputExpired').closest('.form-check').addClass('hidden')
        }
        $('[name="is_lt_system"]').val(data.is_lt_system)
        $('[name="is_lt_edit"]').val(data.is_lt_edit)
        $('[name="type_idx"]').val(data.idx)
        $('#type_id').val(data.id)
        $('#inputCode').val(data.code)
        $('#inputTitle').val(data.title)
    }

    function deleteLeaveType(typeRow, dataRow){
        const url = $urlElm.attr('data-detail').format_url_with_uuid(dataRow.id);
        DataTableAction.delete(url, {}, $('[name="csrfmiddlewaretoken"]').val(), typeRow)
    }

    // run table Leave Type
    $tbELm.DataTableDefault({
        paging: false,
        info: false,
        rowIdx: true,
        data: configData.leave_type,
        columns: [
            {
                targets: 0,
                defaultContent: ''
            },
            {
                data: 'code',
                render: (row, type, data) => {
                    return `<span>${row || '--'}</span>`
                }
            },
            {
                data: 'title',
                render: (row, type, data) => {
                    return `<span>${row || '--'}</span>`
                }
            },
            {
                data: 'paid_by',
                render: (row, type, data) => {
                    let txt = '--'
                    if (row > 0) txt = PAID_BY[row]
                    return `<span>${txt}</span>`
                }
            },
            {
                data: 'balance_control',
                render: (row, type, data) =>{
                    return `<span>${row ? $trans.attr('data-control-yes') : $trans.attr('data-control-no')}</span>`
                }
            },
            {
                targets: 5,
                render: (row, type, data, meta) =>{
                    const is_sys = data?.is_lt_system || false
                    const is_edit = data?.is_lt_edit || false
                    let temp = $(`${$('.group-btn-tb').html()}`)
                    if (is_sys) temp.find('.btn-remove-row').attr('disabled', true).addClass('disabled')
                    if (!is_edit) temp.find('.btn-edit-row').attr('disabled', true).addClass('disabled')
                    return temp.prop('outerHTML')
                }
            }
        ],
        rowCallback: (row, data, index)=>{
            $('.btn-edit-row:not([disabled])', row).off().on('click', function(e){
                $modal.modal('show')
                data.idx = index
                appendDataToForm(data)
            })
            $('.btn-remove-row:not([disabled])', row).off().on('click', function(e){
                deleteLeaveType(row, data)
            })
        },
    });

    // run table year seniority
    $tbELmYS.DataTableDefault({
        paging: false,
        info: false,
        rowIdx: true,
        data: configData.year_senior,
        columns: [
            {
                targets: 0,
                defaultContent: ''
            },
            {
                data: 'from_range',
                render: (row, type, data) => {
                    return `<span>${row || '--'}</span>`
                }
            },
            {
                data: 'to_range',
                render: (row, type, data) => {
                    return `<span>${row || '--'}</span>`
                }
            },
            {
                data: 'added',
                render: (row, type, data) => {
                    return `<span>${row || '--'}</span>`
                }
            },
        ],
    });

    // create new leave type
    $('.open-modal-btn').off().on('click', function(e){
        e.preventDefault();
        $('.an-type, .prev-type').addClass('hidden')
         $('.create-or-edit').removeClass('hidden')
        $modal.modal('show')
    })

    // save modal btn
    $('#save-type').off().on('click', function(){
        const typeID = $('#type_id').val()
        if (type_id) leaveTypeSubmit({'type_id': typeID})
        else leaveTypeSubmit()
    })

    $('#inputBalanceControl').on('change', function(){
        if ($(this).prop('checked'))
            $('#inputExpired').closest('.form-check').removeClass('hidden')
        else $('#inputExpired').closest('.form-check').addClass('hidden')
    })
    // valid AN number
    $('#inputNoP').on('blur', function(){
        let value = parseInt(this.value.replace('-', ''))
        if (!$.isNumeric(value) || value % 1 < 0){
            $(this).closest('.an-type').find('p').remove()
            $(this).closest('.an-type').append(`<p class="text-danger"><em>${$trans.attr('data-valid-an')}</em></p>`)
        }
        else $(this).closest('.an-type').find('p').remove()
        this.value = value
    })
    $('#selectPaidBy').initSelect2()
    $('.date-picker').daterangepicker({
        minYear: 1901,
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY'
        }
    });
    $('.date-picker').val(null).trigger('change');


    $('.nav-item a').on('click', function(){
        const href = $(this).attr('href')
        const $btn = $('.open-modal-btn button')
        if (href === '#leave_year_senior') $btn.addClass('hidden')
        else $btn.removeClass('hidden')
    })

    $('#modal_leave_type').on('hidden.bs.modal', function(e){
        $(this).find('form')[0].reset()
    })
});