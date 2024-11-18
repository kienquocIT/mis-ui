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

function renderTemplateBank(state){
    if (!state.id) return state.text
    return $(
        `<p><span class="text-bold">${state?.data?.code}</span>&nbsp;|&nbsp;${state?.data?.title}</p>`
    )
}


class EmployeeHRMInit {
    static userSelectEle = $('#select-box-user');
    static empSelectEle = $('#select-box-employee');
    static ElmNationality = $('#employee-nationality');

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
                    $('#select-box-user').append(`<option value="${empl.user.id}">${empl.user.last_name + ' ' + empl.user.first_name}</option>`).trigger('change')
                else ElmUser.prop('selected', true).trigger('change')
            }
            else $(`#select-box-user`).val('').trigger('change')
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
            $(this).next().toggleClass("is-select")
        })
    }

    static loadDetail(){
        const $form = $('#frm_employee_hrm')
        $.fn.callAjax2({
            url: $form.attr('data-hrm-detail'),
            method: 'get',
            isLoading: true,
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                const employee = data.employee
                let middName = employee.last_name.split(" ")
                middName.shift()
                $form.append(`<input type="hidden" name="id" value="${data.id}">`)
                $('.switch-choice, .select-wrap').addClass('is-select')
                $('#select-box-employee').attr('data-onload', {...employee, selected: true}).append(`<option value="${employee.id}" selected>${employee.full_name}</option>`).trigger('change')
                $('#employee-first_name').val(employee.first_name);
                $('#employee-middle_name').val(middName.join(" "));
                $('#employee-last_name').val(employee.last_name.split(" ")[0]);
                $('#employee-date-joined')[0]._flatpickr.setDate(new Date(employee.date_joined))
                $('#employee-email').val(employee.email)
                $('#employee-phone').val(employee.phone)
                $('#employee-code').val(employee.code)

                if (data.employee.user?.id) {
                    $('#select-box-user').attr('data-onload', {...data.employee.user, selected: true})
                        .append(`<option value="${data.employee.user.id}" selected>${
                            data.employee.user.first_name + ' ' + data.employee.user.last_name}</option>`).trigger('change')
                }
                if (data?.['citizen_id'])
                    $('#employee-citizen_id').val(data['citizen_id'])
                if (data?.['date_of_issue'])
                    $('#employee-doi')[0]._flatpickr.setDate(new Date(data['date_of_issue']))
                if (data?.['place_of_issue'])
                    $('#place_of_issue').val(data['place_of_issue'])
                if (data.employee.dob)
                    $('#employee-dob')[0]._flatpickr.setDate(new Date(data.employee.dob))
                if (data?.['place_of_birth'])
                    $('#employee-pob').attr('data-onload', JSON.stringify(data?.['place_of_birth'])).append(
                        `<option value="${data?.['place_of_birth'].id}" selected>${data?.['place_of_birth'].title}</option>`
                    ).trigger('change')
                if (data['nationality'])
                    $('#employee-nationality').attr('data-onload', JSON.stringify(data['nationality'])).append(
                        `<option value="${data['nationality'].id}" selected>${data['nationality'].title}</option>`
                    ).trigger('change')
                if (data?.['place_of_origin'])
                    $('#employee-poo').attr('data-onload', JSON.stringify(data['place_of_origin'])).append(
                        `<option value="${data['place_of_origin'].id}" selected>${data['place_of_origin'].title}</option>`
                    ).trigger('change')
                $('#employee-ethnicity').val(data['ethnicity'])
                $('#employee-religion').val(data['religion'])
                $('#employee-gender').val(data['gender']).trigger('change')
                $('#employee-mstt').val(data['marital_status']).trigger('change')
                $('#employee-ban').val(data['bank_acc_no'])
                $('#employee-acc_name').val(data['acc_name'])
                $('#employee-bank_name').val(data['bank_name']).trigger('change')
                $('#employee-tax_code').val(data['tax_code'])
                $('#employee-permanent_address').val(data['permanent_address'])
                $('#employee-current_resident').val(data['current_resident'])
            }
        })
    }

    static loadBank(){
        $('#employee-bank_name').initSelect2({
            allowClear: true,
            templateResult: renderTemplateBank,
        })
    }
}
