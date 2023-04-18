$(function () {
    // declare main variable
    let $table = $('#table_workflow_list');
    let LISTURL = $table.attr('data-url');
    let _dataTable = $table.DataTableDefault({
        ajax: {
            url: LISTURL,
            type: "GET",
            dataSrc: 'data.workflow_list',
            data: function (params) {
                params['is_ajax'] = true;
                return params
            },
            error: function (jqXHR) {
                $table.find('.dataTables_empty').text(jqXHR.responseJSON.data.errors)
            }
        },
        columns: [
            {
                targets: 0,
                width: "40%",
                render: (row, type, data) => {
                    return `<div class="d-flex align-items-center"><i class="fa font-4 fa-chevron-circle-down mr-3"></i>`
                        + `<span>${data.title}</span></div>`

                }
            },
            {
                targets: 1,
                width: "25%",
                render: (row, type, data) => {
                    let mode = 1
                    let sty_mode = {
                        0: 'danger',
                        1: 'success',
                        2: 'warning',
                    }
                    let txt_mode = {
                        0: $('.wf-mode a:nth-child(1)').text(),
                        1: $('.wf-mode a:nth-child(2)').text(),
                        2: $('.wf-mode a:nth-child(3)').text(),
                    }

                    return `<div class="d-flex justify-content-between align-items-center"><button type="button" `
                        + `class="btn btn-soft-${sty_mode[mode]}">${txt_mode[mode]}</button>`
                        + `${$('.dropdown-lv-1').html()}</div>`

                }
            },
            {
                targets: 2,
                width: "10%",
                class: 'text-center',
                render: (row, type, data) => {
                    data.error = 1;
                    let error_map = {
                        0: 'danger',
                        1: 'success',
                    };
                    let temp = data.error === 0 ? error_map[1] : error_map[0];
                    return `<button type="button" class="btn btn-soft-${temp}">${data.error}</button>`;
                }
            },
            {
                targets: 3,
                width: "10%",
                class: 'text-center',
                render: (row, type, data) => {
                    let select = jQuery('<select>');
                    select.addClass('dropdown-select_two')
                    select.attr('data-param', JSON.stringify({application: '50348927-2c4f-4023-b638-445469c66953'}))
                    // {application: data.application}
                    return `<div class="d-flex justify-content-between align-items-center"><span>${data.wf_current}</span>`
                        + `<div class="dropdown custom-dropdown-tb-2"><i class="fa fa-caret-down font-6 dropdown-toggle"`
                        + `data-bs-toggle="dropdown"></i>`
                        + `<div class="dropdown-menu wf-mode">${select}</div></div></div>`
                }
            },
        ]
    }, false);
    // end setup table

    $('.custom-dropdown-tb i:after').hide();
});
