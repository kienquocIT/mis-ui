$(document).ready(function(){

    // run date-pick
    $('.date-picker').each(function(){
        loadDate($(this))
    })

    // run select
    $('#select_project_pm').initSelect2({
        templateResult: function (state) {
            let groupHTML = `<span class="badge badge-soft-primary">${state.data?.group?.title ? state.data.group.title : "_"}</span>`
            let activeHTML = state.data?.is_active === true ? `<span class="badge badge-success badge-indicator"></span>` : `<span class="badge badge-light badge-indicator"></span>`;
            return $(`<span>${state.text} ${activeHTML} ${groupHTML}</span>`);
        },
    });
});