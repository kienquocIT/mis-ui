$(document).ready(function(){

    // run date-pick
    $('.date-picker').daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        autoApply: true,
        locale: {
            format: 'DD/MM/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
    }).val("").trigger('change');

    // run select
    $('#selectEmployeeInherit, #select_project_owner').each(function(){
        $(this).initSelect2({
            templateResult: function (state) {
                let groupHTML = `<span class="badge badge-soft-primary">${state.data?.group?.title ? state.data.group.title : "_"}</span>`
                let activeHTML = state.data?.is_active === true ? `<span class="badge badge-success badge-indicator"></span>` : `<span class="badge badge-light badge-indicator"></span>`;
                return $(`<span>${state.text} ${activeHTML} ${groupHTML}</span>`);
            },
        })
    })
});