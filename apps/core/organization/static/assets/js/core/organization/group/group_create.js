$(document).ready(function () {
    // load group level list
    function loadGroupLevelList() {
        let ele = $('#select-box-group-level');
        let ele_ref_group_title = $('#reference-group-title');
        let ele_first_manager_system_title = $('#first-manager-system-title');
        let ele_second_manager_system_title = $('#second-manager-system-title');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('group_level_list') && Array.isArray(data.group_level_list)) {
                        data.group_level_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.level + `</option>`)
                            ele_ref_group_title.val(item.description)
                            ele_first_manager_system_title.val(item.first_manager_description)
                            ele_second_manager_system_title.val(item.second_manager_description)
                        })
                    }
                }
            }
        )
    }

    // load group list
    function loadGroupList() {
        let ele = $('#select-box-group');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('group_list') && Array.isArray(data.group_list)) {
                        data.group_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    // load first manager list
    function loadFirstManagerList() {
        let ele = $('#select-box-first-manager');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        data.employee_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                        })
                    }
                }
            }
        )
    }

    // load second manager list
    function loadSecondManagerList() {
        let ele = $('#select-box-second-manager');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        data.employee_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadDefaultData() {
        $("input[name='date_joined']").val(moment().format('DD-MM-YYYY'));

        loadGroupLevelList();
        loadGroupList();
        loadFirstManagerList();
        loadSecondManagerList();

        $('#input-avatar').on('change', function (ev) {
            let upload_img = $('#upload-area');
            upload_img.text("");
            upload_img.css('background-image', "url(" + URL.createObjectURL(this.files[0]) + ")");
        });
        $('#upload-area').click(function (e) {
            $('#input-avatar').click();
        });

        $('#languages').select2();
    }

    loadDefaultData();

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
    let frm = $('#frm_employee_create');
    frm.validate({
        errorElement: 'p',
        errorClass: 'is-invalid cl-red',
    })
    frm.submit(function (event) {
        let dataEmployee = setGroupEmployeeData()
        let frm = new SetupFormSubmit($(this));
        if (frm.dataForm && dataEmployee) {
            frm.dataForm['group_employee'] = dataEmployee
        }
        console.log(frm.dataUrl, frm.dataMethod, frm.dataForm,);
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            // $.fn.notifyPopup({description: "Group is being created"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 3000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyPopup({description: "Group create fail"}, 'failure')
                    }
                )
    });
});


/*Blog Init*/
"use strict";
$(function () {
    let config = {
        dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        ordering: false,
        columnDefs: [{
            "searchable": false, "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
        }],
        order: [2, 'asc'],
        language: {
            search: "",
            searchPlaceholder: "Search",
            info: "_START_ - _END_ of _TOTAL_",
            sLengthMenu: "View  _MENU_",
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '←'
            }
        },
        drawCallback: function () {
            $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
            feather.replace();
        },
        data: [],
        columns: [{
            'data': 'code', render: (data, type, row, meta) => {
                return String.format(`<b>{0}</b>`, data);
            }
        }, {
            'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('id') && row.hasOwnProperty('full_name')) {
                    return `<span id="${row.id}">` + row.full_name + `</span>`;
                }
                return '';
            }
        }, {
            'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('department') && typeof row.department === "object") {
                    return `<span class="badge badge-primary">` + row.department.name + `</span>`;
                }
                return '';
            }
        }, {
            'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('date_joined') && typeof row.date_joined === 'string') {
                    return new Date(row.date_joined).toDateString();
                }
                return '';
            }
        }, {
            'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('date_joined') && typeof row.date_joined === 'string') {
                    return new Date(row.date_joined).toDateString();
                }
                return '';
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                if (row.hasOwnProperty('is_active') && typeof row.is_active === 'boolean') {
                    if (row.is_active) {
                        return `<span class="badge badge-info badge-indicator badge-indicator-xl"></span>`;
                    } else {
                        return `<span class="badge badge-light badge-indicator badge-indicator-xl"></span>`;
                    }
                }
                return '';
            }
        }, {
            'render': () => {
                return '';
            }
        }]
    }

    function initDataTable(config) {
        /*DataTable Init*/
        let dtb = $('#datable_employee_list_popup');
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            /*Checkbox Add*/
            var tdCnt = 0;
            $('table tr').each(function () {
                $('<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select check-add-group-employee" id="chk_sel_' + tdCnt + '"><label class="form-check-label" for="chk_sel_' + tdCnt + '"></label></span>').appendTo($(this).find("td:last-child"));
                tdCnt++;
            });
            $(document).on('click', '.del-button', function () {
                targetDt.rows('.selected').remove().draw(false);
                return false;
            });
            $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div>');
            dtb.parent().addClass('table-responsive');


            /*Select all using checkbox*/
            var DT1 = dtb.DataTable();
            $(".check-select-all").on("click", function (e) {
                $('.check-select').attr('checked', true);
                if ($(this).is(":checked")) {
                    DT1.rows().select();
                    $('.check-select').prop('checked', true);
                } else {
                    DT1.rows().deselect();
                    $('.check-select').prop('checked', false);
                }
            });
            $(".check-select").on("click", function (e) {
                if ($(this).is(":checked")) {
                    $(this).closest('tr').addClass('selected');
                } else {
                    $(this).closest('tr').removeClass('selected');
                    $('.check-select-all').prop('checked', false);
                }
            });
        }
    }

    function loadDataTable() {
        let tb = $('#datable_employee_list_popup');
        $.fn.callAjax(tb.attr('data-url'), tb.attr('data-method')).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list')) config['data'] = data.employee_list;
                    initDataTable(config);
                }
            },
        )
    }

    loadDataTable();
});


// Action on add modal employee
$(document).on('click', '#button-add-group-employee', function () {
    tableGroupEmployeeAdd()
});


function tableGroupEmployeeAdd() {
    let tableApply = document.getElementById("datable_employee_list_popup");
    let tableRowLen = tableApply.tBodies[0].rows.length;
    for (let idx = 0; idx < tableRowLen; idx++) {
        let row = tableApply.rows[idx + 1]
        let childrenLength = row.children.length
        let trData = ``
        let trSTT = 0
        let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover group-employee-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#" data-in-modal="${(idx + 1)}"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
        let actionData = `<td>` + bt2 + bt3 + `</td>`;
        if (row.classList.contains('selected')) {
            for (let i = 1; i < (childrenLength - 4); i++) {
                let child = row.children[(i)]
                let childText = child.innerText
                let childID = child.firstChild.id
                if (childID) {
                    trData += `<td><span id="${childID}">${childText}</span></td>`;
                } else {
                    trData += `<td><span>${childText}</span></td>`;
                }
            }
            trSTT++
            $('#datable-group-employee-show tbody').append(`<tr>` + `<td><span>${trSTT}</span></td>` + trData + actionData + `</tr>`);
        }
    }
    return false;
}


// Action on delete row
$(document).on('click', '.group-employee-del-button', function (e) {
    // $(this).closest('tr').prev().remove();
    // $(this).closest('tr').next().remove();
    let currentRow = $(this).closest('tr')
    let idxInModal = Number($(this).attr('data-in-modal'))
    let tableModal = document.getElementById("datable_employee_list_popup");
    let rowInModal = tableModal.rows[idxInModal]
    currentRow.remove();
    rowInModal.classList.remove("selected");
    return false;
});


// Set employee data
function setGroupEmployeeData() {
    let tableGroupEmployee = document.getElementById("datable-group-employee-show");
    let tableLength = tableGroupEmployee.tBodies[0].rows.length;
    let dataGroupEmployee = []
    for (let idx = 0; idx < tableLength; idx++) {
        let row = tableGroupEmployee.rows[idx + 1]
        let childrenLength = row.children.length
        for (let i = 1; i < (childrenLength - 1); i++) {
            let child = row.children[(i)]
            let childID = child.firstChild.id
            if (childID) {
                dataGroupEmployee.push(childID)
            }
        }
    }
    return dataGroupEmployee
}
